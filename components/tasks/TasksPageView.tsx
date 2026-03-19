"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  targetPomodoros: number;
  completedPomodoros: number;
  date: string;
}

export default function TasksPageView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      window.dispatchEvent(new Event("storage"));
    }
  }, [tasks, loaded]);

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && activeTaskId) {
      setTasks(prev => prev.map(t => {
        if (t.id === activeTaskId) {
          const next = t.completedPomodoros + 1;
          return { ...t, completedPomodoros: next, done: next >= t.targetPomodoros };
        }
        return t;
      }));
      setIsRunning(false);
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeTaskId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks([{
      id: `task-${Date.now()}`,
      title: title.trim(),
      done: false,
      targetPomodoros: target,
      completedPomodoros: 0,
      date: selectedDate
    }, ...tasks]);
    setTitle("");
    setTarget(1);
  };

  // GÜNCELLENEN FONKSİYONLAR
  const updatePomodoro = (id: string, delta: number) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, targetPomodoros: Math.max(1, t.targetPomodoros + delta) } : t
    ));
  };

  const deleteTask = (id: string) => {
    if(confirm("Bu görevi silmek istediğine emin misin?")) {
      setTasks(tasks.filter(t => t.id !== id));
      if (activeTaskId === id) {
        setActiveTaskId(null);
        setIsRunning(false);
      }
    }
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

  const filteredTasks = tasks.filter(t => t.date === selectedDate);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        {/* SOL PANEL */}
        <div className="lg:col-span-5 space-y-12">
          <div>
            <h2 className="text-8xl font-black tracking-tighter leading-[0.8] uppercase text-slate-900 dark:text-white italic mb-12">
              PLAN<br/><span className="text-blue-600 font-black">LA</span>
            </h2>
            
            <div className={`mb-10 p-12 rounded-[3.5rem] transition-all duration-700 border-2 ${
              isRunning ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/40' : 'bg-white dark:bg-[#0D0D0D] border-slate-100 dark:border-white/5 shadow-xl'
            }`}>
              <div className="text-[10px] font-black tracking-[0.5em] uppercase mb-4 opacity-60">Kalan Süre</div>
              <div className="text-8xl font-black tabular-nums tracking-tighter leading-none mb-10">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
              <button 
                onClick={() => setIsRunning(!isRunning)}
                disabled={!activeTaskId}
                className={`w-full py-6 rounded-[2rem] text-[11px] font-black tracking-[0.4em] uppercase transition-all ${
                  isRunning ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                }`}
              >
                {!activeTaskId ? "GÖREV SEÇİN" : isRunning ? "DURAKLAT" : "BAŞLAT"}
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {getDates().map((date) => (
                <button
                  key={date.full}
                  onClick={() => setSelectedDate(date.full)}
                  className={`flex-shrink-0 w-20 h-28 rounded-[2.5rem] flex flex-col items-center justify-center border-2 transition-all ${
                    selectedDate === date.full ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5"
                  }`}
                >
                  <span className="text-[10px] font-black mb-1">{date.day}</span>
                  <span className="text-2xl font-black">{date.num}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-8 pt-12 border-t border-white/5">
            <div className="space-y-4">
              <label className="text-[11px] font-black tracking-[0.5em] text-blue-500 uppercase ml-6">GÖREV ADI</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-white dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/10 rounded-[2.5rem] p-8 text-xl font-bold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-white/20" 
                placeholder="Bugün ne yapıyoruz?" 
              />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-8 rounded-[2.5rem] font-black text-[13px] tracking-[0.5em] uppercase shadow-2xl active:scale-[0.97] transition-all">
              LİSTEYE EKLE
            </button>
          </form>
        </div>

        {/* SAĞ PANEL */}
        <div className="lg:col-span-7">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-xs font-black tracking-[0.4em] text-blue-600 uppercase italic">Aktif Oturum Akışı</h3>
            <span className="text-5xl font-black text-slate-100 dark:text-white/5">0{filteredTasks.length}</span>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <AnimatePresence>
              {filteredTasks.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[4rem] text-center">
                  <span className="text-sm font-black text-slate-300 dark:text-white/10 tracking-[0.5em] uppercase">Henüz bir görev planlanmadı</span>
                </motion.div>
              ) : (
                filteredTasks.map(task => (
                  <motion.div 
                     key={task.id}
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     onClick={() => setActiveTaskId(task.id)}
                     className={`p-10 rounded-[3.5rem] border-2 transition-all duration-500 cursor-pointer group relative ${
                       activeTaskId === task.id ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-600/5' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 shadow-sm'
                     }`}
                  >
                    <div className="flex justify-between items-start mb-10">
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black tracking-tighter">{task.title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">
                          Oturum Hedefi: {task.targetPomodoros}
                        </p>
                      </div>

                      {/* AKSİYON BUTONLARI (Geri Geldi!) */}
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden">
                           <button 
                            onClick={() => updatePomodoro(task.id, -1)}
                            className="p-3 hover:bg-red-500 hover:text-white transition-colors text-xs font-bold"
                           >–</button>
                           <span className="px-3 text-xs font-black">{task.completedPomodoros}/{task.targetPomodoros}</span>
                           <button 
                            onClick={() => updatePomodoro(task.id, 1)}
                            className="p-3 hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold"
                           >+</button>
                        </div>
                        
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 h-3">
                      {Array.from({ length: task.targetPomodoros }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-full transition-all duration-700 ${i < task.completedPomodoros ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] h-3' : 'bg-blue-600/10 h-2'}`} 
                        />
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}