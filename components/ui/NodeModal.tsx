"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { IdeaCategory, IdeaNode, IdeaNodeColor } from "@/types";
import { CATEGORY_LABELS, NODE_COLOR_STYLES } from "@/lib/constants";
import { createEntityId } from "@/lib/flow-utils";
import { Button } from "./Button";

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (node: Omit<IdeaNode, "id" | "x" | "y">) => void;
}

const COLORS: IdeaNodeColor[] = [
  "slate",
  "blue",
  "indigo",
  "emerald",
  "amber",
  "rose",
  "violet",
];

const CATEGORIES: IdeaCategory[] = [
  "idea",
  "project",
  "task",
  "reference",
  "question",
  "note",
];

export function NodeModal({ isOpen, onClose, onCreate }: NodeModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<IdeaNodeColor>("blue");
  const [category, setCategory] = useState<IdeaCategory>("idea");
  const [tagsInput, setTagsInput] = useState("concepto, foco");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((label) => ({
        id: createEntityId("tag"),
        label,
        color,
      }));

    onCreate({
      title: title.trim(),
      content: content.trim() || "Sin descripción adicional.",
      color,
      category,
      tags: parsedTags,
    });

    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/25 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full sm:w-[92%] max-w-md overflow-y-auto rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-200 bg-white p-5 sm:p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Indicador superior tipo Bottom Sheet en móvil */}
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Capturar Nueva Idea
            </h2>
            <p className="text-xs text-slate-500">
              Añade un nuevo nodo al lienzo de Mind Diary
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl p-1.5 text-slate-400 active:bg-slate-100 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Título
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Arquitectura de sincronización..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Contenido
            </label>
            <textarea
              rows={3}
              placeholder="Desarrolla brevemente la idea..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm sm:text-xs font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Etiquetas (separadas por coma)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ux, producto"
                className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-base sm:text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Acento de color
            </label>
            <div className="flex items-center gap-2.5">
              {COLORS.map((c) => {
                const style = NODE_COLOR_STYLES[c];
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    title={style.label}
                    aria-label={style.label}
                    className={`flex h-8 w-8 sm:h-6 sm:w-6 items-center justify-center rounded-full border transition-transform cursor-pointer ${
                      isSelected
                        ? "scale-110 border-slate-900 ring-2 ring-blue-500/30"
                        : "border-slate-200 hover:scale-105"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 sm:h-3.5 sm:w-3.5 rounded-full ${style.dot}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              className="min-h-[44px] sm:min-h-0"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="min-h-[44px] sm:min-h-0"
            >
              Crear Nodo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
