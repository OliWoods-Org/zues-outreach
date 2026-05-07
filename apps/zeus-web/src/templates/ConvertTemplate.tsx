import { ConvertModule } from '../pages/ConvertModule';
import type { ClientConfig } from './index';
interface Props { clientConfig?: Partial<ClientConfig>; }
export function ConvertTemplate({ clientConfig }: Props) { return <ConvertModule />; }
