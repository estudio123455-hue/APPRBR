import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-xs shadow-blue-600/10",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-3.5 py-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
