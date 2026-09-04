"""
Health Check, Readiness Probe, and Engine Observability Endpoints.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.database import get_db
from app.core.cache import shared_cache
from app.engine.thresholds import default_thresholds
from app.services.market_data.demo_provider import demo_market_provider

router = APIRouter(tags=["Health & Observability"])


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Comprehensive system healthcheck verifying DB, Cache, and Provider."""
    db_healthy = False
    try:
        await db.execute(text("SELECT 1"))
        db_healthy = True
    except Exception:
        db_healthy = False

    cache_metrics = await shared_cache.get_metrics()

    return {
        "status": "healthy" if db_healthy else "degraded",
        "service": "FLUX Market Intelligence Core",
        "version": "1.0.0",
        "database_connected": db_healthy,
        "shared_cache": cache_metrics,
        "active_provider": demo_market_provider.get_provider_name(),
        "active_scenario": demo_market_provider.current_scenario
    }


@router.get("/health/ready")
async def readiness_probe():
    return {"ready": True}


@router.get("/health/metrics")
async def engine_metrics():
    """Observability metrics for change engine thresholds and shared cache throughput."""
    cache_metrics = await shared_cache.get_metrics()
    return {
        "cache": cache_metrics,
        "thresholds": default_thresholds.to_dict()
    }
