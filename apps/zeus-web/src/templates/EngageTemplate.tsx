import { EngageModule } from '../pages/EngageModule';
import type { ClientConfig } from './index';
interface Props { clientConfig?: Partial<ClientConfig>; }
export function EngageTemplate({ clientConfig }: Props) { return <EngageModule />; }
