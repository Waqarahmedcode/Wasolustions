"use client";

import { useRef } from "react";
import { about } from "@/content/site";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSplitText } from "@/hooks/useSplitText";

/** Original, procedural "stills" so the section has imagery without stock photos. */
function Still({ seed, className }: { seed: number; className?: string }) {
  const hues = [[195, 265], [30, 340], [160, 200]][seed % 3];
  return (
    <div data-media className={className}>
      <div
        className="reveal-media h-full w-full"
        style={{
          background: `radial-gradient(80% 70% at ${30 + seed * 20}% ${25 + seed * 15}%, hsl(${hues[0]} 90% 70% / 0.55), transparent 60%), radial-gradient(70% 90% at ${80 - seed * 15}% 80%, hsl(${hues[1]} 80% 60% / 0.5), transparent 60%), linear-gradient(170deg, #11141b, #06070a)`,
        }}
        aria-hidden
      >
        <div
          className="h-full w-full opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.05) 3px 4px)" }}
        />
      </div>
    </div>
  );
}

export function About() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useScrollReveal(section);
  useSplitText(heading, { mode: "words", duration: 1400 });

  return (
    <section ref={section} id="about" className="relative scroll-mt-20 overflow-hidden py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p data-reveal className="eyebrow mb-6">{about.eyebrow}</p>
        <h2 ref={heading} className="font-display max-w-5xl text-balance text-[clamp(2.4rem,6.5vw,5.6rem)] font-semibold leading-[1] text-snow">
          {about.headline}
        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-12 md:gap-6">
          <Still seed={0} className="reveal-mask overflow-hidden rounded-2xl md:col-span-7 aspect-[16/10]" />
          <div className="md:col-span-5 md:pl-6">
            {about.paragraphs.map((p) => (
              <p key={p} data-reveal className="mb-6 text-lg leading-relaxed text-mist">
                {p}
              </p>
            ))}
          </div>

          <div data-parallax="0.25" className="md:col-span-4 md:col-start-2">
            <Still seed={1} className="reveal-mask overflow-hidden rounded-2xl aspect-[4/5]" />
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-24">
            <Still seed={2} className="reveal-mask overflow-hidden rounded-2xl aspect-[5/4]" />
          </div>
        </div>

        <ul className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {about.pillars.map((p) => (
            <li key={p.label} data-reveal className="bg-ink p-8">
              <h3 className="font-display text-xl font-semibold text-snow">{p.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fog">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
