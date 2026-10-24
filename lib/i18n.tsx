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
  // Guide / How It Works
  howItWorksBtn: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  backToCanvasBtn: string;
  viewFullGuideBtn: string;
  stepLabel: string;
  prevStepBtn: string;
  nextStepBtn: string;
  closeGuideBtn: string;
  guideStep1Tab: string;
  guideStep1Title: string;
  guideStep1Desc: string;
  guideStep1Highlights: string[];
  guideStep2Tab: string;
  guideStep2Title: string;
  guideStep2Desc: string;
  guideStep2Highlights: string[];
  guideStep3Tab: string;
  guideStep3Title: string;
  guideStep3Desc: string;
  guideStep3Highlights: string[];
  guideStep4Tab: string;
  guideStep4Title: string;
  guideStep4Desc: string;
  guideStep4Highlights: string[];
  // Auth
  authSignInTab: string;
  authSignUpTab: string;
  authRecoveryTab: string;
  authModalTitle: string;
  authModalSubtitle: string;
  authEmailLabel: string;
  authEmailPlaceholder: string;
  authPasswordLabel: string;
  authPasswordPlaceholder: string;
  authNameLabel: string;
  authNamePlaceholder: string;
  authSignInBtn: string;
  authSignUpBtn: string;
  authRecoveryBtn: string;
  authContinueWithGoogle: string;
  authContinueWithGithub: string;
  authDontHaveAccount: string;
  authAlreadyHaveAccount: string;
  authForgotPasswordLink: string;
  authBackToSignIn: string;
  authSignOutBtn: string;
  authCloudSaveBtn: string;
  authCloudSyncing: string;
  authCloudSynced: string;
  authCloudSyncError: string;
  authGuestNotice: string;
  authDemoModeBadge: string;
  authRecoverySuccess: string;
  authConfirmationEmailNotice: string;
  authSignInTitle: string;
  authSignedInAs: string;
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
    // Guide / How It Works
    howItWorksBtn: "Cómo funciona",
    howItWorksTitle: "Guía Interactiva de Mind Diary",
    howItWorksSubtitle:
      "Aprende a capturar ideas, organizar ramas visuales e impulsar tu creatividad con IA.",
    backToCanvasBtn: "← Volver al Lienzo",
    viewFullGuideBtn: "Ver Guía Completa →",
    stepLabel: "Paso",
    prevStepBtn: "Anterior",
    nextStepBtn: "Siguiente",
    closeGuideBtn: "Entendido, ir al lienzo",
    guideStep1Tab: "Lienzo & Ramas",
    guideStep1Title: "Lienzo Infinito y Colorimetría Jerárquica",
    guideStep1Desc:
      "Organiza pensamientos en un lienzo interactivo libre. Conecta ideas arrastrando desde los puntos laterales y observa cómo las ramas heredan armónicamente el color del tema principal.",
    guideStep1Highlights: [
      "Arrastra los handles laterales para crear conexiones dirigidas estilo MindNode.",
      "Usa la paleta en la cabecera para cambiar el color de una rama y sus derivadas.",
      "Edita el título o contenido al instante con un solo clic sobre el texto.",
    ],
    guideStep2Tab: "Captura & Voz",
    guideStep2Title: "Captura Rápida Instantánea y Dictado",
    guideStep2Desc:
      "Captura pensamientos sin fricción. Pulsa Ctrl+K o toca el botón flotante '+' en tu celular para crear una idea en el centro de tu pantalla.",
    guideStep2Highlights: [
      "Sintaxis rápida: escribe 'Título: Contenido #etiqueta' y presiona Enter.",
      "Micrófono en vivo: dicta por voz con transcripción automática en tu idioma.",
      "Atajo global Ctrl+K (o Cmd+K en Mac) disponible en cualquier momento.",
    ],
    guideStep3Tab: "Asistente IA",
    guideStep3Title: "Desbloqueo Creativo y Cámara Visual IA",
    guideStep3Desc:
      "Supera el bloqueo mental con el asistente integrado. Desglosa conceptos en sub-ideas, descubre ángulos contrarios o toma una foto para extraer ideas clave.",
    guideStep3Highlights: [
      "✨ Desglosar sub-ideas: despliega de 3 a 4 pasos lógicos organizados en abanico.",
      "🎯 Anti-bloqueo: genera preguntas provocadoras y perspectivas inversas.",
      "📸 Referencias con Cámara: adjunta fotos y pulsa 'Analizar con IA'.",
    ],
    guideStep4Tab: "Zen & Exportar",
    guideStep4Title: "Modo Flujo Zen y Respaldo Multiplataforma",
    guideStep4Desc:
      "Entra en concentración profunda ocultando la interfaz con Shift+Z. Cuando termines, exporta a tus herramientas favoritas o guarda una copia de seguridad.",
    guideStep4Highlights: [
      "Modo Zen (Shift+Z): oculta barras y controles para trabajar sin distracciones.",
      "Exportación Markdown: descarga tu mapa estructurado listo para Notion u Obsidian.",
      "Backup JSON completo: guarda y restaura lienzos enteros en cualquier dispositivo.",
    ],
    // Auth
    authSignInTab: "Iniciar Sesión",
    authSignUpTab: "Crear Cuenta",
    authRecoveryTab: "Recuperar",
    authModalTitle: "Tu Cuenta en Mind Diary",
    authModalSubtitle: "Accede para sincronizar tus tableros en la nube en cualquier dispositivo.",
    authEmailLabel: "Correo Electrónico",
    authEmailPlaceholder: "nombre@ejemplo.com",
    authPasswordLabel: "Contraseña",
    authPasswordPlaceholder: "••••••••",
    authNameLabel: "Nombre Completo",
    authNamePlaceholder: "Alex Rivera",
    authSignInBtn: "Iniciar Sesión",
    authSignUpBtn: "Crear Cuenta",
    authRecoveryBtn: "Enviar Enlace de Recuperación",
    authContinueWithGoogle: "Continuar con Google",
    authContinueWithGithub: "Continuar con GitHub",
    authDontHaveAccount: "¿No tienes una cuenta?",
    authAlreadyHaveAccount: "¿Ya tienes cuenta?",
    authForgotPasswordLink: "¿Olvidaste tu contraseña?",
    authBackToSignIn: "Volver a Iniciar Sesión",
    authSignOutBtn: "Cerrar Sesión",
    authCloudSaveBtn: "Sincronizar en la Nube",
    authCloudSyncing: "Sincronizando...",
    authCloudSynced: "¡Tablero respaldado en la nube!",
    authCloudSyncError: "Error al sincronizar con la nube",
    authGuestNotice: "Modo Invitado activo: tus cambios se guardan localmente en este navegador.",
    authDemoModeBadge: "Modo Demo Supabase",
    authRecoverySuccess: "¡Enlace enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.",
    authConfirmationEmailNotice: "¡Cuenta creada! Revisa tu correo electrónico para confirmar tu registro.",
    authSignInTitle: "Acceso / Perfil",
    authSignedInAs: "Conectado como",
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
    // Guide / How It Works
    howItWorksBtn: "How it works",
    howItWorksTitle: "Mind Diary Interactive Guide",
    howItWorksSubtitle:
      "Master fast idea capture, hierarchical branch mapping, and AI-powered brainstorming.",
    backToCanvasBtn: "← Back to Canvas",
    viewFullGuideBtn: "View Full Guide →",
    stepLabel: "Step",
    prevStepBtn: "Previous",
    nextStepBtn: "Next",
    closeGuideBtn: "Got it, back to canvas",
    guideStep1Tab: "Canvas & Branches",
    guideStep1Title: "Infinite Canvas & Hierarchical Colorimetry",
    guideStep1Desc:
      "Map out ideas freely in an interactive workspace. Connect thoughts by dragging side handles and watch child branches inherit parent theme colors.",
    guideStep1Highlights: [
      "Drag connection handles to build directional MindNode-style branches.",
      "Pick a branch color from the card header to re-theme the entire sub-tree.",
      "Click or double-click any title or description for instant inline editing.",
    ],
    guideStep2Tab: "Capture & Voice",
    guideStep2Title: "Quick Capture & Voice Dictation",
    guideStep2Desc:
      "Capture thoughts at lightspeed. Hit Ctrl+K or tap the '+' floating button on your phone to drop an idea right in the center of your view.",
    guideStep2Highlights: [
      "Quick syntax: type 'Title: Description #tag' and hit Enter.",
      "Live microphone: dictate notes with real-time speech-to-text in your language.",
      "Global Ctrl+K (or Cmd+K on Mac) accessible from anywhere.",
    ],
    guideStep3Tab: "AI Assistant",
    guideStep3Title: "Creative Unblocking & Camera Visual AI",
    guideStep3Desc:
      "Beat writer's block with the built-in AI assistant. Break ideas down into logical sub-steps, explore contrarian views, or analyze camera photos.",
    guideStep3Highlights: [
      "✨ Break down sub-ideas: spawns 3 to 4 fanned-out sub-ideas automatically.",
      "🎯 Anti-block: suggests provocative questions and inverted perspectives.",
      "📸 Camera Reference: attach photos and tap 'Analyze with AI'.",
    ],
    guideStep4Tab: "Zen & Export",
    guideStep4Title: "Zen Flow Mode & Multi-Platform Export",
    guideStep4Desc:
      "Enter deep flow by toggling Shift+Z to hide all interface distractions. Export your work directly to Obsidian/Notion or take complete JSON backups.",
    guideStep4Highlights: [
      "Zen Mode (Shift+Z): hides toolbars and controls for pure focus.",
      "Markdown export: clean hierarchical document ready for Notion or Obsidian.",
      "Full JSON backup: save and restore your entire map on any device.",
    ],
    // Auth
    authSignInTab: "Sign In",
    authSignUpTab: "Create Account",
    authRecoveryTab: "Recover",
    authModalTitle: "Your Mind Diary Account",
    authModalSubtitle: "Sign in to synchronize your mental boards to the cloud across devices.",
    authEmailLabel: "Email Address",
    authEmailPlaceholder: "name@example.com",
    authPasswordLabel: "Password",
    authPasswordPlaceholder: "••••••••",
    authNameLabel: "Full Name",
    authNamePlaceholder: "Alex Rivera",
    authSignInBtn: "Sign In",
    authSignUpBtn: "Create Account",
    authRecoveryBtn: "Send Recovery Link",
    authContinueWithGoogle: "Continue with Google",
    authContinueWithGithub: "Continue with GitHub",
    authDontHaveAccount: "Don't have an account?",
    authAlreadyHaveAccount: "Already have an account?",
    authForgotPasswordLink: "Forgot your password?",
    authBackToSignIn: "Back to Sign In",
    authSignOutBtn: "Sign Out",
    authCloudSaveBtn: "Sync to Cloud",
    authCloudSyncing: "Syncing...",
    authCloudSynced: "Board safely backed up to cloud!",
    authCloudSyncError: "Error syncing with cloud",
    authGuestNotice: "Guest Mode active: your boards are stored locally in this browser.",
    authDemoModeBadge: "Supabase Demo Mode",
    authRecoverySuccess: "Link sent! Check your inbox to reset your password.",
    authConfirmationEmailNotice: "Account created! Check your email to confirm registration.",
    authSignInTitle: "Sign In / Profile",
    authSignedInAs: "Signed in as",
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
    // Guide / How It Works
    howItWorksBtn: "Comment ça marche",
    howItWorksTitle: "Guide Interactif de Mind Diary",
    howItWorksSubtitle:
      "Apprenez à structurer vos idées, organiser vos branches et stimuler votre créativité avec l'IA.",
    backToCanvasBtn: "← Retour au Canevas",
    viewFullGuideBtn: "Voir le Guide Complet →",
    stepLabel: "Étape",
    prevStepBtn: "Précédent",
    nextStepBtn: "Suivant",
    closeGuideBtn: "Compris, aller au canevas",
    guideStep1Tab: "Canevas & Branches",
    guideStep1Title: "Canevas Infini et Colorimétrie Hiérarchique",
    guideStep1Desc:
      "Structurez vos pensées sur un espace interactif fluide. Reliez les nœuds et observez les sous-branches hériter harmonieusement de la couleur du thème.",
    guideStep1Highlights: [
      "Tirez les poignées latérales pour créer des liaisons style MindNode.",
      "Changez la couleur d'une branche directement depuis l'en-tête de la carte.",
      "Modifiez instantanément un titre ou une note d'un simple clic sur le texte.",
    ],
    guideStep2Tab: "Capture & Voix",
    guideStep2Title: "Capture Éclair et Dictée Vocale",
    guideStep2Desc:
      "Capturez vos intuitions sans friction. Utilisez Ctrl+K ou le bouton '+' sur mobile pour poser une idée au centre de l'écran.",
    guideStep2Highlights: [
      "Syntaxe rapide : écrivez 'Titre : Note #tag' et tapez Entrée.",
      "Microphone direct : dictez vos pensées avec transcription en temps réel.",
      "Raccourci universel Ctrl+K (ou Cmd+K sur Mac) toujours disponible.",
    ],
    guideStep3Tab: "Assistant IA",
    guideStep3Title: "Déblocage Créatif et Caméra Visuelle IA",
    guideStep3Desc:
      "Dépassez la page blanche grâce à l'IA. Décomposez une idée en sous-étapes, explorez des angles opposés ou prenez une photo pour en extraire l'essence.",
    guideStep3Highlights: [
      "✨ Décomposer en sous-idées : génère 3 à 4 étapes disposées en éventail.",
      "🎯 Anti-blocage : propose des questions stimulantes et des perspectives inverses.",
      "📸 Référence Visuelle : joignez des photos et cliquez sur 'Analyser avec l'IA'.",
    ],
    guideStep4Tab: "Zen & Export",
    guideStep4Title: "Mode Zen Fluide et Sauvegarde Complète",
    guideStep4Desc:
      "Isolez-vous des distractions avec Shift+Z. Exportez vos travaux vers Notion ou Obsidian ou emportez une sauvegarde JSON intégrale.",
    guideStep4Highlights: [
      "Mode Zen (Shift+Z) : masque barres et commandes pour une concentration pure.",
      "Export Markdown : document hiérarchisé prêt pour Notion ou Obsidian.",
      "Backup JSON complet : sauvegardez et restaurez vos cartes sur n'importe quel appareil.",
    ],
    // Auth
    authSignInTab: "Connexion",
    authSignUpTab: "Inscription",
    authRecoveryTab: "Récupérer",
    authModalTitle: "Votre Compte Mind Diary",
    authModalSubtitle: "Connectez-vous pour synchroniser vos tableaux dans le cloud sur tous vos appareils.",
    authEmailLabel: "Adresse Email",
    authEmailPlaceholder: "nom@exemple.com",
    authPasswordLabel: "Mot de passe",
    authPasswordPlaceholder: "••••••••",
    authNameLabel: "Nom Complet",
    authNamePlaceholder: "Alex Rivera",
    authSignInBtn: "Se Connecter",
    authSignUpBtn: "Créer un Compte",
    authRecoveryBtn: "Envoyer le Lien de Récupération",
    authContinueWithGoogle: "Continuer avec Google",
    authContinueWithGithub: "Continuer avec GitHub",
    authDontHaveAccount: "Pas encore de compte ?",
    authAlreadyHaveAccount: "Vous avez déjà un compte ?",
    authForgotPasswordLink: "Mot de passe oublié ?",
    authBackToSignIn: "Retour à la Connexion",
    authSignOutBtn: "Déconnexion",
    authCloudSaveBtn: "Synchroniser dans le Cloud",
    authCloudSyncing: "Synchronisation...",
    authCloudSynced: "Tableau sauvegardé dans le cloud !",
    authCloudSyncError: "Erreur de synchronisation cloud",
    authGuestNotice: "Mode Invité actif : vos cartes sont enregistrées localement dans ce navigateur.",
    authDemoModeBadge: "Mode Démo Supabase",
    authRecoverySuccess: "Lien envoyé ! Consultez votre boîte de réception pour réinitialiser votre mot de passe.",
    authConfirmationEmailNotice: "Compte créé ! Vérifiez vos e-mails pour confirmer votre inscription.",
    authSignInTitle: "Connexion / Profil",
    authSignedInAs: "Connecté en tant que",
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
    // Guide / How It Works
    howItWorksBtn: "Como funciona",
    howItWorksTitle: "Guia Interativo do Mind Diary",
    howItWorksSubtitle:
      "Descubra como estruturar pensamentos, criar ramos visuais e acelerar projetos com IA.",
    backToCanvasBtn: "← Voltar à Tela",
    viewFullGuideBtn: "Ver Guia Completo →",
    stepLabel: "Passo",
    prevStepBtn: "Anterior",
    nextStepBtn: "Próximo",
    closeGuideBtn: "Entendido, ir ao mapa",
    guideStep1Tab: "Tela & Ramos",
    guideStep1Title: "Tela Infinita e Colorimetria Hierárquica",
    guideStep1Desc:
      "Conecte conceitos livremente. Puxe os pontos laterais e veja as novas sub-ideias herdarem a cor temática do ramo principal.",
    guideStep1Highlights: [
      "Arraste as conexões para criar ramos direcionais estilo MindNode.",
      "Altere a paleta no cabeçalho do cartão para redefinir a cor do ramo.",
      "Edite o título ou conteúdo com um toque rápido sobre o texto.",
    ],
    guideStep2Tab: "Captura & Voz",
    guideStep2Title: "Captura Rápida e Ditado por Voz",
    guideStep2Desc:
      "Capture pensamentos sem perder o ritmo. Use Ctrl+K no teclado ou o botão '+' no celular para soltar ideias no centro da vista.",
    guideStep2Highlights: [
      "Sintaxe rápida: escreva 'Título: Conteúdo #tag' e pressione Enter.",
      "Microfone ao vivo: dite por voz com transcrição imediata em português.",
      "Atalho Ctrl+K (ou Cmd+K no Mac) acessível de qualquer ponto.",
    ],
    guideStep3Tab: "Assistente IA",
    guideStep3Title: "Desbloqueio Criativo e Câmera Visual IA",
    guideStep3Desc:
      "Vença qualquer bloqueio com o assistente inteligente. Desdobre passos práticos, questione pressupostos ou tire uma foto para gerar insights.",
    guideStep3Highlights: [
      "✨ Desdobrar sub-ideias: cria de 3 a 4 ideias conectadas em leque.",
      "🎯 Anti-bloqueio: gera perguntas provocativas e perspectivas opostas.",
      "📸 Câmera & Fotos: anexe imagens e toque em 'Analisar com IA'.",
    ],
    guideStep4Tab: "Zen & Exportar",
    guideStep4Title: "Modo Foco Zen e Backup Multiplataforma",
    guideStep4Desc:
      "Elimine distrações com o atalho Shift+Z. Quando estiver pronto, exporte para o Notion/Obsidian ou faça backup em JSON.",
    guideStep4Highlights: [
      "Modo Zen (Shift+Z): esconde menus e botões para foco absoluto.",
      "Exportação Markdown: arquivo pronto para documentação e Obsidian.",
      "Backup JSON completo: salve e recupere seus mapas em qualquer dispositivo.",
    ],
    // Auth
    authSignInTab: "Entrar",
    authSignUpTab: "Criar Conta",
    authRecoveryTab: "Recuperar",
    authModalTitle: "Sua Conta no Mind Diary",
    authModalSubtitle: "Entre para sincronizar seus mapas mentais na nuvem em qualquer dispositivo.",
    authEmailLabel: "E-mail",
    authEmailPlaceholder: "nome@exemplo.com",
    authPasswordLabel: "Senha",
    authPasswordPlaceholder: "••••••••",
    authNameLabel: "Nome Completo",
    authNamePlaceholder: "Alex Rivera",
    authSignInBtn: "Entrar",
    authSignUpBtn: "Criar Conta",
    authRecoveryBtn: "Enviar Link de Recuperação",
    authContinueWithGoogle: "Continuar com o Google",
    authContinueWithGithub: "Continuar com o GitHub",
    authDontHaveAccount: "Não tem uma conta?",
    authAlreadyHaveAccount: "Já tem uma conta?",
    authForgotPasswordLink: "Esqueceu sua senha?",
    authBackToSignIn: "Voltar para o Login",
    authSignOutBtn: "Sair da Conta",
    authCloudSaveBtn: "Sincronizar na Nuvem",
    authCloudSyncing: "Sincronizando...",
    authCloudSynced: "Mapa salvo na nuvem com segurança!",
    authCloudSyncError: "Erro ao sincronizar com a nuvem",
    authGuestNotice: "Modo Convidado ativo: seus dados ficam salvos localmente neste navegador.",
    authDemoModeBadge: "Modo Demo Supabase",
    authRecoverySuccess: "Link enviado! Verifique seu e-mail para redefinir a senha.",
    authConfirmationEmailNotice: "Conta criada! Verifique seu e-mail para confirmar seu cadastro.",
    authSignInTitle: "Entrar / Perfil",
    authSignedInAs: "Conectado como",
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
    // Guide / How It Works
    howItWorksBtn: "Wie es funktioniert",
    howItWorksTitle: "Interaktive Mind Diary Anleitung",
    howItWorksSubtitle:
      "Ideen blitzschnell erfassen, visuelle Zweige aufbauen und Projekte mit KI beschleunigen.",
    backToCanvasBtn: "← Zurück zur Leinwand",
    viewFullGuideBtn: "Vollständige Anleitung →",
    stepLabel: "Schritt",
    prevStepBtn: "Zurück",
    nextStepBtn: "Weiter",
    closeGuideBtn: "Verstanden, zur Leinwand",
    guideStep1Tab: "Leinwand & Zweige",
    guideStep1Title: "Unendliche Leinwand & Hierarchische Farbgebung",
    guideStep1Desc:
      "Gedanken frei und flüssig strukturieren. Durch Ziehen der seitlichen Punkte verbinden sich Ideen und übernehmen automatisch die Farbe des Hauptzweigs.",
    guideStep1Highlights: [
      "Seitliche Punkte ziehen, um MindNode-artige Zweige zu erstellen.",
      "Themenfarbe in der Kopfzeile wählen, um den gesamten Teilbaum einzufärben.",
      "Titel und Notizen per Klick direkt im Knoten bearbeiten.",
    ],
    guideStep2Tab: "Erfassung & Stimme",
    guideStep2Title: "Schnellerfassung & Spracheingabe",
    guideStep2Desc:
      "Blitzschnell Ideen festhalten. Strg+K auf der Tastatur oder '+' auf dem Smartphone platziert die Idee direkt in der Mitte der Ansicht.",
    guideStep2Highlights: [
      "Schnellsyntax: 'Titel: Notiz #tag' tippen und Enter drücken.",
      "Echtzeit-Spracheingabe: direkt ins Textfeld diktieren.",
      "Universeller Shortcut Strg+K (oder Cmd+K auf dem Mac) überall verfügbar.",
    ],
    guideStep3Tab: "KI-Assistent",
    guideStep3Title: "Kreative Blockaden lösen & Foto-KI",
    guideStep3Desc:
      "Gedankliche Hürden mit der integrierten KI überwinden. Ideen fächerförmig aufschlüsseln, Gegenthesen prüfen oder Fotos analysieren.",
    guideStep3Highlights: [
      "✨ Teilideen aufschlüsseln: erstellt 3 bis 4 logische Teilschritte im Fächer.",
      "🎯 Blockade-Löser: liefert provozierende Fragen und umgekehrte Blickwinkel.",
      "📸 Kamera & Bildreferenzen: Fotos anhängen und 'Mit KI analysieren' wählen.",
    ],
    guideStep4Tab: "Zen & Export",
    guideStep4Title: "Zen-Fokusmodus & Universeller Export",
    guideStep4Desc:
      "Tastenkombination Umschalt+Z blendet alle Menüs für ungestörtes Denken aus. Anschließend als Markdown oder vollständiges JSON exportieren.",
    guideStep4Highlights: [
      "Zen-Modus (Umschalt+Z): blendet die Oberfläche für absoluten Fokus aus.",
      "Markdown-Export: hierarchisches Dokument für Notion oder Obsidian.",
      "Vollständiges JSON-Backup: sichern und wiederherstellen auf jedem Gerät.",
    ],
    // Auth
    authSignInTab: "Anmelden",
    authSignUpTab: "Konto erstellen",
    authRecoveryTab: "Wiederherstellen",
    authModalTitle: "Dein Mind Diary Konto",
    authModalSubtitle: "Melde dich an, um Mindmaps geräteübergreifend in der Cloud zu synchronisieren.",
    authEmailLabel: "E-Mail-Adresse",
    authEmailPlaceholder: "name@beispiel.de",
    authPasswordLabel: "Passwort",
    authPasswordPlaceholder: "••••••••",
    authNameLabel: "Vollständiger Name",
    authNamePlaceholder: "Alex Rivera",
    authSignInBtn: "Anmelden",
    authSignUpBtn: "Konto erstellen",
    authRecoveryBtn: "Wiederherstellungslink senden",
    authContinueWithGoogle: "Weiter mit Google",
    authContinueWithGithub: "Weiter mit GitHub",
    authDontHaveAccount: "Noch kein Konto?",
    authAlreadyHaveAccount: "Bereits registriert?",
    authForgotPasswordLink: "Passwort vergessen?",
    authBackToSignIn: "Zurück zur Anmeldung",
    authSignOutBtn: "Abmelden",
    authCloudSaveBtn: "In Cloud synchronisieren",
    authCloudSyncing: "Synchronisieren...",
    authCloudSynced: "Mindmap sicher in der Cloud gespeichert!",
    authCloudSyncError: "Fehler beim Cloud-Abgleich",
    authGuestNotice: "Gast-Modus aktiv: Deine Mindmaps werden lokal in diesem Browser gespeichert.",
    authDemoModeBadge: "Supabase Demo-Modus",
    authRecoverySuccess: "Link gesendet! Überprüfe dein Postfach, um das Passwort zurückzusetzen.",
    authConfirmationEmailNotice: "Konto erstellt! Bestätige deine E-Mail, um die Registrierung abzuschließen.",
    authSignInTitle: "Anmeldung / Profil",
    authSignedInAs: "Angemeldet als",
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
