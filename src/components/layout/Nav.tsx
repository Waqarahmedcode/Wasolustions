"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/content/site";
import { useScrollTo } from "@/hooks/useLenis";
import { cn } from "@/lib/cn";

const linkVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i + 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
  exit: { opacity: 0, y: 12, transition: { duration: 0.25 } },
};

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const scrollTo = useScrollTo();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href, -8);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[background-color,border-color] duration-500",
          scrolled ? "border-b border-line bg-ink/70 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between px-5 sm:px-8"
        >
          <a href="#top" onClick={go("#top")} className="flex items-center gap-3 text-snow" aria-label={`${site.name} home`}>
            <Logo />
            <span className="font-display text-lg font-semibold tracking-tight">{site.name}</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={go(item.href)}
                  className="group relative text-sm text-mist transition-colors hover:text-snow"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-glow transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={go("#contact")}
              className="hidden rounded-full border border-line-strong px-5 py-2 text-sm text-snow transition-colors hover:border-white/40 hover:bg-white/5 md:inline-flex"
            >
              Start A Project
            </a>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line-strong md:hidden"
            >
              <motion.span
                className="absolute h-px w-5 bg-snow"
                animate={{ rotate: open ? 45 : 0, y: open ? 0 : -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <motion.span
                className="absolute h-px w-5 bg-snow"
                animate={{ rotate: open ? -45 : 0, y: open ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[65] flex flex-col justify-end bg-ink/95 px-6 pb-14 pt-32 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <ul className="flex flex-col gap-2">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <a
                    href={item.href}
                    onClick={go(item.href)}
                    className="font-display block py-3 text-5xl font-semibold tracking-tight text-snow"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="eyebrow mt-10"
              custom={site.nav.length}
              variants={linkVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {site.email}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
