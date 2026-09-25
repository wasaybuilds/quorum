import type { AskResponse, Meeting, MeetingSource, MeetingSummary, TranscriptEntry } from "@/lib/types";
import { normalize, rankLines } from "@/lib/utils/search";
import { TYPE_LABELS } from "@/lib/utils/format";

// Offline answers used when no API key is configured or the model call fails.
// They are assembled from the meeting's own notes and transcript, so they stay
// accurate for the seed library instead of being canned text.

export function toSource(meeting: Meeting, index: number): MeetingSource {
  const e = meeting.transcript[index];
  return { meetingId: meeting.id, meetingTitle: meeting.title, timestamp: e.timestamp, speaker: e.speaker, text: e.text };
}

export const GENERIC_SUMMARY: MeetingSummary = {
  executive_summary:
    "Team reviewed Q4 timeline and integration strategy. Key decision: proceed with pilot phase. Main concern: implementation complexity and timeline constraints.",
  key_points: [
    "Salesforce integration is critical for maintaining existing workflows",
    "Q4 migration provides 3-month implementation window",
    "Security compliance validation is mandatory before deployment",
    "Team has existing infrastructure that must be preserved",
  ],
  decisions: [
    "Approved pilot phase with 2-week evaluation",
    "Use Salesforce native sync instead of custom integration",
    "Schedule technical deep-dive with CTO",
  ],
  concerns: [
    "Implementation timeline is aggressive",
    "Security compliance needs additional validation",
    "Risk of disruption to existing workflows",
  ],
  action_items: [
    { task: "Send security documentation", owner: "Engineering", dueDate: "Sept 22", status: "pending", priority: "high" },
    { task: "Schedule CTO technical review", owner: "Sales", dueDate: "Sept 19", status: "pending", priority: "high" },
    { task: "Prepare Salesforce integration spec", owner: "Product", dueDate: "Sept 25", status: "pending", priority: "medium" },
  ],
};

type Intent = "concerns" | "decisions" | "actions" | "overview" | "search";

function detectIntent(question: string): Intent {
  const q = normalize(question);
  if (/(concern|risk|worr|objection|issue|problem|pushback|hesita|blocker)/.test(q)) return "concerns";
  if (/(decid|decision|agree|outcome|conclu|approv)/.test(q)) return "decisions";
  if (/(action item|next step|todo|to-do|follow.?up|who (is|owns)|owner|task|deadline|due)/.test(q)) return "actions";
  if (/(summar|overview|tl;?dr|recap|about|what happened|key point|main point|highlights)/.test(q)) return "overview";
  return "search";
}

function uniqueSources(meeting: Meeting, texts: string[], perItem = 1, max = 5): MeetingSource[] {
  const seen = new Set<number>();
  for (const t of texts) {
    for (const i of rankLines(meeting.transcript, t, perItem)) seen.add(i);
    if (seen.size >= max) break;
  }
  return [...seen].sort((a, b) => a - b).map((i) => toSource(meeting, i));
}

export function askMeetingFallback(meeting: Meeting, question: string): AskResponse {
  const { summary } = meeting;
  const intent = detectIntent(question);

  const list = (intro: string, items: string[]) => `${intro}\n\n${items.map((i) => `- ${i}`).join("\n")}`;

  switch (intent) {
    case "concerns":
      return {
        answer: list(`${summary.concerns.length} concerns came up in this call:`, summary.concerns),
        sources: uniqueSources(meeting, summary.concerns),
        confidence: "high",
        fallback: true,
      };
    case "decisions":
      return {
        answer: list("The group agreed on the following:", summary.decisions),
        sources: uniqueSources(meeting, summary.decisions),
        confidence: "high",
        fallback: true,
      };
    case "actions": {
      const items = summary.action_items.map(
        (a) => `**${a.owner}**: ${a.task}${a.dueDate ? ` (due ${a.dueDate})` : ""}${a.status === "completed" ? " ✓" : ""}`,
      );
      return {
        answer: list("Here are the follow-ups and who owns them:", items),
        sources: uniqueSources(meeting, summary.action_items.map((a) => a.task)),
        confidence: "high",
        fallback: true,
      };
    }
    case "overview":
      return {
        answer: list(summary.executive_summary, summary.key_points.slice(0, 4)),
        sources: uniqueSources(meeting, summary.key_points),
        confidence: "high",
        fallback: true,
      };
    default: {
      const hits = rankLines(meeting.transcript, question, 4);
      if (!hits.length) {
        return {
          answer: "I couldn't find anything in this meeting's transcript about that. Try rephrasing, or ask about the decisions, concerns or next steps.",
          sources: [],
          confidence: "low",
          fallback: true,
        };
      }
      const ordered = [...hits].sort((a, b) => a - b);
      const quotes = ordered.map((i) => {
        const e = meeting.transcript[i];
        return `**${e.speaker}**: “${clip(e.text, 180)}”`;
      });
      return {
        answer: list("Here's what was said on that topic:", quotes),
        sources: ordered.map((i) => toSource(meeting, i)),
        confidence: "medium",
        fallback: true,
      };
    }
  }
}

// ---------------------------------------------------------------------------

