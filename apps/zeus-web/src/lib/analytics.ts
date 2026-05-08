/**
 * Privacy-safe product analytics.
 * Delegates to PostHog (via lib/posthog.ts ph()) when key is set; logs in dev always.
 * Maps to backlog items 33–34 (assistant funnel events).
 */

export type ZeusAnalyticsPayload = Record<string, string | number | boolean | undefined>;

const DEV = import.meta.env.DEV;

export function trackZeus(event: string, payload?: ZeusAnalyticsPayload): void {
  if (DEV) {
    console.info(`[zeus-analytics] ${event}`, payload ?? {});
  }
  // ph() in posthog.ts handles PostHog capture + optional window.zeusTrack forward
  // Import lazily to avoid circular dep (posthog.ts imports nothing from here)
  import('./posthog').then(({ ph }) => ph(event, payload)).catch(() => {});
}
