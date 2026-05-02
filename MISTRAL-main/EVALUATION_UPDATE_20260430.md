# RAG Evaluation Dataset Update - Facility Booking Removal

## Date: 2026-04-30

## Changes Made

### 1. Evaluation Dataset Updates (eval_samples.json)

Updated 3 questions to reflect removal of facility booking/SSF services:

#### eval_008: "How can I book facilities or equipment at USTP?"
- **Old ground_truth**: Expected facility booking page (/facility-booking) with SSF details
- **New ground_truth**: States that facility booking and SSF have been removed, directs users to contact TPCO
- **Category changed**: facility_booking → website_navigation

#### eval_082: "What is the Shared Service Facility at USTP?"
- **Old ground_truth**: Expected SSF details (Advanced Materials Testing Lab, ₱500/hr, 10 researchers)
- **New ground_truth**: States SSF has been removed, directs users to contact TPCO
- **Category changed**: facilities → website_navigation

#### eval_099: "What technology does the Advanced Materials Testing Lab have?"
- **Old ground_truth**: Expected lab equipment details and booking info
- **New ground_truth**: States facility booking has been removed, directs users to contact TPCO
- **Category changed**: facilities → website_navigation

### 2. Knowledge Base Updates (USTP_TPCO_Website_Knowledge_Base.txt)

- Removed Section 8: "FACILITY BOOKING (SSF)"
- Added note in Section 10: "Facility booking and Shared Service Facility (SSF) features have been removed from the website"
- Updated Resources section to reflect only Templates and Guidelines tabs remain

### 3. ChromaDB Re-ingestion

- Reset and re-ingested all documents
- Total chunks stored: 911
- All references to facility booking removed from vector store

## Impact on Evaluation

### Expected Improvements:
- Questions about facility booking should now get higher faithfulness scores
- RAG will correctly state that the feature has been removed
- No more mismatch between expected ground truth and actual website state

### Previous Issue:
- RAG was retrieving irrelevant procedural documents for facility questions
- Ground truth expected specific details that no longer exist on website
- This contributed to low faithfulness scores (0.535)

## Current Website State (Resources Page):
- ✅ Templates tab (downloadable forms)
- ✅ Guidelines tab (research guidelines)
- ❌ Facilities tab (removed)
- ❌ SSF Booking (removed)
