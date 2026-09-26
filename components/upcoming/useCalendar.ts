"use client";

import { useCallback, useEffect, useState } from "react";
import type { UpcomingMeeting } from "@/lib/types";

export interface CalendarState {
  loading: boolean;
  configured: boolean;
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

// --- recording preferences (per browser; no accounts in this demo) ----------

export interface RecordingPrefs {
  external: boolean;
  internal: boolean;
  shareWithAttendees: boolean;
  overrides: Record<string, boolean>;
}

const DEFAULT_PREFS: RecordingPrefs = { external: true, internal: false, shareWithAttendees: false, overrides: {} };
const KEY = "quorum.recording-prefs";

function read(): RecordingPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function useRecordingPrefs() {
  const [prefs, setPrefs] = useState<RecordingPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    // Hydrate from localStorage after mount so server and client render the same defaults.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(read());
  }, []);

  const update = useCallback((patch: Partial<RecordingPrefs>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // storage unavailable (private mode); keep in memory only
      }
      return next;
    });
  }, []);

  const willRecord = useCallback(
    (m: UpcomingMeeting) => prefs.overrides[m.id] ?? (m.external ? prefs.external : prefs.internal),
    [prefs],
  );

  const setRecord = useCallback(
    (m: UpcomingMeeting, on: boolean) => update({ overrides: { ...prefs.overrides, [m.id]: on } }),
    [prefs.overrides, update],
  );

  return { prefs, update, willRecord, setRecord };
}
