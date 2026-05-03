/**
 * Zeus PRISM/Argus API client → MAMA /api/prism/* endpoints.
 */

const BASE = (import.meta.env.VITE_MAMA_API_URL as string | undefined) ?? 'http://localhost:3000';

export interface PrismHealth {
  product: string;
  score: number;
  topIssue: string;
  lastRun: string | null;
  trend: 'up' | 'down' | 'flat';
  prevScore: number | null;
}

export interface PrismSession {
  id: string;
  product: string;
  url: string;
  score: number;
  personaCount: number;
  runAt: string;
  reportUrl: string | null;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`MAMA API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const prismApi = {
  health: (product?: string) =>
    apiFetch<PrismHealth>(`/api/prism/health${product ? `?product=${encodeURIComponent(product)}` : ''}`),
  sessions: () => apiFetch<PrismSession[]>('/api/prism/sessions'),
  run: (product: string, url: string, personaCount?: number) =>
    apiFetch<{ sessionId: string; queued: true }>('/api/prism/run', {
      method: 'POST',
      body: JSON.stringify({ product, url, personaCount: personaCount ?? 5 }),
    }),
};
