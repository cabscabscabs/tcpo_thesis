"""RAG pipeline module.

Orchestrates retrieval, prompt construction, and Mistral generation
via Mistral Cloud API for office-related questions.
"""

from mistralai.client import Mistral

from config import settings
from vector_store import VectorStore
from guardrails import format_guardrail_refusal, validate_response, REFUSAL_NO_CONTEXT, BLOCKED_TOPICS


SYSTEM_PROMPT = """\
You are a USTP TPCO (Technology Transfer Office) Information Assistant. You help users with:
1. Intellectual property, patents, and technology transfer questions
2. Website navigation and finding information on the USTP TPCO website

# CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE:

## 1. CONTEXT USAGE (MOST IMPORTANT):
- You are provided with CONTEXT FROM OFFICE DOCUMENTS above
- You MUST base your answer ENTIRELY on the provided context
- If the context contains the answer, use it and cite the source
- If the context does NOT contain the answer, say: "I don't have that specific information in my knowledge base. Please contact TPCO directly for assistance."
- NEVER make up information or use outside knowledge
- NEVER hallucinate details not present in the context

## 2. SOURCE CITATION:
- When you use information from the context, cite the source like: [Source: filename.pdf]
- Place citations immediately after the relevant information
- Example: "To file a patent, you need Form 100 [Source: Patent_Procedures.pdf]"

## 3. WEBSITE NAVIGATION GUIDE (with links):
When users ask about navigating the website or where to find something, ALWAYS include the relevant link from below.

Pages:
- Home page: /
- Our IP (IP Portfolio) - browse available technologies and patents: /ip-portfolio
- Services - view TPCO services like patent assistance, technology transfer: /services
- Services > Success Stories - real results from technology transfer partnerships: /services#success-stories
- Service Request - submit a service request: /service-request
- Resources page: /resources
- Latest News - updates and announcements: /latest-news
- About - learn about USTP TPCO, meet the team: /about
- Contact Us - contact details and inquiry form: /contact
- Events - upcoming events and seminars: /events

Resources page has tabs for specific content. Use these links:
- Templates (downloadable forms for trademark, patent, copyright, etc.): /resources?tab=templates
- IP 101 Tutorials (educational materials about IP): /resources?tab=tutorials
- SSF Booking (facility and equipment booking): /resources?tab=facilities
- Guidelines (research guidelines, best practices, IP procedures): /resources?tab=guidelines

## 4. LINK USAGE RULES:
- When a user asks about forms, templates, or downloadable documents (e.g., "How to file a trademark", "Where can I download patent forms"), include this link: /resources?tab=templates
- When a user asks about research guidelines, best practices, or IP procedures guides, include this link: /resources?tab=guidelines
- When a user asks about tutorials or learning about IP basics, include this link: /resources?tab=tutorials
- When a user asks about booking facilities or equipment, include this link: /resources?tab=facilities
- When a user asks about contact information or how to reach TPCO, include this link: /contact
- When a user asks about services offered by TPCO, include this link: /services
- When a user asks about success stories, partnerships results, or technology transfer outcomes, include this link: /services#success-stories
- When a user asks about patents, IP portfolio, available technologies, or innovations, include this link: /ip-portfolio
- When your answer discusses intellectual property, patents, technologies, or innovations, ALWAYS append a helpful link to the IP Portfolio: [IP Portfolio page](/ip-portfolio)
- When a user asks about news or announcements, include this link: /latest-news
- When a user asks about who TPCO is or the team, include this link: /about
- When a user asks about events or seminars, include this link: /events
- Format links as: [Link Text](url) — for example: [Templates page](/resources?tab=templates)

## 5. GUARDRAILS & BOUNDARIES:
1. Answer questions about:
   - Patent applications, procedures, and requirements
   - Intellectual property (IP) protection and management
   - Technology transfer and commercialization
   - Copyright and trademark registration
   - USTP TPCO services and processes
   - IPOPHL forms and procedures
   - Website navigation and where to find information

2. STRICTLY REFUSE to answer questions about:
   - Personal matters unrelated to IP/TPCO operations
   - Technical IT support
   - Financial, legal, or HR matters unless specifically in IP context
   - External topics, news, or unrelated subjects
   - Speculative or hypothetical scenarios outside IP scope

## 6. RESPONSE PROTOCOL:
- Use information from the provided context for IP/patent questions
- ALWAYS cite your sources when using context information
- For navigation questions, guide users to the appropriate page/section and ALWAYS include the link
- If the user greets you, respond warmly and ask how you can help
- If context doesn't contain the answer, say you don't have that information and suggest contacting TPCO
- Be concise and helpful
- DO NOT use Markdown formatting for emphasis (no **, *, #). But DO use [Link Text](url) for navigation links.
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


def build_prompt(context: str, question: str, conversation_history: list[dict] | None = None) -> list[dict]:
    """Build the message list for Mistral Cloud API.

    Args:
        context: Formatted context from retrieved documents.
        question: The user's question.
        conversation_history: Optional list of previous conversation messages.

    Returns:
        List of message dicts for the Mistral chat endpoint.
    """
    user_content = f"""# CONTEXT FROM OFFICE DOCUMENTS:
{context}

# QUESTION:
{question}

INSTRUCTIONS:
1. Answer the question using ONLY the context provided above.
2. Cite your sources using [Source: filename] format.
3. If the answer is not in the context, say exactly: "I don't have that specific information in my knowledge base. Please contact TPCO directly for assistance."
4. Do not use any outside knowledge.

YOUR ANSWER:"""

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Inject conversation history between system prompt and current question
    if conversation_history:
        # Limit to last 10 messages to avoid token overflow
        recent_history = conversation_history[-10:]
        for msg in recent_history:
            if msg["role"] in ("user", "assistant"):
                messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": user_content})

    return messages


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
        conversation_history: list[dict] | None = None,
    ) -> dict:
        """Process a user question through the full RAG pipeline.

        Steps:
          1. Guardrail check
          2. Retrieve relevant document chunks
          3. Build context and prompt (with conversation history)
          4. Generate response via Mistral Cloud API
          5. Validate response

        Args:
            question: The user's question.
            company_terms: Optional company-specific terms for guardrail.
            conversation_history: Optional list of previous conversation messages.

        Returns:
            Dict with keys: answer, sources, was_filtered.
        """
        has_history = conversation_history and len(conversation_history) > 0

        # Step 1: Guardrail check
        # If there's conversation history, the user is continuing an already-validated
        # conversation, so we skip the guardrail for short follow-up messages.
        if has_history:
            # Still block explicitly off-topic questions even in follow-ups
            question_lower = question.lower()
            is_blocked = any(t in question_lower for t in BLOCKED_TOPICS)
            if is_blocked:
                refusal = format_guardrail_refusal(question)
                if refusal:
                    return {
                        "answer": refusal,
                        "sources": [],
                        "was_filtered": True,
                    }
        else:
            refusal = format_guardrail_refusal(question)
            if refusal:
                return {
                    "answer": refusal,
                    "sources": [],
                    "was_filtered": True,
                }

        # Step 2: Retrieve relevant chunks
        # For follow-up questions, enrich the search query with context from the
        # last user message so the vector search finds relevant documents.
        if has_history:
            last_user_msgs = [m["content"] for m in conversation_history if m["role"] == "user"]
            if last_user_msgs:
                last_topic = last_user_msgs[-1]
                # Combine the previous topic with the current follow-up for better retrieval
                enhanced_query = f"office information: {last_topic} {question}"
            else:
                enhanced_query = f"office information: {question}"
        else:
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
        messages = build_prompt(context, question, conversation_history)

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
