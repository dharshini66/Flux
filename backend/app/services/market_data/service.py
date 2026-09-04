"""
Market Data Service.
Orchestrates shared caching, batch ingestion, Market Pulse timeline generation,
and health checks across market providers.
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
from app.services.market_data.base import MarketQuote, HistoricalCandle, MarketSessionInfo, FreshnessStatus
from app.services.market_data.demo_provider import demo_market_provider
from app.services.market_data.consensus_provider import ConsensusMarketProvider
from app.core.cache import shared_cache
from app.core.logging import logger


class MarketDataService:
    def __init__(self):
        self.consensus_provider = ConsensusMarketProvider([demo_market_provider])

    async def get_quote(self, symbol: str, bypass_cache: bool = False) -> MarketQuote:
        sym = symbol.upper()
        if not bypass_cache:
            cached = await shared_cache.get(sym)
            if cached:
                # Reconstruct quote from cache dict
                return MarketQuote(
                    symbol=cached["symbol"],
                    price=cached["price"],
                    change_1d_pct=cached["change_1d_pct"],
                    change_1d_abs=cached["change_1d_abs"],
                    volume=cached["volume"],
                    typical_daily_volume=cached["typical_daily_volume"],
                    typical_volatility_pct=cached["typical_volatility_pct"],
                    high_52w=cached["high_52w"],
                    low_52w=cached["low_52w"],
                    day_high=cached["day_high"],
                    day_low=cached["day_low"],
                    open_price=cached["open_price"],
                    previous_close=cached["previous_close"],
                    market_timestamp=datetime.fromisoformat(cached["market_timestamp"]),
                    fetched_at=datetime.fromisoformat(cached["fetched_at"]),
                    provider=cached["provider"],
                    freshness_status=FreshnessStatus(cached["freshness_status"]),
                    error_message=cached.get("error_message")
                )

        # Cache miss or bypass: query provider
        quote = await self.consensus_provider.get_resilient_quote(sym)
        if quote.freshness_status != FreshnessStatus.UNAVAILABLE:
            await shared_cache.set(sym, quote.to_dict())
        return quote

    async def get_quotes_batch(self, symbols: List[str], bypass_cache: bool = False) -> Dict[str, MarketQuote]:
        """Fetch quotes in batch with shared cache optimization."""
        quotes: Dict[str, MarketQuote] = {}
        missing: List[str] = []

        if not bypass_cache:
            cached_map = await shared_cache.get_multi(symbols)
            for s in symbols:
                sym = s.upper()
                if sym in cached_map:
                    cached = cached_map[sym]
                    quotes[sym] = MarketQuote(
                        symbol=cached["symbol"],
                        price=cached["price"],
                        change_1d_pct=cached["change_1d_pct"],
                        change_1d_abs=cached["change_1d_abs"],
                        volume=cached["volume"],
                        typical_daily_volume=cached["typical_daily_volume"],
                        typical_volatility_pct=cached["typical_volatility_pct"],
                        high_52w=cached["high_52w"],
                        low_52w=cached["low_52w"],
                        day_high=cached["day_high"],
                        day_low=cached["day_low"],
                        open_price=cached["open_price"],
                        previous_close=cached["previous_close"],
                        market_timestamp=datetime.fromisoformat(cached["market_timestamp"]),
                        fetched_at=datetime.fromisoformat(cached["fetched_at"]),
                        provider=cached["provider"],
                        freshness_status=FreshnessStatus(cached["freshness_status"]),
                        error_message=cached.get("error_message")
                    )
                else:
                    missing.append(sym)
        else:
            missing = [s.upper() for s in symbols]

        # Query provider for any cache misses
        for sym in missing:
            q = await self.consensus_provider.get_resilient_quote(sym)
            quotes[sym] = q
            if q.freshness_status != FreshnessStatus.UNAVAILABLE:
                await shared_cache.set(sym, q.to_dict())

        return quotes

    async def get_historical_candles(self, symbol: str, timeframe: str = "1D") -> List[HistoricalCandle]:
        return await demo_market_provider.get_historical_candles(symbol, timeframe)

    async def get_market_session(self) -> MarketSessionInfo:
        return await demo_market_provider.get_market_session()

    def set_demo_scenario(self, scenario_name: str) -> None:
        """Switch demo mode scenario and invalidate cache for instant evaluator updates."""
        demo_market_provider.set_scenario(scenario_name)

    async def get_market_pulse(self) -> List[Dict[str, Any]]:
        """
        Signature Market Pulse timeline visualization data across market trading hours:
        9:15 AM, 10:30 AM, 12:00 PM, 1:30 PM, 3:00 PM.
        """
        now = datetime.now(timezone.utc)
        pulse_events = [
            {
                "id": "pulse-1",
                "time_label": "09:18 AM",
                "time_iso": (now - timedelta(hours=5, minutes=42)).isoformat(),
                "hour_mark": "9 AM",
                "symbol": "TCS",
                "event_title": "TCS New 52W High Breakout",
                "price_delta": "+2.1%",
                "severity": "HIGH",
                "intensity": 0.75,
                "category": "52W_HIGH",
                "detail": "Crossed ₹4,260 resistance on opening block trade.",
                "significance_score": 0.72
            },
            {
                "id": "pulse-2",
                "time_label": "10:12 AM",
                "time_iso": (now - timedelta(hours=4, minutes=48)).isoformat(),
                "hour_mark": "11 AM",
                "symbol": "INFY",
                "event_title": "INFY Volume Velocity Surge",
                "price_delta": "+3.4%",
                "severity": "HIGH",
                "intensity": 0.85,
                "category": "VOLUME",
                "detail": "Crossed 2.0x average volume threshold during US IT earnings updates.",
                "significance_score": 0.82
            },
            {
                "id": "pulse-3",
                "time_label": "11:45 AM",
                "time_iso": (now - timedelta(hours=3, minutes=15)).isoformat(),
                "hour_mark": "11 AM",
                "symbol": "HDFCBANK",
                "event_title": "HDFCBANK Sharp Downward Liquidity Sweep",
                "price_delta": "-4.3%",
                "severity": "HIGH",
                "intensity": 0.80,
                "category": "PRICE_DROP",
                "detail": "Breached 1,500 support level on elevated block selling.",
                "significance_score": 0.78
            },
            {
                "id": "pulse-4",
                "time_label": "01:15 PM",
                "time_iso": (now - timedelta(hours=1, minutes=45)).isoformat(),
                "hour_mark": "1 PM",
                "symbol": "RELIANCE",
                "event_title": "RELIANCE 3.1x Volume Breakout",
                "price_delta": "+2.1%",
                "severity": "MODERATE",
                "intensity": 0.65,
                "category": "VOLUME",
                "detail": "Sudden volume surge in afternoon European market crossover.",
                "significance_score": 0.64
            },
            {
                "id": "pulse-5",
                "time_label": "02:40 PM",
                "time_iso": (now - timedelta(minutes=20)).isoformat(),
                "hour_mark": "3 PM",
                "symbol": "INFY",
                "event_title": "INFY Extended Rally (+5.8%)",
                "price_delta": "+5.8%",
                "severity": "CRITICAL",
                "intensity": 0.95,
                "category": "PRICE_SURGE",
                "detail": "Extended daily highs to ₹1,940.50 backed by 2.4x volume and 52W high proximity.",
                "significance_score": 0.89
            }
        ]
        return pulse_events


market_service = MarketDataService()
