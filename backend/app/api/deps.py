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
    if authorization is not None:
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization scheme. Expected 'Bearer <token>'."
            )
        token = authorization.split(" ", 1)[1].strip()
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token."
            )
        user_id = payload["sub"]
        user = await db.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User associated with token not found."
            )
        return user

    # Fallback to seeded demo user when no authorization header is provided (for local evaluation ease)
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
        detail="Authentication required."
    )
