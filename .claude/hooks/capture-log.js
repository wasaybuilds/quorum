#!/usr/bin/env node
// Agent session capture.
// Fired automatically by the UserPromptSubmit and Stop hooks (.claude/settings.json).
// Rebuilds .agent-logs/<start>_<session>.md from the session transcript so every
// turn is recorded as: the verbatim prompt + the final response of that turn.
// Tool calls, thinking and intermediate text are intentionally excluded.

const fs = require("fs");
const path = require("path");

const AUTHOR = "wasaybuilds";
const TOOL = "claude-code";
const PROJECT = "quorum";
const LOG_DIR = path.resolve(__dirname, "..", "..", ".agent-logs");

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function parseTranscript(file) {
  if (!file || !fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// A "real" prompt is a user message typed by the person, not a tool result,
// meta/system injection, compaction summary or subagent message.
function promptText(entry) {
  if (entry.type !== "user" || !entry.message) return null;
  if (entry.isMeta || entry.isCompactSummary || entry.isSidechain) return null;
  const c = entry.message.content;
  if (typeof c === "string") return c;
  if (!Array.isArray(c)) return null;
  if (c.some((b) => b && b.type === "tool_result")) return null;
  const parts = c
    .map((b) => {
      if (!b) return "";
      if (b.type === "text") return b.text;
      if (b.type === "image") return "[image attached]";
      if (b.type === "document") return "[document attached]";
      return "";
    })
    .filter((s) => s !== "");
  return parts.length ? parts.join("\n\n") : null;
}

function buildTurns(entries) {
  const turns = [];
  let cur = null;
  for (const e of entries) {
    const p = promptText(e);
    if (p !== null) {
      cur = { prompt: p, promptTime: e.timestamp, blocks: [], model: null, responseTime: null };
      turns.push(cur);
      continue;
    }
    if (!cur || e.type !== "assistant" || !e.message || e.isSidechain) continue;
    if (e.message.model && e.message.model !== "<synthetic>") cur.model = e.message.model;
    const content = Array.isArray(e.message.content) ? e.message.content : [];
    for (const b of content) {
      if (b && (b.type === "text" || b.type === "tool_use")) {
        cur.blocks.push(b);
        if (b.type === "text") cur.responseTime = e.timestamp;
      }
    }
  }
  // Final response = the text the model produced after its last tool call.
  for (const t of turns) {
    let lastTool = -1;
    t.blocks.forEach((b, i) => {
      if (b.type === "tool_use") lastTool = i;
    });
    t.response = t.blocks
      .slice(lastTool + 1)
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n\n")
      .trim();
  }
  return turns;
}

function stamp(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}_${p(d.getUTCHours())}-${p(d.getUTCMinutes())}-${p(d.getUTCSeconds())}`;
}

function render(sessionId, turns) {
  const short = sessionId.slice(0, 8);
  const models = turns.map((t) => t.model).filter(Boolean);
  const mainModel = models[models.length - 1] || "unknown";
  const first = turns[0].promptTime;
  const last = turns[turns.length - 1].promptTime;
  const out = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${first.slice(0, 10)}`,
    `author: ${AUTHOR}`,
    `model: ${mainModel}`,
    `tool: ${TOOL}`,
    `project: ${PROJECT}`,
    `total_exchanges: ${turns.length}`,
    `first_prompt_time: ${first}`,
    `last_prompt_time: ${last}`,
    "---",
    `# Session Log - ${first.slice(0, 10)}`,
    `Session: \`${short}\` | Project: \`${PROJECT}\` | Author: \`${AUTHOR}\``,
    "---",
    "",
  ];
  let lastModel = mainModel;
  turns.forEach((t, i) => {
    const n = i + 1;
    const model = t.model || lastModel;
    lastModel = model;
    out.push(`[LOG_ENTRY type=PROMPT num=${n} session=${short}]`);
    out.push(`timestamp: ${t.promptTime}`);
    out.push(`model: ${model}`);
    out.push("", t.prompt, "");
    if (t.response) {
      out.push(`[LOG_ENTRY type=RESPONSE num=${n} session=${short}]`);
      out.push(`timestamp: ${t.responseTime || t.promptTime}`);
      out.push(`model: ${model}`);
      out.push("", t.response, "");
    }
  });
  return out.join("\n");
}

function main() {
  let input = {};
  try {
    input = JSON.parse(readStdin() || "{}");
  } catch {}
  const transcript = input.transcript_path || process.argv[2];
  const entries = parseTranscript(transcript);
  const sessionId =
    input.session_id || (entries.find((e) => e.sessionId) || {}).sessionId || "unknown-session";
  const turns = buildTurns(entries);

  // UserPromptSubmit fires before the prompt is written to the transcript.
  if (input.hook_event_name === "UserPromptSubmit" && typeof input.prompt === "string") {
    const lastTurn = turns[turns.length - 1];
    if (!lastTurn || lastTurn.prompt !== input.prompt || lastTurn.response) {
      turns.push({ prompt: input.prompt, promptTime: new Date().toISOString(), blocks: [], model: null, response: "" });
    }
  }
  // Stop can fire before the last message is flushed; prefer the hook's copy.
  if (input.hook_event_name === "Stop" && typeof input.last_assistant_message === "string" && turns.length) {
    const lastTurn = turns[turns.length - 1];
    if (!lastTurn.response && input.last_assistant_message.trim()) {
      lastTurn.response = input.last_assistant_message.trim();
      lastTurn.responseTime = new Date().toISOString();
    }
  }
  if (!turns.length) return;

  fs.mkdirSync(LOG_DIR, { recursive: true });
  // Keep one file per session: reuse an existing file for this session id.
  const existing = fs.readdirSync(LOG_DIR).find((f) => f.endsWith(`_${sessionId}.md`));
  const file = path.join(LOG_DIR, existing || `${stamp(turns[0].promptTime)}_${sessionId}.md`);
  fs.writeFileSync(file, render(sessionId, turns));
}

try {
  main();
} catch (err) {
  // Never block the agent because logging failed; surface it on stderr instead.
  process.stderr.write(`capture-log: ${err && err.message}\n`);
}
process.exit(0);
