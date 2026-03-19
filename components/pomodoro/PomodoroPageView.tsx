"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import confetti from "canvas-confetti";

interface Task {
  id: string;
  title: string;
  done: boolean;
  targetPomodoros: number;
  completedPomodoros: number;
  date: string;
}

export default function PomodoroView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [showFinishScreen, setShowFinishScreen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ses Efektleri İçin Ref'ler
  const successSound = useRef<HTMLAudioElement | null>(null);
  const startSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Ses dosyalarını ilklendir
    successSound.current = new Audio("/sounds/success.mp3");
    startSound.current = new Audio("/sounds/start.mp3");

    const saved = localStorage.getItem("tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Veri okuma hatası:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const playSound = (type: 'success' | 'start') => {
    const sound = type === 'success' ? successSound.current : startSound.current;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => console.log("Ses çalma tarayıcı tarafından engellendi."));
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    playSound('success'); // Başarı sesi
    
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 }, 
      colors: ['#2563eb', '#ffffff', '#60a5fa'] 
    });
    
    if (!isBreak) {
      const updatedTasks = tasks.map(t => 
        t.id === selectedTaskId ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setIsBreak(true);
      setTimeLeft(5 * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(25 * 60);
    }
    setShowFinishScreen(true);
  };

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('tr-TR', { weekday: 'short' }).toUpperCase(),
        num: d.getDate()
      });
    }
    return dates;
  };

  const formatTime = (s: number) => 
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const filteredTasks = tasks.filter(t => t.date === selectedDate && !t.done);

  if (!isLoaded) return null;

  // ZEN MODU (Çalışma Ekranı)
  if (isActive) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
        
        {/* ARKA PLAN NEFES ALAN GLOW */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-[70vw] h-[70vw] rounded-full blur-[120px] pointer-events-none ${isBreak ? 'bg-emerald-500' : 'bg-blue-600'}`}
        />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col items-center">
          <div className="mb-12 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em] text-center mb-1">
              {isBreak ? "DİNLENME" : "ODAKLANILIYOR"}
            </p>
            <p className="text-blue-500 font-bold tracking-tight text-lg text-center uppercase italic">
              {isBreak ? "Mola Zamanı" : selectedTask?.title}
            </p>
          </div>

          <h1 className="text-[32vw] font-black text-white leading-none tabular-nums tracking-tighter select-none drop-shadow-[0_0_80px_rgba(255,255,255,0.1)]">
            {formatTime(timeLeft)}
          </h1>

          <button 
            onClick={() => {
              if(confirm("Odaklanma oturumu sonlandırılsın mı?")) setIsActive(false);
            }} 
            className="mt-20 group relative px-10 py-4 rounded-full transition-all"
          >
            <span className="relative z-10 text-white/10 group-hover:text-red-500 font-black uppercase tracking-[0.8em] text-[11px] transition-colors duration-500">
              OTURUMU DURDUR
            </span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto pt-12 px-6 pb-40">
        <AnimatePresence mode="wait">
          {showFinishScreen ? (
            <motion.div 
              key="finish" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 bg-blue-600 rounded-[4rem] text-white shadow-2xl px-10"
            >
              <h2 className="text-7xl font-black mb-6 tracking-tighter italic uppercase">TAMAMLANDI</h2>
              <p className="text-blue-100 mb-16 text-xl font-medium tracking-tight">
                {isBreak ? "Mola bitti, tekrar odaklanmaya ne dersin?" : "Güzel iş! 5 dakikalık molaya hazır mısın?"}
              </p>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button 
                  onClick={() => { playSound('start'); setShowFinishScreen(false); setIsActive(true); }} 
                  className="bg-white text-blue-600 py-7 rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase"
                >
                  {isBreak ? "ODAKLANMAYA BAŞLA →" : "MOLAYI BAŞLAT →"}
                </button>
                <button onClick={() => setShowFinishScreen(false)} className="text-blue-100/50 font-black uppercase text-[10px] tracking-[0.4em] mt-6 hover:text-white transition-colors">
                  KONTROL PANELİNE DÖN
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
              <div className="text-center">
                <h2 className="text-8xl font-black dark:text-white tracking-tighter italic uppercase leading-[0.85]">
                  DERİN<br/><span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.2)]">ODAK.</span>
                </h2>
                
                <div className="custom-scrollbar flex gap-4 overflow-x-auto py-10 px-4 -mx-4 justify-start md:justify-center">
                  {getDates().map((date) => (
                    <button
                      key={date.full}
                      onClick={() => setSelectedDate(date.full)}
                      className={`flex-shrink-0 w-16 h-24 rounded-[2rem] flex flex-col items-center justify-center transition-all border-2 ${
                        selectedDate === date.full ? "bg-blue-600 border-blue-600 text-white shadow-xl scale-105" : "bg-white dark:bg-white/5 border-slate-100 dark:border-transparent text-slate-400 dark:text-white/20"
                      }`}
                    >
                      <span className="text-[9px] font-black mb-1">{date.day}</span>
                      <span className="text-2xl font-black">{date.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <motion.button 
                      key={task.id} 
                      whileHover={{ y: -5 }}
                      onClick={() => { playSound('start'); setSelectedTaskId(task.id); }}
                      className={`p-10 rounded-[3.5rem] border-2 transition-all duration-500 text-left ${
                        selectedTaskId === task.id ? 'border-blue-600 bg-blue-600/5 shadow-2xl shadow-blue-500/10' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5'
                      }`}
                    >
                      <span className={`text-3xl font-black block tracking-tighter mb-6 leading-tight ${selectedTaskId === task.id ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}>
                        {task.title}
                      </span>
                      <div className="flex gap-1.5">
                        {Array.from({ length: task.targetPomodoros }).map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < task.completedPomodoros ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-slate-200 dark:bg-white/10'}`} />
                        ))}
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[4rem]">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs italic">Planlanmış bir görev yok.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isActive && !showFinishScreen && selectedTaskId && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-10 left-0 right-0 z-50 px-6 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button 
              onClick={() => { playSound('start'); setIsBreak(false); setTimeLeft(25*60); setIsActive(true); }}
              className="w-full py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-2xl uppercase tracking-[0.2em] hover:bg-blue-700 transition-all active:scale-95"
            >
              ODAĞI BAŞLAT
            </button>
          </div>
        </motion.div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 20px; }
      `}</style>
    </MainLayout>
  );
}