import { bestFor } from './quiz.js'

// FUERTE catalogue. Names and the six taste characteristics (1–5) come from the
// FUERTE product sheet. Prices and pack colours are placeholders until the real
// catalogue (Shopify) is connected. Descriptions are generated from the
// characteristics below, so nothing is invented about the coffees.

// Shop groups and the filters inside each. A product belongs to one group and
// can carry several filter tags (e.g. a single origin that is also a microlot).
// TODO(shopify): map these to Shopify collections / product tags.
export const shopGroups = [
  { id: 'coffee', filters: ['all', 'single', 'greek', 'blend', 'microlot', 'filter', 'decaf'] },
  { id: 'equipment', filters: ['all', 'machines', 'grinders', 'cleaning', 'parts', 'scales', 'barista'] },
  { id: 'more', filters: ['all', 'tea', 'cocoa', 'instant'] },
]
export const inFilter = (p, group, filter) => p.group === group && (filter === 'all' || p.tags.includes(filter))

// Order of the characteristics on the charts.
export const axes = ['intensity', 'acidity', 'sweetness', 'body', 'fruity', 'chocolatey']

const prof = (intensity, acidity, sweetness, body, fruity, chocolatey) => ({ intensity, acidity, sweetness, body, fruity, chocolatey })

const catalogue = [
  { id: 'colombia', name: 'Colombia Bucaramanga SHG EP', category: 'single', country: 'colombia', lot: 'Bucaramanga', grade: 'SHG EP', price: 12.9, photo: { name: 'pack-colombia', small: 91, large: 346 }, bag: '#7c2d12', ink: '#f5efe6', profile: prof(4, 3, 3, 4, 2, 4) },
  { id: 'costarica', name: 'Costa Rica Pastora Estate Tarrazu SHB', category: 'single', country: 'costarica', lot: 'Pastora Estate, Tarrazú', grade: 'SHB', price: 12.9, bag: '#0f5257', ink: '#f5efe6', profile: prof(3, 3, 4, 3, 3, 3) },
  { id: 'brazil', name: 'Brazil Carmo Estate', category: 'single', country: 'brazil', lot: 'Carmo Estate', price: 11.9, bag: '#a16207', ink: '#f5efe6', profile: prof(3, 2, 4, 4, 1, 5) },
  { id: 'ethiopia', name: 'Ethiopia Aricha Wubanchi', category: 'single', country: 'ethiopia', lot: 'Aricha Wubanchi', price: 13.9, photo: { name: 'pack-ethiopia', small: 92, large: 341 }, bag: '#e7dccb', ink: '#7c2d12', profile: prof(4, 5, 4, 3, 5, 1) },
  { id: 'honduras', name: 'Honduras La Tina', category: 'single', country: 'honduras', lot: 'La Tina', price: 12.9, bag: '#1e3a5f', ink: '#f5efe6', profile: prof(4, 5, 3, 4, 4, 2) },
  { id: 'rwanda', name: 'Rwanda', category: 'single', country: 'rwanda', price: 12.9, bag: '#5b2a86', ink: '#f5efe6', profile: prof(3, 3, 4, 2, 3, 1) },
  { id: 'yellow', name: 'Yellow Blend', category: 'blend', price: 9.9, bag: '#f2c200', ink: '#17110c', profile: prof(3, 2, 4, 3, 1, 3) },
  { id: 'red', name: 'Red Blend', category: 'blend', price: 9.9, bag: '#d7261e', ink: '#f5efe6', profile: prof(5, 2, 3, 5, 1, 4) },
  { id: 'green', name: 'Green Blend', category: 'blend', price: 9.9, bag: '#2e9e3e', ink: '#f5efe6', profile: prof(4, 1, 2, 4, 1, 4) },
]

// ---------- text generated from the characteristics ----------

