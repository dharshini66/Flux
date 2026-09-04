"""
Market Mission & XP Reward Endpoints.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import User
from app.api.deps import get_current_user
from app.services.mission_service import mission_service

router = APIRouter(prefix="/missions", tags=["Market Missions"])


class ClaimMissionRequest(BaseModel):
    mission_id: str
    xp_amount: int = 10


@router.get("")
async def get_missions(current_user: User = Depends(get_current_user)):
    """Retrieve daily analysis quests, user rank, level progress, and unlocked badges."""
    return mission_service.get_missions_state(current_user.experience_points)


@router.post("/claim")
async def claim_mission(
    req: ClaimMissionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Claim XP reward for completing an exploratory milestone."""
    new_xp = await mission_service.award_xp(db, current_user.id, req.xp_amount)
    return mission_service.get_missions_state(new_xp)
