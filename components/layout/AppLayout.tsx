"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { LeftNav } from "./LeftNav";
import { BookOpen, X } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  currentLevelId?: string;
  currentTopicId?: string;
  showLeftNav?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentLevelId = "level-01",
  currentTopicId,
  showLeftNav = false,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        {showLeftNav && (
          <div className="hidden md:block">
            <LeftNav
              currentLevelId={currentLevelId}
              currentTopicId={currentTopicId}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>
        )}

        {/* Mobile Drawer Overlay */}
        {showLeftNav && mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Drawer Content */}
            <div className="relative z-10 w-72 max-w-[85vw] bg-surface h-full shadow-2xl flex flex-col animate-slide-right">
              <div className="p-3 border-b border-border flex items-center justify-between bg-surface-secondary/40">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Curriculum
                </span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-md text-foreground-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <LeftNav
                  currentLevelId={currentLevelId}
                  currentTopicId={currentTopicId}
                  isMobileDrawer={true}
                  onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative p-4 sm:p-6 lg:p-8">
          {/* Mobile Curriculum Drawer Trigger Button */}
          {showLeftNav && (
            <div className="md:hidden mb-4 flex items-center justify-between p-2 rounded-lg bg-surface border border-border shadow-2xs">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                type="button"
                className="flex items-center gap-2 text-xs font-bold text-foreground hover:text-accent transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-accent" />
                <span>Browse Topics & Curriculum</span>
              </button>
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
                Level {currentLevelId.replace("level-", "")}
              </span>
            </div>
          )}

          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
