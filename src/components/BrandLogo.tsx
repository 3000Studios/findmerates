import React from "react";
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
  return (
    <span
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg shadow-brand-900/25",
        className,
      )}
    >
      <span className="absolute inset-0 rounded-2xl border border-white/10" />
      <svg
        width="28"
        height="28"
        viewBox="0 0 56 56"
        aria-hidden="true"
        className={cn(
          "relative z-10",
          variant === "pulse" && "animate-pulse",
          variant === "stack" && "rotate-[-2deg]",
        )}
      >
        <defs>
          <linearGradient id="fmrGradA" x1="8" y1="10" x2="48" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ab4d6" />
            <stop offset="0.55" stopColor="#18d67b" />
            <stop offset="1" stopColor="#f5b02a" />
          </linearGradient>
          <linearGradient id="fmrGradB" x1="10" y1="48" x2="46" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#18d67b" />
            <stop offset="0.55" stopColor="#0ab4d6" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* outer ring */}
        <circle cx="28" cy="28" r="22" fill="none" stroke="url(#fmrGradA)" strokeWidth="5" opacity="0.92" />
        {/* ring breaks */}
        <path d="M28 6a22 22 0 0 1 20.3 13" fill="none" stroke="#06162e" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <path d="M7.8 32.5A22 22 0 0 1 14 14" fill="none" stroke="#06162e" strokeWidth="7" strokeLinecap="round" opacity="0.8" />

        {/* arrow + bars (wireframe-ish) */}
        <path
          d="M18 30h10.5l-4.2 4.2 3.2 3.2 9.5-9.5-9.5-9.5-3.2 3.2 4.2 4.2H18z"
          fill="url(#fmrGradB)"
          opacity="0.96"
        />
        <path d="M18 34h12" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 22h12" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 28h10" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
