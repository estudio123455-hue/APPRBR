import { NextResponse } from "next/server";
import type {
  BrainstormMode,
  BrainstormRequestPayload,
  BrainstormResponsePayload,
  GeneratedSubIdea,
  IdeaCategory,
  IdeaNodeColor,
} from "@/types";

const VALID_CATEGORIES: IdeaCategory[] = [
  "idea",
  "project",
  "task",
  "reference",
  "question",
  "note",
];

const VALID_COLORS: IdeaNodeColor[] = [
  "slate",
  "blue",
  "indigo",
  "emerald",
  "amber",
  "rose",
  "violet",
];

function sanitizeCategory(
  value: unknown,
  fallback: IdeaCategory
): IdeaCategory {
  return typeof value === "string" &&
    VALID_CATEGORIES.includes(value as IdeaCategory)
    ? (value as IdeaCategory)
    : fallback;
}

function sanitizeColor(
  value: unknown,
  fallback: IdeaNodeColor
): IdeaNodeColor {
  return typeof value === "string" &&
    VALID_COLORS.includes(value as IdeaNodeColor)
    ? (value as IdeaNodeColor)
    : fallback;
}

function normalizeSubIdeas(
  rawList: unknown,
  mode: BrainstormMode
): GeneratedSubIdea[] {
  if (!Array.isArray(rawList)) return [];

  const defaultCategory: IdeaCategory =
    mode === "unblock" ? "question" : "idea";
  const defaultColor: IdeaNodeColor = mode === "unblock" ? "amber" : "indigo";

  return rawList
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      title:
        typeof item.title === "string" && item.title.trim()
          ? item.title.trim().slice(0, 90)
          : "Sub-idea derivada",
      content:
        typeof item.content === "string" && item.content.trim()
          ? item.content.trim().slice(0, 240)
          : "Explorar implicaciones prácticas de este concepto.",
      category: sanitizeCategory(item.category, defaultCategory),
      color: sanitizeColor(item.color, defaultColor),
    }))
    .slice(0, 4);
}

/**
 * Generador inteligente local (Fallback) cuando no hay API Key configurada en .env.local
 * o cuando el proveedor externo no responde. Adapta las sub-ideas al título y contexto del nodo.
 */
function buildContextualFallback(
  title: string,
  content: string,
  mode: BrainstormMode
): GeneratedSubIdea[] {
  const cleanTitle = title.trim();
  const shortTopic =
    cleanTitle.length > 36 ? `${cleanTitle.slice(0, 36)}…` : cleanTitle;
  const hasContext =
    content.trim().length > 10 &&
    !content.includes("Sin descripción") &&
    !content.includes("Capturado rápidamente");

  if (mode === "unblock") {
    return [
      {
        title: `¿Y si invertimos "${shortTopic}"?`,
        content: hasContext
          ? `En lugar de asumir "${content.slice(0, 70)}...", ¿qué pasaría si eliminamos el paso principal y resolvemos el opuesto?`
          : `¿Qué ocurriría si hacemos exactamente lo opuesto a "${cleanTitle}" para descubrir qué valor es realmente indispensable?`,
        category: "question",
        color: "amber",
      },
      {
        title: `Restricción Extrema: Versión de 48h`,
        content: `Si tuvieras que lanzar o validar "${shortTopic}" en 48 horas con el 10% de los recursos, ¿qué única pieza conservarías?`,
        category: "question",
        color: "rose",
      },
      {
        title: `Perspectiva del Usuario Escéptico`,
        content: `¿Cuál es la objeción más fuerte por la que alguien rechazaría "${shortTopic}" en los primeros 10 segundos y cómo anticiparla?`,
        category: "note",
        color: "violet",
      },
    ];
  }

  return [
    {
      title: `Prototipo mínimo de ${shortTopic}`,
      content: `Definir el alcance más pequeño y verificable para validar "${cleanTitle}" sin sobre-ingeniería inicial.`,
      category: "task",
      color: "emerald",
    },
    {
      title: `Arquitectura y Flujo Clave`,
      content: hasContext
        ? `Desglosar los componentes técnicos y de experiencia necesarios para sostener: "${content.slice(0, 80)}".`
        : `Identificar las dependencias principales, entradas y salidas necesarias para ejecutar "${cleanTitle}".`,
      category: "project",
      color: "blue",
    },
    {
      title: `Métrica de Impacto y Éxito`,
      content: `¿Qué señal concreta confirmará que "${shortTopic}" está resolviendo el problema real de forma fluida?`,
      category: "idea",
      color: "indigo",
    },
    {
      title: `Casos Borde y Riesgos`,
      content: `Mapear posibles puntos de fricción o cuellos de botella antes de escalar "${shortTopic}".`,
      category: "reference",
      color: "violet",
    },
  ];
}

function buildSystemPrompt(mode: BrainstormMode): string {
  if (mode === "unblock") {
    return [
      "Eres un estratega creativo minimalista integrado en Mind Diary.",
      "Dado un nodo de idea, genera entre 2 y 3 preguntas detonantes o perspectivas contrarias/disruptivas para desbloquear el pensamiento.",
      "Responde ÚNICAMENTE con un objeto JSON válido con la estructura:",
      '{ "subIdeas": [{ "title": string, "content": string, "category": "question" | "note" | "idea", "color": "amber" | "rose" | "violet" }] }',
      "En español, conciso, claro y accionable.",
    ].join(" ");
  }

  return [
    "Eres un arquitecto de ideas e innovación integrado en Mind Diary.",
    "Dado un nodo central, genera entre 3 y 4 sub-ideas derivadas lógicamente que desglosen la idea en pasos, componentes o ángulos complementarios.",
    "Responde ÚNICAMENTE con un objeto JSON válido con la estructura:",
    '{ "subIdeas": [{ "title": string, "content": string, "category": "idea" | "project" | "task" | "reference", "color": "blue" | "indigo" | "emerald" | "violet" }] }',
    "En español, conciso, claro y accionable.",
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
                text: `Nodo central:\nTítulo: ${payload.title}\nContenido: ${payload.content}\nCategoría: ${payload.category}\nModo: ${payload.mode}`,
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
          content: `Nodo central:\nTítulo: ${payload.title}\nContenido: ${payload.content}\nCategoría: ${payload.category}\nModo: ${payload.mode}`,
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
      body.mode === "unblock" ? "unblock" : "expand";

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

    // Simular una breve latencia natural en modo fallback local para apreciar el estado de carga
    await new Promise((resolve) => setTimeout(resolve, 650));

    const fallbackSubIdeas = buildContextualFallback(title, content, mode);
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
