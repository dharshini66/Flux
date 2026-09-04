"""
Database seeding module for FLUX.
Initializes top stocks, demo users, sample watchlists, and data providers.
"""
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User, Stock, Watchlist, WatchlistStock, DataSource, MarketSnapshot, StockSnapshot
from app.core.security import hash_password

INITIAL_STOCKS = [
    {
        "symbol": "INFY",
        "name": "Infosys Limited",
        "exchange": "NSE",
        "sector": "Information Technology",
        "industry": "IT Services & Consulting",
        "currency": "INR",
        "high_52w": 1950.0,
        "low_52w": 1350.0,
        "typical_daily_volume": 4_200_000,
        "typical_volatility_pct": 1.2
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services",
        "exchange": "NSE",
        "sector": "Information Technology",
        "industry": "IT Services & Consulting",
        "currency": "INR",
        "high_52w": 4250.0,
        "low_52w": 3300.0,
        "typical_daily_volume": 2_100_000,
        "typical_volatility_pct": 1.0
    },
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd.",
        "exchange": "NSE",
        "sector": "Energy & Conglomerate",
        "industry": "Oil, Gas & Retail",
        "currency": "INR",
        "high_52w": 3100.0,
        "low_52w": 2220.0,
        "typical_daily_volume": 6_500_000,
        "typical_volatility_pct": 1.3
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Limited",
        "exchange": "NSE",
        "sector": "Financial Services",
        "industry": "Private Sector Bank",
        "currency": "INR",
        "high_52w": 1780.0,
        "low_52w": 1380.0,
        "typical_daily_volume": 12_000_000,
        "typical_volatility_pct": 1.4
    },
    {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Limited",
        "exchange": "NSE",
        "sector": "Financial Services",
        "industry": "Private Sector Bank",
        "currency": "INR",
        "high_52w": 1320.0,
        "low_52w": 930.0,
        "typical_daily_volume": 8_800_000,
        "typical_volatility_pct": 1.3
    },
    {
        "symbol": "TATAMOTORS",
        "name": "Tata Motors Limited",
        "exchange": "NSE",
        "sector": "Automobile",
        "industry": "Commercial & Passenger Vehicles",
        "currency": "INR",
        "high_52w": 1180.0,
        "low_52w": 620.0,
        "typical_daily_volume": 9_400_000,
        "typical_volatility_pct": 1.9
    },
    {
        "symbol": "BHARTIARTL",
        "name": "Bharti Airtel Limited",
        "exchange": "NSE",
        "sector": "Telecommunication",
        "industry": "Telecom Services",
        "currency": "INR",
        "high_52w": 1720.0,
        "low_52w": 860.0,
        "typical_daily_volume": 4_600_000,
        "typical_volatility_pct": 1.1
    },
    {
        "symbol": "ITC",
        "name": "ITC Limited",
        "exchange": "NSE",
        "sector": "Consumer Goods",
        "industry": "Diversified FMCG",
        "currency": "INR",
        "high_52w": 530.0,
        "low_52w": 395.0,
        "typical_daily_volume": 11_500_000,
        "typical_volatility_pct": 0.9
    },
    {
        "symbol": "WIPRO",
        "name": "Wipro Limited",
        "exchange": "NSE",
        "sector": "Information Technology",
        "industry": "IT Consulting & Services",
        "currency": "INR",
        "high_52w": 580.0,
        "low_52w": 380.0,
        "typical_daily_volume": 5_200_000,
        "typical_volatility_pct": 1.5
    },
    {
        "symbol": "SBIN",
        "name": "State Bank of India",
        "exchange": "NSE",
        "sector": "Financial Services",
        "industry": "Public Sector Bank",
        "currency": "INR",
        "high_52w": 910.0,
        "low_52w": 550.0,
        "typical_daily_volume": 14_000_000,
        "typical_volatility_pct": 1.6
    }
]


