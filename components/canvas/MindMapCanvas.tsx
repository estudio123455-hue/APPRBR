"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection as FlowConnection,
} from "reactflow";
import { AlertCircle, Sparkles } from "lucide-react";
import type {
  BrainstormMode,
  BrainstormResponsePayload,
  Connection,
  IdeaNode,
  IdeaNodeColor,
  IdeaNodeInlineUpdates,
} from "@/types";
import {
  INITIAL_CONNECTIONS,
  INITIAL_IDEA_NODES,
  NODE_COLOR_STYLES,
} from "@/lib/constants";
import {
  calculateSpawnPositions,
  createEntityId,
  fromFlowEdge,
  fromFlowNode,
  toFlowEdge,
  toFlowEdges,
  toFlowNode,
  toFlowNodes,
  type FlowNodeHandlers,
} from "@/lib/flow-utils";
import {
  downloadJsonBackup,
  downloadMarkdownExport,
  parseJsonBackup,
} from "@/lib/export-utils";
import { buildContextualFallback } from "@/lib/brainstorm";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth-context";
import { useAutoSave } from "@/lib/useAutoSave";
import { IdeaNodeCard } from "./IdeaNodeCard";
import { Toolbar } from "@/components/ui/Toolbar";
import { NodeModal } from "@/components/ui/NodeModal";
import { QuickCapture } from "@/components/ui/QuickCapture";
import { ConfirmClearModal } from "@/components/ui/ConfirmClearModal";
import { HowItWorksModal } from "@/components/ui/HowItWorksModal";
import { AuthModal } from "@/components/auth/AuthModal";

interface ToastMessage {
  id: string;
  type: "success" | "error";
  text: string;
}

