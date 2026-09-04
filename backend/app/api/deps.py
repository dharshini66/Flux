"""
FastAPI Dependency Injection.
Provides database sessions and JWT user authentication with demo fallback.
"""
from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.db.models import User
from app.core.security import decode_access_token


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Extracts user from Bearer JWT.
    If no header provided, seamlessly loads the seeded demo analyst user
    to provide a zero-friction evaluation experience.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            user_id = payload["sub"]
            user = await db.get(User, user_id)
            if user:
                return user

    # Fallback to seeded demo user
    demo_email = "analyst@flux.market"
    res = await db.execute(select(User).where(User.email == demo_email))
    demo_user = res.scalars().first()
    if demo_user:
        return demo_user

    # If demo user not yet created, fetch first available user
    res_first = await db.execute(select(User).limit(1))
    first_user = res_first.scalars().first()
    if first_user:
        return first_user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or establish demo session."
    )
