import type { Meeting, UpcomingMeeting } from "@/lib/types";
import { acmeProductDemo } from "./meetings/acme-product-demo";
import { northwindCsReview } from "./meetings/northwind-cs-review";
import { globexEnterpriseCall } from "./meetings/globex-enterprise-call";
import { initechDiscoveryCall } from "./meetings/initech-discovery-call";
import { platformArchitectureReview } from "./meetings/platform-architecture-review";
import { q4ProductPlanning } from "./meetings/q4-product-planning";
import { brightlineRenewalReview } from "./meetings/brightline-renewal-review";
import { syncIncidentPostmortem } from "./meetings/sync-incident-postmortem";

/** Seed library, newest first. Stands in for a database. */
export const meetings: Meeting[] = [
  acmeProductDemo,
  northwindCsReview,
  globexEnterpriseCall,
  initechDiscoveryCall,
  platformArchitectureReview,
  q4ProductPlanning,
  brightlineRenewalReview,
  syncIncidentPostmortem,
].sort((a, b) => b.date.localeCompare(a.date));

export function getMeeting(id: string): Meeting | undefined {
  return meetings.find((m) => m.id === id);
}

/** Calendar stub: no real calendar integration, so upcoming calls are fixed. */
export const upcomingMeetings: UpcomingMeeting[] = [
  {
    id: "up-acme-cto",
    title: "Acme CTO Technical Deep-dive",
    company: "Acme Corporation",
    type: "sales",
    date: "2026-09-29T10:00:00-07:00",
    duration: 45,
    platform: "Zoom",
    attendees: ["Sarah Chen", "Priya Nair", "Michael Johnson"],
  },
  {
    id: "up-globex-cfo",
    title: "Globex CFO Business Case Review",
    company: "Globex Industries",
    type: "sales",
    date: "2026-09-30T13:30:00-07:00",
    duration: 30,
    platform: "Microsoft Teams",
    attendees: ["Marcus Webb", "Sarah Chen", "Karen Whitfield"],
  },
  {
    id: "up-migration-rehearsal",
    title: "Postgres Migration Rehearsal",
    company: "Lattice Labs",
    type: "engineering",
    date: "2026-10-01T09:00:00-07:00",
    duration: 60,
    platform: "Google Meet",
    attendees: ["Arslan", "Ghulam Mustafa", "Abdullah Javed"],
  },
];

export function getStats(list: Meeting[] = meetings) {
  const totalMinutes = list.reduce((sum, m) => sum + m.duration, 0);
  const actionItems = list.flatMap((m) => m.summary.action_items);
  return {
    totalMeetings: list.length,
    totalMinutes,
    avgDuration: list.length ? Math.round(totalMinutes / list.length) : 0,
    decisions: list.reduce((sum, m) => sum + m.summary.decisions.length, 0),
    actionItems: actionItems.length,
    openActionItems: actionItems.filter((a) => a.status === "pending").length,
  };
}
