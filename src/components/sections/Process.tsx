"use client";

import { useEffect, useRef } from "react";
import { process } from "@/content/site";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSplitText } from "@/hooks/useSplitText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getGsap } from "@/lib/gsap";

/**
 * Timeline that draws itself as the user scrolls. GSAP scrubs the line's
 * scaleY and each step lights up as the line passes it.
 */
export function Process() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useScrollReveal(section);
  useSplitText(heading, { mode: "words" });

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const { gsap } = getGsap();

    if (reduced) {
      gsap.set("[data-line-fill]", { scaleY: 1 });
      gsap.set("[data-step-dot]", { backgroundColor: "#8be9ff", scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-line-fill]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 60%", scrub: 0.4 },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        const dot = step.querySelector("[data-step-dot]");
        const num = step.querySelector("[data-step-num]");
        gsap.timeline({ scrollTrigger: { trigger: step, start: "top 65%", toggleActions: "play none none reverse" } })
          .to(dot, { backgroundColor: "#8be9ff", scale: 1.25, duration: 0.5, ease: "back.out(2)" })
          .to(num, { color: "#f4f5f7", duration: 0.4 }, "<");
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} id="process" className="relative scroll-mt-20 border-t border-line bg-ink-2/60 py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p data-reveal className="eyebrow mb-5">How we work</p>
            <h2 ref={heading} className="font-display text-balance text-4xl font-semibold leading-[1.02] text-snow sm:text-6xl">
              Four steps from first call to final frame.
            </h2>
            <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-fog">
              A process built to keep momentum. Clear gates, daily reviews, and no surprises at delivery.
            </p>
          </div>

          <ol data-timeline className="relative">
            <span aria-hidden className="absolute left-[11px] top-0 h-full w-px bg-line-strong sm:left-[15px]" />
            <span data-line-fill aria-hidden className="absolute left-[11px] top-0 h-full w-px origin-top bg-gradient-to-b from-glow to-glow-2 sm:left-[15px]" />
            {process.map((p, i) => (
              <li key={p.step} data-step data-reveal className="relative pb-14 pl-12 last:pb-0 sm:pl-16">
                <span data-step-dot aria-hidden className="absolute left-[7px] top-2 h-2.5 w-2.5 rounded-full bg-line-strong sm:left-[10px] sm:h-3 sm:w-3" />
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span data-step-num className="font-mono text-xs tracking-[0.22em] text-fog">STEP {p.step}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">{p.duration}</span>
                </div>
                <h3 className="font-display mt-3 text-3xl font-semibold text-snow sm:text-4xl">{p.title}</h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-mist">{p.text}</p>
                {i < process.length - 1 && (
                  <span aria-hidden className="mt-8 block font-mono text-xs text-fog">↓</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
