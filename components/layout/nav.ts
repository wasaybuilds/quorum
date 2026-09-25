import { LayoutDashboard, MessageSquareText, Search, Video } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/meetings", label: "Meetings", icon: Video },
  { href: "/ask", label: "Ask Quorum", icon: MessageSquareText },
  { href: "/search", label: "Search", icon: Search },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
