"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  FileCode2,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import type { SaveStatus } from "@/lib/useAutoSave";
import { Button } from "./Button";

interface ToolbarProps {
  nodeCount: number;
  connectionCount: number;
  isZenMode: boolean;
  saveStatus: SaveStatus;
  onAddNode: () => void;
  onOpenQuickCapture: () => void;
  onToggleZenMode: () => void;
  onExportMarkdown: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onRequestClearCanvas: () => void;
}

export function Toolbar({
  nodeCount,
  connectionCount,
  isZenMode,
  saveStatus,
  onAddNode,
  onOpenQuickCapture,
  onToggleZenMode,
  onExportMarkdown,
  onExportJson,
  onImportJson,
  onRequestClearCanvas,
}: ToolbarProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isExportMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isExportMenuOpen]);

  return (
    <>
      {/* Barra principal con transición fluida al entrar/salir de Zen Mode */}
      <header
        className={`pointer-events-none fixed top-4 left-0 right-0 z-20 flex items-center justify-between px-6 transition-all duration-300 ease-out ${
          isZenMode
            ? "-translate-y-6 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {/* Identidad de la aplicación + Contadores + Estado de guardado */}
        <div
          className={`${
            isZenMode ? "pointer-events-none" : "pointer-events-auto"
          } flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-md`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Mind Diary
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                <Sparkles className="h-2.5 w-2.5" />
                AI Studio
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>
                {nodeCount} {nodeCount === 1 ? "idea" : "ideas"} ·{" "}
                {connectionCount}{" "}
                {connectionCount === 1 ? "conexión" : "conexiones"}
              </span>
              {saveStatus !== "idle" && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                    {saveStatus === "saving" ? (
                      <>
                        <Loader2 className="h-2.5 w-2.5 animate-spin text-blue-500" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                        Guardado
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Acciones rápidas del lienzo */}
        <div
          className={`${
            isZenMode ? "pointer-events-none" : "pointer-events-auto"
          } flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-sm backdrop-blur-md`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenQuickCapture}
            title="Captura Rápida (Ctrl+K o Cmd+K)"
          >
            <Zap className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden md:inline">Captura Rápida</span>
            <kbd className="hidden lg:inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              ⌘K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleZenMode}
            title="Modo Flujo Creativo / Zen Mode (Shift+Z)"
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Zen</span>
          </Button>

          {/* Menú desplegable de Exportación y Respaldo */}
          <div className="relative" ref={exportMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              title="Exportar, respaldar o limpiar lienzo"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exportar</span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition-transform duration-150 ${
                  isExportMenuOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Exportación y Backup
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportMarkdown();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100/80 hover:text-slate-900 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <div>Exportar como Markdown</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Jerárquico (.md) para Notion / Obsidian
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportJson();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100/80 hover:text-slate-900 cursor-pointer"
                >
                  <FileCode2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <div>
                    <div>Exportar como JSON</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Respaldo completo de nodos y enlaces
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100/80 hover:text-slate-900 cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <div>Importar respaldo JSON</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Restaurar desde archivo .json
                    </div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onRequestClearCanvas();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <div>
                    <div>Limpiar Lienzo</div>
                    <div className="text-[10px] font-normal text-rose-500/80">
                      Vaciar tablero o restaurar plantilla
                    </div>
                  </div>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImportJson(file);
                }
                e.target.value = "";
              }}
            />
          </div>

          <Button variant="primary" size="sm" onClick={onAddNode}>
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Idea</span>
          </Button>
        </div>
      </header>

      {/* Botón flotante sutil para salir de Zen Mode */}
      <div
        className={`fixed top-4 right-6 z-30 transition-all duration-300 ease-out ${
          isZenMode
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={onToggleZenMode}
          title="Salir de Modo Zen (Shift+Z)"
          className="group flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-xs backdrop-blur-md transition-all hover:border-blue-200 hover:bg-white hover:text-blue-600 cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-blue-600" />
          <span>Salir de Modo Zen</span>
          <kbd className="rounded border border-slate-200/80 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
            ⇧Z
          </kbd>
        </button>
      </div>
    </>
  );
}
