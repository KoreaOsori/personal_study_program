import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";
import {
  Settings,
  Search,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// 자격증 데이터베이스 (검색용)
const CERTIFICATION_DATABASE = [
  {
    id: "cert_info_engineer",
    name: "정보처리기사",
    category: "IT/컴퓨터",
    organization: "한국산업인력공단",
    examDates: [
      { id: "2026-q1", date: "2026-03-15", description: "2026년 1회" },
      { id: "2026-q2", date: "2026-05-18", description: "2026년 2회" },
      { id: "2026-q3", date: "2026-08-15", description: "2026년 3회" },
      { id: "2026-q4", date: "2026-11-14", description: "2026년 4회" },
    ],
  },
  {
    id: "cert_info_industrial",
    name: "정보처리산업기사",
    category: "IT/컴퓨터",
    organization: "한국산업인력공단",
    examDates: [
      { id: "2026-q1", date: "2026-03-08", description: "2026년 1회" },
      { id: "2026-q2", date: "2026-05-25", description: "2026년 2회" },
      { id: "2026-q3", date: "2026-08-22", description: "2026년 3회" },
    ],
  },
  {
    id: "cert_network",
    name: "네트워크관리사",
    category: "IT/컴퓨터",
    organization: "한국정보통신자격협회",
    examDates: [
      { id: "2026-1", date: "2026-04-12", description: "2026년 49회" },
      { id: "2026-2", date: "2026-07-18", description: "2026년 50회" },
      { id: "2026-3", date: "2026-09-10", description: "2026년 51회" },
      { id: "2026-4", date: "2026-12-05", description: "2026년 52회" },
    ],
  },
  {
    id: "cert_linux_master",
    name: "리눅스마스터",
    category: "IT/컴퓨터",
    organization: "한국정보통신진흥협회",
    examDates: [
      { id: "2026-1", date: "2026-03-29", description: "2026년 1회" },
      { id: "2026-2", date: "2026-06-28", description: "2026년 2회" },
      { id: "2026-3", date: "2026-09-27", description: "2026년 3회" },
      { id: "2026-4", date: "2026-12-20", description: "2026년 4회" },
    ],
  },
  {
    id: "cert_toeic",
    name: "TOEIC",
    category: "어학",
    organization: "ETS",
    examDates: [
      { id: "2026-06", date: "2026-06-14", description: "2026년 6월" },
      { id: "2026-07", date: "2026-07-20", description: "2026년 7월" },
      { id: "2026-08", date: "2026-08-16", description: "2026년 8월" },
      { id: "2026-09", date: "2026-09-13", description: "2026년 9월" },
      { id: "2026-10", date: "2026-10-18", description: "2026년 10월" },
    ],
  },
  {
    id: "cert_toefl",
    name: "TOEFL",
    category: "어학",
    organization: "ETS",
    examDates: [
      { id: "2026-06", date: "2026-06-07", description: "2026년 6월" },
      { id: "2026-07", date: "2026-07-12", description: "2026년 7월" },
      { id: "2026-08", date: "2026-08-09", description: "2026년 8월" },
      { id: "2026-09", date: "2026-09-06", description: "2026년 9월" },
    ],
  },
  {
    id: "cert_ielts",
    name: "IELTS",
    category: "어학",
    organization: "British Council",
    examDates: [
      { id: "2026-06", date: "2026-06-21", description: "2026년 6월" },
      { id: "2026-07", date: "2026-07-19", description: "2026년 7월" },
      { id: "2026-08", date: "2026-08-16", description: "2026년 8월" },
      { id: "2026-09", date: "2026-09-20", description: "2026년 9월" },
    ],
  },
  {
    id: "cert_sqld",
    name: "SQLD",
    category: "IT/컴퓨터",
    organization: "한국데이터산업진흥원",
    examDates: [
      { id: "2026-1", date: "2026-04-26", description: "제57회" },
      { id: "2026-2", date: "2026-07-12", description: "제58회" },
      { id: "2026-3", date: "2026-10-17", description: "제59회" },
    ],
  },
  {
    id: "cert_adsp",
    name: "ADsP",
    category: "IT/컴퓨터",
    organization: "한국데이터산업진흥원",
    examDates: [
      { id: "2026-1", date: "2026-03-21", description: "제46회" },
      { id: "2026-2", date: "2026-06-13", description: "제47회" },
      { id: "2026-3", date: "2026-09-19", description: "제48회" },
    ],
  },
];

interface Certification {
  id: string;
  name: string;
  examDate: string;
  examDescription?: string;
}

interface CertificationManagerProps {
  certifications: Certification[];
  onUpdate: (certifications: Certification[]) => void;
}

export function CertificationManager({
  certifications,
  onUpdate,
}: CertificationManagerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState<
    (typeof CERTIFICATION_DATABASE)[0] | null
  >(null);
  const [selectedExamDate, setSelectedExamDate] = useState<string | null>(null);

  const filteredCerts = CERTIFICATION_DATABASE.filter((cert) =>
    cert.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCertification = () => {
    if (certifications.length >= 3) {
      toast.error("최대 3개의 자격증만 관리할 수 있습니다");
      return;
    }

    if (!selectedCert || !selectedExamDate) {
      toast.error("자격증과 시험 일정을 선택해주세요");
      return;
    }

    const examInfo = selectedCert.examDates.find((d) => d.id === selectedExamDate);
    if (!examInfo) return;

    // Check if already added
    const alreadyAdded = certifications.some(
      (c) => c.id.startsWith(selectedCert.id) && c.examDate === examInfo.date
    );

    if (alreadyAdded) {
      toast.error("이미 추가된 자격증입니다");
      return;
    }

    const newCert: Certification = {
      id: `${selectedCert.id}_${Date.now()}`,
      name: selectedCert.name,
      examDate: examInfo.date,
      examDescription: examInfo.description,
    };

    onUpdate([...certifications, newCert]);
    toast.success(`${selectedCert.name}이(가) 추가되었습니다`);

    // Reset
    setSelectedCert(null);
    setSelectedExamDate(null);
    setSearchQuery("");
  };

  const handleRemoveCertification = (id: string) => {
    const cert = certifications.find((c) => c.id === id);
    onUpdate(certifications.filter((c) => c.id !== id));
    toast.success(`${cert?.name}이(가) 제거되었습니다`);
  };

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <Settings className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>자격증 관리</DialogTitle>
            <DialogDescription>
              최대 3개의 자격증을 선택하여 학습을 관리하세요
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Current Certifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">등록된 자격증 ({certifications.length}/3)</h3>
              </div>

              {certifications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>등록된 자격증이 없습니다</p>
                    <p className="text-sm mt-1">
                      오른쪽에서 자격증을 검색하고 추가하세요
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <Card key={cert.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">#{index + 1}</Badge>
                              <h4 className="font-semibold">{cert.name}</h4>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                <span>{cert.examDate}</span>
                              </div>
                              {cert.examDescription && (
                                <div className="text-xs">{cert.examDescription}</div>
                              )}
                              <div className="text-xs font-semibold text-primary">
                                D-
                                {Math.ceil(
                                  (new Date(cert.examDate).getTime() -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCertification(cert.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Search and Add */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">자격증 검색 및 추가</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="자격증명을 입력하세요 (예: 정보처리기사, TOEIC)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              {/* Search Results */}
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {filteredCerts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>검색 결과가 없습니다</p>
                    </div>
                  ) : (
                    filteredCerts.map((cert) => (
                      <Card
                        key={cert.id}
                        className={`cursor-pointer transition-colors ${
                          selectedCert?.id === cert.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => {
                          setSelectedCert(cert);
                          setSelectedExamDate(null);
                        }}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{cert.name}</h4>
                              <div className="text-xs text-muted-foreground">
                                <div>{cert.organization}</div>
                                <Badge variant="outline" className="mt-1">
                                  {cert.category}
                                </Badge>
                              </div>
                            </div>
                            {selectedCert?.id === cert.id && (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Exam Date Selection */}
              {selectedCert && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">시험 일정 선택</h4>
                    <div className="space-y-2">
                      {selectedCert.examDates.map((examDate) => (
                        <Card
                          key={examDate.id}
                          className={`cursor-pointer transition-colors ${
                            selectedExamDate === examDate.id
                              ? "border-secondary bg-secondary/5"
                              : "hover:border-secondary/50"
                          }`}
                          onClick={() => setSelectedExamDate(examDate.id)}
                        >
                          <CardContent className="pt-3 pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-sm">
                                  {examDate.description}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  {examDate.date}
                                  <span className="ml-2 text-primary font-semibold">
                                    D-
                                    {Math.ceil(
                                      (new Date(examDate.date).getTime() -
                                        new Date().getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )}
                                  </span>
                                </div>
                              </div>
                              {selectedExamDate === examDate.id && (
                                <CheckCircle2 className="w-5 h-5 text-secondary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleAddCertification}
                    disabled={!selectedExamDate || certifications.length >= 3}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    자격증 추가
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
