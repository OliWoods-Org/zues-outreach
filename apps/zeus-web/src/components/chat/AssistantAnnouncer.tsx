/** aria-live announcements for new assistant text — backlog item 27. */

export function AssistantAnnouncer({ text }: { text: string | null }) {
  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {text ?? ''}
    </div>
  );
}
