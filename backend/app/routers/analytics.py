from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db

router = APIRouter(prefix="/v1/analytics", tags=["analytics"])


class DashboardResponse(BaseModel):
    pass_probability: int
    streak: int
    subject_trend: list[dict]
    weak_areas: list[str]


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    # Placeholder — will be connected to Analytics Engine in Phase B4
    return DashboardResponse(
        pass_probability=58,
        streak=12,
        subject_trend=[],
        weak_areas=["정규화", "자료구조"],
    )
