"use client";
// Liste içinde butonlar var (tıklama), bu yüzden client component

// Task tipini burada da tanımlıyoruz (şimdilik kopya)
// Bir sonraki adımda bunu /types altına taşıyacağız.
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
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white border border-blue-100 rounded-xl p-4 flex items-center justify-between"
        >
          {/* Task yazısı */}
          <span className={task.done ? "text-blue-300 line-through" : "text-blue-800"}>
            {task.title}
          </span>

          {/* Butonlar */}
          <div className="flex gap-3">
            <button
              onClick={() => onToggleDone(task.id)}
              className="text-sm text-blue-600"
            >
              {task.done ? "Undo" : "Done"}
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="text-sm text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
