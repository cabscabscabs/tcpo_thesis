"""Test cases for RAG Evaluation Testing Agent.

Run with: pytest evaluation/tests/ -v
"""

import json
import pytest
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock

# Skip tests if dependencies not installed
pytest.importorskip("ragas")
pytest.importorskip("deepeval")

from evaluation.config import Settings, EvaluatorConfig
from evaluation.dataset_loader import (
    DatasetLoader,
    EvaluationDataset,
    EvaluationSample,
    prepare_for_ragas,
    prepare_for_geval,
)


class TestDatasetLoader:
    """Tests for DatasetLoader."""
    
    @pytest.fixture
    def sample_dataset_dict(self):
        """Sample dataset as dictionary."""
        return [
            {
                "id": "test_001",
                "question": "What is TPCO?",
                "ground_truth": "TPCO is the Technology Promotion and Commercialization Office.",
                "category": "about",
                "expected_sources": ["about.txt"],
                "metadata": {"difficulty": "easy"},
            },
            {
                "id": "test_002",
                "question": "How do I file a patent?",
                "ground_truth": "To file a patent, submit Form 100 to IPOPHL.",
                "category": "procedures",
                "expected_sources": ["IP-Procedure.pdf"],
                "metadata": {"difficulty": "medium"},
            },
        ]
    
    @pytest.fixture
    def sample_dataset_file(self, tmp_path, sample_dataset_dict):
        """Create a temporary dataset file."""
        dataset_file = tmp_path / "test_dataset.json"
        with open(dataset_file, "w") as f:
            json.dump(sample_dataset_dict, f)
        return dataset_file
    
    def test_load_from_json(self, sample_dataset_file):
        """Test loading dataset from JSON file."""
        loader = DatasetLoader()
        dataset = loader.load_from_json(sample_dataset_file)
        
        assert dataset.name == "test_dataset"
        assert dataset.total_samples == 2
        assert len(dataset.samples) == 2
        
        # Check first sample
        sample = dataset.samples[0]
        assert sample.id == "test_001"
        assert sample.question == "What is TPCO?"
        assert sample.category == "about"
    
    def test_dataset_statistics(self, sample_dataset_file):
        """Test dataset statistics calculation."""
        loader = DatasetLoader()
        dataset = loader.load_from_json(sample_dataset_file)
        
        assert "about" in dataset.categories
        assert "procedures" in dataset.categories
        assert dataset.categories["about"] == 1
        assert dataset.categories["procedures"] == 1
    
    def test_get_samples_by_category(self, sample_dataset_file):
        """Test filtering samples by category."""
        loader = DatasetLoader()
        dataset = loader.load_from_json(sample_dataset_file)
        
        about_samples = dataset.get_samples_by_category("about")
        assert len(about_samples) == 1
        assert about_samples[0].id == "test_001"
    
    def test_prepare_for_ragas(self, sample_dataset_file):
        """Test preparing dataset for RAGAs evaluation."""
        loader = DatasetLoader()
        dataset = loader.load_from_json(sample_dataset_file)
        
        # Populate with mock data
        for sample in dataset.samples:
            sample.generated_answer = "Mock answer"
            sample.retrieved_contexts = ["Mock context"]
        
        data = prepare_for_ragas(dataset)
        
        assert "questions" in data
        assert "ground_truths" in data
        assert "answers" in data
        assert "contexts" in data
        assert len(data["questions"]) == 2
    
    def test_prepare_for_geval(self, sample_dataset_file):
        """Test preparing dataset for G-Eval evaluation."""
        loader = DatasetLoader()
        dataset = loader.load_from_json(sample_dataset_file)
        
        # Populate with mock data
        for sample in dataset.samples:
            sample.generated_answer = "Mock answer"
            sample.retrieved_contexts = ["Mock context"]
        
        data = prepare_for_geval(dataset)
        
        assert "questions" in data
        assert "answers" in data
        assert "contexts" in data
        assert "ground_truths" in data
    
    def test_create_synthetic_dataset(self):
        """Test synthetic dataset generation."""
        loader = DatasetLoader()
        dataset = loader.create_synthetic_dataset(num_samples=10)
        
        assert dataset.total_samples == 10
        assert all(s.metadata.get("synthetic") for s in dataset.samples)
    
    def test_save_and_load_dataset(self, tmp_path, sample_dataset_file):
        """Test saving and reloading dataset."""
        loader = DatasetLoader()
        dataset = loader.load_from_json(sample_dataset_file)
        
        # Save to new location
        output_path = tmp_path / "saved_dataset.json"
        loader.save_to_json(dataset, output_path)
        
        # Reload
        reloaded = loader.load_from_json(output_path)
        assert reloaded.total_samples == dataset.total_samples


