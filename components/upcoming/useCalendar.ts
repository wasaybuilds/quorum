"use client";

import { useCallback, useEffect, useState } from "react";
import type { UpcomingMeeting } from "@/lib/types";
import { useSession } from "@/components/auth/SessionProvider";

export interface CalendarState {
  loading: boolean;
  configured: boolean;
  signedIn?: boolean;
  connected: boolean;
  email?: string;
  error?: boolean;
  events: UpcomingMeeting[];
}

export function useCalendar() {
  const [state, setState] = useState<CalendarState>({ loading: true, configured: false, connected: false, events: [] });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch("/api/calendar/events", { cache: "no-store" });
      const data = await res.json();
      setState({ loading: false, ...data });
    } catch {
      setState((s) => ({ ...s, loading: false, error: true }));
    }
  }, []);

  useEffect(() => {
    // Initial fetch of an external resource.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const disconnect = useCallback(async () => {
    await fetch("/api/calendar/disconnect", { method: "POST" });
    await load();
  }, [load]);

  return { ...state, reload: load, disconnect };
}

// --- recording preferences --------------------------------------------------
// Signed in: saved to the account (/api/me/preferences). Demo: this browser only.

export interface RecordingPrefs {
  external: boolean;
  internal: boolean;
  shareWithAttendees: boolean;
  overrides: Record<string, boolean>;
}

const DEFAULT_PREFS: RecordingPrefs = { external: true, internal: false, shareWithAttendees: false, overrides: {} };
const KEY = "quorum.recording-prefs";

function readLocal(): RecordingPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function useRecordingPrefs() {
  const { user, loading } = useSession();
  const [prefs, setPrefs] = useState<RecordingPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Hydrate from localStorage after mount so server and client render the same defaults.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrefs(readLocal());
      return;
    }
    let cancelled = false;
    fetch("/api/me/preferences", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => !cancelled && data && setPrefs({ ...DEFAULT_PREFS, ...data }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  const update = useCallback(
    (patch: Partial<RecordingPrefs>) => {
      setPrefs((p) => {
        const next = { ...p, ...patch };
        if (user) {
          void fetch("/api/me/preferences", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          });
        } else {
          try {
            localStorage.setItem(KEY, JSON.stringify(next));
          } catch {
            // storage unavailable (private mode); keep in memory only
          }
        }
        return next;
      });
    },
    [user],
  );

  const willRecord = useCallback(
    (m: UpcomingMeeting) => prefs.overrides[m.id] ?? (m.external ? prefs.external : prefs.internal),
    [prefs],
  );

  const setRecord = useCallback(
    (m: UpcomingMeeting, on: boolean) => update({ overrides: { ...prefs.overrides, [m.id]: on } }),
    [prefs.overrides, update],
  );

  return { prefs, update, willRecord, setRecord, persisted: !!user };
}
