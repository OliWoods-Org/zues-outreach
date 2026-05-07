# Zeus Web — Midjourney visual reference (UI update prep)

**Purpose:** Mood boards, backgrounds, and textures for **Zeus Web** (`apps/zeus-web`) before implementing in CSS/React. Align generated art with the live design tokens—do not treat MJ output as final UI.

**Code source of truth**

| What | Path (repo-relative) |
|------|----------------------|
| Colors / breakpoints | `apps/zeus-web/tailwind.config.js` |
| Glass / Zeus surfaces | `apps/zeus-web/src/index.css` |
| App shell / routes | `apps/zeus-web/README.md` |

**Brand tokens (words for prompts)**

- Void black `#050507`, card graphite, CoFounder **blue** `#4F8EF7`, **gold** `#D4A855`
- Zeus lane accents: **surge** cyan `#22d3ee`, **teal** `#14b8a6`, **aurora** violet `#a78bfa`, **ember** `#fbbf24`
- Glass: frosted panels, thin white edge ~6–8% opacity, subtle blue inner glow, gold specular hint
- Structure: faint **cross-hatch / railway engineering grid** (see `CrossGridOverlay` patterns in app)

**MJ discipline**

- Append `--no text, watermark, logo, letters, words` when the model draws fake dashboards.
- Prefer `--style raw` for flatter, less “fantasy” renders.
- Use abstracts for **backgrounds and tiles**; rebuild real components in code.

---

## Prompts (copy-paste)

### 1 — Full-bleed app background

```
abstract dark UI atmosphere, deep void black and charcoal (#050507), subtle diagonal cross-hatch technical grid like railway engineering blueprint, soft cobalt blue (#4F8EF7) rim light on edges, faint champagne gold (#D4A855) specular glints, frosted glass panels implied by soft bloom, cinematic minimal, ultra clean, no interface, no text, 8k, sharp noise-free grain --ar 16:9 --style raw --v 6
```

```
premium SaaS dark mode texture background, infinite depth, soft vignette, micro-noise, faint teal (#22d3ee) and violet (#a78bfa) aurora wisps in deep shadow, gold dust particles sparse, glass refraction caustics very subtle, abstract only, no screens --ar 21:9 --v 6
```

### 2 — Glass card / panel study (reference for `.siren-card` / `.glass-panel`)

```
macro photograph of frosted dark glass tile floating in void, razor-thin white edge highlight 8% opacity, inner gradient from graphite to black, soft blue (#4F8EF7) inner glow at one corner, gold (#D4A855) micro reflection strip, product photography, studio lighting, no text, no UI --ar 3:2 --style raw --v 6
```

### 3 — Mission Control abstract (hero / marketing — not a screenshot)

```
abstract mission control visualization, dark luxury command aesthetic, glowing nodes on a sparse network graph, thin neon-blue signal lines (#4F8EF7), amber alert accents (#fbbf24) isolated, depth of field, holographic glass layers, no readable text, no screens with widgets --ar 16:9 --v 6
```

### 4 — Zeus lane pillars (Listen / Target / Engage / Convert — color bands)

```
four vertical abstract light pillars in darkness -- teal cyan (#22d3ee), emerald (#14b8a6), electric blue (#4F8EF7), soft purple (#a78bfa) -- minimal geometric, edge fog, gold dust separator lines (#D4A855), fine grain, no icons, no letters --ar 2:1 --v 6
```

### 5 — Seamless grid overlay (export as PNG ~3–6% multiply)

```
seamless technical grid pattern, very faint white lines on pure black, perspective fade to infinity, engineering drafting aesthetic, subtle moire, tileable, flat orthographic, high resolution, no labels --ar 1:1 --v 6
```

### 6 — Empty state (no mascot)

```
minimal 3D abstract sculpture, floating glass rings and orbs, dark void studio, single cool blue key light (#4F8EF7), warm gold bounce fill (#D4A855), calm optimistic mood, Apple-keynote minimalism, no text, no cute mascot --ar 4:3 --v 6
```

### 7 — OG / social preview (crop to 1200×630 if needed)

```
bold abstract Z-shaped light trail formed only by gradient light (gold to blue), black negative space, premium tech brand poster, no typography --ar 16:9 --v 6
```

---

## After generation

1. Color-pick against Tailwind tokens; adjust CSS variables / gradients—not literal MJ hex.
2. Export WebP/AVIF for large backgrounds; keep overlays tiny and tileable.
3. Optional afternoon check-in: [`CLAUDE_2PM_TASKS.md`](CLAUDE_2PM_TASKS.md).

**Related:** Repository [`README.md`](../README.md) (architecture overview, Zeus Web section).
