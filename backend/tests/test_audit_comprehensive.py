import pytest
from httpx import AsyncClient
from datetime import datetime, timezone, timedelta
import jwt

from app.core.config import settings
from app.engine.change_engine import (
    change_engine, StockDeltaContext, SignalSeverity, EventType
)

@pytest.mark.asyncio
async def test_auth_full_lifecycle(client: AsyncClient):
    # 1. Register valid user
    reg_res = await client.post('/api/v1/auth/register', json={
        'email': 'audit_user@flux.market',
        'username': 'audit_user',
        'password': 'Password123!',
        'full_name': 'Audit Tester'
    })
    assert reg_res.status_code == 200, reg_res.text
    token = reg_res.json()['access_token']
    user_id = reg_res.json()['user']['id']
    assert token is not None
    assert reg_res.json()['user']['email'] == 'audit_user@flux.market'

    # 2. Duplicate registration should fail
    dup_res = await client.post('/api/v1/auth/register', json={
        'email': 'audit_user@flux.market',
        'username': 'audit_user_2',
        'password': 'Password123!'
    })
    assert dup_res.status_code == 400
    assert 'already exists' in dup_res.json()['detail'].lower()

    # 3. Missing fields should fail with 422
    missing_res = await client.post('/api/v1/auth/register', json={
        'email': 'missing@flux.market'
    })
    assert missing_res.status_code == 422

    # 4. Valid Login
    login_res = await client.post('/api/v1/auth/login', json={
        'username_or_email': 'audit_user@flux.market',
        'password': 'Password123!'
    })
    assert login_res.status_code == 200
    assert 'access_token' in login_res.json()

    # 5. Invalid Login (wrong password)
    bad_login = await client.post('/api/v1/auth/login', json={
        'username_or_email': 'audit_user@flux.market',
        'password': 'WrongPassword'
    })
    assert bad_login.status_code == 401

    # 6. Authenticated /auth/me
    me_res = await client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert me_res.status_code == 200
    assert me_res.json()['username'] == 'audit_user'

    # 7. Invalid Token must reject with 401
    invalid_res = await client.get('/api/v1/auth/me', headers={'Authorization': 'Bearer totally_bogus_token'})
    assert invalid_res.status_code == 401

    # 8. Expired Token must reject with 401
    expired_payload = {
        'sub': user_id,
        'exp': datetime.now(timezone.utc) - timedelta(days=1),
        'iat': datetime.now(timezone.utc) - timedelta(days=2)
    }
    expired_token = jwt.encode(expired_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    expired_res = await client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {expired_token}'})
    assert expired_res.status_code == 401

    # 9. Malformed Authorization header must reject with 401
    malformed_res = await client.get('/api/v1/auth/me', headers={'Authorization': 'NotBearer xyz'})
    assert malformed_res.status_code == 401


@pytest.mark.asyncio
async def test_watchlist_crud_and_isolation(client: AsyncClient):
    # User A
    user_a_reg = await client.post('/api/v1/auth/register', json={
        'email': 'user_a@flux.market',
        'username': 'user_a',
        'password': 'Password123!'
    })
    token_a = user_a_reg.json()['access_token']
    headers_a = {'Authorization': f'Bearer {token_a}'}

    # User B
    user_b_reg = await client.post('/api/v1/auth/register', json={
        'email': 'user_b@flux.market',
        'username': 'user_b',
        'password': 'Password123!'
    })
    token_b = user_b_reg.json()['access_token']
    headers_b = {'Authorization': f'Bearer {token_b}'}

    # User A creates a second watchlist
    create_wl = await client.post('/api/v1/watchlists', json={
        'name': 'Tech Growth',
        'description': 'High velocity tech equities'
    }, headers=headers_a)
    assert create_wl.status_code == 201
    wl_a_id = create_wl.json()['id']

    # User A adds INFY to Tech Growth
    add_stock = await client.post(f'/api/v1/watchlists/{wl_a_id}/stocks', json={
        'symbol': 'INFY',
        'is_priority': True
    }, headers=headers_a)
    assert add_stock.status_code == 201

    # Duplicate stock in same watchlist must return 400
    dup_stock = await client.post(f'/api/v1/watchlists/{wl_a_id}/stocks', json={
        'symbol': 'INFY'
    }, headers=headers_a)
    assert dup_stock.status_code == 400

    # User B CANNOT add stock to User A watchlist
    cross_add = await client.post(f'/api/v1/watchlists/{wl_a_id}/stocks', json={
        'symbol': 'TCS'
    }, headers=headers_b)
    assert cross_add.status_code in [400, 404]

    # User B CANNOT delete User A watchlist
    cross_del = await client.delete(f'/api/v1/watchlists/{wl_a_id}', headers=headers_b)
    assert cross_del.status_code == 404

    # User A renames watchlist
    update_wl = await client.patch(f'/api/v1/watchlists/{wl_a_id}', json={
        'name': 'Tech Core Momentum'
    }, headers=headers_a)
    assert update_wl.status_code == 200
    assert update_wl.json()['name'] == 'Tech Core Momentum'

    # User A deletes watchlist
    del_wl = await client.delete(f'/api/v1/watchlists/{wl_a_id}', headers=headers_a)
    assert del_wl.status_code == 204


@pytest.mark.asyncio
async def test_baseline_snapshot_immutability_and_checkin(client: AsyncClient):
    reg = await client.post('/api/v1/auth/register', json={
        'email': 'snapshot_tester@flux.market',
        'username': 'snapshot_tester',
        'password': 'Password123!'
    })
    token = reg.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}

    # Step 1: First visit summary
    sum_1 = await client.get('/api/v1/changes/summary', headers=headers)
    assert sum_1.status_code == 200
    data_1 = sum_1.json()
    assert data_1['is_first_visit'] is True
    assert data_1['meaningful_changes_count'] == 0

    # Capture initial baseline timestamp
    snap_res_1 = await client.get('/api/v1/snapshots/latest', headers=headers)
    assert snap_res_1.status_code == 200
    initial_snap_id = snap_res_1.json()['snapshot']['id']
    initial_created_at = snap_res_1.json()['snapshot']['created_at']

    # Step 2: Switch scenario to simulate market movements
    await client.post('/api/v1/market/scenario', json={'scenario': 'large_surge'})

    # Step 3: Call GET /changes/summary multiple times (simulate page refreshes/polling)
    sum_poll_1 = await client.get('/api/v1/changes/summary', headers=headers)
    sum_poll_2 = await client.get('/api/v1/changes/summary', headers=headers)
    assert sum_poll_1.json()['meaningful_changes_count'] > 0
    assert sum_poll_2.json()['meaningful_changes_count'] > 0

    # Verify that polling did NOT create a new snapshot or overwrite the baseline
    snap_res_after_polling = await client.get('/api/v1/snapshots/latest', headers=headers)
    assert snap_res_after_polling.json()['snapshot']['id'] == initial_snap_id
    assert snap_res_after_polling.json()['snapshot']['created_at'] == initial_created_at

    # Step 4: Explicit Check-in commits a NEW baseline
    check_in_res = await client.post('/api/v1/snapshots/check-in', json={
        'session_label': 'Audit Midday Check-in'
    }, headers=headers)
    assert check_in_res.status_code == 200
    new_snap_id = check_in_res.json()['snapshot_id']
    assert new_snap_id != initial_snap_id

    # Restore default scenario
    await client.post('/api/v1/market/scenario', json={'scenario': 'default'})


