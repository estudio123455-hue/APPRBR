"use client";

import { useEffect, useRef, useState } from "react";
import { CornerDownLeft, Sparkles, X, Zap } from "lucide-react";
import type { IdeaNode } from "@/types";
import { createEntityId } from "@/lib/flow-utils";

interface QuickCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickCreate: (nodeData: Omit<IdeaNode, "id" | "x" | "y">) => void;
}

/**
 * Cuadro de Captura Rápida Global (Ctrl+K / Cmd+K o botón FAB en móvil).
 * Soporta sintaxis rápida opcional: "Título: Descripción #tag1 #tag2"
 */
export function QuickCapture({
  isOpen,
  onClose,
  onQuickCreate,
}: QuickCaptureProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setValue("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = value.trim();
    if (!raw) return;

    // Extraer hashtags opcionales (#tag)
    const tagMatches = Array.from(raw.matchAll(/#([\p{L}\p{N}_-]+)/gu)).map(
      (m) => m[1]
    );
    const cleanText = raw.replace(/#[\p{L}\p{N}_-]+/gu, "").trim();

    // Separar título y contenido si usa ":"
    const colonIndex = cleanText.indexOf(":");
    let title = cleanText;
    let content = "Capturado rápidamente desde el lienzo.";

    if (colonIndex > 0) {
      title = cleanText.slice(0, colonIndex).trim();
      const extractedContent = cleanText.slice(colonIndex + 1).trim();
      if (extractedContent) {
        content = extractedContent;
      }
    }

    const tags =
      tagMatches.length > 0
        ? tagMatches.map((label) => ({
            id: createEntityId("tag"),
            label,
            color: "blue" as const,
          }))
        : [
            {
              id: createEntityId("tag"),
              label: "rápida",
              color: "blue" as const,
            },
          ];

    onQuickCreate({
      title: title || "Nueva idea",
      content,
      color: "blue",
      category: "idea",
      tags,
    });

    setValue("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-start justify-center bg-slate-900/25 p-0 sm:px-4 sm:pt-[18vh] backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="w-full sm:w-[92%] max-w-xl overflow-hidden rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-200/90 bg-white/98 pb-safe shadow-2xl shadow-slate-900/15 ring-1 ring-blue-500/10 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Indicador superior tipo Bottom Sheet en móvil */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 pt-3 pb-2 sm:hidden">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Zap className="h-3.5 w-3.5 text-blue-600" />
            Captura Rápida
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar captura rápida"
            className="rounded-lg p-1.5 text-slate-400 active:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2 px-3 sm:px-0"
        >
          <div className="hidden sm:block pl-4 text-blue-600">
            <Zap className="h-4 w-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                handleClose();
              }
            }}
            placeholder="Idea: descripción #etiqueta..."
            className="w-full bg-transparent px-1 sm:px-3.5 py-3.5 sm:py-4 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />

          {/* Botón táctil explícito en móvil + KBD en escritorio */}
          <div className="flex items-center gap-1.5 sm:pr-3.5">
            <button
              type="submit"
              disabled={!value.trim()}
              className="inline-flex min-h-[38px] items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all active:scale-95 disabled:opacity-40 sm:hidden"
            >
              <span>Crear</span>
            </button>

            <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500">
              <span>Enter</span>
              <CornerDownLeft className="h-2.5 w-2.5" />
            </kbd>
            <kbd className="hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-1 text-[10px] font-medium text-slate-400">
              Esc
            </kbd>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-blue-500 shrink-0" />
            Se colocará en el centro exacto de tu vista actual
          </span>
          <span className="text-slate-400">
            Usa <code className="text-slate-600">:</code> para descripción y{" "}
            <code className="text-slate-600">#tag</code> para etiquetas
          </span>
        </div>
      </div>
    </div>
  );
}
