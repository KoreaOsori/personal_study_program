import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { useCertifications } from "../context/CertificationContext";
import { useAppStore } from "../store/useAppStore";

const defaultScores = {
  소프트웨어설계: 50,
  소프트웨어개발: 45,
  데이터베이스: 35,
  프로그래밍: 25,
  정보시스템: 45,
};

export function Onboarding() {
  const { certifications, selectedCertId, selectCertification } = useCertifications();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(1);
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState(120);
  const [examDate, setExamDate] = useState("2026-08-15");
  const [scores, setScores] = useState(defaultScores);

  const currentCert =
    certifications.find((cert) => cert.id === selectedCertId) ?? certifications[0];
  const progress = useMemo(() => (step / 3) * 100, [step]);

  const onSubmit = () => {
    completeOnboarding({
      dailyStudyMinutes,
      examDate,
      subjectScores: scores,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">자꿍이 시작 설정</CardTitle>
          <p className="text-sm text-muted-foreground">
            3단계만 완료하면 개인 맞춤 학습 플랜이 시작됩니다.
          </p>
          <Progress value={progress} className="mt-3" />
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">1) 준비 중인 시험 선택</h3>
              <div className="grid grid-cols-1 gap-3">
                {certifications.map((cert) => (
                  <button
                    key={cert.id}
                    type="button"
                    onClick={() => {
                      selectCertification(cert.id);
                      setExamDate(cert.examDate);
                    }}
                    className={`rounded-lg border p-3 text-left transition ${
                      cert.id === currentCert?.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-xs text-muted-foreground">시험일: {cert.examDate}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">2) 목표 시험일 / 하루 학습 시간</h3>
              <div className="space-y-2">
                <Label htmlFor="examDate">목표 시험일</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyMinutes">하루 학습 가능 시간(분)</Label>
                <Input
                  id="dailyMinutes"
                  type="number"
                  min={30}
                  value={dailyStudyMinutes}
                  onChange={(e) => setDailyStudyMinutes(Number(e.target.value) || 30)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">3) 현재 과목별 점수 입력</h3>
              {Object.entries(scores).map(([subject, score]) => (
                <div key={subject} className="space-y-2">
                  <Label htmlFor={subject}>{subject}</Label>
                  <Input
                    id={subject}
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) =>
                      setScores((prev) => ({
                        ...prev,
                        [subject]: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              disabled={step === 1}
            >
              이전
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep((prev) => Math.min(3, prev + 1))}>
                다음
              </Button>
            ) : (
              <Button onClick={onSubmit}>설정 완료하고 시작하기</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
