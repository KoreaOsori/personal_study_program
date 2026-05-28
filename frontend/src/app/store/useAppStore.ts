import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Certification {
  id: string;
  name: string;
  examDate: string;
  examDescription?: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concepts: string[];
  difficulty: "easy" | "medium" | "hard";
  source: "gpt" | "static";
}

export interface WrongAnswer {
  id: string;
  questionId: string;
  question: QuizQuestion;
  wrongCount: number;
  lastWrongAt: string;
  nextReviewAt: string;
  conceptTags: string[];
  certId: string;
  starred: boolean;
}

export interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  durationSec: number;
  answeredAt: string;
}

interface AppState {
  certifications: Certification[];
  selectedCertId: string | null;
  dailyStudyMinutes: number;
  onboardingCompleted: boolean;
  onboardingSubjectScores: Record<string, number>;

  wrongAnswers: WrongAnswer[];
  quizResults: QuizResult[];
  activeQuizQuestions: QuizQuestion[];
  isQuizLoading: boolean;

  updateCertifications: (certifications: Certification[]) => void;
  selectCertification: (id: string) => void;
  setDailyStudyMinutes: (minutes: number) => void;
  completeOnboarding: (payload: {
    dailyStudyMinutes: number;
    examDate: string;
    subjectScores: Record<string, number>;
  }) => void;

  setActiveQuizQuestions: (questions: QuizQuestion[]) => void;
  setQuizLoading: (loading: boolean) => void;
  submitAnswer: (result: QuizResult, question: QuizQuestion) => void;
  toggleStarWrongAnswer: (wrongAnswerId: string) => void;
  removeWrongAnswer: (wrongAnswerId: string) => void;
  getReviewQueue: () => WrongAnswer[];
  clearQuiz: () => void;
}

function computeNextReview(wrongCount: number): string {
  const now = new Date();
  if (wrongCount >= 3) {
    now.setDate(now.getDate() + 1);
  } else if (wrongCount >= 1) {
    now.setDate(now.getDate() + 3);
  } else {
    now.setDate(now.getDate() + 7);
  }
  return now.toISOString();
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

      wrongAnswers: [],
      quizResults: [],
      activeQuizQuestions: [],
      isQuizLoading: false,

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

      setActiveQuizQuestions: (questions) => set({ activeQuizQuestions: questions }),
      setQuizLoading: (loading) => set({ isQuizLoading: loading }),

      submitAnswer: (result, question) =>
        set((state) => {
          const newResults = [...state.quizResults, result];

          if (result.isCorrect) {
            return { quizResults: newResults };
          }

          const certId = state.selectedCertId ?? "";
          const existing = state.wrongAnswers.find(
            (wa) => wa.questionId === result.questionId
          );

          if (existing) {
            const wrongCount = existing.wrongCount + 1;
            const updated = state.wrongAnswers.map((wa) =>
              wa.questionId === result.questionId
                ? {
                    ...wa,
                    wrongCount,
                    lastWrongAt: new Date().toISOString(),
                    nextReviewAt: computeNextReview(wrongCount),
                  }
                : wa
            );
            return { quizResults: newResults, wrongAnswers: updated };
          }

          const newWrongAnswer: WrongAnswer = {
            id: `wa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            questionId: result.questionId,
            question,
            wrongCount: 1,
            lastWrongAt: new Date().toISOString(),
            nextReviewAt: computeNextReview(1),
            conceptTags: question.concepts,
            certId,
            starred: false,
          };

          return {
            quizResults: newResults,
            wrongAnswers: [...state.wrongAnswers, newWrongAnswer],
          };
        }),

      toggleStarWrongAnswer: (wrongAnswerId) =>
        set((state) => ({
          wrongAnswers: state.wrongAnswers.map((wa) =>
            wa.id === wrongAnswerId ? { ...wa, starred: !wa.starred } : wa
          ),
        })),

      removeWrongAnswer: (wrongAnswerId) =>
        set((state) => ({
          wrongAnswers: state.wrongAnswers.filter((wa) => wa.id !== wrongAnswerId),
        })),

      getReviewQueue: () => {
        const now = new Date().toISOString();
        const certId = get().selectedCertId;
        return get().wrongAnswers.filter(
          (wa) => wa.nextReviewAt <= now && wa.certId === certId
        );
      },

      clearQuiz: () =>
        set({ activeQuizQuestions: [], quizResults: [], isQuizLoading: false }),
    }),
    { name: "jaggungi-app-store-v1" }
  )
);
