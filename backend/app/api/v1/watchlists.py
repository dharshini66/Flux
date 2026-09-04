"""
Watchlist REST Endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import User
from app.api.deps import get_current_user
from app.services.watchlist_service import watchlist_service

router = APIRouter(prefix="/watchlists", tags=["Watchlists"])


class CreateWatchlistRequest(BaseModel):
    name: str
    description: Optional[str] = None
    is_default: bool = False


class UpdateWatchlistRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_default: Optional[bool] = None


class AddStockRequest(BaseModel):
    symbol: str
    is_priority: bool = False
    notes: Optional[str] = None


@router.get("")
async def list_watchlists(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all watchlists and their constituent stocks for the user."""
    return await watchlist_service.get_user_watchlists(db, current_user.id)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_watchlist(
    req: CreateWatchlistRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    wl = await watchlist_service.create_watchlist(
        db, current_user.id, req.name, req.description, req.is_default
    )
    return {"id": wl.id, "name": wl.name, "description": wl.description, "is_default": wl.is_default}


@router.patch("/{watchlist_id}")
async def update_watchlist(
    watchlist_id: str,
    req: UpdateWatchlistRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    wl = await watchlist_service.update_watchlist(
        db, watchlist_id, current_user.id, req.name, req.description, req.is_default
    )
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found or unauthorized.")
    return {"id": wl.id, "name": wl.name, "description": wl.description, "is_default": wl.is_default}


@router.delete("/{watchlist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_watchlist(
    watchlist_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    success = await watchlist_service.delete_watchlist(db, watchlist_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Watchlist not found or unauthorized.")
    return None


@router.post("/{watchlist_id}/stocks", status_code=status.HTTP_201_CREATED)
async def add_stock(
    watchlist_id: str,
    req: AddStockRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        ws = await watchlist_service.add_stock_to_watchlist(
            db, watchlist_id, current_user.id, req.symbol, req.is_priority, req.notes
        )
        return {"id": ws.id, "symbol": ws.stock_symbol, "is_priority": ws.is_priority}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{watchlist_id}/stocks/{symbol}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_stock(
    watchlist_id: str,
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    success = await watchlist_service.remove_stock_from_watchlist(
        db, watchlist_id, current_user.id, symbol
    )
    if not success:
        raise HTTPException(status_code=404, detail="Stock not found in watchlist.")
    return None


@router.post("/{watchlist_id}/stocks/{symbol}/priority")
async def toggle_priority(
    watchlist_id: str,
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_state = await watchlist_service.toggle_priority_stock(
        db, watchlist_id, current_user.id, symbol
    )
    if new_state is None:
        raise HTTPException(status_code=404, detail="Stock or watchlist not found.")
    return {"symbol": symbol.upper(), "is_priority": new_state}
