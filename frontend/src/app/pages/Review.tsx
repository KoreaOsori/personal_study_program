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
  BookMarked,
  Star,
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useCertifications } from "../context/CertificationContext";
import { useAppStore, type WrongAnswer } from "../store/useAppStore";

export function Review() {
  const { certifications, selectedCertId, selectCertification } = useCertifications();
  const {
    wrongAnswers,
    toggleStarWrongAnswer,
    removeWrongAnswer,
    submitAnswer: storeSubmit,
  } = useAppStore();

  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterStarred, setFilterStarred] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  const [retryQuestionIndex, setRetryQuestionIndex] = useState(0);
  const [retryAnswer, setRetryAnswer] = useState<number | null>(null);
  const [retryShowAnswer, setRetryShowAnswer] = useState(false);
  const [retryQuestions, setRetryQuestions] = useState<WrongAnswer[]>([]);

  const currentCert = certifications.find((c) => c.id === selectedCertId);
  if (!currentCert) return null;

  const certWrongAnswers = wrongAnswers.filter((wa) => wa.certId === selectedCertId);

  const subjects = [...new Set(certWrongAnswers.map((wa) => wa.question.subject))];

  const filteredWrongAnswers = certWrongAnswers.filter((wa) => {
    if (filterSubject !== "all" && wa.question.subject !== filterSubject) return false;
    if (filterStarred && !wa.starred) return false;
    return true;
  });

  const handleStartRetry = (items?: WrongAnswer[]) => {
    const questionsToRetry = items ?? filteredWrongAnswers;
    if (questionsToRetry.length === 0) return;
    setRetryQuestions(questionsToRetry);
    setRetryQuestionIndex(0);
    setRetryAnswer(null);
    setRetryShowAnswer(false);
    setRetryMode(true);
  };

  const handleRetryAnswer = () => {
    if (retryAnswer === null) return;
    const wa = retryQuestions[retryQuestionIndex];
    const isCorrect = retryAnswer === wa.question.correctIndex;

    storeSubmit(
      {
        questionId: wa.questionId,
        selectedAnswer: retryAnswer,
        isCorrect,
        durationSec: 0,
        answeredAt: new Date().toISOString(),
      },
      wa.question
    );

    setRetryShowAnswer(true);
  };

  const handleRetryNext = () => {
    if (retryQuestionIndex < retryQuestions.length - 1) {
      setRetryQuestionIndex(retryQuestionIndex + 1);
      setRetryAnswer(null);
      setRetryShowAnswer(false);
    } else {
      setRetryMode(false);
    }
  };

  if (retryMode && retryQuestions.length > 0) {
    const wa = retryQuestions[retryQuestionIndex];
    const question = wa.question;
    const progress = ((retryQuestionIndex + 1) / retryQuestions.length) * 100;
    const isCorrect = retryShowAnswer && retryAnswer === question.correctIndex;

    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                오답 복습 {retryQuestionIndex + 1} / {retryQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{wa.wrongCount}회 오답</Badge>
                <Badge>{question.subject}</Badge>
              </div>
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
              value={retryAnswer?.toString()}
              onValueChange={(value) => setRetryAnswer(parseInt(value))}
              disabled={retryShowAnswer}
            >
              {question.options.map((option, index) => {
                const isSelected = retryAnswer === index;
                const isCorrectOption = index === question.correctIndex;

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      retryShowAnswer
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
                    <RadioGroupItem value={index.toString()} id={`retry-option-${index}`} />
                    <Label htmlFor={`retry-option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                    {retryShowAnswer && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    )}
                    {retryShowAnswer && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>

            {retryShowAnswer && (
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
                        {isCorrect ? "정답입니다! 복습 효과가 있네요!" : "아직 틀렸습니다. 한 번 더 복습하세요."}
                      </h4>
                      <p className="text-sm leading-relaxed">{question.explanation}</p>
                      {question.concepts.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {question.concepts.map((c) => (
                            <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 pt-4">
              {!retryShowAnswer ? (
                <Button
                  onClick={handleRetryAnswer}
                  disabled={retryAnswer === null}
                  className="flex-1"
                  size="lg"
                >
                  정답 확인
                </Button>
              ) : (
                <Button onClick={handleRetryNext} className="flex-1" size="lg">
                  {retryQuestionIndex < retryQuestions.length - 1 ? "다음 문제" : "복습 완료"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setRetryMode(false)}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">오답노트</h1>
          <p className="text-muted-foreground">
            틀린 문제를 반복 학습하여 약점을 보완하세요
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 오답</CardTitle>
            <XCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certWrongAnswers.length}문제</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">중요 표시</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certWrongAnswers.filter((wa) => wa.starred).length}문제
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">복습 대기</CardTitle>
            <RotateCcw className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certWrongAnswers.filter(
                (wa) => wa.nextReviewAt <= new Date().toISOString()
              ).length}문제
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 과목</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant={filterStarred ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStarred(!filterStarred)}
            >
              <Star className="w-4 h-4 mr-1" />
              중요 표시만
            </Button>
            <div className="flex-1" />
            <Button
              onClick={() => handleStartRetry()}
              disabled={filteredWrongAnswers.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {filteredWrongAnswers.length}문제 복습하기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wrong Answer List */}
      {filteredWrongAnswers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookMarked className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {certWrongAnswers.length === 0
                ? "아직 오답이 없습니다. 퀴즈를 풀어보세요!"
                : "필터에 해당하는 오답이 없습니다."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredWrongAnswers.map((wa) => (
            <Card key={wa.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <p className="font-medium">{wa.question.question}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{wa.question.subject}</Badge>
                      <Badge
                        variant={wa.wrongCount >= 3 ? "destructive" : "secondary"}
                      >
                        {wa.wrongCount}회 오답
                      </Badge>
                      {wa.question.concepts.map((c) => (
                        <Badge key={c} variant="outline" className="text-xs">
                          {c}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      정답: {wa.question.options[wa.question.correctIndex]} —{" "}
                      {wa.question.explanation}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStarWrongAnswer(wa.id)}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          wa.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartRetry([wa])}
                    >
                      <RotateCcw className="w-4 h-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWrongAnswer(wa.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
