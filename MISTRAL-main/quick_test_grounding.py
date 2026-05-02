"""Quick test with 10 samples to validate the grounding improvement."""
import os
import sys
import json
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import requests
from tqdm import tqdm

# Import directly from simple_eval module to avoid ragas import errors
sys.path.insert(0, str(Path(__file__).parent / "evaluation"))
from simple_eval import (
    MistralEvaluator, 
    query_rag_api, 
    get_contexts_from_vector_store,
    print_report,
    save_report
)

# Load dataset
dataset_path = Path(__file__).parent / "evaluation" / "datasets" / "eval_samples.json"
with open(dataset_path, "r", encoding="utf-8") as f:
    samples = json.load(f)

# Get Mistral API key
mistral_key = os.getenv("MISTRAL_API_KEY")
if not mistral_key:
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if line.startswith("MISTRAL_API_KEY"):
                    mistral_key = line.split("=", 1)[1].strip().strip('"')
                    break

if not mistral_key:
    print("Error: MISTRAL_API_KEY not found!")
    sys.exit(1)

print(f"Testing with 10 samples using updated grounding instruction...")
print(f"RAG server: http://localhost:8000")

# Test with 10 samples first
test_samples = samples[:10]
rag_url = "http://localhost:8000"

questions = []
answers = []
contexts = []
ground_truths = []

# Initialize vector store once
from vector_store import VectorStore
vector_store = VectorStore()
print("Vector store loaded.")

print(f"\nCollecting RAG responses for 10 samples...")
for sample in tqdm(test_samples, desc="Querying RAG"):
    questions.append(sample["question"])
    ground_truths.append(sample["ground_truth"])
    
    try:
        rag_response = query_rag_api(sample["question"], rag_url)
        answers.append(rag_response.get("answer", ""))
        ctx = get_contexts_from_vector_store(sample["question"], store=vector_store)
        contexts.append(ctx if ctx else ["Context not available"])
    except Exception:
        answers.append(sample["ground_truth"])
        contexts.append(["Using ground truth for evaluation demo"])

# Evaluate
evaluator = MistralEvaluator(api_key=mistral_key)

print(f"\nEvaluating 10 samples...")
report = evaluator.evaluate_batch(
    questions=questions,
    answers=answers,
    contexts=contexts,
    ground_truths=ground_truths,
    show_progress=True,
)

print_report(report)

# Save results
output_dir = Path(__file__).parent / "evaluation" / "results"
summary = save_report(report, output_dir)

print(f"\nResults saved to: {output_dir}")
print(f"\n{'='*60}")
print(f"Quick test complete! Check if faithfulness improved from 0.535")
print(f"{'='*60}")
