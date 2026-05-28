import type { QuizQuestion } from "../store/useAppStore";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

interface GenerateQuizRequest {
  exam: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  count: number;
}

interface GenerateQuizResponse {
  questions: QuizQuestion[];
}

export async function generateQuiz(
  params: GenerateQuizRequest
): Promise<QuizQuestion[]> {
  try {
    const data = await apiRequest<GenerateQuizResponse>("/v1/ai/generate-quiz", {
      method: "POST",
      body: params,
    });
    return data.questions;
  } catch {
    return getFallbackQuestions(params.exam, params.subject, params.count);
  }
}

interface SubmitAnswerRequest {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  durationSec: number;
}

export async function submitAnswer(params: SubmitAnswerRequest): Promise<void> {
  try {
    await apiRequest("/v1/study/submit", {
      method: "POST",
      body: params,
    });
  } catch {
    // Silently fail — local store already has the data
  }
}

interface ReviewQuizRequest {
  wrongQuestionIds: string[];
}

export async function generateReviewQuiz(
  params: ReviewQuizRequest
): Promise<QuizQuestion[]> {
  try {
    const data = await apiRequest<GenerateQuizResponse>("/v1/ai/review-quiz", {
      method: "POST",
      body: params,
    });
    return data.questions;
  } catch {
    return [];
  }
}

