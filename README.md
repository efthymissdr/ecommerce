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

## Product pages

Each coffee has a page at `/products/<id>` (for example `/products/classico`). The shop cards and the quiz result link to it. From top to bottom:

1. **Buy area.** The floating product image stays in view on the left, with views for the bag, beans and cup. On the right are size, roasted or green (unroasted), grind and quantity, plus Add to cart. The price updates with the options. Green coffee is whole-bean only, and Greek coffee comes ground for the briki. On phones, a sticky add-to-cart bar appears once the main button scrolls away.
2. **Story.** Each product's own story (`products.<id>.story` in `src/i18n/*.js`).
3. **Characteristics.** Origin, region, process, variety, altitude, roast level, tasting notes, best brewing methods and the taste-profile chart.
4. **Photo carousel.** Drag or swipe, arrows, dots, keyboard arrows, and autoplay that pauses on hover or focus and when off screen.

Sizes, prices, grinds and brewing methods are set up in `productOptions` and `priceFor` in `src/data/content.js`. They are placeholders until Shopify variants replace them. The site is a single-page app, so the host must serve `index.html` for every path (on Netlify, `/* /index.html 200`; on Vercel, a rewrite to `/index.html`).

## Wholesale page

`/wholesale` (Χονδρική in the menu) has four sections: Private Label, Greek coffee, Office Coffee Solutions, and Professional solutions (coffee machine and accessory rental). A sticky tab bar jumps between them and highlights the current section. Each section's "Ask about this" button scrolls to an enquiry form with that topic preselected. The form asks for the business type, existing equipment and monthly coffee consumption, then emails the enquiry through [Web3Forms](https://web3forms.com) (free, up to 250 emails a month, no server). The email starts with one sentence that sums up the customer ("Ο/Η πελάτης … της επιχείρησης … διατηρεί … καταναλώνει …"), then the customer's message and a short summary. "Reply" in the inbox answers the customer directly. The text is put together by `composeEnquiry` in `src/lib/enquiry.js`. The phone field has a searchable country code picker with flags (`src/components/PhoneField.jsx`, countries in `src/data/countries.js`, flag images from flag-icons, MIT); the email shows the number with its code and country.

Enquiries currently go to efthymis.sdr@gmail.com, the inbox the access key in `src/lib/enquiry.js` was created with. To send them elsewhere, create a new key at web3forms.com with that inbox and replace it there (or set `VITE_WEB3FORMS_KEY` in the hosting environment, which takes priority). Without a key, the form opens the visitor's email app addressed to `wholesaleEmail` in `src/data/wholesale.js`, with the same text.

All the page text (EL and EN) is in `src/data/wholesale.js`. To add a category, add an entry with the same `id` to `sections` in both languages, and it gets its own section, tab and form option.

## Customer accounts (demo, ready for Shopify)

The account icon in the menu opens a side panel with **Log in** and **Sign up** forms, including validation, show/hide password, a password-strength bar, "forgot password" and terms and newsletter checkboxes. Once logged in, the icon shows the customer's initial, and the panel shows their points and links to the account page.

`/account` has four tabs:
- **Overview:** points, orders and addresses at a glance, the latest order and the customer's details.
- **Orders:** status filter, expandable details (items, address, payment, totals, points earned) and "Order again", which adds the items to the cart.
- **Addresses:** add, edit, delete and set default, with Greek postal code and phone checks.
- **Points:** balance, progress to the next reward, how it works, and history.

**Demo customer:** `demo@fuerte.gr` / `Fuerte2026!` (Γιώργος Παπαδόπουλος, with 4 orders, 2 addresses and 80 points). The login panel also has a one-click "Log in with the demo account" button. Remove both (`demoUser` in `src/account/service.js` and the button in `AuthPanel.jsx`) when Shopify is connected.

**No backend yet.** All of this talks only to `src/account/service.js`. Right now that file is a browser-only demo: accounts live in `localStorage`, any new email logs in to a sample account with demo orders, and nothing leaves the device. Each function there is documented with the Shopify call that replaces it: the Customer Account API for login, customer, orders and addresses. Points need a loyalty app, because Shopify has no built-in points. The points rules (`pointsRules`) are examples. UI text is in `src/account/text.js`.

## Shopify

Cart lines already store the chosen variant (`{ id, size, roast, grind, qty }` in `src/App.jsx`), ready to map onto a Storefront API cart. Customer accounts: see above and `src/config.js`.

## Photos

Background photos are in `public/img` as WebP. The hero uses roasted coffee beans, the quiz uses coffee cups, and the story section uses sacks of green coffee. Each sits under a brown tint for readable text and moves with a slow parallax (`PhotoBg` in `src/components/ui.jsx`). They come from the MIT-licensed [Start Bootstrap Business Casual](https://github.com/StartBootstrap/startbootstrap-business-casual) theme, which bundles them from Unsplash. Replace them with FUERTE's own photography when available, keeping the same file names.

## Languages

English and Greek, switched from the **EN / ΕΛ** control in the navigation bar. The first visit follows the browser language, and the choice is remembered in `localStorage`. Switching drops a curtain over the page, swaps the content and restores the scroll position. All text lives in `src/i18n/en.js` and `src/i18n/el.js`.

Cormorant and Montserrat have no Greek letters, so Greek text falls back to EB Garamond and Manrope, which have a similar look.

## Taste quiz

The questions, answers and points come from the FUERTE scoring sheet and are in `src/data/quiz.js`. Each row there is one answer, with points for the nine coffees in the sheet's column order: Colombia, Costa Rica, Brazil, Green, Ethiopia, Honduras, Rwanda, Yellow, Red.

1. Each answer gives every coffee its points from the sheet.
2. The points from the five answers are added up per coffee. The coffee with the most points is the recommendation, and the next two are the alternatives.
3. Match % = points ÷ 25 (the maximum, 5 questions × 5 points), shown as a percentage.
4. On equal points, the coffee whose characteristics (from the product sheet) are closest to the visitor's answers wins.

To change the scoring, edit the numbers in `quiz.js`. The coffees' characteristics (intensity, acidity, sweetness, body, fruity, chocolatey) are in `src/data/content.js`. The product descriptions, tasting notes and "best for" brewing methods are generated from those numbers and from the quiz's question-1 points.

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

Brand facts (since 1997 as "BEST", 100% Arabica, a roast profile per blend) come from fuerte.gr's public description. The coffees and their characteristics come from the FUERTE product sheet. **Prices, pack colours, email and social links are placeholders** — replace them in `src/data/content.js`, `src/i18n/en.js`, `src/i18n/el.js` and `src/components/Footer.jsx` with the real catalogue.

Screenshots are in [`screenshots/`](screenshots).
