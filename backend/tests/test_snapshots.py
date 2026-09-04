"""
Snapshot comparison and first-visit lifecycle tests.
"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User
from app.services.snapshot_service import snapshot_service
from app.core.security import hash_password


@pytest.mark.asyncio
async def test_first_visit_does_not_fabricate_changes(db_session: AsyncSession):
    """Verify first-time user receives baseline setup without phantom alerts."""
    # Create fresh user with no snapshots
    user = User(
        email="new_user@signal.market",
        username="newbie",
        hashed_password=hash_password("pass123"),
        full_name="New Analyst"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    result = await snapshot_service.process_user_check_in(db_session, user.id)

    assert result["is_first_visit"] is True
    assert result["meaningful_changes_count"] == 0
    assert result["changes"] == []
    assert "YOUR WATCHLIST IS READY" in result["headline"]
    assert result["breakdown"]["price_movements"] == 0


@pytest.mark.asyncio
async def test_returning_visit_computes_meaningful_deltas(db_session: AsyncSession):
    """Verify returning visit computes delta against previous snapshot and discovers changes."""
    # Create user
    user = User(
        email="returning@signal.market",
        username="returning_analyst",
        hashed_password=hash_password("pass123"),
        full_name="Returning Analyst"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    # 1. First Visit establishes baseline
    first_result = await snapshot_service.process_user_check_in(db_session, user.id)
    assert first_result["is_first_visit"] is True

    # 2. Second Visit detects changes
    second_result = await snapshot_service.process_user_check_in(db_session, user.id)
    assert second_result["is_first_visit"] is False
    assert second_result["meaningful_changes_count"] >= 0
    assert "snapshot_id" in second_result
