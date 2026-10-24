import { MarkerType } from "reactflow";
import type {
  BrainstormMode,
  Connection,
  IdeaNode,
  IdeaNodeColor,
  IdeaNodeInlineUpdates,
  MindDiaryFlowEdge,
  MindDiaryFlowNode,
} from "@/types";
import { NODE_COLOR_STYLES } from "./constants";

export interface FlowNodeHandlers {
  onSelect?: (node: IdeaNode) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: IdeaNodeInlineUpdates) => void;
  onBrainstorm?: (idea: IdeaNode, mode: BrainstormMode) => Promise<void>;
}

/**
 * Convierte un modelo de dominio IdeaNode a un nodo compatible con React Flow.
 */
export function toFlowNode(
  idea: IdeaNode,
  handlers?: FlowNodeHandlers
): MindDiaryFlowNode {
  return {
    id: idea.id,
    type: "ideaNode",
    position: { x: idea.x, y: idea.y },
    data: {
      idea,
      onSelect: handlers?.onSelect,
      onDelete: handlers?.onDelete,
      onUpdate: handlers?.onUpdate,
      onBrainstorm: handlers?.onBrainstorm,
    },
  };
}

/**
 * Convierte una lista de IdeaNode a nodos de React Flow.
 */
export function toFlowNodes(
  ideas: IdeaNode[],
  handlers?: FlowNodeHandlers
): MindDiaryFlowNode[] {
  return ideas.map((idea) => toFlowNode(idea, handlers));
}

/**
 * Convierte un modelo Connection del dominio a un Edge estilizado de React Flow,
 * adoptando el color temático de la rama del nodo padre (estilo MindNode).
 */
export function toFlowEdge(
  connection: Connection,
  sourceColor?: IdeaNodeColor
): MindDiaryFlowEdge {
  const effectiveColor: IdeaNodeColor =
    connection.color ?? sourceColor ?? (connection.animated ? "blue" : "slate");
  const strokeColor =
    NODE_COLOR_STYLES[effectiveColor]?.strokeHex ?? "#64748b";

  return {
    id: connection.id,
    source: connection.source,
    target: connection.target,
    label: connection.label,
    animated: connection.animated ?? false,
    data: { color: effectiveColor },
    type: "smoothstep",
    style: {
      stroke: strokeColor,
      strokeWidth: connection.animated ? 2.25 : 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: strokeColor,
      width: 15,
      height: 15,
    },
  };
}

/**
 * Convierte una lista de Connection a Edges de React Flow, enlazando el color de cada nodo origen.
 */
export function toFlowEdges(
  connections: Connection[],
  sourceNodes?: IdeaNode[]
): MindDiaryFlowEdge[] {
  const colorByNodeId = new Map<string, IdeaNodeColor>();
  if (sourceNodes) {
    for (const node of sourceNodes) {
      colorByNodeId.set(node.id, node.color);
    }
  }
  return connections.map((conn) =>
    toFlowEdge(conn, colorByNodeId.get(conn.source))
  );
}

/**
 * Sincroniza las coordenadas (x, y) de un nodo de React Flow de vuelta al modelo IdeaNode.
 */
export function fromFlowNode(flowNode: MindDiaryFlowNode): IdeaNode {
  return {
    ...flowNode.data.idea,
    x: Math.round(flowNode.position.x),
    y: Math.round(flowNode.position.y),
  };
}

/**
 * Convierte un Edge de React Flow de vuelta al modelo de dominio Connection.
 */
export function fromFlowEdge(edge: MindDiaryFlowEdge): Connection {
  const edgeData = edge.data as { color?: IdeaNodeColor } | undefined;
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: typeof edge.label === "string" ? edge.label : undefined,
    animated: edge.animated,
    color: edgeData?.color,
  };
}

/**
 * Genera un identificador único legible para nuevos nodos o conexiones.
 */
export function createEntityId(prefix: "idea" | "conn" | "tag"): string {
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${randomPart}`;
}

/**
 * Calcula posiciones en abanico radial a la derecha del nodo padre,
 * desplazando automáticamente si detecta colisión con nodos existentes.
 */
export function calculateSpawnPositions(
  parentPos: { x: number; y: number },
  count: number,
  existingPositions: Array<{ x: number; y: number }>
): Array<{ x: number; y: number }> {
  const horizontalRadius = 380;
  const verticalGap = 195;
  const results: Array<{ x: number; y: number }> = [];

  const isColliding = (
    candidate: { x: number; y: number },
    occupied: Array<{ x: number; y: number }>
  ) => {
    return occupied.some(
      (pos) =>
        Math.abs(pos.x - candidate.x) < 290 &&
        Math.abs(pos.y - candidate.y) < 150
    );
  };

  const occupied = [...existingPositions, parentPos];

  for (let i = 0; i < count; i++) {
    const centeredIndex = i - (count - 1) / 2;
    const curveOffset = Math.abs(centeredIndex) * 28;
    let candidate = {
      x: Math.round(parentPos.x + horizontalRadius + curveOffset),
      y: Math.round(parentPos.y + centeredIndex * verticalGap),
    };

    let attempts = 0;
    while (isColliding(candidate, occupied) && attempts < 12) {
      attempts += 1;
      candidate = {
        x: candidate.x + (attempts % 2 === 0 ? 340 : 0),
        y: candidate.y + (attempts % 2 === 1 ? 185 : 0),
      };
    }

    occupied.push(candidate);
    results.push(candidate);
  }

  return results;
}
