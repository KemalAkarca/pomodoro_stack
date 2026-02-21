"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import type { PomodoroSession } from "@/types/session";
import type { Task } from "@/types/task";

export default function StatsPageView() {
  const [todayCount, setTodayCount] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [mostFocusedLabel, setMostFocusedLabel] = useState<string>("-");


  useEffect(() => {
      

    // Sessions verisini al
    const savedSessions = localStorage.getItem("sessions");
    if (!savedSessions) return;

    const sessions: PomodoroSession[] = JSON.parse(savedSessions);

    // Bugünün tarihi
    const today = new Date().toISOString().split("T")[0];

    // Sadece bugünkü session'lar
    const todaySessions = sessions.filter((s) =>
      s.completedAt.startsWith(today)
    );

    setTodayCount(todaySessions.length);
    setTodayMinutes(todaySessions.length * 25);

    // Task verisini al (id -> title eşlemesi için)
    const savedTasks = localStorage.getItem("tasks");
    if (!savedTasks) return;

    const tasks: Task[] = JSON.parse(savedTasks);

    // Hangi task kaç kez yapılmış say
    const counter: Record<string, number> = {};

    todaySessions.forEach((s) => {
      if (!s.taskId) return;
      counter[s.taskId] = (counter[s.taskId] || 0) + 1;
    });

    // En çok yapılan task id'sini bul
    let max = 0;
    let topTaskId: string | null = null;

    for (const id in counter) {
      if (counter[id] > max) {
        max = counter[id];
        topTaskId = id;
      }
    }

   // Eğer bugün hiç session yoksa
if (todaySessions.length === 0) {
  setMostFocusedLabel("No sessions today");
  return;
}

// Eğer task seçmeden session yapılmışsa
if (!topTaskId) {
  setMostFocusedLabel("Unassigned (no task selected)");
  return;
}

// Id'den title'ı bul
const task = tasks.find((t) => t.id === topTaskId);
setMostFocusedLabel(task ? task.title : "Deleted/Unknown task");

  }, []);
// ✅ sessions verisini sıfırlar (eski veriler top task'i bozmasın diye)
  const clearSessions = () => {
    localStorage.removeItem("sessions"); // sessions'ı tamamen sil
    setTodayCount(0);                    // ekrandaki sayıları sıfırla
    setTodayMinutes(0);
    setMostFocusedLabel("No sessions today");
  };
 return (
  <MainLayout>
    {/* Üst başlık */}
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Stats</h2>
        <p className="mt-1 text-sm text-slate-500">
          Your focus performance today.
        </p>
      </div>

      {/* Reset butonu (sendeki clearSessions varsa) */}
      <button
        onClick={clearSessions}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        Clear sessions
      </button>
    </div>

    {/* Kartlar */}
    <div className="grid gap-4 md:grid-cols-3">
      {/* Sessions */}
      <div className="group rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm transition hover:shadow-md">
        <p className="text-sm font-medium text-slate-600">Today Sessions</p>
        <div className="mt-3 text-4xl font-semibold text-blue-700">
          {todayCount}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Completed focus blocks today.
        </p>
      </div>

      {/* Minutes */}
      <div className="group rounded-2xl border border-blue-100 bg-gradient-to-b from-indigo-50 to-white p-6 shadow-sm transition hover:shadow-md">
        <p className="text-sm font-medium text-slate-600">Focus Minutes</p>
        <div className="mt-3 text-4xl font-semibold text-blue-700">
          {todayMinutes} <span className="text-lg font-semibold">min</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Total focused time today.
        </p>
      </div>

      {/* Top Task */}
      <div className="group rounded-2xl border border-blue-100 bg-gradient-to-b from-sky-50 to-white p-6 shadow-sm transition hover:shadow-md">
        <p className="text-sm font-medium text-slate-600">Most Focused</p>

        <div className="mt-3">
          <span className="inline-flex max-w-full items-center rounded-full border border-blue-100 bg-white px-3 py-1 text-sm font-semibold text-slate-800">
            <span className="truncate">{mostFocusedLabel}</span>
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          The task you focused on the most.
        </p>
      </div>
    </div>

    {/* Progress */}
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Günlük hedef (şimdilik 8 pomodoro) */}
      {/*
        hedefi sonra ayarlatacağız.
        8 pomodoro = 200 dakika (25*8)
      */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Daily goal</p>
        <p className="text-sm text-slate-500">
          {Math.min(todayCount, 8)} / 8 sessions
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${Math.min(100, (todayCount / 8) * 100)}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Keep going — consistency beats intensity.
      </p>
    </div>
  </MainLayout>
);

}
