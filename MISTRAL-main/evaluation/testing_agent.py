"""RAG Testing Agent - Main Orchestrator.

This module provides a comprehensive testing agent for evaluating RAG systems
using RAGAs (faithfulness, answer relevancy) and DeepEval G-Eval (coherence,
helpfulness, harmlessness).

Usage:
    from evaluation.testing_agent import RAGTestingAgent
    
    agent = RAGTestingAgent(openai_api_key="your-key")
    report = agent.run_evaluation(dataset_path="evaluation/datasets/eval_samples.json")
"""

import json
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd
import requests
from tqdm import tqdm

from evaluation.config import (
    get_datasets_dir,
    get_results_dir,
    ensure_directories,
    settings,
)
from evaluation.dataset_loader import (
    DatasetLoader,
    EvaluationDataset,
    EvaluationSample,
    prepare_for_ragas,
    prepare_for_geval,
)
from evaluation.ragas_evaluator import RAGAsEvaluator, RAGAsEvaluationReport
from evaluation.geval_evaluator import GEvalEvaluator, GEvalEvaluationReport


@dataclass
class RAGResponse:
    """Response from the RAG pipeline."""
    
    question: str
    answer: str
    sources: list[str]
    contexts: list[str]
    was_filtered: bool
    latency_ms: float


@dataclass
class ComprehensiveReport:
    """Comprehensive evaluation report combining all metrics."""
    
    # Dataset info
    dataset_name: str
    total_samples: int
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    
    # RAGAs results
    ragas_report: RAGAsEvaluationReport | None = None
    
    # G-Eval results
    geval_report: GEvalEvaluationReport | None = None
    
    # Combined summary
    summary: dict = field(default_factory=dict)
    
    # Timing
    total_time: float = 0.0
    
    # Execution metadata
    rag_api_url: str = ""
    evaluation_model: str = ""
    
    def get_summary_dict(self) -> dict:
        """Get summary as dictionary."""
        summary = {
            "timestamp": self.timestamp,
            "dataset_name": self.dataset_name,
            "total_samples": self.total_samples,
            "total_time_seconds": self.total_time,
            "rag_api_url": self.rag_api_url,
            "evaluation_model": self.evaluation_model,
        }
        
        if self.ragas_report:
            summary["ragas"] = {
                "mean_faithfulness": self.ragas_report.mean_faithfulness,
                "mean_answer_relevancy": self.ragas_report.mean_answer_relevancy,
                "std_faithfulness": self.ragas_report.std_faithfulness,
                "std_answer_relevancy": self.ragas_report.std_answer_relevancy,
                "successful_evaluations": self.ragas_report.successful_evaluations,
            }
        
        if self.geval_report:
            summary["geval"] = {
                "mean_coherence": self.geval_report.mean_coherence,
                "mean_helpfulness": self.geval_report.mean_helpfulness,
                "mean_harmlessness": self.geval_report.mean_harmlessness,
                "std_coherence": self.geval_report.std_coherence,
                "std_helpfulness": self.geval_report.std_helpfulness,
                "std_harmlessness": self.geval_report.std_harmlessness,
                "successful_evaluations": self.geval_report.successful_evaluations,
            }
        
        return summary


