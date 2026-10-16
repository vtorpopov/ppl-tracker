import type { Category } from './db/schema';

export const categoryColor: Record<Category, string> = {
  push: '#ff6b5b',
  pull: '#5ac8fa',
  legs: '#30d158',
  other: '#bf5af2',
};

export const categoryLabel: Record<Category, string> = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  other: 'Other',
};

export function fmtDuration(ms: number): string {
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${min % 60} min`;
}

export function fmtClock(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function fmtRelative(ts: number): string {
  const days = Math.floor((startOfDay(Date.now()) - startOfDay(ts)) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return fmtDate(ts);
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function fmtCompact(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k`;
  return String(Math.round(n));
}
