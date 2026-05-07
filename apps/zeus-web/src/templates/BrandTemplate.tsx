import { BrandModule } from '../pages/BrandModule';
import type { ClientConfig } from './index';
interface Props { clientConfig?: Partial<ClientConfig>; }
export function BrandTemplate({ clientConfig }: Props) { return <BrandModule />; }
