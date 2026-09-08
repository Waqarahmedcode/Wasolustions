"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { LenisProvider } from "@/hooks/useLenis";
import { useScrollTriggerRefresh } from "@/hooks/useScrollTriggerRefresh";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/ui/Cursor";
import { Loader } from "@/components/ui/Loader";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";

// Below-the-fold sections load on demand so the hero ships first.
const Portfolio = dynamic(() => import("@/components/sections/Portfolio").then((m) => m.Portfolio));
const Process = dynamic(() => import("@/components/sections/Process").then((m) => m.Process));
const About = dynamic(() => import("@/components/sections/About").then((m) => m.About));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then((m) => m.Testimonials));
const Contact = dynamic(() => import("@/components/sections/Contact").then((m) => m.Contact));

export function Home() {
  const [ready, setReady] = useState(false);
  const onLoaded = useCallback(() => setReady(true), []);
  useScrollTriggerRefresh();

  return (
    <LenisProvider>
      <Loader onDone={onLoaded} />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <div className="hairline mx-auto max-w-7xl" aria-hidden />
        <Services />
        <Portfolio />
        <Process />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </LenisProvider>
  );
}
