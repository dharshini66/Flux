"""
Market Snapshot Service.
Manages first-class user baseline snapshots, computes cross-session deltas,
and drives the 'Since Your Last Visit' intelligence experience.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.db.models import (
    User, Watchlist, WatchlistStock, Stock,
    MarketSnapshot, StockSnapshot, MarketEvent
)
from app.services.market_data.service import market_service
from app.services.market_data.base import FreshnessStatus
from app.engine.change_engine import (
    change_engine, StockDeltaContext, ChangeEvaluationResult, SignalSeverity
)
from app.engine.explainer import explainer
from app.core.logging import logger
import json


class SnapshotService:
    """Manages baseline snapshots and meaningful change discovery."""

    async def get_latest_snapshot(self, session: AsyncSession, user_id: str) -> Optional[MarketSnapshot]:
        """Fetch the most recent snapshot for a given user."""
        stmt = (
            select(MarketSnapshot)
            .where(MarketSnapshot.user_id == user_id)
            .options(selectinload(MarketSnapshot.stock_snapshots))
            .order_by(desc(MarketSnapshot.created_at))
            .limit(1)
        )
        res = await session.execute(stmt)
        return res.scalars().first()

    async def process_user_check_in(
        self,
        session: AsyncSession,
        user_id: str,
        session_label: Optional[str] = "Market Check-in",
        force_new_baseline: bool = False,
        persist_new_snapshot: bool = True
    ) -> Dict[str, Any]:
        """
        Main check-in pipeline:
        1. Retrieve previous snapshot
        2. Get user's active watchlist stocks
        3. Fetch latest market data
        4. If First Visit or force_new_baseline: save baseline and return first-visit state
        5. If Returning Visit: compute significance delta vectors, rank changes, persist new snapshot
        """
        # 1. Fetch user & their watchlists
        user = await session.get(User, user_id)
        if not user:
            raise ValueError(f"User with ID {user_id} not found.")

        # Get all distinct stock symbols tracked across the user's watchlists
        stmt = (
            select(WatchlistStock.stock_symbol)
            .join(Watchlist)
            .where(Watchlist.user_id == user_id)
            .distinct()
        )
        res = await session.execute(stmt)
        tracked_symbols = [r[0] for r in res.fetchall()]

        if not tracked_symbols:
            # Fallback to default top stocks if user has empty watchlist
            tracked_symbols = ["INFY", "TCS", "RELIANCE", "HDFCBANK", "ICICIBANK"]

        # Fetch Stock metadata from DB
        stock_models_res = await session.execute(select(Stock).where(Stock.symbol.in_(tracked_symbols)))
        stock_dict = {s.symbol: s for s in stock_models_res.scalars().all()}

        # 2. Fetch current market quotes
        current_quotes = await market_service.get_quotes_batch(tracked_symbols)

        # 3. Retrieve previous snapshot
        previous_snapshot = None if force_new_baseline else await self.get_latest_snapshot(session, user_id)

        # 4. FIRST VISIT HANDLING
        if not previous_snapshot:
            # Create baseline snapshot without fabricating changes
            new_snapshot = MarketSnapshot(
                user_id=user_id,
                session_label="Initial Baseline Check-in",
                meaningful_changes_count=0
            )
            session.add(new_snapshot)
            await session.flush()

            for sym in tracked_symbols:
                q = current_quotes.get(sym)
                price = q.price if q and q.freshness_status != FreshnessStatus.UNAVAILABLE else 1000.0
                vol = q.volume if q else 100_000.0
                session.add(StockSnapshot(
                    snapshot_id=new_snapshot.id,
                    stock_symbol=sym,
                    price=price,
                    volume=vol,
                    high_52w=q.high_52w if q else 1200.0,
                    low_52w=q.low_52w if q else 800.0
                ))

            await session.commit()

            return {
                "is_first_visit": True,
                "headline": "YOUR WATCHLIST IS READY.",
                "subheadline": "We have established your baseline. On your next visit, FLUX will highlight what actually changed.",
                "meaningful_changes_count": 0,
                "changes": [],
                "breakdown": {
                    "price_movements": 0,
                    "unusual_volume": 0,
                    "new_52w_highs": 0,
                    "volatility_events": 0
                },
                "reference_timestamp": new_snapshot.created_at.isoformat(),
                "snapshot_id": new_snapshot.id,
                "tracked_stocks_count": len(tracked_symbols)
            }

        # 5. RETURNING VISIT COMPARISON
        prev_price_map = {ss.stock_symbol: ss.price for ss in previous_snapshot.stock_snapshots}
        evaluated_results: List[ChangeEvaluationResult] = []

        for sym in tracked_symbols:
            q = current_quotes.get(sym)
            if not q or q.freshness_status == FreshnessStatus.UNAVAILABLE or q.price <= 0:
                continue

            stock_meta = stock_dict.get(sym)
            company_name = stock_meta.name if stock_meta else f"{sym} Ltd."
            typical_vol = stock_meta.typical_daily_volume if stock_meta else 5_000_000
            typical_volatility = stock_meta.typical_volatility_pct if stock_meta else 1.2
            high_52w = stock_meta.high_52w if stock_meta else q.high_52w
            low_52w = stock_meta.low_52w if stock_meta else q.low_52w

            # Previous baseline price for this user
            prev_price = prev_price_map.get(sym, q.previous_close)

            ctx = StockDeltaContext(
                symbol=sym,
                company_name=company_name,
                previous_price=prev_price,
                current_price=q.price,
                current_volume=q.volume,
                typical_volume=typical_vol,
                typical_volatility_pct=typical_volatility,
                high_52w=high_52w,
                low_52w=low_52w,
                open_price=q.open_price,
                previous_close=q.previous_close
            )

            res = change_engine.evaluate_stock_change(ctx)
            evaluated_results.append(res)

        # Rank all results by significance score descending
        evaluated_results.sort(key=lambda x: x.significance_score, reverse=True)

        meaningful_changes = [r for r in evaluated_results if r.is_meaningful]

        # Categorize breakdown
        price_moves_count = sum(1 for r in meaningful_results_filter(meaningful_changes, ["PRICE_SURGE", "SIGNIFICANT_DROP"]))
        volume_events_count = sum(1 for r in meaningful_results_filter(meaningful_changes, ["UNUSUAL_VOLUME"]))
        highs_count = sum(1 for r in meaningful_results_filter(meaningful_changes, ["NEW_52W_HIGH", "NEAR_52W_HIGH"]))
        vol_events_count = sum(1 for r in meaningful_results_filter(meaningful_changes, ["VOLATILITY_EXPANSION"]))

        # Persist new Snapshot only when requested
        if persist_new_snapshot:
            new_snapshot = MarketSnapshot(
                user_id=user_id,
                session_label=session_label,
                meaningful_changes_count=len(meaningful_changes)
            )
            session.add(new_snapshot)
            await session.flush()

            for sym in tracked_symbols:
                q = current_quotes.get(sym)
                if q and q.price > 0:
                    session.add(StockSnapshot(
                        snapshot_id=new_snapshot.id,
                        stock_symbol=sym,
                        price=q.price,
                        volume=q.volume,
                        high_52w=q.high_52w,
                        low_52w=q.low_52w
                    ))
            await session.commit()
            active_snapshot_id = new_snapshot.id
        else:
            active_snapshot_id = previous_snapshot.id

        # Format serialized change cards
        formatted_changes = []
        for r in evaluated_results:
            q = current_quotes.get(r.symbol)
            fb = r.factor_breakdown
            formatted_changes.append({
                "symbol": r.symbol,
                "company_name": r.company_name,
                "severity": r.severity.value,
                "significance_score": r.significance_score,
                "signal_dots": r.signal_strength_dots,
                "signal_level": r.signal_level_int,
                "headline": r.headline,
                "event_types": [e.value for e in r.event_types],
                "price_change_pct": fb.price_change_pct,
                "volume_ratio": fb.volume_ratio,
                "current_price": q.price if q else 0.0,
                "previous_baseline_price": prev_price_map.get(r.symbol, q.previous_close if q else 0.0),
                "summary_bullets": r.summary_bullets,
                "plain_language_explanation": r.plain_language_explanation,
                "factor_breakdown": {
                    "price_score": fb.price_score,
                    "volume_score": fb.volume_score,
                    "volatility_score": fb.volatility_score,
                    "price_level_score": fb.price_level_score,
                    "contextual_score": fb.contextual_score,
                    "total_score": fb.total_score,
                    "is_52w_high": fb.is_52w_high,
                    "is_52w_low": fb.is_52w_low,
                    "distance_to_52w_high_pct": fb.distance_to_52w_high_pct
                },
                "is_meaningful": r.is_meaningful
            })

        return {
            "is_first_visit": False,
            "headline": "THE MARKET MOVED. HERE'S WHAT MATTERS.",
            "subheadline": f"Since your visit at {previous_snapshot.created_at.strftime('%I:%M %p, %b %d')}",
            "meaningful_changes_count": len(meaningful_changes),
            "changes": formatted_changes,
            "breakdown": {
                "price_movements": price_moves_count,
                "unusual_volume": volume_events_count,
                "new_52w_highs": highs_count,
                "volatility_events": vol_events_count
            },
            "reference_timestamp": previous_snapshot.created_at.isoformat(),
            "snapshot_id": active_snapshot_id,
            "tracked_stocks_count": len(tracked_symbols)
        }


def meaningful_results_filter(results: List[ChangeEvaluationResult], target_types: List[str]) -> List[ChangeEvaluationResult]:
    matched = []
    for r in results:
        for et in r.event_types:
            if et.value in target_types:
                matched.append(r)
                break
    return matched


snapshot_service = SnapshotService()
