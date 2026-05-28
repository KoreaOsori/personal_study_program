import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Certification {
  id: string;
  name: string;
  examDate: string;
  examDescription?: string;
}

interface AppState {
  certifications: Certification[];
  selectedCertId: string | null;
  dailyStudyMinutes: number;
  onboardingCompleted: boolean;
  onboardingSubjectScores: Record<string, number>;
  updateCertifications: (certifications: Certification[]) => void;
  selectCertification: (id: string) => void;
  setDailyStudyMinutes: (minutes: number) => void;
  completeOnboarding: (payload: {
    dailyStudyMinutes: number;
    examDate: string;
    subjectScores: Record<string, number>;
  }) => void;
}

const defaultCertifications: Certification[] = [
  {
    id: "cert_info_engineer_1",
    name: "정보처리기사",
    examDate: "2026-08-15",
    examDescription: "2026년 3회",
  },
  {
    id: "cert_toeic_1",
    name: "TOEIC",
    examDate: "2026-07-20",
    examDescription: "2026년 7월",
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      certifications: defaultCertifications,
      selectedCertId: defaultCertifications[0]?.id ?? null,
      dailyStudyMinutes: 120,
      onboardingCompleted: false,
      onboardingSubjectScores: {},
      updateCertifications: (newCertifications) =>
        set((state) => {
          const nextSelected =
            state.selectedCertId &&
            newCertifications.some((cert) => cert.id === state.selectedCertId)
              ? state.selectedCertId
              : (newCertifications[0]?.id ?? null);

          return {
            certifications: newCertifications,
            selectedCertId: nextSelected,
          };
        }),
      selectCertification: (id) => {
        const hasCertification = get().certifications.some((cert) => cert.id === id);
        if (hasCertification) {
          set({ selectedCertId: id });
        }
      },
      setDailyStudyMinutes: (minutes) =>
        set({ dailyStudyMinutes: Math.max(30, minutes) }),
      completeOnboarding: ({ dailyStudyMinutes, examDate, subjectScores }) =>
        set((state) => {
          const selectedId = state.selectedCertId ?? state.certifications[0]?.id ?? null;
          const certifications = state.certifications.map((cert) =>
            cert.id === selectedId ? { ...cert, examDate } : cert
          );

          return {
            certifications,
            dailyStudyMinutes: Math.max(30, dailyStudyMinutes),
            onboardingSubjectScores: subjectScores,
            onboardingCompleted: true,
          };
        }),
    }),
    { name: "jaggungi-app-store-v1" }
  )
);
