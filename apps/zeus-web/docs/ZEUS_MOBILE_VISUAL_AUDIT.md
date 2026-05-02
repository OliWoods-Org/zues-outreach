# Zeus Web — Mobile visual audit (<390px focus)

Scope: read-only review of Mission Control surfaces and shell padding. Viewport assumption: ~320–390px logical width after device chrome; content width is further reduced by `Layout` main horizontal padding (`px-4` → 16px each side).

---

## 1. Overflow / crunch risks (<390px)

| Area | Risk | Why |
|------|------|-----|
| **MissionKpiCharts** — card headers | Medium–high | Each chart uses `flex … justify-between` with a large KPI block and a right-side pill (`delta`, `+18% WoW`, `Win %`). On narrow widths the badge wraps or squeezes beside the headline, hurting scanability. |
| **MissionKpiCharts** — 7-day axis | Medium | Day labels use `flex justify-between` at `text-[9px]`. As the scaled SVG narrows, letter spacing between seven labels can overlap or feel uneven. |
| **ZeusGrowthPulse** — Publish tile | Medium | Inner stats use `flex gap-4 items-baseline` with a middle `·` separator. Flex row does not wrap by default; two `text-3xl` / `text-xl` clusters can feel cramped or cause awkward breaks before `sm`. |
| **ZeusGrowthPulse** — schema hint | Low–medium | Eyebrow paragraph includes a long `<code>` path (`docs/AIRTABLE_ZEUS_SCHEMA.md`). Without word-breaking, `code` can overflow or force horizontal scroll. |
| **ZeusMissionHero** — CTA cluster | Low (height) | Below `sm`, CTAs stack as full-width rows; three `py-3` blocks consume vertical space quickly (not horizontal overflow, but “crunched” feel above the fold). |
| **MissionControl** — action rows | Low | Listen / Campaigns / Scripts use `flex-wrap`; long labels are fine, but multiple rows of CTAs increase scroll depth on small screens. |
| **ModuleStub** — mesh hero | Low | `flex items-start gap-3` with fixed `h-10 w-10` icon beside `text-2xl` title is acceptable; very long titles wrap. |
| **ModuleStub** — integration copy | Low–medium | Multiple `<code>` segments and doc paths may overflow without breaks. |
| **ZeusIntelFeed** — list rows | Low | `min-w-0`, `truncate`, and `line-clamp-2` contain typical content; rare long unbroken strings could still poke out. |
| **Charts (SVG)** | Low | Area/bar charts use fixed `viewBox` with `w-full` and `preserveAspectRatio="xMidYMid meet"` — they scale; crunch is in **chrome/labels**, not the path geometry. |

---

## 2. Typography scale suggestions (mobile)

**Principle:** On the smallest widths, shave one step off display sizes, keep eyebrow/label sizes as-is (already 10–11px), and tighten line-height on multi-line heroes to protect vertical rhythm.

| Element | Current (observed) | Suggested mobile direction |
|---------|-------------------|----------------------------|
| **Hero / stub `h1`** | `text-2xl md:text-3xl` (ZeusMissionHero, ModuleStub) | `text-xl sm:text-2xl md:text-3xl` **or** `text-[clamp(1.25rem,5.2vw,1.875rem)]` with `leading-snug` |
| **Page-level section `h2`** (e.g. “Mission Control”, “Pulse · …”, “Voice conversion …”) | `text-lg` or `text-2xl` depending on block | Align hierarchy: secondary sections `text-base sm:text-lg font-semibold`; primary page title row `text-xl sm:text-2xl` where it competes with hero |
| **Hero body** | `text-sm text-zinc-400` | Keep `text-sm`; optional `max-w-[65ch]` on narrow to avoid very long line lengths when padding is tight |
| **KPI numerals in cards** | `text-2xl` / `text-3xl` | Optional `text-2xl sm:text-3xl` on the densest tiles (Growth pulse + quick stats) to prevent numerals from dominating |
| **Eyebrows** | `text-[10px]`–`text-[11px]` uppercase + tracking | Keep; ensure `tracking-[0.2em]` blocks don’t run wider than the viewport — allow wrapping on multi-word eyebrows if needed |

---

## 3. Card / grid breakpoints — concrete Tailwind ideas (per component)

Strings below are **suggestions** for future implementation; they are not applied in this audit pass.

### Layout (`main`)

- Today: `px-4 md:px-8 py-6 md:py-8`
- Suggestion: `px-3 min-[391px]:px-4 md:px-8` **or** keep `px-4` and add safe-area: `px-4 max-md:ps-[max(1rem,env(safe-area-inset-left))] max-md:pe-[max(1rem,env(safe-area-inset-right))]` so notched devices don’t feel tighter than design intent.

### ZeusMissionHero

