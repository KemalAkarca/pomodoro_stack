export type PomodoroSession = {
  id: string;
  taskId: string | null;

  // ✅ Task silinse bile istatistikte göstermek için
  taskTitle?: string;

  durationMinutes: number;
  completedAt: string;
};
