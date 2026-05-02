# RAG Pipeline Improvements for Faithfulness

## Changes Implemented

### 1. **Enhanced System Prompt** (rag_pipeline.py)
- **Strengthened context grounding instructions** (Section 1)
  - Added explicit warnings against adding information not in context
  - Emphasized: "Do NOT make assumptions, inferences, or elaborations beyond what the context says"
  - Added: "If you're tempted to add details not in the context, STOP and only use what's provided"
  - Clarified that answers should be "focused on what the context actually says, not what you think might be helpful"

### 2. **Improved Query Rewriting** (rag_pipeline.py)
- **Enhanced definitional query patterns**:
  - Changed: "What is X?" → "X definition explanation overview" (was: "X definition meaning")
  - Added: "Who is X?" → "X role position" pattern
  - This improves vector search recall for people-related and definitional questions

### 3. **Enabled Re-ranking by Default** (rag_pipeline.py)
- Changed: `self.vector_store.search(enhanced_query)` → `self.vector_store.search(enhanced_query, rerank=True)`
- Cross-encoder re-ranking now applied to all queries for better context quality
- Re-ranker model: `cross-encoder/ms-marco-MiniLM-L-6-v2`

### 4. **Increased Retrieval Parameters** (config.py)
- **retrieval_top_k**: 10 → **15** (retrieve more candidates)
- **final_top_k**: 5 → **7** (keep more context after re-ranking)
- **max_context_tokens**: 1500 → **2500** (accommodate 5-7 chunks instead of 3-4)
- **relevance_score_threshold**: 0.4 → **0.35** (allow slightly more relevant chunks)

## Expected Impact

### Before:
- Faithfulness: **0.535** (Fair)
- 41% of questions had faithfulness < 0.5
- Main issues: hallucination, poor context retrieval for "What is" questions

### Expected After:
- Faithfulness: **0.70-0.80** (Good to Excellent)
- Reduced hallucination through stricter grounding
- Better context for definitional queries through improved rewriting + re-ranking
- More comprehensive context through increased chunk count

## Testing

Run the evaluation again to measure improvement:
```bash
cd c:\Users\jkcab\thesis\tcpo_thesis\MISTRAL-main
.\venv\Scripts\python.exe evaluation/simple_eval.py
```

## Files Modified
1. `MISTRAL-main/rag_pipeline.py` - System prompt, query rewriting, re-ranking
2. `MISTRAL-main/config.py` - Retrieval and context parameters
