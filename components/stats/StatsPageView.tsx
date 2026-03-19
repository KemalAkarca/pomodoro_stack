"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";

interface Task {
  id: string;
  title: string;
  done: boolean;
  targetPomodoros: number;
  completedPomodoros: number;
  date: string;
}

export default function StatsPage() {
  const [view, setView] = useState<"haftalik" | "aylik">("haftalik");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Seçili tarih state'i - Varsayılan olarak bugünü formatlar (yyyy-mm-dd)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedStreak = localStorage.getItem("currentStreak");
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedStreak) setStreak(Number(savedStreak));
    
    setIsLoaded(true);
  }, []);

  // Tarih Aralığı Başlığı
  const getDateRangeLabel = () => {
    const count = view === "haftalik" ? 7 : 30;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (count - 1));
    const startMonth = start.toLocaleDateString('tr-TR', { month: 'long' });
    const endMonth = end.toLocaleDateString('tr-TR', { month: 'long' });
    return startMonth === endMonth ? `${startMonth} 2026` : `${startMonth} - ${endMonth} 2026`;
  };

  // Grafik Verisi ve İnteraktif Takvim Hazırlama
  const getChartData = () => {
    const count = view === "haftalik" ? 7 : 30;
    return Array.from({ length: count }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (count - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      const daySessions = tasks
        .filter(t => t.date === dateStr)
        .reduce((acc, t) => acc + t.completedPomodoros, 0);
      
      return {
        fullDate: dateStr,
        label: d.getDate(),
        month: d.toLocaleDateString('tr-TR', { month: 'short' }),
        weekday: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
        count: daySessions
      };
    });
  };

  // BAŞARI ARŞİVİ FİLTRELEME: Sadece seçili tarihte biten görevleri göster
  const filteredArchive = tasks.filter(t => t.done && t.date === selectedDate);

  if (!isLoaded) return null;

  return (
    <MainLayout>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-5%] w-[35vw] h-[35vw] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto pt-16 px-6 pb-20 space-y-12">
        
        {/* ÜST BAŞLIK */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-8xl font-black italic tracking-tighter uppercase dark:text-white leading-[0.8]">
              ANA<br/><span className="text-blue-600">LİZ.</span>
            </h2>
            <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase italic">
              {getDateRangeLabel()}
            </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-white/5 p-1.5 rounded-[2rem] flex gap-1 border border-slate-200 dark:border-white/5">
            {["haftalik", "aylik"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  view === v ? "bg-blue-600 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {v === "haftalik" ? "7 GÜN" : "30 GÜN"}
              </button>
            ))}
          </div>
        </div>

        {/* ÖZET KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div whileHover={{ y: -5 }} className="p-12 rounded-[4.5rem] bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-[12rem] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">🔥</div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <span className="text-[10px] font-black tracking-[0.6em] opacity-70 uppercase">GÜNCEL SERİ</span>
              <div className="flex items-center gap-6 mt-4">
                <h3 className="text-9xl font-black italic tracking-tighter leading-none">{streak}</h3>
                <span className="text-5xl animate-bounce">🔥</span>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="p-12 rounded-[4.5rem] bg-white dark:bg-[#0a0a0a] border-2 border-slate-100 dark:border-white/5 shadow-xl flex flex-col justify-between">
            <span className="text-[10px] font-black tracking-[0.6em] text-blue-600 uppercase">VERİMLİLİK SKORU</span>
            <div className="mt-4">
              <h3 className="text-9xl font-black italic tracking-tighter dark:text-white leading-none">84</h3>
              <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full mt-6 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ANA GRAFİK PANELİ (TIKLANABİLİR ÇUBUKLAR) */}
        <div className="bg-white dark:bg-[#0a0a0a] border-2 border-slate-100 dark:border-white/5 rounded-[4.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="flex items-end justify-between gap-2 md:gap-4 h-80">
            <AnimatePresence mode="wait">
              {getChartData().map((data, i) => {
                const height = Math.max((data.count / 12) * 100, 5);
                const isSelected = selectedDate === data.fullDate;

                return (
                  <motion.div 
                    key={`${view}-${i}`}
                    className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer"
                    onClick={() => setSelectedDate(data.fullDate)}
                  >
                    <div className="relative w-full flex justify-center items-end h-full">
                      <motion.div 
                        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                        className={`w-full max-w-[32px] rounded-full transition-all duration-500 origin-bottom ${
                          isSelected ? 'bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.6)]' : 
                          data.count > 0 ? 'bg-blue-600/40' : 'bg-slate-100 dark:bg-white/5'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="mt-6 flex flex-col items-center gap-1">
                      <span className={`text-[10px] font-black ${isSelected ? 'text-blue-600' : 'dark:text-white'}`}>{data.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* BAŞARI ARŞİVİ (SEÇİLİ GÜNE GÖRE FİLTRELEME) */}
        <div className="space-y-8 min-h-[400px]">
          <div className="flex justify-between items-center">
             <h3 className="text-xs font-black tracking-[0.5em] text-blue-600 uppercase italic">Başarı Arşivi</h3>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedDate}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArchive.length > 0 ? (
              filteredArchive.map(task => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={task.id} 
                  className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-lg font-black italic tracking-tighter dark:text-white uppercase leading-none">{task.title}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">TAMAMLANDI</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm">✓</div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem]">
                <p className="text-[10px] font-black text-slate-300 dark:text-white/10 tracking-[0.4em] uppercase">
                  Bu tarihte henüz bir başarı kaydedilmemiş.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}