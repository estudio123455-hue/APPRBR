"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Download,
  EyeOff,
  GitBranch,
  Globe,
  Keyboard,
  Mic,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { LanguageProvider, SUPPORTED_LANGUAGES, useLanguage } from "@/lib/i18n";

function HowItWorksContent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Barra de Navegación Superior Fija */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{t.backToCanvasBtn}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900 hidden sm:inline">
                Mind Diary
              </span>
            </div>

            {/* Selector de idioma */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1 text-xs">
              <Globe className="h-3.5 w-3.5 text-slate-400 ml-1" />
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`rounded-lg px-2 py-0.5 font-semibold text-[11px] transition-colors ${
                    language === l.code
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {l.shortLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-xs font-medium text-blue-700">
            <Sparkles className="h-3 w-3" />
            <span>{t.howItWorksTitle}</span>
          </div>
          <h1 className="mb-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {t.howItWorksSubtitle}
          </h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-base leading-relaxed text-slate-600">
            Mind Diary es una herramienta de organización visual sin fricción, pensada para capturar pensamientos al instante, trazar ramas de pensamiento con armonía cromática y desbloquear nuevas perspectivas con IA.
          </p>
        </div>

        {/* Capítulo 1: Lienzo y Colorimetría Jerárquica */}
        <section className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Capítulo 1
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.guideStep1Title}
              </h2>
            </div>
          </div>

          <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-600">
            {t.guideStep1Desc}
          </p>

          {/* Diagrama CSS de Jerarquía y Color */}
          <div className="mb-6 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-6">
            <div className="text-xs font-semibold text-slate-700 mb-3">
              Demostración: Ramas con Colorimetría Inteligente
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-violet-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 uppercase">
                    Proyecto Central
                  </span>
                  <span className="flex h-3 w-3 rounded-full bg-violet-500" />
                </div>
                <div className="font-semibold text-sm text-slate-900">Lanzamiento Q4</div>
                <div className="text-xs text-slate-500 mt-1">Idea raíz con tema Violeta asignado.</div>
              </div>

              <div className="rounded-2xl border border-violet-300 bg-violet-50/40 p-4 shadow-xs relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 hidden sm:block w-3 h-0.5 bg-violet-400" />
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-md bg-violet-100/80 px-2 py-0.5 text-[10px] font-bold text-violet-800 uppercase">
                    Sub-idea Heredada
                  </span>
                  <span className="text-[10px] text-violet-600 font-medium">Hereda #7c3aed</span>
                </div>
                <div className="font-semibold text-sm text-slate-900">Estrategia de Contenido</div>
                <div className="text-xs text-slate-600 mt-1">Conexión y fondo teñidos automáticamente.</div>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            {t.guideStep1Highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Capítulo 2: Captura Rápida & Dictado por Voz */}
        <section className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Capítulo 2
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.guideStep2Title}
              </h2>
            </div>
          </div>

          <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-600">
            {t.guideStep2Desc}
          </p>

          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-blue-900">Sintaxis de captura en una sola línea</div>
                <div className="font-mono text-xs text-blue-700 mt-1">
                  &quot;Arquitectura: Reducir latencia con caché #performance #nextjs&quot;
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs border border-slate-200">
                  <Mic className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                  Web Speech API
                </span>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            {t.guideStep2Highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Capítulo 3: Asistente IA & Referencias con Cámara */}
        <section className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Capítulo 3
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.guideStep3Title}
              </h2>
            </div>
          </div>

          <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-600">
            {t.guideStep3Desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center">
              <div className="text-xl mb-1">✨</div>
              <div className="text-xs font-semibold text-slate-800">Desglosar Ideas</div>
              <div className="text-[11px] text-slate-500 mt-1">Crea 3 a 4 ramas derivadas en abanico sin solapamiento.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center">
              <div className="text-xl mb-1">🎯</div>
              <div className="text-xs font-semibold text-slate-800">Perspectiva Anti-bloqueo</div>
              <div className="text-[11px] text-slate-500 mt-1">Preguntas detonantes e inversiones para ver otro ángulo.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center">
              <div className="text-xl mb-1">📸</div>
              <div className="text-xs font-semibold text-slate-800">Análisis Visual IA</div>
              <div className="text-[11px] text-slate-500 mt-1">Sube o captura fotos y extrae conceptos accionables.</div>
            </div>
          </div>

          <ul className="space-y-2">
            {t.guideStep3Highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Capítulo 4: Modo Zen & Exportación */}
        <section className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Capítulo 4
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t.guideStep4Title}
              </h2>
            </div>
          </div>

          <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-600">
            {t.guideStep4Desc}
          </p>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 mb-2 font-semibold text-xs text-slate-800">
                <EyeOff className="h-4 w-4 text-slate-500" />
                <span>Modo Flujo Creativo (Zen)</span>
              </div>
              <p className="text-xs text-slate-500">
                Oculta con transición suave la Toolbar, minimapa y contadores. Un botón sutil en la esquina superior permite salir cuando desees.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 mb-2 font-semibold text-xs text-slate-800">
                <Download className="h-4 w-4 text-blue-600" />
                <span>Exportación Jerárquica y Backup</span>
              </div>
              <p className="text-xs text-slate-500">
                Descarga un archivo .md estructurado con listas y notas listo para Notion / Obsidian, o un backup completo en JSON para restaurar en segundos.
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {t.guideStep4Highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tabla Resumen de Atajos y Gestos */}
        <section className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 border border-slate-200">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Atajos de Teclado y Gestos Táctiles
              </h2>
              <p className="text-xs text-slate-500">Referencia rápida para máxima velocidad</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                <Keyboard className="h-3.5 w-3.5" />
                <span>Atajos en Computadora</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">Captura Rápida Global</span>
                <kbd className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-bold border border-slate-200 text-slate-700">Ctrl + K / ⌘K</kbd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">Alternar Modo Zen</span>
                <kbd className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-bold border border-slate-200 text-slate-700">Shift + Z</kbd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">Eliminar Selección</span>
                <kbd className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-bold border border-slate-200 text-slate-700">Delete / Backspace</kbd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">Deseleccionar / Cerrar</span>
                <kbd className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-bold border border-slate-200 text-slate-700">Escape</kbd>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Gestos en Móviles (iOS / Android)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">Crear idea con el pulgar</span>
                <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-[11px] text-blue-700">Botón Flotante (+)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">Moverse por el lienzo</span>
                <span className="rounded bg-white px-2 py-0.5 font-semibold text-[11px] border border-slate-200 text-slate-700">Arrastre con un dedo</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">Zoom fluido</span>
                <span className="rounded bg-white px-2 py-0.5 font-semibold text-[11px] border border-slate-200 text-slate-700">Pellizcar con dos dedos</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">Editar texto</span>
                <span className="rounded bg-white px-2 py-0.5 font-semibold text-[11px] border border-slate-200 text-slate-700">Toque directo sobre el título</span>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Inferior de Llamada a la Acción */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white shadow-lg shadow-blue-500/20">
          <h2 className="mb-2 text-xl sm:text-2xl font-bold">
            ¿Listo para estructurar tus ideas?
          </h2>
          <p className="mx-auto mb-6 max-w-md text-xs sm:text-sm text-blue-100">
            Abre el lienzo de Mind Diary y experimenta un flujo de trabajo moderno, limpio y sin fricción.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-md transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
          >
            <span>{t.backToCanvasBtn}</span>
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <LanguageProvider>
      <HowItWorksContent />
    </LanguageProvider>
  );
}
