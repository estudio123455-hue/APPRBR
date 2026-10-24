"use client";

import { AlertTriangle, RotateCcw, Trash2, X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearEmpty: () => void;
  onResetTemplate: () => void;
}

export function ConfirmClearModal({
  isOpen,
  onClose,
  onClearEmpty,
  onResetTemplate,
}: ConfirmClearModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Reiniciar o Limpiar Lienzo
              </h2>
              <p className="text-xs text-slate-500">
                Elige cómo deseas reiniciar tu espacio de trabajo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-5 text-xs leading-relaxed text-slate-600">
          Esta acción reemplazará los nodos y conexiones actuales en tu
          almacenamiento local. Si deseas conservar tu progreso, puedes{" "}
          <span className="font-medium text-slate-800">
            exportar un respaldo JSON
          </span>{" "}
          antes de continuar.
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onClearEmpty();
              onClose();
            }}
            className="flex w-full items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-left transition-colors hover:bg-rose-50 cursor-pointer"
          >
            <div>
              <div className="text-xs font-semibold text-rose-700">
                Dejar lienzo completamente limpio
              </div>
              <div className="text-[11px] text-rose-600/80">
                Elimina todos los nodos y conexiones para empezar desde cero
              </div>
            </div>
            <Trash2 className="h-4 w-4 text-rose-600 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              onResetTemplate();
              onClose();
            }}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-left transition-colors hover:bg-slate-100/80 cursor-pointer"
          >
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Restaurar plantilla inicial
              </div>
              <div className="text-[11px] text-slate-500">
                Carga las 3 ideas de ejemplo originales de Mind Diary
              </div>
            </div>
            <RotateCcw className="h-4 w-4 text-slate-600 shrink-0" />
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
