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
  Globe,
  HelpCircle,
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
import { SUPPORTED_LANGUAGES, useLanguage } from "@/lib/i18n";
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
  onOpenHowItWorks?: () => void;
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
  onOpenHowItWorks,
}: ToolbarProps) {
  const { language, setLanguage, t } = useLanguage();

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isExportMenuOpen && !isLangMenuOpen && !isMobileMenuOpen) return;
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
        isLangMenuOpen &&
        langMenuRef.current &&
        !langMenuRef.current.contains(target)
      ) {
        setIsLangMenuOpen(false);
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
  }, [isExportMenuOpen, isLangMenuOpen, isMobileMenuOpen]);

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ??
    SUPPORTED_LANGUAGES[0];

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
                {t.appSubtitle}
              </span>
            </div>

            {/* Subtítulo detallado solo en pantallas >= sm */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
              <span>
                {nodeCount}{" "}
                {nodeCount === 1 ? t.ideaSingular : t.ideaPlural} ·{" "}
                {connectionCount}{" "}
                {connectionCount === 1 ? t.connSingular : t.connPlural}
              </span>
              {saveStatus !== "idle" && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                    {saveStatus === "saving" ? (
                      <>
                        <Loader2 className="h-2.5 w-2.5 animate-spin text-blue-500" />
                        {t.saving}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                        {t.saved}
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
            {/* Selector de Idioma Discreto */}
            <div className="relative" ref={langMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsExportMenuOpen(false);
                  setIsLangMenuOpen((prev) => !prev);
                }}
                title={t.languageLabel}
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs font-semibold">
                  {currentLangMeta.shortLabel}
                </span>
                <ChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform duration-150 ${
                    isLangMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/98 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    {t.languageLabel}
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-100/80"
                        }`}
                      >
                        <span>{lang.name}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                          {lang.shortLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenQuickCapture}
              title={`${t.quickCaptureBtn} (Ctrl+K / Cmd+K)`}
            >
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden md:inline">{t.quickCaptureBtn}</span>
              <kbd className="hidden lg:inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                ⌘K
              </kbd>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenHowItWorks}
              title={t.howItWorksBtn}
            >
              <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden xl:inline">{t.howItWorksBtn}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleZenMode}
              title={`${t.zenBtn} (Shift+Z)`}
            >
              <EyeOff className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{t.zenBtn}</span>
            </Button>

            {/* Menú desplegable de Exportación y Respaldo (Escritorio) */}
            <div className="relative" ref={exportMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsLangMenuOpen(false);
                  setIsExportMenuOpen((prev) => !prev);
                }}
                title={t.exportBtn}
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{t.exportBtn}</span>
                <ChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform duration-150 ${
                    isExportMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    {t.exportHeader}
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
                      <div>{t.exportMarkdownTitle}</div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {t.exportMarkdownSub}
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
                      <div>{t.exportJsonTitle}</div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {t.exportJsonSub}
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
                      <div>{t.importJsonTitle}</div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {t.importJsonSub}
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
                      <div>{t.clearCanvasTitle}</div>
                      <div className="text-[10px] font-normal text-rose-500/80">
                        {t.clearCanvasSub}
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
            aria-label={t.newIdeaBtn}
            className="min-h-[44px] min-w-[44px] px-3 sm:min-h-0 sm:min-w-0 sm:px-3"
          >
            <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">{t.newIdeaBtn}</span>
          </Button>

          {/* Menú Hamburguesa / Drawer para Móvil (< 640px) */}
          <div className="relative sm:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={t.mobileMenuHeader}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-600 transition-colors active:bg-slate-100 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-800" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-68 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/98 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                {/* Selector rápido de idioma en móvil */}
                <div className="px-3 pt-1 pb-2">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    <Globe className="h-3 w-3" />
                    <span>{t.languageLabel}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = lang.code === language;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setLanguage(lang.code)}
                          className={`flex min-h-[34px] items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 active:bg-slate-200"
                          }`}
                        >
                          {lang.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="my-1 border-t border-slate-100" />

                <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  {t.mobileMenuHeader}
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
                    <div>{t.quickCaptureBtn}</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      {t.quickCaptureCenterHint}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenHowItWorks?.();
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 active:bg-slate-100 hover:bg-slate-100/80"
                >
                  <HelpCircle className="h-4 w-4 text-slate-600 shrink-0" />
                  <div>
                    <div>{t.howItWorksBtn}</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Guía paso a paso y atajos
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
                    <div>{t.zenBtn}</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Shift + Z
                    </div>
                  </div>
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  {t.exportHeader}
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
                    <div>{t.exportMarkdownTitle}</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      {t.exportMarkdownSub}
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
                    <div>{t.exportJsonTitle}</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      {t.exportJsonSub}
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
                    <div>{t.importJsonTitle}</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      {t.importJsonSub}
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
                    <div>{t.clearCanvasTitle}</div>
                    <div className="text-[10px] font-normal text-rose-500/80">
                      {t.clearCanvasSub}
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
        aria-label={t.quickCaptureBtn}
        title={t.quickCaptureBtn}
        className={`fixed right-4 bottom-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-white/80 transition-all duration-200 active:scale-95 sm:hidden ${
          isZenMode
            ? "translate-y-6 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Botón flotante sutil para salir de Zen Mode */}
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
          title={`${t.exitZenBtn} (Shift+Z)`}
          className="group flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:border-blue-200 hover:bg-white hover:text-blue-600 cursor-pointer"
        >
          <Eye className="h-4 w-4 text-slate-500 transition-colors group-hover:text-blue-600" />
          <span>{t.exitZenBtn}</span>
          <kbd className="hidden sm:inline-block rounded border border-slate-200/80 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
            ⇧Z
          </kbd>
        </button>
      </div>
    </>
  );
}
