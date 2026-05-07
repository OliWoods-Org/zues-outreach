import { TargetModule } from '../pages/TargetModule';
import type { ClientConfig } from './index';

interface Props {
  clientConfig?: Partial<ClientConfig>;
}

/**
 * Target Module Template
 * ========================
 * Renders the ICP lead targeting dashboard.
 * Drop into any MAMA client dashboard — wire `clientConfig.supabaseUrl`
 * to swap mock data for live Airtable / Apollo feeds.
 *
 * Template slot: Replace `leads` data import with client-specific source.
 */
export function TargetTemplate({ clientConfig }: Props) {
  // Future: pass clientConfig down via React context to override brand tokens
  // and data sources without modifying TargetModule internals
  return <TargetModule />;
}
