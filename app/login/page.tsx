import type { Metadata } from "next";
import { CalendarCheck2, FileText, MessageSquareText } from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";
import { GoogleLogo } from "@/components/upcoming/GoogleLogo";
import { safeNext } from "@/lib/calendar/google";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  denied: "Google sign-in was cancelled. You can try again or explore the demo workspace.",
  state: "That sign-in link expired. Please try again.",
  signin: "We couldn't complete sign-in with Google. Please try again.",
  unavailable: "Google sign-in isn't set up on this deployment. You can still explore the demo workspace.",
};

const FEATURES = [
  { icon: FileText, title: "Notes you can trust", text: "Summaries, decisions and concerns linked to the exact moment they were said." },
  { icon: MessageSquareText, title: "Ask across every call", text: "Find patterns and commitments across your whole meeting history." },
  { icon: CalendarCheck2, title: "Follows your calendar", text: "Choose which meetings get recorded, automatically or one by one." },
];

export default async function LoginPage(props: PageProps<"/login">) {
  const params = await props.searchParams;
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
  const next = safeNext(typeof params.next === "string" ? params.next : "/");

  return (
    <div className="grid min-h-screen bg-[#111827] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Brand panel */}
      <section className="hidden flex-col justify-between p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <LogoMark tone="dark" className="h-8 w-8" />
          <span className="text-[18px] font-semibold tracking-tight">Quorum</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-[36px] font-semibold leading-tight text-white">Turn every meeting into decisions and next steps.</h2>
          <ul className="mt-10 space-y-6">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#2dd4bf] ring-1 ring-white/10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-body font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-small text-gray-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-label text-gray-500">Quorum · meeting intelligence</p>
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
