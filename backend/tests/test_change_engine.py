"""
Comprehensive unit tests for the Meaningful Change Engine.
Tests significance mathematical formulation, threshold sensitivity,
compound catalysts, and explainability breakdowns.
"""
import pytest
from app.engine.change_engine import (
    MeaningfulChangeEngine, StockDeltaContext, SignalSeverity, EventType
)
from app.engine.thresholds import SignificanceThresholds
from app.engine.explainer import explainer


def test_small_price_movement_suppression():
    """Verify that a small 0.3% price move with normal volume is classified as NORMAL/ROUTINE_DRIFT."""
    engine = MeaningfulChangeEngine()
    ctx = StockDeltaContext(
        symbol="ICICIBANK",
        company_name="ICICI Bank",
        previous_price=1000.0,
        current_price=1003.0,  # +0.3%
        current_volume=1_000_000,
        typical_volume=1_000_000,  # 1.0x
        typical_volatility_pct=1.5,
        high_52w=1200.0,
        low_52w=800.0
    )
    result = engine.evaluate_stock_change(ctx)
    assert result.severity == SignalSeverity.NORMAL
    assert not result.is_meaningful
    assert result.significance_score < 0.35
    assert EventType.ROUTINE_DRIFT in result.event_types


def test_large_price_surge_with_volume_anomaly():
    """Verify INFY +5.8% with 2.4x volume and 52W high proximity yields HIGH or CRITICAL impact."""
    engine = MeaningfulChangeEngine()
    ctx = StockDeltaContext(
        symbol="INFY",
        company_name="Infosys Ltd.",
        previous_price=1834.0,
        current_price=1940.5,  # +5.8%
        current_volume=10_080_000,
        typical_volume=4_200_000,  # 2.4x
        typical_volatility_pct=1.2,
        high_52w=1950.0,  # within 0.5% of 52W high
        low_52w=1350.0
    )
    result = engine.evaluate_stock_change(ctx)
    assert result.severity in [SignalSeverity.HIGH, SignalSeverity.CRITICAL]
    assert result.is_meaningful
    assert result.significance_score >= 0.60
    assert result.signal_level_int in [4, 5]
    assert EventType.PRICE_SURGE in result.event_types
    assert EventType.UNUSUAL_VOLUME in result.event_types
    assert EventType.NEAR_52W_HIGH in result.event_types


def test_new_52_week_high_breakout():
    """Verify TCS new 52W high breakout (+2.1%, new peak) triggers NEW_52W_HIGH event."""
    engine = MeaningfulChangeEngine()
    ctx = StockDeltaContext(
        symbol="TCS",
        company_name="Tata Consultancy Services",
        previous_price=4172.0,
        current_price=4260.0,  # +2.1%
        current_volume=2_940_000,
        typical_volume=2_100_000,  # 1.4x
        typical_volatility_pct=1.0,
        high_52w=4250.0,  # Breakout above 4250
        low_52w=3300.0
    )
    result = engine.evaluate_stock_change(ctx)
    assert result.is_meaningful
    assert EventType.NEW_52W_HIGH in result.event_types
    assert result.factor_breakdown.is_52w_high is True


def test_significant_drop_downward_liquidity():
    """Verify HDFCBANK -4.3% with 1.8x volume triggers SIGNIFICANT_DROP."""
    engine = MeaningfulChangeEngine()
    ctx = StockDeltaContext(
        symbol="HDFCBANK",
        company_name="HDFC Bank",
        previous_price=1546.0,
        current_price=1480.0,  # -4.27%
        current_volume=21_600_000,
        typical_volume=12_000_000,  # 1.8x
        typical_volatility_pct=1.4,
        high_52w=1780.0,
        low_52w=1380.0
    )
    result = engine.evaluate_stock_change(ctx)
    assert result.is_meaningful
    assert EventType.SIGNIFICANT_DROP in result.event_types
    assert EventType.UNUSUAL_VOLUME in result.event_types


def test_configurable_threshold_tuning():
    """Verify engine respects custom tuned thresholds."""
    custom_thresholds = SignificanceThresholds(
        min_price_move_pct=1.0,  # Stricter noise threshold
        score_high=0.75          # Higher bar for HIGH severity
    )
    custom_engine = MeaningfulChangeEngine(thresholds=custom_thresholds)

    ctx = StockDeltaContext(
        symbol="TEST",
        company_name="Test Stock",
        previous_price=100.0,
        current_price=100.8,  # +0.8% (below custom 1.0% min)
        current_volume=100_000,
        typical_volume=100_000,
        typical_volatility_pct=1.0
    )
    result = custom_engine.evaluate_stock_change(ctx)
    assert result.factor_breakdown.price_score == 0.0


def test_signal_explainer_transparency():
    """Verify explainer generates transparent factor cards and plain language."""
    engine = MeaningfulChangeEngine()
    ctx = StockDeltaContext(
        symbol="INFY",
        company_name="Infosys Ltd.",
        previous_price=1834.0,
        current_price=1940.5,
        current_volume=10_080_000,
        typical_volume=4_200_000,
        typical_volatility_pct=1.2,
        high_52w=1950.0,
        low_52w=1350.0
    )
    res = engine.evaluate_stock_change(ctx)
    explanation = explainer.explain_evaluation(res)

    assert "factor_cards" in explanation
    assert len(explanation["factor_cards"]) == 5
    assert "plain_language_explanation" in explanation
    assert "Infosys Ltd." in explanation["plain_language_explanation"]
    assert explanation["is_actionable_signal"] is True
