# Quorum

**Meeting intelligence for revenue, customer success and engineering teams.** Quorum turns recorded calls into notes you can trust: an executive summary, the decisions that were made, the risks that were raised, who owes what by when, and a transcript you can search and jump around in. Ask a question about one meeting or your whole library and get an answer that links to the exact moment it was said.

Quorum is a rebuild of the core of [Fathom](https://fathom.video), scoped to the parts that matter after the call ends.

**Live:** https://quorum-production-91b5.up.railway.app

## What you can do

| | |
|---|---|
| **Home** | Library stats, the next meetings on your calendar with auto-record toggles, recent meetings, action items due soon and where meeting time goes. |
| **Upcoming** | Your calendar for the next two weeks. Connect Google Calendar (read-only) or use the demo calendar; set meeting preferences (auto-record external / internal) and toggle recording per meeting. |
| **Action items** | Every follow-up across meetings, filterable by status and owner, with overdue items flagged. |
| **Ask Quorum panel** | Always available on the right (desktop), like Ask Fathom: ask across all meetings or a scope, and the conversation follows you between pages. |
| **Meetings** | Filter by title, company or participant; narrow by type (Sales, Customer Success, Internal, Engineering); sort by date or length. |
| **Meeting detail** | Header with participants and platform · conversation timeline with talk-time per speaker · summary with key points, decisions and concerns (each linked to its source line) · sortable, filterable action items you can tick off · timestamped transcript with in-transcript search (`Ctrl/⌘+F`), highlights and click-to-jump. |
| **Ask AI (one meeting)** | Chat in a side panel (bottom sheet on mobile). Answers come with cited transcript lines and a confidence level; clicking a source scrolls the transcript to that line. |
| **Ask Quorum (all meetings)** | Pattern questions across the library ("What issues come up repeatedly in sales calls?"), scoped to all meetings, sales, customer success or internal. Sources open the meeting at the cited timestamp. |
| **Global search** | `Ctrl/⌘+K` (or `/`) from anywhere: meetings by title, company, participant, and every transcript line that mentions your words, with the match highlighted. Enter opens the meeting at that moment. A full results page lives at `/search?q=`. |
| **Regenerate summary** | Re-runs the notes for a meeting through the model on demand. |

The library ships with eight realistic meetings from a fictional company, **Lattice Labs**: four sales calls, two customer-success reviews, an architecture review, a roadmap planning session and an incident postmortem. The same customers and problems recur across them, so cross-meeting questions have real answers.

## Stack

- **Next.js 16** (App Router, React 19) + **TypeScript**
- **Tailwind CSS v4**, **Motion** for the few transitions that help (drawers, sheets, palette), **Lucide** icons
- **Anthropic API** via the official `@anthropic-ai/sdk`, called only from server route handlers
- No database: the seed library in [`lib/data`](lib/data) stands in for one

## Running locally

```bash
git clone https://github.com/wasaybuilds/quorum.git
cd quorum
npm install
cp .env.example .env.local   # then add your key
npm run dev                  # http://localhost:3000
```

`ANTHROPIC_API_KEY` is optional. Without it every AI feature still works using the offline fallback described below, and answers are labelled "Offline answer".

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | No | Enables live summaries and answers. Server-side only. |
| `ANTHROPIC_MODEL` | No | Overrides the default model. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Enables "Connect Google Calendar" on the Upcoming page. |
| `CALENDAR_COOKIE_SECRET` | No | Key for the encrypted calendar token cookie (defaults to one derived from the client secret). |

Production build: `npm run build && npm start` (respects `PORT`).

## How the AI works

```
Browser ──POST──▶ /api/ai/* (Next.js route handler) ──▶ Anthropic Messages API
                         │                                   │
                         │◀──── structured JSON (schema) ────┘
                         └── on any failure: grounded offline answer
```

The API key never leaves the server. All three routes use structured outputs (a Zod schema per route), so responses are always well-formed JSON.

| Route | Input | Output |
|---|---|---|
| `POST /api/ai/analyze-meeting` | `{ meetingId }` or `{ transcript, title, participants }` | `executive_summary`, `key_points`, `decisions`, `concerns`, `action_items[] { task, owner, dueDate, priority }` |
| `POST /api/ai/ask-meeting` | `{ meetingId, question, history? }` | `answer`, `sources[] { timestamp, speaker, text }`, `confidence` |
| `POST /api/ai/ask-multi-meeting` | `{ question, meetingIds?, history? }` | `answer`, `patterns[]`, `sources[] { meetingId, meetingTitle, timestamp, text }` |

**Citations are line numbers, not quotes.** The transcript is sent with a line label on every entry (`[L12] 4:31 Sarah Chen: …`) and the model returns the line numbers that support its answer. The server maps those back to real transcript entries, so a cited source can't be a paraphrase or a hallucinated quote, and every source is clickable.

**Offline fallback.** If there's no key, the request fails, or the response is unusable, the routes answer from the meeting's own data instead of showing an error. The fallback works out the intent (concerns, decisions, next steps, overview) and ranks transcript lines by keyword to find supporting sources; for cross-meeting questions it counts recurring themes (security review, Salesforce sync, pricing, timeline, sign-off) across the scoped meetings. The UI marks these answers so it's clear which is which.

## Project layout

```
app/
  page.tsx                  dashboard
  meetings/page.tsx         meetings list
  meetings/[id]/page.tsx    meeting detail (statically generated per meeting)
  ask/page.tsx              Ask Quorum across meetings
  search/page.tsx           full search results
  api/ai/*/route.ts         analyze-meeting, ask-meeting, ask-multi-meeting
components/
  layout/                   sidebar, mobile nav, page header
  dashboard/                stats, recent meetings, side panels
  meetings/                 list + card
  meeting-detail/           header, timeline, summary, action items, transcript
  ask/                      chat thread, answer renderer, source cards
  search/                   ⌘K palette, results page, highlighting
  common/                   avatar, badges, loading / empty / error states
lib/
  data/                     seed meetings + calendar stub
  ai/                       model client, prompts & schemas, offline fallback
  utils/                    formatting, search & ranking
```

## What's real and what's stubbed

**Built:** everything in "What you can do" above, responsive from 375px phones to wide desktops, with loading skeletons, empty states and error states with retry.

**Deliberately out of scope:**
- **Recording and transcription.** No bot joins calls; meetings come from the seed library.
- **Video playback.** The timeline and timestamps navigate the transcript rather than a video.
- **Calendar-driven recording.** Google Calendar connects for real (read-only), but no bot joins the meetings, and record toggles and preferences are saved in the browser only.
- **Authentication.** A single demo workspace; no login.
- **Persistence.** Ticking off an action item or regenerating a summary lasts for the session only.
- **CRM / Slack / Asana sync, clip sharing, custom summary templates, coaching metrics.**

## Google Calendar setup (optional)

1. In Google Cloud Console, enable the **Google Calendar API** and create an **OAuth client ID** of type *Web application*.
2. Add `https://<your-domain>/api/calendar/callback` (and `http://localhost:3000/api/calendar/callback` for local use) as an authorised redirect URI.
3. On the OAuth consent screen, add the `calendar.readonly` scope. While the app is in *Testing*, add each Google account that should connect as a test user; others will see Google's "unverified app" screen.
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` and restart.

Tokens are kept in an encrypted, httpOnly cookie on the user's browser; nothing is stored on the server. **Disconnect** clears it.

## Deployment

Deployed on Railway as a standard Node service: build `npm run build`, start `npm start`. Set `ANTHROPIC_API_KEY` in the service variables.
