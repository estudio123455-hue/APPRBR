"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./supabase";

export type AuthTab = "login" | "signup" | "recovery";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthTab;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: AuthTab) => void;
  signInWithEmail: (
    email: string,
    pass: string
  ) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    pass: string,
    name?: string
  ) => Promise<{ error: Error | null; requiresEmailConfirmation?: boolean }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  cloudSyncStatus: "idle" | "syncing" | "synced" | "error";
  syncToCloud: () => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = "mind_diary_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>("login");
  const [cloudSyncStatus, setCloudSyncStatus] = useState<
    "idle" | "syncing" | "synced" | "error"
  >("idle");

  useEffect(() => {
    let mounted = true;

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      // Demo / Guest mode fallback
      if (typeof window !== "undefined") {
        try {
          const storedDemoUser = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (storedDemoUser) {
            const parsed = JSON.parse(storedDemoUser) as User;
            setUser(parsed);
          }
        } catch {
          // ignore corrupted local storage
        }
      }
      setLoading(false);
      return () => {
        mounted = false;
      };
    }
  }, []);

  const openAuthModal = useCallback((tab: AuthTab = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, pass: string): Promise<{ error: Error | null }> => {
      if (!isSupabaseConfigured || !supabase) {
        // Demo mode login
        const demoUser: User = {
          id: "demo-user-id",
          app_metadata: {},
          user_metadata: {
            full_name: email.split("@")[0] || "Demo User",
            name: email.split("@")[0] || "Demo User",
          },
          aud: "authenticated",
          created_at: new Date().toISOString(),
          email: email.trim().toLowerCase(),
        } as unknown as User;

        if (typeof window !== "undefined") {
          localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
        }
        setUser(demoUser);
        return { error: null };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      return { error };
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (
      email: string,
      pass: string,
      name?: string
    ): Promise<{ error: Error | null; requiresEmailConfirmation?: boolean }> => {
      if (!isSupabaseConfigured || !supabase) {
        // Demo mode sign up
        const demoUser: User = {
          id: "demo-" + Date.now(),
          app_metadata: {},
          user_metadata: {
            full_name: name?.trim() || email.split("@")[0] || "Usuario Mind",
            name: name?.trim() || email.split("@")[0] || "Usuario Mind",
          },
          aud: "authenticated",
          created_at: new Date().toISOString(),
          email: email.trim().toLowerCase(),
        } as unknown as User;

        if (typeof window !== "undefined") {
          localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
        }
        setUser(demoUser);
        return { error: null, requiresEmailConfirmation: false };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: {
            full_name: name?.trim() || "",
            name: name?.trim() || "",
          },
        },
      });

      const requiresEmailConfirmation = Boolean(
        data.user && !data.session
      );

      return { error, requiresEmailConfirmation };
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: Error | null }> => {
      if (!isSupabaseConfigured || !supabase) {
        // Demo mode recovery simulation
        return { error: null };
      }

      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: redirectUrl,
        }
      );

      return { error };
    },
    []
  );

  const signInWithOAuth = useCallback(
    async (provider: "google" | "github"): Promise<{ error: Error | null }> => {
      if (!isSupabaseConfigured || !supabase) {
        // Demo mode OAuth login
        const demoUser: User = {
          id: `demo-${provider}-user`,
          app_metadata: { provider },
          user_metadata: {
            full_name: `${provider === "google" ? "Google" : "GitHub"} User`,
            name: `${provider === "google" ? "Google" : "GitHub"} User`,
            avatar_url: "",
          },
          aud: "authenticated",
          created_at: new Date().toISOString(),
          email: `${provider}.user@minddiary.app`,
        } as unknown as User;

        if (typeof window !== "undefined") {
          localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
        }
        setUser(demoUser);
        return { error: null };
      }

      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      return { error };
    },
    []
  );

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }
    }
    setUser(null);
    setSession(null);
  }, []);

  const syncToCloud = useCallback(async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    if (!user) {
      return { success: false, message: "No active user session" };
    }

    setCloudSyncStatus("syncing");

    try {
      // In guest/demo mode or without dedicated tables, simulate or save to user's scoped key
      if (typeof window !== "undefined") {
        const localCanvas = localStorage.getItem("mind_diary_ideas_v1");
        if (localCanvas) {
          localStorage.setItem(
            `mind_diary_cloud_${user.id}`,
            JSON.stringify({
              userId: user.id,
              email: user.email,
              lastSynced: new Date().toISOString(),
              data: JSON.parse(localCanvas),
            })
          );
        }
      }

      // If Supabase table 'user_mindmaps' exists in a full backend setup:
      if (isSupabaseConfigured && supabase) {
        try {
          const localCanvas =
            typeof window !== "undefined"
              ? localStorage.getItem("mind_diary_ideas_v1")
              : null;
          if (localCanvas) {
            await supabase.from("user_mindmaps").upsert({
              user_id: user.id,
              payload: JSON.parse(localCanvas),
              updated_at: new Date().toISOString(),
            });
          }
        } catch {
          // Table may not exist yet, local scoped storage backup already succeeded
        }
      }

      setCloudSyncStatus("synced");
      setTimeout(() => setCloudSyncStatus("idle"), 3000);
      return { success: true };
    } catch (err: unknown) {
      setCloudSyncStatus("error");
      setTimeout(() => setCloudSyncStatus("idle"), 3000);
      return {
        success: false,
        message: err instanceof Error ? err.message : "Sync error",
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signInWithOAuth,
        signOut,
        cloudSyncStatus,
        syncToCloud,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
