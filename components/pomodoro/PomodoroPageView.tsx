"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import confetti from "canvas-confetti";

// Tip tanımı burada da olmalı (veya import edilmeli)
interface Task {
  id: string;
  title: string;
  done: boolean;
  targetPomodoros: number;
  completedPomodoros: number;
}

export default function PomodoroView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [showFinishScreen, setShowFinishScreen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    
    if (!isBreak) {
      // ÇALIŞMA BİTTİ -> Görev ilerlemesini güncelle
      const updatedTasks = tasks.map(t => 
        t.id === selectedTaskId 
          ? { ...t, completedPomodoros: t.completedPomodoros + 1 } 
          : t
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      
      setIsBreak(true);
      setTimeLeft(5 * 60); // 5 dk mola
    } else {
      // MOLA BİTTİ -> Çalışmaya dön
      setIsBreak(false);
      setTimeLeft(25 * 60); // 25 dk çalışma
    }
    setShowFinishScreen(true);
  };

  const startNextImmediately = () => {
    setShowFinishScreen(false);
    setIsActive(true);
  };

  const formatTime = (s: number) => 
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // 1. ZEN MODE (FULL SCREEN - BLACK OUT)
  if (isActive) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)] opacity-50" />
        
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 mb-8">
          <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.5em] text-center mb-1">
              {isBreak ? "Rest & Recharge" : "Current Objective"}
            </p>
            <p className="text-indigo-400 font-bold tracking-widest text-sm text-center">
              {isBreak ? "Break Time" : selectedTask?.title}
            </p>
          </div>
        </motion.div>

        <h1 className="text-[28vw] font-black text-white leading-none tabular-nums tracking-tighter z-10 select-none">
          {formatTime(timeLeft)}
        </h1>

        <button 
          onClick={() => setIsActive(false)} 
          className="absolute bottom-16 z-10 text-white/20 font-black uppercase tracking-[0.6em] text-[10px] hover:text-red-500 transition-all"
        >
          Abort Mission
        </button>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto pt-10 px-6">
        <AnimatePresence mode="wait">
          {showFinishScreen ? (
            // 2. BİTİŞ VE GEÇİŞ EKRANI
            <motion.div 
              key="finish" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-indigo-600 rounded-[3rem] text-white shadow-2xl px-10 relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-5xl font-black mb-4">
                  {isBreak ? "Focus Done! 🎉" : "Break Over! ⚡"}
                </h2>
                <p className="text-indigo-100 mb-12 text-lg font-medium">
                  {isBreak 
                    ? "Great work! Ready for a 5-minute break?" 
                    : "Hope you feel refreshed. Ready to dive back in?"}
                </p>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={startNextImmediately} 
                    className="bg-white text-indigo-600 py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
                  >
                    {isBreak ? "Start Break Now →" : "Start Next Session →"}
                  </button>
                  <button 
                    onClick={() => setShowFinishScreen(false)} 
                    className="text-indigo-200 font-bold uppercase text-xs tracking-[0.3em] mt-6 hover:text-white transition-colors"
                  >
                    Return to Mission Control
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // 3. SEÇİM EKRANI
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black dark:text-white tracking-tight italic">The Void</h2>
                <p className="text-slate-500 mt-3 font-medium">Choose your task and vanish from the world.</p>
              </div>

              <div className="grid gap-4">
                {tasks.filter(t => !t.done).map(task => (
                  <button 
                    key={task.id} 
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-8 rounded-[2.5rem] border-2 transition-all text-left flex justify-between items-center ${
                      selectedTaskId === task.id 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 shadow-lg' 
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div>
                      <span className={`text-xl font-black block ${selectedTaskId === task.id ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Progress: {task.completedPomodoros} / {task.targetPomodoros}
                      </span>
                    </div>
                    {selectedTaskId === task.id && <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />}
                  </button>
                ))}
              </div>

              <button 
                disabled={!selectedTaskId} 
                onClick={() => { setIsBreak(false); setTimeLeft(25*60); setIsActive(true); }}
                className="w-full mt-12 py-8 bg-indigo-600 text-white rounded-[3rem] font-black text-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] disabled:opacity-10 disabled:grayscale uppercase tracking-widest transition-all hover:bg-indigo-700"
              >
                Initiate Focus
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}