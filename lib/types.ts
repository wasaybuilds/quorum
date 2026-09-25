export type MeetingType = "sales" | "cs" | "internal" | "engineering";

export interface Participant {
  name: string;
  role?: string;
  email?: string;
  /** true for people outside the host organisation */
  external?: boolean;
}

export interface TranscriptEntry {
  speaker: string;
  /** seconds from the start of the meeting */
  timestamp: number;
  text: string;
}

export type ActionStatus = "pending" | "completed";
export type Priority = "high" | "medium" | "low";

export interface ActionItem {
  task: string;
  owner: string;
  dueDate?: string | null;
  status: ActionStatus;
  priority?: Priority;
}

export interface MeetingSummary {
  executive_summary: string;
  key_points: string[];
  decisions: string[];
  concerns: string[];
  action_items: ActionItem[];
}

export interface Highlight {
  timestamp: number;
  label: string;
}

export interface Meeting {
  id: string;
  title: string;
  company: string;
  type: MeetingType;
  /** ISO 8601 start time */
  date: string;
  /** minutes */
  duration: number;
  platform: "Zoom" | "Google Meet" | "Microsoft Teams";
  participants: Participant[];
  transcript: TranscriptEntry[];
  summary: MeetingSummary;
  highlights?: Highlight[];
}

/** A transcript line cited as evidence by an AI answer. */
export interface MeetingSource {
  meetingId: string;
  meetingTitle: string;
  timestamp: number;
  speaker: string;
  text: string;
}

export interface AskResponse {
  answer: string;
  sources: MeetingSource[];
  confidence?: "high" | "medium" | "low";
  patterns?: string[];
  /** true when the answer came from the offline fallback rather than the model */
  fallback?: boolean;
}
