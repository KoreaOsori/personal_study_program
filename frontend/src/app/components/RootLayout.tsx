import { useState } from "react";
import { Outlet, Link, Navigate, useLocation } from "react-router";
import { Logo } from "./Logo";
import { Toaster } from "./ui/sonner";
import { Button } from "./ui/button";
import { CertificationProvider } from "../context/CertificationContext";
import { useAppStore } from "../store/useAppStore";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ClipboardList,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "학습하기", href: "/study", icon: BookOpen },
  { name: "학습플랜", href: "/plan", icon: Calendar },
  { name: "시험보기", href: "/test", icon: ClipboardList },
  { name: "설정", href: "/settings", icon: Settings },
];

export function RootLayout() {
  const location = useLocation();
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isOnboardingPage = location.pathname === "/onboarding";

  if (!onboardingCompleted && !isOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  if (onboardingCompleted && isOnboardingPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <CertificationProvider>
      <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Logo className="text-sidebar-foreground" showSubtitle />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 text-center">
            © 2026 자꿈이
            <br />
            자기의 꿈을 이루자!
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-border bg-card flex items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex-shrink-0"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {!sidebarOpen && (
            <Logo size="small" />
          )}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
      </div>
    </CertificationProvider>
  );
}
