# 현재 구현 감사 보고서 (As-Is Audit)

## 1. 대상

- 경로: `personal_study_program/frontend`
- 라우팅: `/`, `/study`, `/plan`, `/test`, `/settings`

## 2. 확인 결과 요약

### 구현 완료 (UI 중심)
- 대시보드 카드/차트/약점 영역
- 학습 자료 탭 + 스크립트 다이얼로그
- 주간 학습 플랜 화면
- 시험 풀이 화면 (정답 확인/해설)
- 설정 화면(프로필/자격증 관리 UI)

### 미구현/정적 데이터
- 백엔드 API 미연동
- 합격확률/학습점수/오늘할일 하드코딩
- 오답 저장/복습 큐 미구현
- GPT 문제 생성 미구현

## 3. 핵심 기술 부채

1. 상태 분산
- Dashboard는 CertificationContext 사용
- Study/Test/Plan/Settings는 페이지 로컬 state
- 탭 간 자격증 동기화 불가

2. 데이터 중복
- 자격증/과목 데이터가 파일마다 중복 선언

3. 엔진 부재
- Study Engine, Review Scheduler, Analytics Engine 없음

## 4. 우선 개선 항목

- 전역 상태 통합 (자격증/점수/플랜)
- 온보딩 흐름 추가
- Test에 오답 저장 플로우 추가
- Dashboard 실데이터 연동

---

승인 상태: `Draft`
