"""
Individual Stock Detail & Historical Candlestick Endpoints.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import Stock
from app.services.market_data.service import market_service
from app.services.market_data.base import FreshnessStatus

router = APIRouter(prefix="/stocks", tags=["Stocks"])


@router.get("/{symbol}")
async def get_stock_detail(symbol: str, db: AsyncSession = Depends(get_db)):
    """Retrieve stock profile, quote, baseline thresholds, and freshness metadata."""
    sym = symbol.upper()
    stock = await db.get(Stock, sym)
    quote = await market_service.get_quote(sym)

    if not stock:
        # Fallback profile if not in initial seed
        company_name = f"{sym} Limited"
        exchange = "NSE"
        sector = "Equities"
        industry = "Public"
        high_52w = quote.high_52w
        low_52w = quote.low_52w
    else:
        company_name = stock.name
        exchange = stock.exchange
        sector = stock.sector
        industry = stock.industry
        high_52w = stock.high_52w
        low_52w = stock.low_52w

    # Timeline of session events
    timeline = [
        {"time": "09:18 AM", "event": "Market Open Auction & Order Discovery", "delta": "+0.4%"},
        {"time": "10:12 AM", "event": "Volume crossed 1.5x threshold during initial momentum burst", "delta": "+2.8%"},
        {"time": "11:45 AM", "event": "Institutional block transaction registered on NSE", "delta": "+4.2%"},
        {"time": "02:15 PM", "event": "Approached 52-week resistance band with 2.4x volume participation", "delta": "+5.8%"}
    ]

    return {
        "symbol": sym,
        "name": company_name,
        "exchange": exchange,
        "sector": sector,
        "industry": industry,
        "high_52w": high_52w,
        "low_52w": low_52w,
        "quote": quote.to_dict(),
        "session_timeline": timeline
    }


@router.get("/{symbol}/history")
async def get_stock_history(
    symbol: str,
    timeframe: str = Query("1D", pattern="^(1D|1W|1M|6M|1Y)$", description="Chart timeframe")
):
    """Retrieve candlestick price history for charting with previous baseline markers."""
    candles = await market_service.get_historical_candles(symbol, timeframe)
    return {
        "symbol": symbol.upper(),
        "timeframe": timeframe,
        "candles": [c.to_dict() for c in candles]
    }
