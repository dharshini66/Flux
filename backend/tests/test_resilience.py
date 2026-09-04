"""
Resilience, Stale Data, and Provider Failure tests.
"""
import pytest
from app.services.market_data.demo_provider import demo_market_provider
from app.services.market_data.service import market_service
from app.services.market_data.base import FreshnessStatus


@pytest.mark.asyncio
async def test_per_stock_provider_failure_containment():
    """Verify that when one stock provider fails, other stocks continue to function."""
    demo_market_provider.set_scenario("provider_failure")
    quotes = await market_service.get_quotes_batch(["INFY", "HDFCBANK", "TCS"], bypass_cache=True)

    # HDFCBANK should be UNAVAILABLE with error message
    assert quotes["HDFCBANK"].freshness_status == FreshnessStatus.UNAVAILABLE
    assert quotes["HDFCBANK"].error_message is not None

    # INFY and TCS should load completely normal without crashing the dashboard
    assert quotes["INFY"].freshness_status == FreshnessStatus.LIVE
    assert quotes["INFY"].price > 0
    assert quotes["TCS"].freshness_status == FreshnessStatus.LIVE
    assert quotes["TCS"].price > 0

    # Reset
    demo_market_provider.set_scenario("default")


@pytest.mark.asyncio
async def test_stale_data_detection():
    """Verify stale data mode sets FreshnessStatus.STALE."""
    demo_market_provider.set_scenario("stale_data")
    quote = await market_service.get_quote("INFY", bypass_cache=True)

    assert quote.freshness_status == FreshnessStatus.STALE
    assert (quote.fetched_at - quote.market_timestamp).total_seconds() > 300

    # Reset
    demo_market_provider.set_scenario("default")
