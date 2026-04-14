"""FastAPI server for the Office RAG system.

Usage:
    python api_server.py
    # or
    uvicorn api_server:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import settings
from rag_pipeline import RAGPipeline
from vector_store import VectorStore

app = FastAPI(
    title="Office RAG API",
    description="Retrieval-Augmented Generation API for office document queries",
    version="1.0.0",
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize pipeline at startup
_pipeline: RAGPipeline | None = None


def get_pipeline() -> RAGPipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = RAGPipeline()
    return _pipeline


class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="The question to ask")
    company_terms: list[str] | None = Field(
        default=None,
        description="Optional company-specific terms for guardrail matching",
    )
    conversation_history: list[ChatMessage] | None = Field(
        default=None,
        description="Optional conversation history for context continuity",
    )


class QueryResponse(BaseModel):
    answer: str
    sources: list[str]
    was_filtered: bool


class StatsResponse(BaseModel):
    document_count: int
    collection_name: str


@app.post("/query", response_model=QueryResponse)
def query(request: QueryRequest):
    """Ask a question about office operations and policies."""
    pipeline = get_pipeline()
    try:
        # Convert conversation history to list of dicts if provided
        history = None
        if request.conversation_history:
            history = [{"role": m.role, "content": m.content} for m in request.conversation_history]

        result = pipeline.query(
            question=request.question,
            company_terms=request.company_terms,
            conversation_history=history,
        )
        return QueryResponse(**result)
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.get("/stats", response_model=StatsResponse)
def stats():
    """Get information about the vector store."""
    pipeline = get_pipeline()
    return StatsResponse(
        document_count=pipeline.vector_store.count(),
        collection_name=settings.chroma_collection_name,
    )


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api_server:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=False,
    )
