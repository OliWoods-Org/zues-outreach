import { MarketplaceModule } from '../pages/MarketplaceModule';
import type { ClientConfig } from './index';
interface Props { clientConfig?: Partial<ClientConfig>; }
export function MarketplaceTemplate({ clientConfig }: Props) { return <MarketplaceModule />; }
