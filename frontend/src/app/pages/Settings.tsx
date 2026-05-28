import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Target,
  Shield,
  Download,
  Trash2,
  Plus,
  X,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { useCertifications } from "../context/CertificationContext";
import { useAppStore } from "../store/useAppStore";

export function Settings() {
  const { certifications, updateCertifications } = useCertifications();
  const dailyStudyMinutes = useAppStore((state) => state.dailyStudyMinutes);
  const setDailyStudyMinutes = useAppStore((state) => state.setDailyStudyMinutes);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(String(dailyStudyMinutes));

  const handleSave = () => {
    setDailyStudyMinutes(Number(dailyGoal) || 120);
    toast.success("설정이 저장되었습니다");
  };

  const handleExportData = () => {
    toast.success("학습 데이터를 다운로드했습니다");
  };

  const handleAddCert = () => {
    if (certifications.length >= 3) {
      toast.error("최대 3개의 자격증만 관리할 수 있습니다");
      return;
    }
    updateCertifications([
      ...certifications,
      {
        id: `custom_${Date.now()}`,
        name: "새 자격증",
        examDate: "2026-12-31",
        examDescription: "사용자 추가",
      },
    ]);
    toast.success("자격증이 추가되었습니다");
  };

  const handleRemoveCert = (id: string) => {
    updateCertifications(certifications.filter((cert) => cert.id !== id));
    toast.success("자격증이 제거되었습니다");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">설정</h1>
        <p className="text-muted-foreground">
          학습 환경을 나에게 맞게 조정하세요
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            프로필 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="홍길동" defaultValue="학습자" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                defaultValue="user@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certification Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              자격증 관리 (최대 3개)
            </CardTitle>
            <Button
              size="sm"
              onClick={handleAddCert}
              disabled={certifications.length >= 3}
            >
              <Plus className="w-4 h-4 mr-2" />
              자격증 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>관리 중인 자격증이 없습니다</p>
              <p className="text-sm mt-1">자격증을 추가하여 학습을 시작하세요</p>
            </div>
          ) : (
            certifications.map((cert, index) => (
              <div
                key={cert.id}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <Badge variant="default">활성</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCert(cert.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>자격증명</Label>
                    <Select defaultValue={cert.name}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="정보처리기사">정보처리기사</SelectItem>
                        <SelectItem value="정보처리산업기사">
                          정보처리산업기사
                        </SelectItem>
                        <SelectItem value="네트워크관리사">네트워크관리사</SelectItem>
                        <SelectItem value="리눅스마스터">리눅스마스터</SelectItem>
                        <SelectItem value="TOEIC">TOEIC</SelectItem>
                        <SelectItem value="TOEFL">TOEFL</SelectItem>
                        <SelectItem value="IELTS">IELTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>시험일</Label>
                    <Input
                      type="date"
                      defaultValue={cert.examDate}
                      onBlur={(e) =>
                        updateCertifications(
                          certifications.map((item) =>
                            item.id === cert.id
                              ? { ...item, examDate: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Study Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            학습 목표 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="daily-goal">일일 학습 목표 (분)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="daily-goal"
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="flex-1"
              />
              <Badge variant="outline">{dailyGoal}분</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              하루에 학습할 목표 시간을 설정하세요
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="target-score">기본 목표 점수</Label>
            <Select defaultValue="60">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60점 (합격선)</SelectItem>
                <SelectItem value="70">70점</SelectItem>
                <SelectItem value="80">80점</SelectItem>
                <SelectItem value="90">90점</SelectItem>
                <SelectItem value="100">100점 (만점)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>학습 리마인더</Label>
              <p className="text-sm text-muted-foreground">
                매일 설정한 시간에 학습 알림을 받습니다
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>이메일 업데이트</Label>
              <p className="text-sm text-muted-foreground">
                학습 진행 상황과 팁을 이메일로 받습니다
              </p>
            </div>
            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
          </div>

          {notifications && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="reminder-time">리마인더 시간</Label>
                <Input id="reminder-time" type="time" defaultValue="09:00" />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            화면 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>다크 모드</Label>
              <p className="text-sm text-muted-foreground">
                눈의 피로를 줄이는 어두운 테마를 사용합니다
              </p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>글꼴 크기</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">작게</SelectItem>
                <SelectItem value="medium">보통</SelectItem>
                <SelectItem value="large">크게</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            개인정보 및 데이터
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            학습 데이터 다운로드
          </Button>
          <p className="text-sm text-muted-foreground">
            모든 학습 기록과 통계를 JSON 파일로 다운로드합니다
          </p>

          <Separator />

          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="w-4 h-4 mr-2" />
            모든 데이터 삭제
          </Button>
          <p className="text-sm text-muted-foreground">
            모든 학습 기록이 영구적으로 삭제됩니다 (복구 불가능)
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">취소</Button>
        <Button onClick={handleSave}>
          <SettingsIcon className="w-4 h-4 mr-2" />
          변경사항 저장
        </Button>
      </div>

      {/* App Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">자꿈이 v1.0.0</div>
            <div className="text-xs text-muted-foreground">
              © 2026 자꿈이. 자기의 꿈을 이루자!
            </div>
            <div className="flex justify-center gap-4 text-xs text-primary">
              <button className="hover:underline">이용약관</button>
              <button className="hover:underline">개인정보처리방침</button>
              <button className="hover:underline">고객지원</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
