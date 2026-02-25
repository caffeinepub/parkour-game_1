import { useState, useCallback } from 'react';
import { formatTime } from './useTimer';

export interface LeaderboardEntry {
  name: string;
  time: number;
  date: string;
}

const STORAGE_KEY = 'parkour_leaderboard';
const MAX_ENTRIES = 10;

function loadEntries(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: LeaderboardEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(loadEntries);

  const addEntry = useCallback((name: string, time: number): number => {
    const newEntry: LeaderboardEntry = {
      name: name.slice(0, 12) || 'Anonymous',
      time,
      date: new Date().toLocaleDateString(),
    };
    const updated = [...loadEntries(), newEntry]
      .sort((a, b) => a.time - b.time)
      .slice(0, MAX_ENTRIES);
    saveEntries(updated);
    setEntries(updated);
    return updated.findIndex(e => e === newEntry || (e.name === newEntry.name && e.time === newEntry.time)) + 1;
  }, []);

  const getRank = useCallback((time: number): number => {
    const all = [...loadEntries(), { name: '', time, date: '' }].sort((a, b) => a.time - b.time);
    return all.findIndex(e => e.time === time) + 1;
  }, []);

  const refresh = useCallback(() => setEntries(loadEntries()), []);

  return { entries, addEntry, getRank, refresh, formatTime };
}