function MindMapCanvasInner() {
  const { language, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    toFlowNodes(INITIAL_IDEA_NODES)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    toFlowEdges(INITIAL_CONNECTIONS, INITIAL_IDEA_NODES)
  );

  const showToast = useCallback((type: "success" | "error", text: string) => {
    const id = createEntityId("tag");
    setToast({ id, type, text });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  }, []);

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [setNodes, setEdges]
  );

  const handleUpdateNode = useCallback(
    (id: string, updates: IdeaNodeInlineUpdates) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                idea: {
                  ...node.data.idea,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }
          // Si cambió el color del nodo padre, propagar armónicamente a sus sub-ideas directas
          if (updates.color && node.data.idea.parentId === id) {
            return {
              ...node,
              data: {
                ...node.data,
                idea: {
                  ...node.data.idea,
                  color: updates.color,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }
          return node;
        })
      );

      // Si cambió el color temático, actualizar también el color de las ramas (edges) salientes
      if (updates.color) {
        const newColor = updates.color;
        const strokeColor =
          NODE_COLOR_STYLES[newColor]?.strokeHex ?? "#64748b";
        setEdges((eds) =>
          eds.map((edge) => {
            if (edge.source !== id) return edge;
            return {
              ...edge,
              data: { ...edge.data, color: newColor },
              style: {
                ...edge.style,
                stroke: strokeColor,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: strokeColor,
                width: 15,
                height: 15,
              },
            };
          })
        );
      }

      if (updates.imageUrl) {
        showToast("success", t.toastPhotoAttached);
      }
    },
    [setNodes, setEdges, showToast, t.toastPhotoAttached]
  );

  const handlersRef = useRef<FlowNodeHandlers>({});

  const handleBrainstormNode = useCallback(
    async (parentIdea: IdeaNode, mode: BrainstormMode) => {
      try {
        let subIdeas: BrainstormResponsePayload["subIdeas"] = [];

        try {
          const response = await fetch("/api/brainstorm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: parentIdea.id,
              title: parentIdea.title,
              content: parentIdea.content,
              category: parentIdea.category,
              mode,
              language,
              hasImage: Boolean(parentIdea.imageUrl),
            }),
          });

          if (response.ok) {
            const data = (await response.json()) as BrainstormResponsePayload;
            if (Array.isArray(data.subIdeas) && data.subIdeas.length > 0) {
              subIdeas = data.subIdeas;
            }
          }
        } catch {
          // Hosting estático (GitHub Pages) sin servidor Node.js: usar generador local
        }

        if (subIdeas.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          subIdeas = buildContextualFallback(
            parentIdea.title,
            parentIdea.content,
            mode,
            parentIdea.color,
            language
          );
        }

        const newGeneratedIds: string[] = [];

        setNodes((currentNodes) => {
          const parentFlowNode = currentNodes.find(
            (n) => n.id === parentIdea.id
          );
          const parentPosition = parentFlowNode
            ? parentFlowNode.position
            : { x: parentIdea.x, y: parentIdea.y };
          const branchColor: IdeaNodeColor = parentFlowNode
            ? parentFlowNode.data.idea.color
            : parentIdea.color;

          const existingPositions = currentNodes.map((n) => n.position);
          const spawnPositions = calculateSpawnPositions(
            parentPosition,
            subIdeas.length,
            existingPositions
          );

          const tagLabel =
            mode === "visual"
              ? "vision-ia"
              : mode === "unblock"
                ? "unblock-ia"
                : "sub-idea-ia";

          const spawnedFlowNodes = subIdeas.map((sub, index) => {
            const newId = createEntityId("idea");
            newGeneratedIds.push(newId);

            const coords = spawnPositions[index] ?? {
              x: parentPosition.x + 380,
              y: parentPosition.y + index * 190,
            };

            const childIdea: IdeaNode = {
              id: newId,
              title: sub.title,
              content: sub.content,
              category:
                sub.category ??
                (mode === "unblock"
                  ? "question"
                  : mode === "visual"
                    ? "reference"
                    : "idea"),
              // Herencia armónica del color temático de la rama padre
              color: branchColor,
              parentId: parentIdea.id,
              tags: [
                {
                  id: createEntityId("tag"),
                  label: tagLabel,
                  color: branchColor,
                },
              ],
              x: coords.x,
              y: coords.y,
              createdAt: new Date().toISOString(),
            };

            return toFlowNode(childIdea, handlersRef.current);
          });

          return [...currentNodes, ...spawnedFlowNodes];
        });

        // Crear conexiones automáticas animadas con el color de la rama del padre
        setEdges((currentEdges) => {
          const newEdges = newGeneratedIds.map((targetId) =>
            toFlowEdge(
              {
                id: createEntityId("conn"),
                source: parentIdea.id,
                target: targetId,
                animated: true,
                color: parentIdea.color,
              },
              parentIdea.color
            )
          );
          return [...currentEdges, ...newEdges];
        });

        showToast(
          "success",
          mode === "visual"
            ? t.toastVisualAnalyzed(subIdeas.length)
            : mode === "unblock"
              ? t.toastUnblocked(subIdeas.length)
              : t.toastExpanded(subIdeas.length)
        );
      } catch (error) {
        console.error("Error al generar sub-ideas con IA:", error);
        showToast("error", t.toastAiError);
      }
    },
    [language, setNodes, setEdges, showToast, t]
  );

  const nodeHandlers = useMemo<FlowNodeHandlers>(
    () => ({
      onDelete: handleDeleteNode,
      onUpdate: handleUpdateNode,
      onBrainstorm: handleBrainstormNode,
    }),
    [handleDeleteNode, handleUpdateNode, handleBrainstormNode]
  );

  useEffect(() => {
    handlersRef.current = nodeHandlers;
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          ...nodeHandlers,
        },
      }))
    );
  }, [nodeHandlers, setNodes]);

  // Hidratación desde localStorage y persistencia con debounce de 1s
  const handleLoadSavedState = useCallback(
    (saved: { nodes: IdeaNode[]; connections: Connection[] }) => {
      setNodes(toFlowNodes(saved.nodes, nodeHandlers));
      setEdges(toFlowEdges(saved.connections, saved.nodes));
    },
    [nodeHandlers, setNodes, setEdges]
  );

  const { saveStatus, clearSavedState } = useAutoSave({
    nodes,
    edges,
    onLoadSavedState: handleLoadSavedState,
  });

  // Atajos de teclado globales y ergonomía del lienzo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditableTarget = Boolean(
        target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.tagName === "SELECT" ||
            target.isContentEditable)
      );

      // 1. Ctrl+K o Cmd+K -> Abrir/Cerrar Captura Rápida Global
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsModalOpen(false);
        setIsClearConfirmOpen(false);
        setIsHowItWorksOpen(false);
        setIsQuickCaptureOpen((prev) => !prev);
        return;
      }

      // 2. Escape -> Cerrar modales o deseleccionar nodos y conexiones del lienzo
      if (event.key === "Escape") {
        if (
          isQuickCaptureOpen ||
          isModalOpen ||
          isClearConfirmOpen ||
          isHowItWorksOpen
        ) {
          setIsQuickCaptureOpen(false);
          setIsModalOpen(false);
          setIsClearConfirmOpen(false);
          setIsHowItWorksOpen(false);
          return;
        }
        if (!isEditableTarget) {
          setNodes((nds) =>
            nds.some((n) => n.selected)
              ? nds.map((n) => (n.selected ? { ...n, selected: false } : n))
              : nds
          );
          setEdges((eds) =>
            eds.some((e) => e.selected)
              ? eds.map((e) => (e.selected ? { ...e, selected: false } : e))
              : eds
          );
        }
        return;
      }

      if (
        isEditableTarget ||
        isQuickCaptureOpen ||
        isModalOpen ||
        isClearConfirmOpen ||
        isHowItWorksOpen
      ) {
        return;
      }

      // 3. Shift+Z -> Alternar Modo Flujo Creativo (Zen Mode)
      if (
        event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();
        setIsZenMode((prev) => !prev);
        return;
      }

      // 4. Delete o Backspace -> Eliminar nodos y/o conexiones seleccionadas
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        const selectedNodeIds = new Set<string>();

        setNodes((currentNodes) => {
          for (const n of currentNodes) {
            if (n.selected) selectedNodeIds.add(n.id);
          }
          if (selectedNodeIds.size === 0) return currentNodes;
          return currentNodes.filter((n) => !n.selected);
        });

        setEdges((currentEdges) =>
          currentEdges.filter(
            (edge) =>
              !edge.selected &&
              !selectedNodeIds.has(edge.source) &&
              !selectedNodeIds.has(edge.target)
          )
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isQuickCaptureOpen,
    isModalOpen,
    isClearConfirmOpen,
    isHowItWorksOpen,
    setNodes,
    setEdges,
  ]);

  const nodeTypes = useMemo(() => ({ ideaNode: IdeaNodeCard }), []);

  const onConnect = useCallback(
    (params: FlowConnection) => {
      if (!params.source || !params.target) return;

      let sourceColor: IdeaNodeColor = "blue";
      setNodes((currentNodes) => {
        const sourceNode = currentNodes.find((n) => n.id === params.source);
        if (sourceNode) {
          sourceColor = sourceNode.data.idea.color;
        }
        // El nodo hijo conectado hereda armónicamente el color de la rama padre
        return currentNodes.map((n) => {
          if (n.id === params.target) {
            return {
              ...n,
              data: {
                ...n.data,
                idea: {
                  ...n.data.idea,
                  parentId: params.source ?? undefined,
                  color: sourceColor,
                },
              },
            };
          }
          return n;
        });
      });

      const newEdge = toFlowEdge(
        {
          id: createEntityId("conn"),
          source: params.source,
          target: params.target,
          color: sourceColor,
        },
        sourceColor
      );
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setNodes, setEdges]
  );

  /**
   * Calcula el centro de la vista actual del usuario en coordenadas del lienzo React Flow.
   */
  const getViewportCenterCoordinates = useCallback(() => {
    if (typeof window === "undefined") {
      return { x: 320, y: 200 };
    }
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    return {
      x: Math.round(center.x - 144),
      y: Math.round(center.y - 70),
    };
  }, [screenToFlowPosition]);

  const handleCreateIdeaAtCenter = useCallback(
    (newIdeaData: Omit<IdeaNode, "id" | "x" | "y">) => {
      const { x, y } = getViewportCenterCoordinates();
      const newIdea: IdeaNode = {
        ...newIdeaData,
        id: createEntityId("idea"),
        x,
        y,
        createdAt: new Date().toISOString(),
      };

      const flowNode = toFlowNode(newIdea, nodeHandlers);
      setNodes((nds) => [...nds, flowNode]);
    },
    [getViewportCenterCoordinates, nodeHandlers, setNodes]
  );

  // Funciones de Exportación, Importación y Limpieza
  const handleExportMarkdown = useCallback(() => {
    const domainNodes = nodes.map(fromFlowNode);
    const domainConnections = edges.map(fromFlowEdge);
    downloadMarkdownExport(domainNodes, domainConnections);
    showToast("success", t.toastMarkdownExported);
  }, [nodes, edges, showToast, t.toastMarkdownExported]);

  const handleExportJson = useCallback(() => {
    const domainNodes = nodes.map(fromFlowNode);
    const domainConnections = edges.map(fromFlowEdge);
    downloadJsonBackup(domainNodes, domainConnections);
    showToast("success", t.toastJsonExported);
  }, [nodes, edges, showToast, t.toastJsonExported]);

  const handleImportJson = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const { nodes: importedNodes, connections: importedConnections } =
          parseJsonBackup(text);
        setNodes(toFlowNodes(importedNodes, nodeHandlers));
        setEdges(toFlowEdges(importedConnections, importedNodes));
        showToast("success", t.toastJsonImported(importedNodes.length));
      } catch (error) {
        console.error("Error al importar respaldo JSON:", error);
        showToast("error", t.toastJsonImportError);
      }
    },
    [nodeHandlers, setNodes, setEdges, showToast, t]
  );

  const handleClearEmpty = useCallback(() => {
    clearSavedState();
    setNodes([]);
    setEdges([]);
    showToast("success", t.toastCleared);
  }, [clearSavedState, setNodes, setEdges, showToast, t.toastCleared]);

  const handleResetTemplate = useCallback(() => {
    clearSavedState();
    setNodes(toFlowNodes(INITIAL_IDEA_NODES, nodeHandlers));
    setEdges(toFlowEdges(INITIAL_CONNECTIONS, INITIAL_IDEA_NODES));
    showToast("success", t.toastTemplateRestored);
  }, [
    clearSavedState,
    nodeHandlers,
    setNodes,
    setEdges,
    showToast,
    t.toastTemplateRestored,
  ]);

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden touch-none overscroll-none bg-slate-50">
      <Toolbar
        nodeCount={nodes.length}
        connectionCount={edges.length}
        isZenMode={isZenMode}
        saveStatus={saveStatus}
        onAddNode={() => setIsModalOpen(true)}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        onToggleZenMode={() => setIsZenMode((prev) => !prev)}
        onExportMarkdown={handleExportMarkdown}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onRequestClearCanvas={() => setIsClearConfirmOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        deleteKeyCode={null}
        panOnDrag={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: false }}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.3}
          color="#cbd5e1"
        />

        <Controls
          position="bottom-left"
          showInteractive={false}
          className={`!bottom-5 !left-3 origin-bottom-left scale-90 sm:!bottom-4 sm:!left-4 sm:scale-100 transition-all duration-300 ease-out ${
            isZenMode
              ? "translate-y-4 opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          }`}
        />

        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          className={`hidden sm:block !rounded-2xl !border !border-slate-200/80 !bg-white/90 !shadow-sm backdrop-blur-md transition-all duration-300 ease-out ${
            isZenMode
              ? "translate-y-4 opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          }`}
          nodeColor={(n) => {
            const c = (n.data as { idea?: IdeaNode } | undefined)?.idea?.color;
            return c ? NODE_COLOR_STYLES[c]?.strokeHex ?? "#3b82f6" : "#3b82f6";
          }}
          maskColor="rgba(241, 245, 249, 0.7)"
        />
      </ReactFlow>

      {/* Notificación flotante (Toast) */}
      {toast && (
        <div className="pointer-events-none fixed bottom-20 sm:bottom-6 left-1/2 z-40 w-max max-w-[90vw] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md ${
              toast.type === "error"
                ? "border-rose-200 bg-rose-50/95 text-rose-700"
                : "border-slate-200/90 bg-white/95 text-slate-800"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-600" />
            )}
            <span className="truncate">{toast.text}</span>
          </div>
        </div>
      )}

      <QuickCapture
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onQuickCreate={handleCreateIdeaAtCenter}
      />

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateIdeaAtCenter}
      />

      <ConfirmClearModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onClearEmpty={handleClearEmpty}
        onResetTemplate={handleResetTemplate}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <AuthModal />
    </div>
  );
}

export function MindMapCanvas() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ReactFlowProvider>
          <MindMapCanvasInner />
        </ReactFlowProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
