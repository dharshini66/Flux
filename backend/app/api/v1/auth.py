"""
Authentication & User Profile Endpoints.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.db.models import User, Watchlist, WatchlistStock
from app.core.security import hash_password, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None


class LoginRequest(BaseModel):
    username_or_email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: Optional[str]
    role: str
    experience_points: int


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if email or username already exists
    stmt = select(User).where((User.email == req.email) | (User.username == req.username))
    res = await db.execute(stmt)
    if res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email or username already exists."
        )

    new_user = User(
        email=req.email,
        username=req.username,
        full_name=req.full_name or req.username,
        hashed_password=hash_password(req.password),
        role="analyst",
        experience_points=0
    )
    db.add(new_user)
    await db.flush()

    # Create initial default watchlist
    wl = Watchlist(
        user_id=new_user.id,
        name="Primary Focus",
        description="Core equity watchlist",
        is_default=True,
        position=0
    )
    db.add(wl)
    await db.flush()

    # Add starter stocks
    for idx, sym in enumerate(["INFY", "TCS", "RELIANCE", "HDFCBANK", "ICICIBANK"]):
        db.add(WatchlistStock(
            watchlist_id=wl.id,
            stock_symbol=sym,
            is_priority=(sym in ["INFY", "RELIANCE"]),
            position=idx
        ))

    await db.commit()
    await db.refresh(new_user)

    token = create_access_token(subject=new_user.id)
    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=new_user.id,
            email=new_user.email,
            username=new_user.username,
            full_name=new_user.full_name,
            role=new_user.role,
            experience_points=new_user.experience_points
        )
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(
        (User.email == req.username_or_email) | (User.username == req.username_or_email)
    )
    res = await db.execute(stmt)
    user = res.scalars().first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password."
        )

    token = create_access_token(subject=user.id)
    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            role=user.role,
            experience_points=user.experience_points
        )
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        role=current_user.role,
        experience_points=current_user.experience_points
    )
