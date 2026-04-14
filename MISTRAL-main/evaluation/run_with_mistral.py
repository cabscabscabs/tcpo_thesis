#!/usr/bin/env python
"""Quick Start Script for RAG Evaluation.

This script demonstrates how to run RAG evaluation using your existing
Mistral API key (no OpenAI required).

Usage:
    python evaluation/run_with_mistral.py
"""

import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from evaluation import RAGTestingAgent, DatasetLoader


def main():
    """Run RAG evaluation using Mistral Cloud API."""
    
    print("=" * 60)
    print("RAG Evaluation with Mistral Cloud API")
    print("=" * 60)
    
    # Check for Mistral API key
    mistral_key = os.getenv("MISTRAL_API_KEY")
    if not mistral_key:
        # Try loading from .env file
        env_file = Path(__file__).parent.parent / ".env"
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    if line.startswith("MISTRAL_API_KEY"):
                        mistral_key = line.split("=", 1)[1].strip().strip('"')
                        break
    
    if not mistral_key:
        print("\nError: MISTRAL_API_KEY not found!")
        print("\nPlease set your Mistral API key:")
        print("  1. Create a .env file in MISTRAL-main/ directory")
        print("  2. Add: MISTRAL_API_KEY=your-api-key-here")
        print("\nOr set it as an environment variable:")
        print("  export MISTRAL_API_KEY=your-api-key-here  (Linux/Mac)")
        print("  set MISTRAL_API_KEY=your-api-key-here     (Windows)")
        return
    
    print(f"\nUsing Mistral API key: {mistral_key[:10]}...")
    
    # Initialize the testing agent with Mistral
    agent = RAGTestingAgent(
        mistral_api_key=mistral_key,
        provider="mistral",
    )
    
    # Check if RAG server is running
    print("\nChecking RAG server connection...")
    if agent.check_rag_health():
        print("RAG server is running!")
    else:
        print("Warning: RAG server is not responding.")
        print("Start it with: python api_server.py")
        print("\nContinuing with evaluation (will use empty contexts)...")
    
    # Load the dataset
    print("\nLoading evaluation dataset...")
    dataset_path = Path(__file__).parent / "datasets" / "eval_samples.json"
    if not dataset_path.exists():
        print(f"Error: Dataset not found at {dataset_path}")
        return
    
    loader = DatasetLoader()
    dataset = loader.load_from_json(dataset_path)
    print(f"Loaded {dataset.total_samples} evaluation samples")
    
    # Run evaluation
    print("\n" + "=" * 60)
    print("Starting Evaluation...")
    print("=" * 60)
    
    report = agent.run_evaluation(
        dataset=dataset,
        run_ragas=True,
        run_geval=True,
    )
    
    # Print summary
    agent.print_report_summary(report)
    
    # Save results
    saved_files = agent.save_report(report)
    print(f"\nResults saved to:")
    for name, path in saved_files.items():
        print(f"  {name}: {path}")


if __name__ == "__main__":
    main()
