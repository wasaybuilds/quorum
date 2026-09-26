import type { Metadata } from "next";
import { LogoMark } from "@/components/layout/Logo";
import { LoginShowcase } from "@/components/auth/LoginShowcase";
import { GoogleLogo } from "@/components/upcoming/GoogleLogo";
import { Lock } from "lucide-react";
import { safeNext } from "@/lib/calendar/google";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  denied: "Google sign-in was cancelled. You can try again or explore the demo workspace.",
  state: "That sign-in link expired. Please try again.",
  signin: "We couldn't complete sign-in with Google. Please try again.",
  unavailable: "Google sign-in isn't set up on this deployment. You can still explore the demo workspace.",
};


const STEPS = [
  { title: "Sign in with Google", text: "One click creates your account. No new password." },
  { title: "Connect your calendar", text: "Read-only access so Quorum sees your upcoming meetings." },
  { title: "Choose what gets recorded", text: "Auto-record external calls, or pick meetings one by one." },
];

export default async function LoginPage(props: PageProps<"/login">) {
  const params = await props.searchParams;
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
  const next = safeNext(typeof params.next === "string" ? params.next : "/");

  return (
    <div className="grid min-h-screen bg-[#1c1c1c] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Brand panel with product showcase */}
      <section className="relative hidden flex-col overflow-hidden p-12 text-white lg:flex">
        <svg className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.06]" aria-hidden="true">
          <defs>
            <pattern id="login-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-dots)" />
        </svg>
        <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full border border-[#528bff]/15" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-8 top-[42%] h-40 w-40 rounded-full border border-[#528bff]/10" aria-hidden="true" />

        <div className="relative flex items-center gap-2.5">
          <LogoMark tone="dark" className="h-8 w-8" />
          <span className="text-[18px] font-semibold tracking-tight">Quorum</span>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <LoginShowcase />
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-label text-gray-400">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#528bff]" /> AI summaries with sources</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#528bff]" /> Google Calendar sync</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#528bff]" /> Read-only access</span>
        </div>
      </section>

      {/* Sign-in panel: header link, left-aligned form + how it works, footer */}
      <section className="flex min-h-screen flex-col bg-surface lg:m-2.5 lg:min-h-0 lg:rounded-xl">
        <div className="flex h-16 items-center justify-between px-6 sm:px-10">
          <div className="flex items-center gap-2.5 lg:invisible">
            <LogoMark className="h-7 w-7" />
            <span className="text-[17px] font-bold tracking-tight text-ink">Quorum</span>
          </div>
          <a href="/api/auth/demo" className="text-small text-muted transition-colors duration-150 hover:text-ink">
            Just looking? <span className="font-semibold text-accent-ink">Try the demo →</span>
          </a>
        </div>

        <div className="flex flex-1 items-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[440px]">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-copy">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Welcome back
            </p>
            <h1 className="mt-4 text-[36px] font-extrabold leading-[1.1] tracking-tight text-ink">Sign in to Quorum</h1>
            <p className="mt-3 text-body text-muted">
              Use your work Google account. We&apos;ll connect your calendar so Quorum knows which meetings to record.
            </p>

            {error && (
              <p role="alert" className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-small text-amber-900">
                {error}
              </p>
            )}

            <div className="mt-8 space-y-3">
              <a
                href={`/api/auth/google?next=${encodeURIComponent(next)}`}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-[#747775] bg-white text-[15px] font-medium text-[#1f1f1f] transition-colors duration-150 hover:bg-[#f8f9fa]"
              >
                <GoogleLogo /> Continue with Google
              </a>
              <div className="flex items-center gap-3 py-1 text-label text-muted">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <a
                href="/api/auth/demo"
                className="flex h-12 w-full items-center justify-center rounded-md bg-[#1c1c1c] text-[15px] font-medium text-white transition-colors duration-150 hover:bg-black"
              >
                Explore the demo workspace
              </a>
              <p className="text-label text-muted">No account needed. Sample meetings from a fictional company.</p>
            </div>

            <div className="mt-10 border-t border-border pt-8">
              <p className="text-label font-semibold text-ink">How it works</p>
              <ol className="mt-4 space-y-4">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[12px] font-semibold text-accent-hover">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-body font-semibold text-ink">{step.title}</p>
                      <p className="text-small text-muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-6 py-4 text-label text-muted sm:px-10">
          <span>© 2026 Quorum</span>
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Read-only calendar access · never edits your events
          </span>
        </div>
      </section>
    </div>
  );
}
