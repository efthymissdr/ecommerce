# FUERTE — Coffee Roasters (redesign)

A redesign concept for [fuerte.gr](https://fuerte.gr), built with React 19, Vite, Tailwind CSS v4 and GSAP.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Design

Direction comes from the `ui-ux-pro-max` skill (`.claude/skills/ui-ux-pro-max`): a premium dark palette with a gold accent, Cormorant (display) paired with Montserrat (body), and high-motion interaction. All motion respects `prefers-reduced-motion`.

## Sections and motion

| Section | Animations |
| --- | --- |
| Preloader | Counter, spinning bean, staggered curtain reveal |
| Nav | Glass bar that hides on scroll down and returns on scroll up; animated underlines; cart badge bounce |
| Hero | Masked word reveal, floating bags, steaming cup, orbiting beans, rotating text ring, pointer-driven 3D tilt, scroll parallax, magnetic buttons |
| Marquee | Two opposing rows that speed up and skew with scroll velocity |
| Shop | GSAP Flip filtering, 3D tilt cards with spotlight, bag lift on hover, add-to-cart bean that flies to the cart icon |
| Story | Year counter, word-by-word text highlight on scroll, timeline drawn as you scroll, hover-reactive cards |
| The craft | Pinned horizontal scroll with progress bar, roast curve drawn on scroll, pulsing rings |
| Taste profile | Radar chart that morphs between coffees, animated bars, bag flip |
| Wholesale / footer | Card that scales in on scroll, parallax cup, letter-by-letter wordmark |

Brand facts (since 1997 as "BEST", 100% Arabica, a roast profile per blend, espresso / single-origin / Greek / filter ranges) come from fuerte.gr's public description. **Product names, tasting notes, prices, email and social links are placeholders** — replace them in `src/data/content.js`, `src/components/Footer.jsx` and `src/components/Nav.jsx` with the real catalogue.

Screenshots are in [`screenshots/`](screenshots).
