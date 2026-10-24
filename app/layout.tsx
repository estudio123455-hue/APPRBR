import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mind Diary — Organización de Ideas y Mapas Mentales",
  description:
    "Espacio minimalista moderno para organizar ideas, notas y mapas mentales interactivos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
