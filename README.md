# Zendesk Support — Agent Dashboard Prototype

An agent dashboard for Zendesk Support, surfaced as a new section in the Views
subnav (a peer to "Your tickets"). It gives an agent a high-level view of
**upcoming urgent work** (SLA at-risk / breached) and their own **performance
stats** so they can see how they're doing.

Built with the Flora design system (`@zendesk-ui/react-components`) and Zendesk-UI
Global navigation (`@zendesk-ui/navigation`).

## What's in it

The dashboard is a new section in the Support **Views** subnav (a peer to "Your
tickets"). The top of the page is the agent's current state; below it is the
time-scoped Performance section.

**Current state** (top — no section header; leads with a KPI strip)
- **Workload KPIs** — Open assigned, Overdue, Due today, On-hold, Unassigned
  (each with a delta vs yesterday + sparkline)
- **Recently updated** tickets — list, newest first
- **SLA at risk** — breached first, then about-to-breach, with SLA timers
- **Aging tickets** — open with no update 3+ days
- **Workload breakdown** — unassigned tickets by group (bar), priority by issue
  type (heatmap), ticket volume by channel (bar), tickets by form (bar), ticket
  status mix (stacked bar + legend)

**Performance** (scoped by a Today / Last 7 days / Last 30 days filter)
- KPI tiles: CSAT, SLA hit rate, Reopening rate, Tickets touched (with deltas + sparklines)
- Avg handle time **by channel** and First response time **by channel** — broken
  out per channel because times vary starkly across channels
- **Tickets touched vs solved** trend (two-series line with shared axis + legend)

All charts have a "View as table" toggle (the accessible table-view twin) and use
Flora semantic colors via `getColor` (light/dark aware, no hardcoded hex).

## Setup

1. Install dependencies (requires jFrog Artifactory auth for `@zendesk-ui/*` —
   see `/prototype:init`):
   ```bash
   npm install --legacy-peer-deps
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

## Testing

Playwright is configured (`playwright.config.ts`). Install the browser binaries
once, then run:
```bash
npx playwright install
npm run test
```

## Tech Stack

- React 18, TypeScript, Vite
- Flora design system (`@zendesk-ui/react-components`)
- Zendesk-UI Navigation (`@zendesk-ui/navigation`, `@zendesk-ui/product-tray`)
- styled-components v6
- Playwright

## Structure

- `src/components/GlobalNav.tsx` — Product / Header / Nav / Subnav / Main shell
- `src/pages/AgentDashboard.tsx` — the three-section dashboard + performance date-range filter
- `src/components/TicketList.tsx` — reusable ticket table (recent / SLA / aging variants)
- `src/components/StatTile.tsx` — KPI stat tile (value, delta, sparkline)
- `src/components/Badge.tsx` — tone-based status/priority pill
- `src/components/charts/ChartCard.tsx` — shared chart chrome (title + table-view toggle)
- `src/components/charts/BarChart.tsx` — horizontal bar chart
- `src/components/charts/Heatmap.tsx` — priority × issue-type heatmap
- `src/components/charts/StackedBar.tsx` — status-mix part-to-whole bar
- `src/components/charts/LineChart.tsx` — line + area chart with crosshair tooltip
- `src/components/charts/Sparkline.tsx` — stat-tile sparkline
- `src/data/mockData.ts` — mock tickets, series, and KPIs
