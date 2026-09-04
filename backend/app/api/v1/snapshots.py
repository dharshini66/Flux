"""
Snapshot Management REST Endpoints.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.database import get_db
from app.db.models import User, MarketSnapshot, StockSnapshot
from app.api.deps import get_current_user
from app.services.snapshot_service import snapshot_service

router = APIRouter(prefix="/snapshots", tags=["Snapshots"])


class CheckInRequest(BaseModel):
    session_label: Optional[str] = "Manual Check-in"
    force_new_baseline: Optional[bool] = False


@router.post("/check-in")
async def perform_check_in(
    req: CheckInRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Core Snapshot Check-in pipeline:
    Compares current market state with user's previous baseline snapshot,
    ranks resulting meaningful changes, and freezes a new snapshot point.
    """
    result = await snapshot_service.process_user_check_in(
        session=db,
        user_id=current_user.id,
        session_label=req.session_label,
        force_new_baseline=req.force_new_baseline or False
    )
    return result


@router.get("/latest")
async def get_latest_snapshot(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve user's latest recorded baseline snapshot."""
    snap = await snapshot_service.get_latest_snapshot(db, current_user.id)
    if not snap:
        return {"has_snapshot": False, "snapshot": None}

    return {
        "has_snapshot": True,
        "snapshot": {
            "id": snap.id,
            "session_label": snap.session_label,
            "meaningful_changes_count": snap.meaningful_changes_count,
            "created_at": snap.created_at.isoformat(),
            "stocks": [
                {"symbol": ss.stock_symbol, "price": ss.price, "volume": ss.volume}
                for ss in snap.stock_snapshots
            ]
        }
    }


@router.get("/history")
async def get_snapshot_history(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve historical snapshot check-in points."""
    stmt = (
        select(MarketSnapshot)
        .where(MarketSnapshot.user_id == current_user.id)
        .order_by(desc(MarketSnapshot.created_at))
        .limit(limit)
    )
    res = await db.execute(stmt)
    snaps = res.scalars().all()

    return {
        "snapshots": [
            {
                "id": s.id,
                "session_label": s.session_label,
                "meaningful_changes_count": s.meaningful_changes_count,
                "created_at": s.created_at.isoformat()
            }
            for s in snaps
        ]
    }
