/**
 * PostHog analytics — heatmaps, session recording, autocapture.
 * Set VITE_POSTHOG_KEY in .env.local to activate; no-ops without a key.
 *
 * Key events to fire at important Zeus actions:
 *   import { ph } from '@/lib/posthog';
 *   ph('airtable_connected', { base_name, product });
 */
import posthog from 'posthog-js';

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;

if (KEY) {
  posthog.init(KEY, {
    api_host: 'https://app.posthog.com',
    autocapture: true,
    capture_pageview: true,
    // @ts-ignore — PostHog 1.x property (enable_heatmaps may not be in older @types yet)
    enable_heatmaps: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true },
    },
  });
}

/**
 * Fire a PostHog event (safe no-op when key not set).
 * Also forwards to the legacy window.zeusTrack stub if present.
 */
export function ph(event: string, props?: Record<string, string | number | boolean | null | undefined>): void {
  if (KEY) {
    posthog.capture(event, props);
  }
  // Forward to legacy zeusTrack stub so Analytics.ts still logs in dev
  const w = typeof window !== 'undefined' ? (window as Window & { zeusTrack?: (e: string, p?: unknown) => void }) : null;
  w?.zeusTrack?.(event, props);
}

export { posthog };
