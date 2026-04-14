#!/usr/bin/env python
"""Quick Start Script for RAG Evaluation using Google Gemini.

This script uses Gemini's FREE tier for evaluation!
Get your free API key at: https://aistudio.google.com/apikey

Usage:
    python evaluation/run_with_gemini.py
"""

import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from evaluation import RAGTestingAgent, DatasetLoader


def main():
    """Run RAG evaluation using Google Gemini (FREE tier!)."""
    
    print("=" * 60)
    print("RAG Evaluation with Google Gemini (FREE!)")
    print("=" * 60)
    
    # Check for Google API key
    google_key = os.getenv("GOOGLE_API_KEY")
    if not google_key:
        # Try loading from .env file
        env_file = Path(__file__).parent.parent / ".env"
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    if line.startswith("GOOGLE_API_KEY"):
                        google_key = line.split("=", 1)[1].strip().strip('"')
                        break
    
    if not google_key:
        print("\nError: GOOGLE_API_KEY not found!")
        print("\n" + "=" * 60)
        print("Get your FREE API key in 30 seconds:")
        print("=" * 60)
        print("\n1. Go to: https://aistudio.google.com/apikey")
        print("2. Click 'Create API Key'")
        print("3. Copy the key")
        print("\nThen either:")
        print("  - Add to .env: GOOGLE_API_KEY=your-key-here")
        print("  - Or run: set GOOGLE_API_KEY=your-key-here")
        print("  - Or use: python -m evaluation.testing_agent --provider gemini --google-key YOUR_KEY")
        return
    
    print(f"\nUsing Gemini API key: {google_key[:10]}...")
    print("Model: gemini-1.5-flash (FREE tier: 15 RPM, 1M tokens/day)")
    
    # Initialize the testing agent with Gemini
    agent = RAGTestingAgent(
        google_api_key=google_key,
        provider="gemini",
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
    print("Starting Evaluation (using FREE Gemini tier)...")
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
    
    print("\n" + "=" * 60)
    print("Evaluation complete! Total cost: $0.00")
    print("=" * 60)


if __name__ == "__main__":
    main()
