"""
Changes & Explainability REST Endpoints.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import User
from app.api.deps import get_current_user
from app.services.snapshot_service import snapshot_service
from app.engine.change_engine import change_engine, StockDeltaContext
from app.engine.explainer import explainer
from app.services.market_data.service import market_service

router = APIRouter(prefix="/changes", tags=["Meaningful Changes"])


class ExplainRequest(BaseModel):
    symbol: str
    previous_price: float
    current_price: float
    current_volume: float
    typical_volume: float
    typical_volatility_pct: Optional[float] = 1.2
    high_52w: Optional[float] = 0.0
    low_52w: Optional[float] = 0.0


@router.get("")
async def get_changes_feed(
    filter_type: str = Query("ALL", description="Filter by category: ALL, HIGH_IMPACT, PRICE, VOLUME, VOLATILITY, NEW_52W_HIGH"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve ranked list of meaningful changes since the user's previous baseline check-in.
    Ranked strictly by mathematical significance rather than mere chronological recency.
    """
    # Run evaluation against latest snapshot baseline without overwriting it
    check_in_data = await snapshot_service.process_user_check_in(db, current_user.id, persist_new_snapshot=False)
    all_changes = check_in_data.get("changes", [])

    if filter_type == "HIGH_IMPACT":
        filtered = [c for c in all_changes if c["severity"] in ["HIGH", "CRITICAL"]]
    elif filter_type == "PRICE":
        filtered = [c for c in all_changes if any(et in ["PRICE_SURGE", "SIGNIFICANT_DROP"] for et in c["event_types"])]
    elif filter_type == "VOLUME":
        filtered = [c for c in all_changes if "UNUSUAL_VOLUME" in c["event_types"]]
    elif filter_type == "VOLATILITY":
        filtered = [c for c in all_changes if "VOLATILITY_EXPANSION" in c["event_types"]]
    elif filter_type == "NEW_52W_HIGH":
        filtered = [c for c in all_changes if any(et in ["NEW_52W_HIGH", "NEAR_52W_HIGH"] for et in c["event_types"])]
    else:
        filtered = all_changes

    return {
        "filter": filter_type,
        "is_first_visit": check_in_data.get("is_first_visit", False),
        "total_changes": len(filtered),
        "reference_timestamp": check_in_data.get("reference_timestamp"),
        "changes": filtered
    }


@router.get("/summary")
async def get_changes_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve compact headline and summary statistics for the 'Since Your Last Visit' hero.
    """
    check_in_data = await snapshot_service.process_user_check_in(db, current_user.id, persist_new_snapshot=False)
    return {
        "is_first_visit": check_in_data.get("is_first_visit", False),
        "headline": check_in_data.get("headline"),
        "subheadline": check_in_data.get("subheadline"),
        "meaningful_changes_count": check_in_data.get("meaningful_changes_count", 0),
        "breakdown": check_in_data.get("breakdown", {}),
        "reference_timestamp": check_in_data.get("reference_timestamp"),
        "tracked_stocks_count": check_in_data.get("tracked_stocks_count", 0),
        "top_changes": check_in_data.get("changes", [])[:4]
    }


@router.get("/thresholds")
async def get_engine_thresholds():
    """Returns the live configuration thresholds and factor weights of the Meaningful Change Engine."""
    from app.engine.thresholds import default_thresholds
    return default_thresholds.to_dict()


@router.post("/explain")
async def explain_change(req: ExplainRequest):
    """
    Returns full transparent mathematical factor decomposition and plain language
    diagnostics for 'Why Does This Matter?'.
    """
    ctx = StockDeltaContext(
        symbol=req.symbol.upper(),
        company_name=f"{req.symbol.upper()} Limited",
        previous_price=req.previous_price,
        current_price=req.current_price,
        current_volume=req.current_volume,
        typical_volume=req.typical_volume,
        typical_volatility_pct=req.typical_volatility_pct or 1.2,
        high_52w=req.high_52w or 0.0,
        low_52w=req.low_52w or 0.0
    )
    res = change_engine.evaluate_stock_change(ctx)
    return explainer.explain_evaluation(res)