function getFallbackQuestions(
  _exam: string,
  subject: string,
  count: number
): QuizQuestion[] {
  const questionBank: Record<string, QuizQuestion[]> = {
    데이터베이스: [
      {
        id: "fb_db_1",
        subject: "데이터베이스",
        question: "다음 중 제1정규형(1NF)에 대한 설명으로 옳은 것은?",
        options: [
          "모든 속성이 원자값을 가져야 한다",
          "부분 함수 종속을 제거해야 한다",
          "이행 함수 종속을 제거해야 한다",
          "다치 종속을 제거해야 한다",
        ],
        correctIndex: 0,
        explanation:
          "제1정규형은 모든 속성이 원자값(Atomic Value)을 가져야 하며, 반복되는 그룹이 없어야 합니다.",
        concepts: ["정규화", "1NF"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_db_2",
        subject: "데이터베이스",
        question: "제2정규형(2NF)을 만족하기 위한 조건은?",
        options: [
          "모든 속성이 원자값을 가져야 한다",
          "부분 함수 종속을 제거해야 한다",
          "이행 함수 종속을 제거해야 한다",
          "모든 결정자가 후보키여야 한다",
        ],
        correctIndex: 1,
        explanation:
          "제2정규형은 1NF를 만족하면서 부분 함수 종속을 제거하여, 기본키가 아닌 모든 속성이 기본키에 완전 함수 종속되어야 합니다.",
        concepts: ["정규화", "2NF"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_db_3",
        subject: "데이터베이스",
        question: "다음 중 SQL의 DDL(Data Definition Language)에 해당하지 않는 것은?",
        options: ["CREATE", "ALTER", "SELECT", "DROP"],
        correctIndex: 2,
        explanation:
          "SELECT는 DML(Data Manipulation Language)에 해당합니다. DDL에는 CREATE, ALTER, DROP, TRUNCATE 등이 있습니다.",
        concepts: ["SQL", "DDL"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_db_4",
        subject: "데이터베이스",
        question: "트랜잭션의 ACID 특성 중 '일관성(Consistency)'에 대한 설명으로 옳은 것은?",
        options: [
          "트랜잭션이 성공적으로 완료되면 결과가 영구히 반영된다",
          "트랜잭션 수행 전후 데이터베이스가 일관된 상태를 유지한다",
          "트랜잭션은 다른 트랜잭션의 영향을 받지 않아야 한다",
          "트랜잭션의 작업이 모두 수행되거나 모두 수행되지 않아야 한다",
        ],
        correctIndex: 1,
        explanation:
          "일관성은 트랜잭션 수행 전과 후에 데이터베이스가 일관된(유효한) 상태를 유지해야 함을 의미합니다.",
        concepts: ["트랜잭션", "ACID"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_db_5",
        subject: "데이터베이스",
        question: "관계대수 연산 중 두 릴레이션에서 공통 속성을 기준으로 결합하는 연산은?",
        options: ["Selection", "Projection", "Join", "Division"],
        correctIndex: 2,
        explanation:
          "Join은 두 릴레이션에서 공통 속성을 기준으로 조건을 만족하는 튜플들을 결합하는 연산입니다.",
        concepts: ["관계대수", "Join"],
        difficulty: "medium",
        source: "static",
      },
    ],
    프로그래밍: [
      {
        id: "fb_prog_1",
        subject: "프로그래밍",
        question: "다음 중 스택(Stack) 자료구조의 특징이 아닌 것은?",
        options: [
          "LIFO(Last In First Out) 구조",
          "Push와 Pop 연산을 사용",
          "FIFO(First In First Out) 구조",
          "재귀 함수 구현에 활용",
        ],
        correctIndex: 2,
        explanation:
          "스택은 LIFO(Last In First Out) 구조입니다. FIFO는 큐(Queue)의 특징입니다.",
        concepts: ["자료구조", "스택"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_prog_2",
        subject: "프로그래밍",
        question: "이진 탐색 트리(Binary Search Tree)에서 탐색의 평균 시간 복잡도는?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 1,
        explanation:
          "이진 탐색 트리의 평균 탐색 시간 복잡도는 O(log n)이며, 최악의 경우(편향 트리)에는 O(n)이 됩니다.",
        concepts: ["자료구조", "이진탐색트리", "시간복잡도"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_prog_3",
        subject: "프로그래밍",
        question: "다음 중 객체지향 프로그래밍의 4대 특성에 해당하지 않는 것은?",
        options: ["캡슐화", "상속", "다형성", "정규화"],
        correctIndex: 3,
        explanation:
          "객체지향 프로그래밍의 4대 특성은 캡슐화, 상속, 다형성, 추상화입니다. 정규화는 데이터베이스 설계 기법입니다.",
        concepts: ["OOP", "객체지향"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_prog_4",
        subject: "프로그래밍",
        question: "퀵 정렬(Quick Sort)의 평균 시간 복잡도는?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctIndex: 1,
        explanation:
          "퀵 정렬의 평균 시간 복잡도는 O(n log n)이며, 최악의 경우(이미 정렬된 배열)에는 O(n²)입니다.",
        concepts: ["정렬", "시간복잡도"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_prog_5",
        subject: "프로그래밍",
        question: "다음 중 동적 프로그래밍(Dynamic Programming)의 핵심 원리는?",
        options: [
          "분할 정복과 메모이제이션",
          "탐욕적 선택과 최적 부분 구조",
          "너비 우선 탐색과 깊이 우선 탐색",
          "브루트포스와 백트래킹",
        ],
        correctIndex: 0,
        explanation:
          "동적 프로그래밍은 문제를 부분 문제로 분할하고, 중복되는 부분 문제의 결과를 메모이제이션하여 효율적으로 해결하는 기법입니다.",
        concepts: ["알고리즘", "동적프로그래밍"],
        difficulty: "hard",
        source: "static",
      },
    ],
    소프트웨어설계: [
      {
        id: "fb_design_1",
        subject: "소프트웨어설계",
        question: "다음 중 싱글톤(Singleton) 패턴에 대한 설명으로 옳은 것은?",
        options: [
          "객체 생성을 서브클래스에 위임한다",
          "하나의 인스턴스만 생성하여 전역적으로 접근할 수 있게 한다",
          "객체의 내부 상태에 따라 행위를 변경한다",
          "복잡한 객체를 단계별로 조립한다",
        ],
        correctIndex: 1,
        explanation:
          "싱글톤 패턴은 클래스의 인스턴스를 하나만 생성하고, 이에 대한 전역 접근점을 제공하는 생성 패턴입니다.",
        concepts: ["디자인패턴", "싱글톤"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_design_2",
        subject: "소프트웨어설계",
        question: "소프트웨어 개발 방법론 중 애자일(Agile)의 특성이 아닌 것은?",
        options: [
          "반복적이고 점진적인 개발",
          "변화에 대한 신속한 대응",
          "상세한 문서 중심 개발",
          "고객과의 지속적인 협력",
        ],
        correctIndex: 2,
        explanation:
          "애자일은 상세한 문서보다 동작하는 소프트웨어를 중시하며, 반복적 개발, 변화 대응, 고객 협력을 핵심 가치로 합니다.",
        concepts: ["소프트웨어공학", "애자일"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_design_3",
        subject: "소프트웨어설계",
        question: "UML의 행위 다이어그램에 해당하지 않는 것은?",
        options: [
          "유스케이스 다이어그램",
          "시퀀스 다이어그램",
          "클래스 다이어그램",
          "활동 다이어그램",
        ],
        correctIndex: 2,
        explanation:
          "클래스 다이어그램은 구조 다이어그램에 해당합니다. 행위 다이어그램에는 유스케이스, 시퀀스, 활동, 상태 다이어그램 등이 있습니다.",
        concepts: ["UML", "다이어그램"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_design_4",
        subject: "소프트웨어설계",
        question: "결합도(Coupling)가 가장 낮은 것은?",
        options: [
          "내용 결합도(Content Coupling)",
          "자료 결합도(Data Coupling)",
          "제어 결합도(Control Coupling)",
          "공통 결합도(Common Coupling)",
        ],
        correctIndex: 1,
        explanation:
          "자료 결합도는 모듈 간에 자료(데이터)만 전달하는 가장 낮은 결합도입니다. 결합도가 낮을수록 모듈의 독립성이 높습니다.",
        concepts: ["모듈설계", "결합도"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_design_5",
        subject: "소프트웨어설계",
        question: "팩토리 메서드(Factory Method) 패턴의 주요 목적은?",
        options: [
          "인스턴스를 하나만 생성",
          "객체 생성을 서브클래스에 위임",
          "기존 객체를 복제하여 새 객체 생성",
          "복잡한 객체를 단계별로 조립",
        ],
        correctIndex: 1,
        explanation:
          "팩토리 메서드 패턴은 객체 생성을 서브클래스에 위임하여, 어떤 클래스의 인스턴스를 만들지를 서브클래스가 결정하게 하는 생성 패턴입니다.",
        concepts: ["디자인패턴", "팩토리메서드"],
        difficulty: "medium",
        source: "static",
      },
    ],
    정보시스템: [
      {
        id: "fb_sys_1",
        subject: "정보시스템",
        question: "OSI 7계층에서 전송 계층(Transport Layer)의 프로토콜이 아닌 것은?",
        options: ["TCP", "UDP", "HTTP", "SCTP"],
        correctIndex: 2,
        explanation:
          "HTTP는 응용 계층(Application Layer) 프로토콜입니다. TCP, UDP, SCTP는 전송 계층 프로토콜입니다.",
        concepts: ["네트워크", "OSI"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_sys_2",
        subject: "정보시스템",
        question: "정보보안의 3대 요소가 아닌 것은?",
        options: ["기밀성", "무결성", "가용성", "확장성"],
        correctIndex: 3,
        explanation:
          "정보보안의 3대 요소(CIA)는 기밀성(Confidentiality), 무결성(Integrity), 가용성(Availability)입니다.",
        concepts: ["보안", "CIA"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_sys_3",
        subject: "정보시스템",
        question: "다음 중 대칭키 암호화 알고리즘은?",
        options: ["RSA", "AES", "DSA", "ECC"],
        correctIndex: 1,
        explanation:
          "AES(Advanced Encryption Standard)는 대칭키 암호화 알고리즘입니다. RSA, DSA, ECC는 비대칭키(공개키) 암호화 알고리즘입니다.",
        concepts: ["암호화", "대칭키"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_sys_4",
        subject: "정보시스템",
        question: "소프트웨어 테스팅에서 화이트박스 테스트 기법이 아닌 것은?",
        options: [
          "문장 커버리지",
          "결정 커버리지",
          "동치 분할",
          "조건 커버리지",
        ],
        correctIndex: 2,
        explanation:
          "동치 분할(Equivalence Partitioning)은 블랙박스 테스트 기법입니다. 화이트박스 테스트에는 문장, 결정, 조건 커버리지 등이 있습니다.",
        concepts: ["테스팅", "화이트박스"],
        difficulty: "medium",
        source: "static",
      },
      {
        id: "fb_sys_5",
        subject: "정보시스템",
        question: "다음 중 클라우드 서비스 모델이 아닌 것은?",
        options: ["IaaS", "PaaS", "SaaS", "DaaS"],
        correctIndex: 3,
        explanation:
          "클라우드 서비스의 3대 모델은 IaaS(Infrastructure), PaaS(Platform), SaaS(Software)입니다. DaaS(Desktop as a Service)는 별도의 분류입니다.",
        concepts: ["클라우드", "서비스모델"],
        difficulty: "easy",
        source: "static",
      },
    ],
    소프트웨어개발: [
      {
        id: "fb_dev_1",
        subject: "소프트웨어개발",
        question: "버전 관리 시스템에서 브랜치(Branch)의 역할은?",
        options: [
          "소스 코드를 삭제한다",
          "독립적인 개발 라인을 생성한다",
          "데이터베이스를 백업한다",
          "빌드를 자동화한다",
        ],
        correctIndex: 1,
        explanation:
          "브랜치는 독립적인 개발 라인을 생성하여 동시에 여러 기능을 개발하거나 버그를 수정할 수 있게 합니다.",
        concepts: ["형상관리", "브랜치"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_dev_2",
        subject: "소프트웨어개발",
        question: "CI/CD에서 CI(Continuous Integration)의 의미는?",
        options: [
          "지속적 배포",
          "지속적 통합",
          "지속적 검증",
          "지속적 개발",
        ],
        correctIndex: 1,
        explanation:
          "CI(Continuous Integration)는 지속적 통합으로, 개발자들의 코드 변경사항을 지속적으로 통합하고 자동 빌드·테스트하는 것을 의미합니다.",
        concepts: ["DevOps", "CI/CD"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_dev_3",
        subject: "소프트웨어개발",
        question: "다음 중 단위 테스트(Unit Test)에 대한 설명으로 옳은 것은?",
        options: [
          "시스템 전체를 대상으로 테스트한다",
          "모듈 간의 인터페이스를 테스트한다",
          "개별 모듈이나 함수를 대상으로 테스트한다",
          "사용자 관점에서 테스트한다",
        ],
        correctIndex: 2,
        explanation:
          "단위 테스트는 소프트웨어의 가장 작은 단위인 개별 모듈이나 함수를 독립적으로 검증하는 테스트입니다.",
        concepts: ["테스팅", "단위테스트"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_dev_4",
        subject: "소프트웨어개발",
        question: "인터페이스 구현 시 JSON의 특징으로 옳지 않은 것은?",
        options: [
          "경량 데이터 교환 형식이다",
          "키-값 쌍으로 데이터를 표현한다",
          "바이너리 형식으로 전송된다",
          "언어에 독립적이다",
        ],
        correctIndex: 2,
        explanation:
          "JSON(JavaScript Object Notation)은 텍스트 기반의 경량 데이터 교환 형식이며, 바이너리 형식이 아닙니다.",
        concepts: ["인터페이스", "JSON"],
        difficulty: "easy",
        source: "static",
      },
      {
        id: "fb_dev_5",
        subject: "소프트웨어개발",
        question: "리팩토링(Refactoring)의 목적은?",
        options: [
          "새로운 기능을 추가한다",
          "외부 동작은 유지하면서 내부 구조를 개선한다",
          "버그를 수정한다",
          "성능을 최적화한다",
        ],
        correctIndex: 1,
        explanation:
          "리팩토링은 외부에서 보이는 동작은 변경하지 않으면서 코드의 내부 구조를 개선하여 가독성과 유지보수성을 높이는 것입니다.",
        concepts: ["소프트웨어공학", "리팩토링"],
        difficulty: "medium",
        source: "static",
      },
    ],
  };

  const subjectQuestions = questionBank[subject] ?? [];
  if (subjectQuestions.length === 0) {
    const allQuestions = Object.values(questionBank).flat();
    return allQuestions.slice(0, count);
  }

  return subjectQuestions.slice(0, count);
}
