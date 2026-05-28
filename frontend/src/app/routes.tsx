import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Study } from "./pages/Study";
import { StudyPlan } from "./pages/StudyPlan";
import { Test } from "./pages/Test";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./pages/Onboarding";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "study", Component: Study },
      { path: "plan", Component: StudyPlan },
      { path: "test", Component: Test },
      { path: "settings", Component: Settings },
      { path: "onboarding", Component: Onboarding },
    ],
  },
]);
