"use client";

import { AlertTriangle, RotateCcw, Trash2, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
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
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/25 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="max-h-[90dvh] w-full sm:w-[92%] max-w-md overflow-y-auto rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-200 bg-white p-5 sm:p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />

        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {t.clearModalTitle}
              </h2>
              <p className="text-xs text-slate-500">{t.clearModalSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancelBtn}
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl p-1.5 text-slate-400 active:bg-slate-100 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-5 text-xs leading-relaxed text-slate-600">
          {t.clearModalWarning}
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onClearEmpty();
              onClose();
            }}
            className="flex min-h-[56px] w-full items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-left transition-colors active:bg-rose-100/70 hover:bg-rose-50 cursor-pointer"
          >
            <div>
              <div className="text-xs font-semibold text-rose-700">
                {t.clearEmptyTitle}
              </div>
              <div className="text-[11px] text-rose-600/80">
                {t.clearEmptySub}
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
            className="flex min-h-[56px] w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-left transition-colors active:bg-slate-200/60 hover:bg-slate-100/80 cursor-pointer"
          >
            <div>
              <div className="text-xs font-semibold text-slate-800">
                {t.resetTemplateTitle}
              </div>
              <div className="text-[11px] text-slate-500">
                {t.resetTemplateSub}
              </div>
            </div>
            <RotateCcw className="h-4 w-4 text-slate-600 shrink-0" />
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            className="min-h-[44px] w-full sm:w-auto sm:min-h-0"
          >
            {t.cancelBtn}
          </Button>
        </div>
      </div>
    </div>
  );
}
