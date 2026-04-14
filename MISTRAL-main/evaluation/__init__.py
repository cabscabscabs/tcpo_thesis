"""RAG Evaluation Package.

This package provides comprehensive evaluation tools for RAG systems:

1. RAGAs Evaluator - Measures faithfulness and answer relevancy
2. G-Eval Evaluator (via DeepEval) - Measures coherence, helpfulness, harmlessness
3. Dataset Loader - Manages evaluation datasets
4. Testing Agent - Orchestrates the full evaluation pipeline

Quick Start:
    from evaluation import RAGTestingAgent, DatasetLoader
    
    # Initialize the testing agent
    agent = RAGTestingAgent(openai_api_key="your-key")
    
    # Run evaluation
    report = agent.run_evaluation("path/to/dataset.json")
    
    # View results
    agent.print_report_summary(report)

Evaluation Metrics:
    RAGAs:
        - Faithfulness: How well answers are grounded in retrieved context (0-1)
        - Answer Relevancy: How relevant answers are to questions (0-1)
    
    G-Eval (DeepEval):
        - Coherence: Logical consistency and flow (0-1)
        - Helpfulness: Practical value and usefulness (0-1)
        - Harmlessness: Safety and absence of harmful content (0-1)
"""

from evaluation.config import (
    Settings,
    settings,
    get_evaluation_dir,
    get_datasets_dir,
    get_results_dir,
    ensure_directories,
)

from evaluation.dataset_loader import (
    DatasetLoader,
    EvaluationDataset,
    EvaluationSample,
    prepare_for_ragas,
    prepare_for_geval,
)

from evaluation.ragas_evaluator import (
    RAGAsEvaluator,
    RAGAsResult,
    RAGAsEvaluationReport,
)

from evaluation.geval_evaluator import (
    GEvalEvaluator,
    GEvalResult,
    GEvalEvaluationReport,
)

from evaluation.testing_agent import (
    RAGTestingAgent,
    RAGResponse,
    ComprehensiveReport,
)

__all__ = [
    # Config
    "Settings",
    "settings",
    "get_evaluation_dir",
    "get_datasets_dir",
    "get_results_dir",
    "ensure_directories",
    # Dataset
    "DatasetLoader",
    "EvaluationDataset",
    "EvaluationSample",
    "prepare_for_ragas",
    "prepare_for_geval",
    # RAGAs
    "RAGAsEvaluator",
    "RAGAsResult",
    "RAGAsEvaluationReport",
    # G-Eval
    "GEvalEvaluator",
    "GEvalResult",
    "GEvalEvaluationReport",
    # Agent
    "RAGTestingAgent",
    "RAGResponse",
    "ComprehensiveReport",
]

__version__ = "1.0.0"
