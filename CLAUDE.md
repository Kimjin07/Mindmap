# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interactive, drillable knowledge map of the AI industry chain ("The AI Stack"): Applications → Models → Infrastructure → Chips → Energy (plus extension layers: Space, Optical, Storage, Materials). Every knowledge path ends at real companies with tickers, financials, and live quotes. The product vision, information architecture, and roadmap live in `PROJECT.md` (Chinese) — read it before making product-level decisions.

The site is Chinese-first: UI copy, data content, and code comments are written in Chinese (with English fallback fields on company data). Follow that convention; commit messages use conventional-commit prefixes with Chinese descriptions (e.g. `chore(news): 自动更新公司动态 ...`).

## Commands

```bash
npm run dev        # dev server (predev auto-runs gen:slim first)
npm run build      # production build (prebuild auto-runs gen:slim)
npm run gen:slim   # regenerate app/data/companies.slim.json from companies.json
node scripts/update_news.js   # merge curated news items into companies.json (edit its newItems array first)
```

- There is no test suite. `npm run lint` is defined but ESLint is not installed/configured, so it will prompt interactively — don't rely on it.
- `playwright-core` (devDependency) is only for local screenshot self-checks; it does not affect the build.
- Optional `.env.local` (see `.env.local.example`): `FMP_API_KEY` for Financial Modeling Prep. Live quotes work without any key (Yahoo Finance public endpoint).
- Stack: Next.js 15 App Router, React 19, TypeScript strict. No UI framework and no CSS modules — all styling is in `app/globals.css` (~2600 lines) plus inline SVG with a hand-drawn gold aesthetic (`SketchDefs.tsx` filters). Deployed on Vercel.

## Architecture

### Data layer (`app/data/`) — everything is data-driven

The rendering is driven entirely from these files; there is no hardcoded diagram content:

- **`nodes.ts`** — the industry-chain tree: `NODES` (layer → category, each with L0–L3 progressive-depth text and `companyIds`), the homepage layout `MAP`, and helpers (`getNode`, `getChildren`, `getBreadcrumb`).
- **`players.ts`** — "residents" per category (representative products/projects), the cross-product supply/drive graph `LINKS` (e.g. Copilot ← GPT ← GPU ← optical modules), and traversal helpers (`relatedTree`, `productsOfCompany`). Products resolve to companies via alias matching (`by` string → `companyIdByName`), or explicit `companyId` when matching fails.
- **`atlas.ts`** — world-map geometry: `CLUSTERS` (continent positions per layer), `LAYER_GROUPS` (city grouping inside a continent), `RELATIONS` (roads between cities), `worldLayout()`.
- **`companies.json`** (~1.8 MB) — full data for ~354 companies. **Server-only.**
- **`companies.slim.json`** (~56 KB) — **generated file, never edit by hand.** Produced by `scripts/gen-slim.mjs` from `companies.json` (name/aliases/kind/hq/website/logo only).
- **`deep.json`** — long-form knowledge cards per product. **Server-only**, served on demand by `/api/product/[id]`.

### The server/client data split (critical convention)

The 1.8 MB `companies.json` must never reach the browser bundle:

- **Server code** (RSC pages, API routes) imports `companies.ts` (`COMPANIES`, `getCompany`, alias index, `nodesForCompany`).
- **Client components** import only `companyTypes.ts` (types + pure helpers, no JSON) and `companiesClient.ts` (slim data), and fetch full records on demand from `GET /api/company/[id]`.
- `companies.ts` re-exports `companyTypes.ts`, so server code has a single import path.

When adding imports to a `"use client"` component, check you are not pulling in `companies.ts` or a JSON file transitively.

### Pages and routes

- `/` — homepage overview diagram (`Diagram.tsx`, client). Clicking a layer/icon navigates to `/map/<layer>` (categories add a `#<id>` anchor).
- `/map` and `/map/[layer]` — one shared Google-Maps-style world map (`Atlas.tsx`, ~1050-line client component: pan/zoom camera, cities, roads, "travel route" mode tracing a product's supply chain). `[layer]` only sets the initial camera focus; the anchor picks the city.
- `/company/[id]` — statically generated for all companies (`generateStaticParams` + per-company `generateMetadata`); server prefetches the quote via `lib/quote.ts` to avoid a first-paint flash, then the client polls.
- `sitemap.ts` — homepage + map + all company pages.

### API routes (`app/api/`)

All free/no-key external sources, cached via route-level `revalidate`:

- `quote/[symbol]` — Yahoo Finance chart endpoint (global markets, exchange→suffix mapping duplicated in `lib/quote.ts`); `force-dynamic`, client polls every minute.
- `company/[id]` — full company record for the map drawer (revalidate 300s).
- `news/[id]` — per-company Google News RSS, Chinese first with English fallback (revalidate 1800s); parsing and spam filtering in `lib/rss.ts`.
- `news/feed` — aggregated AI industry news with entity matching back to companies in the graph.
- `product/[id]` — deep-dive cards from `deep.json`.

### Theming

Dark/light theme via `data-theme` on `<html>`, set by an inline script in `layout.tsx` before paint (no flash) and toggled by `ThemeToggle.tsx`. All colors are CSS variables in `globals.css`.

## Common content workflows

- **Add/edit a company**: edit `app/data/companies.json` (schema in `companyTypes.ts`; optional fields auto-hide their page sections), then run `npm run gen:slim` (or rely on predev/prebuild). Logos: drop a transparent SVG/PNG named `<company-id>` into `public/logos/` and set `logo: true` (or a path string) — see `public/logos/README.md`; missing logos fall back to a text mark.
- **Add a category/node**: add to `NODES` in `nodes.ts`; place it on the world map via `LAYER_GROUPS`/`CLUSTERS` in `atlas.ts`; add its products in `players.ts` and roads in `RELATIONS`. New layers must also be added to `LAYER_IDS` (atlas.ts) and the `LAYERS` list in `app/map/[layer]/page.tsx`.
- **News updates**: `scripts/update_news.js` holds a curated `newItems` array — replace its entries, run it to dedupe/merge (keeps the 4 most recent per company), which writes `companies.json`.
