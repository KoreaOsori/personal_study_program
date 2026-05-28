import { useRef, useState } from "react";
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
  Loader2,
  BookMarked,
} from "lucide-react";
import { useCertifications } from "../context/CertificationContext";
import { useAppStore, type QuizQuestion } from "../store/useAppStore";
import { generateQuiz, submitAnswer } from "../lib/api";
import { useNavigate } from "react-router";

const subjectsByCert: Record<string, string[]> = {
  정보처리기사: ["소프트웨어설계", "소프트웨어개발", "데이터베이스", "프로그래밍", "정보시스템"],
  정보처리산업기사: ["소프트웨어설계", "소프트웨어개발", "데이터베이스", "프로그래밍", "정보시스템"],
  TOEIC: ["Listening", "Reading"],
  네트워크관리사: ["네트워크 일반", "서버 구축", "네트워크 보안"],
};

function getSubjects(certName: string): string[] {
  for (const [key, subjects] of Object.entries(subjectsByCert)) {
    if (certName.includes(key)) return subjects;
  }
  return ["과목 1", "과목 2"];
}

export function Test() {
  const navigate = useNavigate();
  const { certifications, selectedCertId, selectCertification } = useCertifications();
  const {
    activeQuizQuestions,
    setActiveQuizQuestions,
    isQuizLoading,
    setQuizLoading,
    submitAnswer: storeSubmit,
    wrongAnswers,
    clearQuiz,
  } = useAppStore();

  const [testMode, setTestMode] = useState<"list" | "taking" | "result">("list");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [questionCount, setQuestionCount] = useState("10");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const questionStartTime = useRef(Date.now());

  const currentCert = certifications.find((c) => c.id === selectedCertId);
  if (!currentCert) return null;

  const subjects = getSubjects(currentCert.name);
  const certWrongAnswers = wrongAnswers.filter((wa) => wa.certId === selectedCertId);

  const handleGenerateQuiz = async () => {
    const subject = selectedSubject || subjects[0];
    setQuizLoading(true);
    try {
      const questions = await generateQuiz({
        exam: currentCert.name,
        subject,
        difficulty,
        count: parseInt(questionCount),
      });
      if (questions.length > 0) {
        setActiveQuizQuestions(questions);
        setAnswers(new Array(questions.length).fill(null));
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowAnswer(false);
        questionStartTime.current = Date.now();
        setTestMode("taking");
      }
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    const q = activeQuizQuestions[currentQuestion];
    const isCorrect = selectedAnswer === q.correctIndex;
    const durationSec = Math.round((Date.now() - questionStartTime.current) / 1000);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setShowAnswer(true);

    const result = {
      questionId: q.id,
      selectedAnswer,
      isCorrect,
      durationSec,
      answeredAt: new Date().toISOString(),
    };

    storeSubmit(result, q);
    submitAnswer({
      questionId: q.id,
      selectedAnswer,
      isCorrect,
      durationSec,
    });
  };

  const handleNext = () => {
    if (currentQuestion < activeQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowAnswer(false);
      questionStartTime.current = Date.now();
    } else {
      setTestMode("result");
    }
  };

  const handleFinish = () => {
    clearQuiz();
    setTestMode("list");
  };

  if (testMode === "result") {
    const totalQuestions = activeQuizQuestions.length;
    const correctCount = answers.filter(
      (a, i) => a === activeQuizQuestions[i]?.correctIndex
    ).length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">시험 결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">{accuracy}점</div>
              <p className="text-muted-foreground">
                {totalQuestions}문제 중 {correctCount}문제 정답
              </p>
            </div>
            <Progress value={accuracy} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-secondary/10">
                <div className="text-2xl font-bold text-secondary">{correctCount}</div>
                <p className="text-sm text-muted-foreground">정답</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10">
                <div className="text-2xl font-bold text-destructive">
                  {totalQuestions - correctCount}
                </div>
                <p className="text-sm text-muted-foreground">오답</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">{accuracy}%</div>
                <p className="text-sm text-muted-foreground">정답률</p>
              </div>
            </div>

            {totalQuestions - correctCount > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  틀린 문제 요약
                </h3>
                {activeQuizQuestions
                  .filter((q, i) => answers[i] !== q.correctIndex)
                  .map((q) => (
                    <div key={q.id} className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                      <p className="font-medium text-sm">{q.question}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        정답: {q.options[q.correctIndex]} — {q.explanation}
                      </p>
                    </div>
                  ))}
                <p className="text-sm text-muted-foreground">
                  오답은 자동으로 오답노트에 저장되었습니다.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleFinish} className="flex-1">
                목록으로 돌아가기
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/review")}
                className="flex-1"
              >
                <BookMarked className="w-4 h-4 mr-2" />
                오답노트 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (testMode === "taking" && activeQuizQuestions.length > 0) {
    const question = activeQuizQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / activeQuizQuestions.length) * 100;
    const isCorrect = showAnswer && selectedAnswer === question.correctIndex;

    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                문제 {currentQuestion + 1} / {activeQuizQuestions.length}
              </span>
              <Badge>{question.subject}</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

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
                const isCorrectOption = index === question.correctIndex;

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
                        {isCorrect ? "정답입니다!" : "오답입니다 — 오답노트에 저장됨"}
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {question.explanation}
                      </p>
                      {question.concepts.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {question.concepts.map((c) => (
                            <Badge key={c} variant="outline" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      )}
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
                  {currentQuestion < activeQuizQuestions.length - 1
                    ? "다음 문제"
                    : "결과 보기"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setTestMode("result")}
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
            <p className="text-xs text-muted-foreground mt-1">이번 달 +3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <Target className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68점</div>
            <p className="text-xs text-muted-foreground mt-1">목표: 80점</p>
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
            <CardTitle className="text-sm font-medium">오답노트</CardTitle>
            <BookMarked className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certWrongAnswers.length}문제</div>
            <p className="text-xs text-muted-foreground mt-1">복습 필요</p>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            퀴즈 생성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>과목 선택</Label>
              <Select
                value={selectedSubject || subjects[0]}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>난이도</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as "easy" | "medium" | "hard")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">초급</SelectItem>
                  <SelectItem value="medium">중급</SelectItem>
                  <SelectItem value="hard">고급</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>문제 수</Label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5문제</SelectItem>
                  <SelectItem value="10">10문제</SelectItem>
                  <SelectItem value="15">15문제</SelectItem>
                  <SelectItem value="20">20문제</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerateQuiz}
            disabled={isQuizLoading}
            className="w-full"
            size="lg"
          >
            {isQuizLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                문제 생성 중...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                퀴즈 시작하기
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Wrong Answer Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-destructive" />
            오답노트 ({certWrongAnswers.length}문제)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {certWrongAnswers.length > 0 ? (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                틀린 문제를 다시 풀어보세요. 반복 학습이 실력 향상의 핵심입니다.
              </p>
              <div className="space-y-2">
                {certWrongAnswers.slice(0, 3).map((wa) => (
                  <div key={wa.id} className="p-3 rounded-lg border border-border">
                    <p className="text-sm font-medium truncate">{wa.question.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{wa.question.subject}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {wa.wrongCount}회 오답
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/review")}
              >
                오답노트 전체 보기
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              아직 오답이 없습니다. 퀴즈를 풀어보세요!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
