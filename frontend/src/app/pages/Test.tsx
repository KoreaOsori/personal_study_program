import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ClipboardList,
  Trophy,
  Clock,
  Target,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useCertifications } from "../context/CertificationContext";

const getTestKeyByCertName = (certName: string) => {
  if (certName.includes("정보처리기사") || certName.includes("정보처리산업기사")) {
    return "cert1";
  }
  if (certName.includes("TOEIC")) {
    return "cert2";
  }
  if (certName.includes("네트워크관리사")) {
    return "cert3";
  }
  return "cert1";
};

const mockTestsByCert = {
  cert1: [
    {
      id: 1,
      title: "정보처리기사 전체 모의고사 #1",
      questions: 100,
      duration: 120,
      difficulty: "실전",
      taken: false,
    },
    {
      id: 2,
      title: "데이터베이스 집중 테스트",
      questions: 30,
      duration: 40,
      difficulty: "중급",
      taken: true,
      score: 75,
    },
    {
      id: 3,
      title: "프로그래밍 기초 테스트",
      questions: 25,
      duration: 30,
      difficulty: "초급",
      taken: true,
      score: 60,
    },
  ],
  cert2: [
    {
      id: 1,
      title: "TOEIC 실전 모의고사 #1",
      questions: 200,
      duration: 120,
      difficulty: "실전",
      taken: true,
      score: 680,
    },
    {
      id: 2,
      title: "LC Part 3-4 집중 훈련",
      questions: 39,
      duration: 30,
      difficulty: "중급",
      taken: false,
    },
  ],
  cert3: [
    {
      id: 1,
      title: "네트워크관리사 모의고사 #1",
      questions: 60,
      duration: 90,
      difficulty: "실전",
      taken: false,
    },
  ],
};

const sampleQuestions = [
  {
    id: 1,
    subject: "데이터베이스",
    question:
      "다음 중 제1정규형(1NF)에 대한 설명으로 옳은 것은?",
    options: [
      "모든 속성이 원자값을 가져야 한다",
      "부분 함수 종속을 제거해야 한다",
      "이행 함수 종속을 제거해야 한다",
      "다치 종속을 제거해야 한다",
    ],
    correctAnswer: 0,
    explanation:
      "제1정규형은 모든 속성이 원자값(Atomic Value)을 가져야 하며, 반복되는 그룹이 없어야 합니다.",
  },
  {
    id: 2,
    subject: "프로그래밍",
    question: "다음 중 스택(Stack) 자료구조의 특징이 아닌 것은?",
    options: [
      "LIFO(Last In First Out) 구조",
      "Push와 Pop 연산을 사용",
      "FIFO(First In First Out) 구조",
      "재귀 함수 구현에 활용",
    ],
    correctAnswer: 2,
    explanation:
      "스택은 LIFO(Last In First Out) 구조입니다. FIFO는 큐(Queue)의 특징입니다.",
  },
];

export function Test() {
  const { certifications, selectedCertId, selectCertification } = useCertifications();
  const [testMode, setTestMode] = useState<"list" | "taking">("list");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(sampleQuestions.length).fill(null)
  );

  const currentCert = certifications.find((c) => c.id === selectedCertId);
  if (!currentCert) return null;
  const selectedCertKey = getTestKeyByCertName(currentCert.name);
  const mockTests = mockTestsByCert[selectedCertKey as keyof typeof mockTestsByCert];

  const handleStartTest = () => {
    setTestMode("taking");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setAnswers(new Array(sampleQuestions.length).fill(null));
  };

  const handleAnswer = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setShowAnswer(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowAnswer(false);
    } else {
      setTestMode("list");
    }
  };

  const question = sampleQuestions[currentQuestion];
  const isCorrect =
    showAnswer && selectedAnswer === question.correctAnswer;

  if (testMode === "taking") {
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Progress Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                문제 {currentQuestion + 1} / {sampleQuestions.length}
              </span>
              <Badge>{question.subject}</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              disabled={showAnswer}
            >
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === question.correctAnswer;

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      showAnswer
                        ? isCorrectOption
                          ? "border-secondary bg-secondary/10"
                          : isSelected
                            ? "border-destructive bg-destructive/10"
                            : "border-border"
                        : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                    {showAnswer && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    )}
                    {showAnswer && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>

            {showAnswer && (
              <Card
                className={`${
                  isCorrect
                    ? "bg-secondary/10 border-secondary"
                    : "bg-destructive/10 border-destructive"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">
                        {isCorrect ? "정답입니다!" : "오답입니다"}
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 pt-4">
              {!showAnswer ? (
                <Button
                  onClick={handleAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1"
                  size="lg"
                >
                  정답 확인
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex-1" size="lg">
                  {currentQuestion < sampleQuestions.length - 1
                    ? "다음 문제"
                    : "완료"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setTestMode("list")}
                size="lg"
              >
                종료
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with Cert Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">시험 보기</h1>
          <p className="text-muted-foreground">
            실전 모의고사로 실력을 점검하세요
          </p>
        </div>
        <div className="w-72">
          <Select
            value={selectedCertId || undefined}
            onValueChange={selectCertification}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {certifications.map((cert) => (
                <SelectItem key={cert.id} value={cert.id}>
                  {cert.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">완료한 시험</CardTitle>
            <Trophy className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              이번 달 +3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <Target className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68점</div>
            <p className="text-xs text-muted-foreground mt-1">
              목표: 80점
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">정답률</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <Progress value={73} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 풀이 시간</CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24시간</div>
            <p className="text-xs text-muted-foreground mt-1">
              평균 2시간/주
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {currentCert.name} 모의고사 목록
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockTests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{test.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" />
                    {test.questions}문제
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {test.duration}분
                  </span>
                  <Badge variant="outline">{test.difficulty}</Badge>
                  {test.taken && (
                    <Badge variant="secondary">완료 - {test.score}점</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {test.taken ? (
                  <>
                    <Button variant="outline" size="sm">
                      결과 보기
                    </Button>
                    <Button size="sm" onClick={handleStartTest}>
                      재응시
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={handleStartTest}>
                    시작하기
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Wrong Answer Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-destructive" />
            오답노트 (12문제)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            틀린 문제를 다시 풀어보세요. 반복 학습이 실력 향상의 핵심입니다.
          </p>
          <Button variant="outline" className="w-full" onClick={handleStartTest}>
            오답 문제 풀기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
