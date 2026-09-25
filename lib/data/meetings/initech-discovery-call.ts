import type { Meeting } from "@/lib/types";

export const initechDiscoveryCall: Meeting = {
  id: "initech-discovery-call",
  title: "Initech Discovery Call",
  company: "Initech",
  type: "sales",
  date: "2026-09-15T09:00:00-07:00",
  duration: 25,
  platform: "Zoom",
  participants: [
    {
      name: "Sarah Chen",
      role: "Account Executive",
      email: "sarah@latticelabs.io",
    },
    {
      name: "Bill Lumbergh",
      role: "VP Sales Operations",
      email: "bill.lumbergh@initech.com",
      external: true,
    },
    {
      name: "Samir Nagheenanajar",
      role: "Salesforce Administrator",
      email: "samir.nagheenanajar@initech.com",
      external: true,
    },
  ],
  transcript: [
    {
      speaker: "Sarah Chen",
      timestamp: 7,
      text: "Good morning, Bill. Is Samir joining us?",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 22,
      text: "Yeah, he should be, uh, he's just grabbing coffee. Oh, there he is.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 42,
      text: "Morning. Sorry, the coffee machine on our floor is broken again.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 61,
      text: "No worries at all. So, I have twenty-five minutes blocked, and I mostly want to listen today. I'd love to understand how you forecast now, what's pushing you to look at something new, and what a good outcome looks like. Does that work?",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 105,
      text: "Yeah, that works. So, okay. Right now our forecast is a spreadsheet. Well, it's six spreadsheets, one per regional manager, and then I have a master one that pulls from all of them. Every Thursday.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 142,
      text: "And the managers fill theirs in by hand from Salesforce?",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 160,
      text: "By hand. They export their pipeline, they adjust it, they type in their commit. Half of them change the columns, so my formulas break. I'd say I spend most of Thursday fixing the master.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 197,
      text: "And then people ask me why the spreadsheet doesn't match Salesforce. And it never does, because nobody updates the close dates.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 223,
      text: "That's really common. How many people would be using a forecasting tool? Reps and managers both?",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 246,
      text: "About sixty. Fifty-two reps, six managers, me, and Samir for admin.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 264,
      text: "Got it. Have you looked at tools before, or is this the first time?",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 285,
      text: "Yeah, so, this is the sensitive part. We had a vendor two years ago. I won't say who. And their Salesforce sync was a disaster.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 315,
      text: "It duplicated records. About four thousand duplicate contacts and a few hundred duplicate opportunities, in the first week. Their sync matched on name instead of the Salesforce ID, and anything with a slightly different spelling created a new record.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 356,
      text: "Oh no. Four thousand?",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 368,
      text: "Four thousand one hundred and something. I spent three weeks cleaning it up with DemandTools, and we still find the occasional one. So, honestly, I'm going to be very skeptical of anything that writes into our org.",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 408,
      text: "Yeah, and I had to explain to our CFO why the pipeline report was suddenly thirty percent bigger. That was not a fun meeting.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 436,
      text: "I can imagine. Look, that's a completely fair reason to be skeptical, and I don't want you to just take my word for it. Let me explain how our sync works, and then Samir, you tell me where the holes are.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 479,
      text: "Sure.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 489,
      text: "So first, we never match on name. Every record in Lattice is keyed to the eighteen-character Salesforce ID. If a record doesn't have an ID, we don't create it in Salesforce. Second, by default the sync is read-only. Lattice reads from Salesforce and writes nothing back until you turn on write-back, field by field. And third, we don't create contacts or accounts in Salesforce at all. The write-back is limited to fields on existing opportunities, like forecast category or next step.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 564,
      text: "So it can't create an opportunity?",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 578,
      text: "It can't. Only update fields you've allowed on opportunities that already exist.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 597,
      text: "Okay. That's a lot better than what we had. What about when someone merges two accounts in Salesforce? That's where the old one really fell apart.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 628,
      text: "Good question. We listen for merge events, so when an account merges, the losing record gets re-pointed to the surviving ID in Lattice. Nothing's duplicated on our side. But honestly, I'd rather you test that yourself than believe me.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 668,
      text: "Yeah, I'd want to.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 681,
      text: "So, what if we set up a technical validation? We connect a Lattice sandbox to one of your Salesforce sandboxes, and you try to break it. Merges, bulk updates, weird spellings, whatever caused problems last time. No production data touched.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 723,
      text: "I have a developer sandbox I can use. I'd want to load it with a copy of real-looking data first, maybe five hundred accounts.",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 752,
      text: "Yeah, I like that. I'm not buying anything Samir hasn't tried to break first. So yeah, let's do the sandbox test.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 778,
      text: "Perfect. I'll get the Lattice sandbox provisioned by Thursday. And I'll send over our data-mapping doc today, which lists every field we read, every field we can write, and exactly how records are matched. Samir, that should answer most of your questions before you start.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 824,
      text: "That would be great. Does it say what permissions the integration user needs? Security is going to ask me that.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 849,
      text: "It does, there's a permission set you can install. And if security wants more, we're SOC 2 Type II, and I can send the report under NDA.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 881,
      text: "Okay. Probably later. For the sandbox the permission set is enough.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 899,
      text: "Sounds good. Bill, can I ask about budget and timing? Just so I know what's realistic.",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 922,
      text: "Yeah, so, I'm going to go ahead and be honest, the budget's small. I have about forty thousand for this, for the year. That's it.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 951,
      text: "Okay, that's helpful. For sixty seats, our Growth plan is sixty-five per seat per month, so list is about forty-seven thousand a year. Growth has the forecasting, the pipeline analytics and the native Salesforce sync. It doesn't include SSO, which is Enterprise.",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 994,
      text: "Forty-seven. So I'm about seven short.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1009,
      text: "A little, yeah. Do you need SSO? That's usually what decides the plan.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 1029,
      text: "We're on Google Workspace. It'd be nice, but it's not a hard requirement for us at this point.",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 1053,
      text: "Is there any flexibility on the per-seat? Or could we start with fewer seats? Maybe just the managers and the top reps?",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1080,
      text: "There's some flexibility, especially on an annual contract signed with a specific start date. I'd rather not quote you something on the fly. I'd also be careful about cutting seats, since forecasting really works best when the reps are updating their own deals. Let me come back with a couple of options once the sandbox test is done.",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 1136,
      text: "Okay. That's fair.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1148,
      text: "And timing? When would you want to be up and running?",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 1167,
      text: "Q1. January. Our fiscal year starts January first, and I want the new year's forecast in the new tool. I don't want to switch mid-year.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1196,
      text: "Makes sense. And the budget, is it this year's money or next year's?",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 1216,
      text: "Next year's. Which means our CFO has to approve it in the budget cycle, and that closes around mid-November. So I need a number before then.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1247,
      text: "Got it. So the CFO needs to sign off by mid-November, and that means the sandbox test should be done by, say, early October so there's time for a proposal.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 1280,
      text: "If the sandbox is ready Thursday, I can test next week. The week after is our release, so it has to be next week.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1309,
      text: "Okay, then let's put a follow-up call on the calendar for the end of the month to go through what you found. Say Tuesday the twenty-ninth?",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 1340,
      text: "The twenty-ninth works. Mornings are better.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 1354,
      text: "Works for me.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1366,
      text: "Great. So to recap: I'm sending the data-mapping doc today, provisioning the sandbox by Thursday, and Samir's testing next week, merges, bulk loads, duplicates, all of it. Then we meet on the twenty-ninth to review, and if it holds up, I'll bring pricing options that work with your budget.",
    },
    {
      speaker: "Bill Lumbergh",
      timestamp: 1415,
      text: "Yeah. That sounds good. If it doesn't duplicate anything, I'm, uh, I'm interested.",
    },
    {
      speaker: "Samir Nagheenanajar",
      timestamp: 1435,
      text: "I'll try very hard to make it duplicate things.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1452,
      text: "Ha, please do. Thanks, both of you. Talk soon.",
    },
  ],
  summary: {
    executive_summary:
      "Initech forecasts across six manager spreadsheets that Bill consolidates by hand every Thursday. The team is wary of new tools because a previous vendor's Salesforce sync created more than 4,000 duplicate records. Sarah explained that Lattice matches on Salesforce IDs and is read-only by default, and both sides agreed to a technical validation in a Salesforce sandbox before any pricing discussion. Budget is tight: about $40K for 60 seats against roughly $47K list on Growth, with a Q1 start that needs CFO approval by mid-November.",
    key_points: [
      "Today's process is six regional spreadsheets feeding a master one. Managers type their commit in by hand, the formulas break, and the numbers never match Salesforce.",
      "A previous vendor's sync matched on name instead of Salesforce ID. It created about 4,100 duplicate contacts plus several hundred duplicate opportunities, and Samir spent three weeks cleaning them up.",
      "Lattice keys every record to the 18-character Salesforce ID, is read-only until write-back is enabled field by field, never creates records, and re-points merged accounts to the surviving ID.",
      "There are 60 seats (52 reps, 6 managers, Bill, Samir). Growth at $65/seat comes to about $47K a year against Bill's $40K budget. SSO isn't a hard requirement.",
      "Initech wants to go live for the fiscal year starting January 1. The budget comes from next year's cycle, which the CFO closes around mid-November.",
    ],
    decisions: [
      "Run a technical validation of the Salesforce sync: connect a Lattice sandbox to Samir's developer sandbox (about 500 accounts) and stress-test merges, bulk loads and duplicate scenarios before any purchase discussion.",
      "Hold off on pricing until the sandbox test is done, then bring options that fit the budget.",
    ],
    concerns: [
      "Duplicate data is the biggest worry after the last vendor's sync, and Samir is skeptical of anything that writes into their org.",
      "Budget is about $7K short of Growth list price for 60 seats, and Bill asked about discounts or starting with fewer seats.",
      "Timing is tight: validation has to finish next week because of Samir's release, and a proposal needs CFO approval by mid-November for a January start.",
    ],
    action_items: [
      {
        task: "Send the data-mapping doc (fields read and written, record-matching rules, integration user permission set)",
        owner: "Sarah Chen",
        dueDate: "Sep 15",
        status: "completed",
        priority: "high",
      },
      {
        task: "Provision a Lattice sandbox connected to Initech's Salesforce developer sandbox",
        owner: "Sarah Chen",
        dueDate: "Sep 17",
        status: "completed",
        priority: "high",
      },
      {
        task: "Run the sync validation: account merges, bulk updates and duplicate edge cases on about 500 test accounts",
        owner: "Samir Nagheenanajar",
        dueDate: "Sep 25",
        status: "completed",
        priority: "high",
      },
      {
        task: "Hold a follow-up call to review the sandbox results",
        owner: "Sarah Chen",
        dueDate: "Sep 29",
        status: "pending",
        priority: "medium",
      },
      {
        task: "Prepare pricing options for 60 seats that fit the roughly $40K budget, ahead of the mid-November CFO budget cycle",
        owner: "Sarah Chen",
        dueDate: "Oct 2",
        status: "pending",
        priority: "medium",
      },
    ],
  },
  highlights: [
    { timestamp: 315, label: "Previous vendor duplicated records" },
    { timestamp: 752, label: "Sandbox validation agreed" },
    { timestamp: 922, label: "Budget constraint" },
  ],
};
