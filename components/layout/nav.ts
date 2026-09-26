export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/meetings", label: "Meetings" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/actions", label: "Action items" },
  { href: "/ask", label: "Ask Quorum" },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Pages that bring their own Ask surface, so the global panel steps aside. */
export function hasOwnAsk(pathname: string) {
  return pathname.startsWith("/meetings/") || pathname === "/ask";
}
