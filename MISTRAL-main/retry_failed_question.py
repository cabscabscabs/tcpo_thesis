"""Re-run the single failed question from the evaluation."""
import os
import sys
import json
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "evaluation"))
from simple_eval import MistralEvaluator, query_rag_api, get_contexts_from_vector_store

# The failed question
question = "What happens if an invention is not new?"
print(f"Re-running failed question: {question}\n")

# Load ground truth from dataset
dataset_path = Path(__file__).parent / "evaluation" / "datasets" / "eval_samples.json"
with open(dataset_path, "r", encoding="utf-8") as f:
    samples = json.load(f)

# Find the ground truth
ground_truth = None
for sample in samples:
    if sample["question"] == question:
        ground_truth = sample["ground_truth"]
        break

if not ground_truth:
    print("Error: Could not find ground truth for this question!")
    sys.exit(1)

print(f"Ground truth: {ground_truth[:200]}...\n")

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

# Query RAG
print("Querying RAG server...")
try:
    rag_response = query_rag_api(question, "http://localhost:8000")
    answer = rag_response.get("answer", "")
    print(f"RAG Answer:\n{answer}\n")
    
    # Get context
    from vector_store import VectorStore
    vector_store = VectorStore()
    contexts = get_contexts_from_vector_store(question, store=vector_store)
    print(f"Retrieved {len(contexts)} context chunks\n")
    
    # Evaluate
    print("Evaluating with Mistral API...")
    evaluator = MistralEvaluator(api_key=mistral_key)
    result = evaluator.evaluate_single(
        question=question,
        answer=answer,
        contexts=contexts if contexts else ["Context not available"],
        ground_truth=ground_truth
    )
    
    print(f"\n{'='*60}")
    print(f"EVALUATION RESULTS:")
    print(f"{'='*60}")
    print(f"Faithfulness:     {result.faithfulness:.3f}")
    print(f"Answer Relevancy: {result.answer_relevancy:.3f}")
    print(f"Coherence:        {result.coherence:.3f}")
    print(f"Helpfulness:      {result.helpfulness:.3f}")
    print(f"\nFeedback: {result.feedback}")
    if result.error:
        print(f"\nError: {result.error}")
    print(f"{'='*60}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
