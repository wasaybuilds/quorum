import type { Metadata } from "next";
import { LogoMark } from "@/components/layout/Logo";
import { LoginShowcase } from "@/components/auth/LoginShowcase";
import { GoogleLogo } from "@/components/upcoming/GoogleLogo";
import { safeNext } from "@/lib/calendar/google";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  denied: "Google sign-in was cancelled. You can try again or explore the demo workspace.",
  state: "That sign-in link expired. Please try again.",
  signin: "We couldn't complete sign-in with Google. Please try again.",
  unavailable: "Google sign-in isn't set up on this deployment. You can still explore the demo workspace.",
};


export default async function LoginPage(props: PageProps<"/login">) {
  const params = await props.searchParams;
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
  const next = safeNext(typeof params.next === "string" ? params.next : "/");

  return (
    <div className="grid min-h-screen bg-[#111827] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
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
        <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full border border-[#2dd4bf]/15" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-8 top-[42%] h-40 w-40 rounded-full border border-[#2dd4bf]/10" aria-hidden="true" />

        <div className="relative flex items-center gap-2.5">
          <LogoMark tone="dark" className="h-8 w-8" />
          <span className="text-[18px] font-semibold tracking-tight">Quorum</span>
        </div>

        <div className="relative flex flex-1 items-center">
          <LoginShowcase />
        </div>

        <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 text-label text-gray-400">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf]" /> AI summaries with sources</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf]" /> Google Calendar sync</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf]" /> Read-only access</span>
        </div>
      </section>

      {/* Sign-in card */}
      <section className="flex items-center justify-center bg-page p-4 sm:p-8 lg:m-2.5 lg:rounded-xl">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <LogoMark className="h-8 w-8" />
            <span className="text-[18px] font-semibold tracking-tight text-ink">Quorum</span>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <h1 className="text-h2">Sign in to Quorum</h1>
            <p className="mt-2 text-body text-muted">Use your work Google account. We&apos;ll connect your calendar so Quorum knows which meetings to record.</p>

            {error && (
              <p role="alert" className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-small text-amber-900">
                {error}
              </p>
            )}

            <a
              href={`/api/auth/google?next=${encodeURIComponent(next)}`}
              className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-md border border-[#747775] bg-white text-[14px] font-medium text-[#1f1f1f] transition-colors duration-150 hover:bg-[#f8f9fa]"
            >
              <GoogleLogo /> Continue with Google
            </a>

            <div className="my-5 flex items-center gap-3 text-label text-muted">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            <a
              href="/api/auth/demo"
              className="flex h-11 w-full items-center justify-center rounded-md border border-border bg-surface-muted text-body font-medium text-copy transition-colors duration-150 hover:bg-border"
            >
              Explore the demo workspace
            </a>
            <p className="mt-2 text-center text-label text-muted">No account needed. Sample meetings from a fictional company.</p>
          </div>

          <p className="mt-6 text-center text-label text-muted">
            Calendar access is read-only. Quorum never creates, edits or deletes your events.
          </p>
        </div>
      </section>
    </div>
  );
}
