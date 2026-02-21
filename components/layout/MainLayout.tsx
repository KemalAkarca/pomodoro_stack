"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // ✅ İlk açılış: localStorage -> html class
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved === "dark" ? "dark" : "light";

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  // ✅ Toggle: kesin set
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <header className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Pomodoro <span className="text-blue-600">+</span> ToDo
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Focus. Plan. Repeat.
              </p>
            </div>

            <Navbar theme={theme} onToggleTheme={toggleTheme} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
<div className="rounded-2xl border border-blue-100/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">          <div className="p-6 sm:p-8 text-slate-900 dark:text-slate-100">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}