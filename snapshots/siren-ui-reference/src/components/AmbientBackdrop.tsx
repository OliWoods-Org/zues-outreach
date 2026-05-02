/**
 * CoFounder × Railway atmosphere: cool blue wash + warm gold edge glow (not violet-forward).
 * Sits behind grid overlay and shell; keep decorative only.
 */
export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Top — CoFounder blue bloom (command-center cue) */}
      <div
        className="absolute top-0 left-1/2 w-[min(130vw,1600px)] h-[min(52vh,560px)] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 0%, rgba(59, 123, 245, 0.38) 0%, rgba(79, 142, 247, 0.14) 42%, rgba(212, 168, 85, 0.04) 62%, transparent 78%)',
        }}
      />
      {/* Railway nod: subtle violet rim (low mix — supports depth without candy gradients) */}
      <div
        className="absolute top-[12%] -left-[15%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl md:h-[520px] md:w-[520px]"
        style={{ background: 'rgba(124, 58, 237, 0.12)' }}
      />
      <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-brand-blue/20 blur-3xl md:h-[22rem] md:w-[22rem]" />
      <div className="absolute bottom-8 left-10 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl md:h-96 md:w-96" />
      <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-brand-navy/25 blur-2xl" />
    </div>
  );
}
