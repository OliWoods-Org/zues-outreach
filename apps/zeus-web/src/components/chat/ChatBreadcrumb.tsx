import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { chatStrings } from '../../i18n/chatStrings';

/** Mission → Assistant — backlog item 22. */
export function ChatBreadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-3" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-teal-400/90 transition-colors">
        {chatStrings.breadcrumbMission}
      </Link>
      <ChevronRight className="w-3 h-3 opacity-50 shrink-0" aria-hidden />
      <span className="text-zinc-400">{chatStrings.breadcrumbChat}</span>
    </nav>
  );
}
