# FUERTE — Coffee Roasters (redesign)

A redesign concept for [fuerte.gr](https://fuerte.gr), built with React 19, Vite, Tailwind CSS v4 and GSAP.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Design

Direction comes from the `ui-ux-pro-max` skill (`.claude/skills/ui-ux-pro-max`): a premium dark palette with a gold accent, Cormorant (display) paired with Montserrat (body), and high-motion interaction. All motion respects `prefers-reduced-motion`.

## Page order

Hero → marquee → taste quiz → shop → our story → the craft → wholesale → footer. The navigation and footer links follow the same order (`linkIds` in `src/components/Nav.jsx`).

## Shopify

The account button in the navigation links to `shopify.accountUrl` in `src/config.js`, which is currently `/account`. When the store is connected, set it to the store's customer account URL: `https://shopify.com/<shop-id>/account` for new customer accounts, or `https://<store-domain>/account` for classic ones.

## Photos

Background photos are in `public/img` as WebP. The hero uses roasted coffee beans, the quiz uses coffee cups, and the story section uses sacks of green coffee. Each sits under a brown tint for readable text and moves with a slow parallax (`PhotoBg` in `src/components/ui.jsx`). They come from the MIT-licensed [Start Bootstrap Business Casual](https://github.com/StartBootstrap/startbootstrap-business-casual) theme, which bundles them from Unsplash. Replace them with FUERTE's own photography when available, keeping the same file names.

## Languages

English and Greek, switched from the **EN / ΕΛ** control in the navigation bar. The first visit follows the browser language, and the choice is remembered in `localStorage`. Switching drops a curtain over the page, swaps the content and restores the scroll position. All text lives in `src/i18n/en.js` and `src/i18n/el.js`.

Cormorant and Montserrat have no Greek letters, so Greek text falls back to EB Garamond and Manrope, which have a similar look.

## Taste quiz

`src/data/quiz.js` holds the questions and scoring. Each answer nudges a taste profile (acidity, body, sweetness, bitterness) and adds points for coffee categories, such as the briki pointing to Greek coffee. The recommendation is the coffee whose profile is closest to the visitor's, plus that category bonus. Every coffee in the catalogue can be recommended.

## Sections and motion

| Section | Animations |
| --- | --- |
| Preloader | Counter, spinning bean, staggered curtain reveal |
| Nav | Glass bar that hides on scroll down and returns on scroll up; EN / ΕΛ language switcher with a sliding pill; cart badge bounce |
| Hero | Masked word reveal, floating bags, steaming cup, orbiting beans, rotating text ring, pointer-driven 3D tilt, scroll parallax, magnetic buttons |
| Marquee | Two opposing rows that speed up and skew with scroll velocity |
| Shop | GSAP Flip filtering, 3D tilt cards with spotlight, bag lift on hover, add-to-cart bean that flies to the cart icon |
| Story | Year counter, word-by-word text highlight on scroll, timeline drawn as you scroll, hover-reactive cards |
| The craft | Pinned horizontal scroll with progress bar, roast curve drawn on scroll, pulsing rings |
| Taste quiz | Six questions with animated options and a progress bar; the result shows a bean burst, a match ring, a bag flip and a radar chart comparing your taste with the recommended coffee; the alternatives swap in with a morph |
| Wholesale / footer | Card that scales in on scroll, parallax cup, letter-by-letter wordmark |

Brand facts (since 1997 as "BEST", 100% Arabica, a roast profile per blend, espresso / single-origin / Greek / filter ranges) come from fuerte.gr's public description. **Product names, tasting notes, prices, email and social links are placeholders** — replace them in `src/data/content.js`, `src/i18n/en.js`, `src/i18n/el.js` and `src/components/Footer.jsx` with the real catalogue.

Screenshots are in [`screenshots/`](screenshots).
