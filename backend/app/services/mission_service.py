"""
Market Mission & Educational Experience Service.
Implements the subtle game layer rewarding analytical depth and market understanding.
Never rewards trading frequency or transactions.
"""
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User


class MissionService:

    def get_missions_state(self, user_xp: int) -> Dict[str, Any]:
        """Returns the daily market mission list and unlocked achievements."""
        
        missions = [
            {
                "id": "mission-1",
                "title": "Review Your Biggest Mover",
                "objective": "Inspect the plain-language explanation for today's highest significance stock.",
                "xp_reward": 10,
                "is_completed": user_xp >= 10,
                "icon": "TrendingUp",
                "category": "ANALYSIS"
            },
            {
                "id": "mission-2",
                "title": "Investigate Unusual Volume",
                "objective": "Identify a stock trading above 2.0x typical baseline volume.",
                "xp_reward": 15,
                "is_completed": user_xp >= 25,
                "icon": "BarChart3",
                "category": "VOLUME"
            },
            {
                "id": "mission-3",
                "title": "Check 52-Week High Breakout",
                "objective": "Examine a stock testing or breaking its 52-week historical peak.",
                "xp_reward": 20,
                "is_completed": user_xp >= 45,
                "icon": "Award",
                "category": "LEVELS"
            },
            {
                "id": "mission-4",
                "title": "Establish Snapshot Baseline",
                "objective": "Record your reference market check-in to track future deltas.",
                "xp_reward": 10,
                "is_completed": True,
                "icon": "Camera",
                "category": "SNAPSHOT"
            }
        ]

        badges = [
            {
                "id": "badge-first-signal",
                "name": "FIRST FLUX",
                "description": "Detected and analyzed your first high-impact market event.",
                "unlocked": user_xp >= 10,
                "rarity": "COMMON",
                "icon_code": "01"
            },
            {
                "id": "badge-market-scout",
                "name": "MARKET SCOUT",
                "description": "Maintained clean cross-session baseline snapshots.",
                "unlocked": user_xp >= 30,
                "rarity": "UNCOMMON",
                "icon_code": "02"
            },
            {
                "id": "badge-pattern-spotter",
                "name": "PATTERN SPOTTER",
                "description": "Decomposed a multi-factor compound catalyst signal.",
                "unlocked": user_xp >= 60,
                "rarity": "RARE",
                "icon_code": "03"
            },
            {
                "id": "badge-signal-master",
                "name": "FLUX MASTER",
                "description": "Achieved deep market comprehension with zero noise trading.",
                "unlocked": user_xp >= 100,
                "rarity": "LEGENDARY",
                "icon_code": "04"
            }
        ]

        # Determine level based on XP (every 50 XP = 1 Level)
        level = (user_xp // 50) + 1
        current_level_xp = user_xp % 50
        next_level_xp = 50

        return {
            "total_xp": user_xp,
            "level": level,
            "rank_title": self._get_rank_title(level),
            "level_progress_pct": round((current_level_xp / next_level_xp) * 100),
            "current_level_xp": current_level_xp,
            "next_level_xp": next_level_xp,
            "missions": missions,
            "badges": badges
        }

    def _get_rank_title(self, level: int) -> str:
        ranks = {
            1: "Junior Market Observer",
            2: "Signal Analyst",
            3: "Intelligence Scout",
            4: "Senior Market Strategist",
            5: "Chief Signal Master"
        }
        return ranks.get(level, "Chief Signal Master")

    async def award_xp(self, session: AsyncSession, user_id: str, xp_amount: int) -> int:
        """Award XP to user for exploratory milestones."""
        user = await session.get(User, user_id)
        if not user:
            return 0
        user.experience_points += xp_amount
        await session.commit()
        return user.experience_points


mission_service = MissionService()
