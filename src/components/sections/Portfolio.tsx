"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projectCategories, projects, type Project, type ProjectCategory } from "@/content/site";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSplitText } from "@/hooks/useSplitText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/hooks/useLenis";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Procedural "footage": an animated gradient field per project, so the
 * gallery reads as motion without shipping video. Replace with a real
 * <video> by adding `video` and `poster` to the project in content/site.ts.
 */
function Footage({ project, playing }: { project: Project; playing: boolean }) {
  const [a, b, c] = project.palette;
  if (project.video) {
    return (
      <video
        className="h-full w-full object-cover"
        src={project.video}
        poster={project.poster}
        muted
        loop
        playsInline
        preload="none"
        autoPlay={playing}
        aria-hidden
      />
    );
  }
  return (
    <div
      className={cn("h-full w-full transition-transform duration-[1200ms] ease-[var(--ease-out-expo)]", playing && "scale-105")}
      style={{
        background: `radial-gradient(120% 90% at 20% 20%, ${c}66, transparent 60%), radial-gradient(90% 90% at 80% 80%, ${b}aa, transparent 60%), linear-gradient(160deg, ${a}, #05060a)`,
      }}
      aria-hidden
    >
      <div
        className={cn("h-full w-full opacity-60 mix-blend-screen transition-opacity duration-700", playing ? "opacity-90" : "opacity-50")}
        style={{
          backgroundImage: `repeating-linear-gradient(115deg, transparent 0 18px, ${c}12 18px 19px)`,
          animation: playing ? "footage 6s linear infinite" : "none",
        }}
      />
    </div>
  );
}

const aspectClass: Record<Project["aspect"], string> = {
  wide: "aspect-[16/10] md:col-span-2",
  tall: "aspect-[4/5]",
  square: "aspect-square",
};

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn("group relative", aspectClass[project.aspect])}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        data-cursor="Play"
        className="relative block h-full w-full overflow-hidden rounded-2xl border border-line text-left"
      >
        <span className="sr-only">Open project: </span>
        <div data-media className="absolute inset-0 rounded-2xl">
          <div className="reveal-media h-full w-full">
            <Footage project={project} playing={hover && !reduced} />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
              {project.client} · {project.year}
            </p>
            <h3 className="font-display mt-1 text-2xl font-semibold text-snow sm:text-3xl">{project.title}</h3>
          </div>
          <span className="rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
            {project.category}
          </span>
        </div>
      </button>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const lenis = useLenis();
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialog.current) {
        const focusables = dialog.current.querySelectorAll<HTMLElement>(
          'button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
      previouslyFocused?.focus();
    };
  }, [project, onClose, lenis]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="relative flex max-h-[100svh] w-full max-w-6xl flex-col overflow-y-auto rounded-t-3xl border border-line bg-ink-2 sm:max-h-[90vh] sm:flex-row sm:rounded-3xl"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
          >
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[58%]">
              <Footage project={project} playing />
            </div>
            <div className="flex flex-col p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                    {project.client} · {project.year}
                  </p>
                  <h3 id="project-title" className="font-display mt-2 text-4xl font-semibold text-snow sm:text-5xl">
                    {project.title}
                  </h3>
                </div>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={onClose}
                  aria-label="Close project"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-snow transition-colors hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-8 text-base leading-relaxed text-mist">{project.summary}</p>
              <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                <div>
                  <dt className="eyebrow">Services</dt>
                  <dd className="mt-2 text-sm text-snow">{project.services.join(", ")}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Result</dt>
                  <dd className="mt-2 text-sm text-snow">{project.result}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Portfolio() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [filter, setFilter] = useState<ProjectCategory>("All");
  const [active, setActive] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  useScrollReveal(section, { media: "[data-media-none]" });
  useSplitText(heading, { mode: "words" });

  // GSAP scroll storytelling: the big label behind the grid drifts on scroll.
  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-ghost]",
        { xPercent: 10 },
        { xPercent: -30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>("[data-media]").forEach((wrap) => {
        const inner = wrap.firstElementChild as HTMLElement | null;
        if (!inner) return;
        gsap.fromTo(inner, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, filter]);

  const visible = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.category === filter)), [filter]);
  const close = useCallback(() => setActive(null), []);

  return (
    <section ref={section} id="work" className="relative scroll-mt-20 overflow-hidden py-28 sm:py-40">
      <svg
        data-ghost
        aria-hidden
        className="pointer-events-none absolute left-0 top-10 h-[22vw] w-[140vw]"
        viewBox="0 0 1400 220"
        preserveAspectRatio="xMinYMid meet"
      >
        <text x="0" y="200" fill="rgba(255,255,255,0.025)" fontSize="220" fontWeight="600" fontFamily="var(--font-display)" letterSpacing="-8">
          Selected Work
        </text>
      </svg>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="eyebrow mb-5">Selected work</p>
            <h2 ref={heading} className="font-display max-w-2xl text-balance text-4xl font-semibold leading-[1.02] text-snow sm:text-6xl">
              Films, spots, and worlds we are proud to sign.
            </h2>
          </div>

          <LayoutGroup id="filters">
            <div data-reveal role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
              {projectCategories.map((c) => {
                const selected = c === filter;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={selected}
                    type="button"
                    onClick={() => setFilter(c)}
                    className={cn(
                      "relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                      selected ? "text-ink" : "text-fog hover:text-snow",
                    )}
                  >
                    {selected && (
                      <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-snow" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                    )}
                    <span className="relative">{c}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <motion.div layout className="mt-14 grid gap-4 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={setActive} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectModal project={active} onClose={close} />
    </section>
  );
}