- Outer stack: already `flex-col lg:flex-row` — good.
- CTA wrapper: `flex flex-col sm:flex-row flex-wrap gap-2 lg:justify-end lg:max-w-md`
  - Add **`w-full sm:w-auto`** on each `Link` if you want full-width tap targets only below `sm`, auto width from `sm` up.
  - Optional: `sm:flex-wrap sm:justify-end` to avoid a single overlong row between `sm` and `lg`.

### ZeusGrowthPulse

- Grid: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3`
  - Optional density: `gap-2 sm:gap-3` to reclaim vertical space on `max-sm`.
- Publish tile stats row: replace single-row flex with **`flex flex-wrap items-baseline gap-x-4 gap-y-1`** or **`grid grid-cols-2 gap-2`** for the two metrics below `sm`.
- Section title: `h2` → `text-base sm:text-lg font-semibold tracking-tight`
- Hint line with `<code>`: wrap `code` in **`break-all sm:break-normal`** (or parent `text-pretty` + code `break-words`).

### MissionKpiCharts

- Section header row: `flex flex-col gap-2 min-[400px]:flex-row min-[400px]:items-end min-[400px]:justify-between`
- Per-chart top row (KPI + badge): **`flex flex-col gap-2 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between`** so badges drop under the KPI on very narrow cards.
- Grid: `grid grid-cols-1 lg:grid-cols-3 gap-4` — consider **`md:grid-cols-2 lg:grid-cols-3`** if you want two-up sooner on tablets; for pure <390px concern, `grid-cols-1` is correct.
- Day labels: parent `className="flex justify-between …"` → add **`min-w-0`** and consider **`max-sm:px-1`** or shorten labels to `Mon` vs `M` via responsive classes if overlap appears.

### ZeusIntelFeed

- Header: **`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between`**; right link **`self-end sm:self-auto`** if you want “Briefings” aligned to end in stacked mode.
- List item link: already `flex gap-3`; ensure **`min-w-0`** stays on text column (present on inner div).

### MissionControl (page composition)

- “Command center” block: already `flex-col lg:flex-row` — consider **`gap-3`** under `max-lg` so title + `flex-wrap` buttons breathe.
- Quick stats: `text-3xl` → **`text-2xl sm:text-3xl`** in the stat value line if tiles feel tight next to padding.
- Bottom three-up: `md:grid-cols-3` — stays one column until `md`; acceptable for <390px.

### ModuleStub

- Hero: `px-6` → **`px-4 sm:px-6 md:px-8`** on the mesh panel; icon row **`flex-col sm:flex-row sm:items-start gap-3`** if the icon squeezes the title on the narrowest devices.
- Step grid: `sm:grid-cols-3` — fine; optional **`gap-2 sm:gap-3`**.

---

## 4. Ranked improvements (by perceived impact)

1. **MissionKpiCharts — stack KPI + right chips on narrow widths** — Unblocks the worst “squeezed header” pattern across three cards; improves glanceability immediately.
2. **ZeusGrowthPulse — Publish metrics row** — Make the dual-stat layout wrap or two-column on small screens; prevents cramped baselines and odd spacing around the separator.
3. **Long `<code>` / file paths** — Add deliberate breaking (`break-words` / `break-all`) in Growth pulse hint and ModuleStub integration copy to eliminate rare horizontal scroll.
4. **MissionKpiCharts — x-axis day labels** — Add responsive shortening, rotation, or interval skipping under a `max-sm` breakpoint if overlap shows up in device QA.
5. **Hero `h1` step-down** — `text-xl` at default with `sm`/`md` ramps preserves premium feel while avoiding overly tall hero blocks on 320px.
6. **Layout `main` padding + safe-area** — Small gain on 320px notched phones; avoids content hugging the curved edge awkwardly.
7. **ZeusIntelFeed — header stacks** — Prevents awkward wrap between title and “Briefings” on narrow widths.
8. **Mission Control stat numerals** — `text-2xl sm:text-3xl` on quick stats (and optionally Growth pulse big numbers) balances density with chart cards.
9. **ZeusMissionHero — CTA bandwidth** — After typography tweak, consider shorter secondary labels or a single primary + “More” pattern if vertical hero length is a product concern.
10. **Section `h2` normalization** — Single scale for “Pulse”, “Mission Control”, and “Voice conversion” blocks reduces arbitrary jumps between `text-lg` and `text-2xl` on the same scroll.
11. **Touch targets** — Audit `text-xs` links in card headers (`Analytics`, `Manage all`) for tappable area; prefer `py-2` hit slop where they sit alone on the right.
12. **ModuleStub icon + title** — Optional column stack below `sm` so long module titles don’t compete with the bolt tile for horizontal space.

---

*Generated: mobile-first visual audit for `apps/zeus-web` Mission Control stack. No TSX modifications in this task.*
