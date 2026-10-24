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
  Menu,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isExportMenuOpen && !isMobileMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        isExportMenuOpen &&
        exportMenuRef.current &&
        !exportMenuRef.current.contains(target)
      ) {
        setIsExportMenuOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isExportMenuOpen, isMobileMenuOpen]);

  return (
    <>
      {/* Barra principal adaptativa para móvil y escritorio */}
      <header
        className={`pointer-events-none fixed top-3 right-3 left-3 z-20 flex items-center justify-between gap-2 sm:top-4 sm:right-0 sm:left-0 sm:px-6 transition-all duration-300 ease-out ${
          isZenMode
            ? "-translate-y-6 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {/* Identidad de la aplicación + Contador compacto en móvil */}
        <div
          className={`${
            isZenMode ? "pointer-events-none" : "pointer-events-auto"
          } flex min-h-[48px] items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2.5`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <BrainCircuit className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="truncate text-xs font-semibold tracking-tight text-slate-900 sm:text-sm">
                Mind Diary
              </h1>

              {/* Badge discreto de conteo en móvil */}
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 sm:hidden">
                {nodeCount}
                <span className="text-slate-400">·</span>
                {connectionCount}
              </span>

              {/* Indicador de guardado compacto en móvil */}
              {saveStatus !== "idle" && (
                <span className="inline-flex items-center sm:hidden">
                  {saveStatus === "saving" ? (
                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  )}
                </span>
              )}

              {/* Badge AI Studio en escritorio */}
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                <Sparkles className="h-2.5 w-2.5" />
                AI Studio
              </span>
            </div>

            {/* Subtítulo detallado solo en pantallas >= sm */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
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

        {/* Controles derechos: Compactos con área táctil >= 44x44px en móvil, completos en escritorio */}
        <div
          className={`${
            isZenMode ? "pointer-events-none" : "pointer-events-auto"
          } flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/95 p-1 shadow-sm backdrop-blur-md sm:gap-1.5 sm:p-1.5`}
        >
          {/* Botones secundarios visibles directamente en escritorio (sm:flex) */}
          <div className="hidden sm:flex items-center gap-1.5">
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
              <span className="hidden md:inline">Zen</span>
            </Button>

            {/* Menú desplegable de Exportación y Respaldo (Escritorio) */}
            <div className="relative" ref={exportMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                title="Exportar, respaldar o limpiar lienzo"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Exportar</span>
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
            </div>
          </div>

          {/* Botón Nueva Idea (Táctil >= 44x44px en móvil) */}
          <Button
            variant="primary"
            size="sm"
            onClick={onAddNode}
            aria-label="Nueva Idea"
            className="min-h-[44px] min-w-[44px] px-3 sm:min-h-0 sm:min-w-0 sm:px-3"
          >
            <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Nueva Idea</span>
          </Button>

          {/* Menú Hamburguesa / Drawer para Móvil (< 640px) */}
          <div className="relative sm:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Menú de opciones"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-600 transition-colors active:bg-slate-100 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-800" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/98 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Acciones y Herramientas
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenQuickCapture();
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 active:bg-blue-50 hover:bg-slate-100/80"
                >
                  <Zap className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <div>Captura Rápida</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Crear idea al instante en el centro
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onToggleZenMode();
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 active:bg-slate-100 hover:bg-slate-100/80"
                >
                  <EyeOff className="h-4 w-4 text-slate-600 shrink-0" />
                  <div>
                    <div>Modo Flujo Creativo (Zen)</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Despejar interfaz para concentrarse
                    </div>
                  </div>
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Exportar y Respaldo
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onExportMarkdown();
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 active:bg-slate-100 hover:bg-slate-100/80"
                >
                  <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <div>Exportar Markdown (.md)</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Para Notion u Obsidian
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onExportJson();
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 active:bg-slate-100 hover:bg-slate-100/80"
                >
                  <FileCode2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <div>
                    <div>Exportar Respaldo (.json)</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Guardar copia del mapa actual
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 active:bg-slate-100 hover:bg-slate-100/80"
                >
                  <Upload className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <div>Importar Respaldo (.json)</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Cargar archivo guardado
                    </div>
                  </div>
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onRequestClearCanvas();
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-600 active:bg-rose-50 hover:bg-rose-50"
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
          </div>

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
      </header>

      {/* Botón Flotante de Acción Rápida (FAB) exclusivo para móviles (< 640px) */}
      <button
        type="button"
        onClick={onOpenQuickCapture}
        aria-label="Captura Rápida de Idea"
        title="Captura Rápida de Idea"
        className={`fixed right-4 bottom-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-white/80 transition-all duration-200 active:scale-95 sm:hidden ${
          isZenMode
            ? "translate-y-6 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Botón flotante sutil para salir de Zen Mode (adaptado a área táctil móvil) */}
      <div
        className={`fixed top-3 right-3 sm:top-4 sm:right-6 z-30 transition-all duration-300 ease-out ${
          isZenMode
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={onToggleZenMode}
          title="Salir de Modo Zen (Shift+Z)"
          className="group flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:border-blue-200 hover:bg-white hover:text-blue-600 cursor-pointer"
        >
          <Eye className="h-4 w-4 text-slate-500 transition-colors group-hover:text-blue-600" />
          <span>Salir de Modo Zen</span>
          <kbd className="hidden sm:inline-block rounded border border-slate-200/80 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
            ⇧Z
          </kbd>
        </button>
      </div>
    </>
  );
}
