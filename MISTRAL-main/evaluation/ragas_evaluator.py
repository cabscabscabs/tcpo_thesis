"""RAGAs Evaluator for RAG System Testing.

This module implements evaluation using RAGAs framework to measure:
- Faithfulness: How well the answer is grounded in the retrieved context
- Answer Relevancy: How relevant the answer is to the question

RAGAs uses LLM-based evaluation to assess these metrics.

Supports OpenAI, Mistral Cloud API, and Google Gemini for evaluation.
"""

import os
import asyncio
from typing import Any, Literal
from dataclasses import dataclass, field
from datetime import datetime

import pandas as pd
from datasets import Dataset
from tqdm import tqdm

# RAGAs imports
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
    answer_correctness,
)
from ragas.metrics._answer_relevance import AnswerRelevancy
from ragas.metrics._faithfulness import Faithfulness

# LangChain imports for multiple LLM support
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from config import settings as rag_settings
from evaluation.config import settings, get_results_dir


@dataclass
class RAGAsResult:
    """Result from a single RAGAs evaluation."""
    
    question: str
    answer: str
    contexts: list[str]
    ground_truth: str
    
    # Metric scores
    faithfulness_score: float = 0.0
    answer_relevancy_score: float = 0.0
    
    # Additional metrics (optional)
    context_precision_score: float | None = None
    context_recall_score: float | None = None
    answer_correctness_score: float | None = None
    
    evaluation_time: float = 0.0
    error: str | None = None


@dataclass
class RAGAsEvaluationReport:
    """Aggregated report from RAGAs evaluation."""
    
    total_samples: int
    successful_evaluations: int
    failed_evaluations: int
    
    # Aggregate scores
    mean_faithfulness: float
    mean_answer_relevancy: float
    std_faithfulness: float
    std_answer_relevancy: float
    
    # Optional metrics
    mean_context_precision: float | None = None
    mean_context_recall: float | None = None
    
    # Timing
    total_evaluation_time: float
    
    # Detailed results
    detailed_results: list[RAGAsResult] = field(default_factory=list)
    
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())


