"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/** True when the visitor has asked the OS for reduced motion. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
