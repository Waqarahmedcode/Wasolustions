"use client";

import Lenis from "lenis";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { getGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* A tiny external store so components can subscribe to the live Lenis
 * instance without the provider calling setState inside its effect. */
let current: Lenis | null = null;
const listeners = new Set<() => void>();

function setCurrent(next: Lenis | null) {
  current = next;
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const getSnapshot = () => current;
const getServerSnapshot = () => null;

/**
 * Site-wide smooth scroll. Lenis drives scroll position and GSAP's ticker
 * drives Lenis, so ScrollTrigger always reads a consistent value.
 * With prefers-reduced-motion the provider renders children without Lenis.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const { gsap, ScrollTrigger } = getGsap();

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      smoothWheel: true,
      autoRaf: false,
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setCurrent(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setCurrent(null);
    };
  }, [reduced]);

  return <>{children}</>;
}

export function useLenis() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Scroll to a hash target through Lenis when available, natively otherwise. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target: string, offset = 0) => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };
}
