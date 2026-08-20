// DragonOS Persistence Layer - localStorage with dragonos.* namespace
import { useState, useEffect, useCallback } from 'react';

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
 * React hook: useState + localStorage persistence.
 * Usage: const [items, setItems] = usePersist<MyType[]>('key', []);
 */
export function usePersist<T>(key: string, fallback: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => load(key, fallback));

  useEffect(() => {
    save(key, value);
  }, [key, value]);

  return [value, setValue];
}

/**
 * React hook: just a persisted value without auto-save (for derived/external writes).
 */
export function usePersistedValue<T>(key: string, fallback: T): [T, (value: T) => void] {
  const [value, _setValue] = useState<T>(() => load(key, fallback));

  const setValue = useCallback((v: T) => {
    _setValue(v);
    save(key, v);
  }, [key]);

  return [value, setValue];
}
