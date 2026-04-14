"""Configuration for RAG Evaluation Testing Agent.

This module defines the configuration settings for running RAG evaluation
tests using RAGAs (faithfulness, answer relevancy) and DeepEval (G-Eval).
"""

import os
from pathlib import Path
from typing import Literal
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings


class EvaluatorConfig(BaseModel):
    """Configuration for individual evaluators."""
    
    # RAGAs settings
    ragas_enabled: bool = True
    ragas_metrics: list[str] = Field(
        default=["faithfulness", "answer_relevancy"],
        description="RAGAs metrics to evaluate"
    )
    
    # DeepEval G-Eval settings
    deepeval_enabled: bool = True
    deepeval_metrics: list[str] = Field(
        default=["coherence", "helpfulness", "harmlessness"],
        description="DeepEval G-Eval metrics to evaluate"
    )
    
    # Evaluation model settings
    evaluation_model: str = "gpt-4o-mini"
    evaluation_model_fallback: str = "gpt-3.5-turbo"


class DatasetConfig(BaseModel):
    """Configuration for evaluation datasets."""
    
    dataset_path: str = "evaluation/datasets"
    train_split: float = 0.7
    test_split: float = 0.3
    
    # Synthetic data generation
    synthetic_generation_enabled: bool = True
    num_synthetic_samples: int = 50


class OutputConfig(BaseModel):
    """Configuration for evaluation outputs."""
    
    output_dir: str = "evaluation/results"
    save_detailed_results: bool = True
    save_aggregate_metrics: bool = True
    export_format: Literal["json", "csv", "both"] = "both"


class Settings(BaseSettings):
    """Main settings for the RAG evaluation testing agent."""
    
    # API Keys
    openai_api_key: str = ""  # For RAGAs/DeepEval evaluation
    mistral_api_key: str = ""  # Alternative: Use Mistral for evaluation
    google_api_key: str = ""  # Alternative: Use Gemini for evaluation (FREE tier!)
    
    # RAG Pipeline settings
    rag_api_base_url: str = "http://localhost:8000"
    rag_collection_name: str = "office_documents"
    
    # Component configurations
    evaluator: EvaluatorConfig = Field(default_factory=EvaluatorConfig)
    dataset: DatasetConfig = Field(default_factory=DatasetConfig)
    output: OutputConfig = Field(default_factory=OutputConfig)
    
    # Execution settings
    batch_size: int = 10
    max_concurrent_requests: int = 5
    timeout_seconds: int = 120
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "evaluation/evaluation.log"
    
    class Config:
        env_file = ".env"
        env_prefix = "EVAL_"


# Global settings instance
settings = Settings()


def get_evaluation_dir() -> Path:
    """Get the evaluation directory path."""
    return Path(__file__).parent


def get_datasets_dir() -> Path:
    """Get the datasets directory path."""
    return get_evaluation_dir() / "datasets"


def get_results_dir() -> Path:
    """Get the results directory path."""
    return get_evaluation_dir() / "results"


def ensure_directories():
    """Ensure all required directories exist."""
    get_datasets_dir().mkdir(parents=True, exist_ok=True)
    get_results_dir().mkdir(parents=True, exist_ok=True)
