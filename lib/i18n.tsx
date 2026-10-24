"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { IdeaCategory, IdeaNodeColor, SupportedLanguage } from "@/types";

export const LANGUAGE_STORAGE_KEY = "mind_diary_lang";

export const SUPPORTED_LANGUAGES: Array<{
  code: SupportedLanguage;
  shortLabel: string;
  name: string;
  speechLang: string;
}> = [
  { code: "es", shortLabel: "ES", name: "Español", speechLang: "es-ES" },
  { code: "en", shortLabel: "EN", name: "English", speechLang: "en-US" },
  { code: "fr", shortLabel: "FR", name: "Français", speechLang: "fr-FR" },
  { code: "pt", shortLabel: "PT", name: "Português", speechLang: "pt-BR" },
  { code: "de", shortLabel: "DE", name: "Deutsch", speechLang: "de-DE" },
];

export interface Dictionary {
  appSubtitle: string;
  ideaSingular: string;
  ideaPlural: string;
  connSingular: string;
  connPlural: string;
  saving: string;
  saved: string;
  quickCaptureBtn: string;
  zenBtn: string;
  exitZenBtn: string;
  exportBtn: string;
  newIdeaBtn: string;
  exportHeader: string;
  exportMarkdownTitle: string;
  exportMarkdownSub: string;
  exportJsonTitle: string;
  exportJsonSub: string;
  importJsonTitle: string;
  importJsonSub: string;
  clearCanvasTitle: string;
  clearCanvasSub: string;
  mobileMenuHeader: string;
  languageLabel: string;
  // QuickCapture
  quickCapturePlaceholder: string;
  quickCaptureCenterHint: string;
  quickCaptureSyntaxHint: string;
  createBtn: string;
  voiceStartHint: string;
  voiceStopHint: string;
  voiceListening: string;
  voiceUnsupported: string;
  // NodeModal
  modalTitle: string;
  modalSubtitle: string;
  titleLabel: string;
  titlePlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  categoryLabel: string;
  tagsLabel: string;
  colorAccentLabel: string;
  photoLabel: string;
  photoAttachBtn: string;
  photoRemoveBtn: string;
  cancelBtn: string;
  createNodeBtn: string;
  // ConfirmClearModal
  clearModalTitle: string;
  clearModalSubtitle: string;
  clearModalWarning: string;
  clearEmptyTitle: string;
  clearEmptySub: string;
  resetTemplateTitle: string;
  resetTemplateSub: string;
  // IdeaNodeCard & AI
  aiMenuHeader: string;
  aiExpandOption: string;
  aiUnblockOption: string;
  aiVisualAnalyzeBtn: string;
  aiGenerating: string;
  themeColorTooltip: string;
  attachPhotoTooltip: string;
  editTooltip: string;
  deleteTooltip: string;
  derivedBadge: string;
  // Toasts
  toastExpanded: (count: number) => string;
  toastUnblocked: (count: number) => string;
  toastVisualAnalyzed: (count: number) => string;
  toastAiError: string;
  toastMarkdownExported: string;
  toastJsonExported: string;
  toastJsonImported: (count: number) => string;
  toastJsonImportError: string;
  toastCleared: string;
  toastTemplateRestored: string;
  toastPhotoAttached: string;
  // Categories & Colors
  categories: Record<IdeaCategory, string>;
  colors: Record<IdeaNodeColor, string>;
}