class RAGTestingAgent:
    """Comprehensive testing agent for RAG system evaluation.
    
    This agent orchestrates:
    1. Loading evaluation datasets
    2. Querying the RAG pipeline
    3. Running RAGAs evaluation (faithfulness, answer relevancy)
    4. Running G-Eval evaluation (coherence, helpfulness, harmlessness)
    5. Generating comprehensive reports
    
    Supports OpenAI, Mistral, and Google Gemini for evaluation.
    
    Example:
        >>> # Using OpenAI (recommended)
        >>> agent = RAGTestingAgent(
        ...     openai_api_key="sk-...",
        ...     rag_api_url="http://localhost:8000"
        ... )
        
        >>> # Using Mistral (alternative)
        >>> agent = RAGTestingAgent(
        ...     mistral_api_key="your-mistral-key",
        ...     provider="mistral",
        ...     rag_api_url="http://localhost:8000"
        ... )
        
        >>> # Using Gemini (FREE tier available!)
        >>> agent = RAGTestingAgent(
        ...     google_api_key="your-gemini-key",
        ...     provider="gemini",
        ...     rag_api_url="http://localhost:8000"
        ... )
        
        >>> report = agent.run_evaluation("evaluation/datasets/eval_samples.json")
        >>> print(report.get_summary_dict())
    """
    
    def __init__(
        self,
        openai_api_key: str | None = None,
        mistral_api_key: str | None = None,
        google_api_key: str | None = None,
        rag_api_url: str | None = None,
        evaluation_model: str | None = None,
        provider: str = "openai",
    ):
        """Initialize the testing agent.
        
        Args:
            openai_api_key: OpenAI API key for evaluation
            mistral_api_key: Mistral API key for evaluation
            google_api_key: Google API key for Gemini evaluation (FREE tier available!)
            rag_api_url: URL of the RAG API server
            evaluation_model: Model for evaluation
            provider: Which provider to use ("openai", "mistral", or "gemini")
        """
        self.provider = provider
        self.openai_api_key = openai_api_key or settings.openai_api_key
        self.mistral_api_key = mistral_api_key or settings.mistral_api_key
        self.google_api_key = google_api_key or settings.google_api_key
        self.rag_api_url = rag_api_url or settings.rag_api_base_url
        self.evaluation_model = evaluation_model or settings.evaluator.evaluation_model
        
        # Initialize components
        self.dataset_loader = DatasetLoader()
        
        # Evaluators (lazy initialization)
        self._ragas_evaluator: RAGAsEvaluator | None = None
        self._geval_evaluator: GEvalEvaluator | None = None
        
        # Ensure directories exist
        ensure_directories()
    
    @property
    def ragas_evaluator(self) -> RAGAsEvaluator:
        """Lazy-load RAGAs evaluator."""
        if self._ragas_evaluator is None:
            self._ragas_evaluator = RAGAsEvaluator(
                openai_api_key=self.openai_api_key,
                mistral_api_key=self.mistral_api_key,
                google_api_key=self.google_api_key,
                model_name=self.evaluation_model if self.provider == "openai" else None,
                provider=self.provider,
            )
        return self._ragas_evaluator
    
    @property
    def geval_evaluator(self) -> GEvalEvaluator:
        """Lazy-load G-Eval evaluator."""
        if self._geval_evaluator is None:
            self._geval_evaluator = GEvalEvaluator(
                openai_api_key=self.openai_api_key,
                mistral_api_key=self.mistral_api_key,
                google_api_key=self.google_api_key,
                model_name=self.evaluation_model if self.provider == "openai" else None,
                provider=self.provider,
            )
        return self._geval_evaluator
    
    def check_rag_health(self) -> bool:
        """Check if the RAG API is healthy."""
        try:
            response = requests.get(f"{self.rag_api_url}/health", timeout=10)
            return response.status_code == 200
        except Exception:
            return False
    
    def query_rag(
        self,
        question: str,
        conversation_history: list[dict] | None = None,
    ) -> RAGResponse:
        """Query the RAG pipeline.
        
        Args:
            question: User question
            conversation_history: Optional conversation history
            
        Returns:
            RAGResponse with answer, sources, and contexts
        """
        start_time = time.time()
        
        payload = {"question": question}
        if conversation_history:
            payload["conversation_history"] = conversation_history
        
        try:
            response = requests.post(
                f"{self.rag_api_url}/query",
                json=payload,
                timeout=60,
            )
            response.raise_for_status()
            data = response.json()
            
            latency = (time.time() - start_time) * 1000  # Convert to ms
            
            return RAGResponse(
                question=question,
                answer=data["answer"],
                sources=data["sources"],
                contexts=[],  # Will be populated from retrieval
                was_filtered=data["was_filtered"],
                latency_ms=latency,
            )
        
        except requests.exceptions.RequestException as e:
            return RAGResponse(
                question=question,
                answer=f"Error querying RAG: {str(e)}",
                sources=[],
                contexts=[],
                was_filtered=True,
                latency_ms=(time.time() - start_time) * 1000,
            )
    
    def run_retrieval(self, question: str) -> list[str]:
        """Retrieve contexts for a question.
        
        This uses the vector store directly to get the contexts.
        
        Args:
            question: User question
            
        Returns:
            List of retrieved context strings
        """
        # Import vector store from parent module
        import sys
        parent_dir = Path(__file__).parent.parent
        if str(parent_dir) not in sys.path:
            sys.path.insert(0, str(parent_dir))
        
        from vector_store import VectorStore
        
        store = VectorStore()
        results = store.search(question)
        
        return [r["text"] for r in results]
    
    def populate_dataset_with_rag_responses(
        self,
        dataset: EvaluationDataset,
        show_progress: bool = True,
    ) -> EvaluationDataset:
        """Populate dataset with RAG responses.
        
        Queries the RAG pipeline for each sample and stores
        the generated answers and retrieved contexts.
        
        Args:
            dataset: Dataset to populate
            show_progress: Whether to show progress bar
            
        Returns:
            Dataset with populated answers and contexts
        """
        samples = dataset.samples
        
        iterator = samples
        if show_progress:
            iterator = tqdm(samples, desc="Querying RAG", unit="questions")
        
        for sample in iterator:
            # Query RAG
            response = self.query_rag(sample.question)
            
            # Get retrieved contexts
            contexts = self.run_retrieval(sample.question)
            
            # Update sample
            sample.generated_answer = response.answer
            sample.sources = response.sources
            sample.retrieved_contexts = contexts
        
        return dataset
    
    def run_evaluation(
        self,
        dataset_path: str | Path | None = None,
        dataset: EvaluationDataset | None = None,
        run_ragas: bool = True,
        run_geval: bool = True,
        show_progress: bool = True,
    ) -> ComprehensiveReport:
        """Run comprehensive evaluation on a dataset.
        
        Args:
            dataset_path: Path to dataset file (JSON or CSV)
            dataset: Pre-loaded EvaluationDataset (alternative to path)
            run_ragas: Whether to run RAGAs evaluation
            run_geval: Whether to run G-Eval evaluation
            show_progress: Whether to show progress bars
            
        Returns:
            ComprehensiveReport with all evaluation results
        """
        start_time = time.time()
        
        # Load dataset
        if dataset is None:
            if dataset_path is None:
                dataset_path = get_datasets_dir() / "eval_samples.json"
            dataset = self.dataset_loader.load_from_json(dataset_path)
        
        # Check RAG health
        if not self.check_rag_health():
            print(f"Warning: RAG API at {self.rag_api_url} is not responding.")
            print("Make sure the RAG server is running: python api_server.py")
        
        # Populate dataset with RAG responses
        dataset = self.populate_dataset_with_rag_responses(dataset, show_progress)
        
        # Prepare data for evaluators
        questions = [s.question for s in dataset.samples]
        answers = [s.generated_answer for s in dataset.samples]
        contexts = [s.retrieved_contexts for s in dataset.samples]
        ground_truths = [s.ground_truth for s in dataset.samples]
        
        # Initialize report
        report = ComprehensiveReport(
            dataset_name=dataset.name,
            total_samples=dataset.total_samples,
            rag_api_url=self.rag_api_url,
            evaluation_model=self.evaluation_model,
        )
        
        # Run RAGAs evaluation
        if run_ragas:
            print("\nRunning RAGAs evaluation...")
            try:
                report.ragas_report = self.ragas_evaluator.evaluate_batch(
                    questions=questions,
                    answers=answers,
                    contexts=contexts,
                    ground_truths=ground_truths,
                    show_progress=show_progress,
                )
                print(f"  Faithfulness: {report.ragas_report.mean_faithfulness:.3f}")
                print(f"  Answer Relevancy: {report.ragas_report.mean_answer_relevancy:.3f}")
            except Exception as e:
                print(f"  RAGAs evaluation failed: {e}")
        
        # Run G-Eval evaluation
        if run_geval:
            print("\nRunning G-Eval evaluation...")
            try:
                report.geval_report = self.geval_evaluator.evaluate_batch(
                    questions=questions,
                    answers=answers,
                    contexts=contexts,
                    ground_truths=ground_truths,
                    show_progress=show_progress,
                )
                print(f"  Coherence: {report.geval_report.mean_coherence:.3f}")
                print(f"  Helpfulness: {report.geval_report.mean_helpfulness:.3f}")
                print(f"  Harmlessness: {report.geval_report.mean_harmlessness:.3f}")
            except Exception as e:
                print(f"  G-Eval evaluation failed: {e}")
        
        report.total_time = time.time() - start_time
        report.summary = report.get_summary_dict()
        
        return report
    
    def save_report(
        self,
        report: ComprehensiveReport,
        filename: str | None = None,
    ) -> dict[str, str]:
        """Save evaluation report to files.
        
        Args:
            report: Report to save
            filename: Base filename (without extension)
            
        Returns:
            Dictionary of saved file paths
        """
        results_dir = get_results_dir()
        results_dir.mkdir(parents=True, exist_ok=True)
        
        if filename is None:
            filename = f"full_eval_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        saved_files = {}
        
        # Save summary as JSON
        summary_path = results_dir / f"{filename}_summary.json"
        with open(summary_path, "w", encoding="utf-8") as f:
            json.dump(report.summary, f, indent=2)
        saved_files["summary"] = str(summary_path)
        
        # Save detailed results
        detailed_data = []
        for i, sample in enumerate(report.ragas_report.detailed_results if report.ragas_report else []):
            row = {
                "question": sample.question,
                "answer": sample.answer,
                "ground_truth": sample.ground_truth,
                "contexts": " | ".join(sample.contexts),
                "ragas_faithfulness": sample.faithfulness_score,
                "ragas_answer_relevancy": sample.answer_relevancy_score,
            }
            
            # Add G-Eval results if available
            if report.geval_report and i < len(report.geval_report.detailed_results):
                geval_sample = report.geval_report.detailed_results[i]
                row.update({
                    "geval_coherence": geval_sample.coherence_score,
                    "geval_helpfulness": geval_sample.helpfulness_score,
                    "geval_harmlessness": geval_sample.harmlessness_score,
                })
            
            detailed_data.append(row)
        
        if detailed_data:
            detailed_path = results_dir / f"{filename}_detailed.csv"
            df = pd.DataFrame(detailed_data)
            df.to_csv(detailed_path, index=False)
            saved_files["detailed"] = str(detailed_path)
        
        # Save RAGAs report separately
        if report.ragas_report:
            ragas_path = self.ragas_evaluator.save_report(
                report.ragas_report,
                f"{filename}_ragas",
            )
            saved_files["ragas"] = ragas_path
        
        # Save G-Eval report separately
        if report.geval_report:
            geval_path = self.geval_evaluator.save_report(
                report.geval_report,
                f"{filename}_geval",
            )
            saved_files["geval"] = geval_path
        
        return saved_files
    
    def print_report_summary(self, report: ComprehensiveReport):
        """Print a formatted summary of the evaluation report."""
        print("\n" + "=" * 60)
        print("RAG EVALUATION REPORT SUMMARY")
        print("=" * 60)
        print(f"\nDataset: {report.dataset_name}")
        print(f"Total Samples: {report.total_samples}")
        print(f"Evaluation Time: {report.total_time:.2f} seconds")
        print(f"Evaluation Model: {report.evaluation_model}")
        
        if report.ragas_report:
            print("\n--- RAGAs Metrics ---")
            print(f"  Faithfulness:    {report.ragas_report.mean_faithfulness:.3f} ± {report.ragas_report.std_faithfulness:.3f}")
            print(f"  Answer Relevancy: {report.ragas_report.mean_answer_relevancy:.3f} ± {report.ragas_report.std_answer_relevancy:.3f}")
            
            # Interpretation
            print("\n  Interpretation:")
            print(f"    Faithfulness: {RAGAsEvaluator.interpret_score(report.ragas_report.mean_faithfulness)}")
            print(f"    Relevancy:    {RAGAsEvaluator.interpret_score(report.ragas_report.mean_answer_relevancy)}")
        
        if report.geval_report:
            print("\n--- G-Eval Metrics ---")
            print(f"  Coherence:      {report.geval_report.mean_coherence:.3f} ± {report.geval_report.std_coherence:.3f}")
            print(f"  Helpfulness:    {report.geval_report.mean_helpfulness:.3f} ± {report.geval_report.std_helpfulness:.3f}")
            print(f"  Harmlessness:   {report.geval_report.mean_harmlessness:.3f} ± {report.geval_report.std_harmlessness:.3f}")
            
            print("\n  Interpretation:")
            print(f"    Coherence:    {GEvalEvaluator.interpret_score(report.geval_report.mean_coherence, 'Coherence')}")
            print(f"    Helpfulness:  {GEvalEvaluator.interpret_score(report.geval_report.mean_helpfulness, 'Helpfulness')}")
            print(f"    Harmlessness: {GEvalEvaluator.interpret_score(report.geval_report.mean_harmlessness, 'Harmlessness')}")
        
        print("\n" + "=" * 60)


