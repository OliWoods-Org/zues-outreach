import { AutopostModule } from '../pages/AutopostModule';
import type { ClientConfig } from './index';
interface Props { clientConfig?: Partial<ClientConfig>; }
export function AutopostTemplate({ clientConfig }: Props) { return <AutopostModule />; }
