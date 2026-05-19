import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { searchMixedMedia, type MediaItem } from "../lib/media";
import { cn } from "../lib/utils";

type Props = {
  query: string;
  perPage?: number;
  rotateMs?: number;
  aspect?: "video" | "wide" | "square";
  heading?: string;
  kicker?: string;
  description?: string;
  className?: string;
};

const aspectClass: Record<NonNullable<Props["aspect"]>, string> = {
  video: "aspect-video",
  wide: "aspect-[21/9]",
  square: "aspect-square",
};

export default function MediaGallery({
  query,
  perPage = 8,
  rotateMs = 5200,
  aspect = "video",
  heading,
  kicker,
  description,
  className,
}: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapRef.current) return;
    const el = wrapRef.current;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    (async () => {
      const res = await searchMixedMedia(query, perPage);
      if (!cancelled) setItems(res);
    })();
    return () => {
      cancelled = true;
    };
  }, [inView, query, perPage]);

  useEffect(() => {
    if (items.length < 2) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, rotateMs);
    return () => window.clearInterval(t);
  }, [items.length, rotateMs]);

  if (inView && items.length === 0) {
    // API down / no key — render nothing rather than a broken UI.
    return <div ref={wrapRef} aria-hidden="true" />;
  }

  const current = items[index];
  const next = items[(index + 1) % Math.max(items.length, 1)];
  const after = items[(index + 2) % Math.max(items.length, 1)];

  return (
    <section
      ref={wrapRef}
      className={cn(
        "relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-brand-900/80",
        className,
      )}
    >
      {(kicker || heading || description) && (
        <div className="relative z-20 flex flex-col gap-2 px-6 pt-6 sm:px-8 sm:pt-8">
          {kicker && (
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold">
              {kicker}
            </span>
          )}
          {heading && (
            <h2 className="text-2xl font-display font-bold text-white sm:text-3xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-white/70">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={cn("relative mt-6 grid gap-2 px-6 pb-6 sm:px-8 sm:pb-8 md:grid-cols-3")}>
        <div className={cn("relative overflow-hidden rounded-2xl md:col-span-2", aspectClass[aspect])}>
          <AnimatePresence mode="wait">
            {current && (
              <motion.img
                key={current.id}
                src={current.url}
                alt={current.alt}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent" />
          {current && (
            <a
              href={current.credit.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium text-white/90 backdrop-blur hover:bg-black/80"
            >
              Photo by{" "}
              <span className="underline-offset-2 hover:underline">{current.credit.name}</span>{" "}
              on {current.credit.sourceName}
            </a>
          )}
        </div>
        <div className="grid grid-rows-2 gap-2">
          {[next, after].map((m, i) =>
            m ? (
              <div
                key={`${m.id}-${i}`}
                className={cn("relative overflow-hidden rounded-2xl", "aspect-video md:aspect-auto")}
              >
                <img
                  src={m.thumb}
                  alt={m.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                />
                <a
                  href={m.credit.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="absolute bottom-1.5 right-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[9px] text-white/90 backdrop-blur hover:bg-black/80"
                >
                  {m.credit.name} · {m.credit.sourceName}
                </a>
              </div>
            ) : null,
          )}
        </div>
      </div>

      {items.length > 1 && (
        <div className="absolute bottom-3 left-6 z-20 flex gap-1 sm:left-8">
          {items.slice(0, Math.min(items.length, 8)).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all",
                i === index ? "w-6 bg-accent-gold" : "w-2 bg-white/30",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
