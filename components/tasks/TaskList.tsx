"use client";
import type { Task } from "@/types/task";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskList({
  tasks,
  onToggleDone,
  onDelete,
}: {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative p-10 rounded-[3.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-10">
              <h3 className={`text-2xl font-black tracking-tighter leading-tight pr-16 ${
                task.done ? "text-slate-300 line-through" : "text-slate-900 dark:text-white"
              }`}>
                {task.title}
              </h3>
              <button onClick={() => onDelete(task.id)} className="absolute top-10 right-10 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black uppercase">
                Sil
              </button>
            </div>

            {/* Pomodoro Çubukları - Mavi Renk Garantili */}
            <div className="flex gap-3 h-4 items-center mb-6">
              {Array.from({ length: task.targetPomodoros || 1 }).map((_, i) => {
                const isCompleted = i < (task.completedPomodoros || 0);
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-full transition-all duration-700"
                    style={{
                      height: isCompleted ? '10px' : '6px',
                      backgroundColor: isCompleted ? '#2563eb' : '#e2e8f0',
                      boxShadow: isCompleted ? '0 0 20px rgba(37, 99, 235, 0.7)' : 'none',
                      opacity: isCompleted ? 1 : 0.4
                    }}
                  />
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => onToggleDone(task.id)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${
                  task.done ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                }`}
              >
                {task.done ? "TAMAMLANDI" : "OTURUMU BİTİR"}
              </button>
              <span className="text-xl font-black text-slate-200 italic">
                {task.completedPomodoros || 0} / {task.targetPomodoros}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}