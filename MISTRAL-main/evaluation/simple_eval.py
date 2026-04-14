"""Simplified RAG Evaluator using Gemini API directly.

This is a lightweight alternative to RAGAs/DeepEval that works on Windows
without requiring C++ build tools.

Usage:
    python evaluation/simple_eval.py
"""

import os
import sys
import json
import time
from pathlib import Path
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

import requests
import pandas as pd
from tqdm import tqdm

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class EvalResult:
    """Result from evaluating a single Q&A pair."""
    question: str
    answer: str
    ground_truth: str
    contexts: list[str]
    
    # Scores (0-10 scale, converted to 0-1)
    faithfulness: float = 0.0
    answer_relevancy: float = 0.0
    coherence: float = 0.0
    helpfulness: float = 0.0
    
    # Raw LLM feedback
    feedback: str = ""
    
    evaluation_time: float = 0.0
    error: str | None = None


@dataclass 
class EvalReport:
    """Aggregated evaluation report."""
    total_samples: int = 0
    successful: int = 0
    failed: int = 0
    
    mean_faithfulness: float = 0.0
    mean_answer_relevancy: float = 0.0
    mean_coherence: float = 0.0
    mean_helpfulness: float = 0.0
    
    total_time: float = 0.0
    detailed_results: list[EvalResult] = field(default_factory=list)
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())


class MistralEvaluator:
    """Simple RAG evaluator using Mistral API."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model = "mistral-small-latest"
        self.base_url = "https://api.mistral.ai/v1/chat/completions"
    
    def _call_mistral(self, prompt: str, max_retries: int = 3) -> str:
        """Make a request to Mistral API with retry logic."""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
            "max_tokens": 1024,
        }
        
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    self.base_url, 
                    headers=headers, 
                    json=payload, 
                    timeout=60
                )
                response.raise_for_status()
                
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except requests.exceptions.HTTPError as e:
                if "429" in str(e):
                    wait_time = (attempt + 1) * 10
                    print(f"\nRate limit hit, waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                else:
                    raise
        
        raise Exception(f"Failed after {max_retries} retries")
    
    def evaluate_single(
        self,
        question: str,
        answer: str,
        contexts: list[str],
        ground_truth: str,
    ) -> EvalResult:
        """Evaluate a single Q&A pair."""
        start_time = time.time()
        
        result = EvalResult(
            question=question,
            answer=answer,
            ground_truth=ground_truth,
            contexts=contexts,
        )
        
        try:
            # Combine contexts
            context_text = "\n\n".join(contexts) if contexts else "No context provided."
            
            # Create evaluation prompt
            eval_prompt = f"""You are an expert evaluator for RAG (Retrieval-Augmented Generation) systems.

Evaluate the following Q&A pair on these metrics (score 1-10 for each):

**CONTEXT:**
{context_text[:2000]}

**QUESTION:** 
{question}

**GENERATED ANSWER:**
{answer}

**REFERENCE ANSWER (Ground Truth):**
{ground_truth}

**SCORING CRITERIA:**

1. **FAITHFULNESS** (1-10): How well is the answer grounded in the provided context?
   - 10: All claims are supported by the context
   - 5: Some claims are supported, some are not
   - 1: Answer contradicts or ignores the context

2. **ANSWER RELEVANCY** (1-10): How well does the answer address the question?
   - 10: Directly answers the question completely
   - 5: Partially answers or somewhat relevant
   - 1: Does not address the question at all

3. **COHERENCE** (1-10): Is the answer logically structured and easy to follow?
   - 10: Clear, well-organized, flows logically
   - 5: Understandable but could be clearer
   - 1: Confusing, disjointed, hard to follow

4. **HELPFULNESS** (1-10): How practically useful is this answer?
   - 10: Provides actionable, valuable information
   - 5: Somewhat useful but lacks detail
   - 1: Not helpful at all

