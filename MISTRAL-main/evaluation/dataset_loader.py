"""Dataset Loader for RAG Evaluation.

This module handles loading, managing, and preparing evaluation datasets
for the RAG testing pipeline.
"""

import json
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd

from evaluation.config import get_datasets_dir, settings


@dataclass
class EvaluationSample:
    """A single evaluation sample."""
    
    id: str
    question: str
    ground_truth: str
    category: str
    expected_sources: list[str]
    metadata: dict = field(default_factory=dict)
    
    # These will be populated during evaluation
    retrieved_contexts: list[str] = field(default_factory=list)
    generated_answer: str = ""
    sources: list[str] = field(default_factory=list)


@dataclass
class EvaluationDataset:
    """Collection of evaluation samples."""
    
    name: str
    samples: list[EvaluationSample]
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    
    # Statistics
    categories: dict[str, int] = field(default_factory=dict)
    difficulty_distribution: dict[str, int] = field(default_factory=dict)
    
    def __post_init__(self):
        """Calculate statistics after initialization."""
        self._calculate_statistics()
    
    def _calculate_statistics(self):
        """Calculate dataset statistics."""
        self.categories = {}
        self.difficulty_distribution = {}
        
        for sample in self.samples:
            # Count categories
            cat = sample.category
            self.categories[cat] = self.categories.get(cat, 0) + 1
            
            # Count difficulties
            diff = sample.metadata.get("difficulty", "unknown")
            self.difficulty_distribution[diff] = self.difficulty_distribution.get(diff, 0) + 1
    
    @property
    def total_samples(self) -> int:
        return len(self.samples)
    
    def get_samples_by_category(self, category: str) -> list[EvaluationSample]:
        """Get all samples in a specific category."""
        return [s for s in self.samples if s.category == category]
    
    def get_samples_by_difficulty(self, difficulty: str) -> list[EvaluationSample]:
        """Get all samples with a specific difficulty."""
        return [s for s in self.samples if s.metadata.get("difficulty") == difficulty]
    
    def to_dict(self) -> dict:
        """Convert to dictionary for serialization."""
        return {
            "name": self.name,
            "created_at": self.created_at,
            "total_samples": self.total_samples,
            "categories": self.categories,
            "difficulty_distribution": self.difficulty_distribution,
            "samples": [
                {
                    "id": s.id,
                    "question": s.question,
                    "ground_truth": s.ground_truth,
                    "category": s.category,
                    "expected_sources": s.expected_sources,
                    "metadata": s.metadata,
                }
                for s in self.samples
            ],
        }


