"""Interactive CLI for querying the Office RAG system.

Usage:
    python query_cli.py              # Start interactive mode
    python query_cli.py "question"   # Ask a single question
"""

import sys

from rag_pipeline import RAGPipeline


def print_result(result: dict) -> None:
    """Pretty-print a query result."""
    print()
    print(result["answer"])

    if result["sources"]:
        print()
        print("Sources:", ", ".join(result["sources"]))

    if result["was_filtered"]:
        print("(Question was outside office scope)")
    print()


def interactive_mode(pipeline: RAGPipeline) -> None:
    """Run an interactive question-answer loop."""
    print("Office Information Assistant")
    print("Type 'quit' or 'exit' to stop.\n")

    while True:
        try:
            question = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not question:
            continue
        if question.lower() in ("quit", "exit", "q"):
            print("Goodbye!")
            break

        try:
            result = pipeline.query(question)
            print_result(result)
        except ConnectionError as e:
            print(f"\nError: {e}\n")
        except Exception as e:
            print(f"\nUnexpected error: {e}\n")


def main():
    pipeline = RAGPipeline()
    print(f"Vector store contains {pipeline.vector_store.count()} document chunks.\n")

    if len(sys.argv) > 1:
        question = " ".join(sys.argv[1:])
        result = pipeline.query(question)
        print_result(result)
    else:
        interactive_mode(pipeline)


if __name__ == "__main__":
    main()