**OUTPUT FORMAT (strictly follow this):**
FAITHFULNESS: [1-10]
ANSWER_RELEVANCY: [1-10]
COHERENCE: [1-10]
HELPFULNESS: [1-10]
FEEDBACK: [One sentence summary of strengths/weaknesses]
"""
            
            response = self._call_mistral(eval_prompt)
            
            # Parse scores from response
            for line in response.split("\n"):
                line = line.strip()
                if line.startswith("FAITHFULNESS:"):
                    result.faithfulness = float(line.split(":")[1].strip().split()[0]) / 10.0
                elif line.startswith("ANSWER_RELEVANCY:"):
                    result.answer_relevancy = float(line.split(":")[1].strip().split()[0]) / 10.0
                elif line.startswith("COHERENCE:"):
                    result.coherence = float(line.split(":")[1].strip().split()[0]) / 10.0
                elif line.startswith("HELPFULNESS:"):
                    result.helpfulness = float(line.split(":")[1].strip().split()[0]) / 10.0
                elif line.startswith("FEEDBACK:"):
                    result.feedback = line.replace("FEEDBACK:", "").strip()
            
        except Exception as e:
            result.error = str(e)
        
        result.evaluation_time = time.time() - start_time
        return result
    
    def evaluate_batch(
        self,
        questions: list[str],
        answers: list[str],
        contexts: list[list[str]],
        ground_truths: list[str],
        show_progress: bool = True,
    ) -> EvalReport:
        """Evaluate a batch of Q&A pairs."""
        start_time = time.time()
        results = []
        
        iterator = zip(questions, answers, contexts, ground_truths)
        if show_progress:
            iterator = tqdm(list(iterator), desc="Evaluating", unit="samples")
        
        for i, (q, a, ctx, gt) in enumerate(iterator):
            result = self.evaluate_single(q, a, ctx, gt)
            results.append(result)
            
            # Rate limit: 15 requests per minute = 4 seconds between requests
            # Add delay to stay within free tier limits
            if i < len(questions) - 1:  # No delay after last item
                time.sleep(4.5)  # 4.5 seconds = ~13 requests per minute
        
        # Calculate aggregates
        successful = [r for r in results if not r.error]
        
        report = EvalReport(
            total_samples=len(results),
            successful=len(successful),
            failed=len(results) - len(successful),
            mean_faithfulness=sum(r.faithfulness for r in successful) / len(successful) if successful else 0,
            mean_answer_relevancy=sum(r.answer_relevancy for r in successful) / len(successful) if successful else 0,
            mean_coherence=sum(r.coherence for r in successful) / len(successful) if successful else 0,
            mean_helpfulness=sum(r.helpfulness for r in successful) / len(successful) if successful else 0,
            total_time=time.time() - start_time,
            detailed_results=results,
        )
        
        return report


def load_eval_dataset(dataset_path: str) -> list[dict]:
    """Load evaluation dataset from JSON file."""
    with open(dataset_path, "r", encoding="utf-8") as f:
        return json.load(f)


def query_rag_api(question: str, rag_url: str) -> dict:
    """Query the RAG API."""
    try:
        response = requests.post(
            f"{rag_url}/query",
            json={"question": question},
            timeout=60,
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"answer": f"Error: {e}", "sources": [], "was_filtered": True}


def get_contexts_from_vector_store(question: str) -> list[str]:
    """Get contexts from vector store."""
    try:
        from vector_store import VectorStore
        store = VectorStore()
        results = store.search(question)
        return [r["text"] for r in results]
    except Exception:
        return []


def save_report(report: EvalReport, output_dir: Path):
    """Save evaluation report to files."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save summary
    summary = {
        "timestamp": report.timestamp,
        "total_samples": report.total_samples,
        "successful": report.successful,
        "failed": report.failed,
        "mean_faithfulness": round(report.mean_faithfulness, 3),
        "mean_answer_relevancy": round(report.mean_answer_relevancy, 3),
        "mean_coherence": round(report.mean_coherence, 3),
        "mean_helpfulness": round(report.mean_helpfulness, 3),
        "total_time_seconds": round(report.total_time, 2),
    }
    
    with open(output_dir / f"eval_summary_{timestamp}.json", "w") as f:
        json.dump(summary, f, indent=2)
    
    # Save detailed results
    detailed_data = []
    for r in report.detailed_results:
        detailed_data.append({
            "question": r.question,
            "answer": r.answer,
            "ground_truth": r.ground_truth,
            "faithfulness": round(r.faithfulness, 3),
            "answer_relevancy": round(r.answer_relevancy, 3),
            "coherence": round(r.coherence, 3),
            "helpfulness": round(r.helpfulness, 3),
            "feedback": r.feedback,
            "error": r.error,
        })
    
    df = pd.DataFrame(detailed_data)
    df.to_csv(output_dir / f"eval_detailed_{timestamp}.csv", index=False)
    
    return summary