const THEMES: { label: string; keywords: string[] }[] = [
  { label: "Security review and compliance (SOC 2, SSO/SCIM)", keywords: ["security", "soc 2", "soc2", "sso", "scim", "questionnaire", "pen test", "compliance"] },
  { label: "Salesforce sync reliability and duplicate records", keywords: ["salesforce", "sync", "duplicate", "mapping"] },
  { label: "Price per seat versus budget", keywords: ["price", "pricing", "budget", "discount", "per seat", "$"] },
  { label: "Tight implementation timelines", keywords: ["timeline", "q4", "q1", "january", "go live", "go-live", "deadline", "year-end"] },
  { label: "Executive sign-off (CTO / CFO)", keywords: ["cto", "cfo", "sign off", "sign-off", "signoff", "approval"] },
  { label: "API performance and reporting speed", keywords: ["latency", "p95", "slow", "timeout", "performance", "export"] },
  { label: "Training and admin bandwidth", keywords: ["training", "admin", "bandwidth", "onboard", "champion"] },
];

function scopeMeetings(list: Meeting[], question: string): { scoped: Meeting[]; scopeLabel: string } {
  const q = normalize(question);
  const byType = (t: Meeting["type"]) => list.filter((m) => m.type === t);
  if (/\bsales\b|prospect|deal/.test(q) && byType("sales").length) return { scoped: byType("sales"), scopeLabel: "sales calls" };
  if (/customer success|\bcs\b|renewal|customer review|account review/.test(q) && byType("cs").length)
    return { scoped: byType("cs"), scopeLabel: "customer success calls" };
  if (/engineering|technical|architecture|incident/.test(q) && byType("engineering").length)
    return { scoped: byType("engineering"), scopeLabel: "engineering meetings" };
  if (/customer|client/.test(q)) {
    const external = list.filter((m) => m.type === "sales" || m.type === "cs");
    if (external.length) return { scoped: external, scopeLabel: "customer calls" };
  }
  return { scoped: list, scopeLabel: "meetings" };
}

const PATTERN_WORDS = /(repeat|recurr|common|pattern|across|trend|theme|keep|again|often|frequent|most|usually|typical|objection|issue|concern|risk|blocker)/;

export function askMultiFallback(list: Meeting[], question: string): AskResponse {
  const { scoped, scopeLabel } = scopeMeetings(list, question);

  if (PATTERN_WORDS.test(normalize(question))) {
    const scored = THEMES.map((theme) => {
      const hits = scoped
        .map((m) => {
          const idx = m.transcript.findIndex((e) => theme.keywords.some((k) => normalize(e.text).includes(k)));
          const count = m.transcript.filter((e) => theme.keywords.some((k) => normalize(e.text).includes(k))).length;
          return { m, idx, count };
        })
        .filter((h) => h.idx !== -1);
      return { theme, hits, total: hits.reduce((s, h) => s + h.count, 0) };
    })
      .filter((t) => t.hits.length >= Math.min(2, scoped.length))
      .sort((a, b) => b.hits.length - a.hits.length || b.total - a.total)
      .slice(0, 4);

    if (scored.length) {
      const bullets = scored.map(
        ({ theme, hits }) =>
          `**${theme.label}**: raised in ${hits.length} of ${scoped.length} ${scopeLabel} (${hits.map((h) => h.m.company === "Lattice Labs" ? h.m.title : h.m.company).join(", ")}).`,
      );
      const sources: MeetingSource[] = [];
      for (const { theme, hits } of scored) {
        for (const h of hits.slice(0, 2)) {
          const best = rankLines(h.m.transcript, theme.keywords.join(" "), 1)[0] ?? h.idx;
          sources.push(toSource(h.m, best));
        }
      }
      return {
        answer: `Across ${scoped.length} ${scopeLabel}, a few themes keep coming up:\n\n${bullets.join("\n")}`,
        sources: dedupe(sources).slice(0, 8),
        patterns: scored.map(({ theme, hits }) => `${theme.label} (${hits.length}/${scoped.length})`),
        fallback: true,
      };
    }
  }

  // Retrieval mode: best-matching lines across meetings.
  const hits = scoped
    .flatMap((m) => rankLines(m.transcript, question, 2).map((i, rank) => ({ m, i, rank })))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 6);

  if (!hits.length) {
    return {
      answer: `I couldn't find that in your ${scopeLabel}. Try naming a company, a person, or a topic like pricing, security or Salesforce sync.`,
      sources: [],
      patterns: [],
      fallback: true,
    };
  }

  const bullets = hits.map(({ m, i }) => {
    const e: TranscriptEntry = m.transcript[i];
    return `**${m.title}** (${TYPE_LABELS[m.type]}) — ${e.speaker}: “${clip(e.text, 150)}”`;
  });
  return {
    answer: `Here's where that came up across your ${scopeLabel}:\n\n${bullets.join("\n")}`,
    sources: hits.map(({ m, i }) => toSource(m, i)),
    patterns: [],
    fallback: true,
  };
}

function dedupe(sources: MeetingSource[]) {
  const seen = new Set<string>();
  return sources.filter((s) => {
    const k = `${s.meetingId}:${s.timestamp}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
}
