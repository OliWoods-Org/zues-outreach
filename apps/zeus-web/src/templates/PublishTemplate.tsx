import { PublishModule } from '../pages/PublishModule';
import type { ClientConfig } from './index';
interface Props { clientConfig?: Partial<ClientConfig>; }
export function PublishTemplate({ clientConfig }: Props) { return <PublishModule />; }
