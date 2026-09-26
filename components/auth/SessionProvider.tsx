"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
}

interface SessionState {
  loading: boolean;
  user: SessionUser | null;
  demo: boolean;
  signInAvailable: boolean;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionState>({
  loading: true,
  user: null,
  demo: false,
  signInAvailable: false,
  signOut: async () => {},
});

export const useSession = () => useContext(SessionContext);

/** Loads the current user from /api/me; pages stay static and the session arrives client-side. */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<Omit<SessionState, "signOut">>({ loading: true, user: null, demo: false, signInAvailable: false });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setState({ loading: false, user: data.user, demo: data.demo, signInAvailable: data.signInAvailable });
        // A cookie got us past the gate but the session is gone (expired / signed out elsewhere).
        if (!data.user && !data.demo && pathname !== "/login") {
          void fetch("/api/auth/logout", { method: "POST" }).finally(() => router.replace("/login"));
        }
      })
      .catch(() => !cancelled && setState((s) => ({ ...s, loading: false })));
    return () => {
      cancelled = true;
    };
    // Session is loaded once per page load; navigation keeps it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState((s) => ({ ...s, user: null, demo: false }));
    router.replace("/login");
  }, [router]);

  return <SessionContext.Provider value={{ ...state, signOut }}>{children}</SessionContext.Provider>;
}
