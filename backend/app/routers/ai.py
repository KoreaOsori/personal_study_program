from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/v1/ai", tags=["ai"])


class GenerateQuizRequest(BaseModel):
    exam: str
    subject: str
    difficulty: str = "medium"
    count: int = 10


class QuizQuestionOut(BaseModel):
    id: str
    subject: str
    question: str
    options: list[str]
    correctIndex: int
    explanation: str
    concepts: list[str]
    difficulty: str
    source: str = "gpt"


class GenerateQuizResponse(BaseModel):
    questions: list[QuizQuestionOut]


class ReviewQuizRequest(BaseModel):
    wrongQuestionIds: list[str]


@router.post("/generate-quiz", response_model=GenerateQuizResponse)
async def generate_quiz(body: GenerateQuizRequest):
    # Placeholder — will be connected to GPT Orchestrator in Phase B3
    return GenerateQuizResponse(questions=[])


@router.post("/review-quiz", response_model=GenerateQuizResponse)
async def review_quiz(body: ReviewQuizRequest):
    # Placeholder — will be connected to GPT Orchestrator in Phase B3
    return GenerateQuizResponse(questions=[])