async def seed_database(session: AsyncSession) -> None:
    """Populate database with initial reference stocks, demo user, and watchlists."""
    
    # 1. Seed Stocks
    for s_data in INITIAL_STOCKS:
        existing = await session.get(Stock, s_data["symbol"])
        if not existing:
            stock = Stock(**s_data)
            session.add(stock)
    
    # 2. Seed Data Sources
    sources = [
        {"id": "nse_feed_primary", "name": "NSE Direct Market Feed (Primary)", "is_active": True, "priority": 1, "latency_ms": 18.5},
        {"id": "bse_feed_secondary", "name": "BSE Backup Feed (Secondary)", "is_active": True, "priority": 2, "latency_ms": 42.0},
        {"id": "flux_synthetic_engine", "name": "FLUX Deterministic Simulation Engine", "is_active": True, "priority": 3, "latency_ms": 5.0},
    ]
    for src in sources:
        existing_src = await session.get(DataSource, src["id"])
        if not existing_src:
            session.add(DataSource(**src))

    # 3. Seed Demo User
    demo_email = "analyst@flux.market"
    res = await session.execute(select(User).where(User.email == demo_email))
    demo_user = res.scalars().first()

    if not demo_user:
        demo_user = User(
            email=demo_email,
            username="kavita_analyst",
            full_name="Kavita Sharma",
            hashed_password=hash_password("password123"),
            role="lead_analyst",
            experience_points=320
        )
        session.add(demo_user)
        await session.flush()

        # Create Default Watchlists for Demo User
        wl_primary = Watchlist(
            user_id=demo_user.id,
            name="Primary Focus",
            description="Core NIFTY high-conviction holdings",
            is_default=True,
            position=0
        )
        wl_tech = Watchlist(
            user_id=demo_user.id,
            name="Tech & Cloud",
            description="Indian and global enterprise tech",
            is_default=False,
            position=1
        )
        session.add_all([wl_primary, wl_tech])
        await session.flush()

        # Attach stocks to Primary Focus
        primary_symbols = ["INFY", "TCS", "RELIANCE", "HDFCBANK", "ICICIBANK", "TATAMOTORS"]
        for idx, sym in enumerate(primary_symbols):
            session.add(WatchlistStock(
                watchlist_id=wl_primary.id,
                stock_symbol=sym,
                is_priority=(sym in ["INFY", "HDFCBANK"]),
                position=idx
            ))

        # Attach stocks to Tech
        tech_symbols = ["INFY", "TCS", "WIPRO", "BHARTIARTL"]
        for idx, sym in enumerate(tech_symbols):
            session.add(WatchlistStock(
                watchlist_id=wl_tech.id,
                stock_symbol=sym,
                is_priority=(sym == "INFY"),
                position=idx
            ))

    # Check if demo_user has a baseline snapshot; if not, create one
    snap_res = await session.execute(
        select(MarketSnapshot).where(MarketSnapshot.user_id == demo_user.id).limit(1)
    )
    existing_snap = snap_res.scalars().first()

    if not existing_snap:
        baseline_time = datetime.now(timezone.utc).replace(hour=13, minute=46, second=0, microsecond=0) # 01:46 PM
        initial_snap = MarketSnapshot(
            user_id=demo_user.id,
            session_label="Previous Session Baseline",
            meaningful_changes_count=5,
            created_at=baseline_time
        )
        session.add(initial_snap)
        await session.flush()

        # Seed baseline prices for watchlist stocks
        baseline_stocks = [
            {"symbol": "INFY", "price": 1781.70, "volume": 1_800_000, "high_52w": 1880.0, "low_52w": 1350.0},
            {"symbol": "TCS", "price": 4126.80, "volume": 1_500_000, "high_52w": 4200.0, "low_52w": 3300.0},
            {"symbol": "RELIANCE", "price": 2881.60, "volume": 2_100_000, "high_52w": 3100.0, "low_52w": 2220.0},
            {"symbol": "HDFCBANK", "price": 1724.50, "volume": 6_700_000, "high_52w": 1780.0, "low_52w": 1380.0},
            {"symbol": "ICICIBANK", "price": 1119.80, "volume": 7_200_000, "high_52w": 1320.0, "low_52w": 930.0},
            {"symbol": "TATAMOTORS", "price": 940.00, "volume": 8_500_000, "high_52w": 1180.0, "low_52w": 620.0},
        ]
        for bs in baseline_stocks:
            session.add(StockSnapshot(
                snapshot_id=initial_snap.id,
                stock_symbol=bs["symbol"],
                price=bs["price"],
                volume=bs["volume"],
                high_52w=bs["high_52w"],
                low_52w=bs["low_52w"],
                captured_at=baseline_time
            ))

    await session.commit()
