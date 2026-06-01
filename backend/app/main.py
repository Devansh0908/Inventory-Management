from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db
from app.routers import products_router, customers_router, orders_router, dashboard_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup
    await init_db()
    yield

app = FastAPI(
    title="Kargo API",
    description="Inventory & Order Management System API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(products_router, prefix="/api")
app.include_router(customers_router, prefix="/api")
app.include_router(orders_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API is running"}
