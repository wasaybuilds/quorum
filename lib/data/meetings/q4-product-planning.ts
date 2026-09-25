import type { Meeting } from "@/lib/types";

export const q4ProductPlanning: Meeting = {
  id: "q4-product-planning",
  title: "Q4 Roadmap Planning",
  company: "Lattice Labs",
  type: "internal",
  date: "2026-09-21T09:30:00-07:00",
  duration: 90,
  platform: "Zoom",
  participants: [
    { name: "Jordan Blake", role: "Head of Product", email: "jordan@latticelabs.io" },
    { name: "Aisha Rahman", role: "Product Manager", email: "aisha@latticelabs.io" },
    { name: "Hannah Kim", role: "Product Designer", email: "hannah@latticelabs.io" },
    { name: "Arslan", role: "Engineering Lead", email: "arslan@latticelabs.io" },
    { name: "Leo Martins", role: "Frontend Engineer", email: "leo@latticelabs.io" },
    { name: "Ghulam Mustafa", role: "Backend Engineer", email: "ghulam@latticelabs.io" },
  ],
  transcript: [
    {
      speaker: "Jordan Blake",
      timestamp: 11,
      text: "Morning, everyone. Let's give it thirty seconds, Ghulam's still... oh, there he is.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 19,
      text: "Sorry, sorry, the incident follow-up standup ran over. I'm here.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 27,
      text: "No worries. So the goal for today is simple to say and hard to do. Leave with a Q4 roadmap we actually believe, three priorities max, with owners. And we're going to be honest about capacity, because last quarter we committed to five things and shipped two and a half.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 58,
      text: "Can I start with what I'm hearing from the field? It frames everything. I did calls with Sarah, Marcus and Emma last week. Four themes. One, Globex. 350 seats, in proposal, and they need SSO and SCIM on Entra ID plus a Snowflake export, and Marcus wants their security review closed by mid-November so they can sign before Thanksgiving. Two, every prospect asks about Salesforce sync reliability and duplicate records. After last Monday that's not hypothetical anymore, Brightline's renewal is shaky partly because of it. Three, security reviews are slowing deals, Acme's pilot starts October 5th and their security team is already sending questions. And four, Northwind is expanding into EMEA and keeps asking for better bulk API docs.",
    },
    {
      speaker: "Arslan",
      timestamp: 236,
      text: "Before we go further, can I put the capacity number on the table? Because it shapes everything. So, the Postgres 16 migration takes two engineers through October: Abdullah full-time and Ghulam about half, and Ghulam's other half is going to the sync idempotency fix after last week. After on-call, holidays and the usual support escalations, I get about 38 engineer-weeks of feature capacity for the whole quarter. That's the real number. Not the headcount times thirteen weeks.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 334,
      text: "Okay. Thirty-eight weeks. Aisha, walk us through the candidates with rough sizes.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 342,
      text: "Five candidates. AI-powered pipeline search, about 16 engineer-weeks. SCIM hardening for Entra and GA, about 8. The legacy admin panel rewrite, 14 to 18. Snowflake export, around 6. And the bulk API docs, which is mostly docs work, maybe 2 weeks of eng review. So that's roughly 46 to 50 against 38.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 431,
      text: "Which already doesn't fit.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 446,
      text: "Let's start with AI search, since, I'll be honest, I'm biased toward it. Aisha, make the case and then everyone poke holes.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 458,
      text: "So the data. Reps and managers use saved filters about three times more than dashboards, but building a filter is five clicks deep. And 41% of queries in our current search return zero results, because it's exact match on record names. The idea: you type something like deals over 50k in EMEA that slipped this quarter, and we turn that into real structured filters and return the records. It's a differentiated feature in every demo, and Sarah says it's the thing prospects light up at when she shows the prototype.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 581,
      text: "From the design side, the thing I care about is trust. If someone types a question and gets back 212 deals, they need to see how we interpreted it. So I want the parsed query shown as editable filter chips right under the search bar. Amount greater than 50k, region EMEA, close date moved. And they can click a chip and fix it if we got it wrong.",
    },
    {
      speaker: "Leo Martins",
      timestamp: 648,
      text: "That works nicely with the command palette we already have. I can reuse the chip component from the filters panel, it just needs a loading state. I'd want results to stream in, though, so it doesn't feel like a spinner for two seconds.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 701,
      text: "Backend-wise it's two pieces. The query translation, text into our filter DSL, is the easier part, and we can validate the output against the schema so it can never produce a filter that doesn't exist. The harder part is semantic matching on notes and call summaries. That needs embeddings and a vector index, and I really don't want to build that on Postgres 13 and then migrate it.",
    },
    {
      speaker: "Arslan",
      timestamp: 783,
      text: "Right, so the embeddings part can't really start until after the cutover, which Abdullah's targeting for late October. The filter translation can start now.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 804,
      text: "Here's my worry, and it's scope creep. The moment we put a text box in the product, people are going to type why did the Globex deal slip, and expect an answer. Then it's summaries, then it's forecasts, then we're building a whole different product.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 842,
      text: "Totally, and I want the PRD to draw that line hard. V1 is search and filter only. It returns records, never a generated narrative. If the query can't be turned into filters, we say so and suggest the closest filters instead.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 910,
      text: "And the empty state has to teach that. Example queries that are clearly find-me-deals shaped, not ask-me-anything shaped.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 952,
      text: "Okay, I'm hearing broad support. Is anyone actually against making it the Q4 headline?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 963,
      text: "Not against. Just, 16 weeks has big error bars. The translation layer I trust. The semantic part I've never built at our data size, so I'd call it 16 plus or minus 4.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 1010,
      text: "Noted, and fair. Decision: AI-powered pipeline search is our Q4 priority. Target is a beta with design partners by mid-December.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 1044,
      text: "I'll write the PRD, with the scope boundaries up front. I want it done before design reviews start, so October 2nd.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 1128,
      text: "Great. SCIM. Arslan, how real is our SCIM today? Because Sales talks about it like it's done.",
    },
    {
      speaker: "Arslan",
      timestamp: 1139,
      text: "It's... half real. SAML SSO is solid, Okta, Entra and Google all work. SCIM exists, but it's a beta we've only really tested with Okta. Entra's SCIM client behaves differently, it sends PATCH operations in a format we don't fully handle, and group push is flaky. And Globex needs deprovisioning within the hour, audited. We can do it, but it's not something I'd put in front of their security team today.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 1248,
      text: "And Sarah already told them it's included on Enterprise. Which it is, technically.",
    },
    {
      speaker: "Arslan",
      timestamp: 1257,
      text: "Technically, yes. So if the review closes mid-November, I'd say SCIM GA, with Entra fully supported, by November 13th. Tight but doable if it's staffed now, meaning Leo on the settings UI plus one backend engineer.",
    },
    {
      speaker: "Leo Martins",
      timestamp: 1301,
      text: "Where does the settings UI live, though? Today SCIM tokens and attribute mapping are in the legacy admin panel.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 1312,
      text: "Please, please don't build new things in the legacy admin.",
    },
    {
      speaker: "Leo Martins",
      timestamp: 1318,
      text: "Yeah, agreed. I'd build it in the new settings area in the Next.js app. It's maybe a week more, but it's where everything's going anyway.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 1352,
      text: "Do it in the new app. Okay, decision: we ship SCIM, Entra included, by mid-November, November 13th, because of Globex. Arslan, you own staffing it.",
    },
    {
      speaker: "Arslan",
      timestamp: 1381,
      text: "Yep. I'll reserve the capacity this week and post the staffing plan for SCIM and AI search, so it's not just in my head.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 1511,
      text: "Okay, the admin panel. Hannah, I know this one's yours.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 1519,
      text: "It is. So, the legacy admin is still the old Express and Handlebars app. It has three different button styles, two date pickers, and none of it matches the product. Support uses it all day, and they told me about a third of their tickets take longer than they should because of it. Every time we add a setting there, it's new design debt. I've been deferring it for three quarters.",
    },
    {
      speaker: "Leo Martins",
      timestamp: 1638,
      text: "And from the engineering side, it's got basically no tests. A rewrite is 14 to 18 weeks, and I'd lean toward the top of that.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 1680,
      text: "I'm going to be honest, Hannah. It doesn't fit. Search is 16, SCIM is 8 or 9, and Arslan still needs a buffer. I want to defer the admin panel rewrite to Q1.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 1728,
      text: "I get the math, I'm just frustrated. Every quarter we defer it, the gap between the admin and the product gets wider, and I end up designing things twice. That's the design debt concern, and I want it written down.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 1807,
      text: "What if Q4 is prep instead of nothing? Hannah does a component audit and inventory of the admin this quarter, so the Q1 rewrite starts on day one with designs, not a blank page.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 1846,
      text: "If it's a real Q1 commitment and not a we'll see, I can live with that. I'll do the audit.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 1869,
      text: "It's real. I'll put it in the roadmap doc as Q1 committed, not candidate. Decision: the legacy admin panel rewrite is deferred to Q1, with the audit in Q4.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 2080,
      text: "Next, Snowflake export. Globex asked for it, and a couple of other enterprise prospects have mentioned it too.",
    },
    {
      speaker: "Arslan",
      timestamp: 2097,
      text: "The good news is /v2/reports already does async exports, so writing to a Snowflake stage is mostly plumbing on top. Four to six weeks. But it doesn't fit alongside SCIM and search unless something gives.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 2162,
      text: "Let's not commit it today. Aisha, can you check with Marcus whether it's a contract blocker for Globex or a nice-to-have? If it's a blocker, we come back to this.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 2470,
      text: "Can I raise sync reliability? I know idempotency is engineering-driven, but every one of Aisha's four themes touches it. I'd like it on the roadmap as a real line item, not hidden under tech debt, so Sales can point at it.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 2530,
      text: "Agreed. Reliability is a sales feature right now. Put it on the roadmap as sync reliability, idempotent writes, with your October date.",
    },
    {
      speaker: "Arslan",
      timestamp: 2840,
      text: "So let me reconcile the math. AI search 16, SCIM about 9 with the new settings page, and that leaves around 13 weeks. I want most of that held as buffer for escalations. After last week, and with Brightline and Acme both in play, I'd really rather not spend it upfront.",
    },
    {
      speaker: "Leo Martins",
      timestamp: 2915,
      text: "Is anyone staffing the bulk API docs for Northwind? That keeps coming up in the CS channel.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 2930,
      text: "That's mostly writing. Priya's offered to draft it, I'll review, and engineering just sanity-checks the examples. It shouldn't touch the 38.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 3240,
      text: "For design reviews, I want two for AI search, one on the search and chips interaction and one on results and empty states, plus one for the SCIM settings page. I'll get them on calendars.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 3278,
      text: "Good. First AI search review right after the PRD lands, so the week of October 5th.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 3560,
      text: "Who are the design partners for the search beta? I'd suggest Northwind, they're heavy filter users, and maybe two or three mid-market accounts.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 3599,
      text: "Northwind yes. Not Brightline, they need stability from us right now, not betas. And not Acme, let the pilot be about the core product.",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 3900,
      text: "Success metrics for the beta, so we know if it's working: 30% of weekly active users running a search each week, and the zero-result rate under 10%, down from 41.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 3954,
      text: "I'd add query translation accuracy. Sample a hundred queries a week and check if the chips match what the person meant.",
    },
    {
      speaker: "Arslan",
      timestamp: 4270,
      text: "One risk I want to name. If the Postgres migration slips, the semantic part of search slips with it. Our fallback should be shipping the filter translation first, without notes search, so the December beta still happens.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 4315,
      text: "Good, put that in the PRD as the fallback plan, Aisha. I'll walk Marcus and Sarah through the roadmap on Thursday, so they stop promising things we haven't planned.",
    },
    {
      speaker: "Leo Martins",
      timestamp: 4620,
      text: "For the SCIM work, can we get a test Entra tenant set up? I don't want to find out about the PATCH quirks from Globex's security team.",
    },
    {
      speaker: "Arslan",
      timestamp: 4648,
      text: "Yes, I'll get one provisioned this week. It's going in the staffing plan so it doesn't get lost.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 4960,
      text: "Okay, let me wrap. Decisions: AI-powered pipeline search is the Q4 priority, beta by mid-December. SCIM with Entra ships by November 13th for Globex. Legacy admin rewrite is deferred to Q1, with Hannah's audit this quarter. Concerns: scope creep on search, engineering availability with two people on the migration, and design debt from deferring the admin.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 5030,
      text: "Actions: Aisha updates the roadmap doc and writes the search PRD by October 2nd. Hannah schedules the design reviews. Arslan reserves capacity and posts the staffing plan. Anything I missed?",
    },
    {
      speaker: "Aisha Rahman",
      timestamp: 5068,
      text: "Just that I'll have the roadmap doc updated by end of day tomorrow and I'll share it in #product.",
    },
    {
      speaker: "Hannah Kim",
      timestamp: 5091,
      text: "And the component audit, I'll aim for end of October.",
    },
    {
      speaker: "Jordan Blake",
      timestamp: 5244,
      text: "Perfect. Thanks, all. This is the first planning session in a while where the plan actually fits.",
    },
  ],
  summary: {
    executive_summary:
      "Product and engineering set the Q4 roadmap against a realistic 38 engineer-weeks of feature capacity, since two engineers are committed to the Postgres migration and the sync fix. AI-powered pipeline search is the Q4 priority, targeting a design-partner beta by mid-December. SCIM with Entra ID support will reach GA by November 13th for the Globex deal, and the legacy admin panel rewrite moves to Q1.",
    key_points: [
      "Field themes: the Globex deal (350 seats; needs SSO/SCIM on Entra and a Snowflake export), Salesforce sync reliability after last week's incident, security reviews slowing deals, and Northwind's request for bulk API docs.",
      "The candidates total 46 to 50 engineer-weeks against 38 available: AI search (16), SCIM (8 to 9), admin rewrite (14 to 18), Snowflake export (4 to 6) and API docs (about 2).",
      "AI search v1 turns natural-language queries into editable filter chips and returns records only, never generated answers. Semantic notes search waits for the Postgres 16 cutover.",
      "SCIM today is a beta tested mainly with Okta. Entra PATCH handling, group push and audited deprovisioning within the hour are needed before Globex's security review.",
      "Snowflake export is on hold pending Marcus's read on whether it blocks the Globex contract. Sync reliability goes on the roadmap as a visible line item dated October 7th.",
    ],
    decisions: [
      "Make AI-powered pipeline search the Q4 priority, with a design-partner beta (Northwind, not Brightline or Acme) by mid-December.",
      "Ship SCIM with full Entra ID support by November 13th for Globex, with the settings UI built in the new Next.js app rather than the legacy admin.",
      "Defer the legacy admin panel rewrite to Q1 as a committed item, with a component audit in Q4.",
    ],
    concerns: [
      "Scope creep: a search box invites users to ask for answers, summaries and forecasts, so v1 must stay strictly search and filter.",
      "Engineering availability: the Postgres migration and sync fix take two engineers, the search estimate carries plus or minus 4 weeks, and a migration slip delays semantic search.",
      "Design debt keeps growing in the legacy admin (three button styles, no tests) while the rewrite is deferred.",
    ],
    action_items: [
      {
        task: "Update the Q4 roadmap doc with agreed priorities, the Q1 admin commitment and the sync reliability line item; share in #product",
        owner: "Aisha Rahman",
        dueDate: "Sep 22",
        status: "completed",
        priority: "high",
      },
      {
        task: "Write the AI search PRD with v1 scope boundaries, success metrics and the filter-translation-first fallback",
        owner: "Aisha Rahman",
        dueDate: "Oct 2",
        status: "pending",
        priority: "high",
      },
      {
        task: "Schedule design reviews: two for AI search (query chips, results and empty states) and one for the SCIM settings page",
        owner: "Hannah Kim",
        dueDate: "Sep 28",
        status: "pending",
        priority: "medium",
      },
      {
        task: "Reserve engineering capacity and post the staffing plan for SCIM and AI search",
        owner: "Arslan",
        dueDate: "Sep 28",
        status: "pending",
        priority: "high",
      },
      {
        task: "Complete a component audit of the legacy admin panel ahead of the Q1 rewrite",
        owner: "Hannah Kim",
        dueDate: "Oct 30",
        status: "pending",
        priority: "low",
      },
    ],
  },
  highlights: [
    { timestamp: 236, label: "38 engineer-weeks of capacity" },
    { timestamp: 1010, label: "AI search is the Q4 priority" },
    { timestamp: 1352, label: "SCIM by November 13th" },
    { timestamp: 1869, label: "Admin rewrite deferred to Q1" },
  ],
};
