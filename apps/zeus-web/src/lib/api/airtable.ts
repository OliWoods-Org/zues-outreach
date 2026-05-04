/**
 * Zeus Airtable onboarding API client → MAMA /api/airtable/* endpoints.
 */

const BASE = (import.meta.env.VITE_MAMA_API_URL as string | undefined) ?? 'http://localhost:3000';

export interface AirtableBase {
  id: string;
  name: string;
  tables: string[];
}

export interface AirtableValidateResult {
  valid: boolean;
  bases: AirtableBase[];
  error?: string;
}

export interface LeadsPreview {
  leads: Array<{
    name: string;
    company: string;
    title: string;
    email?: string;
  }>;
  total: number;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const airtableOnboardingApi = {
  /** Validate a PAT and return available bases */
  validate: (pat: string) =>
    apiFetch<AirtableValidateResult>('/api/airtable/validate', {
      method: 'POST',
      body: JSON.stringify({ pat }),
    }),
  /** Create the product's outreach base + Leads table with Zeus schema */
  createBase: (pat: string, product: string, baseId?: string) =>
    apiFetch<{ baseId: string; tableId: string }>('/api/airtable/setup-base', {
      method: 'POST',
      body: JSON.stringify({ pat, product, baseId }),
    }),
  /** Preview leads from Apollo before importing */
  previewApolloLeads: (apolloKey: string, query: string, limit = 10) =>
    apiFetch<LeadsPreview>('/api/airtable/preview-leads', {
      method: 'POST',
      body: JSON.stringify({ apolloKey, query, limit }),
    }),
  /** Push lead batch to Airtable Leads table */
  pushLeads: (pat: string, baseId: string, leads: LeadsPreview['leads']) =>
    apiFetch<{ pushed: number }>('/api/airtable/push-leads', {
      method: 'POST',
      body: JSON.stringify({ pat, baseId, leads }),
    }),
};
