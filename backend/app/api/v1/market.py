"""
Market Quotes, Status, Pulse, and Demo Scenario Endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel
from app.services.market_data.service import market_service
from app.core.cache import shared_cache

router = APIRouter(prefix="/market", tags=["Market Data"])


class ScenarioSwitchRequest(BaseModel):
    scenario: str  # "default", "large_surge", "market_crash", "stale_data", "provider_failure", "no_signal_quiet", "market_closed"


@router.get("/status")
async def get_market_status():
    """Retrieve market exchange trading status and server clock."""
    session = await market_service.get_market_session()
    return {
        "status": session.status.value,
        "exchange": session.exchange,
        "current_time": session.current_time.isoformat(),
        "is_trading_active": session.is_trading_active,
        "session_open_time": session.session_open_time,
        "session_close_time": session.session_close_time,
    }


@router.get("/quotes")
async def get_quotes(symbols: str = Query(..., description="Comma-separated stock symbols (e.g. INFY,TCS,RELIANCE)")):
    """Fetch real-time quotes with shared cache optimization and freshness flags."""
    sym_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    quotes_map = await market_service.get_quotes_batch(sym_list)
    return {sym: q.to_dict() for sym, q in quotes_map.items()}


@router.get("/pulse")
async def get_market_pulse():
    """Retrieve signature Market Pulse horizontal timeline events across market session."""
    events = await market_service.get_market_pulse()
    return {"events": events}


@router.post("/scenario")
async def switch_scenario(req: ScenarioSwitchRequest):
    """
    Switch active deterministic scenario for evaluator testing on demand.
    Instantly flushes shared cache to reflect new scenario.
    """
    market_service.set_demo_scenario(req.scenario)
    await shared_cache.clear()
    return {
        "active_scenario": req.scenario,
        "message": f"Successfully switched to scenario: '{req.scenario}'. Shared cache invalidated."
    }
