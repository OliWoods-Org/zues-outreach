/**
 * Zeus social-listening API client → MAMA /api/social/listen/* endpoints.
 * Base URL set via VITE_MAMA_API_URL (defaults to localhost:3000 in dev).
 */

const BASE = (import.meta.env.VITE_MAMA_API_URL as string | undefined) ?? 'http://localhost:3000';

export interface ListenStatus {
  running: boolean;
  lastScanAt: string | null;
  nextScanAt: string | null;
  postsToday: number;
  dailyCap: number;
}

export interface TrendPost {
  id: string;
  platform: 'reddit' | 'twitter' | 'hackernews' | 'github';
  title: string;
  text: string;
  url: string;
  score: number;
  author: string;
  capturedAt: string;
  keyword: string;
  status: 'new' | 'reviewed' | 'responded' | 'ignored';
}

export interface ListenKeyword {
  id: string;
  keyword: string;
  platform: string;
  active: boolean;
  tierSlot: number;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`MAMA API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const socialApi = {
  status: () => apiFetch<ListenStatus>('/api/social/listen/status'),
  feed: (limit = 50) => apiFetch<TrendPost[]>(`/api/social/listen/feed?limit=${limit}`),
  keywords: () => apiFetch<ListenKeyword[]>('/api/social/listen/keywords'),
  addKeyword: (keyword: string, platform: string) =>
    apiFetch<ListenKeyword>('/api/social/listen/keywords', {
      method: 'POST',
      body: JSON.stringify({ keyword, platform }),
    }),
  removeKeyword: (id: string) =>
    apiFetch<void>(`/api/social/listen/keywords/${id}`, { method: 'DELETE' }),
  triggerScan: () =>
    apiFetch<{ queued: true }>('/api/social/listen/scan', { method: 'POST' }),
};
