import { NextResponse } from "next/server";
import type {
  BrainstormMode,
  BrainstormRequestPayload,
  BrainstormResponsePayload,
  GeneratedSubIdea,
} from "@/types";
import {
  buildContextualFallback,
  normalizeSubIdeas,
  sanitizeCategory,
} from "@/lib/brainstorm";

function buildSystemPrompt(mode: BrainstormMode): string {
  if (mode === "visual") {
    return [
      "Eres un analista visual y estratega creativo en Mind Diary.",
      "Dado un nodo con imagen adjunta, extrae 3 conceptos visuales o sub-ideas accionables inspiradas en la referencia visual.",
      "Responde ÚNICAMENTE con un objeto JSON válido con la estructura:",
      '{ "subIdeas": [{ "title": string, "content": string, "category": "reference" | "task" | "idea" }] }',
    ].join(" ");
  }

  if (mode === "unblock") {
    return [
      "Eres un estratega creativo minimalista integrado en Mind Diary.",
      "Dado un nodo de idea, genera entre 2 y 3 preguntas detonantes o perspectivas contrarias/disruptivas para desbloquear el pensamiento.",
      "Responde ÚNICAMENTE con un objeto JSON válido con la estructura:",
      '{ "subIdeas": [{ "title": string, "content": string, "category": "question" | "note" | "idea" }] }',
    ].join(" ");
  }

  return [
    "Eres un arquitecto de ideas e innovación integrado en Mind Diary.",
    "Dado un nodo central, genera entre 3 y 4 sub-ideas derivadas lógicamente que desglosen la idea en pasos, componentes o ángulos complementarios.",
    "Responde ÚNICAMENTE con un objeto JSON válido con la estructura:",
    '{ "subIdeas": [{ "title": string, "content": string, "category": "idea" | "project" | "task" | "reference" }] }',
  ].join(" ");
}

async function generateWithGemini(
  apiKey: string,
  payload: BrainstormRequestPayload
): Promise<GeneratedSubIdea[] | null> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt(payload.mode) }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Nodo central:\nTítulo: ${payload.title}\nContenido: ${payload.content}\nCategoría: ${payload.category}\nModo: ${payload.mode}\nIdioma: ${payload.language ?? "es"}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.75,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof rawText !== "string") return null;

  const parsed = JSON.parse(rawText) as { subIdeas?: unknown };
  const normalized = normalizeSubIdeas(parsed.subIdeas, payload.mode);
  return normalized.length > 0 ? normalized : null;
}

async function generateWithOpenAI(
  apiKey: string,
  payload: BrainstormRequestPayload
): Promise<GeneratedSubIdea[] | null> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.75,
      messages: [
        { role: "system", content: buildSystemPrompt(payload.mode) },
        {
          role: "user",
          content: `Nodo central:\nTítulo: ${payload.title}\nContenido: ${payload.content}\nCategoría: ${payload.category}\nModo: ${payload.mode}\nIdioma: ${payload.language ?? "es"}`,
        },
      ],
    }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (typeof rawText !== "string") return null;

  const parsed = JSON.parse(rawText) as { subIdeas?: unknown };
  const normalized = normalizeSubIdeas(parsed.subIdeas, payload.mode);
  return normalized.length > 0 ? normalized : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BrainstormRequestPayload>;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const category = sanitizeCategory(body.category, "idea");
    const mode: BrainstormMode =
      body.mode === "unblock"
        ? "unblock"
        : body.mode === "visual"
          ? "visual"
          : "expand";
    const language = body.language ?? "es";

    if (!title) {
      return NextResponse.json(
        { error: "El título de la idea es obligatorio." },
        { status: 400 }
      );
    }

    const payload: BrainstormRequestPayload = {
      id: typeof body.id === "string" ? body.id : "unknown",
      title,
      content,
      category,
      mode,
      language,
    };

    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    let aiSubIdeas: GeneratedSubIdea[] | null = null;

    if (geminiKey) {
      try {
        aiSubIdeas = await generateWithGemini(geminiKey, payload);
      } catch (err) {
        console.warn("Fallo en llamada a Gemini API, usando fallback:", err);
      }
    }

    if (!aiSubIdeas && openAiKey) {
      try {
        aiSubIdeas = await generateWithOpenAI(openAiKey, payload);
      } catch (err) {
        console.warn("Fallo en llamada a OpenAI API, usando fallback:", err);
      }
    }

    if (aiSubIdeas && aiSubIdeas.length > 0) {
      const responsePayload: BrainstormResponsePayload = {
        subIdeas: aiSubIdeas,
        source: "ai",
        mode,
      };
      return NextResponse.json(responsePayload);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const fallbackSubIdeas = buildContextualFallback(
      title,
      content,
      mode,
      "blue",
      language
    );
    const responsePayload: BrainstormResponsePayload = {
      subIdeas: fallbackSubIdeas,
      source: "fallback",
      mode,
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error en POST /api/brainstorm:", error);
    return NextResponse.json(
      { error: "No se pudieron generar sub-ideas en este momento." },
      { status: 500 }
    );
  }
}
