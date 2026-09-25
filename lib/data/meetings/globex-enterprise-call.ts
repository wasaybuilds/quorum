import type { Meeting } from "@/lib/types";

export const globexEnterpriseCall: Meeting = {
  id: "globex-enterprise-call",
  title: "Globex Enterprise Evaluation",
  company: "Globex Industries",
  type: "sales",
  date: "2026-09-18T11:30:00-07:00",
  duration: 40,
  platform: "Microsoft Teams",
  participants: [
    {
      name: "Marcus Webb",
      role: "VP Sales",
      email: "marcus@latticelabs.io",
    },
    {
      name: "Sarah Chen",
      role: "Account Executive",
      email: "sarah@latticelabs.io",
    },
    {
      name: "Karen Whitfield",
      role: "VP of Sales",
      email: "karen.whitfield@globexindustries.com",
      external: true,
    },
    {
      name: "Tom Alvarez",
      role: "IT Security Lead",
      email: "tom.alvarez@globexindustries.com",
      external: true,
    },
  ],
  transcript: [
    {
      speaker: "Sarah Chen",
      timestamp: 9,
      text: "Hi Karen, hi Tom. Thanks for making time on a Friday.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 33,
      text: "Of course. Tom, you're on mute, I think.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 53,
      text: "Sorry, yep. Teams decided to switch my mic to the headset I'm not wearing. Hi, everyone.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 82,
      text: "Classic. So I've brought Marcus Webb, our VP of Sales, since we're getting into commercial terms today. Marcus, do you want to say hi?",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 119,
      text: "Hi, Karen. Hi, Tom. I've been following this one closely with Sarah. A three-hundred-fifty-seat rollout is a big deal for us, and I want to make sure we get the structure right. So, happy to be the person you push on.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 173,
      text: "Ha, I appreciate that, because I will. Okay. Let me frame where we are. The pilot team liked it, my regional VPs liked the demo, so the product question is mostly answered for me. What's left is money, security, and whether we can actually be live for sales kickoff on January twelfth.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 239,
      text: "That's really helpful. Can we start with who signs? Last time you mentioned the CFO would be involved.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 270,
      text: "Yeah. So I own the sales tools budget, and I can sign up to two-fifty a year on my own. Anything multi-year, or over that, goes to Greg Hanlon, our CFO. And for anything that connects to Salesforce and the warehouse, our CTO, Anita Rao, has to sign off on the architecture. Tom does the security review and reports to her.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 344,
      text: "Got it. So three approvals: you on the business case, Anita on architecture with Tom's review, and Greg on the contract.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 378,
      text: "Correct. And Greg's going to look at it as a three-year number, not a monthly per-seat number.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 408,
      text: "That's actually useful, because a three-year structure is where we have the most flexibility. Let me just put the list number on the table so we're working from the same place. Enterprise is ninety-five per seat per month. At three-fifty seats, that's about three ninety-nine a year.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 468,
      text: "Right. And I'll be blunt. I need to be under eighty a seat. Greg already has a quote from a competitor at seventy-two, and I'd rather go with you, but I can't walk into his office at ninety-five.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 519,
      text: "I appreciate you being straight. Seventy-two, is that with SSO and SCIM included, and the native Salesforce sync? Because a lot of those quotes have the sync as an add-on or through a third-party connector.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 568,
      text: "Um, I'd have to check. I think the Salesforce part was a separate line. Tom, do you remember?",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 598,
      text: "It was through a middleware vendor. And SSO was a separate tier, I remember that because I flagged it.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 630,
      text: "Okay. So I don't want to argue about the other quote, but when Greg compares, it should be apples to apples. Here's where I can go: on a three-year term with annual payments upfront, three-fifty seats, I can get you under eighty. I'll put the exact number in the proposal rather than negotiate it live. And I'd like a ramp in year one, so you're not paying for three-fifty seats in January if only two hundred are live.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 722,
      text: "A ramp would help a lot, actually. The EMEA team won't be on until March regardless.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 751,
      text: "Then we build it that way. Two-twenty in January, the full three-fifty from April. I'll model it.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 781,
      text: "Okay. Under eighty, three years, ramp. I can bring that to Greg.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 805,
      text: "One ask back from me. If we get there on price, I'd like a case study once you're live, and a reference call or two a year. Nothing heavy.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 847,
      text: "That's reasonable. I'd need marketing to approve the case study, but a reference call is fine.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 876,
      text: "Great. Tom, can I turn to you? I know you've been waiting patiently.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 902,
      text: "Yeah. So, a few things. First, SSO. We're on Azure AD, Entra, whatever they're calling it this week. I need SAML SSO enforced, no local passwords, and SCIM for provisioning and, more importantly, deprovisioning. When someone leaves, their access has to be gone within the hour.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 961,
      text: "Both are included on Enterprise. SCIM deprovisioning is immediate. The user is disabled as soon as Entra pushes the change, which is usually under a minute. And you can enforce SSO-only at the workspace level so nobody can create a password login.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 1017,
      text: "Good. Second, the questionnaire. Our standard vendor questionnaire is three hundred and twelve questions. I know, I know. I'm sorry, I don't write it.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 1055,
      text: "Yeah. I'll be honest, that's usually where these timelines die. Vendors take four or five weeks to fill it in and then I have follow-ups.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1093,
      text: "So here's how we'd shorten it. We have a SOC 2 Type II report, a current pen test summary, and a pre-filled SIG. Most of your three-twelve should map to answers we already have. Our solutions engineer, Priya, can take the first pass. Would you accept SIG answers mapped to your question numbers for the ones that overlap?",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 1164,
      text: "For the overlapping ones, yes, if you reference the section. I still need everything in our template, though, because it goes into our GRC tool.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1202,
      text: "Understood. Our template, your numbering. I'd aim to get it back to you in two weeks, by October second.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 1234,
      text: "If you can do two weeks, that'd honestly be the fastest I've seen. Okay, third thing, and this is where Anita will spend her time: data flows. We need the forecast data in Snowflake, because finance wants to join it with bookings. So I want to understand exactly how data leaves Lattice and lands in Snowflake.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1305,
      text: "Two options. There's a native Snowflake export that writes to a stage in your Snowflake account on a schedule, hourly at the fastest, using a key-pair service user you create. Or you pull through the REST API. Most customers your size use the native export, because then there are no credentials of ours sitting in your environment.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 1375,
      text: "The native export writes into our account, so you'd have write access to a stage?",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1403,
      text: "Only to the stage and schema you grant. Least privilege, and you can rotate the key whenever you want.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 1435,
      text: "Okay. Anita's going to want to go through that in detail. Diagrams, where it's hosted, encryption, the Salesforce side too.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 1468,
      text: "Then let's give her a proper deep-dive rather than squeezing it in. An hour with Priya and one of our engineering leads, Arslan, who owns the sync architecture. She can ask anything.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 1513,
      text: "She'll like that. She hates sales-y demos, so if it's engineers talking to engineers, even better.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1542,
      text: "I'll get it scheduled today, and Tom, I'll make sure you're on the invite too.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 1570,
      text: "Can I ask about the Salesforce side for a second? That's the one that scares me. We have a lot of automation in our org, flows, validation rules, a CPQ package. The last tool we tried broke a validation rule and reps couldn't save opportunities for half a day.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1633,
      text: "That's a fair fear. Two things. Write-back is off by default and turned on field by field, so on day one nothing writes to Salesforce at all. And we'd do the whole setup in your full sandbox first, including CPQ, before touching production.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 1689,
      text: "Okay. That helps. My admin will want to see the list of fields you write to.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 1719,
      text: "Let's talk timeline, because I think that's the real risk. Today's the eighteenth. Kickoff is January twelfth. Karen, walk us back from that date.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 1756,
      text: "So I want every manager trained before kickoff, and the kickoff itself includes a session on the new forecast process. Which means working in production by mid-December. And nobody does anything the last two weeks of December.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 1806,
      text: "So realistically, production cutover in the first week of December, which means implementation starts early November. A three-hundred-fifty-seat rollout with CPQ in the mix is about five weeks.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 1847,
      text: "And to start in early November, I need the contract signed by, what, end of October?",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 1876,
      text: "End of October. And security review done by then too. So that's roughly six weeks for the questionnaire, Anita's deep-dive, Greg's approval, and legal redlines. It's tight, but it's doable if we run them in parallel instead of one after the other.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 1931,
      text: "The questionnaire in two weeks helps a lot. Then I need about a week to review, and my follow-ups.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 1963,
      text: "My worry is legal. Our legal team takes forever on MSAs.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 1987,
      text: "Then let's get the contract draft to your legal team next week, before the pricing is even finalized. MSA, DPA, and the order form with placeholder pricing. They can redline the terms while Greg looks at numbers.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 2037,
      text: "Oh, that's smart. Yeah. Let's do that.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 2056,
      text: "And for Greg, would it help if we gave him a short demo himself? Fifteen, twenty minutes, focused on forecast accuracy and the three-year business case, not features.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 2097,
      text: "Yes, actually. Greg likes to see the thing. If he sees the forecast rollup against actuals, that sells itself. Keep it short though.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 2133,
      text: "Twenty minutes, max. I'll build it with your pilot team's data so it's real numbers.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 2161,
      text: "So, Karen, here's what I'm hearing, and correct me. Product is validated. We're moving to proposal stage: a three-year, three-fifty-seat Enterprise proposal under eighty a seat with a year-one ramp. In parallel, the security questionnaire, Anita's deep-dive, Greg's demo, and the contract draft to legal.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 2219,
      text: "That's right. Let's move to proposal. I'll warn you, if the number isn't under eighty, it stops at Greg.",
    },
    {
      speaker: "Sarah Chen",
      timestamp: 2252,
      text: "Okay, recap of owners. Marcus sends the contract draft, MSA, DPA and order form, to your legal team by next Friday. I'm scheduling Anita's deep-dive today, preparing Greg's demo, and getting the questionnaire back to Tom by October second.",
    },
    {
      speaker: "Tom Alvarez",
      timestamp: 2305,
      text: "I'll send the questionnaire template over this afternoon, in Excel.",
    },
    {
      speaker: "Karen Whitfield",
      timestamp: 2327,
      text: "Great. Thanks, both of you, this was productive. Have a good weekend.",
    },
    {
      speaker: "Marcus Webb",
      timestamp: 2352,
      text: "You too. Talk soon.",
    },
  ],
  summary: {
    executive_summary:
      "Karen considers the product validated. What's left for Globex is price, security review and a go-live before the January 12 sales kickoff. Marcus committed to a three-year, 350-seat Enterprise proposal under $80/seat with a year-one ramp, and the deal moved to proposal stage. The security questionnaire, the CTO architecture deep-dive, a CFO demo and legal review of the contract will all run in parallel to hit an end-of-October signature.",
    key_points: [
      "Karen can sign up to $250K a year herself. Multi-year contracts go to CFO Greg Hanlon, and anything touching Salesforce or the warehouse needs architecture sign-off from CTO Anita Rao, based on Tom's security review.",
      "At list price, 350 Enterprise seats at $95 comes to about $399K a year. Karen needs to be under $80/seat because Greg has a competing quote at $72. That quote puts Salesforce sync through middleware and charges separately for SSO.",
      "Tom requires enforced SAML SSO on Entra (Azure AD), plus SCIM with deprovisioning within the hour. Both are included on Enterprise.",
      "Finance wants forecast data in Snowflake. Lattice's native Snowflake export writes hourly to a stage in Globex's own account using a least-privilege key-pair user.",
      "Working back from the January 12 kickoff: production cutover in early December, about five weeks of implementation starting early November, so the contract and security review must be done by the end of October.",
    ],
    decisions: [
      "Move Globex to proposal stage: a three-year, 350-seat Enterprise deal under $80/seat, with a year-one ramp (220 seats in January, 350 from April).",
      "Send the contract draft (MSA, DPA, order form with placeholder pricing) to Globex legal before pricing is final, so redlines can run in parallel.",
      "Set up the Salesforce integration in Globex's full sandbox, including CPQ, with write-back off by default, before touching production.",
    ],
    concerns: [
      "Price is the main risk. If the number isn't under $80/seat, Karen says the deal stops at the CFO.",
      "Implementation risk: Globex's Salesforce org has heavy automation and CPQ, and a previous tool broke a validation rule so reps couldn't save opportunities for half a day. Six weeks is tight for the questionnaire, CTO review, CFO approval and legal redlines.",
      "Globex's security questionnaire has 312 questions, and Tom says that's usually where timelines fall apart.",
    ],
    action_items: [
      {
        task: "Send the contract draft (MSA, DPA, order form with placeholder pricing) to Globex legal",
        owner: "Marcus Webb",
        dueDate: "Sep 25",
        status: "pending",
        priority: "high",
      },
      {
        task: "Schedule a one-hour architecture deep-dive for CTO Anita Rao and Tom with Priya and Arslan",
        owner: "Sarah Chen",
        dueDate: "Sep 18",
        status: "completed",
        priority: "high",
      },
      {
        task: "Complete Globex's 312-question security questionnaire in their template, mapping SIG and SOC 2 answers to their question numbers",
        owner: "Sarah Chen",
        dueDate: "Oct 2",
        status: "pending",
        priority: "high",
      },
      {
        task: "Prepare a 20-minute CFO demo for Greg Hanlon using pilot-team data, focused on forecast accuracy and the three-year business case",
        owner: "Sarah Chen",
        dueDate: "Oct 6",
        status: "pending",
        priority: "medium",
      },
    ],
  },
  highlights: [
    { timestamp: 468, label: "Price below $80/seat" },
    { timestamp: 1017, label: "312-question security review" },
    { timestamp: 1756, label: "January kickoff timeline" },
    { timestamp: 2219, label: "Moved to proposal" },
  ],
};
