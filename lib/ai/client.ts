import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

// Server-only module: imported exclusively from app/api route handlers.

export const MODEL = process.env.ANTHROPIC_MODEL?.trim() || "claude-opus-5";

let client: Anthropic | null | undefined;

function getClient(): Anthropic | null {
  if (client !== undefined) return client;
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  // Treat the .env.example placeholder as "no key" so the app runs on fallbacks.
  client = key && !key.includes("your") && !key.endsWith("...") ? new Anthropic({ apiKey: key, timeout: 60_000, maxRetries: 1 }) : null;
  return client;
}

export function isAIConfigured() {
  return getClient() !== null;
}

interface StructuredRequest<T extends z.ZodType> {
  system: string;
  messages: Anthropic.Beta.BetaMessageParam[];
  schema: T;
  effort?: "low" | "medium" | "high";
  maxTokens?: number;
}

/**
 * One structured call to the model. Returns null when no key is configured or the
 * request fails for any reason; callers then serve their offline fallback.
 */
export async function generateStructured<T extends z.ZodType>({
  system,
  messages,
  schema,
  effort = "low",
  maxTokens = 8000,
}: StructuredRequest<T>): Promise<z.infer<T> | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const base = {
    model: MODEL,
    max_tokens: maxTokens,
    system: [{ type: "text" as const, text: system, cache_control: { type: "ephemeral" as const } }],
    messages,
    output_config: { effort, format: betaZodOutputFormat(schema) },
  };

  try {
    let response;
    try {
      // Server-side refusal fallback: a declined request is re-run on a fallback model.
      response = await anthropic.beta.messages.parse({
        ...base,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      });
    } catch (err) {
      if (!(err instanceof Anthropic.BadRequestError)) throw err;
      // Some accounts/regions may not accept the fallback beta; retry the plain request.
      response = await anthropic.beta.messages.parse(base);
    }
    if (response.stop_reason === "refusal" || response.stop_reason === "max_tokens" || !response.parsed_output) {
      console.warn(`[ai] unusable response (stop_reason=${response.stop_reason})`);
      return null;
    }
    return response.parsed_output as z.infer<T>;
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) console.error("[ai] invalid ANTHROPIC_API_KEY");
    else if (err instanceof Anthropic.RateLimitError) console.error("[ai] rate limited");
    else if (err instanceof Anthropic.APIError) console.error(`[ai] API error ${err.status}: ${err.message}`);
    else console.error("[ai] request failed:", err);
    return null;
  }
}
