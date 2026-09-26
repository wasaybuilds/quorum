import { CalendarDays, Home, ListChecks, MessageSquareText, Search, Video } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/meetings", label: "Meetings", icon: Video },
  { href: "/upcoming", label: "Upcoming", icon: CalendarDays },
  { href: "/actions", label: "Action items", icon: ListChecks },
  { href: "/ask", label: "Ask Quorum", icon: MessageSquareText },
  { href: "/search", label: "Search", icon: Search },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Pages that bring their own Ask surface, so the global panel steps aside. */
export function hasOwnAsk(pathname: string) {
  return pathname.startsWith("/meetings/") || pathname === "/ask";
}

export function pageTitle(pathname: string) {
  if (pathname.startsWith("/meetings/")) return "Meeting";
  return NAV_ITEMS.find((i) => i.href !== "/" && isActive(pathname, i.href))?.label ?? "Home";
}
