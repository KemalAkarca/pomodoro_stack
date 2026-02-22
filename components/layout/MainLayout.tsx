"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved === "dark" ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    /* Arka Plan: Yumuşak geçişli ve modern derinlik */
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      
      {/* Header: Cam Efekti (Glassmorphism) */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-[#020617]/80">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="group cursor-default">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Pomodoro <span className="text-indigo-600 dark:text-indigo-400">+</span> ToDo
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium">
                Focus • Plan • Repeat
              </p>
            </div>

            <Navbar theme={theme} onToggleTheme={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Ana İçerik Alanı */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="relative">
          {/* Arka planda hafif bir parlama efekti (Glow) - Sadece dark modda görünür */}
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-2xl dark:block hidden" />
          
          {/* İçerik Kartı */}
          <div className="relative rounded-3xl border border-white/20 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none backdrop-blur-sm">
            <div className="p-8">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer veya Alt Süsleme (Opsiyonel) */}
      <footer className="py-8 text-center text-sm text-slate-400 dark:text-slate-600">
        Built with focus
      </footer>
    </div>
  );
}