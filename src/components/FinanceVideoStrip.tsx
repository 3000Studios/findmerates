import React from "react";
import { cn } from "../lib/utils";

import financialRatesVideo from "./video/financial rates.mp4";
import cashCalcVideo from "./video/cash calc.mp4";

export default function FinanceVideoStrip({
  className,
  variant = "rates",
}: {
  className?: string;
  variant?: "rates" | "cash";
}) {
  const src = variant === "cash" ? cashCalcVideo : financialRatesVideo;
  return (
    <div className={cn("relative overflow-hidden rounded-[28px]", className)}>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 via-brand-900/65 to-transparent" />
      <div className="absolute inset-0 opacity-70 bg-[linear-gradient(90deg,rgba(245,176,42,0.22)_0%,rgba(10,180,214,0.18)_40%,rgba(24,214,123,0.14)_100%)]" />
      <div className="relative p-8">
        <p className="section-kicker text-white/80">Live finance visuals</p>
        <h2 className="mt-2 text-2xl font-display font-bold text-white">
          See the market in motion
        </h2>
        <p className="mt-3 max-w-xl text-sm text-white/75">
          Rates update frequently. Use these comparisons as a starting point, then
          confirm terms and fees directly with the lender.
        </p>
      </div>
    </div>
  );
}

