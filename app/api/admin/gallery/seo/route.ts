import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const PRIMARY = process.env.OPENAI_TEXT_MODEL?.trim() || "gpt-4o";
const FALLBACK = "gpt-4o-mini";
const MAX_RETRIES = 2;

const BANNED = [
  "Ko Lake Villa accommodation - luxury lakeside property in Sri Lanka",
  "luxury lakeside property in Sri Lanka",
  "accommodation - luxury",
];

const SeoSchema = z.object({
  title: z.string().min(12).max(80),
  description: z.string().min(40).max(160),
  keywords: z.array(z.string().min(2).max(32)).min(5).max(18),
  altText: z.string().min(10).max(140),
  confidence: z.number().min(0).max(100).default(92),
});
type Seo = z.infer<typeof SeoSchema>;

function looseParse(raw: string) {
  if (!raw) throw new Error("Empty completion");
  let t = raw.trim();
  const m = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (m) t = m[1];
  try { return JSON.parse(t); } catch {}
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s >= 0 && e > s) return JSON.parse(t.slice(s, e + 1));
  throw new Error("Non-JSON response from OpenAI");
}

function boilerplate(o: Seo) {
  const hay = (o.title + " " + o.description + " " + o.altText).toLowerCase();
  return BANNED.some(p => hay.includes(p.toLowerCase()));
}
function tooVague(o: Seo) {
  const nouns = ["pool","balcony","bedroom","bathroom","lake","garden","palm","sunset","deck","dining","terrace","fan","tile","pier","dock","kayak"];
  const text = (o.description + " " + o.altText).toLowerCase();
  let hits = 0; for (const n of nouns) if (text.includes(n)) hits++;
  return hits < 2;
}

function buildMessages(args: {
  category?: string;
  humanTitle?: string;
  imageUrl?: string; // image OR video poster
  mediaType: "image"|"video";
}) {
  const sys = "You create concise, specific, *unique* SEO for Ko Lake Villa media. Use what you SEE; no boilerplate. Return STRICT JSON only.";
  const rules = `Output JSON { "title","description","keywords","altText","confidence" }.
- Title 12–80 chars; no brand unless visibly present.
- Description ≤160 chars; mention ≥2 concrete *visible* elements.
- keywords: 5–18 short phrases.
- altText 10–140 chars, literal.
- Never use: ${BANNED.map(x=>`"${x}"`).join(", ")}.`;

  const content: any[] = [{ type:"text", text:
`Context:
- Media type: ${args.mediaType.toUpperCase()}
- Category: ${args.category || "villa"}
- Human title: ${args.humanTitle || "Untitled"}

${rules}` }];

  if (args.imageUrl) content.push({ type:"image_url", image_url: { url: args.imageUrl } });

  const msgs: ChatCompletionMessageParam[] = [
    { role: "system", content: sys },
    { role: "user", content }
  ];
  return msgs;
}

async function runOnce(cli: OpenAI, messages: ChatCompletionMessageParam[], model: string) {
  const r = await cli.chat.completions.create({
    model, temperature: 0.4, response_format: { type: "json_object" }, messages
  });
  const raw = r.choices?.[0]?.message?.content ?? "";
  const json = looseParse(raw);
  const out = SeoSchema.parse(json) as Seo;
  return { out, modelUsed: (r as any).model ?? model };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mediaType: "image"|"video" =
      String(body.mediaType || "image").toLowerCase() === "video" ? "video" : "image";

    // For video: use poster/thumbnail if provided (don't try to upload video to vision).
    const imageUrl: string|undefined =
      mediaType === "image" ? (body.url || body.imageUrl) :
      (body.poster || body.thumbnail || undefined);

    const cli = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    let attempt = 0, lastErr: unknown;

    while (attempt <= MAX_RETRIES) {
      try {
        const msgs: ChatCompletionMessageParam[] =
          attempt === 2
            ? [...buildMessages({ category: body.category, humanTitle: body.title, imageUrl, mediaType }),
               { role: "system" as const, content: "Reminder: avoid boilerplate; mention visible details; keep limits; return JSON only." }]
            : buildMessages({ category: body.category, humanTitle: body.title, imageUrl, mediaType });

        const model = attempt === 0 ? PRIMARY : FALLBACK;
        const res = await runOnce(cli, msgs, model);

        if (!boilerplate(res.out) && !tooVague(res.out)) {
          return NextResponse.json({ success:true, seo: res.out, usedModel: res.modelUsed });
        }
        attempt++;
        continue;
      } catch(e){ lastErr = e; attempt++; }
    }
    throw lastErr ?? new Error("SEO generation failed");
  } catch (e:any) {
    const msg = e?.message || "SEO generation failed";
    return NextResponse.json({ success:false, error: msg }, { status: 400 });
  }
}