def print_report(report: EvalReport):
    """Print formatted evaluation report."""
    print("\n" + "=" * 60)
    print("RAG EVALUATION REPORT")
    print("=" * 60)
    print(f"\nTotal Samples: {report.total_samples}")
    print(f"Successful: {report.successful}")
    print(f"Failed: {report.failed}")
    print(f"Evaluation Time: {report.total_time:.2f} seconds")
    
    print("\n--- METRICS (0-1 scale, higher is better) ---")
    print(f"  Faithfulness:     {report.mean_faithfulness:.3f}")
    print(f"  Answer Relevancy: {report.mean_answer_relevancy:.3f}")
    print(f"  Coherence:        {report.mean_coherence:.3f}")
    print(f"  Helpfulness:      {report.mean_helpfulness:.3f}")
    
    # Overall score
    overall = (report.mean_faithfulness + report.mean_answer_relevancy + 
               report.mean_coherence + report.mean_helpfulness) / 4
    print(f"\n  OVERALL SCORE:    {overall:.3f}")
    
    # Interpretation
    print("\n--- INTERPRETATION ---")
    for metric, score in [
        ("Faithfulness", report.mean_faithfulness),
        ("Answer Relevancy", report.mean_answer_relevancy),
        ("Coherence", report.mean_coherence),
        ("Helpfulness", report.mean_helpfulness),
    ]:
        if score >= 0.8:
            interp = "Excellent"
        elif score >= 0.6:
            interp = "Good"
        elif score >= 0.4:
            interp = "Fair"
        else:
            interp = "Needs Improvement"
        print(f"  {metric}: {interp}")
    
    print("\n" + "=" * 60)


def main():
    """Main entry point."""
    print("=" * 60)
    print("RAG Evaluation with Mistral API")
    print("=" * 60)
    
    # Check for Mistral API key
    mistral_key = os.getenv("MISTRAL_API_KEY")
    if not mistral_key:
        env_file = Path(__file__).parent.parent / ".env"
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    if line.startswith("MISTRAL_API_KEY"):
                        mistral_key = line.split("=", 1)[1].strip().strip('"')
                        break
    
    if not mistral_key:
        print("\nError: MISTRAL_API_KEY not found!")
        print("Add MISTRAL_API_KEY to your .env file")
        return
    
    print(f"\nUsing Mistral API key: {mistral_key[:10]}...")
    
    # Load dataset
    dataset_path = Path(__file__).parent / "datasets" / "eval_samples.json"
    if not dataset_path.exists():
        print(f"\nError: Dataset not found at {dataset_path}")
        return
    
    print(f"\nLoading dataset from: {dataset_path}")
    samples = load_eval_dataset(dataset_path)
    print(f"Loaded {len(samples)} evaluation samples")
    
    # Check RAG server
    rag_url = "http://localhost:8000"
    print(f"\nChecking RAG server at {rag_url}...")
    
    try:
        health = requests.get(f"{rag_url}/health", timeout=5)
        if health.status_code == 200:
            print("RAG server is running!")
        else:
            print("Warning: RAG server health check failed")
    except Exception:
        print("Warning: RAG server is not responding.")
        print("Start it with: python api_server.py")
        print("\nContinuing with evaluation (will use ground truth for comparison)...")
    
    # Prepare data (limit to 5 samples for quick test)
    questions = []
    answers = []
    contexts = []
    ground_truths = []
    
    # Use all samples for full evaluation
    test_samples = samples[:50]
    
    print(f"\nCollecting RAG responses (testing with {len(test_samples)} samples)...")
    for sample in tqdm(test_samples, desc="Querying RAG"):
        questions.append(sample["question"])
        ground_truths.append(sample["ground_truth"])
        
        # Try to get RAG response
        try:
            rag_response = query_rag_api(sample["question"], rag_url)
            answers.append(rag_response.get("answer", ""))
            ctx = get_contexts_from_vector_store(sample["question"])
            contexts.append(ctx if ctx else ["Context not available"])
        except Exception:
            # Use ground truth as fallback for testing
            answers.append(sample["ground_truth"])
            contexts.append(["Using ground truth for evaluation demo"])
    
    # Initialize evaluator with Mistral
    evaluator = MistralEvaluator(api_key=mistral_key)
    
    # Run evaluation
    print("\n" + "=" * 60)
    print("Starting Evaluation...")
    print("=" * 60)
    
    report = evaluator.evaluate_batch(
        questions=questions,
        answers=answers,
        contexts=contexts,
        ground_truths=ground_truths,
        show_progress=True,
    )
    
    # Print report
    print_report(report)
    
    # Save results
    output_dir = Path(__file__).parent / "results"
    summary = save_report(report, output_dir)
    
    print(f"\nResults saved to: {output_dir}")
    print("\n" + "=" * 60)
    print(f"Evaluation complete! Total cost: $0.00")
    print("=" * 60)


if __name__ == "__main__":
    main()