class DatasetLoader:
    """Load and manage evaluation datasets."""
    
    def __init__(self, datasets_dir: Path | None = None):
        """Initialize dataset loader.
        
        Args:
            datasets_dir: Directory containing dataset files.
        """
        self.datasets_dir = datasets_dir or get_datasets_dir()
        self.datasets_dir.mkdir(parents=True, exist_ok=True)
    
    def load_from_json(self, filepath: str | Path) -> EvaluationDataset:
        """Load dataset from a JSON file.
        
        Expected JSON format:
        [
            {
                "id": "eval_001",
                "question": "What is...?",
                "ground_truth": "The answer is...",
                "category": "services",
                "expected_sources": ["doc1.pdf", "doc2.pdf"],
                "metadata": {"difficulty": "easy", "domain": "patent"}
            },
            ...
        ]
        
        Args:
            filepath: Path to JSON file
            
        Returns:
            EvaluationDataset object
        """
        filepath = Path(filepath)
        
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        samples = []
        for item in data:
            sample = EvaluationSample(
                id=item.get("id", f"sample_{len(samples)}"),
                question=item["question"],
                ground_truth=item["ground_truth"],
                category=item.get("category", "general"),
                expected_sources=item.get("expected_sources", []),
                metadata=item.get("metadata", {}),
            )
            samples.append(sample)
        
        dataset_name = filepath.stem
        return EvaluationDataset(name=dataset_name, samples=samples)
    
    def load_from_csv(self, filepath: str | Path) -> EvaluationDataset:
        """Load dataset from a CSV file.
        
        Expected CSV columns:
        - id, question, ground_truth, category, expected_sources (semicolon-separated), difficulty
        
        Args:
            filepath: Path to CSV file
            
        Returns:
            EvaluationDataset object
        """
        filepath = Path(filepath)
        df = pd.read_csv(filepath)
        
        samples = []
        for _, row in df.iterrows():
            sources = []
            if "expected_sources" in row and pd.notna(row["expected_sources"]):
                sources = [s.strip() for s in str(row["expected_sources"]).split(";")]
            
            sample = EvaluationSample(
                id=str(row.get("id", f"sample_{len(samples)}")),
                question=str(row["question"]),
                ground_truth=str(row["ground_truth"]),
                category=str(row.get("category", "general")),
                expected_sources=sources,
                metadata={
                    "difficulty": str(row.get("difficulty", "medium")),
                },
            )
            samples.append(sample)
        
        dataset_name = filepath.stem
        return EvaluationDataset(name=dataset_name, samples=samples)
    
    def save_to_json(
        self,
        dataset: EvaluationDataset,
        filepath: str | Path | None = None,
    ) -> Path:
        """Save dataset to a JSON file.
        
        Args:
            dataset: Dataset to save
            filepath: Output path (optional)
            
        Returns:
            Path to saved file
        """
        if filepath is None:
            filepath = self.datasets_dir / f"{dataset.name}.json"
        else:
            filepath = Path(filepath)
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(dataset.to_dict(), f, indent=2)
        
        return filepath
    
    def list_available_datasets(self) -> list[str]:
        """List all available dataset files."""
        datasets = []
        
        for ext in [".json", ".csv"]:
            for f in self.datasets_dir.glob(f"*{ext}"):
                datasets.append(f.stem)
        
        return sorted(set(datasets))
    
    def create_synthetic_dataset(
        self,
        num_samples: int = 20,
        name: str = "synthetic",
    ) -> EvaluationDataset:
        """Create a synthetic dataset for testing purposes.
        
        This creates placeholder samples for testing the evaluation pipeline.
        
        Args:
            num_samples: Number of samples to generate
            name: Dataset name
            
        Returns:
            EvaluationDataset with synthetic samples
        """
        categories = ["services", "procedures", "ip_basics", "navigation", "patent_drafting"]
        difficulties = ["easy", "medium", "hard"]
        
        samples = []
        for i in range(num_samples):
            cat = categories[i % len(categories)]
            diff = difficulties[i % len(difficulties)]
            
            sample = EvaluationSample(
                id=f"synth_{i:03d}",
                question=f"Synthetic question {i+1} about {cat.replace('_', ' ')}?",
                ground_truth=f"Synthetic ground truth answer for question {i+1}.",
                category=cat,
                expected_sources=["synthetic_doc.pdf"],
                metadata={"difficulty": diff, "synthetic": True},
            )
            samples.append(sample)
        
        return EvaluationDataset(name=name, samples=samples)
    
    def merge_datasets(
        self,
        datasets: list[EvaluationDataset],
        name: str = "merged",
    ) -> EvaluationDataset:
        """Merge multiple datasets into one.
        
        Args:
            datasets: List of datasets to merge
            name: Name for merged dataset
            
        Returns:
            Merged EvaluationDataset
        """
        all_samples = []
        seen_ids = set()
        
        for ds in datasets:
            for sample in ds.samples:
                # Avoid duplicates by ID
                if sample.id not in seen_ids:
                    all_samples.append(sample)
                    seen_ids.add(sample.id)
        
        return EvaluationDataset(name=name, samples=all_samples)


def prepare_for_ragas(dataset: EvaluationDataset) -> dict:
    """Prepare dataset for RAGAs evaluation.
    
    Returns dictionary with lists needed by RAGAs evaluator.
    
    Args:
        dataset: EvaluationDataset to prepare
        
    Returns:
        Dictionary with questions, ground_truths, and placeholders for answers/contexts
    """
    return {
        "questions": [s.question for s in dataset.samples],
        "ground_truths": [s.ground_truth for s in dataset.samples],
        "answers": [s.generated_answer for s in dataset.samples],
        "contexts": [s.retrieved_contexts for s in dataset.samples],
    }


def prepare_for_geval(dataset: EvaluationDataset) -> dict:
    """Prepare dataset for G-Eval evaluation.
    
    Returns dictionary with lists needed by G-Eval evaluator.
    
    Args:
        dataset: EvaluationDataset to prepare
        
    Returns:
        Dictionary with questions, answers, contexts, and ground_truths
    """
    return {
        "questions": [s.question for s in dataset.samples],
        "answers": [s.generated_answer for s in dataset.samples],
        "contexts": [s.retrieved_contexts for s in dataset.samples],
        "ground_truths": [s.ground_truth for s in dataset.samples],
    }


if __name__ == "__main__":
    # Demo: Load sample dataset
    loader = DatasetLoader()
    
    print("Dataset Loader for RAG Evaluation")
    print("=" * 50)
    print("\nAvailable datasets:", loader.list_available_datasets())
    
    # Load sample dataset if it exists
    sample_path = Path(__file__).parent / "datasets" / "eval_samples.json"
    if sample_path.exists():
        dataset = loader.load_from_json(sample_path)
        print(f"\nLoaded dataset: {dataset.name}")
        print(f"Total samples: {dataset.total_samples}")
        print(f"Categories: {dataset.categories}")
        print(f"Difficulty distribution: {dataset.difficulty_distribution}")
