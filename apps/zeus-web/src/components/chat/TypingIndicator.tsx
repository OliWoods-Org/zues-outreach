/** Streaming / thinking affordance — backlog item 13 (stub until real tokens). */

export function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-4 py-2" aria-hidden>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="inline-block h-2 w-2 rounded-full bg-zinc-500 animate-pulse"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
