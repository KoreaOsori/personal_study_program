from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import health, auth, study, ai, analytics

app = FastAPI(
    title="자꿍이 API",
    description="개인 맞춤형 학습 코치 서비스 API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(study.router)
app.include_router(ai.router)
app.include_router(analytics.router)
