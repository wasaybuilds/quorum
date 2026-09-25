import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function LogoMark({ className = "h-5 w-5", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <rect width="20" height="20" rx="5" fill={tone === "dark" ? "#0f766e" : "#1f2937"} />
      <circle cx="9.4" cy="9.4" r="4.4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <path d="M12 12.1 15 15.1" stroke={tone === "dark" ? "#ccfbf1" : "#2dd4bf"} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** 20px tall wordmark. `dark` for use on the dark sidebar. */
export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Link href="/" className="flex h-5 items-center gap-2 rounded" aria-label="Quorum home">
      <LogoMark tone={tone} />
      <span className={cn("text-[15px] font-semibold leading-none tracking-tight", tone === "dark" ? "text-white" : "text-ink")}>Quorum</span>
    </Link>
  );
}
