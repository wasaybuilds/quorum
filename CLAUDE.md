@AGENTS.md

# QUORUM - Fathom Rebuild

## Project
- **Name:** Quorum
- **Path:** Desktop/GitHub/quorum
- **GitHub:** https://github.com/wasaybuilds/quorum
- **Deadline:** 24 hours from start
- **Deployment:** Railway (personal account, not the HOF workspaces) — https://quorum-production-91b5.up.railway.app

## Product Vision
AI meeting intelligence workspace. Transform conversations into summaries, decisions, action items, searchable archive, and Ask AI interface.

## P0 Features (MUST SHIP)
- Dashboard (recent meetings, stats)
- Meetings list (searchable, filterable)
- Meeting detail page (showcase - make it excellent)
  - Header, participants, date, duration
  - AI summary (executive, key points, decisions, concerns)
  - Action items table
  - Transcript with timestamps (clickable)
  - Ask AI sidebar
- AI summary generation (Anthropic API)
- Ask AI (current meeting + multi-meeting queries)
- Global search (Cmd/Ctrl+K)
- Responsive design (mobile, tablet, desktop)

## P1 Features (IF TIME)
- Timestamp interactions (click → highlight + scroll)
- Loading skeletons
- Error states
- Highlights system

## P2 Features (SKIP)
- Real recording bot
- Video playback
- Real calendar integration
- User authentication

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + Motion + Lucide
- Anthropic API (server-side, `@anthropic-ai/sdk`)
- Mock meeting data (5-10 realistic meetings)

## AI Architecture
- Server-side only (never expose API key)
- 3 endpoints: analyze-meeting, ask-meeting, ask-multi-meeting
- Real Anthropic API + realistic fallback data

## Current Status
- [x] Agent capture hooks working
- [x] GitHub repo created
- [x] Next.js scaffolded
- [x] Dependencies installed
- [x] Mock data created (8 meetings, `lib/data/meetings/*.ts`)
- [x] Dashboard built
- [x] Meetings list built
- [x] Meeting detail built
- [x] AI integration complete (3 routes + offline fallback)
- [x] Search implemented (Cmd/Ctrl+K palette + /search page)
- [x] Polish + responsive (browser QA at 375 / 768 / 1440, no overflow, no console errors)
- [x] Production build verified
- [x] Deployed to Railway: https://quorum-production-91b5.up.railway.app (project `quorum`, auto-deploys from `main`)
- [ ] ANTHROPIC_API_KEY set on Railway (until then the live site serves offline answers)
- [ ] Loom walkthrough

## Where things live
- Types: `lib/types.ts`. Seed library + calendar stub + stats: `lib/data/meetings.ts`.
- AI: `lib/ai/client.ts` (single `generateStructured` helper), `lib/ai/prompts.ts` (Zod schemas + system prompts), `lib/ai/fallback.ts` (offline answers).
- Search + keyword ranking (shared by UI search and the fallback): `lib/utils/search.ts`.
- Meeting detail orchestration (seek state, tabs, bottom sheet): `components/meeting-detail/MeetingDetail.tsx`.

## Decisions Log
- Next.js 16.3 scaffolded via create-next-app into a temp dir, then copied in (repo was non-empty).
- `.env.local` holds `ANTHROPIC_API_KEY`; without a key (or with the placeholder) every AI route serves the offline fallback, labelled "Offline answer" in the UI.
- Fictional host company **Lattice Labs** (sells a RevOps platform). Sales/CS/internal meetings share customers and recurring themes (security review, Salesforce sync duplicates, per-seat price, Q4 timelines, CTO/CFO sign-off) so cross-meeting questions have real answers.
- Dates are ISO strings in Pacific time and always formatted in `America/Los_Angeles` to keep SSR and client output identical.
- AI routes take ids and load meetings server-side (smaller payloads, client can't inject transcripts); analyze-meeting also accepts a raw transcript.
- Citations: transcript sent with `[L<n>]` line labels; model returns line numbers via structured output; server maps them to real entries. No free-text quotes.
- Model call: `client.beta.messages.parse` + Zod output format, server-side refusal fallback beta (`fallbacks: "default"`), retried without the beta on a 400. Any failure → null → fallback.
- Meeting detail: xl+ gets a sticky right rail with Transcript / Ask AI tabs; below xl the transcript is inline and Ask AI opens as a bottom sheet (side sheet on tablet). Chat state is lifted so both surfaces share it.
- `?t=<seconds>` on a meeting URL scrolls + highlights that line (used by search results and cited sources); arbitrary values snap to the line being spoken.
- Ctrl/Cmd+F on a meeting page focuses transcript search first; a second press falls through to the browser's find.

## Design system (v2)
- Tokens live in `app/globals.css` (`:root` + `@theme inline`); shared class strings (buttons, inputs, cards, container) in `lib/ui.ts`.
- Inter (400–700) + JetBrains Mono (timestamps, counts). Type scale utilities: `text-h1/h2/h3/body/small/label/stamp`. Body colour token is `copy` (not `body`, which is the 14px size).
- Accent: `#0D9488` for non-text accents (borders, focus ring, icons, 32px stat figures). Text links and primary buttons use `#0F766E` (hover `#115E59`) because white-on-#0D9488 and #0D9488-on-white are ~3.7:1 and fail WCAG AA at 14px.
- One accent only: avatars are neutral grey; meeting type is shown by a small dot on a neutral badge and a 4px left border on list rows (teal / green / amber / blue).
- Radius ≤ 8px, shadow only `0 1px 2px rgba(0,0,0,.05)`, no scale transforms, 150ms colour transitions, page fade-in 200ms, sheets/modals fade + scale 300ms.
- Meeting detail: xl+ is 60/40 (header, talk-time bar, transcript left; sticky sidebar tabs Summary / Action items / Ask AI right). Below xl the sidebar collapses into a tab bar (Summary / Action items / Transcript) and Ask AI is a 60dvh bottom sheet. Deviation from "stack everything" so the summary isn't buried under a 60-line transcript on phones.
- "This week" and "overdue" are computed against `DEMO_TODAY` (Sep 25, 2026) in `lib/data/meetings.ts` so static pages stay stable over time.

## Commit Rules
- NEVER mention "Claude" in commits, README, or code
- Commit `.agent-logs/` as you go, not in lump
- Professional messages: `feat: build X`, `fix: improve Y`, `chore: setup Z`
