"""
Configuration module for FLUX Backend.
Provides environment-driven settings and centralized, configurable thresholds
for the Meaningful Change Engine.
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "FLUX"
    APP_TAGLINE: str = "KNOW WHAT CHANGED."
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Security & Authentication
    SECRET_KEY: str = "flux-super-secret-jwt-key-for-evaluation-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for development ease

    # Database
    # Using async SQLite for zero-config out-of-the-box local execution, fully compatible with Postgres
    DATABASE_URL: str = "sqlite+aiosqlite:///./flux_market.db"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    # Meaningful Change Engine - Configurable Thresholds
    # All thresholds are documented and centralized here for transparent tuning
    PRICE_MOVE_MIN_PCT: float = 0.4          # Below 0.4% is considered standard market noise
    PRICE_MOVE_NOTABLE_PCT: float = 2.0     # 2.0% is notable movement
    PRICE_MOVE_SIGNIFICANT_PCT: float = 4.0 # 4.0% is strong movement
    PRICE_MOVE_EXTREME_PCT: float = 6.0     # 6.0%+ is high/critical tier

    VOLUME_ANOMALY_NOTABLE_MULT: float = 1.5   # 1.5x typical volume
    VOLUME_ANOMALY_HIGH_MULT: float = 2.2      # 2.2x typical volume
    VOLUME_ANOMALY_EXTREME_MULT: float = 3.5   # 3.5x+ institutional volume surge

    VOLATILITY_BAND_MULTIPLIER: float = 1.25   # Move exceeding 1.25x ATR/typical band

    NEAR_52W_EXTREME_PCT: float = 1.5          # Within 1.5% of 52-week High or Low
    GAP_OPEN_THRESHOLD_PCT: float = 2.0        # Gap up/down > 2%

    # Significance Scoring Factor Weights (Sum = 1.0)
    WEIGHT_PRICE_MOVE: float = 0.35
    WEIGHT_VOLUME_ANOMALY: float = 0.25
    WEIGHT_VOLATILITY: float = 0.15
    WEIGHT_PRICE_LEVEL: float = 0.15
    WEIGHT_CONTEXTUAL: float = 0.10

    # Score Classification Cutoffs
    SCORE_CRITICAL: float = 0.80
    SCORE_HIGH: float = 0.60
    SCORE_MODERATE: float = 0.35

    # Data Freshness Windows (in seconds)
    FRESHNESS_LIVE_SEC: int = 15
    FRESHNESS_RECENT_SEC: int = 300   # 5 minutes
    FRESHNESS_STALE_SEC: int = 900    # 15 minutes

    # Cache TTL for Shared Market Ingestion (seconds)
    SHARED_CACHE_TTL_SEC: int = 10

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
