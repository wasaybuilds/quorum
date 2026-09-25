import type { Meeting } from "@/lib/types";

export const acmeProductDemo: Meeting = {
  id: "acme-product-demo",
  title: "Acme Product Demo",
  company: "Acme Corporation",
  type: "sales",
  date: "2026-09-24T14:00:00-07:00",
  duration: 30,
  platform: "Zoom",
  participants: [
    {
      name: "Sarah Chen",
      role: "Account Executive",
      email: "sarah@latticelabs.io",
    },
    {
      name: "Michael Johnson",
      role: "Director of Revenue Operations",
      email: "michael.johnson@acmecorp.com",
      external: true,
    },
    {
      name: "Lisa Park",
      role: "Sales Operations Manager",
      email: "lisa.park@acmecorp.com",
      external: true,
    },
    {
      name: "Priya Nair",
      role: "Solutions Engineer",
      email: "priya@latticelabs.io",
    },
  ],
  transcript: [
    {
      speaker: "Sarah Chen",
      timestamp: 8,
      text: "Hey everyone, thanks for making the time. Can you all hear me okay?",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 16,
      text: "Yep, loud and clear. Lisa's on too. We're in the same office today, just on separate laptops so we don't get the echo thing.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 29,
      text: "Perfect. So, quick agenda. Last time, Michael, you walked us through how your team forecasts today. Priya's going to show pipeline analytics and forecasting live, on a sandbox we loaded with data shaped like yours, and then I want to leave a good chunk at the end for pricing, security and timing. Does that work?",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 54,
      text: "That works. The one thing I'll say upfront is that timing is the big one for us. We want something live before Q4 close. Honestly, before the December board meeting.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 78,
      text: "Okay, I will keep that in mind as I go. Let me share my screen. Okay, you should see the pipeline dashboard. This sandbox has about eighteen thousand opportunities in it, which is roughly the volume Lisa mentioned last time. This is the forecast rollup, by region and then by rep: commit, best case, pipeline. And the key thing is it refreshes off Salesforce continuously, so what you see here is what's in Salesforce right now, not last night's export.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 134,
      text: "Continuously meaning what, exactly? Because our current tool says real-time and it's, uh, it's really more like every six hours.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 146,
      text: "Fair question. The native sync is bi-directional and event-driven, so typically a change lands in under two minutes. If Lisa runs a big Data Loader job, say ten thousand records at once, you might see five to ten minutes of catch-up. That's about the worst case we see.",
    },
    {
      speaker: "Lisa Park",
      timestamp: 180,
      text: "Okay, that's fine. So this is the thing I really wanted to ask. We have a lot of custom fields. There's a custom Forecast Override field, and we have a custom object for partner-sourced deals that hangs off the opportunity. Would we need to build something custom for that?",
    },
    {
      speaker: "Priya Nair",
      timestamp: 208,
      text: "Custom fields, no, those just map in the admin UI. Custom objects are supported by the native sync too, you'd map the partner object and its lookup to opportunity. I'd honestly steer you away from building a custom integration on our API unless you have something really exotic.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 242,
      text: "We actually had a contractor quote us on building a custom connector. Six weeks, I think.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 251,
      text: "Yeah, and then somebody on your side has to maintain it every time Salesforce bumps an API version. The native sync is covered by our support and the uptime SLA, so that's on us, not you.",
    },
    {
      speaker: "Lisa Park",
      timestamp: 331,
      text: "Oh, nice. Does it flag conflicts? Like if both sides change the same record?",
    },
    {
      speaker: "Priya Nair",
      timestamp: 339,
      text: "Last write wins by default, with a conflict log you can review. Or you can set Salesforce as the source of truth per field, which is what most rev ops teams do for amount and close date.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 372,
      text: "Can you show the, sorry, the rep-level view? That's what my managers would actually live in.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 381,
      text: "Sure. Clicking into a manager, you get each rep's commit next to their historical accuracy. This little score is how close their commit has landed over the last four quarters. Green is within ten percent.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 424,
      text: "That's it. That's exactly the conversation I want my managers having in one-on-ones. Right now that's a spreadsheet Lisa builds every Monday.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 446,
      text: "Last thing before I stop sharing: deal-risk flags. These badges show up when a deal has had no logged activity in fourteen days, or the close date has been pushed twice, or the amount dropped more than twenty percent. You can tune all the thresholds. Managers usually say this is the part they didn't know they needed.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 522,
      text: "Okay. Yeah. I've seen enough to know this solves the problem. So let's talk about the harder stuff, which is security. Our security team, Raj runs GRC, is going to want a full vendor review. That's standard for anything that touches Salesforce data. The last one we did took, I want to say, seven weeks. And that's my real concern, honestly. The compliance review is the long pole here, not the product.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 573,
      text: "What usually speeds it up is handing over the whole package on day one. We're SOC 2 Type II, the current report runs through June, and we have a third-party pen test summary from this spring. We also have SIG Lite and CAIQ already filled in, so Raj isn't starting from a blank questionnaire.",
    },
    {
      speaker: "Lisa Park",
      timestamp: 612,
      text: "Do you support SSO? Raj is going to ask about Okta before anything else.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 620,
      text: "Yes, SAML SSO with Okta, Azure AD or Google, plus SCIM provisioning. One caveat: SSO and SCIM are on the Enterprise plan, not Growth.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 644,
      text: "Which matters for pricing, we'll get to that. Here's what I'll do. I'll send you the SOC 2 report and the pen test summary through our trust portal, and you can get them to Raj this week. Does that sound right?",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 658,
      text: "Yes. If he has them by Friday, that'd be great. We already have the NDA in place from the first call, right?",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 668,
      text: "We do, signed on the tenth, so we're covered. Okay, pricing. You said eighty-five seats to start?",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 680,
      text: "Eighty-five to start. Maybe a hundred and ten next year if we bring the partner team in.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 690,
      text: "So list is sixty-five per seat per month on Growth and ninety-five on Enterprise, on an annual contract. Since Raj is going to require SSO, realistically you're on Enterprise.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 712,
      text: "Yeah. Ninety-five times eighty-five times twelve, that's, what, ninety-seven thousand? That's more than I have budgeted. I've got about seventy-five set aside for this whole line item, so either I find more money or we find a way to get that number down.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 741,
      text: "Understood, and I appreciate you telling me the real number. There are a few levers: a multi-year term, aligning the start date with your fiscal year, and a case study if the rollout goes well. I don't want to throw out a figure on the call, so let me put together a proper pricing proposal with two or three options.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 779,
      text: "That's fair. And just so you know the process, anything over fifty k has to go through our CTO, Dana Whitaker. She'll want to see the product herself before she signs off. It's not just a budget check with her. She'll want the architecture and how the sync works, and she'll definitely ask about data residency, and what happens to our data if we ever leave. Thirty minutes max, she's slammed. Send me a few slots for next week, Tuesday and Thursday afternoons are usually her best.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 840,
      text: "I can run that one. I'll focus on the sync architecture, the API, and where the data lives. Short version is we're on AWS in us-east and us-west, encrypted at rest and in transit, and full export through the API or CSV. Since Salesforce stays your system of record, you never lose anything.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 878,
      text: "Great. Okay, timing. You said live before Q4 close. What does live actually mean for you?",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 890,
      text: "Live means my managers run the forecast call out of it. Our Q4 ends December thirty-first, and I want at least the December forecast calls happening in Lattice.",
    },
    {
      speaker: "Lisa Park",
      timestamp: 910,
      text: "Which really means it has to be working by mid-November. I'm not switching tools in the last few weeks of the quarter, the reps would riot.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 929,
      text: "For a setup like yours, implementation is usually three to four weeks. The sync connects in a day or two, the mapping and the partner object take about a week, and then manager training.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 958,
      text: "So if the security review takes seven weeks and then implementation is four on top of that, we're in January. That doesn't work.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 974,
      text: "Right, so here's what I'd suggest. Instead of doing those back to back, we run a two-week pilot in parallel with the security review. Lattice connected to a Salesforce sandbox, two of your managers, Lisa as admin. By the time Raj signs off, the mapping's already done and you're mostly just pointing it at production.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 1024,
      text: "Would the pilot need Raj's sign-off too?",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1032,
      text: "If it's against a sandbox with masked data, most security teams are fine with a lighter review for that. But definitely ask him.",
    },
    {
      speaker: "Lisa Park",
      timestamp: 1048,
      text: "Our full sandbox is a full copy, so it's real data. Hmm. But we have a partial copy sandbox I can refresh with masking turned on.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 1076,
      text: "Okay. I'm, yeah, I'm good with that. Let's do the two-week pilot. If it goes well, those two managers become the champions for the rollout.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1096,
      text: "Perfect. And just to confirm, we're going with the native Salesforce sync, no custom build?",
    },
    {
      speaker: "Lisa Park",
      timestamp: 1106,
      text: "Native sync, yes. I'll tell the contractor we won't need the connector.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1118,
      text: "Lisa, if you can have the partial copy refreshed by the end of next week, I'll connect it and we kick off the pilot Monday, October fifth. Two weeks takes us to the sixteenth.",
    },
    {
      speaker: "Lisa Park",
      timestamp: 1142,
      text: "Yeah, I can do that. For managers I'd say Carlos and Jen. Their teams are the messiest in the spreadsheet.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1192,
      text: "Michael, one more question on budget. If Dana likes what she sees, is the gap between seventy-five and the Enterprise number solved by her, or is that a separate conversation with finance?",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 1214,
      text: "Probably Dana plus our CFO. If Dana says it's the right tool, I can usually get finance to move. But I can't walk in at ninety-seven without some kind of concession, they'll just send me back.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1240,
      text: "Totally fair. That's what the proposal options are for. I'll make sure one of them fits inside your current budget, so you have something to take in either way.",
    },
    {
      speaker: "Lisa Park",
      timestamp: 1286,
      text: "Sorry, can I sneak in one nerdy integration question? What happens to the sync when Salesforce is down, or we hit our API limits? Last quarter we hit the daily cap twice because of a marketing tool.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1306,
      text: "Good one. We queue changes and retry with backoff, so nothing gets dropped. And we use Change Data Capture plus the Bulk API, so our footprint on your daily limit is small. For eighteen thousand opportunities you'd be looking at a few thousand calls a day, tops. I'll show you the API usage panel during the pilot.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1390,
      text: "Okay, let me recap so we're all aligned. One, I'm sending the SOC 2 Type II report and the pen test summary so Raj has them by Friday. Two, I'll send Michael slots for a thirty-minute technical demo with Dana next Tuesday or Thursday, with Priya running it. Three, I'll get you a pricing proposal with a few options, including one inside your seventy-five.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1448,
      text: "And on my side, I'll set up the pilot workspace so it's ready to connect as soon as Lisa's sandbox is refreshed.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 1462,
      text: "When can I expect the proposal? I'd like to have it before I talk to Dana so I'm not caught flat-footed.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1474,
      text: "I'll have it to you by Wednesday the thirtieth, so it lands before her demo.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 1512,
      text: "I'll be honest, I'm still a little nervous about the timeline. But running the pilot in parallel makes me feel a lot better about it.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1530,
      text: "That's fair, it is tight. The one thing that could really slip it is the security review, so if Raj has follow-up questions, send them straight to me and Priya and we'll turn them around in a day or two. I'll also send a mutual plan with every date on it along with the docs.",
    },
    {
      speaker: "Lisa Park",
      timestamp: 1612,
      text: "Can you put the sandbox refresh date on that plan too? Otherwise I'll forget.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1620,
      text: "Yes, I'll put it on there with your name in bold.",
    },
    {
      speaker: "Michael Johnson",
      timestamp: 1702,
      text: "Alright, I think that's everything from us. Thanks, Sarah. Thanks, Priya, that was a really good demo.",
    },
    {
      speaker: "Priya Nair",
      timestamp: 1714,
      text: "Thanks, both of you. Lisa, I'll email you the sandbox checklist this afternoon.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1741,
      text: "Thanks, everyone. Talk soon.",
    },
  ],
  summary: {
    executive_summary:
      "Priya demoed Lattice's forecasting and native Salesforce sync to Acme's revenue operations team, and Michael confirmed it solves their weekly spreadsheet forecasting problem. Acme agreed to a two-week pilot on a masked Salesforce sandbox, running alongside the security review, and chose the native sync over a custom connector. The open risks are a tight Q4 timeline, a vendor security review that last took seven weeks, and a $75K budget against roughly $97K list for Enterprise.",
    key_points: [
      "Acme wants managers running December forecast calls in Lattice, so it has to be working by mid-November. Q4 ends December 31.",
      "Lisa's custom Forecast Override field and partner-deal custom object can be mapped in the native sync, so the contractor's six-week custom connector isn't needed.",
      "Raj (GRC) will run a full vendor security review and will ask about Okta SSO first. SSO and SCIM are Enterprise-only, which pushes Acme to $95/seat.",
      "85 seats on Enterprise is about $97K a year at list, against Michael's $75K budget. Any purchase over $50K needs sign-off from CTO Dana Whitaker, and the CFO likely has to be involved.",
      "Lisa's current Monday forecast spreadsheet takes half a day. Rep-level commit accuracy and deal-risk flags drew the strongest reaction from the team.",
    ],
    decisions: [
      "Run a two-week pilot starting October 5 on a masked partial-copy Salesforce sandbox, with managers Carlos and Jen and Lisa as admin, alongside the security review.",
      "Use Lattice's native Salesforce sync instead of building a custom integration. Lisa will cancel the contractor's connector quote.",
    ],
    concerns: [
      "The timeline is tight. A seven-week security review followed by 3-4 weeks of implementation would push go-live into January, past the mid-November cutoff.",
      "The security and compliance review is the main source of delay, and it isn't yet clear whether the pilot itself needs Raj's approval.",
      "Enterprise pricing is about $22K over Michael's budget, and finance won't approve list price without a concession.",
    ],
    action_items: [
      {
        task: "Send the SOC 2 Type II report and pen test summary through the trust portal so Raj can start the security review",
        owner: "Sarah Chen",
        dueDate: "Sep 25",
        status: "pending",
        priority: "high",
      },
      {
        task: "Send Michael time slots for a 30-minute technical demo with CTO Dana Whitaker (sync architecture, data residency, data export)",
        owner: "Sarah Chen",
        dueDate: "Sep 28",
        status: "pending",
        priority: "high",
      },
      {
        task: "Send a pricing proposal with 2-3 options, including one inside the $75K budget",
        owner: "Sarah Chen",
        dueDate: "Sep 30",
        status: "pending",
        priority: "high",
      },
      {
        task: "Set up the pilot workspace and send Lisa the sandbox checklist",
        owner: "Priya Nair",
        dueDate: "Oct 2",
        status: "pending",
        priority: "medium",
      },
    ],
  },
  highlights: [
    { timestamp: 208, label: "Custom objects in native sync" },
    { timestamp: 522, label: "Security review concern" },
    { timestamp: 712, label: "Budget gap" },
    { timestamp: 1076, label: "Pilot approved" },
  ],
};
