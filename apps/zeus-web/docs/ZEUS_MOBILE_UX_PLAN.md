# Zeus Web — Mobile UX optimization plan

Scope: `apps/zeus-web`. This document assumes the existing mobile shell in `Layout.tsx` (hamburger, slide-in drawer, full-screen overlay, body scroll lock, route-change close) and `AppHeader.tsx` patterns. It records **gaps** and **enhancements** only.

---

## 1. Executive summary

- **Baseline:** Below `lg`, navigation is a fixed left drawer with overlay dismiss, `overflow-hidden` on `body` while open, and a header hamburger that opens the menu; main content uses responsive padding (`px-4` → `md:px-8`). Mission Control and KPI sections already stack to single-column layouts at small widths (`grid-cols-1`, `sm:` / `lg:` breakpoints).
- **Gap — navigation IA:** Growth OS alone exposes 12+ routes in one scroll region with only static group headings; there is no funnel, search, or “recent destinations” affordance, so wayfinding on phones is cognitively heavy.
- **Gap — header context:** Current page title sits in the header only from `sm` upward (`hidden sm:flex`); on the narrowest viewports users rely on the drawer or page chrome for “where am I,” and secondary actions (e.g. help → `/chat`, voice usage meter) are partially hidden until larger breakpoints.
- **Gap — touch & device chrome:** Several header controls use `p-2` + 20px icons (aggregate hit area often < 44×44 CSS px). There is no `env(safe-area-inset-*)` usage on the shell, drawer, or header, so notched devices and home indicators can clip controls or feel cramped.
- **Gap — accessibility for mobile overlay:** The drawer behaves like a modal surface but lacks `role="dialog"` / `aria-modal`, an explicit `aria-labelledby` tie to a title, focus restoration, and a documented focus order; keyboard and screen-reader users may land behind the overlay or lose context when the menu opens.

---

## 2. Navigation IA for mobile

**Current structure (drawer):** Mission → **Growth OS** (Listen, Target, Engage, Convert, Report, Publish, Influencers, Brand kit, Brand wizard, Affiliates, Marketplace, Briefings) → PPC — TNT → Social → Voice & outbound.

**Suggested grouping (information architecture)** — keep visual lane colors (`growth` / `ppc` / `social` / `voice`) but tighten **mental models** inside Growth OS:

| Group (subheading in drawer) | Routes | Rationale |
|------------------------------|--------|-----------|
| **Acquire & listen** | Listen, Target, Engage | Top-of-funnel intake and audiences |
| **Produce & distribute** | Convert, Publish, Report, Briefings | Content and reporting loops |
| **Brand & partnerships** | Brand kit, Brand wizard, Influencers, Affiliates, Marketplace | Asset and partner surfaces |

PPC agents and Social remain under existing headings; Voice & outbound unchanged.

**Scroll affordances (drawer):**

- Sticky **section headers** while scrolling the nav list (or subtle divider + persistent “Growth OS” label) so users never lose which lane they are in mid-scroll.
- Optional **collapse per group** (accordion) on `lg` hidden only — reduces scroll length; default expanded for Acquire + Produce, collapsed for Brand & partnerships if usage analytics support it later.
- **“Back to top of menu”** control or pull of first group (Mission + mode toggle) kept visible — today logo + Sales/Guard toggle are above the scroll region; ensure the scrollable `nav` never obscures mode switching visually on short viewports (verify min-height).

**Optional future — P2 bottom shortcuts (top 3 routes only):** Consider a fixed or scroll-linked **bottom bar** with exactly three destinations, for example **Mission Control (`/`)**, **Listen (`/listen`)**, **Campaigns (`/campaigns`)** — aligned to Mission Control hero CTAs and daily workflows. **Do not** mirror the full Growth OS list in the bar. Gate behind product validation (overlap with drawer, safe-area padding, and Guard mode behavior).

---

## 3. Breakpoint strategy (Tailwind defaults)

Tailwind v3 defaults: **sm 640px**, **md 768px**, **lg 1024px**, **xl 1280px**. Align work as follows:

- **`default`–`sm` (phones, small):** Single-column stacks; prioritize tap targets and safe areas; consider showing a compact **page title** or breadcrumb in main content if header stays minimal.
- **`sm`–`md`:** Two-column grids where already defined (e.g. `sm:grid-cols-2` in pulse cards, checklist); header may show more metadata (`sm:block` workspace label, `sm:flex` page title row).
- **`md`–`lg`:** Tablet: main padding `md:px-8`, more header density (`md:flex` usage widget); charts/graphs remain readable; drawer still overlay until `lg`.
- **`lg+`:** Persistent sidebar (no hamburger for primary nav); multi-column Mission Control regions (`lg:grid-cols-*`) as today.

