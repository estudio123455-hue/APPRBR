"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Connection,
  IdeaNode,
  MindDiaryFlowEdge,
  MindDiaryFlowNode,
  MindDiaryPersistedState,
} from "@/types";
import { fromFlowEdge, fromFlowNode } from "./flow-utils";

export const MIND_DIARY_STORAGE_KEY = "mind_diary_state";
const AUTO_SAVE_DEBOUNCE_MS = 1000;

export type SaveStatus = "idle" | "saving" | "saved";

interface UseAutoSaveOptions {
  nodes: MindDiaryFlowNode[];
  edges: MindDiaryFlowEdge[];
  onLoadSavedState: (data: {
    nodes: IdeaNode[];
    connections: Connection[];
  }) => void;
}

/**
 * Hook de persistencia automática con debounce de 1 segundo en localStorage ('mind_diary_state').
 * Protegido contra problemas de hidratación SSR en Next.js: solo accede a window/localStorage tras el montaje.
 */
export function useAutoSave({
  nodes,
  edges,
  onLoadSavedState,
}: UseAutoSaveOptions) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const isInitialMountRef = useRef(true);
  const onLoadRef = useRef(onLoadSavedState);

  useEffect(() => {
    onLoadRef.current = onLoadSavedState;
  }, [onLoadSavedState]);

  // 1. Hidratación segura en cliente tras el montaje inicial
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(MIND_DIARY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<MindDiaryPersistedState>;
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.connections)) {
          onLoadRef.current({
            nodes: parsed.nodes,
            connections: parsed.connections,
          });
        }
      }
    } catch (error) {
      console.warn("No se pudo leer mind_diary_state de localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Guardado automático con debounce de 1000ms ante cambios en nodos o conexiones
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("saving");

    const timer = window.setTimeout(() => {
      try {
        const payload: MindDiaryPersistedState = {
          nodes: nodes.map(fromFlowNode),
          connections: edges.map(fromFlowEdge),
          updatedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(
          MIND_DIARY_STORAGE_KEY,
          JSON.stringify(payload)
        );
        setSaveStatus("saved");
      } catch (error) {
        console.warn(
          "No se pudo guardar mind_diary_state en localStorage:",
          error
        );
      }
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [nodes, edges, isHydrated]);

  const clearSavedState = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(MIND_DIARY_STORAGE_KEY);
      setSaveStatus("saved");
    } catch (error) {
      console.warn("Error limpiando mind_diary_state:", error);
    }
  }, []);

  return {
    isHydrated,
    saveStatus,
    clearSavedState,
  };
}
