import Link from "next/link";

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#0f172a" />
      <circle cx="15" cy="15" r="7" fill="none" stroke="#fff" strokeWidth="2.6" />
      <path d="M19 19.5 L24 24.5" stroke="#60a5fa" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="Quorum home">
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight text-foreground">Quorum</span>
    </Link>
  );
}
