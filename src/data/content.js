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

// ---------- product page options (placeholders until Shopify variants exist) ----------

const sizeSets = {
  250: [{ id: '250', label: '250g', mult: 1 }, { id: '500', label: '500g', mult: 1.9 }, { id: '1000', label: '1kg', mult: 3.6 }],
  200: [{ id: '200', label: '200g', mult: 1 }, { id: '500', label: '500g', mult: 2.3 }, { id: '1000', label: '1kg', mult: 4.4 }],
}
const grindsAll = ['whole', 'espresso', 'moka', 'filter', 'press']
const brewBy = {
  classico: ['espresso', 'moka', 'press'],
  intenso: ['espresso', 'moka'],
  ethiopia: ['filter', 'press', 'espresso'],
  colombia: ['filter', 'espresso', 'press'],
  brazil: ['espresso', 'moka', 'press'],
  greek: ['briki'],
  filter: ['filter', 'press'],
}

export function productOptions(p) {
  const greek = p.category === 'greek'
  return {
    sizes: sizeSets[parseInt(p.weight, 10)] || sizeSets[250],
    // Green (unroasted) beans make no sense for a pre-ground Greek coffee.
    roasts: greek ? ['roasted'] : ['roasted', 'green'],
    grinds: greek ? ['briki'] : grindsAll,
    brew: brewBy[p.id] || [],
  }
}

// x.90 pricing: round to the euro, then knock off ten cents.
export function priceFor(p, sizeMult, roast) {
  const raw = p.price * sizeMult * (roast === 'green' ? 0.85 : 1)
  return sizeMult === 1 && roast !== 'green' ? p.price : Math.max(1, Math.round(raw) - 0.1)
}
