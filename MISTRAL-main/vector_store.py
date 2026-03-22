"""Embedding and ChromaDB vector store module.

Handles document embedding, storage, and retrieval using
sentence-transformers and ChromaDB.
"""

import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer
from langchain.schema import Document

from config import settings


class VectorStore:
    """Manages document embeddings and similarity search via ChromaDB."""

    def __init__(
        self,
        persist_dir: str | None = None,
        collection_name: str | None = None,
        embedding_model: str | None = None,
    ):
        self.persist_dir = persist_dir or settings.chroma_persist_dir
        self.collection_name = collection_name or settings.chroma_collection_name
        self.embedding_model_name = embedding_model or settings.embedding_model

        self._embedder = SentenceTransformer(self.embedding_model_name)
        self._client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self._collection = self._client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def add_documents(self, documents: list[Document]) -> int:
        """Embed and store a list of LangChain Document objects.

        Returns the number of documents added.
        """
        if not documents:
            return 0

        texts = [doc.page_content for doc in documents]
        metadatas = [doc.metadata for doc in documents]
        ids = [f"doc_{i}_{hash(text)}" for i, text in enumerate(texts)]

        embeddings = self._embedder.encode(texts, show_progress_bar=True).tolist()

        # ChromaDB upsert handles duplicates gracefully
        batch_size = 500
        for start in range(0, len(texts), batch_size):
            end = start + batch_size
            self._collection.upsert(
                ids=ids[start:end],
                documents=texts[start:end],
                embeddings=embeddings[start:end],
                metadatas=metadatas[start:end],
            )

        return len(texts)

    def search(
        self,
        query: str,
        top_k: int | None = None,
    ) -> list[dict]:
        """Search for documents similar to the query.

        Returns a list of dicts with keys: text, metadata, distance.
        """
        top_k = top_k or settings.retrieval_top_k
        query_embedding = self._embedder.encode([query]).tolist()

        results = self._collection.query(
            query_embeddings=query_embedding,
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        output = []
        if results["documents"] and results["documents"][0]:
            for text, meta, dist in zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0],
            ):
                output.append({
                    "text": text,
                    "metadata": meta,
                    "distance": dist,
                })

        return output

    def count(self) -> int:
        """Return the number of documents in the collection."""
        return self._collection.count()

    def reset(self) -> None:
        """Delete and recreate the collection."""
        self._client.delete_collection(self.collection_name)
        self._collection = self._client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"},
        )