class TestConfig:
    """Tests for configuration."""
    
    def test_evaluator_config_defaults(self):
        """Test default evaluator configuration."""
        config = EvaluatorConfig()
        
        assert config.ragas_enabled is True
        assert "faithfulness" in config.ragas_metrics
        assert "answer_relevancy" in config.ragas_metrics
        assert config.deepeval_enabled is True
        assert "coherence" in config.deepeval_metrics
    
    def test_settings_defaults(self):
        """Test default settings."""
        settings = Settings()
        
        assert settings.rag_api_base_url == "http://localhost:8000"
        assert settings.batch_size == 10


class TestEvaluationSample:
    """Tests for EvaluationSample dataclass."""
    
    def test_sample_creation(self):
        """Test creating an evaluation sample."""
        sample = EvaluationSample(
            id="test_001",
            question="Test question?",
            ground_truth="Test answer.",
            category="test",
            expected_sources=["doc.pdf"],
            metadata={"difficulty": "easy"},
        )
        
        assert sample.id == "test_001"
        assert sample.question == "Test question?"
        assert sample.generated_answer == ""
        assert sample.retrieved_contexts == []
    
    def test_sample_with_populated_data(self):
        """Test sample with populated RAG data."""
        sample = EvaluationSample(
            id="test_001",
            question="Test question?",
            ground_truth="Test answer.",
            category="test",
            expected_sources=["doc.pdf"],
        )
        
        sample.generated_answer = "Generated answer"
        sample.retrieved_contexts = ["Context 1", "Context 2"]
        
        assert sample.generated_answer == "Generated answer"
        assert len(sample.retrieved_contexts) == 2


class TestEvaluationDataset:
    """Tests for EvaluationDataset dataclass."""
    
    def test_dataset_creation(self):
        """Test creating an evaluation dataset."""
        samples = [
            EvaluationSample(
                id=f"test_{i}",
                question=f"Question {i}?",
                ground_truth=f"Answer {i}.",
                category="test",
                expected_sources=[],
                metadata={"difficulty": "easy" if i % 2 == 0 else "hard"},
            )
            for i in range(5)
        ]
        
        dataset = EvaluationDataset(name="test_dataset", samples=samples)
        
        assert dataset.name == "test_dataset"
        assert dataset.total_samples == 5
        assert dataset.categories["test"] == 5
        assert dataset.difficulty_distribution["easy"] == 3
        assert dataset.difficulty_distribution["hard"] == 2
    
    def test_to_dict(self):
        """Test converting dataset to dictionary."""
        samples = [
            EvaluationSample(
                id="test_001",
                question="Test?",
                ground_truth="Answer.",
                category="test",
                expected_sources=[],
            )
        ]
        
        dataset = EvaluationDataset(name="test", samples=samples)
        data = dataset.to_dict()
        
        assert data["name"] == "test"
        assert data["total_samples"] == 1
        assert len(data["samples"]) == 1


# Integration tests (require API keys)
@pytest.mark.integration
class TestRAGAsEvaluator:
    """Integration tests for RAGAs evaluator."""
    
    @pytest.fixture
    def mock_openai_key(self, monkeypatch):
        """Mock OpenAI API key."""
        monkeypatch.setenv("OPENAI_API_KEY", "sk-test-key")
    
    def test_evaluator_initialization(self, mock_openai_key):
        """Test RAGAs evaluator initialization."""
        from evaluation.ragas_evaluator import RAGAsEvaluator
        
        # This will fail without a real API key, so we just test the structure
        with patch("evaluation.ragas_evaluator.ChatOpenAI"):
            with patch("evaluation.ragas_evaluator.OpenAIEmbeddings"):
                evaluator = RAGAsEvaluator(openai_api_key="test-key")
                assert evaluator.metrics is not None
    
    def test_interpret_score(self):
        """Test score interpretation."""
        from evaluation.ragas_evaluator import RAGAsEvaluator
        
        assert "Excellent" in RAGAsEvaluator.interpret_score(0.9)
        assert "Good" in RAGAsEvaluator.interpret_score(0.7)
        assert "Fair" in RAGAsEvaluator.interpret_score(0.5)
        assert "Poor" in RAGAsEvaluator.interpret_score(0.3)


@pytest.mark.integration
class TestGEvalEvaluator:
    """Integration tests for G-Eval evaluator."""
    
    def test_interpret_score(self):
        """Test score interpretation."""
        from evaluation.geval_evaluator import GEvalEvaluator
        
        assert "Excellent" in GEvalEvaluator.interpret_score(0.9, "Coherence")
        assert "Good" in GEvalEvaluator.interpret_score(0.7, "Helpfulness")
        assert "Fair" in GEvalEvaluator.interpret_score(0.5, "Harmlessness")
        assert "Poor" in GEvalEvaluator.interpret_score(0.3, "Coherence")


# Run integration tests only with: pytest -m integration
