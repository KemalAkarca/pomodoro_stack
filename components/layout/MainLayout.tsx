// components/layout/MainLayout.tsx
"use client";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Arka planı o istediğin buz mavisine çektik */
    <div className="min-h-screen bg-[#F4F9FF] dark:bg-black text-slate-900 dark:text-white transition-colors duration-500">
      <Navbar />

      {/* Arka plana derinlik katan hafif parlamalar */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-blue-500/5 blur-[120px] rounded-full dark:hidden" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/5 blur-[100px] rounded-full dark:hidden" />
      </div>

      {/* İÇERİĞİ ORTALAYAN ANA KAPSAYICI */}
      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
} 