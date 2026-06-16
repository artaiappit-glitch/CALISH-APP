import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'workout_history_v1';

export type WorkoutRecord = {
  id: string;          // unique key
  dayName: string;     // e.g. "Pull"
  focus: string;       // e.g. "Vertical & horizontal pulling"
  completedAt: number; // epoch ms when the workout finished
  durationSec: number; // wall-clock time from start to finish
  exercises: number;   // exercise count
  sets: number;        // total sets completed
};

/** All saved records, newest first. Never throws — returns [] on any error. */
export async function getHistory(): Promise<WorkoutRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WorkoutRecord[];
    return parsed.sort((a, b) => b.completedAt - a.completedAt);
  } catch {
    return [];
  }
}

/** Append a completed-workout record. */
export async function addRecord(rec: Omit<WorkoutRecord, 'id'>): Promise<void> {
  try {
    const existing = await getHistory();
    const record: WorkoutRecord = { ...rec, id: `${rec.completedAt}` };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing]));
  } catch {
    // Best-effort: a failed save shouldn't break the workout flow.
  }
}

/** Remove a single record by id. */
export async function deleteRecord(id: string): Promise<void> {
  try {
    const existing = await getHistory();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter((r) => r.id !== id)));
  } catch {
    // ignore
  }
}

/** Wipe all history. */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ── Formatting helpers ────────────────────────────────────────────────────────

/** "32 min" / "1 h 05 min" / "45 s" */
export function formatDuration(totalSec: number): string {
  if (totalSec < 60) return `${totalSec} s`;
  const mins = Math.round(totalSec / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} h ${String(m).padStart(2, '0')} min`;
}

/** "Today · 9:14 AM" / "Yesterday · 6:02 PM" / "Mon 16 Jun · 9:14 AM" */
export function formatWhen(epochMs: number): string {
  const d = new Date(epochMs);
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86_400_000);

  let day: string;
  if (dayDiff === 0) day = 'Today';
  else if (dayDiff === 1) day = 'Yesterday';
  else day = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

  return `${day} · ${time}`;
}
