"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";

// Tip tanımlamasını garantiye almak için doğrudan buraya ekledik
export interface Task {
  id: string;
  title: string;
  done: boolean;
  targetPomodoros: number;
  completedPomodoros: number;
}

export default function TasksPageView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, loaded]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: String(Date.now()),
      title,
      done: false,
      targetPomodoros: target,
      completedPomodoros: 0
    };
    
    setTasks([newTask, ...tasks]);
    setTitle("");
    setTarget(1);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto pt-10 px-6">
        <h2 className="text-4xl font-black mb-8 dark:text-white italic tracking-tighter">Mission Control</h2>
        
        {/* Görev Ekleme Formu */}
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl mb-10 flex flex-col md:flex-row gap-4 border border-slate-100 dark:border-slate-800">
          <input 
            className="flex-1 bg-transparent border-none text-xl font-bold focus:ring-0 dark:text-white placeholder:text-slate-300"
            placeholder="What are you working on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessions:</span>
            <input 
              type="number" min="1" max="10"
              className="w-12 bg-transparent border-none font-bold text-indigo-500 focus:ring-0 text-center"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
            ADD TASK
          </button>
        </form>

        {/* Görev Listesi */}
        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map(task => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex justify-between items-center group shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <h3 className={`text-lg font-bold ${task.done ? 'line-through text-slate-400' : 'dark:text-white text-slate-800'}`}>
                    {task.title}
                  </h3>
                  {/* İlerleme Noktaları */}
                  <div className="flex gap-1.5 mt-3">
                    {Array.from({ length: task.targetPomodoros }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          i < task.completedPomodoros 
                            ? 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]' 
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all text-xs font-black uppercase tracking-widest"
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}