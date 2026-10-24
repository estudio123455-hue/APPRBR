"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import {
  Camera,
  Hash,
  Loader2,
  Palette,
  Pencil,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { BrainstormMode, IdeaNodeColor, IdeaNodeData } from "@/types";
import { NODE_COLOR_STYLES } from "@/lib/constants";
import { compressImageFile } from "@/lib/image-utils";
import { useLanguage } from "@/lib/i18n";

const THEME_COLORS: IdeaNodeColor[] = [
  "slate",
  "blue",
  "indigo",
  "emerald",
  "amber",
  "rose",
  "violet",
];

function IdeaNodeCardComponent({ data, selected }: NodeProps<IdeaNodeData>) {
  const { idea, onDelete, onUpdate, onBrainstorm } = data;
  const { t } = useLanguage();
  const palette = NODE_COLOR_STYLES[idea.color] ?? NODE_COLOR_STYLES.slate;
  const isDerivedChild = Boolean(idea.parentId);

  const [editingField, setEditingField] = useState<"title" | "content" | null>(
    null
  );
  const [draftTitle, setDraftTitle] = useState(idea.title);
  const [draftContent, setDraftContent] = useState(idea.content);

  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const popoverAreaRef = useRef<HTMLDivElement>(null);

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

  // Cerrar menús contextuales al hacer clic o toque fuera
  useEffect(() => {
    if (!isAiMenuOpen && !isColorPickerOpen) return;
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        popoverAreaRef.current &&
        !popoverAreaRef.current.contains(event.target as Node)
      ) {
        setIsAiMenuOpen(false);
        setIsColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isAiMenuOpen, isColorPickerOpen]);

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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      onUpdate?.(idea.id, { imageUrl: compressed });
    } catch (err) {
      console.warn("Error procesando imagen:", err);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div
      className={`group relative w-[272px] max-w-[85vw] sm:w-72 rounded-2xl border p-3.5 sm:p-4 transition-all duration-150 ${
        isDerivedChild ? palette.childBg : palette.bg
      } ${isDerivedChild ? palette.childBorder : palette.border} ${
        selected
          ? "border-blue-400 shadow-md ring-2 ring-blue-500/30"
          : "shadow-xs hover:shadow-md"
      } ${isGenerating ? "ring-2 ring-blue-400/40 border-blue-300" : ""}`}
    >
      {/* Indicador superior de color de rama */}
      <div
        className={`absolute top-0 right-4 left-4 h-1 rounded-b-full ${palette.accent}`}
      />

      {/* Handle de entrada (con área táctil expandida para móvil) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 sm:!h-3 sm:!w-3 !-left-2 sm:!-left-1.5 !border-2 !border-white !bg-slate-400 transition-colors group-hover:!bg-blue-500 active:!bg-blue-600 before:absolute before:-inset-2.5 before:content-['']"
      />

      {/* Cabecera: Categoría, Selector de Color de Rama y Acciones */}
      <div
        className="mb-2 flex items-center justify-between pt-1"
        ref={popoverAreaRef}
      >
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${palette.badgeBg} ${palette.badgeText}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${palette.dot}`} />
            {t.categories[idea.category]}
          </span>
        </div>

        <div className="relative flex items-center gap-0.5">
          {/* Selector rápido de colorimetría por rama */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsAiMenuOpen(false);
              setIsColorPickerOpen((prev) => !prev);
            }}
            title={t.themeColorTooltip}
            aria-label={t.themeColorTooltip}
            className={`nodrag flex min-h-[32px] min-w-[32px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-lg p-1.5 sm:p-1 transition-colors cursor-pointer ${
              isColorPickerOpen
                ? "bg-slate-100 text-slate-800"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
          </button>

          {/* Popover de paleta rápida por tema */}
          {isColorPickerOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="nodrag absolute top-8 right-0 z-30 flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white/98 p-2 shadow-xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            >
              {THEME_COLORS.map((c) => {
                const sw = NODE_COLOR_STYLES[c];
                const isCurrent = idea.color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      onUpdate?.(idea.id, { color: c });
                      setIsColorPickerOpen(false);
                    }}
                    title={t.colors[c]}
                    aria-label={t.colors[c]}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition-transform cursor-pointer ${
                      isCurrent
                        ? "scale-110 border-slate-900 ring-2 ring-blue-500/30"
                        : "border-slate-200 hover:scale-110"
                    }`}
                  >
                    <span className={`h-3.5 w-3.5 rounded-full ${sw.dot}`} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Botón de captura con cámara / foto */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              photoInputRef.current?.click();
            }}
            title={t.attachPhotoTooltip}
            aria-label={t.attachPhotoTooltip}
            className="nodrag flex min-h-[32px] min-w-[32px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-lg p-1.5 sm:p-1 text-slate-400 transition-colors active:bg-slate-100 hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoChange}
          />

          {/* Botón de Asistente IA */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={(e) => {
              e.stopPropagation();
              setIsColorPickerOpen(false);
              setIsAiMenuOpen((prev) => !prev);
            }}
            title={t.aiMenuHeader}
            aria-label={t.aiMenuHeader}
            className={`nodrag inline-flex min-h-[32px] min-w-[32px] sm:min-h-0 sm:min-w-0 items-center justify-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
              isAiMenuOpen || isGenerating
                ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                : "text-slate-500 sm:text-slate-400 active:bg-blue-50 hover:bg-blue-50/80 hover:text-blue-600"
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
              className="nodrag absolute top-9 right-0 z-30 w-56 overflow-hidden rounded-xl border border-slate-200/90 bg-white/98 p-1.5 shadow-xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                {t.aiMenuHeader}
              </div>
              <button
                type="button"
                onClick={() => handleTriggerBrainstorm("expand")}
                className="flex min-h-[40px] sm:min-h-0 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors active:bg-blue-50 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
              >
                <span>{t.aiExpandOption}</span>
              </button>
              <button
                type="button"
                onClick={() => handleTriggerBrainstorm("unblock")}
                className="flex min-h-[40px] sm:min-h-0 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors active:bg-amber-50 hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
              >
                <span>{t.aiUnblockOption}</span>
              </button>
              {idea.imageUrl && (
                <button
                  type="button"
                  onClick={() => handleTriggerBrainstorm("visual")}
                  className="flex min-h-[40px] sm:min-h-0 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-indigo-700 transition-colors active:bg-indigo-50 hover:bg-indigo-50 cursor-pointer"
                >
                  <span>{t.aiVisualAnalyzeBtn}</span>
                </button>
              )}
            </div>
          )}

          {/* Acciones secundarias (Editar / Eliminar) */}
          <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startEditingTitle();
              }}
              title={t.editTooltip}
              aria-label={t.editTooltip}
              className="nodrag flex min-h-[32px] min-w-[32px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-lg p-1 text-slate-400 active:bg-slate-100 hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
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
                title={t.deleteTooltip}
                aria-label={t.deleteTooltip}
                className="nodrag flex min-h-[32px] min-w-[32px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-lg p-1 text-slate-400 active:bg-rose-50 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Previsualización de Imagen con Esquinas Redondeadas y Botón "✨ Analizar con IA" */}
      {idea.imageUrl && (
        <div className="nodrag relative mb-2.5 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={idea.imageUrl}
            alt={idea.title}
            className="max-h-36 w-full object-cover"
          />

          {/* Botón para quitar foto */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate?.(idea.id, { imageUrl: undefined });
            }}
            title={t.photoRemoveBtn}
            aria-label={t.photoRemoveBtn}
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/65 text-white backdrop-blur-xs transition-colors hover:bg-rose-600 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Botón superpuesto "✨ Analizar con IA" */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={(e) => {
              e.stopPropagation();
              handleTriggerBrainstorm("visual");
            }}
            className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-lg bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-blue-700 shadow-sm backdrop-blur-md transition-all hover:bg-blue-600 hover:text-white active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            <span>{t.aiVisualAnalyzeBtn}</span>
          </button>
        </div>
      )}

      {/* Título con edición en línea al hacer clic o toque */}
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
          className="nodrag mb-1.5 w-full rounded-lg border border-blue-300 bg-blue-50/30 px-2 py-1 text-base sm:text-sm font-semibold leading-snug text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      ) : (
        <h3
          onClick={startEditingTitle}
          onDoubleClick={startEditingTitle}
          title={t.editTooltip}
          className="mb-1.5 cursor-text rounded-md px-1 -mx-1 py-0.5 text-sm font-semibold leading-snug text-slate-900 transition-colors active:bg-slate-100/70 hover:bg-slate-50/80"
        >
          {idea.title}
        </h3>
      )}

      {/* Contenido / Descripción con edición en línea al hacer clic o toque */}
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
          className="nodrag mb-3 w-full resize-none rounded-lg border border-blue-300 bg-blue-50/30 px-2 py-1.5 text-base sm:text-xs leading-relaxed text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      ) : (
        <p
          onClick={startEditingContent}
          onDoubleClick={startEditingContent}
          title={t.editTooltip}
          className="mb-3 cursor-text rounded-md px-1 -mx-1 py-0.5 text-xs leading-relaxed text-slate-600 transition-colors active:bg-slate-100/70 hover:bg-slate-50/80"
        >
          {idea.content}
        </p>
      )}

      {/* Estado visual de carga de IA (Skeleton + Spinner minimalista) */}
      {isGenerating && (
        <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 animate-pulse">
          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium text-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>{t.aiGenerating}</span>
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

      {/* Handle de salida (con área táctil expandida para móvil) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 sm:!h-3 sm:!w-3 !-right-2 sm:!-right-1.5 !border-2 !border-white !bg-slate-400 transition-colors group-hover:!bg-blue-500 active:!bg-blue-600 before:absolute before:-inset-2.5 before:content-['']"
      />
    </div>
  );
}

export const IdeaNodeCard = memo(IdeaNodeCardComponent);
