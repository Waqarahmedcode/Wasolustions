# Premium creative agency website — build prompt

Optimized with the `claude-prompt-style` skill. Copy the block below into Claude
Code (or the Claude app) as a single message. The original brief is preserved in
full at the bottom of this file for reference.

```text
<role>
You are a senior creative technologist and front-end lead at an award-winning
digital studio. You are building the complete marketing website for a premium
creative agency that produces AI commercials, UGC advertisements, brand films,
product videos, motion graphics, 3D experiences, creative strategy, and
performance marketing campaigns. The audience is brand managers, founders, and
marketing directors evaluating whether to hire the studio for a high-budget
campaign. The site must feel like "a premium creative studio from 2030 that
combines AI, filmmaking, and technology."
</role>

<context>
- Greenfield repository. No existing code, design system, or assets.
- Quality bar: Apple, Linear, Stripe, and Awwwards Site of the Day winners. Use
  them as a reference for restraint, typographic hierarchy, and motion polish.
  Do not copy any of their layouts, logos, wordmarks, copy, or artwork. All
  visual design, copy, and 3D objects must be original.
- Visual direction: dark premium theme, elegant typography, minimal but visually
  powerful, strong visual storytelling, high-end motion. Every section should
  feel alive but never distracting.
- No real client media is available yet. Use original placeholder media
  (generated gradients, procedural canvases, or royalty-free stand-ins) and make
  every asset swappable through a single data file.
</context>

<requirements>
Tech stack (use exactly these, latest stable versions):
1. Next.js (App Router) + React + TypeScript.
2. Tailwind CSS for styling.
3. GSAP with ScrollTrigger for scroll-driven animation.
4. Framer Motion for component and page-level animation.
5. Lenis for smooth scrolling, synced to GSAP ScrollTrigger via its ticker.
6. Three.js (via @react-three/fiber and @react-three/drei) for the hero.
7. Anime.js for logo, text-split, SVG, and micro-interactions.

Animation ownership (one library per job, no overlap):
8. GSAP + ScrollTrigger: cinematic scroll animations, hero headline reveal,
   large typography motion, image and video reveal on scroll, subtle parallax,
   pinned or crossfaded transitions between sections.
9. Lenis: site-wide smooth scroll that feels like a luxury brand site. Must be
   the single scroll source for ScrollTrigger. Disabled when
   prefers-reduced-motion is set.
10. Framer Motion: page transitions, navigation open and close, hover states,
    service cards, buttons, portfolio filter transitions (layout animations),
    modal enter and exit.
11. Three.js: an original futuristic 3D object that evokes creativity, AI, and
    video production (for example an abstract lens, a shard cluster, or a
    particle aperture; invent your own). Subtle mouse-parallax interaction,
    slow continuous camera drift, and a mobile-safe fallback (lower geometry,
    capped pixel ratio, or a static poster on low-end devices).
12. Anime.js: animated logo mark on load, split-text character and word
    effects, SVG line-draw animations, and small UI micro-interactions.

Page structure (single page, sections in this order, each a separate component):
13. Hero: full-screen cinematic opening. Animated headline exactly:
    "We Create The Future Of Digital Experiences". Interactive 3D background.
    Smooth entrance choreography. Two CTAs: "Start A Project" (primary) and
    "View Our Work" (secondary, scrolls to Portfolio).
14. Services: animated cards for AI Commercials, UGC Ads, Brand Films, Product
    Videos, 3D Animation, Creative Direction. Cards have hover animation, move
    naturally (spring physics, not linear), and reveal a short detail on hover
    or focus.
15. Portfolio: cinematic gallery of video project cards with smooth hover
    previews (muted autoplay on hover, poster otherwise), GSAP scroll
    storytelling, category filtering, and a full-screen project showcase modal.
16. Process: Discovery → Strategy → Production → Delivery as an animated
    timeline that draws and fills as the user scrolls.
17. About: emotional brand story with large typography, smooth image reveals,
    and subtle motion.
18. Testimonials: animated client reviews with elegant transitions (crossfade
    or slide, auto-advance with pause on hover, manual controls).
19. Contact: premium CTA with the exact line
    "Have an idea? Let's create something unforgettable." plus a short form
    (name, email, budget range, message) with validated client-side states.
20. Global: sticky minimal navigation, footer with social links, custom cursor
    on pointer devices only, and a short loading sequence tied to the logo
    animation.

Performance and accessibility:
21. Hold 60 FPS on a mid-range laptop. Animate only transform and opacity.
    No layout-thrashing scroll handlers.
22. Optimize Three.js: cap devicePixelRatio at 2, dispose geometries and
    materials on unmount, pause the render loop when the hero is off-screen,
    reduce geometry on mobile.
23. Lazy-load every heavy asset (3D scene, videos, below-the-fold sections)
    with next/dynamic and IntersectionObserver.
24. Fully responsive from 360px to 2560px. Touch-friendly targets.
25. Respect prefers-reduced-motion: disable Lenis, parallax, autoplay video,
    and continuous 3D motion; keep instant, accessible state changes.
26. Semantic HTML, visible focus states, keyboard-operable nav, filters, modal
    (focus trap and Escape to close), and carousel. Color contrast at least
    4.5:1 for body text.
27. Lighthouse targets on the production build: Performance ≥ 85 on mobile,
    Accessibility ≥ 95, Best Practices ≥ 95.
</requirements>

<constraints>
- Do not copy any existing site, brand asset, logo, or character. Invent the
  studio name, logo mark, palette, and copy.
- Do not add libraries beyond the listed stack except @react-three/fiber,
  @react-three/drei, and a split-text helper if Anime.js needs one.
- Do not put animation logic in page components. Keep it in hooks
  (useLenis, useScrollReveal, useSplitText) and small animation utilities.
- Do not ship placeholder lorem ipsum. Write real, short, confident copy.
- Do not use em dashes in copy.
- Keep the entire site to one route plus a 404. No CMS integration yet.
</constraints>

<examples>
<good>
Hero headline: characters rise from a 40px offset with a clip-path mask,
staggered 20ms, easing "power4.out", 1.2s total, then the CTAs fade up 200ms
later. The 3D object drifts 2 degrees on mouse move with 0.08 lerp. On
reduced-motion the headline appears instantly and the 3D object is a static
frame.
</good>
<bad>
Hero headline bounces with an elastic ease, the 3D object spins fast enough to
draw the eye away from the copy, and scrolling is intercepted so the wheel feels
laggy. This reads as a template, not a luxury studio.
</bad>
<good>
Service card: on hover it lifts 6px, the border glows from 0 to 40% opacity,
and a one-line description slides in under the title. On keyboard focus the
same state is triggered.
</good>
<bad>
Service card: on hover it scales to 1.15, flips in 3D, and plays a sound.
</bad>
</examples>

<process>
1. Plan first. Output a file tree and a one-line purpose for each file before
   writing code. Confirm the animation-ownership table (which library handles
   which effect).
2. Scaffold the project: Next.js + TypeScript + Tailwind, install the stack,
   set up fonts, theme tokens, and a `content/site.ts` data file for all copy,
   services, projects, process steps, and testimonials.
3. Build global systems: Lenis provider synced to GSAP ticker, reduced-motion
   hook, layout, navigation, footer, cursor, loader with Anime.js logo.
4. Build sections in page order: Hero (with the Three.js scene), Services,
   Portfolio, Process, About, Testimonials, Contact.
5. Add page transitions and the portfolio modal with Framer Motion.
6. Verify: run `npm run build`, `npm run lint`, and `tsc --noEmit`. Load the
   site in a browser, test at 375px and 1440px, test with reduced motion on,
   and check keyboard navigation through nav, filters, and modal.
7. Report: list what was built, any requirement you could not meet and why,
   and the Lighthouse scores you measured.
</process>

<output_format>
Deliver the full codebase in the repository. Then reply with:
- The file tree (paths only).
- A five-line summary of the animation system.
- The verification results (build, lint, type-check, Lighthouse).
- Any skipped requirement with the reason.
Keep the reply under 300 words.
</output_format>

<acceptance_criteria>
- [ ] All seven sections exist in the specified order with the exact headline
      and CTA copy.
- [ ] Lenis is the only scroll driver and ScrollTrigger animations stay in sync.
- [ ] Three.js hero responds to mouse, drifts on its own, and falls back
      cleanly on mobile and reduced-motion.
- [ ] Each of GSAP, Framer Motion, Anime.js, and Three.js is used for the jobs
      assigned above, with no duplicated responsibility.
- [ ] Portfolio filtering, hover previews, and full-screen modal work with
      mouse and keyboard.
- [ ] prefers-reduced-motion disables all continuous motion.
- [ ] Production build passes with zero TypeScript and ESLint errors.
- [ ] Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95.
- [ ] No third-party brand assets, logos, or copied layouts anywhere.
</acceptance_criteria>
```

