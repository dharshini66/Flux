"""
Authentication and Watchlist Integration Tests.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_auth_registration_and_login(client: AsyncClient):
    """Test full registration and login lifecycle."""
    reg_resp = await client.post("/api/v1/auth/register", json={
        "email": "trader@signal.market",
        "username": "trader_joe",
        "password": "securepassword123",
        "full_name": "Trader Joe"
    })
    assert reg_resp.status_code == 200
    data = reg_resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "trader@signal.market"

    # Login
    login_resp = await client.post("/api/v1/auth/login", json={
        "username_or_email": "trader@signal.market",
        "password": "securepassword123"
    })
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data


@pytest.mark.asyncio
async def test_watchlist_duplicate_stock_prevention(client: AsyncClient):
    """Test that adding the same stock twice returns a 400 error."""
    # List watchlists
    wl_resp = await client.get("/api/v1/watchlists")
    assert wl_resp.status_code == 200
    watchlists = wl_resp.json()
    assert len(watchlists) > 0
    wl_id = watchlists[0]["id"]

    # INFY is already in primary focus, adding it again should fail
    add_resp = await client.post(f"/api/v1/watchlists/{wl_id}/stocks", json={
        "symbol": "INFY"
    })
    assert add_resp.status_code == 400
    assert "already exists" in add_resp.json()["detail"].lower()