def test_change_engine_mathematical_boundaries():
    # Sub-noise: 0% move
    res_0 = change_engine.evaluate_stock_change(StockDeltaContext(
        symbol='TEST', company_name='Test Corp',
        previous_price=1000.0, current_price=1000.0,
        current_volume=1_000_000, typical_volume=1_000_000
    ))
    assert res_0.significance_score == 0.0
    assert not res_0.is_meaningful
    assert res_0.severity == SignalSeverity.NORMAL

    # Sub-noise: 0.39% move (< 0.4% cutoff)
    res_039 = change_engine.evaluate_stock_change(StockDeltaContext(
        symbol='TEST', company_name='Test Corp',
        previous_price=1000.0, current_price=1003.9,
        current_volume=1_000_000, typical_volume=1_000_000
    ))
    assert res_039.factor_breakdown.price_score == 0.0
    assert not res_039.is_meaningful

    # At or above noise gate: 0.5% move
    res_05 = change_engine.evaluate_stock_change(StockDeltaContext(
        symbol='TEST', company_name='Test Corp',
        previous_price=1000.0, current_price=1005.0,
        current_volume=1_000_000, typical_volume=1_000_000
    ))
    assert res_05.factor_breakdown.price_score > 0.0

    # Extreme Surge: +7.5% price move with 3.5x volume
    res_extreme = change_engine.evaluate_stock_change(StockDeltaContext(
        symbol='TEST', company_name='Test Corp',
        previous_price=1000.0, current_price=1075.0,
        current_volume=3_500_000, typical_volume=1_000_000,
        high_52w=1070.0
    ))
    assert res_extreme.severity == SignalSeverity.CRITICAL
    assert res_extreme.is_meaningful is True
    assert res_extreme.significance_score >= 0.80
    assert EventType.NEW_52W_HIGH in res_extreme.event_types
    assert 0.0 <= res_extreme.significance_score <= 1.0

    # Missing / Zero Data robustness:
    res_missing = change_engine.evaluate_stock_change(StockDeltaContext(
        symbol='TEST', company_name='Test Corp',
        previous_price=0.0, current_price=100.0,
        current_volume=0.0, typical_volume=0.0,
        typical_volatility_pct=0.0, high_52w=0.0, low_52w=0.0
    ))
    assert 0.0 <= res_missing.significance_score <= 1.0
    assert res_missing.primary_event_type is not None


@pytest.mark.asyncio
async def test_all_demo_scenarios(client: AsyncClient):
    scenarios = [
        'default',
        'large_surge',
        'market_crash',
        'stale_data',
        'provider_failure',
        'no_signal_quiet'
    ]
    for sc in scenarios:
        res = await client.post('/api/v1/market/scenario', json={'scenario': sc})
        assert res.status_code == 200
        assert res.json()['active_scenario'] == sc

        summary_res = await client.get('/api/v1/changes/summary')
        assert summary_res.status_code == 200
        assert 'meaningful_changes_count' in summary_res.json()

        pulse_res = await client.get('/api/v1/market/pulse')
        assert pulse_res.status_code == 200
        assert len(pulse_res.json()['events']) > 0

    await client.post('/api/v1/market/scenario', json={'scenario': 'default'})


@pytest.mark.asyncio
async def test_health_and_observability(client: AsyncClient):
    res = await client.get('/health')
    assert res.status_code == 200
    data = res.json()
    assert data['status'] == 'healthy'
    assert data['database_connected'] is True

    ready_res = await client.get('/api/v1/health/ready')
    assert ready_res.status_code == 200
    assert ready_res.json()['ready'] is True

    thresholds_res = await client.get('/api/v1/changes/thresholds')
    assert thresholds_res.status_code == 200
    assert 'weights' in thresholds_res.json()
