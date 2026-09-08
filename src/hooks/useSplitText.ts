"use client";

import { useEffect, type RefObject } from "react";
import { animate, splitText, stagger, utils } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SplitMode = "chars" | "words";

type Options = {
  mode?: SplitMode;
  delay?: number;
  duration?: number;
  /** When set, waits until the element scrolls into view. */
  onView?: boolean;
  /** Called once the element is ready to animate. */
  onStart?: () => void;
};

/**
 * Anime.js text splitting. Splits into lines + chars or words, then animates
 * each piece upward through a clipped line container.
 *
 * Splitting by lines waits for fonts to load and re-runs on resize, so the
 * animation is registered through `addEffect`, which Anime.js re-applies to
 * the fresh spans after every re-split.
 */
export function useSplitText(
  ref: RefObject<HTMLElement | null>,
  { mode = "words", delay = 0, duration = 1100, onView = true, onStart }: Options = {},
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.visibility = "visible";
      return;
    }

    // Hidden from here until fonts are ready and the split spans are styled.
    el.style.visibility = "hidden";
    let started = !onView;
    let played = false;
    let pending: ReturnType<typeof animate> | null = null;
    let observer: IntersectionObserver | null = null;

    const splitter = splitText(el, {
      lines: { class: "split-line" },
      words: { class: "split-word" },
      chars: mode === "chars" ? { class: "split-char" } : false,
      accessible: true,
    });

    splitter.addEffect((self: typeof splitter) => {
      const targets = mode === "chars" ? self.chars : self.words;
      el.style.visibility = "visible";
      if (played || !targets.length) return;

      utils.set(targets, { translateY: "110%", opacity: 0 });
      const animation = animate(targets, {
        translateY: ["110%", "0%"],
        rotate: mode === "chars" ? [4, 0] : [0, 0],
        opacity: [0, 1],
        duration,
        delay: stagger(mode === "chars" ? 18 : 60, { start: delay }),
        ease: "outExpo",
        autoplay: false,
        onBegin: () => onStart?.(),
        onComplete: () => {
          played = true;
        },
      });
      pending = animation;
      if (started) animation.play();
      return animation;
    });

    if (!started && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            started = true;
            pending?.play();
            observer?.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(el);
    } else {
      started = true;
    }

    return () => {
      observer?.disconnect();
      splitter.revert();
      el.style.visibility = "";
    };
  }, [ref, mode, delay, duration, onView, onStart, reduced]);
}
