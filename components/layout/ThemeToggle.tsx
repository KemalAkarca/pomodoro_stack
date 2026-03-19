"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 transition-colors duration-500 flex items-center shadow-inner"
    >
      <motion.div
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full flex items-center justify-center shadow-md bg-white dark:bg-blue-600 z-10"
      >
        {isDark ? "🌙" : "☀️"}
      </motion.div>
      
      {/* Arka plan ikonları (Sönük duranlar) */}
      <div className="absolute inset-0 flex justify-between items-center px-2 opacity-20 text-[10px] pointer-events-none">
        <span>☀️</span>
        <span>🌙</span>
      </div>
    </button>
  );
}