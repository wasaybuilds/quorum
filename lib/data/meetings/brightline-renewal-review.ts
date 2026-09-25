import type { Meeting } from "@/lib/types";

export const brightlineRenewalReview: Meeting = {
  id: "brightline-renewal-review",
  title: "Brightline Renewal Check-in",
  company: "Brightline Health",
  type: "cs",
  date: "2026-09-17T15:00:00-07:00",
  duration: 35,
  platform: "Microsoft Teams",
  participants: [
    { name: "Emma Rodriguez", role: "Customer Success Manager", email: "emma@latticelabs.io" },
    { name: "Priya Nair", role: "Solutions Engineer", email: "priya@latticelabs.io" },
    {
      name: "Nora Castillo",
      role: "VP Revenue Operations, Brightline Health",
      email: "nora.castillo@brightlinehealth.com",
      external: true,
    },
    {
      name: "Ethan Brooks",
      role: "CRM Manager, Brightline Health",
      email: "ethan.brooks@brightlinehealth.com",
      external: true,
    },
  ],
  transcript: [
    {
      speaker: "Emma Rodriguez",
      timestamp: 7,
      text: "Hi Nora, hi Ethan, thanks for making the time. Can you hear me okay? Teams keeps telling me I'm muted when I'm not.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 16,
      text: "We can hear you fine. Hi Emma. And Priya, I don't think we've actually met.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 23,
      text: "Hi, nice to meet you both. I'm a solutions engineer, I work with Emma on the technical side. Ethan and I have traded a few tickets.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 35,
      text: "Yeah, Priya's been great on the tickets. There have just been... a lot of tickets.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 44,
      text: "Ha, fair. And that's kind of why I wanted this call. Loose agenda: I want to properly acknowledge last Monday, hear honestly how things are going, and talk about the renewal, which is November 1st. Does that work?",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 66,
      text: "That works. I'll be direct, because I think that's more useful. Monday was bad. Ethan's Monday forecast deck was built on pipeline numbers that had doubled, and it went to our CRO before we caught it.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 98,
      text: "I know, and I'm sorry. That's on us. To recap what I put in the email: Salesforce started rate-limiting our sync, our retry logic retried creates that had actually gone through, and that created 341 duplicate opportunities in your org. Those are cleaned up, and the retry behavior is already fixed in production. The structural fix, so a retry can never create a second record, is scheduled for early October.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 142,
      text: "Okay. But I want to flag, it's not just the 14th. We've been getting a couple of duplicate opportunities a week for months. Small enough that I just merge them by hand, but it's constant.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 178,
      text: "That's really helpful, actually. Do you have record IDs for any of those? Even a handful would let engineering confirm whether it's the same path as Monday.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 196,
      text: "I've got a spreadsheet. About 40 of them since June, with the dates. I can send it after the call.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 210,
      text: "Please send it to me and I'll put it straight in front of Arslan, our engineering lead. They already suspect the small ones come from the same code path as Monday, just at lower volume, so your list would confirm it.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 245,
      text: "Okay. The second thing is exports. Ethan, you explain it, you're the one living it.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 252,
      text: "So, the quarterly board pack. It's pipeline by segment, around 180,000 rows. The export just times out, every time. So I split it into six exports by region, and I kick them off at like 11 p.m. on Thursdays so they actually finish. It's been like that since spring.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 300,
      text: "Yeah, that export runs on our older /v1/reports endpoint, and honestly it just doesn't do well at that size. We have a newer /v2/reports in early access. Exports run asynchronously and get paginated, so there's no timeout. In our tests, a 180,000-row export like yours finishes in under 20 seconds.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 345,
      text: "Is early access, like, stable? I can't have the board pack break the week before a board meeting.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 356,
      text: "It's been in production since June with about a dozen customers. The API is stable, the beta label is mostly about the docs. And I'd run the first board pack export side by side with you, old and new, so we can compare numbers.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 380,
      text: "If it gets Ethan his Thursday nights back, I'm in.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 390,
      text: "Let's do it then. We'll move you onto /v2/reports early access.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 402,
      text: "I can enable it for your org tonight, and Ethan, we can do the side-by-side tomorrow if that works.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 480,
      text: "Can I share something with you both? I pulled your usage before the call. Weekly active users went from 61 in June to 24 last week, out of 80 seats. And the drop starts pretty much exactly when Marisa left.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 512,
      text: "Yeah. Marisa was the Lattice person. She built the dashboards, she ran our Monday pipeline review in it, she onboarded every new rep. When she left in July nobody really picked it up. Ethan inherited admin on top of his whole CRM job.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 548,
      text: "And to be honest, half of Marisa's dashboards reference fields we renamed in Salesforce in August. So they show blanks, so people stopped opening them.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 575,
      text: "Oh, that's very fixable. The dashboards don't know the mapping broke. We can remap those in an afternoon.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 592,
      text: "So that's what I want to propose. A 60-day success plan. Bi-weekly check-ins with the four of us, admin re-training, Priya fixes the broken field mappings and dashboards, and we get the sync duplicates and exports resolved inside that window. At the end, you decide on the renewal based on how it actually went.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 660,
      text: "Who would you need from our side?",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 668,
      text: "Ideally Ethan, plus whoever's going to own the Monday pipeline review now. Is there someone?",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 684,
      text: "Probably Jess on my team, she's a RevOps analyst. And I'd want her trained as an admin too, so we're never one person deep again.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 703,
      text: "Perfect. Re-training for Ethan and Jess, about 90 minutes, admin track: field mapping, building dashboards, the sync health page. Sometime the week of the 29th?",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 722,
      text: "Wednesday the 30th works for me. I'll check with Jess.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 800,
      text: "Okay. I also need to be transparent with you. We're evaluating another vendor. We had a demo two weeks ago. Our CRO asked me to look, and after the 14th he's asking harder.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 842,
      text: "I appreciate you telling me. Can I ask what stood out?",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 851,
      text: "Their whole pitch was data reliability. Which is exactly the thing that's hurt us. And, not going to lie, the price.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 900,
      text: "Okay, let's talk about price directly. Your renewal quote has our standard 7% uplift, which takes you from 95 dollars a seat to about 101.65.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 921,
      text: "Right, and our tooling budget for next year is flat. I can't walk a 7% increase into our CFO after the year we've had with the tool. That's just not happening.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 952,
      text: "I hear you. What I'd like to do is propose holding your price flat at 95 for the renewal term. I need sign-off from Marcus, our VP of Sales, but given what happened I think it's the right thing, and I'll push for it.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 1010,
      text: "Flat would matter. Can we also talk about seat count? We're paying for 80 and 24 people are using it.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1038,
      text: "Let's use the success plan to decide that. If adoption comes back, the 80 are earning their keep. If it doesn't, we right-size at renewal, rather than you paying for seats nobody opens.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 1076,
      text: "That's fair.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1083,
      text: "And both fixes, the /v2 exports and the duplicate fix, land inside the 60 days. So you'd be evaluating us with those in place, not on promises.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 1160,
      text: "One thing, though. Sixty days from now is past November 1st.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1176,
      text: "Good catch, yes, it lands mid-November. I'd propose extending your current term through the end of November at your current rate, so you can decide based on data and not a deadline.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 1220,
      text: "I'd need that in writing. Our CFO will want to see it.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1229,
      text: "Of course. I'll send you the proposed renewal terms, flat price plus the extension, by next Thursday, the 24th.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 1320,
      text: "Can I ask something? If something like the 14th happens again, can we hear about it from you before I find it myself?",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1352,
      text: "Yes. Engineering is adding per-tenant alerting on Salesforce rate limits, which is exactly what should have fired on Monday. So a spike on your org alone would page someone.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1391,
      text: "And we're putting together a proper incident notice process on our side, so you'd hear from me first, same day.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 1410,
      text: "Okay. That would help, because right now I check the sync health page every morning, which is probably not a great sign.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1440,
      text: "Agreed, it's not. In the training I'll set you up with the daily sync error digest email so you don't have to go looking.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 1520,
      text: "Can we make the success plan measurable? My CRO is going to ask how we know it worked.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1538,
      text: "Definitely. I'd suggest three things. Weekly active users back above 50. The board pack export completing in one run, under a minute. And zero duplicate opportunities from the sync in the last 30 days of the plan.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 1600,
      text: "Fifty is ambitious but okay. Right now our Monday review runs off a Salesforce export in Google Sheets, so honestly that's where the 50 would come from, if we move that meeting back into Lattice.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1632,
      text: "I'd love to rebuild that with Jess during the training. The forecast-by-segment view does most of it natively.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 1675,
      text: "That segment view is the one Marisa had set up. I think it's just broken by the field rename.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1690,
      text: "Then that's probably twenty minutes of remapping. Easy win.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1840,
      text: "Okay, let me recap so we're aligned. Ethan sends me the duplicates spreadsheet and I escalate it to engineering today. Priya enables /v2/reports tonight and does the board pack side-by-side with Ethan tomorrow. Admin re-training for Ethan and Jess on Wednesday the 30th. I'll send the 60-day success plan with the bi-weekly check-ins and those three metrics by Friday. And renewal terms, flat at 95 plus the extension, by Thursday the 24th.",
    },
    {
      speaker: "Nora Castillo",
      timestamp: 1935,
      text: "Good. Honestly, this is the most useful call we've had since Marisa left.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1950,
      text: "That means a lot, thank you. First check-in would be October 1st, I'll send the invite.",
    },
    {
      speaker: "Ethan Brooks",
      timestamp: 1968,
      text: "I'll get you the spreadsheet in the next hour. Thanks, both.",
    },
  ],
  summary: {
    executive_summary:
      "Brightline Health, 80 Enterprise seats renewing November 1st, is a churn risk. Usage has fallen from 61 to 24 weekly active users since their champion Marisa left, the September 14th sync incident damaged trust, and they are evaluating a competitor. Emma and Priya proposed a 60-day success plan with bi-weekly check-ins and moved Brightline onto /v2/reports early access to fix export timeouts. Emma will propose renewal terms that hold the price flat at $95 per seat.",
    key_points: [
      "The September 14th incident created 341 duplicate opportunities in Brightline's org, and inflated numbers reached their CRO. Ethan also reports about 40 smaller duplicates since June.",
      "Quarterly board pack exports (about 180,000 rows) time out on /v1/reports, so Ethan splits them into six regional exports every Thursday night.",
      "Weekly active users fell from 61 to 24 of 80 seats after Marisa left in July. Many dashboards are blank because Salesforce fields were renamed in August.",
      "Brightline is evaluating another vendor that pitches data reliability, and their budget is flat, so the standard 7% uplift (to about $101.65 per seat) is not acceptable.",
      "Success metrics: weekly active users above 50, the board pack exporting in one run in under a minute, and zero sync duplicates in the final 30 days.",
    ],
    decisions: [
      "Run a 60-day success plan with bi-weekly check-ins, admin re-training and dashboard remapping, and extend the current term through the end of November.",
      "Move Brightline onto /v2/reports early access for exports, with a side-by-side run of the board pack.",
    ],
    concerns: [
      "High churn risk: renewal is 45 days out, a competitor is being evaluated, and there is strong sensitivity to any price increase.",
      "Salesforce sync duplicates are recurring, not one-off, and reliability is the competitor's main pitch.",
      "Losing their internal champion left Brightline one admin deep, and adoption has collapsed without an owner.",
    ],
    action_items: [
      {
        task: "Escalate Brightline's recurring duplicate-opportunity records (Ethan's spreadsheet of about 40 IDs) to engineering",
        owner: "Emma Rodriguez",
        dueDate: "Sep 18",
        status: "completed",
        priority: "high",
      },
      {
        task: "Enable /v2/reports early access for Brightline and run the board pack export side by side with Ethan",
        owner: "Priya Nair",
        dueDate: "Sep 18",
        status: "completed",
        priority: "high",
      },
      {
        task: "Send the 60-day success plan with bi-weekly check-ins and the three success metrics",
        owner: "Emma Rodriguez",
        dueDate: "Sep 18",
        status: "completed",
        priority: "medium",
      },
      {
        task: "Propose renewal terms holding price flat at $95/seat with a term extension through end of November (needs Marcus's sign-off)",
        owner: "Emma Rodriguez",
        dueDate: "Sep 24",
        status: "pending",
        priority: "high",
      },
      {
        task: "Run admin re-training for Ethan and Jess, including remapping the dashboards broken by the field rename",
        owner: "Priya Nair",
        dueDate: "Sep 30",
        status: "pending",
        priority: "medium",
      },
    ],
  },
  highlights: [
    { timestamp: 390, label: "Moving to /v2/reports early access" },
    { timestamp: 592, label: "60-day success plan proposed" },
    { timestamp: 800, label: "Competitor evaluation disclosed" },
    { timestamp: 952, label: "Flat pricing proposed" },
  ],
};
