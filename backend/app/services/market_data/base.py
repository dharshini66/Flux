"""
Market Data Provider Abstraction.
Defines clean contracts and metadata models for market data providers,
ensuring strict decoupling from specific external API vendors.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict, Optional, Any
from datetime import datetime, timezone


class FreshnessStatus(str, Enum):
    LIVE = "LIVE"                  # < 15 seconds old
    RECENT = "RECENT"              # 15s - 5m old
    STALE = "STALE"                # > 5m old (warning displayed to user)
    UNAVAILABLE = "UNAVAILABLE"    # Provider timeout or error (contained per stock)


class MarketSessionStatus(str, Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    PRE_OPEN = "PRE_OPEN"
    POST_CLOSE = "POST_CLOSE"


@dataclass
class MarketQuote:
    symbol: str
    price: float
    change_1d_pct: float
    change_1d_abs: float
    volume: float
    typical_daily_volume: float
    typical_volatility_pct: float
    high_52w: float
    low_52w: float
    day_high: float
    day_low: float
    open_price: float
    previous_close: float
    market_timestamp: datetime
    fetched_at: datetime
    provider: str
    freshness_status: FreshnessStatus
    error_message: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "symbol": self.symbol,
            "price": round(self.price, 2),
            "change_1d_pct": round(self.change_1d_pct, 2),
            "change_1d_abs": round(self.change_1d_abs, 2),
            "volume": self.volume,
            "typical_daily_volume": self.typical_daily_volume,
            "typical_volatility_pct": self.typical_volatility_pct,
            "high_52w": self.high_52w,
            "low_52w": self.low_52w,
            "day_high": round(self.day_high, 2),
            "day_low": round(self.day_low, 2),
            "open_price": round(self.open_price, 2),
            "previous_close": round(self.previous_close, 2),
            "market_timestamp": self.market_timestamp.isoformat(),
            "fetched_at": self.fetched_at.isoformat(),
            "provider": self.provider,
            "freshness_status": self.freshness_status.value,
            "error_message": self.error_message,
        }


@dataclass
class HistoricalCandle:
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float

    def to_dict(self) -> Dict[str, Any]:
        return {
            "timestamp": self.timestamp.isoformat(),
            "open": round(self.open, 2),
            "high": round(self.high, 2),
            "low": round(self.low, 2),
            "close": round(self.close, 2),
            "volume": self.volume
        }


@dataclass
class MarketSessionInfo:
    status: MarketSessionStatus
    exchange: str
    current_time: datetime
    session_open_time: str
    session_close_time: str
    is_trading_active: bool
    last_trading_day: str


class MarketDataProvider(ABC):
    """Abstract interface for all market data sources."""

    @abstractmethod
    def get_provider_name(self) -> str:
        pass

    @abstractmethod
    async def get_quote(self, symbol: str) -> MarketQuote:
        """Fetch real-time or simulated quote for a single symbol."""
        pass

    @abstractmethod
    async def get_quotes_batch(self, symbols: List[str]) -> Dict[str, MarketQuote]:
        """Fetch quotes for multiple symbols with per-stock failure containment."""
        pass

    @abstractmethod
    async def get_historical_candles(self, symbol: str, timeframe: str = "1D") -> List[HistoricalCandle]:
        """Fetch historical price series (1D, 1W, 1M, 6M, 1Y)."""
        pass

    @abstractmethod
    async def get_market_session(self) -> MarketSessionInfo:
        """Retrieve current exchange trading session state."""
        pass
