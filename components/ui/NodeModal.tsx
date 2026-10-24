"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, Mic, MicOff, Trash2, X } from "lucide-react";
import type { IdeaCategory, IdeaNode, IdeaNodeColor } from "@/types";
import { NODE_COLOR_STYLES } from "@/lib/constants";
import { createEntityId } from "@/lib/flow-utils";
import { compressImageFile } from "@/lib/image-utils";
import { useLanguage } from "@/lib/i18n";
import { useSpeechToText } from "@/lib/useSpeechToText";
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
  const { t, speechLocale } = useLanguage();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<IdeaNodeColor>("blue");
  const [category, setCategory] = useState<IdeaCategory>("idea");
  const [tagsInput, setTagsInput] = useState("concept, focus");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceTranscript = useCallback((transcript: string) => {
    setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
  }, []);

  const { isListening, toggleListening, stopListening } = useSpeechToText({
    lang: speechLocale,
    onTranscript: handleVoiceTranscript,
  });

  if (!isOpen) return null;

  const handleClose = () => {
    if (isListening) stopListening();
    onClose();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setImageUrl(compressed);
    } catch {
      // ignore
    } finally {
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isListening) stopListening();

    const parsedTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((label) => ({
        id: createEntityId("tag"),
        label,
        color,
      }));

    onCreate({
      title: title.trim(),
      content: content.trim() || "...",
      color,
      category,
      tags: parsedTags,
      imageUrl,
    });

    setTitle("");
    setContent("");
    setImageUrl(undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/25 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
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
              {t.modalTitle}
            </h2>
            <p className="text-xs text-slate-500">{t.modalSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.cancelBtn}
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl p-1.5 text-slate-400 active:bg-slate-100 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              {t.titleLabel}
            </label>
            <input
              type="text"
              required
              placeholder={t.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">
                {t.contentLabel}
              </label>
              <button
                type="button"
                onClick={toggleListening}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-medium transition-all cursor-pointer ${
                  isListening
                    ? "bg-rose-50 text-rose-600 ring-1 ring-rose-300 animate-pulse"
                    : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-3 w-3" />
                    <span>{t.voiceListening}</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-3 w-3" />
                    <span>{t.voiceStartHint}</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={3}
              placeholder={t.contentPlaceholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Captura de Cámara / Imagen de Referencia */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              {t.photoLabel}
            </label>
            {imageUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-36 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(undefined)}
                  className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-lg bg-slate-900/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs hover:bg-rose-600 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>{t.photoRemoveBtn}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50/40 hover:text-blue-600 cursor-pointer"
              >
                <Camera className="h-4 w-4 text-blue-600" />
                <span>{t.photoAttachBtn}</span>
              </button>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm sm:text-xs font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t.categories[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                {t.tagsLabel}
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ux, product"
                className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-base sm:text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              {t.colorAccentLabel}
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
                    title={t.colors[c]}
                    aria-label={t.colors[c]}
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
              onClick={handleClose}
              className="min-h-[44px] sm:min-h-0"
            >
              {t.cancelBtn}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="min-h-[44px] sm:min-h-0"
            >
              {t.createNodeBtn}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
