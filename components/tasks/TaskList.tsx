"use client";
import type { Task } from "@/types/task";

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
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="group transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md dark:shadow-none backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            {/* Özel Checkbox Görünümü */}
            <div 
              onClick={() => onToggleDone(task.id)}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                task.done 
                ? "bg-indigo-500 border-indigo-500" 
                : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
              } flex items-center justify-center`}
            >
              {task.done && <span className="text-white text-xs">✓</span>}
            </div>

            <span className={`font-medium transition-all ${
              task.done 
              ? "text-slate-400 line-through decoration-indigo-500/50" 
              : "text-slate-700 dark:text-slate-200"
            }`}>
              {task.title}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}