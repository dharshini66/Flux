"""
Watchlist Management Service for FLUX.
Handles multi-watchlist operations, priority flagging, and stock reordering.
"""
from typing import List, Dict, Any, Optional
from sqlalchemy import select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.db.models import Watchlist, WatchlistStock, Stock, User
from app.services.market_data.service import market_service
from app.services.market_data.base import FreshnessStatus


class WatchlistService:

    async def get_user_watchlists(self, session: AsyncSession, user_id: str) -> List[Dict[str, Any]]:
        """Fetch all watchlists owned by the user."""
        stmt = (
            select(Watchlist)
            .where(Watchlist.user_id == user_id)
            .options(
                selectinload(Watchlist.stocks).selectinload(WatchlistStock.stock)
            )
            .order_by(Watchlist.position, Watchlist.created_at)
        )
        res = await session.execute(stmt)
        watchlists = res.scalars().all()

        output = []
        for wl in watchlists:
            symbols = [ws.stock_symbol for ws in wl.stocks]
            quotes_map = await market_service.get_quotes_batch(symbols) if symbols else {}

            stocks_data = []
            for ws in wl.stocks:
                stock_meta = ws.stock
                q = quotes_map.get(ws.stock_symbol)
                stocks_data.append({
                    "id": ws.id,
                    "symbol": ws.stock_symbol,
                    "name": stock_meta.name if stock_meta else ws.stock_symbol,
                    "exchange": stock_meta.exchange if stock_meta else "NSE",
                    "sector": stock_meta.sector if stock_meta else "General",
                    "is_priority": ws.is_priority,
                    "position": ws.position,
                    "notes": ws.notes,
                    "price": q.price if q else 0.0,
                    "change_1d_pct": q.change_1d_pct if q else 0.0,
                    "change_1d_abs": q.change_1d_abs if q else 0.0,
                    "volume": q.volume if q else 0.0,
                    "high_52w": q.high_52w if q else 0.0,
                    "low_52w": q.low_52w if q else 0.0,
                    "freshness_status": q.freshness_status.value if q else FreshnessStatus.UNAVAILABLE.value,
                    "error_message": q.error_message if q else None
                })

            output.append({
                "id": wl.id,
                "name": wl.name,
                "description": wl.description,
                "is_default": wl.is_default,
                "position": wl.position,
                "stocks_count": len(stocks_data),
                "stocks": stocks_data,
                "created_at": wl.created_at.isoformat()
            })

        return output

    async def create_watchlist(
        self,
        session: AsyncSession,
        user_id: str,
        name: str,
        description: Optional[str] = None,
        is_default: bool = False
    ) -> Watchlist:
        """Create a new user watchlist."""
        wl = Watchlist(
            user_id=user_id,
            name=name,
            description=description,
            is_default=is_default
        )
        session.add(wl)
        await session.commit()
        await session.refresh(wl)
        return wl

    async def update_watchlist(
        self,
        session: AsyncSession,
        watchlist_id: str,
        user_id: str,
        name: Optional[str] = None,
        description: Optional[str] = None,
        is_default: Optional[bool] = None
    ) -> Optional[Watchlist]:
        """Update watchlist metadata."""
        stmt = select(Watchlist).where(Watchlist.id == watchlist_id, Watchlist.user_id == user_id)
        res = await session.execute(stmt)
        wl = res.scalars().first()
        if not wl:
            return None

        if name is not None:
            wl.name = name
        if description is not None:
            wl.description = description
        if is_default is not None:
            wl.is_default = is_default

        await session.commit()
        await session.refresh(wl)
        return wl

    async def delete_watchlist(self, session: AsyncSession, watchlist_id: str, user_id: str) -> bool:
        """Delete a watchlist."""
        stmt = select(Watchlist).where(Watchlist.id == watchlist_id, Watchlist.user_id == user_id)
        res = await session.execute(stmt)
        wl = res.scalars().first()
        if not wl:
            return False

        await session.delete(wl)
        await session.commit()
        return True

    async def add_stock_to_watchlist(
        self,
        session: AsyncSession,
        watchlist_id: str,
        user_id: str,
        symbol: str,
        is_priority: bool = False,
        notes: Optional[str] = None
    ) -> WatchlistStock:
        """Add a stock symbol to a watchlist with duplicate prevention."""
        sym = symbol.upper()
        # Verify watchlist belongs to user
        wl_stmt = select(Watchlist).where(Watchlist.id == watchlist_id, Watchlist.user_id == user_id)
        wl_res = await session.execute(wl_stmt)
        wl = wl_res.scalars().first()
        if not wl:
            raise ValueError("Watchlist not found or unauthorized.")

        # Ensure Stock exists in database catalog
        stock = await session.get(Stock, sym)
        if not stock:
            # Dynamically register stock if valid demo equity
            stock = Stock(
                symbol=sym,
                name=f"{sym} Corporation",
                exchange="NSE",
                high_52w=1500.0,
                low_52w=900.0,
                typical_daily_volume=3_000_000,
                typical_volatility_pct=1.4
            )
            session.add(stock)
            await session.flush()

        # Check for existing duplicate
        dup_stmt = select(WatchlistStock).where(
            WatchlistStock.watchlist_id == watchlist_id,
            WatchlistStock.stock_symbol == sym
        )
        dup_res = await session.execute(dup_stmt)
        if dup_res.scalars().first():
            raise ValueError(f"Stock '{sym}' already exists in this watchlist.")

        # Determine next position index
        pos_stmt = select(WatchlistStock).where(WatchlistStock.watchlist_id == watchlist_id)
        pos_res = await session.execute(pos_stmt)
        current_stocks = pos_res.scalars().all()
        next_pos = len(current_stocks)

        ws = WatchlistStock(
            watchlist_id=watchlist_id,
            stock_symbol=sym,
            is_priority=is_priority,
            position=next_pos,
            notes=notes
        )
        session.add(ws)
        await session.commit()
        await session.refresh(ws)
        return ws

    async def remove_stock_from_watchlist(
        self,
        session: AsyncSession,
        watchlist_id: str,
        user_id: str,
        symbol: str
    ) -> bool:
        """Remove a stock from a watchlist."""
        sym = symbol.upper()
        # Verify ownership
        wl_stmt = select(Watchlist).where(Watchlist.id == watchlist_id, Watchlist.user_id == user_id)
        wl_res = await session.execute(wl_stmt)
        if not wl_res.scalars().first():
            return False

        del_stmt = delete(WatchlistStock).where(
            WatchlistStock.watchlist_id == watchlist_id,
            WatchlistStock.stock_symbol == sym
        )
        res = await session.execute(del_stmt)
        await session.commit()
        return res.rowcount > 0

    async def toggle_priority_stock(
        self,
        session: AsyncSession,
        watchlist_id: str,
        user_id: str,
        symbol: str
    ) -> Optional[bool]:
        """Toggle priority star on a watchlist stock."""
        sym = symbol.upper()
        # Check ownership
        wl_stmt = select(Watchlist).where(Watchlist.id == watchlist_id, Watchlist.user_id == user_id)
        wl_res = await session.execute(wl_stmt)
        if not wl_res.scalars().first():
            return None

        stmt = select(WatchlistStock).where(
            WatchlistStock.watchlist_id == watchlist_id,
            WatchlistStock.stock_symbol == sym
        )
        res = await session.execute(stmt)
        ws = res.scalars().first()
        if not ws:
            return None

        ws.is_priority = not ws.is_priority
        await session.commit()
        return ws.is_priority


watchlist_service = WatchlistService()
