"""Document ingestion CLI.

Usage:
    python ingest.py                  # Ingest from default documents/ directory
    python ingest.py /path/to/docs    # Ingest from a custom directory
    python ingest.py --reset          # Clear the vector store before ingesting
"""

import sys
from pathlib import Path

from config import settings
from document_loader import load_and_chunk_documents
from vector_store import VectorStore


def main():
    docs_dir = settings.documents_dir
    reset = False

    args = sys.argv[1:]
    for arg in args:
        if arg == "--reset":
            reset = True
        elif not arg.startswith("-"):
            docs_dir = arg

    docs_path = Path(docs_dir)
    if not docs_path.exists():
        print(f"Error: Documents directory not found: {docs_dir}")
        sys.exit(1)

    print(f"Documents directory: {docs_path.resolve()}")
    print(f"Chunk size: {settings.chunk_size}, Overlap: {settings.chunk_overlap}")
    print()

    # Load and chunk documents
    print("Loading and chunking documents...")
    chunks = load_and_chunk_documents(
        str(docs_path),
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
    )

    if not chunks:
        print("No documents found or all documents were empty.")
        print(f"Place PDF, DOCX, or TXT files in: {docs_path.resolve()}")
        sys.exit(1)

    print(f"\nTotal chunks created: {len(chunks)}")

    # Initialize vector store
    print("\nInitializing vector store...")
    store = VectorStore()

    if reset:
        print("Resetting existing collection...")
        store.reset()

    # Add documents to the vector store
    print("Embedding and storing chunks (this may take a moment)...")
    count = store.add_documents(chunks)
    print(f"\nDone! {count} chunks stored in ChromaDB.")
    print(f"Total documents in store: {store.count()}")


if __name__ == "__main__":
    main()
