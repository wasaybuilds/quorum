@AGENTS.md

# QUORUM - Fathom Rebuild

## Project
- **Name:** Quorum
- **Path:** Desktop/GitHub/quorum
- **GitHub:** https://github.com/wasaybuilds/quorum
- **Deadline:** 24 hours from start
- **Deployment:** Railway

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
- [ ] Mock data created
- [ ] Dashboard built
- [ ] Meetings list built
- [ ] Meeting detail built
- [ ] AI integration complete
- [ ] Search implemented
- [ ] Polish + responsive
- [ ] Production build verified
- [ ] Deployed to Railway

## Decisions Log
- Next.js 16.3 scaffolded via create-next-app into a temp dir, then copied in (repo was non-empty).
- `.env.local` holds `ANTHROPIC_API_KEY`; without a key every AI route returns fallback data.

## Commit Rules
- NEVER mention "Claude" in commits, README, or code
- Commit `.agent-logs/` as you go, not in lump
- Professional messages: `feat: build X`, `fix: improve Y`, `chore: setup Z`