## What changed from the original brief

- Added a role, audience, and a one-line definition of "done" so Claude knows
  who it is building for.
- Turned every requirement into a numbered, testable line and assigned each
  animation library one job so they do not fight each other.
- Reframed "inspired by Apple, Linear, Stripe" as a quality bar with an explicit
  no-copy rule, which matches Claude's refusal conventions for brand assets.
- Added good and bad examples for hero motion and card hover so the subjective
  "premium" feel has a concrete target.
- Added an ordered process with a verify step, an output format with a length
  limit, and an acceptance checklist.

## Original brief (unchanged)

```text
Create an award-winning premium creative agency website with a futuristic, cinematic, and luxury feel.

The website should look like a top-tier digital studio that creates:
- AI commercials
- UGC advertisements
- Brand films
- Product videos
- Motion graphics
- 3D experiences
- Creative strategy
- Performance marketing campaigns

Design direction:
- Inspired by Apple, Linear, Stripe, and Awwwards-winning agency websites.
- Minimal but visually powerful.
- Dark premium theme with elegant typography.
- Strong visual storytelling.
- High-end motion design.
- Every section should feel alive but never distracting.

TECH STACK:
Build using:
- Next.js + React
- Tailwind CSS
- GSAP
- Framer Motion
- Lenis Smooth Scroll
- Three.js
- Anime.js

ANIMATION REQUIREMENTS:

GSAP + ScrollTrigger:
- Create cinematic scroll animations.
- Hero section should have dramatic text reveal animations.
- Large typography should animate smoothly.
- Images and videos should reveal while scrolling.
- Add subtle parallax effects.
- Create smooth transitions between sections.

Lenis:
- Implement premium smooth scrolling throughout the website.
- Scrolling should feel like luxury brand websites.
- Integrate perfectly with GSAP ScrollTrigger.

Framer Motion:
Use for:
- Page transitions.
- Navigation animations.
- Hover interactions.
- Service cards.
- Buttons.
- Portfolio filtering.
- Modal animations.

Three.js:
Create an immersive hero experience:
- Add a futuristic 3D object related to creativity/AI/video production.
- Allow subtle mouse movement interaction.
- Add smooth camera movement.
- Keep optimized for mobile.

Anime.js:
Use for:
- Logo animation.
- Text splitting effects.
- Small UI micro-interactions.
- SVG animations.

PAGE STRUCTURE:

1. HERO SECTION:
- Full-screen cinematic opening.
- Animated headline:
"We Create The Future Of Digital Experiences"
- Background with interactive 3D visuals.
- Smooth entrance animations.
- Strong CTA buttons:
"Start A Project"
"View Our Work"

2. SERVICES SECTION:
Create animated cards:
- AI Commercials
- UGC Ads
- Brand Films
- Product Videos
- 3D Animation
- Creative Direction

Cards should:
- Have hover animations.
- Move naturally.
- Reveal details smoothly.

3. PORTFOLIO SECTION:
Create a cinematic portfolio gallery:
- Video project cards.
- Smooth hover previews.
- GSAP scroll storytelling.
- Full-screen project showcase.

4. PROCESS SECTION:
Show:
Discovery → Strategy → Production → Delivery

Use animated timeline effects.

5. ABOUT SECTION:
Create an emotional brand story with:
- Large typography.
- Smooth image reveals.
- Subtle motion.

6. TESTIMONIAL SECTION:
Animated client reviews with elegant transitions.

7. CONTACT SECTION:
Premium CTA:
"Have an idea? Let's create something unforgettable."

PERFORMANCE:
- Maintain 60 FPS animations.
- Optimize Three.js rendering.
- Lazy load heavy assets.
- Support mobile devices.
- Add prefers-reduced-motion accessibility.

FINAL FEEL:
The website should feel like:
"A premium creative studio from 2030 that combines AI, filmmaking, and technology."
```
