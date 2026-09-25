import type { ActionItem, Meeting } from "@/lib/types";
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

/**
 * "Today" for the demo workspace. Pages are statically rendered, so relative
 * figures (this week, overdue) are anchored to the seed data's timeline rather
 * than the viewer's clock, which keeps them stable and identical on server and client.
 */
export const DEMO_TODAY = new Date("2026-09-25T12:00:00-07:00");

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Parses short due dates like "Sep 28" / "Sept 28" in the demo year. */
export function parseDue(due?: string | null): Date | null {
  const m = due?.toLowerCase().match(/([a-z]{3})[a-z]*\.?\s+(\d{1,2})/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1]);
  if (month === -1) return null;
  return new Date(Date.UTC(DEMO_TODAY.getUTCFullYear(), month, Number(m[2]), 23, 59));
}

export function isOverdue(item: { dueDate?: string | null; status: string }): boolean {
  const due = parseDue(item.dueDate);
  return item.status === "pending" && !!due && due.getTime() < DEMO_TODAY.getTime() - 12 * 3600 * 1000;
}

export function getStats(list: Meeting[] = meetings) {
  const weekAgo = DEMO_TODAY.getTime() - 7 * 24 * 3600 * 1000;
  const actionItems = list.flatMap((m) => m.summary.action_items);
  const people = new Set(list.flatMap((m) => m.participants.map((p) => p.name)));
  return {
    totalMeetings: list.length,
    totalMinutes: list.reduce((sum, m) => sum + m.duration, 0),
    meetingsThisWeek: list.filter((m) => new Date(m.date).getTime() >= weekAgo).length,
    decisions: list.reduce((sum, m) => sum + m.summary.decisions.length, 0),
    actionItems: actionItems.length,
    openActionItems: actionItems.filter((a) => a.status === "pending").length,
    overdue: actionItems.filter(isOverdue).length,
    participants: people.size,
  };
}

export interface OpenActionRow extends ActionItem {
  key: string;
  meeting: Pick<Meeting, "id" | "title">;
}

/** Pending action items across the library, soonest due first. */
export function openActionRows(list: Meeting[] = meetings, limit = 8): OpenActionRow[] {
  return list
    .flatMap((m) =>
      m.summary.action_items
        .map((a, i) => ({ ...a, key: `${m.id}-${i}`, meeting: { id: m.id, title: m.title } }))
        .filter((a) => a.status === "pending"),
    )
    .sort((a, b) => (parseDue(a.dueDate)?.getTime() ?? Infinity) - (parseDue(b.dueDate)?.getTime() ?? Infinity))
    .slice(0, limit);
}
