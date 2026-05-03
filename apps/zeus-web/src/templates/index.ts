/**
 * Zeus MAMA Dashboard Templates
 * ==============================
 * Each module has a corresponding template export for fast client spin-up.
 * Templates accept a `clientConfig` prop that overrides defaults without
 * touching the underlying page component.
 *
 * Usage:
 *   import { TargetTemplate } from '@/templates';
 *   <TargetTemplate clientConfig={{ brandName: 'ElevareHealth', industry: 'Telehealth' }} />
 *
 * To scaffold a new MAMA dashboard:
 *   1. Pick the relevant template exports
 *   2. Wrap in a Layout with the client's theme tokens
 *   3. Replace mock data imports with client Supabase/Airtable endpoints
 */

export { TargetTemplate } from './TargetTemplate';
export { EngageTemplate } from './EngageTemplate';
export { ConvertTemplate } from './ConvertTemplate';
export { ReportTemplate } from './ReportTemplate';
export { PublishTemplate } from './PublishTemplate';
export { BrandTemplate } from './BrandTemplate';
export { MarketplaceTemplate } from './MarketplaceTemplate';
export { AutopostTemplate } from './AutopostTemplate';
export { RepliesTemplate } from './RepliesTemplate';

/** Shared config shape injected into every template */
export interface ClientConfig {
  /** Client brand name, replaces "Acme Growth" in all templates */
  brandName: string;
  /** Primary vertical for pre-filtering (e.g. "Telehealth") */
  industry?: string;
  /** App URL for deep links inside templates */
  appUrl?: string;
  /** Accent color override (hex) — defaults to teal #22d3ee */
  accentColor?: string;
  /** Whether to hide the marketplace addon tab */
  hideMarketplace?: boolean;
  /** Supabase project URL for live data (future) */
  supabaseUrl?: string;
}
