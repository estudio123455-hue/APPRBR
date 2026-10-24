import type { Edge, Node } from "reactflow";

/**
 * Paleta de colores semánticos minimalistas para los nodos de ideas.
 */
export type IdeaNodeColor =
  | "slate"
  | "blue"
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "violet";

/**
 * Categorías principales para clasificar ideas en Mind Diary.
 */
export type IdeaCategory =
  | "idea"
  | "project"
  | "task"
  | "reference"
  | "question"
  | "note";

/**
 * Modos del asistente creativo de IA.
 * - 'expand': genera 3 a 4 sub-ideas derivadas lógicamente.
 * - 'unblock': genera 2 a 3 preguntas detonantes o perspectivas disruptivas.
 */
export type BrainstormMode = "expand" | "unblock";

/**
 * Payload enviado al endpoint POST /api/brainstorm.
 */
export interface BrainstormRequestPayload {
  id: string;
  title: string;
  content: string;
  category: IdeaCategory;
  mode: BrainstormMode;
}

/**
 * Sub-idea estructurada devuelta por el endpoint de IA.
 */
export interface GeneratedSubIdea {
  title: string;
  content: string;
  category?: IdeaCategory;
  color?: IdeaNodeColor;
}

/**
 * Respuesta JSON del endpoint POST /api/brainstorm.
 */
export interface BrainstormResponsePayload {
  subIdeas: GeneratedSubIdea[];
  source?: "ai" | "fallback";
  mode?: BrainstormMode;
}

/**
 * Modelo de etiqueta (Tag) para organizar y filtrar nodos.
 */
export interface Tag {
  id: string;
  label: string;
  color?: IdeaNodeColor;
}

/**
 * Modelo principal de un nodo de idea en Mind Diary.
 */
export interface IdeaNode {
  id: string;
  title: string;
  content: string;
  color: IdeaNodeColor;
  category: IdeaCategory;
  tags: Tag[];
  x: number;
  y: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Modelo de conexión dirigida entre dos nodos de ideas.
 */
export interface Connection {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

/**
 * Estructura persistida en localStorage bajo la clave 'mind_diary_state'.
 */
export interface MindDiaryPersistedState {
  nodes: IdeaNode[];
  connections: Connection[];
  updatedAt: string;
}

/**
 * Campos editables en línea desde IdeaNodeCard.
 */
export type IdeaNodeInlineUpdates = Partial<
  Pick<IdeaNode, "title" | "content" | "color" | "category">
>;

/**
 * Payload de datos inyectado dentro del nodo personalizado de React Flow.
 */
export interface IdeaNodeData {
  idea: IdeaNode;
  onSelect?: (node: IdeaNode) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: IdeaNodeInlineUpdates) => void;
  onBrainstorm?: (idea: IdeaNode, mode: BrainstormMode) => Promise<void>;
}

export type MindDiaryFlowNode = Node<IdeaNodeData>;
export type MindDiaryFlowEdge = Edge;
