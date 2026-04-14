"""Embedding and ChromaDB vector store module.

Handles document embedding, storage, and retrieval using
sentence-transformers and ChromaDB with cross-encoder re-ranking.
"""

import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer, CrossEncoder
from langchain_core.documents import Document

from config import settings


class VectorStore:
    """Manages document embeddings and similarity search via ChromaDB with re-ranking."""

    def __init__(
        self,
        persist_dir: str | None = None,
        collection_name: str | None = None,
        embedding_model: str | None = None,
        reranker_model: str | None = None,
    ):
        self.persist_dir = persist_dir or settings.chroma_persist_dir
        self.collection_name = collection_name or settings.chroma_collection_name
        self.embedding_model_name = embedding_model or settings.embedding_model
        self.reranker_model_name = reranker_model or settings.reranker_model

        self._embedder = SentenceTransformer(self.embedding_model_name)
        self._reranker = None  # Lazy load re-ranker
        self._client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self._collection = self._client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def _get_reranker(self) -> CrossEncoder:
        """Lazy load the cross-encoder re-ranker."""
        if self._reranker is None:
            self._reranker = CrossEncoder(self.reranker_model_name)
        return self._reranker

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
        rerank: bool = False,
    ) -> list[dict]:
        """Search for documents similar to the query with optional re-ranking.

        Args:
            query: The search query.
            top_k: Number of results to return.
            rerank: Whether to apply cross-encoder re-ranking (disabled by default).

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

        # Apply cross-encoder re-ranking if explicitly enabled
        if rerank and len(output) > 1:
            try:
                output = self._rerank_results(query, output, settings.final_top_k)
            except Exception as e:
                print(f"Warning: Re-ranking failed, using original results: {e}")

        return output

    def _rerank_results(
        self,
        query: str,
        candidates: list[dict],
        top_k: int,
    ) -> list[dict]:
        """Re-rank candidates using cross-encoder.

        Args:
            query: The original query.
            candidates: List of candidate documents.
            top_k: Number of top results to return.

        Returns:
            Re-ranked list of documents.
        """
        try:
            reranker = self._get_reranker()

            # Prepare pairs for cross-encoder
            pairs = [(query, c["text"]) for c in candidates]

            # Get relevance scores
            scores = reranker.predict(pairs)

            # Combine candidates with scores and sort
            scored_candidates = list(zip(candidates, scores))
            scored_candidates.sort(key=lambda x: x[1], reverse=True)

            # Return top_k results with updated distances (1 - score for consistency)
            reranked = []
            for candidate, score in scored_candidates[:top_k]:
                # Convert score to distance (lower is better, like cosine distance)
                candidate["distance"] = 1.0 - float(score)
                reranked.append(candidate)

            return reranked
        except Exception as e:
            # Fallback to original order if re-ranking fails
            print(f"Re-ranking failed: {e}, using original order")
            return candidates[:top_k]

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