const words = {
  en: {
    countries: { colombia: 'Colombia', costarica: 'Costa Rica', brazil: 'Brazil', ethiopia: 'Ethiopia', honduras: 'Honduras', rwanda: 'Rwanda' },
    from: (c) => `From ${words.en.countries[c]}`,
    blendTitle: 'A FUERTE house blend',
    blend: 'Blend',
    kickerSingle: (c) => `Single origin · ${words.en.countries[c]}`,
    kickerBlend: 'FUERTE blend',
    traits: { fruity: 'Fruit notes', chocolatey: 'Chocolate notes', sweetness: 'Sweetness', acidity: 'Bright acidity', body: 'Full body', intensity: 'Intensity', smooth: 'Smooth', light: 'Light body', balanced: 'Balanced' },
    intensity: ['A mild', 'A mild', 'A balanced', 'A rich', 'A bold'],
    acidity: ['very low acidity', 'low acidity', 'medium acidity', 'bright acidity', 'vivid, high acidity'],
    body: ['a light body', 'a light body', 'a medium body', 'a full body', 'a heavy, full body'],
    flavour: { fruity: 'fruit-forward notes', chocolatey: 'chocolate notes', sweetness: 'a sweet finish', clean: 'a clean finish' },
    pitch: (i, a, b, f) => `${i} cup with ${a}, ${b} and ${f}.`,
    brews: { espresso: 'espresso', freddo: 'freddo espresso', latte: 'cappuccino/latte', filter: 'filter coffee' },
    singleP1: (p, c, lot, traits) => `${p.name} is a single-origin coffee from ${words.en.countries[c]}${lot ? ` (${lot})` : ''}. We roast it to bring out its character: ${traits}.`,
    blendP1: (p, traits) => `${p.name} is one of FUERTE's house blends, put together for the same cup every time: ${traits}.`,
    p2: (pitch, brews) => `${pitch} Best enjoyed as ${brews}.`,
  },
  el: {
    countries: { colombia: 'Κολομβία', costarica: 'Κόστα Ρίκα', brazil: 'Βραζιλία', ethiopia: 'Αιθιοπία', honduras: 'Ονδούρα', rwanda: 'Ρουάντα' },
    // "from" with the right article for each country.
    fromAcc: { colombia: 'την Κολομβία', costarica: 'την Κόστα Ρίκα', brazil: 'τη Βραζιλία', ethiopia: 'την Αιθιοπία', honduras: 'την Ονδούρα', rwanda: 'τη Ρουάντα' },
    from: (c) => `Από ${words.el.fromAcc[c]}`,
    blendTitle: 'Ένα χαρμάνι της FUERTE',
    blend: 'Χαρμάνι',
    kickerSingle: (c) => `Μονής προέλευσης · ${words.el.countries[c]}`,
    kickerBlend: 'Χαρμάνι FUERTE',
    traits: { fruity: 'Φρουτώδεις νότες', chocolatey: 'Νότες σοκολάτας', sweetness: 'Γλυκύτητα', acidity: 'Ζωηρή οξύτητα', body: 'Γεμάτο σώμα', intensity: 'Ένταση', smooth: 'Απαλή γεύση', light: 'Ελαφρύ σώμα', balanced: 'Ισορροπημένη γεύση' },
    intensity: ['Ένα ήπιο', 'Ένα ήπιο', 'Ένα ισορροπημένο', 'Ένα πλούσιο', 'Ένα δυνατό'],
    acidity: ['πολύ χαμηλή οξύτητα', 'χαμηλή οξύτητα', 'μέτρια οξύτητα', 'ζωηρή οξύτητα', 'έντονη, υψηλή οξύτητα'],
    body: ['ελαφρύ σώμα', 'ελαφρύ σώμα', 'μέτριο σώμα', 'γεμάτο σώμα', 'βαρύ, γεμάτο σώμα'],
    flavour: { fruity: 'φρουτώδεις νότες', chocolatey: 'νότες σοκολάτας', sweetness: 'γλυκιά επίγευση', clean: 'καθαρή επίγευση' },
    pitch: (i, a, b, f) => `${i} φλιτζάνι με ${a}, ${b} και ${f}.`,
    brews: { espresso: 'espresso', freddo: 'freddo espresso', latte: 'cappuccino/latte', filter: 'καφέ φίλτρου' },
    singleP1: (p, c, lot, traits) => `Ο ${p.name} είναι μονοποικιλιακός καφές από ${words.el.fromAcc[c]}${lot ? ` (${lot})` : ''}. Τον καβουρδίζουμε ώστε να αναδεικνύεται ο χαρακτήρας του: ${traits}.`,
    blendP1: (p, traits) => `Το ${p.name} είναι ένα από τα χαρμάνια της FUERTE, φτιαγμένο για την ίδια γεύση σε κάθε φλιτζάνι: ${traits}.`,
    // Single origins are "ο καφές" (τον), blends are "το χαρμάνι" (το).
    p2: (pitch, brews, single) => `${pitch} Απολαύστε ${single ? 'τον' : 'το'} ως ${brews}.`,
  },
}

