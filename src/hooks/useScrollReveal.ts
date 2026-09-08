"use client";

import { useEffect, type RefObject } from "react";
import { getGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RevealOptions = {
  /** Selector (inside the scope) for elements that fade and rise in. */
  items?: string;
  /** Selector for masked media: the wrapper clips, the child scales down. */
  media?: string;
  /** Selector for elements that parallax slowly as the section scrolls. */
  parallax?: string;
  stagger?: number;
  y?: number;
  start?: string;
};

/**
 * GSAP + ScrollTrigger reveal choreography scoped to one section.
 * Only transform and opacity are animated. Cleans up on unmount.
 */
export function useScrollReveal(
  scope: RefObject<HTMLElement | null>,
  {
    items = "[data-reveal]",
    media = "[data-media]",
    parallax = "[data-parallax]",
    stagger = 0.08,
    y = 48,
    start = "top 80%",
  }: RevealOptions = {},
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = scope.current;
    if (!root || reduced) return;
    const { gsap, ScrollTrigger } = getGsap();

    const ctx = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>(items);
      if (revealItems.length) {
        gsap.set(revealItems, { autoAlpha: 0, y });
        ScrollTrigger.batch(revealItems, {
          start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: "power4.out",
              stagger,
              overwrite: true,
            }),
        });
      }

      gsap.utils.toArray<HTMLElement>(media).forEach((wrapper) => {
        const inner = wrapper.firstElementChild as HTMLElement | null;
        if (!inner) return;
        gsap.set(wrapper, { clipPath: "inset(12% 0 12% 0)" });
        gsap.set(inner, { scale: 1.18 });
        gsap.to(wrapper, {
          clipPath: "inset(0% 0 0% 0)",
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: wrapper, start: "top 85%", once: true },
        });
        gsap.to(inner, {
          scale: 1,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapper, start: "top 85%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(parallax).forEach((el) => {
        const speed = Number(el.dataset.parallax || 0.15);
        gsap.fromTo(
          el,
          { yPercent: -speed * 40 },
          {
            yPercent: speed * 40,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [scope, reduced, items, media, parallax, stagger, y, start]);
}
