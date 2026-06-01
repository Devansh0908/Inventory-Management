# Kargo — Inventory & Order Management System

Kargo is a premium, containerized B2B Inventory & Order Management System built with a Python FastAPI backend and a React (Vite + Tailwind CSS) frontend, featuring a refined minimalism visual style.

---

## 1. Project Overview

Kargo provides a modern single source of truth for wholesale businesses and enterprise SaaS. It tracks inventory, captures snapshot prices at order time, enforces atomic stock counts, prevents negative inventory levels, handles customer registries, and automatically aggregates metrics on a responsive, editorial SaaS dashboard.

---

## 2. Tech Stack

*   **Backend**: Python, FastAPI, SQLAlchemy (async/asyncpg), PostgreSQL
*   **Frontend**: React (Vite), Axios, Tailwind CSS, React Router v6, React Hook Form, Lucide Icons
*   **Database**: PostgreSQL (Docker locally, Supabase in production)
*   **Containerization**: Docker, Docker Compose

---

## 3. Local Development Setup

### A. Prerequisites
Make sure you have the following installed on your machine:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with Docker Compose)
*   [Git](https://git-scm.com/)

### B. Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/Devansh0908/Inventory-Management.git inventory-management
cd inventory-management
```

### C. Create Environment Configuration
Copy the sample environment variables from the root folder:
```bash
cp .env.example .env
```
Fill in any custom database credentials if desired. The defaults are already configured for local Docker database initialization out-of-the-box.

### D. Run the Containers
Compile the Docker images and run the full orchestration stack:
```bash
docker compose up --build
```
This command starts:
1.  **db**: A PostgreSQL container listening on port `5433` of the host (forwarding to `5432` internally).
2.  **backend**: A FastAPI server listening on port `8001` of the host (forwarding to `8000` internally).
3.  **frontend**: A React application served via Nginx listening on port `3001` of the host (forwarding to `80` internally).

### E. Access Links
Once the services are active, you can access them via:
*   **Kargo Landing Page / Portal**: [http://localhost:3001](http://localhost:3001)
*   **FastAPI API Base / Health**: [http://localhost:8001](http://localhost:8001)
*   **Interactive API Docs (FastAPI Swagger UI)**: [http://localhost:8001/docs](http://localhost:8001/docs)

---

## 4. Deployment Guide

### Database (Supabase)
1.  Go to [supabase.com](https://supabase.com) and create a **New Project**.
2.  Once setup is complete, navigate to **Project Settings** → **Database**.
3.  Scroll down to the **Connection String** section and copy the **URI** connection string.
4.  Replace `[YOUR-PASSWORD]` in the copied string with the database password you chose during project creation.
5.  Use this database URI as the `DATABASE_URL` environment variable for your backend server.

### Backend (Render)
1.  Sign in to [render.com](https://render.com) and click **New** → **Web Service**.
2.  Connect your GitHub repository.
3.  Set the **Root Directory** to `/backend`.
4.  Configure the build details:
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5.  Under **Advanced**, click **Add Environment Variable** and enter:
    *   `DATABASE_URL`: *(Your Supabase connection string copied above)*
6.  Deploy the service and copy the provided web service URL (e.g., `https://your-backend.onrender.com`).

### Frontend (Vercel)
1.  Sign in to [vercel.com](https://vercel.com) and click **Add New** → **Project**.
2.  Import your GitHub repository.
3.  Set the **Root Directory** to `frontend`.
4.  Ensure the **Framework Preset** is set to `Vite`.
5.  Under **Environment Variables**, add:
    *   `VITE_API_URL`: `https://your-backend.onrender.com/api` (the URL of your deployed Render backend with the `/api` suffix).
6.  Click **Deploy** and copy your live frontend URL.

### Docker Hub (Backend Image)
To package, test, and host the backend Docker container image on Docker Hub:
```bash
# Build the image from root
docker build -t yourdockerhubusername/inventory-backend:latest ./backend

# Authenticate with Docker Hub
docker login

# Push the built image
docker push yourdockerhubusername/inventory-backend:latest
```
Docker Hub URL: [https://hub.docker.com/r/yourdockerhubusername/inventory-backend](https://hub.docker.com/r/yourdockerhubusername/inventory-backend)

---

## 5. Environment Variables Reference

| Variable Name | Service | Description |
| :--- | :--- | :--- |
| `POSTGRES_USER` | `db` / `docker compose` | Username for the local PostgreSQL database service. |
| `POSTGRES_PASSWORD` | `db` / `docker compose` | Password for the local PostgreSQL database service. |
| `POSTGRES_DB` | `db` / `docker compose` | Database schema name initialized inside Postgres. |
| `DATABASE_URL` | `backend` | Database connection URI (`postgresql+asyncpg://...`) utilized by SQLAlchemy. |
| `VITE_API_URL` | `frontend` | The API root URL from which Axios makes backend request calls. |

---

## 6. API Endpoints Reference

| Method | Path | Description |
| :--- | :--- | :--- |
| **GET** | `/` | API status check, returns standard health diagnostic message. |
| **GET** | `/api/dashboard/stats` | Computes dashboard counts (products, customers, orders, total revenue) and low-stock items ($\le 5$). |
| **POST** | `/api/products` | Creates a new inventory product. Rejects duplicate SKUs. |
| **GET** | `/api/products` | Returns all products in the database inventory. |
| **GET** | `/api/products/{id}` | Returns details of a specific product. |
| **PUT** | `/api/products/{id}` | Modifies price, name, SKU, or quantity of a product. |
| **DELETE** | `/api/products/{id}` | Deletes a product from database if not referenced by active orders. |
| **POST** | `/api/customers` | Registers a customer account. Rejects duplicate email addresses. |
| **GET** | `/api/customers` | Returns all registered customers. |
| **GET** | `/api/customers/{id}` | Returns profile details of a customer. |
| **DELETE** | `/api/customers/{id}` | Deletes a customer account. |
| **POST** | `/api/orders` | Generates a customer order. Enforces stock checks and price snapshots. |
| **GET** | `/api/orders` | Returns a history list of all orders. |
| **GET** | `/api/orders/{id}` | Returns a detailed view of an order with its snapshotted items. |
| **DELETE** | `/api/orders/{id}` | Cancels an order, automatically restoring product stock counts. |
