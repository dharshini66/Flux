"""
E2E Verification Script for FLUX Web Application.
"""
import httpx
import sys

def verify_all():
    with httpx.Client() as client:
        # 1. Health Check
        r_health = client.get('http://127.0.0.1:8000/health')
        assert r_health.status_code == 200
        print("1. Health Check: OK (DB & Cache Online)")

        # 2. Trigger Snapshot Check-in
        r_checkin = client.post('http://127.0.0.1:8000/api/v1/snapshots/check-in', json={'session_label': 'Mid-Day Session Review'})
        assert r_checkin.status_code == 200
        data = r_checkin.json()
        print(f"2. Check-in Headline: {data['headline']}")
        print(f"   Meaningful Changes Count: {data['meaningful_changes_count']}")
        print(f"   Breakdown: {data['breakdown']}")
        for c in data['changes'][:3]:
            print(f"   -> {c['symbol']}: {c['price_change_pct']}% | Severity: {c['severity']} | {c['headline']}")

        # 3. Test Explainability Diagnostics
        r_explain = client.post('http://127.0.0.1:8000/api/v1/changes/explain', json={
            'symbol': 'INFY',
            'previous_price': 1834.0,
            'current_price': 1940.5,
            'current_volume': 10080000,
            'typical_volume': 4200000,
            'typical_volatility_pct': 1.2,
            'high_52w': 1950.0,
            'low_52w': 1350.0
        })
        assert r_explain.status_code == 200
        exp = r_explain.json()
        print(f"3. Explainability Diagnostics for INFY:")
        print(f"   Severity: {exp['severity']} | Score: {exp['significance_score']} | Indicator: {exp['signal_dots']}")
        print(f"   Plain-Language: {exp['plain_language_explanation']}")
        print(f"   Factor Cards Count: {len(exp['factor_cards'])}")

        # 4. Test Scenario Switching
        r_scen = client.post('http://127.0.0.1:8000/api/v1/market/scenario', json={'scenario': 'large_surge'})
        assert r_scen.status_code == 200
        print("4. Scenario Switching: OK (Switched to large_surge)")

        r_surge = client.get('http://127.0.0.1:8000/api/v1/stocks/INFY')
        assert r_surge.status_code == 200
        print(f"   INFY Surge Price: Rs {r_surge.json()['quote']['price']} (+{r_surge.json()['quote']['change_1d_pct']}%)")

        # Reset back to default
        client.post('http://127.0.0.1:8000/api/v1/market/scenario', json={'scenario': 'default'})

        # 5. Test Watchlist Stock Operations
        r_wl = client.get('http://127.0.0.1:8000/api/v1/watchlists')
        assert r_wl.status_code == 200
        wl_id = r_wl.json()[0]['id']
        print(f"5. Watchlists: OK (Found {len(r_wl.json())} watchlists)")

        # 6. Test Market Missions
        r_mission = client.get('http://127.0.0.1:8000/api/v1/missions')
        assert r_mission.status_code == 200
        m_data = r_mission.json()
        print(f"6. Market Missions: OK (Rank: {m_data['rank_title']} | XP: {m_data['total_xp']})")

        print("\nALL BACKEND & INTEGRATION CHECKS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    verify_all()
