"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Hash, Loader2, Pencil, Sparkles, Trash2 } from "lucide-react";
import type { BrainstormMode, IdeaNodeData } from "@/types";
import { CATEGORY_LABELS, NODE_COLOR_STYLES } from "@/lib/constants";

function IdeaNodeCardComponent({ data, selected }: NodeProps<IdeaNodeData>) {
  const { idea, onDelete, onUpdate, onBrainstorm } = data;
  const palette = NODE_COLOR_STYLES[idea.color] ?? NODE_COLOR_STYLES.slate;

  const [editingField, setEditingField] = useState<"title" | "content" | null>(
    null
  );
  const [draftTitle, setDraftTitle] = useState(idea.title);
  const [draftContent, setDraftContent] = useState(idea.content);

  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const aiMenuRef = useRef<HTMLDivElement>(null);

  const startEditingTitle = () => {
    setDraftTitle(idea.title);
    setEditingField("title");
  };

  const startEditingContent = () => {
    setDraftContent(idea.content);
    setEditingField("content");
  };

  useEffect(() => {
    if (editingField === "title") {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    } else if (editingField === "content") {
      contentInputRef.current?.focus();
      const length = contentInputRef.current?.value.length ?? 0;
      contentInputRef.current?.setSelectionRange(length, length);
    }
  }, [editingField]);

  // Cerrar el menú contextual de IA al hacer clic fuera
  useEffect(() => {
    if (!isAiMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        aiMenuRef.current &&
        !aiMenuRef.current.contains(event.target as Node)
      ) {
        setIsAiMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isAiMenuOpen]);

  const commitTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== idea.title) {
      onUpdate?.(idea.id, { title: trimmed });
    } else {
      setDraftTitle(idea.title);
    }
    setEditingField(null);
  };

  const commitContent = () => {
    const trimmed = draftContent.trim();
    if (trimmed && trimmed !== idea.content) {
      onUpdate?.(idea.id, { content: trimmed });
    } else {
      setDraftContent(idea.content);
    }
    setEditingField(null);
  };

  const handleTriggerBrainstorm = async (mode: BrainstormMode) => {
    if (!onBrainstorm || isGenerating) return;
    setIsAiMenuOpen(false);
    setIsGenerating(true);
    try {
      await onBrainstorm(idea, mode);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className={`group relative w-72 rounded-2xl border bg-white p-4 transition-all duration-150 ${
        palette.border
      } ${
        selected
          ? "border-blue-400 shadow-md ring-2 ring-blue-500/30"
          : "shadow-xs hover:shadow-md"
      } ${isGenerating ? "ring-2 ring-blue-400/40 border-blue-300" : ""}`}
    >
      {/* Indicador superior de color */}
      <div
        className={`absolute top-0 right-4 left-4 h-1 rounded-b-full ${palette.accent}`}
      />

      {/* Handle de entrada */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-slate-400 transition-colors group-hover:!bg-blue-500"
      />

      {/* Cabecera: Categoría y acciones (IA + Editar + Eliminar) */}
      <div className="mb-2 flex items-center justify-between pt-1">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${palette.badgeBg} ${palette.badgeText}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${palette.dot}`} />
          {CATEGORY_LABELS[idea.category]}
        </span>

        <div className="relative flex items-center gap-1" ref={aiMenuRef}>
          {/* Botón de Asistente IA */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={(e) => {
              e.stopPropagation();
              setIsAiMenuOpen((prev) => !prev);
            }}
            title="Asistente IA de Desbloqueo y Sub-ideas"
            className={`nodrag inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
              isAiMenuOpen || isGenerating
                ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                : "text-slate-400 hover:bg-blue-50/80 hover:text-blue-600"
            }`}
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Menú contextual sutil de IA */}
          {isAiMenuOpen && !isGenerating && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="nodrag absolute top-8 right-0 z-30 w-52 overflow-hidden rounded-xl border border-slate-200/90 bg-white/95 p-1 shadow-lg shadow-slate-900/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Asistente IA
              </div>
              <button
                type="button"
                onClick={() => handleTriggerBrainstorm("expand")}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
              >
                <span>✨ Desglosar sub-ideas</span>
              </button>
              <button
                type="button"
                onClick={() => handleTriggerBrainstorm("unblock")}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
              >
                <span>🎯 Perspectiva anti-bloqueo</span>
              </button>
            </div>
          )}

          {/* Acciones secundarias en hover */}
          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startEditingTitle();
              }}
              title="Editar texto (o haz clic directo)"
              className="nodrag rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
            >
              <Pencil className="h-3 w-3" />
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(idea.id);
                }}
                title="Eliminar nodo"
                className="nodrag rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Título con edición en línea al hacer clic o doble clic */}
      {editingField === "title" ? (
        <input
          ref={titleInputRef}
          type="text"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitTitle();
            } else if (e.key === "Escape") {
              e.preventDefault();
              setDraftTitle(idea.title);
              setEditingField(null);
            }
          }}
          className="nodrag mb-1.5 w-full rounded-lg border border-blue-300 bg-blue-50/30 px-2 py-1 text-sm font-semibold leading-snug text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      ) : (
        <h3
          onClick={startEditingTitle}
          onDoubleClick={startEditingTitle}
          title="Haz clic para editar el título"
          className="mb-1.5 cursor-text rounded-md px-1 -mx-1 py-0.5 text-sm font-semibold leading-snug text-slate-900 transition-colors hover:bg-slate-50"
        >
          {idea.title}
        </h3>
      )}

      {/* Contenido / Descripción con edición en línea al hacer clic o doble clic */}
      {editingField === "content" ? (
        <textarea
          ref={contentInputRef}
          rows={3}
          value={draftContent}
          onChange={(e) => setDraftContent(e.target.value)}
          onBlur={commitContent}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitContent();
            } else if (e.key === "Escape") {
              e.preventDefault();
              setDraftContent(idea.content);
              setEditingField(null);
            }
          }}
          className="nodrag mb-3 w-full resize-none rounded-lg border border-blue-300 bg-blue-50/30 px-2 py-1.5 text-xs leading-relaxed text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      ) : (
        <p
          onClick={startEditingContent}
          onDoubleClick={startEditingContent}
          title="Haz clic para editar la descripción"
          className="mb-3 cursor-text rounded-md px-1 -mx-1 py-0.5 text-xs leading-relaxed text-slate-600 transition-colors hover:bg-slate-50"
        >
          {idea.content}
        </p>
      )}

      {/* Estado visual de carga de IA (Skeleton + Spinner minimalista) */}
      {isGenerating && (
        <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 animate-pulse">
          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium text-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Generando ideas...</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-4/5 rounded-full bg-blue-200/70" />
            <div className="h-2 w-3/5 rounded-full bg-blue-200/50" />
          </div>
        </div>
      )}

      {/* Etiquetas (Tags) */}
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-2.5">
          {idea.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-0.5 rounded-md bg-slate-100/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              <Hash className="h-2.5 w-2.5 text-slate-400" />
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Handle de salida */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-slate-400 transition-colors group-hover:!bg-blue-500"
      />
    </div>
  );
}

export const IdeaNodeCard = memo(IdeaNodeCardComponent);
