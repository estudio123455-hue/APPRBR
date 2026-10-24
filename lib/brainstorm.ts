import type {
  BrainstormMode,
  GeneratedSubIdea,
  IdeaCategory,
  IdeaNodeColor,
  SupportedLanguage,
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
  mode: BrainstormMode,
  parentColor: IdeaNodeColor = "blue"
): GeneratedSubIdea[] {
  if (!Array.isArray(rawList)) return [];

  const defaultCategory: IdeaCategory =
    mode === "unblock" ? "question" : mode === "visual" ? "reference" : "idea";

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
      // Hereda armónicamente el color temático de la rama del padre
      color: parentColor,
    }))
    .slice(0, 4);
}

/**
 * Generador inteligente contextual y multi-idioma (Fallback) para funcionar sin servidor Node.js
 * (en GitHub Pages) para los modos 'expand', 'unblock' y 'visual' (análisis de foto con IA).
 * Los nodos hijos heredan armónicamente el color temático de la rama del nodo padre.
 */
export function buildContextualFallback(
  title: string,
  content: string,
  mode: BrainstormMode,
  parentColor: IdeaNodeColor = "blue",
  lang: SupportedLanguage = "es"
): GeneratedSubIdea[] {
  const cleanTitle = title.trim();
  const shortTopic =
    cleanTitle.length > 34 ? `${cleanTitle.slice(0, 34)}…` : cleanTitle;

  if (mode === "visual") {
    const visualByLang: Record<SupportedLanguage, GeneratedSubIdea[]> = {
      es: [
        {
          title: `Composición y Patrón Visual: ${shortTopic}`,
          content: `Elementos clave detectados en la imagen de referencia para aplicar al diseño o estructura de "${cleanTitle}".`,
          category: "reference",
          color: parentColor,
        },
        {
          title: `Concepto Accionable desde Imagen`,
          content: `Transformar la captura visual de "${shortTopic}" en un prototipo concreto o tarea verificable.`,
          category: "task",
          color: parentColor,
        },
        {
          title: `Asociación Creativa y Contexto`,
          content: `¿Qué detalle sutil de esta fotografía inspira una nueva dirección para "${cleanTitle}"?`,
          category: "idea",
          color: parentColor,
        },
      ],
      en: [
        {
          title: `Visual Pattern & Layout: ${shortTopic}`,
          content: `Key visual elements extracted from the reference photo to inform "${cleanTitle}".`,
          category: "reference",
          color: parentColor,
        },
        {
          title: `Actionable Concept from Photo`,
          content: `Turn the captured visual reference of "${shortTopic}" into a concrete prototype or task.`,
          category: "task",
          color: parentColor,
        },
        {
          title: `Creative Visual Association`,
          content: `What subtle detail in this image sparks a new angle for "${cleanTitle}"?`,
          category: "idea",
          color: parentColor,
        },
      ],
      fr: [
        {
          title: `Motif et Composition : ${shortTopic}`,
          content: `Éléments visuels clés extraits de l'image de référence pour enrichir "${cleanTitle}".`,
          category: "reference",
          color: parentColor,
        },
        {
          title: `Concept Actionnable depuis la Photo`,
          content: `Transformer la capture visuelle de "${shortTopic}" en prototype concret.`,
          category: "task",
          color: parentColor,
        },
        {
          title: `Association Créative Visuelle`,
          content: `Quel détail subtil de cette image inspire une nouvelle piste pour "${cleanTitle}" ?`,
          category: "idea",
          color: parentColor,
        },
      ],
      pt: [
        {
          title: `Padrão e Composição Visual: ${shortTopic}`,
          content: `Elementos principais extraídos da foto de referência para aplicar em "${cleanTitle}".`,
          category: "reference",
          color: parentColor,
        },
        {
          title: `Conceito Acionável da Foto`,
          content: `Transformar a referência visual de "${shortTopic}" em um protótipo ou tarefa prática.`,
          category: "task",
          color: parentColor,
        },
        {
          title: `Associação Criativa Visual`,
          content: `Que detalhe sutil desta imagem inspira um novo caminho para "${cleanTitle}"?`,
          category: "idea",
          color: parentColor,
        },
      ],
      de: [
        {
          title: `Visuelles Muster & Struktur: ${shortTopic}`,
          content: `Wichtige visuelle Elemente aus dem Referenzfoto für "${cleanTitle}" abgeleitet.`,
          category: "reference",
          color: parentColor,
        },
        {
          title: `Umsetzbares Konzept aus Foto`,
          content: `Die visuelle Aufnahme von "${shortTopic}" in einen konkreten Prototyp überführen.`,
          category: "task",
          color: parentColor,
        },
        {
          title: `Kreative Bild-Assoziation`,
          content: `Welches Detail in diesem Bild inspiriert eine neue Richtung für "${cleanTitle}"?`,
          category: "idea",
          color: parentColor,
        },
      ],
    };

    return visualByLang[lang] ?? visualByLang.es;
  }

  if (mode === "unblock") {
    const unblockByLang: Record<SupportedLanguage, GeneratedSubIdea[]> = {
      es: [
        {
          title: `¿Y si invertimos "${shortTopic}"?`,
          content: `¿Qué ocurriría si hacemos exactamente lo opuesto a "${cleanTitle}" para descubrir qué valor es realmente indispensable?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `Restricción Extrema: Versión de 48h`,
          content: `Si tuvieras que validar "${shortTopic}" en 48 horas con el 10% de recursos, ¿qué única pieza conservarías?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `Perspectiva del Usuario Escéptico`,
          content: `¿Cuál es la objeción más fuerte por la que alguien rechazaría "${shortTopic}" en los primeros 10 segundos?`,
          category: "note",
          color: parentColor,
        },
      ],
      en: [
        {
          title: `What if we invert "${shortTopic}"?`,
          content: `What happens if we do the exact opposite of "${cleanTitle}" to uncover what truly matters?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `48-Hour Extreme Constraint`,
          content: `If you had to launch "${shortTopic}" in 48 hours with 10% of the budget, what single core piece stays?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `The Skeptic's Perspective`,
          content: `What is the #1 reason someone would reject "${shortTopic}" in the first 10 seconds?`,
          category: "note",
          color: parentColor,
        },
      ],
      fr: [
        {
          title: `Et si on inversait "${shortTopic}" ?`,
          content: `Que se passerait-il si nous faisions l'exact opposé de "${cleanTitle}" pour isoler l'essentiel ?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `Contrainte Extrême : Version 48h`,
          content: `Si vous deviez valider "${shortTopic}" en 48h avec 10% des ressources, que garderiez-vous ?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `Point de Vue du Sceptique`,
          content: `Quelle est l'objection principale contre "${shortTopic}" dès les 10 premières secondes ?`,
          category: "note",
          color: parentColor,
        },
      ],
      pt: [
        {
          title: `E se invertermos "${shortTopic}"?`,
          content: `O que aconteceria se fizéssemos o oposto de "${cleanTitle}" para descobrir o valor essencial?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `Restrição Extrema: Versão 48h`,
          content: `Se tivesse que validar "${shortTopic}" em 48 horas com 10% dos recursos, o que manteria?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `Visão do Usuário Cético`,
          content: `Qual é a maior objeção pela qual alguém rejeitaria "${shortTopic}" nos primeiros 10 segundos?`,
          category: "note",
          color: parentColor,
        },
      ],
      de: [
        {
          title: `Was, wenn wir "${shortTopic}" umkehren?`,
          content: `Was passiert, wenn wir genau das Gegenteil von "${cleanTitle}" tun, um den Kernwert zu finden?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `48-Stunden-Extremfokus`,
          content: `Wenn "${shortTopic}" in 48 Stunden mit 10% Aufwand starten müsste, welches Kernelement bleibt?`,
          category: "question",
          color: parentColor,
        },
        {
          title: `Perspektive des Skeptikers`,
          content: `Was ist der stärkste Einwand gegen "${shortTopic}" in den ersten 10 Sekunden?`,
          category: "note",
          color: parentColor,
        },
      ],
    };

    return unblockByLang[lang] ?? unblockByLang.es;
  }

  const expandByLang: Record<SupportedLanguage, GeneratedSubIdea[]> = {
    es: [
      {
        title: `Prototipo mínimo de ${shortTopic}`,
        content: `Definir el alcance más pequeño y verificable para validar "${cleanTitle}" sin sobre-ingeniería inicial.`,
        category: "task",
        color: parentColor,
      },
      {
        title: `Arquitectura y Flujo Clave`,
        content: `Identificar las dependencias principales, entradas y salidas necesarias para ejecutar "${cleanTitle}".`,
        category: "project",
        color: parentColor,
      },
      {
        title: `Métrica de Impacto y Éxito`,
        content: `¿Qué señal concreta confirmará que "${shortTopic}" está resolviendo el problema real de forma fluida?`,
        category: "idea",
        color: parentColor,
      },
    ],
    en: [
      {
        title: `Minimum Prototype: ${shortTopic}`,
        content: `Define the smallest verifiable scope to validate "${cleanTitle}" without over-engineering.`,
        category: "task",
        color: parentColor,
      },
      {
        title: `Core Architecture & Flow`,
        content: `Identify key dependencies, inputs, and outputs required to execute "${cleanTitle}".`,
        category: "project",
        color: parentColor,
      },
      {
        title: `Impact & Success Metric`,
        content: `What concrete signal will confirm that "${shortTopic}" solves the core problem?`,
        category: "idea",
        color: parentColor,
      },
    ],
    fr: [
      {
        title: `Prototype Minimum : ${shortTopic}`,
        content: `Définir le périmètre minimal vérifiable pour valider "${cleanTitle}" rapidement.`,
        category: "task",
        color: parentColor,
      },
      {
        title: `Architecture et Flux Clé`,
        content: `Identifier les dépendances principales nécessaires pour exécuter "${cleanTitle}".`,
        category: "project",
        color: parentColor,
      },
      {
        title: `Indicateur d'Impact et Succès`,
        content: `Quel signal concret confirmera que "${shortTopic}" résout efficacement le problème ?`,
        category: "idea",
        color: parentColor,
      },
    ],
    pt: [
      {
        title: `Protótipo Mínimo: ${shortTopic}`,
        content: `Definir o menor escopo verificável para validar "${cleanTitle}" rapidamente.`,
        category: "task",
        color: parentColor,
      },
      {
        title: `Arquitetura e Fluxo Principal`,
        content: `Identificar as dependências, entradas e saídas para executar "${cleanTitle}".`,
        category: "project",
        color: parentColor,
      },
      {
        title: `Métrica de Impacto e Sucesso`,
        content: `Qual sinal concreto confirmará que "${shortTopic}" resolve o problema real?`,
        category: "idea",
        color: parentColor,
      },
    ],
    de: [
      {
        title: `Minimaler Prototyp: ${shortTopic}`,
        content: `Den kleinsten überprüfbaren Umfang definieren, um "${cleanTitle}" schnell zu validieren.`,
        category: "task",
        color: parentColor,
      },
      {
        title: `Kernarchitektur & Ablauf`,
        content: `Wichtige Abhängigkeiten, Eingaben und Ausgaben für "${cleanTitle}" festlegen.`,
        category: "project",
        color: parentColor,
      },
      {
        title: `Erfolgs- & Wirkungsmetrik`,
        content: `Welches konkrete Signal bestätigt, dass "${shortTopic}" das Problem löst?`,
        category: "idea",
        color: parentColor,
      },
    ],
  };

  void content;
  return expandByLang[lang] ?? expandByLang.es;
}
