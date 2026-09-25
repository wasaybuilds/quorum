import type { Meeting } from "@/lib/types";

export const platformArchitectureReview: Meeting = {
  id: "platform-architecture-review",
  title: "Platform Architecture Review",
  company: "Lattice Labs",
  type: "engineering",
  date: "2026-09-23T13:00:00-07:00",
  duration: 60,
  platform: "Google Meet",
  participants: [
    { name: "Arslan", role: "Engineering Lead", email: "arslan@latticelabs.io" },
    { name: "Ghulam Mustafa", role: "Backend Engineer", email: "ghulam@latticelabs.io" },
    { name: "Abdullah Javed", role: "Platform Engineer", email: "abdullah@latticelabs.io" },
  ],
  transcript: [
    {
      speaker: "Arslan",
      timestamp: 8,
      text: "Okay, I think we're all here. Abdullah, you're not frozen, right? Your video just stalled for a second.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 16,
      text: "No, I'm here, I'm here. The Wi-Fi's being weird today. Audio should be fine.",
    },
    {
      speaker: "Arslan",
      timestamp: 27,
      text: "Cool. So, agenda. Four things in the hour: the Postgres 16 migration plan, API latency targets, the Redis caching proposal Ghulam wrote up, and what we're doing about /v1/reports. Then the sync worker duplicates, because after last week I don't think that one can wait.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 51,
      text: "Yeah, I'd honestly argue sync should go second, but... fine, let's see how we do on time.",
    },
    {
      speaker: "Arslan",
      timestamp: 60,
      text: "Fair. Let's keep the migration part tight then. Abdullah, you want to walk us through where the plan is?",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 72,
      text: "Sure. So current state: single primary on Postgres 13, one streaming read replica, about 1.8 terabytes total. The biggest table by far is opportunity_snapshots, roughly 900 gigs, because we keep a daily snapshot per opportunity for forecast history. And 13 has been out of community support since last November, which the SOC 2 auditor flagged, so this isn't optional anymore. Two options. pg_upgrade with --link, which is fast but a hard cutover, maybe 20 to 40 minutes down. Or logical replication into a fresh 16 cluster and a switchover, which gets write downtime to a couple of minutes but has way more moving parts. I'm recommending logical. The downtime on pg_upgrade isn't the scary part, it's that if something goes wrong halfway we don't have a clean way back. With logical we keep the 13 cluster warm as a fallback for 48 hours after cutover.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 214,
      text: "The thing that worries me with logical is sequences. Sequences don't replicate, right? So we'd have to sync those by hand at cutover.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 229,
      text: "Right, sequences get bumped at cutover with a script, we set them ahead by a million or so to be safe. The bigger problem is tables without primary keys. There are three. Two old audit tables, and, uh, sync_cursor_history. Which is from 2021, I think. We'd need REPLICA IDENTITY FULL on it or add a key first. I'd rather add a key.",
    },
    {
      speaker: "Arslan",
      timestamp: 281,
      text: "Sorry, sync_cursor_history doesn't have a primary key? Wow. Okay, yeah, add the key. What about the replica during the initial copy? Reporting reads off the replica, and if that falls behind, customers see stale forecasts.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 302,
      text: "So that's the real risk. On a staging clone the initial table sync pushed replica lag to about 40 seconds at peak. With real production traffic I'd guess worse, maybe a couple of minutes while it's copying opportunity_snapshots.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 371,
      text: "A couple of minutes is fine for dashboards but not for the sync worker. The worker reads cursor state from the replica in one place, the fetchLastCursor path. I found it last week. It's like a ten-line change to point it at the primary.",
    },
    {
      speaker: "Arslan",
      timestamp: 392,
      text: "Wait, it reads cursor state from the replica? That's a bug regardless of the migration. Please fix that before any of this. Okay, the downtime window itself?",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 403,
      text: "I'm proposing Saturday, October 24th, 2 to 4 a.m. Pacific. That's our lowest traffic, about 6% of weekday peak. The actual write freeze should be under five minutes, but I want a two-hour window announced so we have room if something's off. I'll share the timeline, one sec... okay, you can see it? Freeze at 2:10, sequence sync, flip the connection string in the API config, smoke tests, then unfreeze.",
    },
    {
      speaker: "Arslan",
      timestamp: 505,
      text: "That's mid-morning Saturday in Europe though. Northwind's expanding into EMEA, and Emma said their ops team works weekends.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 519,
      text: "True. But Saturday morning in Europe is still way lower than any weekday. And it's degraded, not down. Dashboards keep loading off the replica, it's only writes that pause.",
    },
    {
      speaker: "Arslan",
      timestamp: 566,
      text: "Okay. I'm fine with it as long as the status page notice goes out a week ahead. But before we lock the date I want a full rehearsal on staging with a production-sized snapshot. Not the 200 gig staging database. When could you have the runbook and the rehearsal done?",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 590,
      text: "I can restore last Sunday's snapshot into a separate staging cluster. It'll cost a few hundred dollars in RDS for the week, but that's worth it. Runbook by end of next week, rehearsal right after. Call it October 9th for both.",
    },
    {
      speaker: "Arslan",
      timestamp: 812,
      text: "October 9th. Great. Okay, I'm pulling us off the runbook doc or we'll be here all day. Performance targets. Ghulam?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 821,
      text: "So I pulled numbers from Datadog this morning. Across all read endpoints, p95 is 640 milliseconds and p99 is about 1.9 seconds. The worst offenders are /v1/reports at 2.4 seconds p95 and forecast rollup at about 1.1 seconds.",
    },
    {
      speaker: "Arslan",
      timestamp: 915,
      text: "And the target I floated was p95 under 300 for reads. Realistic?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 924,
      text: "For most endpoints, yes. Accounts, contacts, the opportunities list, those are already around 180 to 250. It's forecasts and reports dragging everything up. And forecast rollup is basically the same aggregation run over and over. Same tenant, same quarter, same filters. Which is why I wrote the Redis proposal.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1018,
      text: "How repetitive is it actually? Do you have a hit rate estimate?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1027,
      text: "I sampled a day of query logs. About 71% of forecast rollup requests were identical to one the same tenant made in the previous ten minutes. Mostly because the dashboard polls every 60 seconds and people leave it open all day. So the design is: cache key is tenant ID, plus a hash of the normalized filters, plus the forecast period. Ten-minute TTL, but we also invalidate on write. When the sync worker finishes a batch for a tenant it bumps a tenant version number, and the version is part of the key, so stale entries just stop getting read.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1163,
      text: "I like version keys, way simpler than trying to delete specific keys. What are you thinking for Redis itself, ElastiCache?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1178,
      text: "ElastiCache, a single shard with one replica to start, r6g.large. Forecast payloads are small, 20 to 80 kilobytes. Even across every tenant we're under a few gigs.",
    },
    {
      speaker: "Arslan",
      timestamp: 1251,
      text: "My one concern is tenant isolation. Security reviews are already slowing deals down, and Globex's security team is absolutely going to ask about this. We cannot have a key collision serve one tenant's forecast to another.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1277,
      text: "Tenant ID is the first segment of the key and it comes from the auth context, never from the request. And on read I'll check that the tenant ID stored inside the cached payload matches. Belt and braces.",
    },
    {
      speaker: "Arslan",
      timestamp: 1352,
      text: "Good. Put that in the design doc explicitly, Priya will want to point security reviewers at it. Okay, anyone against Redis?",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1366,
      text: "Not against. It's just one more piece of infra I'm on call for. As long as a Redis outage falls back to Postgres and doesn't take the API down with it.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1383,
      text: "Yes, fail open. If Redis doesn't answer within 50 milliseconds we go straight to the database.",
    },
    {
      speaker: "Arslan",
      timestamp: 1396,
      text: "Alright, then we're doing it. Redis caching for forecast queries is approved. But before it ships, I want a benchmark suite so we can actually prove the p95 numbers instead of eyeballing Datadog.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1421,
      text: "I was going to suggest that. k6 scripts against staging covering the top 15 read endpoints by volume, running nightly in CI. I can have it by October 2nd.",
    },
    {
      speaker: "Arslan",
      timestamp: 1540,
      text: "Perfect. Okay, /v1/reports. So it's 12% of API traffic, p95 of 2.4 seconds, and it's exactly what Brightline complained about on their renewal call last week. Emma said their exports were timing out. We moved them onto the /v2/reports early access and apparently it's night and day. So why is anyone still on v1?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1601,
      text: "Inertia, mostly. v2 is still labelled beta and we never told anyone to move. I checked: 38 tenants hit v1 in the last 30 days, but it's really concentrated. The top six are about 80% of the calls.",
    },
    {
      speaker: "Arslan",
      timestamp: 1690,
      text: "That's manageable outreach. So I want to propose a formal deprecation with a 90-day sunset. Take v2 to GA, announce next week, add Deprecation and Sunset headers on every v1 response, and switch v1 off after 90 days.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 1731,
      text: "Ninety days lands right in the holidays though. If we announce October 1st, that's December 30th.",
    },
    {
      speaker: "Arslan",
      timestamp: 1745,
      text: "Hm, yeah. Nobody's migrating an integration between Christmas and New Year. Okay, the 90 days runs from the notice, but actual shutdown is January 7th. Slightly more than 90. Works?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1770,
      text: "Works for me. And for the big six, CS should reach out directly. Northwind's one of them, and they've been asking for better bulk API docs anyway, so the migration guide can double as that.",
    },
    {
      speaker: "Arslan",
      timestamp: 1852,
      text: "Oh, good point, two birds. Okay, decision: we deprecate /v1/reports with a 90-day sunset, shutdown January 7th, plus one announced brownout in mid-December so nobody's surprised. I'll draft the deprecation notice and the migration guide outline and get it to Emma and Priya by October 1st. Okay, sync worker. Ghulam, go.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 1884,
      text: "Right. So the incident on the 14th, the retry storm after Salesforce started returning 429s. The core problem is the worker retries a create when it doesn't get a response, but sometimes Salesforce actually did create the record and we just never saw the 201. So we create it again. The fix: before every create we generate a deterministic key from tenant ID, our internal object ID, the operation and the sync generation, and write it to a sync_writes table with a unique constraint. Then we set it on an external ID field in Salesforce, Lattice_Sync_Key__c, and use upsert instead of insert.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 2090,
      text: "So if a retry goes through, the upsert matches on the external ID and updates instead of creating a duplicate.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 2102,
      text: "Exactly. HubSpot is similar with a unique custom property. The annoying part is the field has to exist in each customer's org, so it goes into managed package 2.4. Tenants who haven't upgraded fall back to a query-before-create check. Slower, but safe.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 2186,
      text: "Query-before-create has a race though, if two workers pick up the same job.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 2198,
      text: "Which is why the unique constraint on sync_writes is the first line of defense. Only one worker can claim a key. Salesforce is the second line.",
    },
    {
      speaker: "Arslan",
      timestamp: 2275,
      text: "Okay, I'm convinced. Decision: idempotency keys on all sync writes, starting with opportunity creates, since that's what duplicated for Brightline and the other six tenants. Timeline?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 2296,
      text: "Opportunities by October 7th, then contacts and accounts after that. But honestly, I'm worried about carrying this plus Redis plus the benchmark suite at the same time.",
    },
    {
      speaker: "Arslan",
      timestamp: 2320,
      text: "Noted. Idempotency first, it's customer-facing. Redis can slip a week if it has to. I'll raise it with Jordan, since two of us are already carved out for the migration this quarter.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 2436,
      text: "Can I raise monitoring? Because that's what actually bit us last week, we found out from a customer ticket three hours later. We don't have per-tenant anything. Latency dashboards are global, so if one big tenant's p95 goes to five seconds it barely moves the line. Same with sync error rates. I want per-tenant latency and error panels in Datadog, tagged by tenant ID, and an alert when any one tenant's 429 rate crosses a threshold.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 2580,
      text: "Cardinality, though. We have around 900 tenants. Tagging every metric with tenant ID is going to blow up the Datadog bill.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 2595,
      text: "Only on a handful of metrics. Request latency, error count, sync job outcome. I priced it roughly, maybe 600 dollars a month extra. Cheaper than one churned account.",
    },
    {
      speaker: "Arslan",
      timestamp: 2618,
      text: "Way cheaper. Let's log the monitoring gaps as an open concern, I don't want to spec it all here. Abdullah, fold it into the migration work, since you need replication lag panels for the cutover anyway.",
    },
    {
      speaker: "Arslan",
      timestamp: 2905,
      text: "Okay, last topic. Load testing. Before the Postgres cutover and before Redis goes live, I want us load-tested at 3x current peak. If Globex closes at 350 seats and Acme's pilot converts, Q1 is a real jump.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 2931,
      text: "3x peak is about 1,400 requests a second on the API tier. I can run it against the prod-sized staging cluster right after the rehearsal. So October 14th?",
    },
    {
      speaker: "Arslan",
      timestamp: 2950,
      text: "October 14th works. Ghulam, can he reuse your k6 scripts for that?",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 2960,
      text: "That's the plan. I'll parameterize the virtual users so he can just crank it up.",
    },
    {
      speaker: "Arslan",
      timestamp: 3190,
      text: "Should we put a follow-up on the calendar for after the rehearsal? I'd rather review the results together than over Slack.",
    },
    {
      speaker: "Abdullah Javed",
      timestamp: 3205,
      text: "Yeah, Monday the 12th? I'll post the runbook draft in #platform before then so you both can comment.",
    },
    {
      speaker: "Arslan",
      timestamp: 3395,
      text: "Monday the 12th. Let me recap. Decisions: Redis caching for forecast queries, fail open, tenant-scoped keys. Deprecate /v1/reports with a 90-day sunset, shutdown January 7th. Idempotency keys on all sync writes, opportunities first. Actions: Abdullah, runbook and staging rehearsal by October 9th, load test at 3x by the 14th. Ghulam, benchmark suite by October 2nd, idempotency on opportunity writes by the 7th. Me, deprecation notice by October 1st. Concerns on record: migration risk, meaning replica lag and the downtime window, and the monitoring gaps.",
    },
    {
      speaker: "Ghulam Mustafa",
      timestamp: 3462,
      text: "And the cursor read on the replica. I'll just fix that this week, it doesn't need tracking.",
    },
    {
      speaker: "Arslan",
      timestamp: 3474,
      text: "Ha, okay. Thanks both, good session.",
    },
  ],
  summary: {
    executive_summary:
      "The platform team reviewed the Postgres 13 to 16 migration, API latency targets and the sync worker's duplicate-write problem. They approved a Redis cache for forecast queries, a 90-day sunset for /v1/reports ending January 7th, and idempotency keys on all Salesforce and HubSpot sync writes. The main open risks are replica lag during the migration and the lack of per-tenant monitoring.",
    key_points: [
      "Postgres 13 is already out of community support (flagged by the SOC 2 auditor); the plan is logical replication to a new 16 cluster, keeping 13 warm for 48 hours as a fallback. The proposed window is Saturday, October 24th, 2 to 4 a.m. Pacific.",
      "Read endpoints currently sit at 640 ms p95. /v1/reports (2.4 s) and forecast rollup (1.1 s) are the main blockers to the p95 < 300 ms target.",
      "71% of forecast rollup requests repeat within 10 minutes, so a version-keyed Redis cache with tenant-scoped keys and a 50 ms fail-open should cut forecast latency sharply.",
      "38 tenants still call /v1/reports and the top six account for about 80% of that traffic, Northwind among them. The migration guide will also serve as the bulk API docs Northwind has asked for.",
      "The September 14th duplicate opportunities came from retried creates that had actually succeeded. Deterministic idempotency keys plus Salesforce upserts on Lattice_Sync_Key__c close that gap.",
    ],
    decisions: [
      "Build a Redis (ElastiCache) cache for forecast queries: tenant-scoped, version-keyed, fail open to Postgres.",
      "Deprecate /v1/reports with a 90-day sunset: take /v2/reports to GA, add Deprecation/Sunset headers, run one announced brownout in mid-December, and shut down on January 7th.",
      "Add idempotency keys to all sync writes, starting with opportunity creates, backed by a unique constraint on sync_writes and Salesforce upserts.",
    ],
    concerns: [
      "Migration risk: replica lag could reach several minutes during the initial copy of opportunity_snapshots, and the Saturday window falls on EMEA mid-morning while Northwind is expanding there.",
      "Monitoring gaps: all dashboards are global with no per-tenant latency, error or 429 alerting, which is why the September 14th incident was found from a customer ticket three hours later.",
      "Ghulam is carrying idempotency keys, Redis and the benchmark suite at once, so Redis may slip a week.",
    ],
    action_items: [
      {
        task: "Complete the Postgres 16 migration runbook and run a full rehearsal on a production-sized staging clone",
        owner: "Abdullah Javed",
        dueDate: "Oct 9",
        status: "pending",
        priority: "high",
      },
      {
        task: "Build a k6 benchmark suite covering the top 15 read endpoints, running nightly in CI",
        owner: "Ghulam Mustafa",
        dueDate: "Oct 2",
        status: "pending",
        priority: "medium",
      },
      {
        task: "Load test the API tier at 3x current peak traffic (~1,400 req/s) against the prod-sized staging cluster",
        owner: "Abdullah Javed",
        dueDate: "Oct 14",
        status: "pending",
        priority: "high",
      },
      {
        task: "Draft the /v1/reports deprecation notice and /v2/reports migration guide outline for Emma and Priya",
        owner: "Arslan",
        dueDate: "Oct 1",
        status: "pending",
        priority: "medium",
      },
      {
        task: "Ship idempotency keys for opportunity create writes in the sync worker",
        owner: "Ghulam Mustafa",
        dueDate: "Oct 7",
        status: "pending",
        priority: "high",
      },
    ],
  },
  highlights: [
    { timestamp: 403, label: "Migration window proposed" },
    { timestamp: 1396, label: "Redis caching approved" },
    { timestamp: 1852, label: "/v1/reports 90-day sunset" },
    { timestamp: 2275, label: "Idempotency keys for sync writes" },
  ],
};
