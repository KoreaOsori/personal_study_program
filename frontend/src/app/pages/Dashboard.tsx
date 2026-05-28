import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useCertifications } from "../context/CertificationContext";
import { CertificationManager } from "../components/CertificationManager";
import {
  Target,
  TrendingUp,
  Calendar,
  Flame,
  Clock,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Certification data will come from Context

// Map certification names to subject data
const getSubjectDataByCertName = (certName: string) => {
  if (certName.includes("정보처리기사") || certName.includes("정보처리산업기사")) {
    return [
      { id: "설계", subject: "소프트웨어설계", score: 50, target: 60 },
      { id: "개발", subject: "소프트웨어개발", score: 45, target: 60 },
      { id: "데이터베이스", subject: "데이터베이스", score: 35, target: 60 },
      { id: "프로그래밍", subject: "프로그래밍", score: 25, target: 60 },
      { id: "시스템", subject: "정보시스템", score: 45, target: 60 },
    ];
  } else if (certName.includes("TOEIC")) {
    return [
      { id: "LC", subject: "Listening", score: 320, target: 400 },
      { id: "RC", subject: "Reading", score: 280, target: 400 },
    ];
  } else if (certName.includes("네트워크관리사")) {
    return [
      { id: "네트워크", subject: "네트워크 일반", score: 55, target: 60 },
      { id: "서버", subject: "서버 구축", score: 48, target: 60 },
      { id: "보안", subject: "네트워크 보안", score: 42, target: 60 },
    ];
  }
  // Default
  return [
    { id: "과목1", subject: "과목 1", score: 50, target: 60 },
    { id: "과목2", subject: "과목 2", score: 45, target: 60 },
  ];
};

const dailyScoreData = [
  { date: "5/20", 설계: 45, 개발: 40, 데이터베이스: 30, 프로그래밍: 20, 시스템: 40 },
  { date: "5/21", 설계: 46, 개발: 42, 데이터베이스: 31, 프로그래밍: 21, 시스템: 42 },
  { date: "5/22", 설계: 47, 개발: 43, 데이터베이스: 32, 프로그래밍: 22, 시스템: 43 },
  { date: "5/23", 설계: 48, 개발: 44, 데이터베이스: 33, 프로그래밍: 23, 시스템: 44 },
  { date: "5/24", 설계: 49, 개발: 44, 데이터베이스: 34, 프로그래밍: 24, 시스템: 44 },
  { date: "5/25", 설계: 50, 개발: 45, 데이터베이스: 34, 프로그래밍: 24, 시스템: 45 },
  { date: "5/26", 설계: 50, 개발: 45, 데이터베이스: 35, 프로그래밍: 25, 시스템: 45 },
];

const todayTasks = [
  { id: 1, title: "데이터베이스 정규화 10문제", done: true },
  { id: 2, title: "프로그래밍 기초 10문제", done: true },
  { id: 3, title: "소프트웨어설계 복습 20분", done: false },
  { id: 4, title: "오답노트 5문제", done: false },
];

const getWeakAreasByCertName = (certName: string) => {
  if (certName.includes("정보처리기사") || certName.includes("정보처리산업기사")) {
    return [
    {
      id: 1,
      subject: "데이터베이스",
      topic: "정규화",
      score: 35,
      reason: "1NF, 2NF, 3NF 구분이 명확하지 않음",
      analysis: "지난 5회 테스트에서 정규화 관련 문제 정답률 40%. 특히 이행적 함수 종속 개념이 취약합니다.",
      priority: "high",
    },
    {
      id: 2,
      subject: "프로그래밍",
      topic: "자료구조",
      score: 25,
      reason: "스택, 큐, 트리 구조의 시간복잡도 이해 부족",
      analysis: "Big-O 표기법과 실제 자료구조 선택 기준이 혼란스러워 보입니다.",
      priority: "high",
    },
    {
      id: 3,
      subject: "소프트웨어설계",
      topic: "디자인 패턴",
      score: 50,
      reason: "싱글톤, 팩토리 패턴 구분 미흡",
      analysis: "패턴의 목적은 이해하나 실제 적용 시나리오 판단이 어려움.",
      priority: "medium",
    },
  ];
  } else if (certName.includes("TOEIC")) {
    return [
    {
      id: 1,
      subject: "Listening",
      topic: "Part 3 - 대화",
      score: 60,
      reason: "빠른 대화 속도에서 세부사항 놓침",
      analysis: "질문 선독 전략 부족, 키워드 파악 능력 개선 필요",
      priority: "high",
    },
  ];
  } else if (certName.includes("네트워크관리사")) {
    return [
    {
      id: 1,
      subject: "네트워크 보안",
      topic: "암호화 프로토콜",
      score: 42,
      reason: "SSL/TLS, IPSec 차이점 이해 부족",
      analysis: "각 프로토콜의 동작 계층과 사용 시나리오 혼동",
      priority: "high",
    },
  ];
  }
  // Default
  return [];
};

export function Dashboard() {
  const { certifications, selectedCertId, selectCertification, updateCertifications } =
    useCertifications();
  const [selectedWeakSubject, setSelectedWeakSubject] = useState<string | null>(null);

  const currentCert = certifications.find((c) => c.id === selectedCertId);

  if (!currentCert) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-4">자격증이 등록되지 않았습니다</h2>
            <p className="text-muted-foreground mb-4">
              학습을 시작하려면 자격증을 등록해주세요
            </p>
            <CertificationManager
              certifications={certifications}
              onUpdate={updateCertifications}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const subjectData = getSubjectDataByCertName(currentCert.name);
  const weakAreas = getWeakAreasByCertName(currentCert.name);

  const radarData = subjectData.map((item) => ({
    subject: item.subject.substring(0, 4),
    score: item.score,
    fullMark: currentCert.name.includes("TOEIC") ? 400 : 100,
  }));

  const daysUntilExam = Math.ceil(
    (new Date(currentCert.examDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const passProb = 58;
  const studyStreak = 12;
  const completedToday = todayTasks.filter((t) => t.done).length;
  const totalToday = todayTasks.length;

  const filteredWeakAreas = selectedWeakSubject
    ? weakAreas.filter((area) => area.subject === selectedWeakSubject)
    : weakAreas;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with Certification Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">대시보드</h1>
          <p className="text-muted-foreground">
            한눈에 보는 학습 현황과 목표 달성률
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedCertId || undefined}
            onValueChange={selectCertification}
          >
            <SelectTrigger className="w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {certifications.map((cert) => (
                <SelectItem key={cert.id} value={cert.id}>
                  {cert.name} (D-
                  {Math.ceil(
                    (new Date(cert.examDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                  )
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CertificationManager
            certifications={certifications}
            onUpdate={updateCertifications}
          />
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">D-Day</CardTitle>
            <Calendar className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              D-{daysUntilExam}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentCert.name} 시험일
            </p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">합격 예상</CardTitle>
            <Target className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {passProb}%
            </div>
            <Progress value={passProb} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">연속 학습</CardTitle>
            <Flame className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {studyStreak}일
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              꾸준함이 답입니다
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">오늘의 진행</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {completedToday}/{totalToday}
            </div>
            <Progress
              value={(completedToday / totalToday) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Today's Study Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                오늘의 학습
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {task.done ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                  )}
                  <span
                    className={
                      task.done
                        ? "text-muted-foreground line-through flex-1"
                        : "text-foreground flex-1"
                    }
                  >
                    {task.title}
                  </span>
                  {!task.done && (
                    <Button size="sm">시작</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Daily Subject Scores - Full Width */}
      {(currentCert.name.includes("정보처리기사") ||
        currentCert.name.includes("정보처리산업기사")) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              일자별 과목 점수 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full min-h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height={300} minHeight={300}>
                <LineChart data={dailyScoreData} width={800} height={300}>
                      <CartesianGrid
                        key="grid"
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        key="x-axis"
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        key="y-axis"
                        domain={[0, 100]}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip
                        key="tooltip"
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                      <Line
                        key="line-1"
                        type="monotone"
                        dataKey="설계"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        key="line-2"
                        type="monotone"
                        dataKey="개발"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        key="line-3"
                        type="monotone"
                        dataKey="데이터베이스"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        key="line-4"
                        type="monotone"
                        dataKey="프로그래밍"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        key="line-5"
                        type="monotone"
                        dataKey="시스템"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

      {/* Radar Chart - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>역량 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full min-h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height={300} minHeight={300}>
              <RadarChart data={radarData} width={400} height={300}>
                <PolarGrid key="polar-grid" stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  key="polar-angle"
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Radar
                  key="score-radar"
                  name="점수"
                  dataKey="score"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weak Areas Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              약점 영역 분석
            </CardTitle>
            <Select
              value={selectedWeakSubject || "all"}
              onValueChange={(value) =>
                setSelectedWeakSubject(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 과목</SelectItem>
                {subjectData.map((subject) => (
                  <SelectItem key={subject.id} value={subject.subject}>
                    {subject.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredWeakAreas.map((area) => (
            <div
              key={area.id}
              className={`p-4 rounded-lg border-2 ${
                area.priority === "high"
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-orange-500/30 bg-orange-500/5"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{area.topic}</h3>
                    <Badge
                      variant={area.priority === "high" ? "destructive" : "default"}
                    >
                      집중
                    </Badge>
                    <Badge variant="outline">{area.subject}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    현재 점수: <span className="font-semibold">{area.score}점</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-background/50 p-3 rounded">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">
                    약점 사유
                  </div>
                  <div className="text-sm">{area.reason}</div>
                </div>

                <div className="bg-background/50 p-3 rounded">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">
                    AI 분석
                  </div>
                  <div className="text-sm">{area.analysis}</div>
                </div>

                <Button className="w-full" size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {area.topic} 보완 학습 시작
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}

          {filteredWeakAreas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-secondary" />
              <p>선택한 과목에 약점이 발견되지 않았습니다!</p>
              <p className="text-sm mt-1">계속해서 꾸준히 학습해주세요.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
