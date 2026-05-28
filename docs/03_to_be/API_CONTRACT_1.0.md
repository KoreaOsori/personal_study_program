# API 계약서 (1.0 초안)

## 1. 인증

### POST /auth/register
- request: email, password, nickname
- response: user, accessToken

### POST /auth/login
- request: email, password
- response: user, accessToken

## 2. 학습

### GET /study/today
- response:
```json
{
  "today_plan": [{ "id": "t1", "title": "DB 정규화 10문제", "type": "quiz", "count": 10, "done": false }],
  "weakness": ["정규화", "자료구조"],
  "pass_probability": 58,
  "review_queue_count": 3
}
```

### POST /study/today-plan
- request: userCertId, dailyTime, scores
- response: tasks[], estimatedTime

### POST /study/submit
- request: questionId, selectedAnswer, isCorrect, durationSec
- response: saved, nextReviewDate

### GET /study/review
- response: reviewQuestions[]

## 3. AI

### POST /ai/generate-quiz
- request: exam, subject, difficulty, count
- response: questions[]

### POST /ai/review-quiz
- request: wrongQuestionIds or concepts
- response: regeneratedQuestions[]

## 4. 분석

### GET /analytics/dashboard
- response: passProbability, streak, subjectTrend, weakAreas

## 5. 공통 규칙

- 에러 포맷 통일
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```
- 시간값은 ISO-8601 UTC
- 버전은 `/v1` prefix 적용 권장

---

승인 상태: `Draft`
