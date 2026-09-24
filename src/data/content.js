// Brand facts come from fuerte.gr's public description. Product names, prices and
// contact details below are placeholders to be replaced with the real catalogue.

export const categories = [
  { id: 'all', label: 'All coffees' },
  { id: 'espresso', label: 'Espresso blends' },
  { id: 'single', label: 'Single origins' },
  { id: 'greek', label: 'Greek coffee' },
  { id: 'filter', label: 'Filter' },
]

export const products = [
  {
    id: 'classico', category: 'espresso', name: 'Classico', kicker: 'Espresso Blend',
    notes: ['Milk chocolate', 'Hazelnut', 'Caramel'], roast: 3, price: 9.9, weight: '250g',
    bag: '#c8a15a', ink: '#0f0b08',
    profile: { acidity: 2, body: 4, sweetness: 4, bitterness: 3 },
  },
  {
    id: 'intenso', category: 'espresso', name: 'Intenso', kicker: 'Espresso Blend',
    notes: ['Dark cocoa', 'Molasses', 'Toasted almond'], roast: 4, price: 10.5, weight: '250g',
    bag: '#1c1917', ink: '#c8a15a',
    profile: { acidity: 1, body: 5, sweetness: 3, bitterness: 4 },
  },
  {
    id: 'ethiopia', category: 'single', name: 'Ethiopia', kicker: 'Yirgacheffe · Washed',
    notes: ['Jasmine', 'Bergamot', 'Peach'], roast: 1, price: 13.9, weight: '250g',
    bag: '#e7dccb', ink: '#7c2d12',
    profile: { acidity: 5, body: 2, sweetness: 4, bitterness: 1 },
  },
  {
    id: 'colombia', category: 'single', name: 'Colombia', kicker: 'Huila · Washed',
    notes: ['Red apple', 'Panela', 'Orange zest'], roast: 2, price: 12.5, weight: '250g',
    bag: '#7c2d12', ink: '#f5efe6',
    profile: { acidity: 4, body: 3, sweetness: 4, bitterness: 2 },
  },
  {
    id: 'brazil', category: 'single', name: 'Brazil', kicker: 'Cerrado · Natural',
    notes: ['Peanut', 'Chocolate', 'Brown sugar'], roast: 3, price: 11.5, weight: '250g',
    bag: '#3f6212', ink: '#f5efe6',
    profile: { acidity: 2, body: 4, sweetness: 5, bitterness: 2 },
  },
  {
    id: 'greek', category: 'greek', name: 'Paradosiakos', kicker: 'Greek Coffee · Medium',
    notes: ['Roasted grain', 'Cocoa', 'Rich kaimaki'], roast: 3, price: 5.9, weight: '200g',
    bag: '#1e3a5f', ink: '#f5efe6',
    profile: { acidity: 2, body: 4, sweetness: 3, bitterness: 3 },
  },
  {
    id: 'filter', category: 'filter', name: 'House Filter', kicker: 'Filter Blend',
    notes: ['Stone fruit', 'Honey', 'Clean finish'], roast: 2, price: 8.9, weight: '250g',
    bag: '#a16207', ink: '#f5efe6',
    profile: { acidity: 3, body: 3, sweetness: 4, bitterness: 2 },
  },
]

export const steps = [
  {
    n: '01', title: 'Sourcing',
    body: 'We select 100% Arabica origins for their distinct character — aroma, flavour and body — from farms we know by name.',
  },
  {
    n: '02', title: 'Blending',
    body: 'Components are combined in proportions designed to lift each other, so every origin keeps its individual brilliance.',
  },
  {
    n: '03', title: 'Roast profiling',
    body: 'Every blend gets its own roast profile — time, temperature and development tuned to that coffee alone.',
  },
  {
    n: '04', title: 'Consistency',
    body: 'Cupped daily. The same cup, year after year, irrespective of seasonal fluctuations in the green coffee.',
  },
]

export const milestones = [
  { year: '1997', title: 'BEST is born', body: 'We start roasting and trading coffee, with our own Greek and filter blends.' },
  { year: 'Then', title: 'Espresso & single origins', body: 'Our range grows with unique espresso blends and certified single-origin coffees.' },
  { year: 'Now', title: 'FUERTE coffee roasters', body: 'The whole line is reborn under one name — strong in character, precise in the roast.' },
]
