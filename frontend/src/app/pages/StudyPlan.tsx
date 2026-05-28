import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Calendar } from "../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
} from "lucide-react";
import { useCertifications } from "../context/CertificationContext";

const getPlanKeyByCertName = (certName: string) => {
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

const weeklyPlanByCert = {
  cert1: [
    {
      day: "월요일",
      date: "2026-05-26",
      tasks: [
        { title: "데이터베이스 정규화", duration: 30, completed: true },
        { title: "SQL 기본 문법", duration: 45, completed: true },
      ],
    },
    {
      day: "화요일",
      date: "2026-05-27",
      tasks: [
        { title: "소프트웨어 설계 개념", duration: 40, completed: false },
        { title: "UML 다이어그램", duration: 35, completed: false },
      ],
    },
    {
      day: "수요일",
      date: "2026-05-28",
      tasks: [
        { title: "자료구조 복습", duration: 50, completed: false },
        { title: "알고리즘 문제 풀이", duration: 40, completed: false },
      ],
    },
    {
      day: "목요일",
      date: "2026-05-29",
      tasks: [
        { title: "네트워크 기초", duration: 45, completed: false },
        { title: "운영체제 개념", duration: 30, completed: false },
      ],
    },
    {
      day: "금요일",
      date: "2026-05-30",
      tasks: [
        { title: "종합 복습", duration: 60, completed: false },
        { title: "모의고사", duration: 90, completed: false },
      ],
    },
  ],
  cert2: [
    {
      day: "월요일",
      date: "2026-05-26",
      tasks: [
        { title: "Part 1-2 듣기 연습", duration: 30, completed: true },
        { title: "Part 5 문법 문제", duration: 20, completed: true },
      ],
    },
    {
      day: "화요일",
      date: "2026-05-27",
      tasks: [
        { title: "Part 3-4 듣기 연습", duration: 40, completed: false },
        { title: "Part 6 독해 연습", duration: 30, completed: false },
      ],
    },
  ],
  cert3: [
    {
      day: "월요일",
      date: "2026-05-26",
      tasks: [
        { title: "OSI 7계층 복습", duration: 40, completed: true },
        { title: "TCP/IP 프로토콜", duration: 35, completed: true },
      ],
    },
  ],
};

const goalsByCert = {
  cert1: [
    {
      id: 1,
      title: "데이터베이스 60점 달성",
      current: 35,
      target: 60,
      deadline: "2주 후",
      priority: "high",
    },
    {
      id: 2,
      title: "프로그래밍 40점 달성",
      current: 25,
      target: 40,
      deadline: "3주 후",
      priority: "high",
    },
    {
      id: 3,
      title: "전 과목 평균 55점",
      current: 40,
      target: 55,
      deadline: "1개월 후",
      priority: "medium",
    },
  ],
  cert2: [
    {
      id: 1,
      title: "LC 400점 달성",
      current: 320,
      target: 400,
      deadline: "2주 후",
      priority: "high",
    },
    {
      id: 2,
      title: "RC 400점 달성",
      current: 280,
      target: 400,
      deadline: "3주 후",
      priority: "high",
    },
  ],
  cert3: [
    {
      id: 1,
      title: "네트워크 보안 55점",
      current: 42,
      target: 55,
      deadline: "2주 후",
      priority: "high",
    },
  ],
};

export function StudyPlan() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { certifications, selectedCertId, selectCertification } = useCertifications();

  const currentCert = certifications.find((c) => c.id === selectedCertId);
  if (!currentCert) return null;
  const selectedCertKey = getPlanKeyByCertName(currentCert.name);
  const weeklyPlan = weeklyPlanByCert[selectedCertKey as keyof typeof weeklyPlanByCert];
  const goals = goalsByCert[selectedCertKey as keyof typeof goalsByCert];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with Cert Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">학습 플랜</h1>
          <p className="text-muted-foreground">
            체계적인 계획으로 목표를 달성하세요
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

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Left */}
        <Card>
          <CardHeader>
            <CardTitle>학습 캘린더</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span>학습 완료</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>학습 예정</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>미완료</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Plan - Right */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              이번 주 학습 계획 - {currentCert.name}
            </CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              계획 추가
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyPlan.map((day, index) => {
              const totalTasks = day.tasks.length;
              const completedTasks = day.tasks.filter((t) => t.completed).length;
              const isToday = index === 0;

              return (
                <div
                  key={day.day}
                  className={`p-4 rounded-lg border ${
                    isToday
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {day.day}
                        {isToday && <Badge variant="default">오늘</Badge>}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {day.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {completedTasks}/{totalTasks} 완료
                      </div>
                      <Progress
                        value={(completedTasks / totalTasks) * 100}
                        className="w-24 h-2 mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {day.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="flex items-center gap-3 p-2 rounded bg-background/50"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span
                          className={`flex-1 text-sm ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.duration}분
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            학습 목표 - {currentCert.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const remaining = goal.target - goal.current;

            return (
              <div
                key={goal.id}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{goal.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {goal.deadline}
                      </span>
                      <Badge
                        variant={
                          goal.priority === "high" ? "destructive" : "default"
                        }
                      >
                        {goal.priority === "high" ? "높음" : "보통"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {goal.current}
                      <span className="text-sm text-muted-foreground">
                        /{goal.target}점
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      +{remaining}점 필요
                    </div>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{progress.toFixed(0)}% 달성</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    주간 +5점 증가
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Study Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">이번 주 학습</CardTitle>
            <BookOpen className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12시간</div>
            <p className="text-xs text-muted-foreground mt-1">
              목표 대비 +2시간
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">완료한 계획</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18/25</div>
            <Progress value={72} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">평균 달성률</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground mt-1">
              전주 대비 +8%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
