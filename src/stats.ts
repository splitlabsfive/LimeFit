import { WorkoutSession, WorkoutSet } from "./types";

export const setVolume = (s: Pick<WorkoutSet, "kg" | "reps">) => s.kg * s.reps;

export const doneSets = (s: WorkoutSession): WorkoutSet[] =>
  s.exercises.flatMap((e) => e.sets.filter((set) => set.done));

export const sessionVolume = (s: WorkoutSession): number =>
  doneSets(s).reduce((acc, set) => acc + setVolume(set), 0);

export const sessionSetCount = (s: WorkoutSession): number => doneSets(s).length;

export const sessionDurationMs = (s: WorkoutSession, now = Date.now()): number =>
  (s.finishedAt ?? now) - s.startedAt;

export const formatDuration = (ms: number): string => {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
};

export const formatClock = (ms: number): string => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const formatDate = (ts: number): string => {
  const d = new Date(ts);
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

export const formatKg = (kg: number): string =>
  Number.isInteger(kg) ? `${kg}` : `${kg}`;

export type WeekStats = { workouts: number; volume: number; sets: number };

export const weekStats = (sessions: WorkoutSession[], now = Date.now()): WeekStats => {
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const week = sessions.filter((s) => s.finishedAt !== null && s.finishedAt >= weekAgo);
  return {
    workouts: week.length,
    volume: week.reduce((acc, s) => acc + sessionVolume(s), 0),
    sets: week.reduce((acc, s) => acc + sessionSetCount(s), 0)
  };
};

export const totalVolume = (sessions: WorkoutSession[]): number =>
  sessions.reduce((acc, s) => acc + sessionVolume(s), 0);

export const currentStreak = (sessions: WorkoutSession[], now = Date.now()): number => {
  const days = new Set(
    sessions
      .filter((s) => s.finishedAt !== null)
      .map((s) => {
        const d = new Date(s.finishedAt as number);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
  );
  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(cursor.getTime())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
