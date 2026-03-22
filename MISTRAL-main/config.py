"""Configuration for the Office RAG application."""

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # Ollama settings
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "mistral"
    ollama_timeout: int = 120

    # Embedding settings
    embedding_model: str = "all-MiniLM-L6-v2"

    # ChromaDB settings
    chroma_persist_dir: str = str(Path(__file__).parent / "chroma_db")
    chroma_collection_name: str = "office_documents"

    # Chunking settings
    chunk_size: int = 512
    chunk_overlap: int = 50

    # Retrieval settings
    retrieval_top_k: int = 5
    relevance_score_threshold: float = 0.3

    # Document directory
    documents_dir: str = str(Path(__file__).parent / "documents")

    # API settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    # Generation settings
    max_context_tokens: int = 1500
    temperature: float = 0.1

    class Config:
        env_file = ".env"
        env_prefix = "OFFICE_RAG_"


settings = Settings()
