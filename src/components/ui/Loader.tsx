"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/content/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Short loading sequence: the logo draws itself, then the curtain lifts.
 * Skips entirely on reduced motion and never blocks longer than ~2.4s.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  const finish = useCallback(() => {
    setVisible(false);
    window.setTimeout(onDone, 500);
  }, [onDone]);

  useEffect(() => {
    if (reduced) {
      const id = window.setTimeout(finish, 0);
      return () => window.clearTimeout(id);
    }
    const failSafe = window.setTimeout(finish, 2600);
    return () => window.clearTimeout(failSafe);
  }, [reduced, finish]);

  const handleLogoComplete = useCallback(() => {
    window.setTimeout(finish, 250);
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="text-snow">
            <Logo className="h-14 w-14" animateIn={!reduced} onComplete={handleLogoComplete} />
          </div>
          <motion.span
            className="eyebrow mt-6"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {site.legalName}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
