# TruthLens Deployment Guide

**Status:** Production Ready
**Architecture:** Containerized Microservices (Docker)

## 1. Quick Start (Local Production Simulation)

To run the entire stack locally in production mode:

```bash
# 1. Ensure Docker Desktop is running
# 2. Build and start services
docker-compose up --build -d

# 3. Access App
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

## 2. Cloud Deployment (Zero Config)

### Backend (Render / Railway / Fly.io)
1.  **Repo:** Push `backend/` folder to a Git repo.
2.  **Config:** Connect to Render/Railway.
3.  **Environment Variables:** Add your API keys from `.env`.
4.  **Build Command:** (Auto-detected from Dockerfile)
5.  **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel / Netlify)
1.  **Repo:** Push `frontend/` folder to a Git repo.
2.  **Config:** Connect to Vercel.
3.  **Build Command:** `npm run build`
4.  **Output Directory:** `dist`
5.  **Environment Variables:**
    - `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://truthlens-api.onrender.com/api/v1`)
    > **Note:** You may need to update the `fetch` calls in the code to use this environment variable instead of hardcoded `localhost:8000`.

## 3. Environment Variables
Ensure these are set in your production environment/secrets manager:

```ini
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
PHOEBE_API_KEY=...
```

## 4. Troubleshooting
- **CORS Issues:** If frontend cannot talk to backend, check `backend/app/main.py` CORS origins.
- **Database Persistence:** On ephemeral file systems (like standard Render instances), SQLite will reset on redeploy. For persistent storage, mount a volume or switch to PostgreSQL (Phase 6.2).
