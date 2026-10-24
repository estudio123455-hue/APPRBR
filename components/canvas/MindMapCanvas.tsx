"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
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
  IdeaNodeInlineUpdates,
} from "@/types";
import { INITIAL_CONNECTIONS, INITIAL_IDEA_NODES } from "@/lib/constants";
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
import { useAutoSave } from "@/lib/useAutoSave";
import { IdeaNodeCard } from "./IdeaNodeCard";
import { Toolbar } from "@/components/ui/Toolbar";
import { NodeModal } from "@/components/ui/NodeModal";
import { QuickCapture } from "@/components/ui/QuickCapture";
import { ConfirmClearModal } from "@/components/ui/ConfirmClearModal";

interface ToastMessage {
  id: string;
  type: "success" | "error";
  text: string;
}

function MindMapCanvasInner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    toFlowNodes(INITIAL_IDEA_NODES)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    toFlowEdges(INITIAL_CONNECTIONS)
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
          if (node.id !== id) return node;
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
        })
      );
    },
    [setNodes]
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
            }),
          });

          if (response.ok) {
            const data = (await response.json()) as BrainstormResponsePayload;
            if (Array.isArray(data.subIdeas) && data.subIdeas.length > 0) {
              subIdeas = data.subIdeas;
            }
          }
        } catch {
          // Hosting estático (ej. GitHub Pages) sin servidor Node.js: usar fallback local
        }

        // Si el endpoint no está disponible (hosting estático) o no devolvió ideas, usar buildContextualFallback en cliente
        if (subIdeas.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          subIdeas = buildContextualFallback(
            parentIdea.title,
            parentIdea.content,
            mode
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

          const existingPositions = currentNodes.map((n) => n.position);
          const spawnPositions = calculateSpawnPositions(
            parentPosition,
            subIdeas.length,
            existingPositions
          );

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
                sub.category ?? (mode === "unblock" ? "question" : "idea"),
              color: sub.color ?? (mode === "unblock" ? "amber" : "indigo"),
              tags: [
                {
                  id: createEntityId("tag"),
                  label: mode === "unblock" ? "desbloqueo-ia" : "sub-idea-ia",
                  color: mode === "unblock" ? "amber" : "indigo",
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

        // Crear conexiones automáticas animadas desde el nodo padre hacia cada sub-idea
        setEdges((currentEdges) => {
          const newEdges = newGeneratedIds.map((targetId) =>
            toFlowEdge({
              id: createEntityId("conn"),
              source: parentIdea.id,
              target: targetId,
              animated: true,
            })
          );
          return [...currentEdges, ...newEdges];
        });

        showToast(
          "success",
          mode === "unblock"
            ? `🎯 ${subIdeas.length} perspectivas anti-bloqueo generadas`
            : `✨ ${subIdeas.length} sub-ideas desplegadas en abanico`
        );
      } catch (error) {
        console.error("Error al generar sub-ideas con IA:", error);
        showToast(
          "error",
          "No se pudieron generar ideas en este momento. Inténtalo de nuevo."
        );
      }
    },
    [setNodes, setEdges, showToast]
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
      setEdges(toFlowEdges(saved.connections));
    },
    [nodeHandlers, setNodes, setEdges]
  );

  const { saveStatus, clearSavedState } = useAutoSave({
    nodes,
    edges,
    onLoadSavedState: handleLoadSavedState,
  });

  // Atajos de teclado globales y ergonomía del lienzo:
  // - Ctrl+K / Cmd+K: Captura rápida
  // - Shift+Z: Modo Zen
  // - Delete / Backspace: Eliminar nodos o conexiones seleccionadas (fuera de inputs)
  // - Escape: Deseleccionar nodos y conexiones
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
        setIsQuickCaptureOpen((prev) => !prev);
        return;
      }

      // 2. Escape -> Cerrar modales o deseleccionar nodos y conexiones del lienzo
      if (event.key === "Escape") {
        if (isQuickCaptureOpen || isModalOpen || isClearConfirmOpen) {
          setIsQuickCaptureOpen(false);
          setIsModalOpen(false);
          setIsClearConfirmOpen(false);
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

      // Si el usuario está escribiendo dentro de un campo editable o hay un modal abierto, ignorar atajos de lienzo
      if (
        isEditableTarget ||
        isQuickCaptureOpen ||
        isModalOpen ||
        isClearConfirmOpen
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
    setNodes,
    setEdges,
  ]);

  const nodeTypes = useMemo(() => ({ ideaNode: IdeaNodeCard }), []);

  const onConnect = useCallback(
    (params: FlowConnection) => {
      if (!params.source || !params.target) return;
      const newEdge = toFlowEdge({
        id: createEntityId("conn"),
        source: params.source,
        target: params.target,
      });
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
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
    showToast("success", "📄 Documento Markdown (.md) exportado");
  }, [nodes, edges, showToast]);

  const handleExportJson = useCallback(() => {
    const domainNodes = nodes.map(fromFlowNode);
    const domainConnections = edges.map(fromFlowEdge);
    downloadJsonBackup(domainNodes, domainConnections);
    showToast("success", "💾 Respaldo JSON (.json) descargado");
  }, [nodes, edges, showToast]);

  const handleImportJson = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const { nodes: importedNodes, connections: importedConnections } =
          parseJsonBackup(text);
        setNodes(toFlowNodes(importedNodes, nodeHandlers));
        setEdges(toFlowEdges(importedConnections));
        showToast(
          "success",
          `✅ Respaldo restaurado (${importedNodes.length} ideas)`
        );
      } catch (error) {
        console.error("Error al importar respaldo JSON:", error);
        showToast(
          "error",
          "El archivo seleccionado no es un respaldo válido de Mind Diary."
        );
      }
    },
    [nodeHandlers, setNodes, setEdges, showToast]
  );

  const handleClearEmpty = useCallback(() => {
    clearSavedState();
    setNodes([]);
    setEdges([]);
    showToast("success", "🧹 Lienzo limpio y listo para nuevas ideas");
  }, [clearSavedState, setNodes, setEdges, showToast]);

  const handleResetTemplate = useCallback(() => {
    clearSavedState();
    setNodes(toFlowNodes(INITIAL_IDEA_NODES, nodeHandlers));
    setEdges(toFlowEdges(INITIAL_CONNECTIONS));
    showToast("success", "🔄 Plantilla inicial restaurada");
  }, [clearSavedState, nodeHandlers, setNodes, setEdges, showToast]);

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
        preventScrolling={true}
        fitView
        fitViewOptions={{ padding: 0.25 }}
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
          nodeColor="#3b82f6"
          maskColor="rgba(241, 245, 249, 0.7)"
        />
      </ReactFlow>

      {/* Notificación flotante (Toast) para feedback de IA, exportación y errores */}
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
    </div>
  );
}

export function MindMapCanvas() {
  return (
    <ReactFlowProvider>
      <MindMapCanvasInner />
    </ReactFlowProvider>
  );
}
