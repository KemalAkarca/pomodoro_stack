"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "theme";

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false); // Bileşen yüklendi mi kontrolü

  // 1. Sayfa yüklendiğinde çalışır
  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as Theme) || "light";
    setTheme(saved);
    setMounted(true); // Artık render edebiliriz
  }, []);

  // 2. Tema değiştikçe HTML'e sınıf ekler/çıkarır
  useEffect(() => {
    if (!mounted) return; // Henüz yüklenmediyse bir şey yapma

    const isDark = theme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(KEY, theme);
  }, [theme, mounted]);

  // Hydration hatasını önlemek için mounted değilse içeriği boş veya temelsiz döndür
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        className="fixed right-4 top-4 z-50 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm 
                   hover:bg-slate-50 
                   dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
      >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>

      {children}
    </>
  );
}