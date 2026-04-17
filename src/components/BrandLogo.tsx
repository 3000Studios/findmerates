import React from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";

type LogoVariant = "crest" | "pulse" | "stack";

export function nextLogoVariant(current: LogoVariant): LogoVariant {
  if (current === "crest") return "pulse";
  if (current === "pulse") return "stack";
  return "crest";
}

export default function BrandLogo({
  variant,
  className,
}: {
  variant: LogoVariant;
  className?: string;
}) {
  if (variant === "pulse") {
    return (
      <span
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg shadow-brand-900/20",
          className,
        )}
      >
        <span className="absolute h-6 w-6 rounded-full border border-brand-200/70 animate-pulse" />
        <TrendingUp className="h-5 w-5 relative z-10" />
      </span>
    );
  }

  if (variant === "stack") {
    return (
      <span
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg shadow-brand-900/20",
          className,
        )}
      >
        <span className="absolute bottom-2 left-2 h-1 w-2 rounded bg-accent-gold" />
        <span className="absolute bottom-2 left-5 h-2 w-2 rounded bg-emerald-400" />
        <span className="absolute bottom-2 left-8 h-3 w-1 rounded bg-brand-300" />
        <TrendingUp className="h-4 w-4 relative z-10" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg shadow-brand-900/20",
        className,
      )}
    >
      <span className="absolute inset-1 rounded-xl border border-brand-300/40" />
      <TrendingUp className="h-5 w-5 relative z-10" />
    </span>
  );
}
