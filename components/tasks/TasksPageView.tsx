"use client";
// State + localStorage kullanacağımız için client component



import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import type { Task } from "@/types/task";


export default function TasksPageView() {
  const [loaded, setLoaded] = useState(false);
  // Tüm task listesi burada tutulur (single source of truth)
  const [tasks, setTasks] = useState<Task[]>([]);

  // Basit id üretimi
  const makeId = () => String(Date.now());

  // Sayfa ilk açılınca localStorage'dan yükle
 useEffect(() => {
  const saved = localStorage.getItem("tasks");

  if (saved) {
    try {
      const parsed: Task[] = JSON.parse(saved);
      setTasks(parsed);
    } catch {
      // bozuksa görmezden gel
    }
  }

  // ✅ her durumda: ilk yükleme tamam
  setLoaded(true);
}, []);


  // tasks değiştikçe localStorage'a kaydet
  useEffect(() => {
  // ✅ daha localStorage'dan yüklemeden kaydetme (yoksa [] ile ezer)
  if (!loaded) return;

  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks, loaded]);


  // Yeni task ekle (TaskForm burayı çağıracak)
  const handleAdd = (title: string) => {
    const task: Task = { id: makeId(), title, done: false };
    setTasks((prev) => [task, ...prev]);
  };

  // Done/Undo
  const handleToggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Delete
  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <MainLayout>
    {/* Üst başlık + küçük aksiyon */}
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Tasks</h2>
        <p className="mt-1 text-sm text-slate-500">
          Keep it lightweight. Ship one thing at a time.
        </p>
      </div>

      {/* Mini badge */}
      <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        {tasks.length} total
      </div>
    </div>

    {/* Grid: sol form + sağ liste */}
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Sol panel */}
      <div className="lg:col-span-1">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Add task</h3>
          <p className="mt-1 text-xs text-slate-500">
            Write something small and specific.
          </p>

          <div className="mt-4">
            <TaskForm onAdd={handleAdd} />
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-4">
            <p className="text-xs text-slate-600">
              Tip: Press <span className="font-semibold">Enter</span> to add
              quickly.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ panel */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Your list</h3>
            <span className="text-xs text-slate-500">
              Done: {tasks.filter((t) => t.done).length}
            </span>
          </div>

          {/* Boş durum */}
          {tasks.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No tasks yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Add your first task from the left panel.
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <TaskList
                tasks={tasks}
                onToggleDone={handleToggleDone}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </MainLayout>
);
}
