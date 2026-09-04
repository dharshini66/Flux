"""
Main FastAPI Application Entrypoint for FLUX.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger
from app.db.database import init_db, AsyncSessionLocal
from app.db.seed import seed_database
from app.api.v1.auth import router as auth_router
from app.api.v1.watchlists import router as watchlists_router
from app.api.v1.market import router as market_router
from app.api.v1.stocks import router as stocks_router
from app.api.v1.changes import router as changes_router
from app.api.v1.snapshots import router as snapshots_router
from app.api.v1.missions import router as missions_router
from app.api.v1.health import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database and Seed Reference Data
    logger.info("Initializing FLUX Market Database...")
    await init_db()
    async with AsyncSessionLocal() as session:
        await seed_database(session)
    logger.info("Database schema initialized and seed data ready.")
    yield
    # Shutdown:
    logger.info("FLUX Backend stopping...")


app = FastAPI(
    title=settings.APP_NAME,
    description="FLUX — KNOW WHAT CHANGED. Production-Quality Market Watchlist Intelligence Core.",
    version="1.0.0",
    lifespan=lifespan
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred. The failure has been logged with sanitized context.",
            "path": request.url.path
        }
    )

# Include API Routers with /api/v1 prefix
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(watchlists_router, prefix=settings.API_V1_PREFIX)
app.include_router(market_router, prefix=settings.API_V1_PREFIX)
app.include_router(stocks_router, prefix=settings.API_V1_PREFIX)
app.include_router(changes_router, prefix=settings.API_V1_PREFIX)
app.include_router(snapshots_router, prefix=settings.API_V1_PREFIX)
app.include_router(missions_router, prefix=settings.API_V1_PREFIX)
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
# Direct health endpoint
app.include_router(health_router)


@app.get("/")
async def root():
    return {
        "product": "FLUX",
        "tagline": "KNOW WHAT CHANGED.",
        "description": "Intelligent market watchlist focus on signal over noise.",
        "api_v1_docs": "/docs",
        "status": "operational"
    }


if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", settings.PORT))
    host = os.environ.get("HOST", settings.HOST)
    uvicorn.run("app.main:app", host=host, port=port, reload=False)

