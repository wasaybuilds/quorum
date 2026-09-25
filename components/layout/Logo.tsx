import Link from "next/link";

export function LogoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <rect width="20" height="20" rx="5" fill="#1f2937" />
      <circle cx="9.4" cy="9.4" r="4.4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <path d="M12 12.1 15 15.1" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** 20px tall wordmark. */
export function Logo() {
  return (
    <Link href="/" className="flex h-5 items-center gap-2 rounded" aria-label="Quorum home">
      <LogoMark />
      <span className="text-[15px] font-semibold leading-none tracking-tight text-ink">Quorum</span>
    </Link>
  );
}
