"""
SQLAlchemy Relational Database Models for FLUX.
Enforces data integrity, unique constraints, and optimized index lookups.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Text, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from app.db.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="analyst", nullable=False)
    experience_points = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    watchlists = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    snapshots = relationship("MarketSnapshot", back_populates="user", cascade="all, delete-orphan")
    user_events = relationship("UserEvent", back_populates="user", cascade="all, delete-orphan")


class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    is_default = Column(Boolean, default=False, nullable=False)
    position = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="watchlists")
    stocks = relationship("WatchlistStock", back_populates="watchlist", cascade="all, delete-orphan", order_by="WatchlistStock.position")


class Stock(Base):
    __tablename__ = "stocks"

    symbol = Column(String(20), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    exchange = Column(String(20), default="NSE", nullable=False)
    sector = Column(String(100), nullable=True)
    industry = Column(String(100), nullable=True)
    currency = Column(String(10), default="INR", nullable=False)
    high_52w = Column(Float, nullable=False)
    low_52w = Column(Float, nullable=False)
    typical_daily_volume = Column(Float, nullable=False)  # Base average volume
    typical_volatility_pct = Column(Float, default=1.5, nullable=False) # e.g. 1.5% ATR / std dev
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    watchlist_entries = relationship("WatchlistStock", back_populates="stock")


class WatchlistStock(Base):
    __tablename__ = "watchlist_stocks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    watchlist_id = Column(String(36), ForeignKey("watchlists.id", ondelete="CASCADE"), nullable=False, index=True)
    stock_symbol = Column(String(20), ForeignKey("stocks.symbol", ondelete="CASCADE"), nullable=False, index=True)
    is_priority = Column(Boolean, default=False, nullable=False)
    position = Column(Integer, default=0, nullable=False)
    notes = Column(String(255), nullable=True)
    added_at = Column(DateTime, default=utc_now, nullable=False)

    # Unique constraint preventing duplicates at the database level
    __table_args__ = (
        UniqueConstraint("watchlist_id", "stock_symbol", name="uq_watchlist_stock"),
    )

    # Relationships
    watchlist = relationship("Watchlist", back_populates="stocks")
    stock = relationship("Stock", back_populates="watchlist_entries")


class MarketSnapshot(Base):
    """
    First-class Market Snapshot.
    Stores the exact baseline market state for a user at a given point in time.
    """
    __tablename__ = "market_snapshots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_label = Column(String(100), nullable=True)  # e.g. "Morning Check-in", "EOD Review"
    meaningful_changes_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False, index=True)

    __table_args__ = (
        Index("ix_user_created_at", "user_id", "created_at"),
    )

    # Relationships
    user = relationship("User", back_populates="snapshots")
    stock_snapshots = relationship("StockSnapshot", back_populates="snapshot", cascade="all, delete-orphan")


class StockSnapshot(Base):
    """
    Individual stock price, volume, and metrics frozen within a MarketSnapshot.
    """
    __tablename__ = "stock_snapshots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    snapshot_id = Column(String(36), ForeignKey("market_snapshots.id", ondelete="CASCADE"), nullable=False, index=True)
    stock_symbol = Column(String(20), nullable=False, index=True)
    price = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    high_52w = Column(Float, nullable=True)
    low_52w = Column(Float, nullable=True)
    captured_at = Column(DateTime, default=utc_now, nullable=False)

    __table_args__ = (
        UniqueConstraint("snapshot_id", "stock_symbol", name="uq_snapshot_stock"),
    )

    # Relationships
    snapshot = relationship("MarketSnapshot", back_populates="stock_snapshots")


class MarketEvent(Base):
    """
    Recorded meaningful market event discovered by the Meaningful Change Engine.
    """
    __tablename__ = "market_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    symbol = Column(String(20), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)  # PRICE_SURGE, VOLUME_ANOMALY, 52W_HIGH, etc.
    severity = Column(String(20), nullable=False)    # NORMAL, MODERATE, HIGH, CRITICAL
    significance_score = Column(Float, nullable=False)
    price_change_pct = Column(Float, nullable=False)
    volume_ratio = Column(Float, nullable=False)
    headline = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    explanation_json = Column(Text, nullable=False)  # Detailed factors breakdown
    detected_at = Column(DateTime, default=utc_now, nullable=False, index=True)


class UserEvent(Base):
    """
    Tracks user interaction with detected signals (e.g. read, bookmarked).
    """
    __tablename__ = "user_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    event_id = Column(String(36), ForeignKey("market_events.id", ondelete="CASCADE"), nullable=False, index=True)
    is_read = Column(Boolean, default=False, nullable=False)
    is_bookmarked = Column(Boolean, default=False, nullable=False)
    interacted_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="user_events")
    event = relationship("MarketEvent")


class DataSource(Base):
    """
    Tracks health, latency, error count, and priority for multi-provider resilience.
    """
    __tablename__ = "data_sources"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    priority = Column(Integer, default=1, nullable=False)
    latency_ms = Column(Float, default=45.0, nullable=False)
    error_count = Column(Integer, default=0, nullable=False)
    last_sync_at = Column(DateTime, default=utc_now, nullable=False)
