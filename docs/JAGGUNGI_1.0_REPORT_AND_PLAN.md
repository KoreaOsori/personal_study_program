# 자꿍이(Jaggungi) 1.0 — 현황 분석 보고서 및 구현 계획서

**문서 버전:** 1.0  
**작성일:** 2026-05-27  
**대상:** `personal_study_program`  
**Figma 원본:** [Personalized Study Coach App](https://www.figma.com/design/J6nWnUkKWhNRnn7xnmQ2Sv/Personalized-Study-Coach-App)

---

## 1. 요약 (Executive Summary)

**자꿍이**는 시험 합격을 목표로 하는 개인 맞춤 학습 코치 서비스입니다. 핵심 가치는 **「생성 → 틀림 → 반복」** 루프이며, 약점 진단·일일 플랜·기출 생성·오답 추적·합격 확률 예측을 한 흐름으로 제공하는 것이 목표입니다.

| 구분 | 현재 상태 | 1.0 목표 |
|------|-----------|----------|
| 프론트엔드 UI | Figma 기반 **약 80%** 화면 구현 (목 데이터) | 실데이터 연동 + 온보딩/점수 입력 |
| 학습 엔진 | **미구현** (하드코딩 수치) | 규칙 기반 Study Engine + GPT 연동 |
| 백엔드/API | **없음** | MVP API (Auth, Study, AI, Analytics) |
| DB | **없음** | PostgreSQL (또는 Firebase 단계적) |
| AI | **없음** | OpenAI Orchestrator + 프롬프트 파이프라인 |

**결론:** UI·UX 프로토타입은 충분히 검증 가능한 수준이나, **「자꿍이 엔진」과 데이터 영속성이 없어 서비스로서의 핵심 루프는 아직 작동하지 않습니다.** 1.0은 **「규칙 기반 엔진 + 최소 백엔드 + GPT 문제 생성」**에 집중하고, Vector DB·BullMQ·고도화 추천은 1.1 이후로 미루는 것이 현실적입니다.

---

## 2. 비전 대비 현황 — 갭 분석

### 2.1 설계 문서의 핵심 루프 vs 구현

```
[설계]  입력 → 진단 → 플랜 → 기출 → 풀이 → 오답 저장 → 다음날 반복
[현재]  UI 표시 → (고정 mock) → 풀이 UI 2문제 → 오답노트 UI만 (저장 없음)
```

| 기능 | 설계 요구 | 코드 현황 | 갭 |
|------|-----------|-----------|-----|
| 시험/과목/점수 입력 | 사용자 입력 기반 | Dashboard·Settings에 **고정 점수** | 온보딩·점수 CRUD 없음 |
| 약점 분석 (40점 이하) | score 기반 priority | `getWeakAreasByCertName` **정적 배열** | 알고리즘 미연동 |
| 오늘 학습량 분배 | daily_time 기반 | `todayTasks` **하드코딩** | Study Engine 없음 |
| 기출/퀴즈 생성 | GPT | `sampleQuestions` 2문항 | AI 미연동 |
| 오답 저장·재출제 | DB + Review Scheduler | Test 하단 **UI만**, 저장 없음 | WrongAnswers 테이블 없음 |
| 합격 확률 | 공식 기반 | `passProb = 58` **상수** | Analytics Engine 없음 |
| Spaced Repetition | 1일/3일/매일 | 미구현 | Review Scheduler 없음 |

### 2.2 기술 스택 — 문서 vs 실제

| 영역 | 초기 계획 문서 | **실제 코드** | 권장 (1.0) |
|------|----------------|---------------|------------|
| Frontend | Next.js + Tailwind | **Vite 6 + React 18 + React Router 7 + Tailwind 4 + shadcn/ui** | **Vite 유지** (이미 Figma export 완료) |
| Backend | NestJS / FastAPI | 없음 | **FastAPI** (Python AI 친화) 또는 **NestJS** (TS 통일) |
| DB | PostgreSQL | 없음 | PostgreSQL (Supabase/Railway) |
| Auth | Firebase / Auth.js | 없음 | **Clerk** 또는 **Supabase Auth** (MVP 속도) |
| AI | OpenAI | 없음 | OpenAI API + 서버 프록시 |
| Cache | Redis | 없음 | 1.0 선택 (퀴즈 캐시는 1.1) |
| Infra | Vercel + Railway | 로컬 dev only | FE: Vercel / BE: Railway |

**Next.js로의 전환은 1.0에서 불필요합니다.** SEO·SSR이 필수가 아니면 기존 Vite SPA를 유지하고 API만 분리하는 편이 비용 대비 효율이 높습니다.

### 2.3 Figma UI 설계 vs 구현 화면

| Figma 컨셉 화면 | 구현 라우트 | 일치도 | 비고 |
|-----------------|-------------|--------|------|
| 메인 (오늘 할 것, 합격률) | `/` Dashboard | ★★★★☆ | 카드·게이지·약점 있음. **모바일 단일 컬럼 아님** (데스크톱 사이드바) |
| 분석 대시보드 | Dashboard 내 차트 | ★★★★☆ | Radar + LineChart. 데이터 정적 |
| 문제 풀이 | `/test` (taking 모드) | ★★★☆☆ | 4지선다·해설 OK. **「오답 저장」 버튼 없음** |
| 오답노트 | Test 하단 카드 | ★★☆☆☆ | **전용 페이지·리스트·재출제 로직 없음** |
| (문서에 없음) | `/study` 학습 자료 | — | **고도화**: 영상/문서·교육 스크립트 |
| (문서에 없음) | `/plan` 주간 플랜 | — | **고도화**: 주간 캘린더·목표 |
| 설정 | `/settings` | ★★★☆☆ | 프로필·자격증·알림 UI (저장 mock) |

**디자인 톤:** 문서는 다크모드 기본, 코드는 **라이트 테마 기본** (`theme.css` `:root`). `.dark` 토큰은 준비됨 — Settings의 darkMode 스위치는 **미연동**.

---

## 3. 코드베이스 상세 분석

### 3.1 프로젝트 구조

```
personal_study_program/
└── frontend/                 # 유일한 구현체 (72 파일)
    ├── src/app/
    │   ├── pages/            # 5개 화면
    │   ├── components/       # UI + CertificationManager + Logo
    │   ├── context/          # CertificationContext (Dashboard만 완전 연동)
    │   └── routes.tsx
    └── docs/                 # (본 문서)
```

**백엔드·공유 타입·환경 변수·테스트 디렉터리 없음.**

### 3.2 라우팅 및 정보 구조

| 경로 | 컴포넌트 | 역할 |
|------|----------|------|
| `/` | `Dashboard` | D-Day, 합격률, 오늘 학습, 차트, 약점 분석 |
| `/study` | `Study` | 과목별 학습 자료 (영상/문서, 스크립트 다이얼로그) |
| `/plan` | `StudyPlan` | 주간 학습 계획, 목표 진행률, 캘린더 |
| `/test` | `Test` | 모의고사 목록, 퀴즈 풀이, 오답노트 진입 |
| `/settings` | `Settings` | 프로필, 자격증(최대 3), 알림, 일일 목표 시간 |

### 3.3 상태 관리 — **중요한 기술 부채**

1. **`CertificationContext`**  
   - Dashboard, CertificationManager에서 사용  
   - 자격증 목록·선택·시험일·D-Day 계산  
   - **과목 점수·학습 로그는 Context에 없음**

2. **페이지별 독립 mock**  
   - `Study`, `StudyPlan`, `Test`, `Settings`는 각각 `cert1/cert2/cert3` 로컬 state  
   - Dashboard에서 자격증을 바꿔도 **다른 탭과 동기화되지 않음**

3. **데이터 중복**  
   - 자격증 DB: `CertificationManager.CERTIFICATION_DATABASE` (9종)  
   - Study/Test/Plan: 별도 3종 하드코딩  
   - 과목·약점·플랜: 자격증명 `includes()` 분기 반복

**1.0 1순위 리팩터:** `CertificationContext` 확장 또는 **Zustand + persist(localStorage)** 로 전역 사용자 프로필·점수·오늘 플랜 통합.

### 3.4 화면별 구현 깊이

#### Dashboard (`Dashboard.tsx`)
- ✅ 다중 자격증 선택, CertificationManager 연동  
- ✅ 과목별 Radar, 일별 LineChart (정처기만)  
- ✅ 약점 카드 (priority, AI 분석 문구)  
- ❌ `passProb`, `studyStreak`, `todayTasks`, `dailyScoreData` 전부 상수/mock  
- ❌ 「시작」 버튼 → 라우팅/엔진 호출 없음  

#### Study (`Study.tsx`)
- ✅ 자격증별 학습 자료 트리, 진행률, highlight(약점)  
- ✅ 교육 스크립트 / 이론 자료 Dialog  
- ❌ Context 미사용, 완료 상태 비영속  

#### StudyPlan (`StudyPlan.tsx`)
- ✅ 주간 요일별 task, 목표 progress  
- ❌ API/엔진과 무관한 정적 `weeklyPlanByCert`  

#### Test (`Test.tsx`)
- ✅ list / taking 모드, 정답 확인, 해설, 진행률  
- ❌ 모의고사별 문항 수와 무관하게 **항상 sampleQuestions 2개**  
- ❌ 오답 저장, WrongAnswers, GPT 재출제 없음  
- ❌ 오답노트 「풀기」가 동일 sample으로 연결  

#### Settings (`Settings.tsx`)
- ✅ 일일 목표 시간(분), 자격증 CRUD UI  
- ❌ Dashboard Context와 **별도 `managedCerts` state**  
- ❌ darkMode 스위치 → `document.documentElement` 미적용  

### 3.5 설계 대비 **이미 고도화된 부분** (유지 권장)

| 항목 | 설명 |
|------|------|
| 자격증 검색·시험 회차 선택 | 9종 DB + 회차별 D-Day |
| 다중 자격증 (최대 3) | 정보처리기사·TOEIC 등 병행 학습 |
| Study 탭 | 콘텐츠형 학습 (문서의 「기출만」보다 넓음) |
| 주간 StudyPlan | 단순 「오늘 할 것」을 넘어선 계획 UX |
| shadcn/ui + recharts | 분석·카드 UI 품질 양호 |
| 브랜딩 | Logo, 슬로건 「자기의 꿈을 이루자!」 |

### 3.6 설계 대비 **누락·불일치**

| 항목 | 조치 |
|------|------|
| 최초 온보딩 (시험·점수·남은 기간·daily_time) | 1.0 필수 플로우 추가 |
| 모바일 퍼스트 | 1.0 responsive 강화 또는 1.1 PWA |
| 오답 저장 버튼 (퀴즈 중) | Test taking UI에 추가 |
| 오답노트 전용 라우트 `/review` | 1.0 권장 |
| 다크모드 기본 | 제품 결정 후 theme 연동 |
| API Gateway / 6개 백엔드 모듈 | 1.0은 **단일 BFF**로 축소 |

---

## 4. 자꿍이 1.0 — 제품 범위 정의 (MVP)

### 4.1 1.0에서 **반드시** 되는 것 (Must Have)

1. **온보딩**  
   - 시험(자격증) 선택, 과목별 현재 점수, 목표 시험일, 하루 학습 시간(분)  
   - 저장: DB + localStorage 캐시  

2. **Study Engine (규칙 기반)**  
   - `score < 40` → priority +3  
   - `days_left < 30` → focus_mode (과목 수 축소, 분량 집중)  
   - `daily_time` 내 task 3~5개 자동 분배  
   - `POST /study/today-plan` (또는 동등 RPC)  

3. **GPT Orchestrator (최소)**  
   - 문제 생성: 과목·난이도·개수 → JSON 파싱 → DB 저장  
   - 오답 재출제: concept + 틀린 문항 → 유사 문항 생성  
   - 시스템 프롬프트: 문서의 「자꿍이」 원칙 그대로 사용  

4. **학습 루프**  
   - 퀴즈 풀이 → 정답/오답 기록 → WrongAnswers 저장  
   - Review Scheduler: 틀린 횟수별 1일/3일/매일 `next_review`  
   - Dashboard 「오늘 할 것」= API 응답 반영  

5. **합격 확률 (v0)**  
   - `passProbability = avgScore * 0.6 + consistency * 0.3 + recentGrowth * 0.1`  
   - consistency / growth는 StudyLogs 기반 단순 계산  

6. **인증**  
   - 이메일 또는 소셜 1종 (Google)  
   - 사용자별 데이터 격리  

### 4.2 1.0에서 **하지 않는 것** (Won't Have)

- Vector DB / RAG 기출 검색  
- BullMQ 대량 배치  
- Notion 연동 (노코드 1단계)  
- 네이티브 앱  
- 실시간 스트리밍 UI (백엔드 stream만 준비 가능)  
- 복수 AI 모델 라우팅 (mini/4.1 구분은 1.1)  
- Study 탭 영상 실제 스트리밍 (URL placeholder 유지 가능)  

### 4.3 1.0 성공 기준 (Acceptance Criteria)

- [ ] 신규 사용자가 온보딩 후 **당일 학습 플랜**을 볼 수 있다.  
- [ ] 플랜의 「퀴즈」 task 실행 시 **GPT 또는 캐시된 10문항**을 풀 수 있다.  
- [ ] 오답 1개 이상 저장 후, **다음 로그인/다음날** 복습 큐에 노출된다.  
- [ ] Dashboard 합격 확률이 **입력 점수·풀이 이력**에 따라 변한다.  
- [ ] 자격증 전환 시 **모든 탭**이 동일 자격증 컨텍스트를 쓴다.  

---

## 5. 목표 아키텍처 (1.0)

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Vite + React)                                 │
│  - Zustand / React Query                                 │
│  - pages: Dashboard, Study, Plan, Test, Review, Onboard  │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS / JSON
┌───────────────────────────▼─────────────────────────────┐
│  API Server (FastAPI 권장) — 단일 BFF                     │
│  ├─ /auth/*                                              │
│  ├─ /study/today, /study/submit, /study/review           │
│  ├─ /ai/generate-quiz, /ai/review-quiz                   │
│  └─ /analytics/dashboard                                 │
│       ├─ study_engine.py      (규칙)                     │
│       ├─ gpt_orchestrator.py  (프롬프트+파싱)            │
│       ├─ review_scheduler.py  (간격 반복)                │
│       └─ analytics_engine.py  (합격률)                   │
└───────────────────────────┬─────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   PostgreSQL          OpenAI API         (Redis 1.1)
```

**모듈 6개 분리는 코드 레벨 패키지로 나누되, 배포는 1개 서비스**로 시작합니다.

---

## 6. 데이터 모델 (1.0)

### 6.1 핵심 엔티티

```sql
-- Users
users (id, email, nickname, daily_study_minutes, created_at)

-- 사용자-자격증 (설계의 exams[])
user_certifications (
  id, user_id, cert_type_id, exam_date,
  created_at
)

-- 과목 점수 (입력 + 갱신)
subject_scores (
  id, user_cert_id, subject_key, score, updated_at
)

-- Questions (AI 생성 + 캐시)
questions (
  id, exam, subject, question, choices_json,
  answer_index, explanation, difficulty, source, created_at
)

-- WrongAnswers
wrong_answers (
  id, user_id, question_id, wrong_count,
  next_review_at, last_wrong_at, concept_tags
)

-- StudyLogs
study_logs (
  id, user_id, subject, duration_sec,
  accuracy, activity_type, created_at
)

-- Today plans (캐시/스냅샷)
daily_plans (
  id, user_id, user_cert_id, plan_date,
  tasks_json, generated_at
)

-- Review queue
review_queue (
  id, user_id, question_id, next_review_date, repeat_count
)
```

### 6.2 API ↔ 프론트 계약 (설계 문서 정렬)

**입력 (온보딩 / 갱신)**

```json
{
  "exam": "정보처리기사",
  "subjects": {
    "software_design": 50,
    "software_dev": 45,
    "database": 35,
    "programming": 25,
    "information_system": 45
  },
  "target_date": "2026-08-15",
  "daily_time": 120
}
```

**출력 (`GET /study/today`)**

```json
{
  "today_plan": [
    { "id": "t1", "title": "DB 정규화 10문제", "type": "quiz", "subject": "database", "count": 10, "done": false }
  ],
  "weakness": ["정규화", "자료구조"],
  "pass_probability": 58,
  "review_queue_count": 5
}
```

---

## 7. Study Engine — 1.0 알고리즘 명세

```python
def compute_subject_priority(score, wrong_count, days_left):
    priority = 0
    if score < 40:
        priority += 3
    elif score < 50:
        priority += 2
    if wrong_count >= 3:
        priority += 5
    elif wrong_count >= 1:
        priority += 2
    if days_left < 30:
        priority += 2  # focus_mode 가중
    return priority

def build_today_plan(subjects, daily_minutes, review_items, days_left):
    # 1. priority 정렬
    # 2. review_items 먼저 배정 (각 5~10분 가정)
    # 3. 남은 시간으로 weak subject quiz (10문제 ≈ 15분)
    # 4. 총 3~5 tasks, daily_minutes 초과 시 하위 priority 제거
    ...
```

**GPT 호출은** task type이 `quiz`이고 캐시 miss일 때만 수행합니다.

---

## 8. GPT Orchestrator — 프롬프트 및 파싱

### 8.1 시스템 프롬프트 (문서 원문 유지)

- 역할: 자꿍이 AI 학습 코치  
- 원칙: 짧고 실전적, 과부하 금지, 오답 반복 필수  

### 8.2 응답 JSON 스키마 (파서 필수)

```json
{
  "questions": [
    {
      "subject": "데이터베이스",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "...",
      "concepts": ["정규화", "1NF"]
    }
  ]
}
```

- `response_format: json_object` 또는 function calling 사용  
- 파싱 실패 시 **1회 재시도**, 실패 시 fallback 정적 문제 bank  

### 8.3 비용 통제 (1.0)

| 작업 | 모델 | 비고 |
|------|------|------|
| 문제 생성 (10문항) | gpt-4o-mini | 1.0은 mini로 시작 |
| 오답 재출제 (3~5문항) | gpt-4o-mini | |
| 약점 요약 문장 | gpt-4o-mini | Dashboard 카드용 |

---

## 9. 프론트엔드 구현 계획

### Phase F0 — 기반 정리 (1주)

| 작업 | 상세 |
|------|------|
| F0-1 | `pnpm` 의존성 정리, `react`/`react-dom` dependencies로 이동 |
| F0-2 | `src/lib/api.ts` + React Query 설치 |
| F0-3 | `useAppStore` (Zustand): selectedCert, scores, todayPlan |
| F0-4 | 모든 페이지 Context/store 통합 |
| F0-5 | `.env.example` (`VITE_API_URL`) |

### Phase F1 — 온보딩 & 설정 (1주)

| 작업 | 상세 |
|------|------|
| F1-1 | `/onboarding` 3-step wizard (시험 → 점수 → 시간/시험일) |
| F1-2 | 미완료 시 guard redirect |
| F1-3 | Settings ↔ API 동기화 (daily_time, certs) |
| F1-4 | darkMode → `next-themes` 또는 class toggle 연동 |

### Phase F2 — Dashboard & Plan 연동 (1주)

| 작업 | 상세 |
|------|------|
| F2-1 | Dashboard mock 제거 → `GET /analytics/dashboard` |
| F2-2 | 「시작」→ `/test?taskId=` 또는 `/study` |
| F2-3 | StudyPlan ← `GET /study/week` (optional 1.0) |

### Phase F3 — Test & Review (1.5주)

| 작업 | 상세 |
|------|------|
| F3-1 | `POST /ai/generate-quiz` 연동 |
| F3-2 | 풀이 중 「오답 저장」+ `POST /study/submit` |
| F3-3 | `/review` 오답노트 페이지 (리스트, 재출제, 중요 표시) |
| F3-4 | Review queue 배지 (Dashboard) |

---

## 10. 백엔드 구현 계획

### Phase B0 — 프로젝트 셋업 (3일)

```
personal_study_program/
├── frontend/          # 기존
└── backend/
    ├── app/
    │   ├── main.py
    │   ├── routers/
    │   ├── services/   # engine, gpt, review, analytics
    │   └── models/
    ├── alembic/
    └── requirements.txt
```

- FastAPI + SQLAlchemy 2 + Alembic  
- Docker Compose (postgres)  
- CORS, JWT middleware  

### Phase B1 — Auth & User (4일)

- `POST /auth/register`, `POST /auth/login`  
- `user_certifications` CRUD  
- `subject_scores` upsert  

### Phase B2 — Study Engine + Plans (5일)

- `POST /study/today-plan` (generate & persist)  
- `GET /study/today`  
- `GET /study/review`  
- Review scheduler cron or **lazy on login** (1.0은 lazy 권장)  

### Phase B3 — GPT + Questions (5일)

- `POST /ai/generate-quiz`  
- `POST /ai/review-quiz`  
- Prompt builder + JSON parser + questions 테이블 insert  

### Phase B4 — Analytics (3일)

- `GET /analytics/dashboard`  
- pass_probability, streak, subject trends  

---

## 11. 일정 제안 (총 8~10주, 1인 기준)

| 주차 | 프론트 | 백엔드 | 마일스톤 |
|------|--------|--------|----------|
| 1 | F0 | B0 | 로컬 FE+BE 연결, DB 마이그레이션 |
| 2 | F1 | B1 | 온보딩 E2E, Auth |
| 3 | F2 | B2 | 오늘의 플랜 실데이터 |
| 4 | F3 | B3 | 퀴즈 생성·풀이·오답 저장 |
| 5 | F3 | B3 | Review queue 동작 |
| 6 | F2 | B4 | 합격률·차트 실데이터 |
| 7 | QA | QA | 버그, 반응형, 에러 처리 |
| 8 | 배포 | 배포 | Vercel + Railway, 환경 변수 |

---

## 12. 리스크 및 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| GPT JSON 파싱 실패 | 퀴즈 공백 | 정적 fallback bank + 재시도 |
| API 비용 급증 | 운영 | 캐시 키 `exam:subject:difficulty`, 일일 생성 상한 |
| FE mock 제거 시 UI 공백 | UX | skeleton + empty state |
| 페이지별 state 불일치 | 데이터 혼란 | **F0-4 전역 store 필수** |
| 문서의 NestJS/Next 스택 착각 | 일정 지연 | **현 스택 유지** 명시 |
| 정보처리기사 외 과목 GPT 품질 | 품질 | 1.0은 정처기+TOEIC만 official 지원 |

---

## 13. 검토 의견 — 계획서 대비 권고 사항

### 13.1 잘 된 점

- **제품 비전과 루프**가 명확함 (생성→틀림→반복).  
- **프롬프트 엔진**이 이미 문서화되어 있어 백엔드 구현 시 그대로 이식 가능.  
- **Figma → 코드** 변환 품질이 높아, 1.0에서 UI 재작업 비용이 낮음.  
- **다중 자격증·학습 자료·주간 플랜**은 차별화 요소로 1.0 이후에도 유지 가치 있음.

### 13.2 조정 권고

1. **「Next.js 전환」 보류** — Vite SPA + API 분리.  
2. **백엔드 6서비스 마이크로서비스화 보류** — 모놀리식 FastAPI 패키지 구조.  
3. **1.0 AI 범위 축소** — 문제 생성 + 오답 재출제만; 약점 「AI 분석」 문장은 규칙 템플릿 + GPT 1줄 요약.  
4. **온보딩을 최우선** — 점수 입력 없이는 엔진이 돌지 않음.  
5. **오답노트 전용 페이지** — Figma에 없지만 설계 핵심이므로 `/review` 추가.  
6. **Study 탭** — 1.0에서는 「콘텐츠 소비」보다 「퀴즈 task」에 트래픽 집중; Study는 1.0 후반 또는 1.1.  

### 13.3 문서 vs 코드 우선순위 매트릭스

```
높은 비즈니스 가치
        │
        │  [오답 반복]  [오늘 플랜]  [GPT 퀴즈]
        │       ★           ★           ★
        │
        │  [합격률]    [온보딩/점수]
        │       ★           ★
        │
        │  [Study 자료]  [주간 Plan UI]
        │       ○           ○
        └────────────────────────────→ 구현 완료도(현재)
              낮음                    높음(UI만)
```

---

## 14. 실개발 착수 전 체크리스트

개발 착수 승인 전 아래를 확정하세요.

- [ ] **1.0 공식 지원 자격증**: 정보처리기사 필수 / TOEIC 포함 여부  
- [ ] **백엔드 언어**: FastAPI vs NestJS  
- [ ] **Auth 제공자**: Supabase vs Clerk vs Firebase  
- [ ] **호스팅 예산**: OpenAI 월 상한 (예: $50)  
- [ ] **테마 기본값**: 라이트 유지 vs 다크 기본  
- [ ] **타깃 디바이스**: 모바일 웹 우선 vs 데스크톱 병행  
- [ ] **본 문서 승인** 후 Git 브랜치 `develop` / `feature/engine-v1` 전략  

---

## 15. 부록 — 현재 파일 ↔ 1.0 작업 매핑

| 파일 | 1.0 작업 |
|------|----------|
| `CertificationContext.tsx` | → global store 확장, scores/plan 포함 |
| `Dashboard.tsx` | API 연동, mock 제거 |
| `Test.tsx` | generate-quiz, submit, 오답 저장 버튼 |
| `Study.tsx` | 1.1 또는 static 유지 |
| `StudyPlan.tsx` | `/study/week` 연동 (optional) |
| `Settings.tsx` | store/API 통합, theme |
| `CertificationManager.tsx` | cert_type_id를 백엔드 enum과 동기화 |
| (신규) `pages/Onboarding.tsx` | 온보딩 wizard |
| (신규) `pages/Review.tsx` | 오답노트 |
| (신규) `backend/` | 전체 API |

---

**다음 단계:** 본 문서 검토·체크리스트 확정 → Phase F0 + B0 동시 착수 → 2주차 데모: 「온보딩 → 오늘 플랜 → GPT 5문항 풀이 → 오답 저장」 E2E.

*— 자꿍이 1.0 기획·개발팀 내부 검토용 —*
