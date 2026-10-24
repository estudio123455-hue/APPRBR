import type {
  BrainstormMode,
  GeneratedSubIdea,
  IdeaCategory,
  IdeaNodeColor,
} from "@/types";

export const VALID_CATEGORIES: IdeaCategory[] = [
  "idea",
  "project",
  "task",
  "reference",
  "question",
  "note",
];

export const VALID_COLORS: IdeaNodeColor[] = [
  "slate",
  "blue",
  "indigo",
  "emerald",
  "amber",
  "rose",
  "violet",
];

export function sanitizeCategory(
  value: unknown,
  fallback: IdeaCategory
): IdeaCategory {
  return typeof value === "string" &&
    VALID_CATEGORIES.includes(value as IdeaCategory)
    ? (value as IdeaCategory)
    : fallback;
}

export function sanitizeColor(
  value: unknown,
  fallback: IdeaNodeColor
): IdeaNodeColor {
  return typeof value === "string" &&
    VALID_COLORS.includes(value as IdeaNodeColor)
    ? (value as IdeaNodeColor)
    : fallback;
}

export function normalizeSubIdeas(
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
 * Generador inteligente contextual (Fallback) para funcionar sin servidor Node.js
 * (por ejemplo en GitHub Pages) o cuando no hay API Key configurada.
 */
export function buildContextualFallback(
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
