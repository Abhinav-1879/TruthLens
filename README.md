# TruthLens Container Layer

TruthLens is a high-performance verification engine and containment layer designed to intercept, analyze, and score generative AI responses before they reach end-users. Built for zero-trust environments where hallucinations represent critical failure vectors.

![TruthLens Infrastructure](frontend/public/vite.svg) <!-- Replace with actual screenshot path -->

## Executive Summary

As organizations rapidly deploy Large Language Models (LLMs) into production, the risk of confident fabrications—"hallucinations"—remains the most significant barrier to adoption in high-stakes domains (Finance, Healthcare, Legal, Defense). TruthLens operates as a middleware containment layer that intercepts generative output, critically evaluates it using Natural Language Inference (NLI) techniques against trusted data sources, and applies an enterprise-grade hallucination risk score.

## Problem Statement

Generative AI models are optimized for fluency, not factual accuracy. When a model lacks information, it often degrades gracefully into plausible fabrication. For enterprise systems, a fluent lie is infinitely more dangerous than an obvious error. TruthLens solves the "Confident Fabrication Problem" by shifting the paradigm from *trusting* generative output to *cryptographically verifying* it against known realities.

## Architecture Overview

TruthLens operates synchronously between your application and the LLM endpoint.

1.  **Intercept:** application sends a prompt to TruthLens.
2.  **Generate:** TruthLens proxies the request to the upstream LLM (e.g., GPT-4, Claude).
3.  **Extract:** TruthLens extracts isolated, testable claims from the generated response.
4.  **Verify:** The NLI Engine validates each claim against trusted vector databases or live search mechanisms.
5.  **Score:** A deterministic mathematical formula calculates the Hallucination Risk Score based on logical entailment, contradiction, and neutral grounding.
6.  **Return:** The original response is returned to the client, enriched with the safety audit metadata.

## Hallucination Risk Scoring Logic

TruthLens abandons arbitrary "AI confidence" scores in favor of a mathematically consistent Entailment-Contradiction matrix.

*   Every claim extracted from a response is evaluated against the trusted source corpus.
*   The NLI model classifies the relationship as:
    *   **Entailment (Weight +1.0):** The source definitively supports the claim.
    *   **Contradiction (Weight -2.0):** The source explicitly contradicts the claim.
    *   **Neutral (Weight -0.5):** The source neither supports nor contradicts the claim (unverifiable).
*   **Final Score:** The aggregate weights formulate an *Integrity Score* (0-100) and a *Hallucination Risk* percentage. If the risk exceeds an organizational threshold, the response is quarantined.

## Tech Stack

**Frontend:**
*   React 18 + Vite
*   Tailwind CSS (Ultra-Premium Glassmorphism Aesthetic)
*   Framer Motion (Hardware-accelerated animations)
*   Lucide React (Iconography)

**Backend:**
*   FastAPI (High-performance async Python framework)
*   SQLModel / SQLite (Database ORM)
*   PyJWT & Passlib (JSON authentication)
*   Uvicorn (ASGI web server)

## Installation

### Prerequisites
*   Python 3.10+
*   Node.js 18+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env      # Add your API keys to the .env file
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to access the TruthLens interface.

## Future Improvements

*   **Vector Database Integration:** Migrate from ephemeral NLI context to persistent Pinecone/Milvus vector stores for enterprise-scale RAG verification.
*   **Streaming Support:** Implement Server-Sent Events (SSE) to stream validated tokens to the client in real-time while performing asynchronous risk scoring.
*   **Custom NLI Tuning:** Allow organizations to fine-tune the classification layer on domain-specific corpora (e.g., specialized medical knowledge bases).

## Screenshots

*(Add screenshots of the landing page, dashboard, and audit visualization here)*
