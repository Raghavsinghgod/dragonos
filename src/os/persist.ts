// DragonOS Persistence Layer - Optimized localStorage with debounced saves
import { useState, useEffect, useCallback, useRef } from 'react';

const PREFIX = 'dragonos.';

export function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch { /* quota exceeded */ }
}

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function remove(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export function clearAll(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
}

/**
 * React hook: useState + localStorage persistence with debounced writes.
 * Only writes to localStorage after 500ms of no updates to avoid thrashing.
 */
export function usePersist<T>(key: string, fallback: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => load(key, fallback));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Debounced save — only write after 500ms of no changes
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(key, value), 500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [key, value]);

  return [value, setValue];
}

/**
 * Optimized debounced save — for imperative saves outside React.
 */
export function useDebouncedSave(key: string, delay = 500) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback((data: unknown) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(key, data), delay);
  }, [key, delay]);
}