class RAGAsEvaluator:
    """Evaluator using RAGAs framework for RAG quality assessment.
    
    Supports OpenAI, Mistral Cloud API, and Google Gemini for evaluation.
    """
    
    def __init__(
        self,
        openai_api_key: str | None = None,
        mistral_api_key: str | None = None,
        google_api_key: str | None = None,
        model_name: str | None = None,
        provider: Literal["openai", "mistral", "gemini"] = "openai",
    ):
        """Initialize RAGAs evaluator.
        
        Args:
            openai_api_key: OpenAI API key for LLM evaluation.
            mistral_api_key: Mistral API key for LLM evaluation.
            google_api_key: Google API key for Gemini evaluation.
            model_name: Model to use for evaluation.
            provider: Which LLM provider to use ("openai", "mistral", or "gemini").
        """
        self.provider = provider
        self.openai_api_key = openai_api_key or settings.openai_api_key or os.getenv("OPENAI_API_KEY", "")
        self.mistral_api_key = mistral_api_key or settings.mistral_api_key or os.getenv("MISTRAL_API_KEY", "")
        self.google_api_key = google_api_key or settings.google_api_key or os.getenv("GOOGLE_API_KEY", "")
        
        # Set model based on provider
        if provider == "gemini":
            self.model_name = model_name or "gemini-1.5-flash"
            if not self.google_api_key:
                raise ValueError(
                    "Google API key is required when using Gemini provider. "
                    "Set GOOGLE_API_KEY environment variable or pass google_api_key parameter. "
                    "Get a free key at: https://aistudio.google.com/apikey"
                )
            # Initialize Gemini components
            self.llm = ChatGoogleGenerativeAI(
                model=self.model_name,
                google_api_key=self.google_api_key,
                temperature=0,
            )
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=self.google_api_key,
            )
        elif provider == "mistral":
            self.model_name = model_name or "mistral-small-latest"
            if not self.mistral_api_key:
                raise ValueError(
                    "Mistral API key is required when using Mistral provider. "
                    "Set MISTRAL_API_KEY environment variable or pass mistral_api_key parameter."
                )
            # Initialize Mistral components
            self.llm = ChatMistralAI(
                model=self.model_name,
                mistral_api_key=self.mistral_api_key,
                temperature=0,
            )
            self.embeddings = MistralAIEmbeddings(
                model="mistral-embed",
                mistral_api_key=self.mistral_api_key,
            )
        else:
            # OpenAI provider (default)
            self.model_name = model_name or settings.evaluator.evaluation_model
            if not self.openai_api_key:
                raise ValueError(
                    "OpenAI API key is required for RAGAs evaluation. "
                    "Set OPENAI_API_KEY environment variable or pass openai_api_key parameter. "
                    "Alternatively, set provider='mistral' or provider='gemini' to use other APIs."
                )
            self.llm = ChatOpenAI(
                model=self.model_name,
                openai_api_key=self.openai_api_key,
                temperature=0,
            )
            self.embeddings = OpenAIEmbeddings(
                openai_api_key=self.openai_api_key,
            )
        
        # Default metrics
        self.metrics = [
            faithfulness,
            answer_relevancy,
        ]
    
    def prepare_dataset(
        self,
        questions: list[str],
        answers: list[str],
        contexts: list[list[str]],
        ground_truths: list[str],
    ) -> Dataset:
        """Prepare a HuggingFace Dataset for RAGAs evaluation.
        
        RAGAs expects a dataset with columns:
        - question: The user question
        - answer: The generated answer
        - contexts: List of retrieved context passages
        - ground_truth: The reference answer (for some metrics)
        
        Args:
            questions: List of user questions
            answers: List of generated answers
            contexts: List of context lists (one list per question)
            ground_truths: List of reference answers
            
        Returns:
            HuggingFace Dataset ready for evaluation
        """
        data = {
            "question": questions,
            "answer": answers,
            "contexts": contexts,
            "ground_truth": ground_truths,
        }
        return Dataset.from_dict(data)
    
    async def evaluate_single(
        self,
        question: str,
        answer: str,
        contexts: list[str],
        ground_truth: str,
    ) -> RAGAsResult:
        """Evaluate a single QA pair.
        
        Args:
            question: User question
            answer: Generated answer from RAG system
            contexts: Retrieved context passages
            ground_truth: Reference answer
            
        Returns:
            RAGAsResult with metric scores
        """
        import time
        start_time = time.time()
        
        result = RAGAsResult(
            question=question,
            answer=answer,
            contexts=contexts,
            ground_truth=ground_truth,
        )
        
        try:
            # Create single-item dataset
            dataset = self.prepare_dataset(
                questions=[question],
                answers=[answer],
                contexts=[contexts],
                ground_truths=[ground_truth],
            )
            
            # Run evaluation
            eval_result = evaluate(
                dataset,
                metrics=self.metrics,
                llm=self.llm,
                embeddings=self.embeddings,
            )
            
            # Extract scores
            scores = eval_result.scores[0] if eval_result.scores else {}
            
            result.faithfulness_score = scores.get("faithfulness", 0.0)
            result.answer_relevancy_score = scores.get("answer_relevancy", 0.0)
            
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
    ) -> RAGAsEvaluationReport:
        """Evaluate a batch of QA pairs.
        
        This is more efficient than single evaluation as RAGAs
        optimizes batch processing.
        
        Args:
            questions: List of user questions
            answers: List of generated answers
            contexts: List of context lists
            ground_truths: List of reference answers
            show_progress: Whether to show progress bar
            
        Returns:
            RAGAsEvaluationReport with aggregated results
        """
        import time
        start_time = time.time()
        
        # Prepare dataset
        dataset = self.prepare_dataset(
            questions=questions,
            answers=answers,
            contexts=contexts,
            ground_truths=ground_truths,
        )
        
        detailed_results: list[RAGAsResult] = []
        
        try:
            # Run batch evaluation
            eval_result = evaluate(
                dataset,
                metrics=self.metrics,
                llm=self.llm,
                embeddings=self.embeddings,
            )
            
            # Convert results to pandas for easier analysis
            df = eval_result.to_pandas()
            
            # Create detailed results
            for i, row in df.iterrows():
                result = RAGAsResult(
                    question=questions[i],
                    answer=answers[i],
                    contexts=contexts[i],
                    ground_truth=ground_truths[i],
                    faithfulness_score=row.get("faithfulness", 0.0),
                    answer_relevancy_score=row.get("answer_relevancy", 0.0),
                )
                detailed_results.append(result)
            
            successful = len(detailed_results)
            failed = len(questions) - successful
            
            # Calculate aggregates
            faithfulness_scores = [r.faithfulness_score for r in detailed_results]
            relevancy_scores = [r.answer_relevancy_score for r in detailed_results]
            
            report = RAGAsEvaluationReport(
                total_samples=len(questions),
                successful_evaluations=successful,
                failed_evaluations=failed,
                mean_faithfulness=pd.Series(faithfulness_scores).mean(),
                mean_answer_relevancy=pd.Series(relevancy_scores).mean(),
                std_faithfulness=pd.Series(faithfulness_scores).std(),
                std_answer_relevancy=pd.Series(relevancy_scores).std(),
                total_evaluation_time=time.time() - start_time,
                detailed_results=detailed_results,
            )
            
        except Exception as e:
            # Return empty report on failure
            report = RAGAsEvaluationReport(
                total_samples=len(questions),
                successful_evaluations=0,
                failed_evaluations=len(questions),
                mean_faithfulness=0.0,
                mean_answer_relevancy=0.0,
                std_faithfulness=0.0,
                total_evaluation_time=time.time() - start_time,
            )
        
        return report
    
    def save_report(
        self,
        report: RAGAsEvaluationReport,
        filename: str | None = None,
    ) -> str:
        """Save evaluation report to files.
        
        Args:
            report: The evaluation report to save
            filename: Base filename (without extension)
            
        Returns:
            Path to saved report
        """
        results_dir = get_results_dir()
        results_dir.mkdir(parents=True, exist_ok=True)
        
        if filename is None:
            filename = f"ragas_eval_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Save detailed results as CSV
        detailed_data = []
        for r in report.detailed_results:
            detailed_data.append({
                "question": r.question,
                "answer": r.answer,
                "contexts": " | ".join(r.contexts),
                "ground_truth": r.ground_truth,
                "faithfulness": r.faithfulness_score,
                "answer_relevancy": r.answer_relevancy_score,
                "evaluation_time": r.evaluation_time,
                "error": r.error,
            })
        
        df_detailed = pd.DataFrame(detailed_data)
        df_detailed.to_csv(results_dir / f"{filename}_detailed.csv", index=False)
        
        # Save summary
        summary_data = {
            "timestamp": report.timestamp,
            "total_samples": report.total_samples,
            "successful_evaluations": report.successful_evaluations,
            "failed_evaluations": report.failed_evaluations,
            "mean_faithfulness": report.mean_faithfulness,
            "mean_answer_relevancy": report.mean_answer_relevancy,
            "std_faithfulness": report.std_faithfulness,
            "std_answer_relevancy": report.std_answer_relevancy,
            "total_evaluation_time": report.total_evaluation_time,
        }
        
        df_summary = pd.DataFrame([summary_data])
        df_summary.to_csv(results_dir / f"{filename}_summary.csv", index=False)
        
        return str(results_dir / filename)
    
    @staticmethod
    def interpret_score(score: float) -> str:
        """Interpret a RAGAs score.
        
        RAGAs scores range from 0 to 1, with higher being better.
        
        Args:
            score: The metric score (0-1)
            
        Returns:
            Human-readable interpretation
        """
        if score >= 0.8:
            return "Excellent - High quality response"
        elif score >= 0.6:
            return "Good - Acceptable quality"
        elif score >= 0.4:
            return "Fair - Room for improvement"
        else:
            return "Poor - Significant issues detected"