export const TRANSLATIONS: Record<SupportedLanguage, Dictionary> = {
  es: {
    appSubtitle: "AI Studio",
    ideaSingular: "idea",
    ideaPlural: "ideas",
    connSingular: "conexión",
    connPlural: "conexiones",
    saving: "Guardando...",
    saved: "Guardado",
    quickCaptureBtn: "Captura Rápida",
    zenBtn: "Zen",
    exitZenBtn: "Salir de Modo Zen",
    exportBtn: "Exportar",
    newIdeaBtn: "Nueva Idea",
    exportHeader: "Exportación y Backup",
    exportMarkdownTitle: "Exportar como Markdown",
    exportMarkdownSub: "Jerárquico (.md) para Notion / Obsidian",
    exportJsonTitle: "Exportar como JSON",
    exportJsonSub: "Respaldo completo de nodos y enlaces",
    importJsonTitle: "Importar respaldo JSON",
    importJsonSub: "Restaurar desde archivo .json",
    clearCanvasTitle: "Limpiar Lienzo",
    clearCanvasSub: "Vaciar tablero o restaurar plantilla",
    mobileMenuHeader: "Acciones y Herramientas",
    languageLabel: "Idioma",
    quickCapturePlaceholder:
      "Escribe o dicta una idea... (ej. Rediseñar app: Simplificar #ux)",
    quickCaptureCenterHint: "Se colocará en el centro exacto de tu vista actual",
    quickCaptureSyntaxHint: "Usa : para descripción y #tag para etiquetas",
    createBtn: "Crear",
    voiceStartHint: "Dictar por voz",
    voiceStopHint: "Detener dictado",
    voiceListening: "Escuchando...",
    voiceUnsupported: "Tu navegador no soporta reconocimiento de voz.",
    modalTitle: "Capturar Nueva Idea",
    modalSubtitle: "Añade un nuevo nodo multimedia al lienzo de Mind Diary",
    titleLabel: "Título",
    titlePlaceholder: "Ej. Arquitectura de sincronización...",
    contentLabel: "Contenido",
    contentPlaceholder: "Desarrolla o dicta brevemente la idea...",
    categoryLabel: "Categoría",
    tagsLabel: "Etiquetas (separadas por coma)",
    colorAccentLabel: "Color del tema (rama)",
    photoLabel: "Referencia visual (Cámara o Galería)",
    photoAttachBtn: "Tomar / Subir foto",
    photoRemoveBtn: "Quitar foto",
    cancelBtn: "Cancelar",
    createNodeBtn: "Crear Nodo",
    clearModalTitle: "Reiniciar o Limpiar Lienzo",
    clearModalSubtitle: "Elige cómo deseas reiniciar tu espacio de trabajo",
    clearModalWarning:
      "Esta acción reemplazará los nodos y conexiones actuales en tu almacenamiento local. Puedes exportar un respaldo JSON antes de continuar.",
    clearEmptyTitle: "Dejar lienzo completamente limpio",
    clearEmptySub: "Elimina todos los nodos y conexiones para empezar desde cero",
    resetTemplateTitle: "Restaurar plantilla inicial",
    resetTemplateSub: "Carga las 3 ideas de ejemplo originales de Mind Diary",
    aiMenuHeader: "Asistente IA",
    aiExpandOption: "✨ Desglosar sub-ideas",
    aiUnblockOption: "🎯 Perspectiva anti-bloqueo",
    aiVisualAnalyzeBtn: "✨ Analizar con IA",
    aiGenerating: "Generando ideas...",
    themeColorTooltip: "Cambiar color de rama",
    attachPhotoTooltip: "Adjuntar foto o cámara",
    editTooltip: "Editar texto",
    deleteTooltip: "Eliminar nodo",
    derivedBadge: "Sub-idea",
    toastExpanded: (n) => `✨ ${n} sub-ideas desplegadas en abanico`,
    toastUnblocked: (n) => `🎯 ${n} perspectivas anti-bloqueo generadas`,
    toastVisualAnalyzed: (n) => `📸 ${n} conceptos visuales extraídos con IA`,
    toastAiError: "No se pudieron generar ideas en este momento.",
    toastMarkdownExported: "📄 Documento Markdown (.md) exportado",
    toastJsonExported: "💾 Respaldo JSON (.json) descargado",
    toastJsonImported: (n) => `✅ Respaldo restaurado (${n} ideas)`,
    toastJsonImportError: "El archivo no es un respaldo válido de Mind Diary.",
    toastCleared: "🧹 Lienzo limpio y listo para nuevas ideas",
    toastTemplateRestored: "🔄 Plantilla inicial restaurada",
    toastPhotoAttached: "📷 Imagen adjuntada al nodo",
    categories: {
      idea: "Idea",
      project: "Proyecto",
      task: "Tarea",
      reference: "Referencia",
      question: "Pregunta",
      note: "Nota",
    },
    colors: {
      slate: "Pizarra",
      blue: "Azul",
      indigo: "Índigo",
      emerald: "Esmeralda",
      amber: "Ámbar",
      rose: "Rosa",
      violet: "Violeta",
    },
  },
  en: {
    appSubtitle: "AI Studio",
    ideaSingular: "idea",
    ideaPlural: "ideas",
    connSingular: "connection",
    connPlural: "connections",
    saving: "Saving...",
    saved: "Saved",
    quickCaptureBtn: "Quick Capture",
    zenBtn: "Zen",
    exitZenBtn: "Exit Zen Mode",
    exportBtn: "Export",
    newIdeaBtn: "New Idea",
    exportHeader: "Export & Backup",
    exportMarkdownTitle: "Export as Markdown",
    exportMarkdownSub: "Hierarchical (.md) for Notion / Obsidian",
    exportJsonTitle: "Export as JSON",
    exportJsonSub: "Full backup of nodes and links",
    importJsonTitle: "Import JSON Backup",
    importJsonSub: "Restore from .json file",
    clearCanvasTitle: "Clear Canvas",
    clearCanvasSub: "Empty board or restore template",
    mobileMenuHeader: "Actions & Tools",
    languageLabel: "Language",
    quickCapturePlaceholder:
      "Type or dictate an idea... (e.g. Onboarding: Simplify steps #ux)",
    quickCaptureCenterHint: "Placed at the exact center of your current view",
    quickCaptureSyntaxHint: "Use : for description and #tag for tags",
    createBtn: "Create",
    voiceStartHint: "Voice dictation",
    voiceStopHint: "Stop dictation",
    voiceListening: "Listening...",
    voiceUnsupported: "Speech recognition is not supported in this browser.",
    modalTitle: "Capture New Idea",
    modalSubtitle: "Add a new multimedia node to your Mind Diary canvas",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Sync Engine Architecture...",
    contentLabel: "Content",
    contentPlaceholder: "Briefly describe or dictate the idea...",
    categoryLabel: "Category",
    tagsLabel: "Tags (comma-separated)",
    colorAccentLabel: "Theme color (branch)",
    photoLabel: "Visual reference (Camera or Gallery)",
    photoAttachBtn: "Take / Upload photo",
    photoRemoveBtn: "Remove photo",
    cancelBtn: "Cancel",
    createNodeBtn: "Create Node",
    clearModalTitle: "Reset or Clear Canvas",
    clearModalSubtitle: "Choose how you want to reset your workspace",
    clearModalWarning:
      "This action will replace current nodes and connections in local storage. You can export a JSON backup before continuing.",
    clearEmptyTitle: "Start with a blank canvas",
    clearEmptySub: "Removes all nodes and connections to start fresh",
    resetTemplateTitle: "Restore starter template",
    resetTemplateSub: "Loads the original 3 sample ideas",
    aiMenuHeader: "AI Assistant",
    aiExpandOption: "✨ Break down sub-ideas",
    aiUnblockOption: "🎯 Unblock perspective",
    aiVisualAnalyzeBtn: "✨ Analyze with AI",
    aiGenerating: "Generating ideas...",
    themeColorTooltip: "Change branch color",
    attachPhotoTooltip: "Attach photo or camera",
    editTooltip: "Edit text",
    deleteTooltip: "Delete node",
    derivedBadge: "Sub-idea",
    toastExpanded: (n) => `✨ ${n} sub-ideas fanned out`,
    toastUnblocked: (n) => `🎯 ${n} unblock perspectives generated`,
    toastVisualAnalyzed: (n) => `📸 ${n} visual concepts extracted with AI`,
    toastAiError: "Could not generate ideas right now.",
    toastMarkdownExported: "📄 Markdown (.md) document exported",
    toastJsonExported: "💾 JSON (.json) backup downloaded",
    toastJsonImported: (n) => `✅ Backup restored (${n} ideas)`,
    toastJsonImportError: "Selected file is not a valid Mind Diary backup.",
    toastCleared: "🧹 Canvas cleared and ready",
    toastTemplateRestored: "🔄 Starter template restored",
    toastPhotoAttached: "📷 Visual reference attached",
    categories: {
      idea: "Idea",
      project: "Project",
      task: "Task",
      reference: "Reference",
      question: "Question",
      note: "Note",
    },
    colors: {
      slate: "Slate",
      blue: "Blue",
      indigo: "Indigo",
      emerald: "Emerald",
      amber: "Amber",
      rose: "Rose",
      violet: "Violet",
    },
  },
  fr: {
    appSubtitle: "Studio IA",
    ideaSingular: "idée",
    ideaPlural: "idées",
    connSingular: "connexion",
    connPlural: "connexions",
    saving: "Enregistrement...",
    saved: "Enregistré",
    quickCaptureBtn: "Capture Rapide",
    zenBtn: "Zen",
    exitZenBtn: "Quitter le Mode Zen",
    exportBtn: "Exporter",
    newIdeaBtn: "Nouvelle Idée",
    exportHeader: "Exportation et Sauvegarde",
    exportMarkdownTitle: "Exporter en Markdown",
    exportMarkdownSub: "Hiérarchique (.md) pour Notion / Obsidian",
    exportJsonTitle: "Exporter en JSON",
    exportJsonSub: "Sauvegarde complète des nœuds et liens",
    importJsonTitle: "Importer un JSON",
    importJsonSub: "Restaurer depuis un fichier .json",
    clearCanvasTitle: "Effacer le Canevas",
    clearCanvasSub: "Vider le tableau ou restaurer le modèle",
    mobileMenuHeader: "Actions et Outils",
    languageLabel: "Langue",
    quickCapturePlaceholder:
      "Écrivez ou dictez une idée... (ex. Onboarding : Simplifier #ux)",
    quickCaptureCenterHint: "Sera placé au centre exact de votre vue actuelle",
    quickCaptureSyntaxHint: "Utilisez : pour la description et #tag",
    createBtn: "Créer",
    voiceStartHint: "Dictée vocale",
    voiceStopHint: "Arrêter la dictée",
    voiceListening: "Écoute en cours...",
    voiceUnsupported: "La reconnaissance vocale n'est pas prise en charge.",
    modalTitle: "Capturer une Nouvelle Idée",
    modalSubtitle: "Ajoutez un nœud multimédia à votre carte mentale",
    titleLabel: "Titre",
    titlePlaceholder: "Ex. Architecture de synchronisation...",
    contentLabel: "Contenu",
    contentPlaceholder: "Développez ou dictez brièvement l'idée...",
    categoryLabel: "Catégorie",
    tagsLabel: "Étiquettes (séparées par des virgules)",
    colorAccentLabel: "Couleur du thème (branche)",
    photoLabel: "Référence visuelle (Caméra ou Galerie)",
    photoAttachBtn: "Prendre / Choisir photo",
    photoRemoveBtn: "Supprimer la photo",
    cancelBtn: "Annuler",
    createNodeBtn: "Créer le Nœud",
    clearModalTitle: "Réinitialiser ou Vider le Canevas",
    clearModalSubtitle: "Choisissez comment réinitialiser votre espace",
    clearModalWarning:
      "Cette action remplacera les nœuds actuels dans le stockage local. Vous pouvez exporter une sauvegarde JSON avant de continuer.",
    clearEmptyTitle: "Laisser le canevas totalement vide",
    clearEmptySub: "Supprime tous les nœuds et connexions",
    resetTemplateTitle: "Restaurer le modèle initial",
    resetTemplateSub: "Charge les 3 idées d'exemple de Mind Diary",
    aiMenuHeader: "Assistant IA",
    aiExpandOption: "✨ Décomposer en sous-idées",
    aiUnblockOption: "🎯 Perspective anti-blocage",
    aiVisualAnalyzeBtn: "✨ Analyser avec l'IA",
    aiGenerating: "Génération d'idées...",
    themeColorTooltip: "Changer la couleur de branche",
    attachPhotoTooltip: "Joindre une photo",
    editTooltip: "Modifier le texte",
    deleteTooltip: "Supprimer le nœud",
    derivedBadge: "Sous-idée",
    toastExpanded: (n) => `✨ ${n} sous-idées déployées en éventail`,
    toastUnblocked: (n) => `🎯 ${n} perspectives anti-blocage générées`,
    toastVisualAnalyzed: (n) => `📸 ${n} concepts visuels extraits par l'IA`,
    toastAiError: "Impossible de générer des idées pour le moment.",
    toastMarkdownExported: "📄 Document Markdown (.md) exporté",
    toastJsonExported: "💾 Sauvegarde JSON (.json) téléchargée",
    toastJsonImported: (n) => `✅ Sauvegarde restaurée (${n} idées)`,
    toastJsonImportError: "Fichier de sauvegarde non valide.",
    toastCleared: "🧹 Canevas vidé et prêt",
    toastTemplateRestored: "🔄 Modèle initial restauré",
    toastPhotoAttached: "📷 Image jointe au nœud",
    categories: {
      idea: "Idée",
      project: "Projet",
      task: "Tâche",
      reference: "Référence",
      question: "Question",
      note: "Note",
    },
    colors: {
      slate: "Ardoise",
      blue: "Bleu",
      indigo: "Indigo",
      emerald: "Émeraude",
      amber: "Ambre",
      rose: "Rose",
      violet: "Violet",
    },
  },
  pt: {
    appSubtitle: "AI Studio",
    ideaSingular: "ideia",
    ideaPlural: "ideias",
    connSingular: "conexão",
    connPlural: "conexões",
    saving: "Salvando...",
    saved: "Salvo",
    quickCaptureBtn: "Captura Rápida",
    zenBtn: "Zen",
    exitZenBtn: "Sair do Modo Zen",
    exportBtn: "Exportar",
    newIdeaBtn: "Nova Ideia",
    exportHeader: "Exportação e Backup",
    exportMarkdownTitle: "Exportar como Markdown",
    exportMarkdownSub: "Hierárquico (.md) para Notion / Obsidian",
    exportJsonTitle: "Exportar como JSON",
    exportJsonSub: "Backup completo de nós e conexões",
    importJsonTitle: "Importar backup JSON",
    importJsonSub: "Restaurar de arquivo .json",
    clearCanvasTitle: "Limpar Tela",
    clearCanvasSub: "Esvaziar quadro ou restaurar modelo",
    mobileMenuHeader: "Ações e Ferramentas",
    languageLabel: "Idioma",
    quickCapturePlaceholder:
      "Digite ou dite uma ideia... (ex. Onboarding: Simplificar #ux)",
    quickCaptureCenterHint: "Será posicionado no centro exato da sua vista",
    quickCaptureSyntaxHint: "Use : para descrição e #tag para etiquetas",
    createBtn: "Criar",
    voiceStartHint: "Ditar por voz",
    voiceStopHint: "Parar ditado",
    voiceListening: "Ouvindo...",
    voiceUnsupported: "Reconhecimento de voz não suportado neste navegador.",
    modalTitle: "Capturar Nova Ideia",
    modalSubtitle: "Adicione um novo nó multimídia ao Mind Diary",
    titleLabel: "Título",
    titlePlaceholder: "Ex. Arquitetura de sincronização...",
    contentLabel: "Conteúdo",
    contentPlaceholder: "Desenvolva ou dite brevemente a ideia...",
    categoryLabel: "Categoria",
    tagsLabel: "Etiquetas (separadas por vírgula)",
    colorAccentLabel: "Cor do tema (ramo)",
    photoLabel: "Referência visual (Câmera ou Galeria)",
    photoAttachBtn: "Tirar / Enviar foto",
    photoRemoveBtn: "Remover foto",
    cancelBtn: "Cancelar",
    createNodeBtn: "Criar Nó",
    clearModalTitle: "Reiniciar ou Limpar Tela",
    clearModalSubtitle: "Escolha como deseja reiniciar seu espaço",
    clearModalWarning:
      "Esta ação substituirá os nós atuais no armazenamento local. Você pode exportar um backup JSON antes de continuar.",
    clearEmptyTitle: "Deixar tela totalmente limpa",
    clearEmptySub: "Remove todos os nós e conexões para começar do zero",
    resetTemplateTitle: "Restaurar modelo inicial",
    resetTemplateSub: "Carrega as 3 ideias de exemplo originais",
    aiMenuHeader: "Assistente IA",
    aiExpandOption: "✨ Desdobrar sub-ideias",
    aiUnblockOption: "🎯 Perspectiva anti-bloqueio",
    aiVisualAnalyzeBtn: "✨ Analisar com IA",
    aiGenerating: "Gerando ideias...",
    themeColorTooltip: "Mudar cor do ramo",
    attachPhotoTooltip: "Anexar foto ou câmera",
    editTooltip: "Editar texto",
    deleteTooltip: "Excluir nó",
    derivedBadge: "Sub-ideia",
    toastExpanded: (n) => `✨ ${n} sub-ideias abertas em leque`,
    toastUnblocked: (n) => `🎯 ${n} perspectivas anti-bloqueio geradas`,
    toastVisualAnalyzed: (n) => `📸 ${n} conceitos visuais extraídos com IA`,
    toastAiError: "Não foi possível gerar ideias neste momento.",
    toastMarkdownExported: "📄 Documento Markdown (.md) exportado",
    toastJsonExported: "💾 Backup JSON (.json) baixado",
    toastJsonImported: (n) => `✅ Backup restaurado (${n} ideias)`,
    toastJsonImportError: "O arquivo não é um backup válido.",
    toastCleared: "🧹 Tela limpa e pronta",
    toastTemplateRestored: "🔄 Modelo inicial restaurado",
    toastPhotoAttached: "📷 Imagem anexada ao nó",
    categories: {
      idea: "Ideia",
      project: "Projeto",
      task: "Tarefa",
      reference: "Referência",
      question: "Pergunta",
      note: "Nota",
    },
    colors: {
      slate: "Ardósia",
      blue: "Azul",
      indigo: "Índigo",
      emerald: "Esmeralda",
      amber: "Âmbar",
      rose: "Rosa",
      violet: "Violeta",
    },
  },
  de: {
    appSubtitle: "KI-Studio",
    ideaSingular: "Idee",
    ideaPlural: "Ideen",
    connSingular: "Verbindung",
    connPlural: "Verbindungen",
    saving: "Speichern...",
    saved: "Gespeichert",
    quickCaptureBtn: "Schnellerfassung",
    zenBtn: "Zen",
    exitZenBtn: "Zen-Modus beenden",
    exportBtn: "Exportieren",
    newIdeaBtn: "Neue Idee",
    exportHeader: "Export & Backup",
    exportMarkdownTitle: "Als Markdown exportieren",
    exportMarkdownSub: "Hierarchisch (.md) für Notion / Obsidian",
    exportJsonTitle: "Als JSON exportieren",
    exportJsonSub: "Vollständiges Backup aller Knoten",
    importJsonTitle: "JSON-Backup importieren",
    importJsonSub: "Aus .json-Datei wiederherstellen",
    clearCanvasTitle: "Leinwand leeren",
    clearCanvasSub: "Board leeren oder Vorlage laden",
    mobileMenuHeader: "Aktionen & Werkzeuge",
    languageLabel: "Sprache",
    quickCapturePlaceholder:
      "Idee eingeben oder diktieren... (z.B. Onboarding: Vereinfachen #ux)",
    quickCaptureCenterHint: "Wird genau in der Mitte Ihrer aktuellen Ansicht platziert",
    quickCaptureSyntaxHint: "Nutzen Sie : für Beschreibung und #tag",
    createBtn: "Erstellen",
    voiceStartHint: "Spracheingabe",
    voiceStopHint: "Diktat beenden",
    voiceListening: "Hört zu...",
    voiceUnsupported: "Spracherkennung wird in diesem Browser nicht unterstützt.",
    modalTitle: "Neue Idee erfassen",
    modalSubtitle: "Fügen Sie Ihrer Mindmap einen Multimedia-Knoten hinzu",
    titleLabel: "Titel",
    titlePlaceholder: "z.B. Synchronisations-Architektur...",
    contentLabel: "Inhalt",
    contentPlaceholder: "Idee kurz beschreiben oder diktieren...",
    categoryLabel: "Kategorie",
    tagsLabel: "Tags (kommagetrennt)",
    colorAccentLabel: "Themenfarbe (Zweig)",
    photoLabel: "Visuelle Referenz (Kamera oder Galerie)",
    photoAttachBtn: "Foto aufnehmen / hochladen",
    photoRemoveBtn: "Foto entfernen",
    cancelBtn: "Abbrechen",
    createNodeBtn: "Knoten erstellen",
    clearModalTitle: "Leinwand zurücksetzen oder leeren",
    clearModalSubtitle: "Wählen Sie, wie Ihr Arbeitsbereich zurückgesetzt wird",
    clearModalWarning:
      "Diese Aktion ersetzt alle aktuellen Knoten im lokalen Speicher. Exportieren Sie vorher bei Bedarf ein JSON-Backup.",
    clearEmptyTitle: "Komplett leere Leinwand",
    clearEmptySub: "Entfernt alle Knoten und Verbindungen für einen Neustart",
    resetTemplateTitle: "Startvorlage wiederherstellen",
    resetTemplateSub: "Lädt die 3 ursprünglichen Beispiel-Ideen",
    aiMenuHeader: "KI-Assistent",
    aiExpandOption: "✨ Teilideen aufschlüsseln",
    aiUnblockOption: "🎯 Blockade-Löser Perspektive",
    aiVisualAnalyzeBtn: "✨ Mit KI analysieren",
    aiGenerating: "Ideen werden generiert...",
    themeColorTooltip: "Zweigfarbe ändern",
    attachPhotoTooltip: "Foto anhängen",
    editTooltip: "Text bearbeiten",
    deleteTooltip: "Knoten löschen",
    derivedBadge: "Teilidee",
    toastExpanded: (n) => `✨ ${n} Teilideen fächerförmig erstellt`,
    toastUnblocked: (n) => `🎯 ${n} Perspektiven gegen Blockaden generiert`,
    toastVisualAnalyzed: (n) => `📸 ${n} visuelle Konzepte per KI extrahiert`,
    toastAiError: "Ideen konnten momentan nicht generiert werden.",
    toastMarkdownExported: "📄 Markdown-Dokument (.md) exportiert",
    toastJsonExported: "💾 JSON-Backup (.json) heruntergeladen",
    toastJsonImported: (n) => `✅ Backup wiederhergestellt (${n} Ideen)`,
    toastJsonImportError: "Ungültige Backup-Datei.",
    toastCleared: "🧹 Leinwand geleert und bereit",
    toastTemplateRestored: "🔄 Startvorlage wiederhergestellt",
    toastPhotoAttached: "📷 Bild an Knoten angehängt",
    categories: {
      idea: "Idee",
      project: "Projekt",
      task: "Aufgabe",
      reference: "Referenz",
      question: "Frage",
      note: "Notiz",
    },
    colors: {
      slate: "Schiefer",
      blue: "Blau",
      indigo: "Indigo",
      emerald: "Smaragd",
      amber: "Bernstein",
      rose: "Rosa",
      violet: "Violett",
    },
  },
};

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Dictionary;
  speechLocale: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const languageListeners = new Set<() => void>();

function subscribeLanguage(listener: () => void) {
  languageListeners.add(listener);
  return () => {
    languageListeners.delete(listener);
  };
}

function getLanguageSnapshot(): SupportedLanguage {
  if (typeof window === "undefined") return "es";
  try {
    const saved = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY
    ) as SupportedLanguage | null;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return "es";
}

function getLanguageServerSnapshot(): SupportedLanguage {
  return "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch {
        // ignore storage errors
      }
      languageListeners.forEach((listener) => listener());
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const meta =
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ??
      SUPPORTED_LANGUAGES[0];
    return {
      language,
      setLanguage,
      t: TRANSLATIONS[language] ?? TRANSLATIONS.es,
      speechLocale: meta.speechLang,
    };
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: "es",
      setLanguage: () => {},
      t: TRANSLATIONS.es,
      speechLocale: "es-ES",
    };
  }
  return ctx;
}
