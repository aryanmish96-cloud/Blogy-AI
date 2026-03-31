# 🚀 Blogy AI: Deployment Guide

This guide provides step-by-step instructions for deploying the **Blogy AI** ecosystem to various platforms.

## 🛠️ Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed (for containerized deployment).
- [Node.js 18+](https://nodejs.org/en/) (for local building).
- [MySQL 8.0+](https://dev.mysql.com/downloads/installer/) (if not using Docker).
- **OpenAI API Key** (for real AI content generation).

---

## 🏗️ Option 1: One-Click Deployment with Docker

The easiest way to run the full stack (Frontend, Backend, Database) is using **Docker Compose**.

1.  **Open your terminal** in the root of the project.
2.  **Set your OpenAI Key** (optional):
    ```bash
    export OPENAI_API_KEY="your-api-key-here"
    ```
3.  **Spin up the stack**:
    ```bash
    docker-compose up -d --build
    ```
4.  **Access the app**:
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend API**: [http://localhost:8000](http://localhost:8000)

---

## 🌐 Option 2: Hybrid Cloud (Vercel + Render/Railway)

This method is recommended for production-grade performance.

### 1. Database (Cloud MySQL)
- Use a managed service like **Aiven**, **TiDB Cloud**, or **Railway MySQL**.
- Create a database named `blogy`.
- Note down your connection string (Host, User, Password, Port).

### 2. Backend (Render / Railway)
- **Repo**: Push the project to GitHub.
- **Service Type**: Web Service (Python).
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
- **Environment Variables**:
    - `DB_HOST`: Your cloud database host.
    - `DB_USER`: Your cloud database user.
    - `DB_PASSWORD`: Your cloud database password.
    - `DB_NAME`: `blogy`
    - `OPENAI_API_KEY`: Your key.

### 3. Frontend (Vercel)
- **Import Project**: Select the `frontend` folder.
- **Framework**: Next.js.
- **Build Command**: `npm run build`
- **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: Your deployed Backend URL (e.g., `https://blogy-api.onrender.com`). **(CRITICAL: Do not include a trailing slash)**

### 4. Vercel Root Directory
- If your 404 persists, ensure the **Root Directory** in Vercel Project Settings is set to `frontend`.

---

## 📝 Important Notes
- **MySQL Initializer**: The backend will automatically create the `blogy` database and `users` table on first run if the user has correct permissions.
- **Port Mapping**: Ensure port `8000` (Backend) and `3000` (Frontend) are not being used by other services.
- **CORS**: The backend is configured to allow all origins (`*`) for the hackathon prototype. For production, restrict this to your frontend URL in `main.py`.

---

## 🏆 Deployment Verification
1. Navigate to `/api/dashboard-stats` on your backend to ensure it's healthy.
2. Log in with `admin@blogy.ai` / `password123` (initial default account created on DB init).
