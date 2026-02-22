"use client";

import { useEffect, useState } from "react";
import { motion ,Variants} from "framer-motion";
import confetti from "canvas-confetti";
import MainLayout from "@/components/layout/MainLayout";
import type { PomodoroSession } from "@/types/session";


// Animasyon Ayarları
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars : Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function StatsPageView() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [peakHour, setPeakHour] = useState<string>("-");
  const [completionRate, setCompletionRate] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedSessions = localStorage.getItem("sessions");
    if (!savedSessions) return;
    const parsed: PomodoroSession[] = JSON.parse(savedSessions);
    setSessions(parsed);

    // 1. En Verimli Saati Hesapla
    const hours = parsed.map(s => new Date(s.completedAt).getHours());
    if (hours.length > 0) {
      const mostFrequentHour = hours.reduce((a, b, i, arr) =>
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), hours[0]);
      setPeakHour(`${mostFrequentHour}:00`);
    }

    // 2. Başarı Oranı & Konfeti Tetikleyici
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = parsed.filter(s => s.completedAt.startsWith(today)).length;
    const rate = Math.min(Math.round((todaySessions / 8) * 100), 100);
    setCompletionRate(rate);

    if (todaySessions >= 8) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
    }

    // 3. Basit Streak Hesaplama (Gün bazlı)
    const uniqueDays = [...new Set(parsed.map(s => s.completedAt.split("T")[0]))].sort();
    setStreak(uniqueDays.length);
  }, []);

  const heatmapData = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = sessions.filter(s => s.completedAt.startsWith(dateStr)).length;
    return { date: dateStr, count };
  }).reverse();

  return (
    <MainLayout>
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="space-y-10 pb-10"
      >
        {/* BAŞLIK */}
        <motion.div variants={itemVars} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-5xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
              Focus Intelligence
            </h2>
            <p className="text-slate-400 mt-2 font-medium tracking-wide">Analytic breakdown of your deep work cycles.</p>
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-500 text-xs font-bold">
                LIVE ENGINE ACTIVE
             </div>
          </div>
        </motion.div>

        {/* MEGA STATS GRID */}
        <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Completion Rate", value: `%${completionRate}`, color: "from-emerald-500 to-teal-600", icon: "📈" },
            { label: "Peak Focus Hour", value: peakHour, color: "from-orange-500 to-red-600", icon: "🔥" },
            { label: "Total Sessions", value: sessions.length, color: "from-blue-500 to-indigo-600", icon: "💎" },
            { label: "Focus Hours", value: Math.round((sessions.length * 25) / 60), color: "from-purple-500 to-pink-600", icon: "⌛" },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden transition-all"
            >
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-[10px] uppercase tracking-tighter font-bold text-slate-400">{stat.label}</p>
              <h3 className="text-3xl font-black mt-1 dark:text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* HEATMAP & LIVE FEED GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ISİ HARİTASI */}
          <motion.div variants={itemVars} className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Consistency Map
              </h3>
              <div className="flex gap-1 items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Less</span>
                {[0, 1, 2, 3].map(v => (
                  <div key={v} className={`w-3 h-3 rounded-sm ${v === 0 ? 'bg-slate-100 dark:bg-slate-800' : v === 1 ? 'bg-indigo-200' : v === 2 ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
                ))}
                <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">More</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {heatmapData.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  whileHover={{ scale: 1.5, zIndex: 10 }}
                  title={`${day.date}: ${day.count} sessions`}
                  className={`w-6 h-6 rounded-md cursor-pointer transition-colors ${
                    day.count === 0 ? 'bg-slate-100 dark:bg-slate-800' : 
                    day.count < 3 ? 'bg-indigo-200 dark:bg-indigo-900/40' : 
                    day.count < 6 ? 'bg-indigo-400 dark:bg-indigo-700/60' : 
                    'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* LIVE STREAM */}
          <motion.div variants={itemVars} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
             <h4 className="font-bold mb-6 flex items-center gap-2 dark:text-white">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Feed
             </h4>
             <div className="space-y-6">
                {sessions.slice(0, 4).map((s, i) => (
                  <div key={i} className="relative pl-6 border-l border-slate-100 dark:border-slate-800">
                    <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <p className="text-sm font-bold dark:text-slate-200 truncate">{s.taskTitle || "Deep Focus Block"}</p>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">
                      {new Date(s.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 25 MIN
                    </p>
                  </div>
                ))}
                {sessions.length === 0 && <p className="text-xs text-slate-500 italic">No activity recorded yet...</p>}
             </div>
          </motion.div>
        </div>

        {/* INSIGHTS & STREAK */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Productivity Insight */}
          <motion.div 
            variants={itemVars}
            whileHover={{ scale: 1.02 }}
            className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
            <h4 className="text-2xl font-black mb-4">Focus Insight 🧠</h4>
            <p className="text-indigo-100 leading-relaxed text-lg">
              "You hit your peak at <span className="text-white font-bold underline decoration-pink-500 underline-offset-4">{peakHour}</span>. 
              Scheduling your 'Big Frogs' during this window could boost your output by <span className="text-pink-300 font-bold">40%</span>."
            </p>
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">System Recommendation</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-bounce">↓</div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div 
            variants={itemVars}
            className="p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-center items-center text-center shadow-xl group"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-6xl mb-6"
            >
              🏆
            </motion.div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Longest Streak</h4>
            <p className="text-7xl font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">
              {streak} <span className="text-lg font-bold text-indigo-500">DAYS</span>
            </p>
            <p className="mt-6 text-xs text-slate-500 font-medium italic">"Don't break the chain, your future self is watching."</p>
          </motion.div>
        </div>
      </motion.div>

      {/* KONFETİ İÇİN CSS (Opsiyonel) */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </MainLayout>
  );
}