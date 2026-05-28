from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db

router = APIRouter(prefix="/v1/study", tags=["study"])


class TodayTask(BaseModel):
    id: str
    title: str
    type: str
    subject: str | None = None
    count: int | None = None
    done: bool = False


class TodayPlanResponse(BaseModel):
    today_plan: list[TodayTask]
    weakness: list[str]
    pass_probability: int
    review_queue_count: int


class SubmitRequest(BaseModel):
    questionId: str
    selectedAnswer: int
    isCorrect: bool
    durationSec: int


class SubmitResponse(BaseModel):
    saved: bool
    nextReviewDate: str | None = None


@router.get("/today", response_model=TodayPlanResponse)
async def get_today_plan(db: AsyncSession = Depends(get_db)):
    return TodayPlanResponse(
        today_plan=[
            TodayTask(
                id="t1",
                title="데이터베이스 정규화 10문제",
                type="quiz",
                subject="데이터베이스",
                count=10,
                done=False,
            ),
            TodayTask(
                id="t2",
                title="프로그래밍 기초 10문제",
                type="quiz",
                subject="프로그래밍",
                count=10,
                done=False,
            ),
            TodayTask(
                id="t3",
                title="소프트웨어설계 복습 20분",
                type="review",
                subject="소프트웨어설계",
                done=False,
            ),
        ],
        weakness=["정규화", "자료구조"],
        pass_probability=58,
        review_queue_count=5,
    )


@router.post("/submit", response_model=SubmitResponse)
async def submit_answer(body: SubmitRequest, db: AsyncSession = Depends(get_db)):
    return SubmitResponse(saved=True, nextReviewDate=None)


@router.get("/review")
async def get_review_questions(db: AsyncSession = Depends(get_db)):
    return {"review_questions": []}
