/**
 * CoFounder × Railway — full-viewport “cross check” mesh:
 * orthogonal grid + diagonal hatch + micro dots + film grain + vignette.
 * Fixed z-[1] under app shell (z-10). Decorative only.
 */
export function CrossGridOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {/* True cross-check: horizontal + vertical hairlines (graph-paper read) */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.045) 0px,
              transparent 1px,
              transparent 31px,
              rgba(255, 255, 255, 0.038) 32px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.04) 0px,
              transparent 1px,
              transparent 31px,
              rgba(255, 255, 255, 0.032) 32px
            )
          `,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Diagonal crosshatch — depth layer */}
      <div
        className="absolute inset-0 opacity-[0.42]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              118deg,
              rgba(255, 255, 255, 0.028) 0px,
              transparent 1px,
              transparent 47px,
              rgba(255, 255, 255, 0.032) 48px
            ),
            repeating-linear-gradient(
              -118deg,
              rgba(255, 255, 255, 0.022) 0px,
              transparent 1px,
              transparent 47px,
              rgba(255, 255, 255, 0.026) 48px
            )
          `,
        }}
      />
      {/* Railway-style micro dot grid */}
      <div
        className="absolute inset-0 opacity-[0.48]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.085) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Film grain — breaks banding, adds premium texture */}
      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
      {/* Center spotlight — Railway / command-center depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 88% 68% at 50% 16%, rgba(79, 142, 247, 0.075) 0%, transparent 56%), radial-gradient(ellipse 72% 52% at 82% 88%, rgba(212, 168, 85, 0.055) 0%, transparent 58%)',
        }}
      />
      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 140px rgba(0, 0, 0, 0.62)',
        }}
      />
    </div>
  );
}
