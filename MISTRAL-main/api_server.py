"""FastAPI server for the Office RAG system.

Usage:
    python api_server.py
    # or
    uvicorn api_server:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from config import settings
from rag_pipeline import RAGPipeline
from vector_store import VectorStore

app = FastAPI(
    title="Office RAG API",
    description="Retrieval-Augmented Generation API for office document queries",
    version="1.0.0",
)

# Initialize pipeline at startup
_pipeline: RAGPipeline | None = None


def get_pipeline() -> RAGPipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = RAGPipeline()
    return _pipeline


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="The question to ask")
    company_terms: list[str] | None = Field(
        default=None,
        description="Optional company-specific terms for guardrail matching",
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
        result = pipeline.query(
            question=request.question,
            company_terms=request.company_terms,
        )
        return QueryResponse(**result)
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))


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
