"""
Deterministic Demo Market Data Provider.
Provides fully repeatable, realistic market scenarios for evaluation
without depending on external third-party API rate limits or failures.
"""
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Optional, Any
import math
import random
from app.services.market_data.base import (
    MarketDataProvider, MarketQuote, HistoricalCandle,
    MarketSessionInfo, MarketSessionStatus, FreshnessStatus
)

DEMO_BASE_PROPERTIES = {
    "INFY": {"name": "Infosys Limited", "base_price": 1781.70, "high_52w": 1950.0, "low_52w": 1350.0, "vol": 4_200_000, "volatility": 1.2},
    "TCS": {"name": "Tata Consultancy Services", "base_price": 4126.80, "high_52w": 4250.0, "low_52w": 3300.0, "vol": 2_100_000, "volatility": 1.0},
    "RELIANCE": {"name": "Reliance Industries Ltd.", "base_price": 2881.60, "high_52w": 3100.0, "low_52w": 2220.0, "vol": 6_500_000, "volatility": 1.3},
    "HDFCBANK": {"name": "HDFC Bank Limited", "base_price": 1724.50, "high_52w": 1780.0, "low_52w": 1380.0, "vol": 12_000_000, "volatility": 1.4},
    "ICICIBANK": {"name": "ICICI Bank Limited", "base_price": 1119.80, "high_52w": 1320.0, "low_52w": 930.0, "vol": 8_800_000, "volatility": 1.3},
    "TATAMOTORS": {"name": "Tata Motors Limited", "base_price": 940.00, "high_52w": 1180.0, "low_52w": 620.0, "vol": 9_400_000, "volatility": 1.9},
    "BHARTIARTL": {"name": "Bharti Airtel Limited", "base_price": 1582.0, "high_52w": 1720.0, "low_52w": 860.0, "vol": 4_600_000, "volatility": 1.1},
    "ITC": {"name": "ITC Limited", "base_price": 486.0, "high_52w": 530.0, "low_52w": 395.0, "vol": 11_500_000, "volatility": 0.9},
    "WIPRO": {"name": "Wipro Limited", "base_price": 542.0, "high_52w": 580.0, "low_52w": 380.0, "vol": 5_200_000, "volatility": 1.5},
    "SBIN": {"name": "State Bank of India", "base_price": 825.0, "high_52w": 910.0, "low_52w": 550.0, "vol": 14_000_000, "volatility": 1.6},
}


