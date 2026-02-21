"use client";
// Pomodoro: timer + localStorage + task seçme + session kaydı + progress ring + success animation

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import type { Task } from "@/types/task";
import type { PomodoroSession } from "@/types/session";

export default function PomodoroPageView() {
  // =========================
  // Config
  // =========================

  // Test için 60 sn (istersen 25*60 yap: 1500)
  const initialSeconds = 60;

  // =========================
  // State (HOOK'lar hep en üstte)
  // =========================

  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // ✅ Pomodoro bitince success overlay
  const [showSuccess, setShowSuccess] = useState(false);

  // =========================
  // Helpers
  // =========================

  // Basit id üretimi
  const makeId = () => String(Date.now());

  // Saniyeyi "MM:SS" formatına çevir
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // localStorage'a session ekleme
  const saveSession = (taskId: string | null) => {
    // taskId varsa title'ı tasks listesinden bul (snapshot)
    const title = taskId ? tasks.find((t) => t.id === taskId)?.title : undefined;

    const newSession: PomodoroSession = {
      id: makeId(),
      taskId,
      taskTitle: title, // ✅ snapshot
      durationMinutes: 25,
      completedAt: new Date().toISOString(),
    };

    const saved = localStorage.getItem("sessions");
    const list: PomodoroSession[] = saved ? JSON.parse(saved) : [];
    list.unshift(newSession);
    localStorage.setItem("sessions", JSON.stringify(list));
  };

  // =========================
  // Effects
  // =========================

  // Sayfa ilk açılınca: localStorage'dan tasks verisini yükle
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (!saved) return;

    try {
      const parsed: Task[] = JSON.parse(saved);
      setTasks(parsed);
    } catch {
      // JSON bozuksa sessizce geç
    }
  }, []);

  // Timer mantığı
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);

          // Süre bitti: session kaydet
          saveSession(selectedTaskId ? selectedTaskId : null);

          // ✅ Success overlay aç
          setShowSuccess(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // =========================
  // Actions
  // =========================

  // Reset: timer'ı durdur ve başa al
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  };

  // Start / Pause / Resume (0:00 iken başlatma)
  const handleToggle = () => {
    if (secondsLeft === 0) return;
    setIsRunning((prev) => !prev);
  };

  // Buton yazısı
  const primaryLabel = isRunning
    ? "Pause"
    : secondsLeft === 0
    ? "Done"
    : secondsLeft === initialSeconds
    ? "Start"
    : "Resume";

  // =========================
  // Progress Ring
  // =========================

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = ((initialSeconds - secondsLeft) / initialSeconds) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // =========================
  // Render
  // =========================

  return (
    <MainLayout>
      {/* Hero */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
          Pomodoro
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Deep focus, one session at a time.
        </p>
      </div>

      {/* Focus card */}
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-sm backdrop-blur">
          {/* Task select */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-slate-600">
              Focus task
            </label>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">No task selected</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-400">
              Selected task id: {selectedTaskId || "-"}
            </p>
          </div>

          {/* Timer + Ring */}
          <div className="my-10 flex justify-center">
            <div className="relative h-[220px] w-[220px]">
              <svg className="absolute inset-0 -rotate-90" width="220" height="220">
                {/* Arka daire */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                {/* İlerleme dairesi */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-semibold text-blue-700">
                  {formatTime(secondsLeft)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleToggle}
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              {primaryLabel}
            </button>

            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Reset
            </button>
          </div>

          {/* Alt bilgi */}
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">
              Tip: Choose a task, then start your session.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/20 backdrop-blur-sm">
          <div className="mt-6 flex justify-end">
  <button
    onClick={() => setShowSuccess(false)}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
  >
    Continue
  </button>
</div>

          <div className="w-[320px] rounded-2xl border border-blue-100 bg-white p-6 shadow-lg animate-[pop_250ms_ease-out]">
            <p className="text-sm font-semibold text-slate-900">
              ✅ Session completed
            </p>
            <p className="mt-1 text-xs text-slate-500">Nice! Keep going.</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                +25 min focus
              </span>
              <span className="text-xl">🎉</span>
            </div>
          </div>

          <style jsx>{`
            @keyframes pop {
              from {
                transform: scale(0.96);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </MainLayout>
  );
}
