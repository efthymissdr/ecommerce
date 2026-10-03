// Brand facts come from fuerte.gr's public description. Product names, prices and
// contact details are placeholders to be replaced with the real catalogue.
// Translatable product text (name, kicker, notes, pitch) lives in src/i18n/*.js.

export const categoryIds = ['all', 'espresso', 'single', 'greek', 'filter']

const catalogue = [
  { id: 'classico', category: 'espresso', roast: 3, price: 9.9, weight: '250g', bag: '#c8a15a', ink: '#0f0b08', profile: { acidity: 2, body: 4, sweetness: 4, bitterness: 3 } },
  { id: 'intenso', category: 'espresso', roast: 4, price: 10.5, weight: '250g', bag: '#1c1917', ink: '#c8a15a', profile: { acidity: 1, body: 5, sweetness: 3, bitterness: 4 } },
  { id: 'ethiopia', category: 'single', roast: 1, price: 13.9, weight: '250g', bag: '#e7dccb', ink: '#7c2d12', profile: { acidity: 5, body: 2, sweetness: 4, bitterness: 1 } },
  { id: 'colombia', category: 'single', roast: 2, price: 12.5, weight: '250g', bag: '#7c2d12', ink: '#f5efe6', profile: { acidity: 4, body: 3, sweetness: 4, bitterness: 2 } },
  { id: 'brazil', category: 'single', roast: 3, price: 11.5, weight: '250g', bag: '#3f6212', ink: '#f5efe6', profile: { acidity: 2, body: 4, sweetness: 5, bitterness: 2 } },
  { id: 'greek', category: 'greek', roast: 3, price: 5.9, weight: '200g', bag: '#1e3a5f', ink: '#f5efe6', profile: { acidity: 2, body: 4, sweetness: 3, bitterness: 3 } },
  { id: 'filter', category: 'filter', roast: 2, price: 8.9, weight: '250g', bag: '#a16207', ink: '#f5efe6', profile: { acidity: 3, body: 3, sweetness: 4, bitterness: 2 } },
]

// Merge the language-independent catalogue with the active dictionary.
export const localizedProducts = (t) => catalogue.map((p) => ({ ...p, ...t.products[p.id] }))

export const axes = ['acidity', 'body', 'sweetness', 'bitterness']
