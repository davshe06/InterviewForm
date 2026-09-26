/* =========================================================================
   AI candidate-interview analysis — Vercel serverless function.

   Keeps the Anthropic API key server-side (set ANTHROPIC_API_KEY in the
   Vercel project's environment variables). Optionally set ACCESS_CODE to
   require a shared team code on every request (sent as the x-access-code
   header by the app).

   POST /api/analyze
   Body: { "summary": "<markdown interview summary>", "role": "<primary role or roles explored>" }
   Response: { "analysis": "<markdown>" }
   ========================================================================= */

import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an experienced staffing-industry recruiter reviewing notes a recruiter captured while interviewing a candidate. The candidate may be a finance/accounting professional, a technologist, or a digital/marketing/creative professional — adapt to whichever it is. Your audience is the recruiter and their team, deciding where to place this person. The notes are internal: they include pay expectations and contact details, which you may reference but should not repeat unnecessarily.

The notes rate each skill on depth (None, Exposure, Hands-on, Owned, Led), years, last hands-on year, and how well the candidate evidenced it (walked through an example, described generally, or résumé only). Treat résumé-only and stale ratings (not hands-on for several years) as weaker evidence than recent, walked-through ones. The Role Fit section ranks roles by those ratings; use it as an input, not a verdict.

Respond in markdown with exactly these sections:

## Placement Read
Two or three sentences: the role and level this candidate is most placeable in, and why — grounded in the evidence in the notes. If the recruiter chose a primary role, say whether the evidence supports it.

## Strengths
The 3–5 strongest, best-evidenced skills or accomplishments, citing the notes (depth, recency, proof points, numbers).

## Gaps & Risks
What a client would push back on: thin evidence, stale skills, skills they want to avoid, pay or logistics mismatches, motivation or counteroffer risk, gaps in the career history. Be specific.

## Probes You Missed
4–6 follow-up questions the recruiter should ask to close the biggest open questions — especially for skills rated highly with weak evidence, and for anything that would change the placement.

## Candidate Summary
A short, factual paragraph the recruiter could adapt when presenting this candidate: role, level, strongest evidenced skills, and what they're looking for. Do not include pay, contact details, or the recruiter's private concerns in this paragraph.

Keep it tight and practical — no filler and no generic advice that would apply to any candidate. If the notes are too sparse to assess, say so plainly in Placement Read and use Probes You Missed for what to go back and ask.`;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-access-code");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed — POST an interview summary." });
  }

  const accessCode = process.env.ACCESS_CODE;
  if (accessCode && req.headers["x-access-code"] !== accessCode) {
    return res.status(401).json({ error: "Invalid or missing team access code." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Server is missing the ANTHROPIC_API_KEY environment variable." });
  }

  const { summary, role } = req.body || {};
  if (typeof summary !== "string" || !summary.trim()) {
    return res.status(400).json({ error: "Request must include a non-empty 'summary' string." });
  }
  if (summary.length > 200_000) {
    return res.status(413).json({ error: "Interview summary is too large." });
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 6000,
      thinking: { type: "adaptive" },
      // medium keeps analysis quality high while fitting comfortably inside
      // the 60s function limit; raise to "high" if you extend maxDuration
      output_config: { effort: "medium" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content:
            "Role(s): " + (typeof role === "string" && role ? role : "not specified") +
            "\n\nCandidate interview notes:\n\n" + summary,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return res.status(502).json({ error: "The model declined to analyze this content." });
    }

    const analysis = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    if (!analysis.trim()) {
      return res.status(502).json({ error: "The model returned an empty analysis. Try again." });
    }

    return res.status(200).json({ analysis });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: "Rate limited by the AI service — try again in a minute." });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(500).json({ error: "The server's Anthropic API key was rejected — check ANTHROPIC_API_KEY in Vercel." });
    }
    if (err instanceof Anthropic.APIError) {
      return res.status(502).json({ error: "AI service error (" + err.status + "): " + err.message });
    }
    return res.status(502).json({ error: "Could not reach the AI service. Try again." });
  }
}
