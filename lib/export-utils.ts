import type {
  Connection,
  IdeaCategory,
  IdeaNode,
  IdeaNodeColor,
  MindDiaryPersistedState,
} from "@/types";
import { CATEGORY_LABELS } from "./constants";

/**
 * Construye un documento Markdown (.md) estructurado jerárquicamente
 * ideal para importar en Notion, Obsidian o repositorios de documentación.
 */
export function buildMarkdownDocument(
  nodes: IdeaNode[],
  connections: Connection[]
): string {
  const dateStr = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines: string[] = [
    `# 🧠 Mind Diary — Mapa de Ideas`,
    `> Exportado el ${dateStr} · ${nodes.length} ${
      nodes.length === 1 ? "idea" : "ideas"
    } · ${connections.length} ${
      connections.length === 1 ? "conexión" : "conexiones"
    }`,
    "",
  ];

  if (nodes.length === 0) {
    lines.push("_El lienzo no contiene ideas todavía._");
    return lines.join("\n");
  }

  const nodeMap = new Map<string, IdeaNode>(nodes.map((n) => [n.id, n]));
  const childrenByParent = new Map<string, string[]>();
  const incomingCount = new Map<string, number>();

  for (const node of nodes) {
    childrenByParent.set(node.id, []);
    incomingCount.set(node.id, 0);
  }

  for (const conn of connections) {
    if (nodeMap.has(conn.source) && nodeMap.has(conn.target)) {
      childrenByParent.get(conn.source)?.push(conn.target);
      incomingCount.set(conn.target, (incomingCount.get(conn.target) ?? 0) + 1);
    }
  }

  // Nodos raíz (sin conexiones entrantes); si hay ciclo, incluir todos
  const rootNodes = nodes.filter(
    (n) => (incomingCount.get(n.id) ?? 0) === 0
  );
  const startNodes = rootNodes.length > 0 ? rootNodes : nodes;
  const visited = new Set<string>();

  const renderNodeSection = (node: IdeaNode, depth: number) => {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    const headingPrefix = "#".repeat(Math.min(depth + 2, 5));
    const categoryLabel = CATEGORY_LABELS[node.category] ?? node.category;
    const tagList =
      node.tags.length > 0
        ? node.tags.map((t) => `\`#${t.label}\``).join(" ")
        : "_Sin etiquetas_";

    lines.push(`${headingPrefix} ${node.title}`);
    lines.push(`- **Categoría:** ${categoryLabel}`);
    lines.push(`- **Etiquetas:** ${tagList}`);
    lines.push("");
    lines.push(node.content);
    lines.push("");

    const childIds = childrenByParent.get(node.id) ?? [];
    for (const childId of childIds) {
      const childNode = nodeMap.get(childId);
      if (childNode && !visited.has(childId)) {
        renderNodeSection(childNode, depth + 1);
      }
    }
  };

  lines.push("## 🗂️ Estructura Jerárquica de Ideas");
  lines.push("");

  for (const root of startNodes) {
    renderNodeSection(root, 1);
  }

  // Incluir cualquier nodo desconectado o en ciclo que no haya sido visitado aún
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      renderNodeSection(node, 1);
    }
  }

  if (connections.length > 0) {
    lines.push("---");
    lines.push("## 🔗 Mapa de Conexiones");
    lines.push("");
    for (const conn of connections) {
      const sourceTitle = nodeMap.get(conn.source)?.title ?? conn.source;
      const targetTitle = nodeMap.get(conn.target)?.title ?? conn.target;
      lines.push(`- **${sourceTitle}** → **${targetTitle}**`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Descarga un archivo de texto en el navegador del usuario.
 */
function triggerBrowserDownload(
  content: string,
  filename: string,
  mimeType: string
) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function getDateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Exporta y descarga el lienzo actual como archivo Markdown (.md).
 */
export function downloadMarkdownExport(
  nodes: IdeaNode[],
  connections: Connection[]
) {
  const markdown = buildMarkdownDocument(nodes, connections);
  triggerBrowserDownload(
    markdown,
    `mind-diary-${getDateStamp()}.md`,
    "text/markdown;charset=utf-8"
  );
}

/**
 * Exporta y descarga el respaldo completo del lienzo como archivo JSON (.json).
 */
export function downloadJsonBackup(
  nodes: IdeaNode[],
  connections: Connection[]
) {
  const backup: MindDiaryPersistedState & { version: string } = {
    version: "1.0",
    updatedAt: new Date().toISOString(),
    nodes,
    connections,
  };
  triggerBrowserDownload(
    JSON.stringify(backup, null, 2),
    `mind-diary-backup-${getDateStamp()}.json`,
    "application/json;charset=utf-8"
  );
}

/**
 * Valida y parsea un archivo JSON de respaldo para reimportarlo en el lienzo.
 */
export function parseJsonBackup(rawText: string): {
  nodes: IdeaNode[];
  connections: Connection[];
} {
  const parsed = JSON.parse(rawText) as Partial<MindDiaryPersistedState>;

  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.connections)) {
    throw new Error("El archivo JSON no contiene arrays válidos de 'nodes' y 'connections'.");
  }

  const sanitizedNodes: IdeaNode[] = parsed.nodes
    .filter(
      (n): n is IdeaNode =>
        typeof n === "object" &&
        n !== null &&
        typeof n.id === "string" &&
        typeof n.title === "string"
    )
    .map((n, index) => ({
      id: n.id,
      title: n.title,
      content: typeof n.content === "string" ? n.content : "",
      color: (n.color as IdeaNodeColor) || "slate",
      category: (n.category as IdeaCategory) || "idea",
      tags: Array.isArray(n.tags) ? n.tags : [],
      x: typeof n.x === "number" ? n.x : 180 + index * 60,
      y: typeof n.y === "number" ? n.y : 160 + index * 60,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));

  const validIds = new Set(sanitizedNodes.map((n) => n.id));
  const sanitizedConnections: Connection[] = parsed.connections
    .filter(
      (c): c is Connection =>
        typeof c === "object" &&
        c !== null &&
        typeof c.id === "string" &&
        typeof c.source === "string" &&
        typeof c.target === "string" &&
        validIds.has(c.source) &&
        validIds.has(c.target)
    )
    .map((c) => ({
      id: c.id,
      source: c.source,
      target: c.target,
      label: c.label,
      animated: Boolean(c.animated),
    }));

  return {
    nodes: sanitizedNodes,
    connections: sanitizedConnections,
  };
}
