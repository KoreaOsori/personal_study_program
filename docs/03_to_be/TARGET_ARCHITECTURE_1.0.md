# 1.0 목표 아키텍처 보고서

## 1. 아키텍처 원칙

1. 1.0은 단일 BFF(모놀리스)로 시작
2. 기능 모듈은 내부 패키지로 분리
3. 데이터 계약(API/DB)을 먼저 확정

## 2. 목표 구조

Frontend(Vite React)
→ API Server(FastAPI 또는 NestJS)
→ PostgreSQL
→ OpenAI API

## 3. 내부 모듈

- Auth Service
- Study Engine
- GPT Orchestrator
- Review Scheduler
- Analytics Engine

## 4. 데이터 모델 핵심

- users
- user_certifications
- subject_scores
- questions
- wrong_answers
- study_logs
- daily_plans
- review_queue

## 5. 1.0 아키텍처 결정 사항

- 마이크로서비스 분할은 1.1 이후
- Redis 캐시는 선택(비용/속도 보고 결정)
- Queue/BullMQ는 1.0 제외

---

승인 상태: `Draft`
