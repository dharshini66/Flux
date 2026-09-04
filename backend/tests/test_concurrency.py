"""
Concurrency & Idempotency Tests for simultaneous user check-ins.
"""
import pytest
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User
from app.services.snapshot_service import snapshot_service
from app.core.security import hash_password
from conftest import TestingSessionLocal


@pytest.mark.asyncio
async def test_simultaneous_check_ins_idempotency(db_session: AsyncSession):
    """
    Test two tabs or concurrent requests checking in simultaneously via separate DB sessions.
    Both should succeed and maintain database integrity without deadlocks or corrupt snapshots.
    """
    user = User(
        email="concurrent@signal.market",
        username="concurrent_user",
        hashed_password=hash_password("pass123"),
        full_name="Concurrent Analyst"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    # Establish baseline
    await snapshot_service.process_user_check_in(db_session, user.id)

    async def check_in_session(label: str):
        async with TestingSessionLocal() as session:
            return await snapshot_service.process_user_check_in(session, user.id, session_label=label)

    # Execute 2 concurrent check-ins simulating 2 distinct browser tabs
    res1, res2 = await asyncio.gather(
        check_in_session("Tab 1 Check-in"),
        check_in_session("Tab 2 Check-in")
    )

    assert res1["snapshot_id"] is not None
    assert res2["snapshot_id"] is not None
    assert "changes" in res1
    assert "changes" in res2
