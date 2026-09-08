"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/site";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

const INTERVAL = 6000;

export function Testimonials() {
  const section = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  useScrollReveal(section);

  const go = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex((next + testimonials.length) % testimonials.length);
    },
    [],
  );

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => go(index + 1, 1), INTERVAL);
    return () => window.clearInterval(id);
  }, [index, paused, reduced, go]);

  const t = testimonials[index];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : 40 * d, filter: "blur(6px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : -40 * d, filter: "blur(6px)" }),
  };

  return (
    <section
      ref={section}
      id="testimonials"
      className="relative border-t border-line bg-ink-2/60 py-28 sm:py-40"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p data-reveal className="eyebrow mb-10 text-center">What clients say</p>

        <div
          data-reveal
          className="relative min-h-[260px] sm:min-h-[300px]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          aria-live="polite"
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.figure
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <blockquote className="font-display text-balance text-2xl font-medium leading-[1.25] text-snow sm:text-4xl">
                <span aria-hidden className="text-glow">“</span>
                {t.quote}
                <span aria-hidden className="text-glow">”</span>
              </blockquote>
              <figcaption className="mt-8">
                <span className="block text-sm font-medium text-snow">{t.name}</span>
                <span className="mt-1 block text-xs text-fog">{t.role}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div data-reveal className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(index - 1, -1)}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-snow transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((item, i) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => go(i, i > index ? 1 : -1)}
                className={cn("h-1.5 rounded-full transition-all duration-500", i === index ? "w-8 bg-glow" : "w-3 bg-line-strong hover:bg-white/40")}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1, 1)}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-snow transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