**Consistency pass:** Audit pages outside Mission Control for hard-coded widths, horizontal scroll, and tables — this plan focuses on shared shell + home dashboard but **P1** should include route spot-checks.

---

## 4. Touch targets, spacing, and safe areas

- **Minimum interactive size:** Aim for **44×44 CSS pixels** (Apple HIG / WCAG 2.5.5 advisory) for header icon buttons, drawer links, and overlay close. Today: hamburger `p-2` + 20px icon ≈ 36px; bump to `min-h-11 min-w-11` (or `p-3`) with centered icon where needed. Drawer `Link` rows: ensure total row height ≥ 44px (`py-3` or explicit `min-h-[44px]` with vertical centering).
- **Spacing:** Preserve `gap-*` in flex/grid CTAs on Mission Control; avoid reducing vertical rhythm on mobile — long pages need clear section separation (`space-y-8` is good baseline).
- **Safe areas:** Apply padding to:
  - **Shell / main:** e.g. `padding-left/right: max(1rem, env(safe-area-inset-*))` on `main` or wrapper (Tailwind: arbitrary values or plugin).
  - **Fixed drawer and header:** `padding-top` / `padding-bottom` using `env(safe-area-inset-top|bottom)` so logo, Sales/Guard toggle, and bottom “Agents” block clear the home indicator.
  - **Full-screen overlay:** Insets matter less for the dim layer; focus on **drawer** + **header** first.

---

## 5. Prioritized backlog

### P0 — Must ship for credible mobile UX

| Item | Acceptance criteria |
|------|---------------------|
| Touch-friendly header controls | All primary header actions (menu, notifications, user menu when open, critical links) meet ≥ **44×44px** hit area; verified on iOS Safari + Chrome Android. |
| Safe-area padding | No persistent UI clipped by notch or home bar on iPhone-class devices; visual QA on simulator/device screenshots. |
| Drawer accessibility (baseline) | When open: focus moves into drawer; **Escape** closes; **focus returns** to menu button on close; overlay documents `aria-hidden` or inert main content where appropriate; `aria-expanded` on menu button synced with state. |

### P1 — High impact follow-through

| Item | Acceptance criteria |
|------|---------------------|
| Mobile page context | User can identify current route without opening drawer: either restore **page title** below `sm` in header or add a **single-line title** in `main` for key routes; no duplicate H1 misuse — one clear primary heading per view. |
| Growth OS drawer IA | Growth OS subsection headings (or accordion) shipped per §2; scroll length reduced or easier to scan; no broken `Link` behavior. |
| Nested interactive audit | Fix patterns like link-within-card where focus order confuses screen readers (e.g. “Pipeline brain” card in `ZeusGrowthPulse`); one tab stop per logical action or role/label corrected. |
| Dropdowns / touch | Notification and user panels: dismiss on outside **tap** (not only `mousedown`), scroll containment inside panel, and max-height respects small viewports. |

### P2 — Optional / validate first

| Item | Acceptance criteria |
|------|---------------------|
| Bottom nav (3 routes) | Only Mission Control, Listen, Campaigns (or product-chosen trio); respects safe area; hidden or adapted in Guard mode; does not duplicate full IA. |
| Drawer search / recents | Query filters Growth OS + voice labels; recent routes persisted locally; keyboard navigable. |
| Performance / motion | Reduce layout thrash on drawer open; `prefers-reduced-motion` respected for slide transitions. |

---

## 6. Accessibility — focus order and ARIA

**Focus order (drawer open, ideal):**

1. Optional **close** control (or first focus on first nav link if close is only via overlay/Escape — document choice).
2. **Sales / Guard** mode toggle (if policy is settings-before-nav; otherwise after primary nav — pick one order and keep consistent).
3. **Mission** link, then grouped nav links top-to-bottom matching visual order.
4. **Agents** footer (decorative-only list should use `aria-hidden` on dots if not actionable).

**Patterns:**

- Menu button: `aria-expanded={open}`, `aria-controls="zeus-mobile-nav"` (id on `<nav>`), `aria-label="Open menu"` / `"Close menu"` if toggling same button (today close is separate; **recommend** single toggle for clarity).
- Drawer: `role="dialog"` **or** `role="navigation"` with modal behavior — if trapping focus, prefer `dialog` + `aria-modal="true"` + `aria-labelledby` pointing at “Zeus / Growth OS” heading.
- Overlay: `aria-hidden="true"` when drawer closed; when open, ensure main landmark is not tab-reachable until close (inert attribute where supported).
- **Announcements:** Route changes already close drawer; pair with predictable title updates for SR users.

---

*Document version: plan only — no implementation in this change set.*
