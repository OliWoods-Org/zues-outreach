import { RepliesModule } from '../pages/RepliesModule';
import type { ClientConfig } from './index';
interface Props { clientConfig?: Partial<ClientConfig>; }
export function RepliesTemplate({ clientConfig }: Props) { return <RepliesModule />; }
