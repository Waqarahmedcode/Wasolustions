"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Custom cursor for fine pointers only. A small dot follows instantly and a
 * ring lags behind on a spring. Interactive elements expand the ring.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const enabled = fine && !reduced;
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [data-cursor]",
      );
      setHovering(Boolean(target));
      setLabel(target?.dataset.cursor ?? null);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] h-1.5 w-1.5 rounded-full bg-snow mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] flex items-center justify-center rounded-full border border-snow/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 88 : hovering ? 52 : 34,
          height: label ? 88 : hovering ? 52 : 34,
          backgroundColor: label ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