class DemoMarketDataProvider(MarketDataProvider):
    """
    Seeded, deterministic market data provider with configurable test scenarios.
    """

    def __init__(self, initial_scenario: str = "default"):
        self.provider_name = "FLUX Demo Engine (Deterministic)"
        self.current_scenario = initial_scenario
        self.market_session_status = MarketSessionStatus.OPEN
        self.is_stale_mode = False
        self.failed_symbols: List[str] = []

    def get_provider_name(self) -> str:
        return self.provider_name

    def set_scenario(self, scenario_name: str) -> None:
        """Switch current deterministic scenario on the fly for evaluator testing."""
        self.current_scenario = scenario_name
        if scenario_name == "stale_data":
            self.is_stale_mode = True
            self.failed_symbols = []
        elif scenario_name == "provider_failure":
            self.is_stale_mode = False
            self.failed_symbols = ["HDFCBANK"]
        elif scenario_name == "market_closed":
            self.market_session_status = MarketSessionStatus.CLOSED
            self.is_stale_mode = False
            self.failed_symbols = []
        else:
            self.market_session_status = MarketSessionStatus.OPEN
            self.is_stale_mode = False
            self.failed_symbols = []

    async def get_market_session(self) -> MarketSessionInfo:
        now = datetime.now(timezone.utc)
        return MarketSessionInfo(
            status=self.market_session_status,
            exchange="NSE",
            current_time=now,
            session_open_time="09:15:00+05:30",
            session_close_time="15:30:00+05:30",
            is_trading_active=(self.market_session_status == MarketSessionStatus.OPEN),
            last_trading_day=now.strftime("%Y-%m-%d")
        )

    async def get_quote(self, symbol: str) -> MarketQuote:
        sym = symbol.upper()
        now = datetime.now(timezone.utc)

        # 1. Check for simulated provider failure on symbol
        if sym in self.failed_symbols:
            return MarketQuote(
                symbol=sym,
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
                provider=self.provider_name,
                freshness_status=FreshnessStatus.UNAVAILABLE,
                error_message=f"Primary gateway timeout on symbol {sym} (Simulated Resilience Scenario)"
            )

        # 2. Extract base metrics
        base = DEMO_BASE_PROPERTIES.get(sym, {
            "name": f"{sym} Corp",
            "base_price": 1000.0,
            "high_52w": 1200.0,
            "low_52w": 800.0,
            "vol": 5_000_000,
            "volatility": 1.5
        })

        # Calculate scenario-specific price & volume deltas
        price, change_pct, volume_mult = self._compute_scenario_metrics(sym, base)

        previous_close = base["base_price"]
        change_abs = price - previous_close
        volume = base["vol"] * volume_mult

        # Set freshness status & timestamps
        if self.is_stale_mode:
            freshness = FreshnessStatus.STALE
            market_ts = now - timedelta(minutes=14, seconds=22)
        else:
            freshness = FreshnessStatus.LIVE
            market_ts = now

        day_high = max(price, previous_close * 1.01)
        day_low = min(price, previous_close * 0.99)
        open_price = previous_close * (1.0 + (change_pct * 0.3) / 100.0)

        return MarketQuote(
            symbol=sym,
            price=round(price, 2),
            change_1d_pct=round(change_pct, 2),
            change_1d_abs=round(change_abs, 2),
            volume=round(volume),
            typical_daily_volume=base["vol"],
            typical_volatility_pct=base["volatility"],
            high_52w=base["high_52w"],
            low_52w=base["low_52w"],
            day_high=round(day_high, 2),
            day_low=round(day_low, 2),
            open_price=round(open_price, 2),
            previous_close=round(previous_close, 2),
            market_timestamp=market_ts,
            fetched_at=now,
            provider=self.provider_name,
            freshness_status=freshness
        )

    def _compute_scenario_metrics(self, sym: str, base: Dict[str, Any]) -> tuple[float, float, float]:
        """Calculates deterministic prices and volume based on active evaluation scenario."""
        base_p = base["base_price"]

        if self.current_scenario == "default":
            if sym == "INFY":
                # INFY: +3.4%, 2.4x volume, testing 52W high (1842.30 vs 1880)
                price = 1842.30
                pct = 3.4
                vol_mult = 2.4
            elif sym == "RELIANCE":
                # RELIANCE: +2.1%, 3.1x volume surge
                price = 2942.10
                pct = 2.1
                vol_mult = 3.1
            elif sym == "HDFCBANK":
                # HDFCBANK: -4.3%, 1.8x volume drop
                price = 1650.40
                pct = -4.3
                vol_mult = 1.8
            elif sym == "TCS":
                # TCS: +2.1%, new 52-week high breakout (4213.50 vs 4200)
                price = 4213.50
                pct = 2.1
                vol_mult = 1.4
            elif sym == "ICICIBANK":
                # Routine drift
                price = 1122.05
                pct = 0.6
                vol_mult = 0.95
            elif sym == "TATAMOTORS":
                price = 985.00
                pct = 2.6
                vol_mult = 1.10
            elif sym == "BHARTIARTL":
                price = 1590.00
                pct = 0.51
                vol_mult = 1.02
            elif sym == "ITC":
                price = 485.00
                pct = -0.21
                vol_mult = 0.88
            else:
                price = base_p * 1.004
                pct = 0.40
                vol_mult = 1.0
        
        elif self.current_scenario == "large_surge":
            if sym == "INFY":
                price = 1968.00  # New 52W high + 10.5% surge + 4.2x vol
                pct = 10.5
                vol_mult = 4.2
            elif sym == "TCS":
                price = 4310.00  # New 52W high breakout (+4.4%, 2.8x vol)
                pct = 4.4
                vol_mult = 2.8
            elif sym == "RELIANCE":
                price = 3050.00  # Institutional accumulation (+5.8%, 3.2x vol)
                pct = 5.8
                vol_mult = 3.2
            else:
                price = base_p * 1.008
                pct = 0.8
                vol_mult = 1.05

        elif self.current_scenario == "market_crash":
            if sym in ["HDFCBANK", "ICICIBANK", "SBIN"]:
                pct = -6.4
                price = base_p * 0.936
                vol_mult = 2.8
            else:
                pct = -3.2
                price = base_p * 0.968
                vol_mult = 1.6

        elif self.current_scenario == "no_signal_quiet":
            # All stocks tiny chop < 0.3%
            pct = 0.15 if sym in ["INFY", "TCS"] else -0.12
            price = base_p * (1.0 + pct / 100.0)
            vol_mult = 0.85

        else:
            # Default standard drift
            pct = 0.45
            price = base_p * 1.0045
            vol_mult = 1.0

        return price, pct, vol_mult

    async def get_quotes_batch(self, symbols: List[str]) -> Dict[str, MarketQuote]:
        quotes = {}
        for s in symbols:
            quotes[s.upper()] = await self.get_quote(s)
        return quotes

    async def get_historical_candles(self, symbol: str, timeframe: str = "1D") -> List[HistoricalCandle]:
        """Generates realistic candlestick series for 1D, 1W, 1M, 6M, 1Y."""
        sym = symbol.upper()
        base = DEMO_BASE_PROPERTIES.get(sym, {"base_price": 1000.0, "vol": 100_000})
        base_p = base["base_price"]
        current_quote = await self.get_quote(sym)
        current_p = current_quote.price if current_quote.price > 0 else base_p

        candles: List[HistoricalCandle] = []
        now = datetime.now(timezone.utc)

        if timeframe == "1D":
            # 5-minute intraday intervals for Indian market session (9:15 AM to 3:30 PM, ~75 points)
            points = 60
            start_time = now.replace(hour=3, minute=45, second=0, microsecond=0) # 9:15 AM IST is 3:45 UTC
            for i in range(points):
                t = start_time + timedelta(minutes=i * 5)
                # Curve starting from previous close towards current price
                ratio = i / float(points)
                drift = (current_p - base_p) * ratio
                noise = math.sin(i * 0.4) * (base_p * 0.003)
                p = base_p + drift + noise
                high = p * 1.002
                low = p * 0.998
                vol = (base["vol"] / 75) * (1.5 if i > 40 else 0.9)
                candles.append(HistoricalCandle(
                    timestamp=t,
                    open=round(p * 0.999, 2),
                    high=round(high, 2),
                    low=round(low, 2),
                    close=round(p, 2),
                    volume=round(vol)
                ))

        elif timeframe == "1W":
            # 7 days of hourly bars
            for d in range(7, 0, -1):
                day_t = now - timedelta(days=d)
                p = base_p * (1.0 + (math.sin(d) * 0.015))
                candles.append(HistoricalCandle(
                    timestamp=day_t,
                    open=round(p * 0.995, 2),
                    high=round(p * 1.012, 2),
                    low=round(p * 0.99, 2),
                    close=round(p, 2),
                    volume=base["vol"]
                ))
        elif timeframe == "1M":
            # 30 daily bars
            for d in range(30, 0, -1):
                day_t = now - timedelta(days=d)
                progress = (30 - d) / 30.0
                p = base_p * (0.95 + (progress * 0.08) + math.sin(d * 0.6) * 0.02)
                candles.append(HistoricalCandle(
                    timestamp=day_t,
                    open=round(p * 0.998, 2),
                    high=round(p * 1.015, 2),
                    low=round(p * 0.985, 2),
                    close=round(p, 2),
                    volume=base["vol"]
                ))
        else: # 6M / 1Y
            bars = 90 if timeframe == "6M" else 180
            for d in range(bars, 0, -2):
                day_t = now - timedelta(days=d)
                progress = (bars - d) / float(bars)
                p = base_p * (0.85 + (progress * 0.20) + math.sin(d * 0.2) * 0.04)
                candles.append(HistoricalCandle(
                    timestamp=day_t,
                    open=round(p * 0.996, 2),
                    high=round(p * 1.018, 2),
                    low=round(p * 0.982, 2),
                    close=round(p, 2),
                    volume=base["vol"]
                ))

        return candles


demo_market_provider = DemoMarketDataProvider()
