import AsyncStorage from '@react-native-async-storage/async-storage';

// The single in-progress workout, persisted so it survives the app being
// backgrounded/killed (or a reload while you switch to your music app).
const KEY = 'active_session_v1';

export type SessionPhase = 'exercise' | 'rest';

export type ActiveSession = {
  dayIndex: number;
  exerciseIndex: number;
  setIndex: number;
  phase: SessionPhase;
  startedAt: number;    // epoch ms when the workout began
  restEndsAt?: number;  // epoch ms the current rest ends (only while phase === 'rest')
};

export async function loadSession(): Promise<ActiveSession | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActiveSession) : null;
  } catch {
    return null;
  }
}

export async function saveSession(s: ActiveSession): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // best-effort
  }
}

export async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
