"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Subscribe to a CSS media query. Returns `fallback` during SSR. */
export function useMediaQuery(query: string, fallback = false) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