// Up to three standout traits (score 4–5), strongest first.
function traitsOf(p, w) {
  const order = ['fruity', 'chocolatey', 'sweetness', 'acidity', 'body', 'intensity']
  const top = order.filter((k) => p.profile[k] >= 4).sort((a, b) => p.profile[b] - p.profile[a]).slice(0, 3)
  if (top.length < 3 && p.profile.acidity <= 2) top.push('smooth')
  if (top.length < 3 && p.profile.body <= 2) top.push('light')
  // Nothing stands out (all around 3): that is the character.
  if (top.length < 2) top.push('balanced')
  return top.map((k) => w.traits[k])
}

function describe(p, lang) {
  const w = words[lang] || words.en
  const pr = p.profile
  const notes = traitsOf(p, w)
  const flavour = pr.fruity >= 4 ? 'fruity' : pr.chocolatey >= 4 ? 'chocolatey' : pr.sweetness >= 4 ? 'sweetness' : 'clean'
  const pitch = w.pitch(w.intensity[pr.intensity - 1], w.acidity[pr.acidity - 1], w.body[pr.body - 1], w.flavour[flavour])
  // "a, b or c" in the right language.
  const brews = new Intl.ListFormat(lang === 'el' ? 'el' : 'en', { type: 'disjunction' }).format(bestFor(p.id).map((b) => w.brews[b]))
  const traitsText = notes.join(', ').toLowerCase()
  const single = p.category === 'single'
  return {
    kicker: single ? w.kickerSingle(p.country) : w.kickerBlend,
    // Short label printed on the bag illustration.
    bagName: single ? w.countries[p.country] : p.name,
    notes,
    pitch,
    facts: {
      origin: single ? w.countries[p.country] : w.blend,
      ...(p.lot && { lot: p.lot }),
      ...(p.grade && { grade: p.grade }),
    },
    story: {
      title: single ? w.from(p.country) : w.blendTitle,
      body: [single ? w.singleP1(p, p.country, p.lot, traitsText) : w.blendP1(p, traitsText), w.p2(pitch, brews, single)],
    },
    roast: pr.intensity, // dots on the bag and cards show intensity
    weight: '250g',
  }
}

// Catalogue merged with text in the active language (t.code is 'en' or 'el').
export const localizedProducts = (t) => catalogue.map((p) => ({ group: 'coffee', tags: [p.category], ...p, ...describe(p, t.code) }))

// ---------- product page options (placeholders until Shopify variants exist) ----------

const sizeSets = {
  250: [{ id: '250', label: '250g', mult: 1 }, { id: '500', label: '500g', mult: 1.9 }, { id: '1000', label: '1kg', mult: 3.6 }],
  200: [{ id: '200', label: '200g', mult: 1 }, { id: '500', label: '500g', mult: 2.3 }, { id: '1000', label: '1kg', mult: 4.4 }],
}
const grindsAll = ['whole', 'espresso', 'moka', 'filter', 'press']

export function productOptions(p) {
  return {
    sizes: sizeSets[parseInt(p.weight, 10)] || sizeSets[250],
    // Green (unroasted) beans are offered for single origins only.
    roasts: p.category === 'single' ? ['roasted', 'green'] : ['roasted'],
    grinds: grindsAll,
    brew: bestFor(p.id),
  }
}

// x.90 pricing: round to the euro, then knock off ten cents.
export function priceFor(p, sizeMult, roast) {
  const raw = p.price * sizeMult * (roast === 'green' ? 0.85 : 1)
  return sizeMult === 1 && roast !== 'green' ? p.price : Math.max(1, Math.round(raw) - 0.1)
}
