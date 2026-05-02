"""Simple test to query RAG API directly for 5 questions and check responses."""
import requests
import json

rag_url = "http://localhost:8000"

test_questions = [
    "How do I file a trademark application?",
    "What makes an invention patentable according to Philippine law?",
    "Who is the director of TPCO?",
]

print("Testing RAG responses with updated grounding instruction...\n")

for question in test_questions:
    print(f"{'='*80}")
    print(f"Q: {question}")
    print(f"{'='*80}")
    
    response = requests.post(f"{rag_url}/query", json={"question": question})
    data = response.json()
    
    print(f"\nAnswer:\n{data['answer']}")
    print(f"\nSources: {data.get('sources', [])}")
    print(f"\n")
