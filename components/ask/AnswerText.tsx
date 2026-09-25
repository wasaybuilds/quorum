import { Fragment } from "react";

/** Minimal renderer for model answers: paragraphs, "- " bullet lists and **bold**. */
export function AnswerText({ text }: { text: string }) {
  const blocks: { type: "p" | "ul"; lines: string[] }[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      blocks.push({ type: "p", lines: [] });
      continue;
    }
    const bullet = /^[-*•]\s+/.test(line) || /^\d+[.)]\s+/.test(line);
    const type = bullet ? "ul" : "p";
    const content = line.replace(/^([-*•]|\d+[.)])\s+/, "");
    const last = blocks[blocks.length - 1];
    if (last && last.type === type && (type === "ul" || last.lines.length)) last.lines.push(content);
    else blocks.push({ type, lines: [content] });
  }

  return (
    <div className="max-w-[65ch] space-y-3 text-body text-copy">
      {blocks
        .filter((b) => b.lines.length)
        .map((b, i) =>
          b.type === "ul" ? (
            <ul key={i} className="space-y-1.5 pl-1">
              {b.lines.map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-disabled" />
                  <span>
                    <Inline text={l} />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              <Inline text={b.lines.join(" ")} />
            </p>
          ),
        )}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
