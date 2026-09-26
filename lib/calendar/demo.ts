import type { UpcomingMeeting } from "@/lib/types";

const at = (day: string, time: string) => `2026-${day}T${time}:00-07:00`;

/** Demo calendar used until a real Google Calendar is connected. Continues the seed library's storylines. */
export const demoUpcoming: UpcomingMeeting[] = [
  {
    id: "demo-acme-cto",
    title: "Acme CTO technical deep-dive",
    start: at("09-29", "10:00"),
    end: at("09-29", "10:30"),
    attendees: [
      { name: "Sarah Chen", email: "sarah@latticelabs.io" },
      { name: "Priya Nair", email: "priya@latticelabs.io" },
      { name: "Dana Whitaker", email: "dana.whitaker@acmecorp.com" },
      { name: "Michael Johnson", email: "michael.johnson@acmecorp.com" },
    ],
    platform: "Zoom",
    external: true,
    source: "demo",
  },
  {
    id: "demo-northwind-api",
    title: "Northwind bulk API training",
    start: at("09-29", "13:00"),
    end: at("09-29", "14:30"),
    attendees: [
      { name: "Priya Nair", email: "priya@latticelabs.io" },
      { name: "Rachel Osei", email: "rachel.osei@northwindlogistics.com" },
    ],
    platform: "Google Meet",
    external: true,
    source: "demo",
  },
  {
    id: "demo-eng-standup",
    title: "Platform team standup",
    start: at("09-30", "09:15"),
    end: at("09-30", "09:30"),
    attendees: [
      { name: "Arslan", email: "arslan@latticelabs.io" },
      { name: "Ghulam Mustafa", email: "ghulam@latticelabs.io" },
      { name: "Abdullah Javed", email: "abdullah@latticelabs.io" },
    ],
    platform: "Google Meet",
    external: false,
    source: "demo",
  },
  {
    id: "demo-globex-cfo",
    title: "Globex CFO business case review",
    start: at("09-30", "13:30"),
    end: at("09-30", "14:00"),
    attendees: [
      { name: "Marcus Webb", email: "marcus@latticelabs.io" },
      { name: "Sarah Chen", email: "sarah@latticelabs.io" },
      { name: "Greg Hanlon", email: "greg.hanlon@globex.com" },
      { name: "Karen Whitfield", email: "karen.whitfield@globex.com" },
    ],
    platform: "Microsoft Teams",
    external: true,
    source: "demo",
  },
  {
    id: "demo-migration-rehearsal",
    title: "Postgres migration rehearsal",
    start: at("10-01", "09:00"),
    end: at("10-01", "10:00"),
    attendees: [
      { name: "Arslan", email: "arslan@latticelabs.io" },
      { name: "Ghulam Mustafa", email: "ghulam@latticelabs.io" },
      { name: "Abdullah Javed", email: "abdullah@latticelabs.io" },
    ],
    platform: "Google Meet",
    external: false,
    source: "demo",
  },
  {
    id: "demo-brightline-checkin",
    title: "Brightline bi-weekly success check-in",
    start: at("10-01", "15:00"),
    end: at("10-01", "15:30"),
    attendees: [
      { name: "Emma Rodriguez", email: "emma@latticelabs.io" },
      { name: "Nora Castillo", email: "nora.castillo@brightlinehealth.com" },
    ],
    platform: "Microsoft Teams",
    external: true,
    source: "demo",
  },
  {
    id: "demo-design-review",
    title: "AI search design review",
    start: at("10-02", "11:00"),
    end: at("10-02", "12:00"),
    attendees: [
      { name: "Hannah Kim", email: "hannah@latticelabs.io" },
      { name: "Aisha Rahman", email: "aisha@latticelabs.io" },
      { name: "Leo Martins", email: "leo@latticelabs.io" },
    ],
    platform: "Zoom",
    external: false,
    source: "demo",
  },
];