def create_ragas_test_data() -> dict:
    """Create sample test data for demonstration.
    
    Returns:
        Dictionary with questions, answers, contexts, and ground_truths
    """
    return {
        "questions": [
            "What services does TPCO offer for patent applications?",
            "How do I file a trademark application?",
        ],
        "answers": [
            "TPCO offers services for patent applications including assistance with patent drafting, filing with IPOPHL, patent search reports, and guidance through the patent application process.",
            "To file a trademark application, you need to submit IPOPHL Form 400 along with the required fees and supporting documents.",
        ],
        "contexts": [
            [
                "TPCO provides comprehensive patent services including drafting, filing, and search assistance.",
                "The office helps inventors prepare patent specifications and navigate IPOPHL procedures.",
            ],
            [
                "Trademark applications require Form 400 from IPOPHL.",
                "The process includes classification, examination, and registration phases.",
            ],
        ],
        "ground_truths": [
            "TPCO offers services for patent applications including assistance with patent drafting, filing with IPOPHL, patent search reports, and guidance through the patent application process.",
            "To file a trademark application, you need to submit IPOPHL Form 400 (Trademark Application Form) along with the required fees and supporting documents.",
        ],
    }


if __name__ == "__main__":
    # Demo usage
    print("RAGAs Evaluator for RAG System Testing")
    print("=" * 50)
    print("\nThis evaluator measures:")
    print("1. Faithfulness: How well answers are grounded in retrieved context")
    print("2. Answer Relevancy: How relevant answers are to the questions")
    print("\nUsage:")
    print("  from evaluation.ragas_evaluator import RAGAsEvaluator")
    print("  evaluator = RAGAsEvaluator(openai_api_key='your-key')")
    print("  report = evaluator.evaluate_batch(questions, answers, contexts, ground_truths)")
