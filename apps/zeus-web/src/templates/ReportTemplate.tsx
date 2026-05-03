import { ReportModule } from '../pages/ReportModule';
import type { ClientConfig } from './index';
interface Props { clientConfig?: Partial<ClientConfig>; }
export function ReportTemplate({ clientConfig }: Props) { return <ReportModule />; }
