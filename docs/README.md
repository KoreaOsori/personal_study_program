# 자꿍이 1.0 문서 허브

이 디렉터리는 **실개발 착수 전 검토용** 문서를 체계적으로 누적하는 공간입니다.

## 문서 구조

- `00_master/`
  - `DOC_INDEX.md` : 전체 문서 인덱스 및 검토 순서
  - `REVIEW_GATE.md` : 개발 착수 승인 게이트
- `01_product/`
  - `PRODUCT_BRIEF.md` : 제품 비전, 문제정의, 성공기준
  - `SERVICE_FLOW_AND_PROMPTS.md` : 서비스 루프, 핵심 프롬프트 정책
- `02_as_is/`
  - `CURRENT_IMPLEMENTATION_AUDIT.md` : 현재 구현 감사 보고서
  - `FIGMA_UI_ALIGNMENT_REPORT.md` : Figma 대비 정합성 보고서
- `03_to_be/`
  - `TARGET_ARCHITECTURE_1.0.md` : 1.0 목표 아키텍처 및 데이터 모델
  - `API_CONTRACT_1.0.md` : API 계약서 (초안)
- `04_execution/`
  - `IMPLEMENTATION_PLAN_1.0.md` : 단계별 구현 계획서
  - `RISK_AND_DECISION_LOG.md` : 리스크/결정 로그

## 운영 원칙

1. 코드 변경 전, 관련 문서를 먼저 업데이트합니다.
2. 각 문서 하단에 `승인 상태`를 명시합니다.
3. 승인되지 않은 항목은 구현에 착수하지 않습니다.
4. 문서 변경 이력은 날짜 단위로 누적합니다.

## 현재 기준 문서

- 기존 통합 문서: `JAGGUNGI_1.0_REPORT_AND_PLAN.md`
- 본 허브는 위 통합 문서를 분할·정리한 운영형 문서 세트입니다.
