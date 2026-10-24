import type {
  Connection,
  IdeaCategory,
  IdeaNode,
  IdeaNodeColor,
} from "@/types";

export const NODE_COLOR_STYLES: Record<
  IdeaNodeColor,
  {
    bg: string;
    childBg: string;
    border: string;
    childBorder: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    dot: string;
    strokeHex: string;
    label: string;
  }
> = {
  slate: {
    bg: "bg-white",
    childBg: "bg-slate-50/70",
    border: "border-slate-200/90 hover:border-slate-300",
    childBorder: "border-slate-300/90 hover:border-slate-400",
    accent: "bg-slate-500",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    dot: "bg-slate-400",
    strokeHex: "#64748b",
    label: "Pizarra",
  },
  blue: {
    bg: "bg-white",
    childBg: "bg-blue-50/35",
    border: "border-blue-200/90 hover:border-blue-300",
    childBorder: "border-blue-300/90 hover:border-blue-400",
    accent: "bg-blue-500",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    dot: "bg-blue-500",
    strokeHex: "#2563eb",
    label: "Azul",
  },
  indigo: {
    bg: "bg-white",
    childBg: "bg-indigo-50/35",
    border: "border-indigo-200/90 hover:border-indigo-300",
    childBorder: "border-indigo-300/90 hover:border-indigo-400",
    accent: "bg-indigo-500",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    dot: "bg-indigo-500",
    strokeHex: "#4f46e5",
    label: "Índigo",
  },
  emerald: {
    bg: "bg-white",
    childBg: "bg-emerald-50/35",
    border: "border-emerald-200/90 hover:border-emerald-300",
    childBorder: "border-emerald-300/90 hover:border-emerald-400",
    accent: "bg-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    dot: "bg-emerald-500",
    strokeHex: "#10b981",
    label: "Esmeralda",
  },
  amber: {
    bg: "bg-white",
    childBg: "bg-amber-50/35",
    border: "border-amber-200/90 hover:border-amber-300",
    childBorder: "border-amber-300/90 hover:border-amber-400",
    accent: "bg-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    dot: "bg-amber-500",
    strokeHex: "#f59e0b",
    label: "Ámbar",
  },
  rose: {
    bg: "bg-white",
    childBg: "bg-rose-50/35",
    border: "border-rose-200/90 hover:border-rose-300",
    childBorder: "border-rose-300/90 hover:border-rose-400",
    accent: "bg-rose-500",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    dot: "bg-rose-500",
    strokeHex: "#f43f5e",
    label: "Rosa",
  },
  violet: {
    bg: "bg-white",
    childBg: "bg-violet-50/35",
    border: "border-violet-200/90 hover:border-violet-300",
    childBorder: "border-violet-300/90 hover:border-violet-400",
    accent: "bg-violet-500",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    dot: "bg-violet-500",
    strokeHex: "#7c3aed",
    label: "Violeta",
  },
};

export const CATEGORY_LABELS: Record<IdeaCategory, string> = {
  idea: "Idea",
  project: "Proyecto",
  task: "Tarea",
  reference: "Referencia",
  question: "Pregunta",
  note: "Nota",
};

export const INITIAL_IDEA_NODES: IdeaNode[] = [
  {
    id: "idea-1",
    title: "Visión de Mind Diary",
    content:
      "Un espacio silencioso y minimalista para capturar pensamientos, conectar conceptos y estructurar proyectos visualmente.",
    color: "blue",
    category: "project",
    tags: [
      { id: "tag-1", label: "arquitectura", color: "blue" },
      { id: "tag-2", label: "ux-minimal", color: "slate" },
    ],
    x: 120,
    y: 160,
  },
  {
    id: "idea-2",
    title: "Sistema de Nodos Modulares",
    content:
      "Cada tarjeta representa una unidad atómica de pensamiento con etiquetas, categoría y acento cromático sutil.",
    color: "blue",
    category: "idea",
    parentId: "idea-1",
    tags: [
      { id: "tag-3", label: "react-flow", color: "indigo" },
      { id: "tag-4", label: "componentes", color: "slate" },
    ],
    x: 540,
    y: 70,
  },
  {
    id: "idea-3",
    title: "Persistencia y Búsqueda Rápida",
    content:
      "Filtrado instantáneo por etiquetas, atajos de teclado y sincronización del grafo de conocimiento.",
    color: "emerald",
    category: "task",
    parentId: "idea-1",
    tags: [
      { id: "tag-5", label: "estado", color: "emerald" },
      { id: "tag-6", label: "roadmap", color: "amber" },
    ],
    x: 540,
    y: 300,
  },
];

export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: "conn-1-2",
    source: "idea-1",
    target: "idea-2",
    color: "blue",
  },
  {
    id: "conn-1-3",
    source: "idea-1",
    target: "idea-3",
    color: "blue",
  },
];
