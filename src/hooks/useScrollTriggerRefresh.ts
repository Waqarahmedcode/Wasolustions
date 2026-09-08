"use client";

import { useEffect } from "react";
import { getGsap } from "@/lib/gsap";

/**
 * Sections load on demand and the portfolio filter changes page height, so
 * ScrollTrigger's cached positions go stale. Refresh (debounced) whenever the
 * document's size changes.
 */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    const { ScrollTrigger } = getGsap();
    let timeout = 0;
    let lastHeight = document.body.offsetHeight;
    const observer = new ResizeObserver(() => {
      const next = document.body.offsetHeight;
      if (next === lastHeight) return;
      lastHeight = next;
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);
}
