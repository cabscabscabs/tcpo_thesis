"""Guardrails module for the Office RAG system.

Validates that user questions are office-related and that generated
responses stay within the office domain.
"""

import re

# Core office-related keyword categories
OFFICE_KEYWORDS = {
    # Facilities & spaces
    "office", "meeting room", "conference room", "facility", "workspace",
    "desk", "parking", "cafeteria", "kitchen", "lobby", "reception",
    "floor", "building", "elevator", "restroom", "break room",
    # Policies & procedures
    "policy", "procedure", "guideline", "protocol", "standard",
    "regulation", "compliance", "rule", "handbook", "manual",
    # Office operations
    "reservation", "booking", "schedule", "calendar", "appointment",
    "visitor", "access", "badge", "keycard", "security",
    # Equipment & supplies
    "equipment", "supply", "supplies", "printer", "copier", "scanner",
    "projector", "whiteboard", "stationery", "furniture",
    # Documents & forms
    "document", "form", "template", "report", "memo", "notice",
    "announcement", "newsletter",
    # Services & resources
    "amenity", "amenities", "service", "resource", "mail", "mailroom",
    "cleaning", "maintenance", "hvac", "air conditioning", "heating",
    # Employee office topics
    "dress code", "work hours", "working hours", "remote work",
    "hybrid", "attendance", "leave", "holiday", "vacation",
    "onboarding", "orientation",
    # Safety & emergency
    "fire drill", "emergency", "evacuation", "first aid", "safety",
}

# Topics that should be explicitly rejected
BLOCKED_TOPICS = {
    "stock price", "investment", "crypto", "bitcoin",
    "dating", "relationship",
    "recipe", "cooking",
    "weather forecast",
    "sports score", "game score",
    "movie", "tv show", "netflix",
    "politics", "election", "vote",
    "religion",
}

# Refusal messages
REFUSAL_OUT_OF_SCOPE = (
    "I can only answer questions related to office operations and policies. "
    "Please ask me about office facilities, procedures, equipment, or related topics."
)

REFUSAL_NO_CONTEXT = (
    "I don't have information about this in the current office documentation. "
    "The topic may not be covered in the documents that have been loaded."
)


def is_office_related(question: str, company_terms: list[str] | None = None) -> bool:
    """Check whether a question is related to office operations.

    Uses keyword matching against a curated set of office-related terms.
    Also checks for explicit blocked topics.

    Args:
        question: The user's question text.
        company_terms: Optional list of company-specific terms to accept.

    Returns:
        True if the question appears office-related.
    """
    question_lower = question.lower()

    # Check for explicitly blocked topics first
    for blocked in BLOCKED_TOPICS:
        if blocked in question_lower:
            return False

    # Check for office keywords
    for keyword in OFFICE_KEYWORDS:
        if keyword in question_lower:
            return True

    # Check company-specific terms
    if company_terms:
        for term in company_terms:
            if term.lower() in question_lower:
                return True

    # If no keywords matched, use a more lenient check for questions
    # that reference "the" + common office nouns (e.g., "the room", "the building")
    office_noun_pattern = r"\b(the|our|my|this)\s+(office|room|building|floor|team|department|company)\b"
    if re.search(office_noun_pattern, question_lower):
        return True

    return False


def validate_response(response: str, context_chunks: list[dict]) -> str:
    """Validate that the generated response is grounded in the provided context.

    If the response contains common hallucination markers or the context
    was empty, return a refusal message instead.

    Args:
        response: The generated response text.
        context_chunks: The retrieved context chunks used for generation.

    Returns:
        The original response if valid, or a refusal message.
    """
    if not context_chunks:
        return REFUSAL_NO_CONTEXT

    # Check for common hallucination / refusal indicators from the model
    hallucination_markers = [
        "i don't have access",
        "as an ai",
        "i cannot browse",
        "i'm not able to",
        "my training data",
    ]
    response_lower = response.lower()
    for marker in hallucination_markers:
        if marker in response_lower:
            return REFUSAL_NO_CONTEXT

    return response


def format_guardrail_refusal(question: str) -> str | None:
    """Return a refusal message if the question fails guardrail checks.

    Returns None if the question passes.
    """
    if not is_office_related(question):
        return REFUSAL_OUT_OF_SCOPE
    return None
