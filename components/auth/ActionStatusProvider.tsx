"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ActionStatus } from "@/lib/types";
import { useSession } from "./SessionProvider";

interface ActionStatusState {
  /** effective status for an item: the user's saved choice, else the seed value */
  statusOf: (key: string, fallback: ActionStatus) => ActionStatus;
  toggle: (key: string, current: ActionStatus) => void;
  /** true when changes are saved to the account (signed in) */
  persisted: boolean;
}

const Ctx = createContext<ActionStatusState>({ statusOf: (_k, f) => f, toggle: () => {}, persisted: false });

export const useActionStatus = () => useContext(Ctx);

/**
 * Action-item completion shared by every list in the app. Signed-in users'
 * changes are saved to the database; demo users' changes last for the visit.
 */
export function ActionStatusProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [map, setMap] = useState<Record<string, ActionStatus>>({});

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch("/api/me/actions", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => !cancelled && setMap(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  const statusOf = useCallback((key: string, fallback: ActionStatus) => map[key] ?? fallback, [map]);

  const toggle = useCallback(
    (key: string, current: ActionStatus) => {
      const next: ActionStatus = current === "completed" ? "pending" : "completed";
      setMap((m) => ({ ...m, [key]: next }));
      if (user) {
        fetch("/api/me/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, status: next }),
        }).catch(() => setMap((m) => ({ ...m, [key]: current }))); // roll back on failure
      }
    },
    [user],
  );

  return <Ctx.Provider value={{ statusOf, toggle, persisted: !!user }}>{children}</Ctx.Provider>;
}