def main():
    """Main entry point for the testing agent."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="RAG Testing Agent - Evaluate RAG systems with RAGAs and G-Eval"
    )
    parser.add_argument(
        "--dataset",
        type=str,
        default=None,
        help="Path to evaluation dataset (JSON or CSV)",
    )
    parser.add_argument(
        "--rag-url",
        type=str,
        default="http://localhost:8000",
        help="URL of the RAG API server",
    )
    parser.add_argument(
        "--openai-key",
        type=str,
        default=None,
        help="OpenAI API key for evaluation",
    )
    parser.add_argument(
        "--mistral-key",
        type=str,
        default=None,
        help="Mistral API key for evaluation",
    )
    parser.add_argument(
        "--google-key",
        type=str,
        default=None,
        help="Google API key for Gemini evaluation (FREE tier available!)",
    )
    parser.add_argument(
        "--provider",
        type=str,
        choices=["openai", "mistral", "gemini"],
        default="openai",
        help="LLM provider to use for evaluation (default: openai). 'gemini' has free tier!",
    )
    parser.add_argument(
        "--no-ragas",
        action="store_true",
        help="Skip RAGAs evaluation",
    )
    parser.add_argument(
        "--no-geval",
        action="store_true",
        help="Skip G-Eval evaluation",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output filename base (without extension)",
    )
    
    args = parser.parse_args()
    
    # Check for API key based on provider
    if args.provider == "gemini":
        api_key = args.google_key or settings.google_api_key or os.getenv("GOOGLE_API_KEY", "")
        if not api_key:
            print("Error: Google API key is required when using Gemini provider.")
            print("\nGet a FREE API key at: https://aistudio.google.com/apikey")
            print("Then set it with:")
            print("  --google-key YOUR_KEY")
            print("  or set GOOGLE_API_KEY environment variable")
            return
    elif args.provider == "mistral":
        api_key = args.mistral_key or settings.mistral_api_key
        if not api_key:
            print("Error: Mistral API key is required when using Mistral provider.")
            print("Set MISTRAL_API_KEY environment variable or use --mistral-key")
            return
    else:
        api_key = args.openai_key or settings.openai_api_key
        if not api_key:
            print("Error: OpenAI API key is required for evaluation.")
            print("Set OPENAI_API_KEY environment variable or use --openai-key")
            print("\nTip: Use --provider gemini --google-key YOUR_KEY for FREE evaluation!")
            return
    
    # Initialize agent
    agent = RAGTestingAgent(
        openai_api_key=args.openai_key,
        mistral_api_key=args.mistral_key,
        google_api_key=args.google_key,
        rag_api_url=args.rag_url,
        provider=args.provider,
    )
    
    # Run evaluation
    report = agent.run_evaluation(
        dataset_path=args.dataset,
        run_ragas=not args.no_ragas,
        run_geval=not args.no_geval,
    )
    
    # Print summary
    agent.print_report_summary(report)
    
    # Save report
    saved_files = agent.save_report(report, args.output)
    print(f"\nResults saved to:")
    for name, path in saved_files.items():
        print(f"  {name}: {path}")


if __name__ == "__main__":
    main()
