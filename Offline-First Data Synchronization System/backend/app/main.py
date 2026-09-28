from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.records import router as records_router
from app.routers.sync import router as sync_router
from app.routers.conflicts import router as conflicts_router
from app.routers.dashboard import router as dashboard_router
from app.routers.users import router as users_router


app = FastAPI(
    title="Offline-First Data Synchronization System",
    description="Full-stack offline-first synchronization platform",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication
app.include_router(auth_router)

# Records
app.include_router(records_router)

# Synchronization
app.include_router(sync_router)

# Conflict management
app.include_router(conflicts_router)

# Dashboard
app.include_router(dashboard_router)

# User management
app.include_router(users_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "offline-first-sync-api",
    }