"""RAG pipeline module.

Orchestrates retrieval, prompt construction, and Mistral-7B generation
via Ollama for office-related questions.
"""

import requests

from config import settings
from vector_store import VectorStore
from guardrails import format_guardrail_refusal, validate_response, REFUSAL_NO_CONTEXT


SYSTEM_PROMPT = """\
You are an Office Information Assistant specialized in answering questions ONLY about company office operations, policies, facilities, and documentation. Your knowledge is strictly limited to the provided context from office documents.

# GUARDRAILS & BOUNDARIES:
1. ONLY answer questions related to:
   - Office policies, procedures, and guidelines
   - Facility information (meeting rooms, equipment, amenities)
   - Employee resources and office services
   - Documented office protocols and standards
   - Company-specific office operations

2. STRICTLY REFUSE to answer questions about:
   - Personal matters unrelated to office operations
   - Technical IT support beyond basic office equipment
   - Financial, legal, or HR matters unless specifically in office context
   - External topics, news, or unrelated subjects
   - Speculative or hypothetical scenarios outside office scope

# RESPONSE PROTOCOL:
- Use ONLY information from the provided context
- If context doesn't contain the answer, say: "I don't have information about this in the office documentation."
- If the question is outside office scope, say: "I can only answer questions related to office operations and policies."
- Never speculate or use external knowledge
- Be concise and reference specific office documents when possible
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
    """Build the message list for Ollama's chat API.

    Args:
        context: Formatted context from retrieved documents.
        question: The user's question.

    Returns:
        List of message dicts for the Ollama chat endpoint.
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


def call_ollama(messages: list[dict]) -> str:
    """Send a chat completion request to the Ollama API.

    Args:
        messages: List of message dicts with role and content.

    Returns:
        The assistant's response text.

    Raises:
        ConnectionError: If Ollama is not reachable.
        RuntimeError: If the API returns an error.
    """
    url = f"{settings.ollama_base_url}/api/chat"
    payload = {
        "model": settings.ollama_model,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": settings.temperature,
        },
    }

    try:
        resp = requests.post(url, json=payload, timeout=settings.ollama_timeout)
    except requests.ConnectionError:
        raise ConnectionError(
            f"Cannot connect to Ollama at {settings.ollama_base_url}. "
            "Make sure Ollama is running (ollama serve)."
        )

    if resp.status_code != 200:
        raise RuntimeError(
            f"Ollama returned status {resp.status_code}: {resp.text}"
        )

    data = resp.json()
    return data.get("message", {}).get("content", "").strip()


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
          4. Generate response via Ollama/Mistral
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
        raw_response = call_ollama(messages)

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
