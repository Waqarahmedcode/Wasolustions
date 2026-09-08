# WASO Studio

Premium creative agency website. Next.js 16, React 19, Tailwind CSS 4, GSAP,
Framer Motion, Lenis, Three.js (react-three-fiber), and Anime.js.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the build
npm run lint     # eslint
npx tsc --noEmit # type check
```

## Where things live

| Path | Purpose |
| --- | --- |
| `src/content/site.ts` | All copy, services, projects, process steps, testimonials. Edit content here. |
| `src/app/globals.css` | Design tokens (colors, fonts, easings), grain, split-text and reveal helpers. |
| `src/hooks/useLenis.tsx` | Smooth scroll provider synced to the GSAP ticker. Off under reduced motion. |
| `src/hooks/useScrollReveal.ts` | GSAP + ScrollTrigger reveals, media masks, parallax, scoped per section. |
| `src/hooks/useSplitText.ts` | Anime.js line, word, and character splitting with an upward reveal. |
| `src/hooks/useScrollTriggerRefresh.ts` | Refreshes ScrollTrigger when the page height changes. |
| `src/components/three/HeroScene.tsx` | The "Aperture" hero object. Mouse tilt, camera drift, mobile fallback. |
| `src/components/sections/*` | Hero, Services, Portfolio, Process, About, Testimonials, Contact. |
| `src/components/layout/Home.tsx` | Page composition. Below-the-fold sections load on demand. |
| `prompts/premium-agency-website.md` | The build brief this site was made from. |

## Animation ownership

| Library | Owns |
| --- | --- |
| GSAP + ScrollTrigger | Scroll reveals, media masks, parallax, hero scroll-away, process timeline, portfolio scroll storytelling, hero entrance. |
| Lenis | Site-wide smooth scroll and programmatic scroll-to. |
| Framer Motion | Nav, mobile menu, buttons, service card tilt and hover, portfolio filter layout animation, project modal, testimonial transitions, cursor. |
| Three.js | Hero 3D scene only. |
| Anime.js | Logo draw-in, headline text splitting, split-text reveals. |

## Adding real project media

Add `video` and `poster` URLs to a project in `src/content/site.ts`. The
portfolio card and modal switch from the procedural gradient to the video
automatically. Videos are muted, looped, and play on hover only.

## Accessibility

- `prefers-reduced-motion` disables Lenis, parallax, autoplay, the 3D drift,
  the custom cursor, and the loader sequence.
- Nav, filters, cards, modal (focus trap, Escape), carousel, and form are
  keyboard operable with visible focus rings.
- Devices without WebGL get the static gradient backdrop instead of the scene.
