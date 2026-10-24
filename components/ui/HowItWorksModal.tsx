"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  EyeOff,
  GitBranch,
  HelpCircle,
  Mic,
  Palette,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "./Button";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  if (!isOpen) return null;

  const stepsMeta = [
    {
      id: 1,
      icon: GitBranch,
      tab: t.guideStep1Tab,
      title: t.guideStep1Title,
      desc: t.guideStep1Desc,
      highlights: t.guideStep1Highlights,
    },
    {
      id: 2,
      icon: Zap,
      tab: t.guideStep2Tab,
      title: t.guideStep2Title,
      desc: t.guideStep2Desc,
      highlights: t.guideStep2Highlights,
    },
    {
      id: 3,
      icon: Sparkles,
      tab: t.guideStep3Tab,
      title: t.guideStep3Title,
      desc: t.guideStep3Desc,
      highlights: t.guideStep3Highlights,
    },
    {
      id: 4,
      icon: EyeOff,
      tab: t.guideStep4Tab,
      title: t.guideStep4Title,
      desc: t.guideStep4Desc,
      highlights: t.guideStep4Highlights,
    },
  ];

  const currentStep = stepsMeta[activeStep - 1];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/35 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full sm:w-[94%] max-w-2xl overflow-y-auto rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200/90 bg-white p-5 sm:p-7 shadow-2xl shadow-slate-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Manija táctil en móvil */}
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />

        {/* Encabezado del Modal */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.howItWorksTitle}
                </h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                  {t.stepLabel} {activeStep}/4
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.howItWorksSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancelBtn}
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl p-1.5 text-slate-400 active:bg-slate-100 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Barra de pestañas interactivas */}
        <div className="mb-5 flex items-center gap-1.5 overflow-x-auto rounded-2xl bg-slate-100/90 p-1 text-xs">
          {stepsMeta.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(s.id as 1 | 2 | 3 | 4)}
                className={`flex flex-1 min-w-[110px] items-center justify-center gap-1.5 rounded-xl py-2 px-2.5 font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span className="truncate">{s.tab}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido Visual Interactivo del Paso Seleccionado */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
            <h3 className="mb-1 text-sm sm:text-base font-semibold text-slate-900">
              {currentStep.title}
            </h3>
            <p className="mb-4 text-xs sm:text-sm leading-relaxed text-slate-600">
              {currentStep.desc}
            </p>

            {/* Simulación Gráfica según el Paso */}
            {activeStep === 1 && (
              <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-violet-500" />
                    <span className="text-xs font-semibold text-slate-800">
                      Idea Central (Violeta)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded-md">
                    <Palette className="h-3 w-3" />
                    Color de Rama
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-4">
                  <div className="h-8 w-0.5 bg-violet-400" />
                  <div className="flex-1 rounded-lg border border-violet-200 bg-violet-50/50 p-2 text-xs text-slate-700">
                    <span className="font-semibold text-violet-700">Sub-idea heredada:</span> Las ramas secundarias adoptan armónicamente el color del nodo padre.
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  <Zap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="font-mono text-slate-900 font-medium">Rediseñar onboarding: 3 pasos #ux</span>
                  <kbd className="ml-auto rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] text-slate-600">Enter</kbd>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="inline-flex items-center gap-1 text-rose-600">
                    <Mic className="h-3.5 w-3.5" />
                    Dictado en vivo disponible
                  </span>
                  <span className="font-medium text-blue-600">Atajo: Ctrl + K (o botón + en celular)</span>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-800">Menú IA del Nodo</span>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                      <Sparkles className="h-3 w-3" />
                      Desglosar
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                      🎯 Anti-bloqueo
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-2 text-xs text-slate-600">
                  <Camera className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Sube o toma una foto desde la cámara trasera y pulsa <strong>&quot;✨ Analizar con IA&quot;</strong></span>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                    <span>Modo Zen (Shift + Z)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Oculta toda la interfaz</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Download className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Exporta en <strong>Markdown (.md)</strong> para Notion/Obsidian o guarda un <strong>backup JSON</strong> completo.</span>
                </div>
              </div>
            )}

            {/* Lista de Puntos Clave */}
            <ul className="mt-4 space-y-1.5">
              {currentStep.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pie del Modal con Navegación y Enlace a Guía Editorial */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <Link
            href="/how-it-works"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>{t.viewFullGuideBtn}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeStep > 1 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setActiveStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>{t.prevStepBtn}</span>
              </Button>
            )}

            {activeStep < 4 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
              >
                <span>{t.nextStepBtn}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onClose}
              >
                <span>{t.closeGuideBtn}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
