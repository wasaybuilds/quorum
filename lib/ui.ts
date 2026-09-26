// Shared class strings for the component language (buttons, inputs, cards).
// Kept as strings so server and client components can both use them.

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-md text-body font-medium transition-colors duration-150 ease-in-out disabled:cursor-not-allowed";

export const btn = {
  primary: `${BTN_BASE} bg-accent-ink text-white hover:bg-accent-hover active:bg-accent-hover disabled:bg-disabled`,
  secondary: `${BTN_BASE} border border-border bg-surface-muted text-copy hover:bg-border disabled:text-disabled`,
  tertiary: `${BTN_BASE} text-accent-ink hover:text-accent-hover hover:underline underline-offset-2`,
  ghost: `${BTN_BASE} text-muted hover:bg-surface-muted hover:text-ink`,
};

export const size = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-12 px-6",
  icon: "h-10 w-10",
};

/** Wrapper for an input with an icon; add `field` to get the focus treatment. */
export const inputShell =
  "field flex items-center gap-2 rounded-md border border-border-strong bg-surface px-3 transition-colors duration-150";

export const inputBare = "min-w-0 flex-1 bg-transparent text-[16px] text-copy outline-none sm:text-body";

export const card = "rounded-lg border border-border bg-surface shadow-card";

export const cardInteractive = `${card} transition-colors duration-150 hover:border-border-strong hover:bg-surface-muted`;

export const link = "text-accent-ink hover:text-accent-hover hover:underline underline-offset-2";

/** Page content wrapper inside the panel: 16px gutters on phones, 24px from sm. */
export const container = "mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 sm:py-6";
