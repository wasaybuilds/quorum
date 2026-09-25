import type { Meeting } from "@/lib/types";

export const syncIncidentPostmortem: Meeting = {
  id: "sync-incident-postmortem",
  title: "Salesforce Sync Incident Postmortem",
  company: "Lattice Labs",
  type: "engineering",
  date: "2026-09-16T11:00:00-07:00",
  duration: 30,
  platform: "Google Meet",
  participants: [
    { name: "Arslan", role: "Engineering Lead", email: "arslan@latticelabs.io" },
    { name: "Abdullah Javed", role: "Platform Engineer", email: "abdullah@latticelabs.io" },
    { name: "Ghulam Mustafa", role: "Backend Engineer", email: "ghulam@latticelabs.io" },
    { name: "Emma Rodriguez", role: "Customer Success Manager", email: "emma@latticelabs.io" },
  ],
  transcript: [
    {
      speaker: "Arslan",
      timestamp: 6,
      text: "Okay, let's start. Emma said she'd be a couple of minutes late, she's finishing a call with Northwind. So this is the postmortem for Monday's sync incident. Usual rules, blameless. We're here to figure out how the system let this happen, not who pushed what. Abdullah, you were on call, can you walk us through the timeline?",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 38,
      text: "Yeah. All times Pacific. Monday the 14th, 6:04 a.m. Salesforce starts returning 429s for a handful of orgs. That lines up with the nightly sync overlapping with the field-mapping backfill we deployed Friday, the one for the new forecast category field. Both were hitting the same orgs at the same time.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 81,
      text: "And to be clear, the backfill was reviewed. Nobody expected it to still be running at six. It was sized for about two hours and it took five.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 97,
      text: "Right. So from 6:04 the worker starts retrying, and this is where it goes bad. We have two retry layers. The Salesforce client wrapper retries three times, and then the BullMQ job itself retries five times. So one failed create can be attempted fifteen times. Fixed two-second backoff, no jitter.",
    },
    {
      speaker: "Arslan",
      timestamp: 139,
      text: "Fifteen. Okay.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 146,
      text: "And most of those don't create duplicates, a 429 is a clean rejection. The duplicates come from timeouts. Under load, some creates took longer than our 30-second client timeout. Salesforce finished the insert, we'd already given up, and the retry inserted it again.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 188,
      text: "Yeah, I confirmed that in the logs yesterday. Every duplicate pair has a client timeout on the first attempt. Not a single one came from a straight 429.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 214,
      text: "Hi, sorry, sorry. Northwind ran over. Did I miss the bad part?",
    },
    {
      speaker: "Arslan",
      timestamp: 222,
      text: "You're fine, Abdullah's mid-timeline. We're at the retries.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 231,
      text: "So, first duplicates at 6:11. Between then and about 8:55 we created 2,184 duplicate opportunity records across seven tenants. Then at 9:12 a ticket comes in from Brightline, from Ethan Brooks, saying their pipeline had doubled overnight. Support escalated at 9:30 and I got paged at 9:34.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 290,
      text: "And that's the part that hurts from my side. Ethan found it before we did. He'd started building his Monday forecast deck off that data.",
    },
    {
      speaker: "Arslan",
      timestamp: 310,
      text: "Yeah. So first bad write at 6:11, first human awareness at 9:12, and it was a customer. That's a three-hour detection gap. Let's hold that, it's going to be the big concern. Abdullah, keep going.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 338,
      text: "9:48 I paused the sync worker for all tenants. 10:20 Ghulam found the double retry. 11:05 we deployed a hotfix: removed the client-level retry, switched the job retry to exponential backoff with jitter, and turned off the backfill. Then the dedupe.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 395,
      text: "The dedupe script matched on created-by being our integration user, plus same account, name, amount and close date, created inside the incident window. It kept the oldest record, re-pointed contact roles and activities onto it, then soft-deleted the copies, so they sit in the recycle bin for 15 days in case we got anything wrong.",
    },
    {
      speaker: "Arslan",
      timestamp: 458,
      text: "Did we get anything wrong?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 464,
      text: "The dry run flagged 2,191 candidates. Seven were legit, a rep at one tenant had cloned opportunities on purpose that morning, so I excluded those by hand. Final run finished at 1:15 p.m. and sync resumed at 1:30.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 512,
      text: "And Brightline was the biggest one?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 519,
      text: "Brightline had 341. The biggest was actually a smaller tenant with 610, they just have a long tail of tiny opportunities. Everyone else was under 300.",
    },
    {
      speaker: "Arslan",
      timestamp: 560,
      text: "Okay. And verification?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 566,
      text: "Yesterday I reran counts per tenant against Salesforce, the pre-incident baseline plus legit new records. All seven match. I posted the table in the incident channel.",
    },
    {
      speaker: "Arslan",
      timestamp: 612,
      text: "Great. Emma, customer side?",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 620,
      text: "So Monday evening I sent individual emails to all seven admins. What happened, what we cleaned up, the recycle bin window, and a direct line to me. Four have replied. Three were basically, fine, thanks for the heads-up. Brightline was not fine.",
    },
    {
      speaker: "Arslan",
      timestamp: 681,
      text: "Expected, honestly.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 687,
      text: "Their renewal is in about 45 days and their champion left this summer. Nora, their VP of RevOps, is on the check-in tomorrow. And Ethan told me this isn't the first time. He says they've been seeing a couple of duplicate opportunities a week for months, just small enough that they merged them by hand.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 745,
      text: "Hm. That actually fits. Same code path, just smaller. Any time a create is slow and times out, we can double-write. Monday just amplified it by, what, a thousand?",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 772,
      text: "So it's not a one-off. It's a latent bug that Monday made loud.",
    },
    {
      speaker: "Arslan",
      timestamp: 785,
      text: "Okay, that changes the priority. Which brings us to the fix. Ghulam, idempotency keys?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 797,
      text: "Yeah. Every create gets a deterministic key: tenant, internal object ID, operation, sync generation. We persist it before the call and set it on an external ID field on the Salesforce side, so retries become upserts instead of inserts. I'll write up a proper design for next week's architecture review, but the shape is clear.",
    },
    {
      speaker: "Arslan",
      timestamp: 868,
      text: "Timeline?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 872,
      text: "Opportunities first, realistically October 7th. Contacts and accounts after that.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 890,
      text: "Is there anything I can tell Brightline tomorrow that's more concrete than we're working on it?",
    },
    {
      speaker: "Arslan",
      timestamp: 902,
      text: "You can tell them the retry behavior behind Monday is already fixed in production, and a structural fix for duplicates, including the small ongoing ones, is scheduled for early October. And if they send Ethan's examples, Ghulam can confirm it's the same path.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 951,
      text: "Please do. Record IDs, even ten of them, would help a lot.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 961,
      text: "I'll get them from Ethan and send them straight to you.",
    },
    {
      speaker: "Arslan",
      timestamp: 975,
      text: "Okay. Decision one: idempotency keys on sync writes. Now, detection. Abdullah.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 990,
      text: "So we had the data, we just didn't look at it. The 429 rate for those orgs went from basically zero to 38% of calls within ten minutes. There's a Datadog metric for it. There's no monitor on it.",
    },
    {
      speaker: "Arslan",
      timestamp: 1036,
      text: "Why not?",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1041,
      text: "Honestly? When we set up sync monitoring we alerted on job failures, and these jobs didn't fail. They retried and eventually succeeded. From the dashboard's point of view Monday morning looked like a slow night.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1080,
      text: "Which is kind of the worst failure mode. Everything's green and it's quietly making a mess.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1092,
      text: "And everything's global. Seven out of 900 tenants spiking doesn't move a global error rate. So I want a per-tenant 429 rate monitor that pages if any tenant goes above 5% of calls over five minutes. And once the keys exist, a second one on duplicate creates, same key seen twice.",
    },
    {
      speaker: "Arslan",
      timestamp: 1158,
      text: "Makes sense. Is tenant as a tag okay cost-wise?",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1168,
      text: "On a couple of metrics, yes. I'll cost it properly, but it's small. I can have the 429 monitor live by October 3rd.",
    },
    {
      speaker: "Arslan",
      timestamp: 1203,
      text: "Okay, decision two: alert on per-tenant 429 rate. And I want the lack of per-tenant alerting written down as a concern in general, because it's broader than sync.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1224,
      text: "Can I add one? On Monday I wrote those seven emails from scratch, and it took most of the afternoon to get the wording right and get it reviewed. We should have a template. Incident notice, what happened, impact on your data, what we did, what's next. So next time it goes out in an hour, not a day.",
    },
    {
      speaker: "Arslan",
      timestamp: 1290,
      text: "Yes, totally. Decision three: a customer comms template for incidents. Emma, can you own that? Use Monday's email as the base.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1305,
      text: "Sure. I'll run it past Priya for the technical wording.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1360,
      text: "One more contributing factor, the backfill. We have no concept of an API budget per org. A backfill can just eat the whole Salesforce limit for a customer.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1382,
      text: "Salesforce sends the remaining limit in the Sforce-Limit-Info header on every response. We could throttle off that.",
    },
    {
      speaker: "Arslan",
      timestamp: 1560,
      text: "Let's not scope that now, just add it to the doc as a follow-up proposal. Okay, let me wrap. Done: dedupe across all seven tenants, verified. Customer emails sent. Hotfix for the double retry deployed. Pending: idempotency keys, Ghulam, October 7th. Per-tenant 429 alerting, Abdullah, October 3rd. Comms template, Emma. Concerns: three-hour detection, found by a customer, and no per-tenant alerting.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1655,
      text: "And I'll let you both know how tomorrow goes with Brightline.",
    },
    {
      speaker: "Arslan",
      timestamp: 1664,
      text: "Please. Thanks, everyone. And Abdullah, thanks for dropping everything on Monday morning.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1676,
      text: "Ha, no worries. Let's just not do it again.",
    },
  ],
  summary: {
    executive_summary:
      "On September 14th, 429 rate limits from Salesforce combined with two stacked retry layers and client timeouts to create 2,184 duplicate opportunity records across seven tenants, Brightline among them. The problem ran for about three hours before a customer ticket surfaced it. The team has already removed the double retry, run a verified dedupe and emailed the affected customers, and agreed to add idempotency keys, per-tenant 429 alerting and an incident comms template.",
    key_points: [
      "Root cause: the nightly sync overlapped with Friday's field-mapping backfill, which triggered 429s. Client-level and job-level retries stacked to 15 attempts, and creates that timed out on our side had actually succeeded in Salesforce, so the retries created duplicates.",
      "Detection took three hours. The first duplicate was written at 6:11 a.m., and the first alert was Brightline's ticket at 9:12 a.m. Job-failure alerts never fired because every retried job eventually succeeded.",
      "The dedupe script kept the oldest record, re-pointed related records and soft-deleted the copies (a 15-day recycle bin window). Counts for all seven tenants were verified on Tuesday.",
      "Brightline reports a few duplicate opportunities a week for months, which suggests a latent bug on the same timeout path rather than a one-off.",
      "Backfills have no per-org Salesforce API budget. Throttling on the Sforce-Limit-Info header was raised as a follow-up proposal.",
    ],
    decisions: [
      "Add idempotency keys to sync writes so retried creates become upserts, starting with opportunities.",
      "Alert on the per-tenant Salesforce 429 rate, paging above 5% of calls over five minutes.",
      "Create a reusable customer comms template for incidents, based on Monday's email.",
    ],
    concerns: [
      "Detection time: the problem ran for three hours and was found by a customer, not by our monitoring.",
      "There is no per-tenant alerting, so a spike across 7 of roughly 900 tenants was invisible on global dashboards.",
      "Brightline's trust is at risk: the renewal is about 45 days out, the champion has already left, and duplicates have been happening at small scale for months.",
    ],
    action_items: [
      {
        task: "Run the dedupe script across all seven affected tenants and verify record counts against Salesforce",
        owner: "Ghulam Mustafa",
        dueDate: "Sep 17",
        status: "completed",
        priority: "high",
      },
      {
        task: "Send incident notification emails to the admins of all seven affected tenants",
        owner: "Emma Rodriguez",
        dueDate: "Sep 17",
        status: "completed",
        priority: "high",
      },
      {
        task: "Deploy hotfix removing the client-level retry and adding jittered exponential backoff; disable the backfill",
        owner: "Abdullah Javed",
        dueDate: "Sep 17",
        status: "completed",
        priority: "high",
      },
      {
        task: "Add idempotency keys to sync worker create writes, starting with opportunities",
        owner: "Ghulam Mustafa",
        dueDate: "Oct 7",
        status: "pending",
        priority: "high",
      },
      {
        task: "Set up a per-tenant Salesforce 429 rate monitor in Datadog that pages above 5% over five minutes",
        owner: "Abdullah Javed",
        dueDate: "Oct 3",
        status: "pending",
        priority: "high",
      },
    ],
  },
  highlights: [
    { timestamp: 310, label: "Three-hour detection gap" },
    { timestamp: 687, label: "Brightline sees recurring duplicates" },
    { timestamp: 975, label: "Idempotency keys agreed" },
    { timestamp: 1203, label: "Per-tenant 429 alerting" },
  ],
};
