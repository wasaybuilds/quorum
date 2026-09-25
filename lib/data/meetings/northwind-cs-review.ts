import type { Meeting } from "@/lib/types";

export const northwindCsReview: Meeting = {
  id: "northwind-cs-review",
  title: "Northwind Quarterly Success Review",
  company: "Northwind Logistics",
  type: "cs",
  date: "2026-09-22T10:00:00-07:00",
  duration: 45,
  platform: "Google Meet",
  participants: [
    {
      name: "Emma Rodriguez",
      role: "Customer Success Manager",
      email: "emma@latticelabs.io",
    },
    {
      name: "David Lee",
      role: "Head of Sales Operations",
      email: "david.lee@northwindlogistics.com",
      external: true,
    },
    {
      name: "Rachel Osei",
      role: "Revenue Analyst",
      email: "rachel.osei@northwindlogistics.com",
      external: true,
    },
  ],
  transcript: [
    {
      speaker: "Emma Rodriguez",
      timestamp: 11,
      text: "Morning, David. Oh, and Rachel just joined too. Hi, Rachel!",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 31,
      text: "Hi! Sorry, I was stuck in another meeting that ran over. David, did I miss anything?",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 59,
      text: "Nope, perfect timing. So this is our Q3 review. I've got about three things: how usage has trended this quarter, what's next for the team, which I know includes EMEA, and then I want to hear what's frustrating you. I'd rather you tell me directly than it show up in a renewal conversation.",
    },
    {
      speaker: "David Lee",
      timestamp: 121,
      text: "Ha, appreciated. Yeah, Rachel's got a list.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 144,
      text: "Perfect, we'll get to it. Let me share the usage report. So, headline: weekly active users went from a hundred and twelve at the start of July to a hundred and fifty last week. That's up about thirty-four percent, on a hundred and eighty seats.",
    },
    {
      speaker: "David Lee",
      timestamp: 209,
      text: "Oh, that's higher than I expected. I figured we'd be around a hundred and thirty.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 235,
      text: "Most of the jump is the forecast module. In June, eight of your twenty-six managers were submitting their forecast in Lattice. As of last week it's twenty-one of twenty-six.",
    },
    {
      speaker: "David Lee",
      timestamp: 282,
      text: "That's the mandate. In July I told the managers the Monday call runs out of Lattice, period. No more pasting numbers into the deck.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 318,
      text: "And honestly it made my life a lot easier. I used to spend Monday mornings chasing managers for their spreadsheet tabs. Now I just pull the rollup.",
    },
    {
      speaker: "David Lee",
      timestamp: 364,
      text: "Right, so the five who aren't are mostly Midwest. Two of those managers are new, and one is, um, let's say attached to his own spreadsheet. Emma, could you do a short refresher just for them at some point? But after the EMEA stuff is sorted, I don't want to pile on right now.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 448,
      text: "Totally fair. One more number and then we'll move on: forecast accuracy. Your Q3 commit landed within six percent of actual. Rachel, I think you said Q2 was off by about fifteen?",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 497,
      text: "Fourteen and a half. So yeah, that's a real improvement. Our CFO noticed, which is the main thing.",
    },
    {
      speaker: "David Lee",
      timestamp: 527,
      text: "That's actually the number I'm taking into my QBR with leadership next week. It's going to help with the EMEA ask.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 581,
      text: "Which is a great segue. So, EMEA. Last time you mentioned the team in Rotterdam and London. Where are you at with that?",
    },
    {
      speaker: "David Lee",
      timestamp: 614,
      text: "So, EMEA is about forty reps and managers. Right now they forecast in a mix of Excel and whatever the regional VP puts in his slides. Leadership wants one global forecast by the start of next fiscal year, so we need them in Lattice.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 674,
      text: "Forty seats, got it. And the complication, if I remember right, is the Salesforce setup?",
    },
    {
      speaker: "David Lee",
      timestamp: 699,
      text: "Yeah. EMEA runs on its own Salesforce org. It came with the Vandermeer Freight acquisition two years ago and nobody has ever merged it. Different stage names, different opportunity record types, and they use a custom currency field instead of standard multi-currency.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 755,
      text: "And their stages don't line up with ours. They have seven stages, we have five. So even if we get both orgs in, I'm not sure how the rollup would even work.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 799,
      text: "Okay, so the good news is Lattice can connect more than one Salesforce org to one workspace. Each org gets its own field mapping, and then you map their seven stages onto your five for the global rollup. We have a few customers running two or three orgs like that.",
    },
    {
      speaker: "David Lee",
      timestamp: 867,
      text: "Okay, that's better than I thought. But how much work is it on our side? That's really my worry.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 896,
      text: "Honestly? The stage mapping is a whiteboard exercise, an afternoon. The currency field is the fiddly part, because it's custom. Priya on our solutions team would want to look at it before I promise anything.",
    },
    {
      speaker: "David Lee",
      timestamp: 946,
      text: "The other thing, and this is the bigger one, is admin bandwidth. We have one Salesforce admin for EMEA, Katrin, and she's part-time on it. She's also running their CPQ project through November.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 995,
      text: "Yeah, Katrin is very, very busy. I don't think we can ask her for more than a couple of hours a week before December.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1031,
      text: "Okay, that's important. Let me think out loud for a second. What if we don't do all forty at once? We start with a pilot on one EMEA team, say Rotterdam, which is eleven people, right?",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1083,
      text: "So we connect the EMEA org read-only first, which means no write-back and nothing Katrin has to police. We map stages and currency, and Rotterdam submits their forecast in Lattice for a few weeks. Priya does most of the mapping work, and Katrin just has to create an integration user and approve the connected app. That's maybe two hours of her time, total.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 1162,
      text: "Read-only would help a lot. Katrin's biggest fear is something writing into her org that she didn't set up.",
    },
    {
      speaker: "David Lee",
      timestamp: 1192,
      text: "Yeah. I like that. Rotterdam's manager, Joost, is also super keen, he's been asking about it since he saw our forecast call.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1228,
      text: "An eager manager is exactly who you want in a pilot. So on pricing, and I'll put this in a proposal properly, you're on Growth at sixty-five per seat. Adding forty seats mid-term, I'd co-term them to your renewal in March so you're not juggling two contracts.",
    },
    {
      speaker: "David Lee",
      timestamp: 1289,
      text: "Co-terming is good. I'll need to show finance the number, though. Forty seats is a new budget line for EMEA, and their finance director is, um, careful.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1329,
      text: "Understood. I'll give you a version with the full forty and a version that ramps, Rotterdam first and then the rest in Q1. That way you have options for that conversation.",
    },
    {
      speaker: "David Lee",
      timestamp: 1373,
      text: "Perfect. Okay, so I think we're agreed: we go ahead with the expansion pilot for EMEA, starting with Rotterdam, read-only on the EMEA org.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1407,
      text: "Agreed. I'll get the proposal over to you by Friday so you can use it in your QBR prep. Okay, Rachel, your list. What's frustrating you?",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 1458,
      text: "Okay. So it's mostly the API. I'm building a pipeline that pulls Lattice forecast snapshots into our data warehouse so finance can put it next to bookings in Power BI. The basic endpoints are fine. But the docs for the bulk endpoints are really thin.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1522,
      text: "Thin how? Give me a specific, so I can take it back to the team.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 1546,
      text: "So, the bulk export for opportunity history. The docs say it's paginated, but they don't say whether the cursor is stable if data changes mid-export. And there's no example of the async job flow at all, like, you start the export, then you poll, then what? I had to figure out the job status values by trial and error.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 1625,
      text: "Yeah, I lost a day and a half on it. And I hit the rate limit twice, because I didn't know the bulk endpoints have their own limit, separate from the regular one.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1668,
      text: "Ugh, I'm sorry, that's frustrating. And you're right, that should be in the docs. I actually know Ghulam on our backend team put together example scripts for the bulk export last month, Python and a curl walkthrough, including the polling loop and the rate limit headers. It just hasn't made it into the public docs yet.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1745,
      text: "Let me grab it right now. Okay, I'm dropping the link in the chat. It's a shared folder: the Python script, the curl walkthrough, and a short readme on job statuses. To answer your cursor question, the readme says the cursor is snapshot-based, so it's stable for the length of the job.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 1817,
      text: "Oh, this is great. Even rough would've been fine, but this is exactly what I was missing. The polling loop is literally the part I got stuck on.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1851,
      text: "I'll also flag the gaps to Jordan, our head of product, so it actually gets fixed in the public docs. Beyond the examples, though, would a proper API training session help? Not just you, Rachel, but whoever else on your team is going to maintain this.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 1908,
      text: "Yes, honestly. Me and our data engineer, Mateo. He'll own the warehouse side long-term. And if EMEA comes on, we'll need the multi-org stuff through the API too.",
    },
    {
      speaker: "David Lee",
      timestamp: 1950,
      text: "Can we make that a working session and not a slide deck? Rachel learns by breaking things.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 1981,
      text: "Ha, definitely hands-on. I'll get Priya on it with you. Ninety minutes, bring your actual pipeline code, and we'll cover bulk export, webhooks, and multi-org. How does the week of the fifth look?",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 2028,
      text: "Week of the fifth works. Just not Monday, we have month-start close stuff.",
    },
    {
      speaker: "David Lee",
      timestamp: 2095,
      text: "Emma, one thing I wanted to raise before I forget. When EMEA comes on, is there anything security-wise we should expect? Their IT team is a bit more strict. GDPR and all that.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 2140,
      text: "Good question. We have a DPA with standard contractual clauses that covers GDPR, and our SOC 2 Type II report. Your US team already went through review with those, so EMEA IT should mostly be confirming the DPA covers them. I'll include both with the proposal so they have them upfront.",
    },
    {
      speaker: "David Lee",
      timestamp: 2207,
      text: "Great, that saves me a round trip. Okay, what else is on your side, Emma?",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 2234,
      text: "Just a quick product preview. There's a scenario-planning feature in beta, where managers model what happens if certain deals slip. Given how much your managers are in the forecast module now, I think you'd be a good fit for the beta. No pressure, just putting it on the radar.",
    },
    {
      speaker: "David Lee",
      timestamp: 2297,
      text: "Interesting. Let's revisit after EMEA. I don't want Rachel to have three projects at once.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 2323,
      text: "Thank you, David.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 2339,
      text: "Ha, message received. Okay, let me back up and recap. First, Q3: weekly active users up thirty-four percent, twenty-one of twenty-six managers forecasting in Lattice, and commit accuracy within six percent. Second, EMEA: we're going ahead with an expansion pilot starting with the Rotterdam team, read-only against the EMEA org.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 2408,
      text: "Actions: I'll prepare the expansion proposal with the full forty and a ramped option, co-termed to March, plus the DPA and SOC 2. I'll schedule the hands-on API training with Priya for you and Mateo. And I just shared the bulk API examples, so that one's done.",
    },
    {
      speaker: "David Lee",
      timestamp: 2467,
      text: "And I'll talk to Katrin this week about the integration user and see how many hours she can realistically give us.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 2498,
      text: "That'd be great. And normally we'd do the next review in ninety days, but with the EMEA pilot starting, I'd like to check back in thirty. Does late October work?",
    },
    {
      speaker: "David Lee",
      timestamp: 2540,
      text: "Yes, thirty days makes sense. Let's say the week of the nineteenth. And Rachel, bring Mateo to that one too, if the pipeline's live by then he should see the numbers.",
    },
    {
      speaker: "Emma Rodriguez",
      timestamp: 2584,
      text: "Perfect, I'll add Mateo to the invite. I think that covers everything on my list. Anything else from either of you?",
    },
    {
      speaker: "David Lee",
      timestamp: 2615,
      text: "Nope, I think that's it. Thanks, Emma, this was really useful.",
    },
    {
      speaker: "Rachel Osei",
      timestamp: 2636,
      text: "Thanks! And thanks for the scripts, seriously.",
    },
  ],
  summary: {
    executive_summary:
      "Northwind had a strong Q3. Weekly active users rose about 34% (112 to 150 on 180 seats), 21 of 26 managers now submit forecasts in Lattice, and commit accuracy improved to within 6%. The team agreed to an EMEA expansion pilot starting with the 11-person Rotterdam team, read-only against EMEA's separate Salesforce org. Rachel raised thin bulk API documentation, which Emma partly addressed on the call by sharing example scripts.",
    key_points: [
      "Forecast module adoption rose from 8 to 21 of 26 managers after David required that the Monday forecast call run out of Lattice. The five holdouts are mostly in the Midwest region.",
      "Q3 commit landed within 6% of actual, compared with 14.5% off in Q2. David will use this in next week's leadership QBR to support the EMEA request.",
      "EMEA is about 40 seats on a separate Salesforce org from the Vandermeer Freight acquisition, with seven stages instead of five and a custom currency field. Lattice supports multiple orgs in one workspace, each with its own field mapping.",
      "The bulk export docs don't explain cursor stability, the async job flow, or the separate bulk rate limit. Rachel lost a day and a half working this out by trial and error.",
      "The new EMEA seats would be co-termed to the March renewal at the Growth rate. EMEA IT will likely ask about GDPR, which the DPA and SOC 2 Type II report cover.",
    ],
    decisions: [
      "Proceed with an EMEA expansion pilot starting with the Rotterdam team (11 seats), connected read-only to the EMEA Salesforce org.",
      "Hold the next success review in 30 days (week of October 19) instead of the usual 90, and include Mateo.",
    ],
    concerns: [
      "EMEA's separate Salesforce org makes implementation more complex: different stage names, record types, and a custom currency field that Priya needs to review.",
      "Admin bandwidth is limited. Katrin, the only EMEA Salesforce admin, is part-time and busy with a CPQ project through November.",
      "The thin bulk API documentation is slowing Rachel's data warehouse pipeline, and she has already hit the bulk rate limit twice.",
    ],
    action_items: [
      {
        task: "Share bulk API example scripts (Python, curl walkthrough, job-status readme) with Rachel",
        owner: "Emma Rodriguez",
        dueDate: "Sep 22",
        status: "completed",
        priority: "medium",
      },
      {
        task: "Prepare the EMEA expansion proposal with a full 40-seat option and a ramped option (Rotterdam first), co-termed to March, with the DPA and SOC 2 report attached",
        owner: "Emma Rodriguez",
        dueDate: "Sep 25",
        status: "pending",
        priority: "high",
      },
      {
        task: "Schedule a 90-minute hands-on API training with Priya for Rachel and Mateo (week of Oct 5, not Monday)",
        owner: "Emma Rodriguez",
        dueDate: "Sep 29",
        status: "pending",
        priority: "medium",
      },
      {
        task: "Confirm with Katrin the integration user setup and how many hours she can give the EMEA pilot",
        owner: "David Lee",
        dueDate: "Sep 25",
        status: "pending",
        priority: "high",
      },
    ],
  },
  highlights: [
    { timestamp: 144, label: "WAU up 34%" },
    { timestamp: 946, label: "Admin bandwidth concern" },
    { timestamp: 1373, label: "EMEA pilot agreed" },
    { timestamp: 1458, label: "Bulk API docs frustration" },
  ],
};
