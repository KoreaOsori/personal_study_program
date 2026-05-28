import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  BookOpen,
  Video,
  FileText,
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  Award,
  FileCode,
  BookMarked,
} from "lucide-react";
import { useCertifications } from "../context/CertificationContext";

const getStudyKeyByCertName = (certName: string) => {
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

const studyMaterialsByCert = {
  cert1: {
    소프트웨어설계: [
      {
        id: 1,
        title: "요구사항 분석 기초",
        type: "video",
        duration: "45분",
        completed: true,
        locked: false,
        script: {
          education: "안녕하세요. 이번 강의에서는 요구사항 분석의 기초에 대해 알아보겠습니다.\n\n1. 요구사항의 정의\n- 시스템이 제공해야 하는 기능과 제약사항\n- 이해관계자들의 필요와 기대사항\n\n2. 요구사항 분석의 중요성\n- 프로젝트 성공의 핵심 요소\n- 비용과 시간 절감\n\n3. 요구사항 도출 기법\n- 인터뷰\n- 설문조사\n- 관찰\n- 프로토타이핑",
          theory: "# 요구사항 분석\n\n## 정의\n요구사항 분석은 소프트웨어 개발 생명주기의 첫 단계로, 시스템이 무엇을 해야 하는지 명확히 정의하는 과정입니다.\n\n## 분류\n1. **기능 요구사항**: 시스템이 수행해야 할 기능\n2. **비기능 요구사항**: 성능, 보안, 사용성 등의 품질 속성\n\n## 주요 활동\n- 요구사항 도출\n- 요구사항 분석\n- 요구사항 명세\n- 요구사항 검증",
        },
      },
      {
        id: 2,
        title: "UML 다이어그램",
        type: "article",
        duration: "30분",
        completed: true,
        locked: false,
        script: {
          education: "",
          theory: "# UML 다이어그램\n\n## 구조 다이어그램\n1. 클래스 다이어그램\n2. 객체 다이어그램\n3. 컴포넌트 다이어그램\n4. 배치 다이어그램\n\n## 행위 다이어그램\n1. 유스케이스 다이어그램\n2. 시퀀스 다이어그램\n3. 활동 다이어그램\n4. 상태 다이어그램\n\n## 클래스 다이어그램 표기법\n- 클래스: 사각형 3분할\n- 관계: 연관, 일반화, 의존, 실체화",
        },
      },
      {
        id: 3,
        title: "디자인 패턴 이해하기",
        type: "video",
        duration: "60분",
        completed: false,
        locked: false,
        highlight: true,
        script: {
          education: "디자인 패턴 강의에 오신 것을 환영합니다.\n\n이번 강의 목차:\n\n1. 디자인 패턴이란?\n- 반복적으로 발생하는 문제에 대한 검증된 해결책\n- GoF(Gang of Four) 23가지 패턴\n\n2. 생성 패턴\n- 싱글톤: 인스턴스를 하나만 생성\n- 팩토리: 객체 생성을 캡슐화\n- 빌더: 복잡한 객체를 단계별로 생성\n\n3. 구조 패턴\n- 어댑터: 인터페이스 호환성 제공\n- 데코레이터: 동적으로 기능 추가\n\n4. 행위 패턴\n- 옵저버: 이벤트 발생 시 알림\n- 전략: 알고리즘을 캡슐화",
          theory: "# 디자인 패턴\n\n## GoF 디자인 패턴 분류\n\n### 생성 패턴 (Creational)\n객체 생성 메커니즘을 다룸\n- Singleton\n- Factory Method\n- Abstract Factory\n- Builder\n- Prototype\n\n### 구조 패턴 (Structural)\n클래스와 객체의 구성을 다룸\n- Adapter\n- Bridge\n- Composite\n- Decorator\n- Facade\n- Flyweight\n- Proxy\n\n### 행위 패턴 (Behavioral)\n객체 간 상호작용과 책임 분배를 다룸\n- Chain of Responsibility\n- Command\n- Iterator\n- Mediator\n- Memento\n- Observer\n- State\n- Strategy\n- Template Method\n- Visitor",
        },
      },
    ],
    데이터베이스: [
      {
        id: 1,
        title: "정규화 완벽 정복",
        type: "video",
        duration: "50분",
        completed: false,
        locked: false,
        highlight: true,
        script: {
          education: "데이터베이스 정규화 강의를 시작하겠습니다.\n\n강의 개요:\n1. 정규화의 필요성\n2. 함수적 종속성\n3. 제1정규형(1NF)\n4. 제2정규형(2NF)\n5. 제3정규형(3NF)\n6. BCNF\n\n정규화는 데이터 중복을 최소화하고 데이터 무결성을 보장하기 위한 과정입니다.",
          theory: "# 정규화 (Normalization)\n\n## 목적\n- 데이터 중복 최소화\n- 삽입/수정/삭제 이상 현상 방지\n- 데이터 무결성 유지\n\n## 함수적 종속성 (Functional Dependency)\nX → Y: X가 결정되면 Y가 유일하게 결정됨\n\n## 정규형\n\n### 제1정규형 (1NF)\n- 모든 속성이 원자값\n- 반복 그룹 제거\n\n### 제2정규형 (2NF)\n- 1NF 만족\n- 부분 함수 종속 제거\n- 완전 함수 종속만 존재\n\n### 제3정규형 (3NF)\n- 2NF 만족\n- 이행 함수 종속 제거\n\n### BCNF\n- 3NF 만족\n- 모든 결정자가 후보키",
        },
      },
      {
        id: 2,
        title: "SQL 기초부터 고급까지",
        type: "article",
        duration: "90분",
        completed: false,
        locked: false,
        script: {
          education: "",
          theory: "# SQL (Structured Query Language)\n\n## DDL (Data Definition Language)\n```sql\nCREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  age INT\n);\n\nALTER TABLE students ADD COLUMN grade CHAR(1);\n\nDROP TABLE students;\n```\n\n## DML (Data Manipulation Language)\n```sql\nINSERT INTO students VALUES (1, 'John', 20, 'A');\n\nUPDATE students SET grade = 'B' WHERE id = 1;\n\nDELETE FROM students WHERE age < 18;\n\nSELECT * FROM students WHERE grade = 'A';\n```\n\n## JOIN\n```sql\nSELECT s.name, c.course_name\nFROM students s\nINNER JOIN courses c ON s.id = c.student_id;\n```",
        },
      },
    ],
  },
  cert2: {
    Listening: [
      {
        id: 1,
        title: "Part 1 - 사진 묘사",
        type: "video",
        duration: "30분",
        completed: true,
        locked: false,
        script: {
          education: "TOEIC Part 1 학습 전략\n\n1. 사진을 먼저 분석하세요\n- 사람의 위치와 동작\n- 사물의 상태와 위치\n\n2. 오답 유형 파악\n- 비슷한 발음의 단어\n- 사진에 없는 내용\n\n3. 시제 주의\n- 현재 진행형이 자주 출제\n- 완료형도 가능",
          theory: "# TOEIC Part 1 전략\n\n## 문제 유형\n- 사진 1장당 4개 보기\n- 가장 정확한 묘사 선택\n\n## 핵심 표현\n**사람**\n- is wearing / is holding\n- is standing / is sitting\n- is looking at / is pointing to\n\n**사물**\n- is placed / is located\n- are arranged / are displayed\n\n## 주의사항\n- 유사 발음 주의 (walk/work)\n- 추측성 답 배제",
        },
      },
    ],
  },
  cert3: {
    "네트워크 일반": [
      {
        id: 1,
        title: "OSI 7계층 모델",
        type: "video",
        duration: "40분",
        completed: false,
        locked: false,
        script: {
          education: "OSI 7계층 모델 강의\n\n암기법: 아파서 프티에스 다 먹었다\n\n1계층 - 물리 (Physical)\n2계층 - 데이터링크 (Data Link)\n3계층 - 네트워크 (Network)\n4계층 - 전송 (Transport)\n5계층 - 세션 (Session)\n6계층 - 표현 (Presentation)\n7계층 - 응용 (Application)",
          theory: "# OSI 7계층\n\n## 각 계층의 역할\n\n**7. 응용 계층**\n- HTTP, FTP, SMTP\n- 사용자 인터페이스\n\n**6. 표현 계층**\n- 암호화, 압축\n- 데이터 형식 변환\n\n**5. 세션 계층**\n- 세션 설정/관리/종료\n\n**4. 전송 계층**\n- TCP, UDP\n- 종단 간 신뢰성\n\n**3. 네트워크 계층**\n- IP, 라우팅\n- 논리 주소 지정\n\n**2. 데이터링크 계층**\n- MAC, 프레임\n- 물리 주소 지정\n\n**1. 물리 계층**\n- 비트 전송\n- 전기적 신호",
        },
      },
    ],
  },
};

export function Study() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const { certifications, selectedCertId, selectCertification } = useCertifications();
  const [scriptDialog, setScriptDialog] = useState<{
    open: boolean;
    material: any;
  }>({ open: false, material: null });

  const currentCert = certifications.find((c) => c.id === selectedCertId);
  if (!currentCert) return null;
  const selectedCertKey = getStudyKeyByCertName(currentCert.name);
  const materials =
    studyMaterialsByCert[selectedCertKey as keyof typeof studyMaterialsByCert];
  const subjects = Object.keys(materials);

  const currentSubject = selectedSubject || subjects[0];
  const currentMaterials = materials[currentSubject as keyof typeof materials];

  const completed = currentMaterials.filter((m) => m.completed).length;
  const total = currentMaterials.length;
  const progress = (completed / total) * 100;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with Cert Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">학습하기</h1>
          <p className="text-muted-foreground">
            체계적인 학습 자료로 실력을 키워보세요
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

      {/* Hero Section */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-3">
              {currentCert.name} 완벽 대비
            </h2>
            <p className="text-muted-foreground mb-6">
              영상 강의와 이론 자료를 함께 제공하여 다양한 학습 전략을 지원합니다.
              교육용 스크립트로 복습도 쉽게!
            </p>
            <div className="flex gap-3">
              <Button size="lg">
                <PlayCircle className="w-4 h-4 mr-2" />
                추천 학습 시작
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-auto">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1566827886072-417be1953f36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Study materials"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>

      {/* Subject Tabs */}
      <Tabs
        value={currentSubject}
        onValueChange={(value) => setSelectedSubject(value)}
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 lg:w-auto">
          {subjects.map((subject) => (
            <TabsTrigger key={subject} value={subject}>
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">학습 진행률</span>
                <span className="text-sm text-muted-foreground">
                  {completed}/{total} 완료
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Materials List */}
          <TabsContent value={currentSubject} className="space-y-4">
            {currentMaterials.map((material: any) => (
              <Card
                key={material.id}
                className={`${
                  material.locked
                    ? "opacity-60"
                    : "hover:shadow-lg transition-shadow"
                } ${material.highlight ? "border-secondary shadow-md" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        material.completed
                          ? "bg-secondary/10"
                          : material.locked
                            ? "bg-muted"
                            : "bg-primary/10"
                      }`}
                    >
                      {material.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-secondary" />
                      ) : material.locked ? (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      ) : material.type === "video" ? (
                        <Video className="w-6 h-6 text-primary" />
                      ) : (
                        <FileText className="w-6 h-6 text-primary" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {material.title}
                            {material.highlight && (
                              <Badge className="ml-2" variant="secondary">
                                약점 집중
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {material.duration}
                            </span>
                            <Badge variant="outline">
                              {material.type === "video" ? "동영상" : "문서"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            disabled={material.locked}
                            variant={material.completed ? "outline" : "default"}
                          >
                            {material.locked
                              ? "잠김"
                              : material.completed
                                ? "다시 보기"
                                : "학습 시작"}
                          </Button>
                        </div>
                      </div>

                      {/* Script Buttons */}
                      {material.script && (
                        <div className="flex gap-2 pt-2 border-t border-border">
                          {material.script.education && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setScriptDialog({ open: true, material })
                              }
                            >
                              <FileCode className="w-4 h-4 mr-2" />
                              교육용 스크립트
                            </Button>
                          )}
                          {material.script.theory && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setScriptDialog({ open: true, material })
                              }
                            >
                              <BookMarked className="w-4 h-4 mr-2" />
                              이론 학습 자료
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </div>
      </Tabs>

      {/* Achievement Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            학습 성취
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">24</div>
              <div className="text-sm text-muted-foreground">완료한 강의</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">
                8시간
              </div>
              <div className="text-sm text-muted-foreground">총 학습 시간</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">12일</div>
              <div className="text-sm text-muted-foreground">연속 학습</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">5개</div>
              <div className="text-sm text-muted-foreground">획득한 배지</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Script Dialog */}
      <Dialog
        open={scriptDialog.open}
        onOpenChange={(open) =>
          setScriptDialog({ open, material: scriptDialog.material })
        }
      >
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{scriptDialog.material?.title}</DialogTitle>
            <DialogDescription>
              학습 자료를 확인하고 복습에 활용하세요
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6 pr-4">
              {scriptDialog.material?.script?.education && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileCode className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">교육용 스크립트</h3>
                  </div>
                  <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {scriptDialog.material.script.education}
                  </div>
                </div>
              )}

              {scriptDialog.material?.script?.theory && (
                <>
                  {scriptDialog.material?.script?.education && (
                    <Separator />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookMarked className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">이론 학습 자료</h3>
                    </div>
                    <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
                      {scriptDialog.material.script.theory}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
