"use client";

import { useEffect, useRef } from "react";
import { animate, createDrawable, stagger } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Draw the mark with Anime.js when mounted. */
  animateIn?: boolean;
  onComplete?: () => void;
};

/**
 * Original WASO mark: an aperture of three overlapping shards inside a ring.
 * Lines are drawn with Anime.js createDrawable, then filled.
 */
export function Logo({ className, animateIn = false, onComplete }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const strokes = svg.querySelectorAll<SVGElement>("[data-draw]");
    const fills = svg.querySelectorAll<SVGElement>("[data-fill]");

    if (!animateIn || reduced) {
      strokes.forEach((s) => (s.style.opacity = "1"));
      fills.forEach((f) => (f.style.opacity = "1"));
      onComplete?.();
      return;
    }

    strokes.forEach((s) => (s.style.opacity = "1"));
    fills.forEach((f) => (f.style.opacity = "0"));

    const drawn = animate(createDrawable(strokes), {
      draw: ["0 0", "0 1"],
      duration: 1400,
      delay: stagger(140),
      ease: "inOutQuart",
    });
    const filled = animate(fills, {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 700,
      delay: stagger(80, { start: 1100 }),
      ease: "outExpo",
      onComplete: () => onComplete?.(),
    });

    return () => {
      drawn.pause();
      filled.pause();
    };
  }, [animateIn, reduced, onComplete]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <circle
        data-draw
        cx="32"
        cy="32"
        r="28"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0"
      />
      <path
        data-draw
        d="M32 10 L50 44 L14 44 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0"
      />
      <path
        data-draw
        d="M32 54 L14 20 L50 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0"
      />
      <polygon
        data-fill
        points="32,24 40,38 24,38"
        fill="currentColor"
        style={{ transformOrigin: "32px 32px" }}
      />
      <circle data-fill cx="32" cy="32" r="2.4" fill="var(--color-glow)" />
    </svg>
  );
}
