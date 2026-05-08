# Growth coach / Defense assistant — improvement backlog

Prioritized ideas beyond the current stub UI (mock replies, no backend). Pick by product phase.

**Done in app (scaffold / partial):** 2 mode pill, 3 Guard CTA + `?q=`, 4 session-memory hint, 5 export MD, 13 typing stub, 14 regenerate, 19 thread title, 21 `/` + `Esc`, 22 breadcrumb, 27 `aria-live`, 28 contrast tweaks (`zinc-*`), 29 session draft, 30 idempotent `q` via `Set`, 33–34 `trackZeus` events, 35 strings in `i18n/chatStrings.ts`, Playwright `e2e/chat.spec.ts`, **`e2e/wrong-assistant.spec.ts` + `e2e/relay.spec.ts`**, Guard stub grounded in `guardStats` + call log (`guardTelemetry.ts`), GitHub Actions `zeus-web-ci.yml`, mock API `scripts/mock-zeus-api.mjs` + `RELAY_AND_CHAT_API.md`. Still open: real LLM/RAG, Guard live telemetry API, rate limits, audit log, voice, files, mobile shortcut tab, full i18n locales.

---

## Product & onboarding

1. **First-visit coach tooltip** — One-time spotlight on Mission Control assistant + sidebar Growth coach label.
2. **Mode pill in chat header** — Live badge “Sales” / “Guard” next to the page title (mirrors sidebar).
3. **Deep link from Guard dashboard** — “Open Defense assistant” on `/guard` with `?q=` preset.
4. **Session memory banner** — “You have 2 threads” if we add multi-conversation later; until then “Conversation clears when you switch Sales/Guard”.
5. **Export transcript** — Copy all / Markdown for Slack handoff.
6. **Role-based defaults** — AE vs SDR prompt packs (different `growthCoachPrompts` sets).

## Backend & intelligence

7. **Wire to real LLM** — Replace canned bot replies with API route + streaming tokens.
8. **Workspace + PAT context** — Inject Airtable snapshot / allowed brands into system prompt (no secrets in client).
9. **Tool calls** — Allow coach to “pull pipeline summary” via internal API stubs.
10. **Guard telemetry** — Defense assistant answers from real stats table instead of static copy.
11. **Rate limits** — Per-plan token caps aligned with `usage` in `operations.ts`.
12. **Audit log** — Store prompts/responses for regulated industries (config-gated).

## UX & chat patterns

13. **Streaming responses** — Typing indicator + partial text for long drafts.
14. **Regenerate** — Per assistant message: “Try again” / tone variants.
15. **Edit last user message** — Standard chat affordance.
16. **File / paste** — Drop deck or email thread for context (with size limits).
17. **Voice input** — Web Speech API or mobile native.
18. **Inline citations** — When RAG is added, link to doc chunks.
19. **Thread title** — Auto-rename from first user message.
20. **Empty state art** — Light illustration for zero messages after clear.

## Navigation & IA

21. **Keyboard** — `/` focus input, `Esc` close suggestion grid (when added).
22. **Breadcrumb** — Mission → Growth coach on chat page for orientation.
23. **Duplicate entry removal audit** — Ensure no third path to chat without “Growth coach” naming.
24. **Mobile bottom shortcut** — Optional P2: Mission + Listen + Coach (from mobile UX plan).

## Accessibility

25. **Drawer + chat** — When chat is primary task, optional full-bleed layout on mobile.
26. **Focus trap** — Modals only; chat stays in document flow (already).
27. **Live region** — Announce new assistant messages for screen readers.
28. **Contrast pass** — `#888` on glass panels vs WCAG AA for small text.

## Technical

29. **Persist draft input** — `sessionStorage` so refresh doesn’t wipe textarea.
30. **Idempotent URL seed** — Hash `q` with message id to avoid duplicate sends if user hits back/forward.
31. **React Query / SWR** — If chat history is fetched from API later.
32. **E2E** — Playwright: switch Wrong assistant → expect welcome + banner dismiss.

## Analytics

33. **Events** — `assistant_mode_switch`, `prompt_chip_click`, `wrong_assistant_click` (privacy-safe).
34. **Funnel** — Mission assistant chip → full chat completion rate.

## Internationalization

35. **i18n** — Extract strings; RTL check for header.

---

*Companion UX docs: `ZEUS_MOBILE_UX_PLAN.md`, `ZEUS_MOBILE_VISUAL_AUDIT.md`.*
