const memory: Record<string, string> = {};

const hasLocalStorage = (): boolean =>
  typeof globalThis !== "undefined" &&
  typeof (globalThis as { localStorage?: Storage }).localStorage !== "undefined";

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = hasLocalStorage()
      ? (globalThis as { localStorage: Storage }).localStorage.getItem(key)
      : memory[key] ?? null;
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  const raw = JSON.stringify(value);
  if (hasLocalStorage()) {
    (globalThis as { localStorage: Storage }).localStorage.setItem(key, raw);
  } else {
    memory[key] = raw;
  }
}
