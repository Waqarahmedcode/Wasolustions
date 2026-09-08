"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

type Props = Omit<HTMLMotionProps<"a">, "children"> & {
  variant?: Variant;
  children: ReactNode;
  as?: "a" | "button";
};

const base =
  "group relative inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const variants: Record<Variant, string> = {
  primary: "bg-snow text-ink hover:bg-white",
  ghost: "border border-line-strong text-snow hover:border-white/40 hover:bg-white/5",
};

export const Button = forwardRef<HTMLAnchorElement, Props>(function Button(
  { variant = "primary", className, children, ...rest },
  ref,
) {
  return (
    <motion.a
      ref={ref}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 inline-block h-1.5 w-1.5 rounded-full bg-current transition-transform duration-300 group-hover:translate-x-1"
      />
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: "linear-gradient(90deg, var(--color-glow), var(--color-glow-2))" }}
        />
      )}
    </motion.a>
  );
});
