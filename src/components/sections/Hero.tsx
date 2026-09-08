"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { hero } from "@/content/site";
import { useScrollTo } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSplitText } from "@/hooks/useSplitText";
import { getGsap } from "@/lib/gsap";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export function Hero({ ready }: { ready: boolean }) {
  const section = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const scrollTo = useScrollTo();

  useSplitText(headline, { mode: "chars", delay: ready ? 150 : 900, duration: 1300, onView: false });

  // Entrance: the copy is server-rendered visible (good for LCP) and sits
  // behind the loader curtain. Once the curtain lifts, GSAP plays it in.
  useEffect(() => {
    const el = section.current;
    if (!el || reduced || !ready) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-item]", {
        autoAlpha: 0,
        y: 24,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.14,
        delay: 0.35,
        clearProps: "transform",
      });
    }, el);
    return () => ctx.revert();
  }, [ready, reduced]);

  // Scroll: the hero content parallaxes and fades as the user scrolls away.
  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-copy]", {
        yPercent: -18,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to("[data-hero-scene]", {
        yPercent: 12,
        scale: 0.9,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const go = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(href, -8);
  };

  return (
    <section
      ref={section}
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-[calc(var(--nav-h)+2rem)] sm:items-center sm:pb-0 sm:pt-[var(--nav-h)]"
    >
      <div data-hero-scene className="absolute inset-0">
        {ready && <HeroScene />}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_72%_45%,rgba(139,233,255,0.1),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent sm:via-ink/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div data-hero-copy className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p data-hero-item className="eyebrow mb-6">
          {hero.eyebrow}
        </p>

        <h1
          ref={headline}
          className="font-display max-w-5xl text-balance text-[clamp(2.6rem,8vw,7.2rem)] font-semibold leading-[0.98] text-snow"
        >
          {hero.headline}
        </h1>

        <p data-hero-item className="mt-8 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
          {hero.sub}
        </p>

        <div data-hero-item className="mt-10 flex flex-wrap items-center gap-4">
          <Button href={hero.primaryCta.href} onClick={go(hero.primaryCta.href)} data-cursor="Go">
            {hero.primaryCta.label}
          </Button>
          <Button variant="ghost" href={hero.secondaryCta.href} onClick={go(hero.secondaryCta.href)}>
            {hero.secondaryCta.label}
          </Button>
        </div>

        <dl data-hero-item className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-line pt-6">
          {hero.stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-2xl font-semibold text-snow sm:text-3xl">{s.value}</dt>
              <dd className="mt-1 text-xs text-fog sm:text-sm">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        data-hero-item
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-hidden
      >
        <span className="eyebrow">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line-strong">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_1.8s_ease-in-out_infinite] bg-glow" />
        </span>
      </div>
    </section>
  );
}
