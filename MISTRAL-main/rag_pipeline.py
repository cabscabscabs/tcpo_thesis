"""RAG pipeline module.

Orchestrates retrieval, prompt construction, and Mistral generation
via Mistral Cloud API for office-related questions.
"""

from mistralai.client import Mistral

from config import settings
from vector_store import VectorStore
from guardrails import format_guardrail_refusal, validate_response, REFUSAL_NO_CONTEXT


SYSTEM_PROMPT = """\
You are a USTP TPCO (Technology Transfer Office) Information Assistant specialized in answering questions ONLY about intellectual property, patents, technology transfer, and related documentation. Your knowledge is strictly limited to the provided context from USTP TPCO documents.

# GUARDRAILS & BOUNDARIES:
1. ONLY answer questions related to:
   - Patent applications, procedures, and requirements
   - Intellectual property (IP) protection and management
   - Technology transfer and commercialization
   - Copyright and trademark registration
   - USTP TPCO services and processes
   - IPOPHL forms and procedures

2. STRICTLY REFUSE to answer questions about:
   - Personal matters unrelated to IP/TPCO operations
   - Technical IT support
   - Financial, legal, or HR matters unless specifically in IP context
   - External topics, news, or unrelated subjects
   - Speculative or hypothetical scenarios outside IP scope

# RESPONSE PROTOCOL:
- Use ONLY information from the provided context
- If the user greets you (says "hello", "hi", etc.), respond warmly and ask how you can help with IP/patent questions
- If the user asks what you can do, explain that you can answer questions about patents, IP, and technology transfer
- If context doesn't contain the answer, say: "I don't have information about this in the documentation."
- If the question is outside IP/TPCO scope, say: "I can only answer questions related to intellectual property, patents, and technology transfer."
- Never speculate or use external knowledge
- Be concise and reference specific documents when possible
- DO NOT use Markdown formatting (no **, *, #, or bullet points). Use plain text only.
"""


def build_context(chunks: list[dict], max_tokens: int | None = None) -> str:
    """Format retrieved chunks into a context string for the prompt.

    Args:
        chunks: List of dicts with keys: text, metadata, distance.
        max_tokens: Approximate character limit for the context block.

    Returns:
        Formatted context string.
    """
    max_tokens = max_tokens or settings.max_context_tokens
    context_parts = []
    total_len = 0

    for i, chunk in enumerate(chunks, 1):
        source = chunk["metadata"].get("filename", "Unknown")
        text = chunk["text"]

        entry = f"[Source: {source}]\n{text}"
        if total_len + len(entry) > max_tokens * 4:  # rough char-to-token ratio
            break
        context_parts.append(entry)
        total_len += len(entry)

    return "\n\n---\n\n".join(context_parts)


def build_prompt(context: str, question: str) -> list[dict]:
    """Build the message list for Mistral Cloud API.

    Args:
        context: Formatted context from retrieved documents.
        question: The user's question.

    Returns:
        List of message dicts for the Mistral chat endpoint.
    """
    user_content = f"""# CONTEXT FROM OFFICE DOCUMENTS:
{context}

# QUESTION:
{question}

Answer the question using ONLY the context above. If the answer is not in the context, say you don't have that information."""

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]


def call_mistral_cloud(messages: list[dict]) -> str:
    """Send a chat completion request to the Mistral Cloud API.

    Args:
        messages: List of message dicts with role and content.

    Returns:
        The assistant's response text.

    Raises:
        ValueError: If API key is not configured.
        RuntimeError: If the API returns an error.
    """
    if not settings.mistral_api_key:
        raise ValueError(
            "MISTRAL_API_KEY is not set. Please set it in config.py or as an environment variable."
        )

    client = Mistral(api_key=settings.mistral_api_key)

    try:
        response = client.chat.complete(
            model=settings.mistral_model,
            messages=messages,
            temperature=settings.temperature,
        )
    except Exception as e:
        raise RuntimeError(f"Mistral API error: {str(e)}")

    return response.choices[0].message.content.strip()


class RAGPipeline:
    """End-to-end RAG pipeline for office questions."""

    def __init__(self, vector_store: VectorStore | None = None):
        self.vector_store = vector_store or VectorStore()

    def query(
        self,
        question: str,
        company_terms: list[str] | None = None,
    ) -> dict:
        """Process a user question through the full RAG pipeline.

        Steps:
          1. Guardrail check
          2. Retrieve relevant document chunks
          3. Build context and prompt
          4. Generate response via Mistral Cloud API
          5. Validate response

        Args:
            question: The user's question.
            company_terms: Optional company-specific terms for guardrail.

        Returns:
            Dict with keys: answer, sources, was_filtered.
        """
        # Step 1: Guardrail check
        refusal = format_guardrail_refusal(question)
        if refusal:
            return {
                "answer": refusal,
                "sources": [],
                "was_filtered": True,
            }

        # Step 2: Retrieve relevant chunks
        enhanced_query = f"office information: {question}"
        chunks = self.vector_store.search(enhanced_query)

        # Filter by relevance threshold (cosine distance; lower = more similar)
        filtered_chunks = [
            c for c in chunks
            if c["distance"] <= (1 - settings.relevance_score_threshold)
        ]

        if not filtered_chunks:
            return {
                "answer": REFUSAL_NO_CONTEXT,
                "sources": [],
                "was_filtered": False,
            }

        # Step 3: Build context and prompt
        context = build_context(filtered_chunks)
        messages = build_prompt(context, question)

        # Step 4: Generate response
        raw_response = call_mistral_cloud(messages)

        # Step 5: Validate response
        final_response = validate_response(raw_response, filtered_chunks)

        sources = [
            c["metadata"].get("filename", "Unknown")
            for c in filtered_chunks
        ]
        # Deduplicate while preserving order
        seen = set()
        unique_sources = []
        for s in sources:
            if s not in seen:
                seen.add(s)
                unique_sources.append(s)

        return {
            "answer": final_response,
            "sources": unique_sources,
            "was_filtered": False,
        }
