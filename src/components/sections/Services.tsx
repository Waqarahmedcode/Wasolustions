"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { services, type Service } from "@/content/site";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSplitText } from "@/hooks/useSplitText";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const glow = useMotionTemplate`radial-gradient(240px circle at ${mx}% ${my}%, rgba(139,233,255,0.16), transparent 70%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * 6);
    rx.set((0.5 - py) * 6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      data-reveal
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative flex h-full flex-col rounded-2xl border border-line bg-ink-2 p-7 transition-colors duration-500 hover:border-white/20 focus-within:border-white/30 sm:p-8"
      tabIndex={0}
      aria-labelledby={`service-${service.id}`}
    >
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" style={{ background: glow }} />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.2em] text-fog">{service.index}</span>
        <span className="h-8 w-8 rounded-full border border-line-strong transition-transform duration-500 group-hover:rotate-45 group-focus-within:rotate-45">
          <svg viewBox="0 0 24 24" className="h-full w-full p-2 text-mist" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <h3 id={`service-${service.id}`} className="font-display relative mt-12 text-2xl font-semibold text-snow sm:text-[1.7rem]">
        {service.title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-mist">{service.blurb}</p>

      <div className="relative mt-auto pt-8">
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="pb-4 text-sm leading-relaxed text-fog">{service.detail}</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Capabilities">
          {service.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <span className="sr-only">{`Service ${index + 1} of ${services.length}`}</span>
    </motion.div>
  );
}

export function Services() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useScrollReveal(section, { stagger: 0.1 });
  useSplitText(heading, { mode: "words" });

  return (
    <section ref={section} id="services" className="relative scroll-mt-20 py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p data-reveal className="eyebrow mb-5">What we make</p>
            <h2 ref={heading} className="font-display text-balance text-4xl font-semibold leading-[1.02] text-snow sm:text-6xl">
              Six disciplines. One standard: it has to move people.
            </h2>
          </div>
          <p data-reveal className="max-w-md text-base leading-relaxed text-fog md:justify-self-end">
            We build campaigns end to end, from the strategic idea to the last frame of the last format. Hover a card to see how each discipline works.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
