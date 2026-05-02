"""Test specific questions to see what context is retrieved."""
import sys
sys.path.insert(0, '.')

from vector_store import VectorStore
from rag_pipeline import rewrite_query_for_retrieval

# Initialize vector store
store = VectorStore()

# Test questions that had low faithfulness
test_questions = [
    "How do I file a trademark application?",
    "What is the difference between a patent and a copyright?",
    "What makes an invention patentable according to Philippine law?",
    "Who is the director of TPCO?",
    "How can I book facilities or equipment at USTP?",
]

for question in test_questions:
    print(f"\n{'='*80}")
    print(f"QUESTION: {question}")
    print(f"{'='*80}")
    
    # Rewrite query
    rewritten = rewrite_query_for_retrieval(question)
    print(f"Rewritten query: {rewritten}")
    
    # Search
    enhanced_query = f"office information: {rewritten}"
    chunks = store.search(enhanced_query)
    
    print(f"\nRetrieved {len(chunks)} chunks:")
    for i, chunk in enumerate(chunks[:3], 1):  # Show top 3
        print(f"\n--- Chunk {i} (distance: {chunk['distance']:.4f}) ---")
        print(f"Source: {chunk['metadata'].get('filename', 'Unknown')}")
        print(f"Text: {chunk['text'][:300]}...")
    
    print(f"\n")
