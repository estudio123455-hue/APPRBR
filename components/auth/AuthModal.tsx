"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useAuth, type AuthTab } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signInWithOAuth,
    isConfigured,
  } = useAuth();

  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleTabChange = (tab: AuthTab) => {
    setAuthModalTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !email.includes("@")) {
      setErrorMessage("Por favor ingresa un correo válido.");
      return;
    }

    if (authModalTab !== "recovery" && password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (authModalTab === "login") {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          closeAuthModal();
        }
      } else if (authModalTab === "signup") {
        const { error, requiresEmailConfirmation } = await signUpWithEmail(
          email,
          password,
          name
        );
        if (error) {
          setErrorMessage(error.message);
        } else {
          if (requiresEmailConfirmation) {
            setSuccessMessage(t.authConfirmationEmailNotice);
          } else {
            closeAuthModal();
          }
        }
      } else if (authModalTab === "recovery") {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(t.authRecoverySuccess);
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error inesperado al autenticar"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    setErrorMessage(null);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setErrorMessage(error.message);
      } else {
        closeAuthModal();
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error de proveedor OAuth"
      );
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                MD
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {t.authModalTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              {t.authModalSubtitle}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Demo / Guest mode banner if not connected to live Supabase */}
        {!isConfigured && (
          <div className="px-6 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-amber-800 text-xs">
            <Sparkles size={14} className="text-amber-500 shrink-0" />
            <span className="leading-tight">
              {t.authGuestNotice}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
          <button
            type="button"
            onClick={() => handleTabChange("login")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === "login"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.authSignInTab}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("signup")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === "signup"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.authSignUpTab}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("recovery")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === "recovery"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.authRecoveryTab}
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Social login buttons (only on login and signup) */}
          {authModalTab !== "recovery" && (
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={loading || Boolean(oauthLoading)}
                className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {oauthLoading === "google" ? (
                  <Loader2 size={15} className="animate-spin text-slate-400" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{t.authContinueWithGoogle}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider absolute">
                  o con correo
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name field (Signup only) */}
            {authModalTab === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.authNameLabel}
                </label>
                <div className="relative">
                  <UserIcon
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.authNamePlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.authEmailLabel}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.authEmailPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Password field (Login & Signup) */}
            {authModalTab !== "recovery" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {t.authPasswordLabel}
                  </label>
                  {authModalTab === "login" && (
                    <button
                      type="button"
                      onClick={() => handleTabChange("recovery")}
                      className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                    >
                      {t.authForgotPasswordLink}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.authPasswordPlaceholder}
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              <span>
                {authModalTab === "login"
                  ? t.authSignInBtn
                  : authModalTab === "signup"
                  ? t.authSignUpBtn
                  : t.authRecoveryBtn}
              </span>
            </button>
          </form>

          {/* Footer switches */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {authModalTab === "login" ? (
              <p>
                {t.authDontHaveAccount}{" "}
                <button
                  type="button"
                  onClick={() => handleTabChange("signup")}
                  className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                >
                  {t.authSignUpBtn}
                </button>
              </p>
            ) : authModalTab === "signup" ? (
              <p>
                {t.authAlreadyHaveAccount}{" "}
                <button
                  type="button"
                  onClick={() => handleTabChange("login")}
                  className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                >
                  {t.authSignInBtn}
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                {t.authBackToSignIn}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
