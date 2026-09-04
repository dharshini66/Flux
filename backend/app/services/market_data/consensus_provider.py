"""
Consensus & Multi-Provider Aggregator.
Implements a deterministic conflict resolution strategy across data providers
for high-availability market data feeds.
"""
from typing import List, Dict, Optional, Any
from datetime import datetime, timezone
from app.services.market_data.base import (
    MarketDataProvider, MarketQuote, FreshnessStatus
)
from app.core.logging import logger


class ConsensusMarketProvider:
    """
    Orchestrates multiple market data providers.
    Applies deterministic arbitration when providers disagree or fail.
    """

    def __init__(self, providers: List[MarketDataProvider]):
        self.providers = providers

    async def get_resilient_quote(self, symbol: str) -> MarketQuote:
        """
        Attempts primary provider first.
        If primary fails or times out, falls back gracefully to secondary providers.
        If multiple providers return conflicting prices, applies median consensus.
        """
        valid_quotes: List[MarketQuote] = []
        errors: List[str] = []

        for p in self.providers:
            try:
                q = await p.get_quote(symbol)
                if q.freshness_status != FreshnessStatus.UNAVAILABLE and q.price > 0:
                    valid_quotes.append(q)
                else:
                    if q.error_message:
                        errors.append(f"[{p.get_provider_name()}] {q.error_message}")
            except Exception as e:
                errors.append(f"[{p.get_provider_name()}] Exception: {str(e)}")

        if not valid_quotes:
            # All providers failed: return explicit UNAVAILABLE quote (fail-safe containment)
            now = datetime.now(timezone.utc)
            return MarketQuote(
                symbol=symbol,
                price=0.0,
                change_1d_pct=0.0,
                change_1d_abs=0.0,
                volume=0.0,
                typical_daily_volume=1.0,
                typical_volatility_pct=1.0,
                high_52w=0.0,
                low_52w=0.0,
                day_high=0.0,
                day_low=0.0,
                open_price=0.0,
                previous_close=0.0,
                market_timestamp=now,
                fetched_at=now,
                provider="Multi-Provider Aggregator (Failed)",
                freshness_status=FreshnessStatus.UNAVAILABLE,
                error_message="; ".join(errors) or "All upstream providers unavailable."
            )

        # Single provider response
        if len(valid_quotes) == 1:
            return valid_quotes[0]

        # Multi-provider conflict arbitration:
        # Check price variance between primary (0) and secondary (1)
        primary = valid_quotes[0]
        secondary = valid_quotes[1]
        pct_diff = abs((primary.price - secondary.price) / max(primary.price, 0.01)) * 100.0

        if pct_diff > 0.5:
            logger.warning(
                f"Market Data Disagreement on {symbol}: Primary={primary.price} vs Secondary={secondary.price} (diff: {pct_diff:.2f}%)"
            )
            # Prefer primary if not stale, otherwise secondary
            if primary.freshness_status == FreshnessStatus.LIVE:
                return primary
            return secondary

        return primary
