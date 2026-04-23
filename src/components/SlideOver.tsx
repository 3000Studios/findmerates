import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SlideOver({
  open,
  title,
  subtitle,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl border-l border-white/15 brand-glass text-white shadow-2xl"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            aria-modal="true"
            role="dialog"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-6">
                <div>
                  <div className="section-kicker text-brand-100">Compare now</div>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-2 text-sm leading-6 text-brand-50">{subtitle}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="button-secondary border-white/15 bg-white/5 text-white hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-auto px-6 py-6">{children}</div>
              {footer && (
                <div className="border-t border-white/10 px-6 py-5">{footer}</div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

