# Frozen snapshot — Siren UI (style backup)

This folder is a **point-in-time copy** of the **Siren** web UI so the CoFounder × Railway aesthetic is never lost from this repo, even if `siren-web` moves on.

| Field | Value |
|-------|--------|
| **Source repo** | `https://github.com/OliWoods-Org/siren-web` |
| **Branch** | `feature/saas-mission-script-marketplace` |
| **Commit (frozen)** | `8a668f83b861df2c1f6de76560cd6699a929f9f8` |
| **Captured** | 2026-05-02 |

## Contents

- Full `src/` tree (components, pages, data)
- `tailwind.config.js`, `postcss.config.js`, `vite.config.ts`
- `package.json`, lockfile, `index.html`, TypeScript configs
- `public/` if present

## Restore elsewhere

```bash
cp -R snapshots/siren-ui-reference/src ./your-app/src
cp snapshots/siren-ui-reference/tailwind.config.js ./your-app/
# …etc.
```

## Better fidelity backup (optional)

From a clone of `siren-web` at the commit above:

```bash
git archive --format=tar HEAD src tailwind.config.js postcss.config.js vite.config.ts package.json index.html | gzip > ~/Desktop/siren-ui-snapshot.tgz
```

## Active Zeus UI

The shipping app that **reuses this style** with **Zeus branding** lives in **[`apps/zeus-web`](../../apps/zeus-web/README.md)** — fork/theme from this snapshot, not from live Siren day-to-day.
