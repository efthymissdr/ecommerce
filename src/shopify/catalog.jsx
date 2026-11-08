import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLang } from '../i18n'
import { localizedProducts, shopGroups, axes, redescribe } from '../data/content'
import { shopify } from './config'
import { fetchProducts } from './storefront'

// The shop catalogue. Shopify is the source of truth for what is sold
// (products, prices, variants, availability, photos). FUERTE's design data in
// src/data/content.js (taste profile, quiz, story, bag colours, Airscape,
// pack photos) is attached to the Shopify product it matches. Shopify products
// without a match are shown as they are, filed under a group/filter by their
// tags. If the store is unreachable or has no products, the demo catalogue is used.

const plain = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Words that identify each designed coffee in a Shopify handle or title.
const matchWords = {
  colombia: ['colombia', 'κολομβια'],
  costarica: ['costa rica', 'κοστα ρικα'],
  brazil: ['brazil', 'βραζιλια'],
  ethiopia: ['ethiopia', 'ethiopian', 'αιθιοπια'],
  honduras: ['honduras', 'ονδουρα'],
  rwanda: ['rwanda', 'ρουαντα'],
  yellow: ['yellow', 'κιτρινο'],
  red: ['red', 'κοκκινο'],
  green: ['green', 'πρασινο'],
}
const blendWord = /\b(blend|χαρμανι)/

// Shopify tags (or product type) → shop filter ids, in Greek or English.
const filterAliases = {
  single: ['single', 'single origin', 'single origins', 'μονης προελευσης', 'μονοποικιλιακος', 'μονοποικιλιακοι'],
  greek: ['greek', 'greek coffee', 'ελληνικος', 'ελληνικος καφες'],
  blend: ['blend', 'blends', 'χαρμανι', 'χαρμανια'],
  microlot: ['microlot', 'micro lot'],
  filter: ['filter', 'filter coffee', 'φιλτρου', 'καφες φιλτρου'],
  decaf: ['decaf', 'decaffeinated', 'ντεκαφεινε', 'χωρις καφεινη'],
  machines: ['machines', 'coffee machines', 'machine', 'μηχανες', 'μηχανες καφε', 'μηχανη καφε'],
  grinders: ['grinders', 'grinder', 'μυλοι', 'μυλος', 'μυλοι αλεσης'],
  cleaning: ['cleaning', 'καθαριστικα'],
  parts: ['parts', 'spare parts', 'ανταλλακτικα'],
  scales: ['scales', 'scale', 'ζυγαριες', 'ζυγαρια'],
  barista: ['barista', 'barista accessories', 'αξεσουαρ', 'αξεσουαρ μπαριστα'],
  tea: ['tea', 'τσαι'],
  cocoa: ['cocoa', 'κακαο'],
  instant: ['instant', 'instant coffee', 'στιγμιαιος', 'στιγμιαιος καφες'],
}
const aliasToFilter = Object.fromEntries(Object.entries(filterAliases).flatMap(([id, words]) => words.map((w) => [w, id])))
const groupOf = (filter) => shopGroups.find((g) => g.filters.includes(filter))?.id

function filtersFor(s) {
  return [...new Set([...s.tags, s.productType].map((x) => aliasToFilter[plain(x).trim()]).filter(Boolean))]
}

const money = (m) => Number(m?.amount ?? 0)

// Taste characteristics (1–5) from the product's custom.* metafields; only the ones filled in.
function tasteOf(s) {
  const out = {}
  for (const m of s.taste || []) {
    const v = Number(m?.value)
    if (m && axes.includes(m.key) && v >= 1 && v <= 5) out[m.key] = Math.round(v)
  }
  return out
}

// Story slides from the product's custom.story_slides metafield: a list of
// "Story slide" metaobjects with fields image (file), text (multi-line) and an
// optional title. Slides without an image or text are skipped.
function storyOf(s) {
  return (s.story?.references?.nodes || []).map((node) => {
    const f = Object.fromEntries((node?.fields || []).map((x) => [x.key, x]))
    const img = (f.image || f.photo)?.reference?.image
    const text = (f.text || f.description)?.value?.trim()
    return img && text ? { image: `${img.url}${img.url.includes('?') ? '&' : '?'}width=1200`, alt: img.altText || '', text, title: f.title?.value?.trim() || '' } : null
  }).filter(Boolean)
}

// What every product carries from Shopify, matched or not.
function shopifyPart(s) {
  const variants = s.variants.nodes.map((v) => ({
    id: v.id, title: v.title, available: v.availableForSale, price: money(v.price),
    options: Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value])), image: v.image?.url,
  }))
  // "Title / Default Title" means the product has no real options.
  const options = s.options.filter((o) => !(o.values.length === 1 && /default title/i.test(o.values[0])))
  const storySlides = storyOf(s)
  return {
    ...(storySlides.length && { storySlides }),
    handle: s.handle,
    price: money(s.priceRange.minVariantPrice),
    available: s.availableForSale,
    shopify: { id: s.id, handle: s.handle, title: s.title, description: s.description, options, variants, images: s.images.nodes.map((i) => i.url) },
  }
}

// A Shopify product without designed data: shown with its own title, photo and text.
function standalone(s) {
  const filters = filtersFor(s)
  const taste = tasteOf(s)
  const sentences = s.description.split(/(?<=[.!;])\s+/)
  return {
    id: s.handle,
    name: s.title,
    group: groupOf(filters[0]) || 'coffee',
    tags: filters.filter((f) => groupOf(f) === (groupOf(filters[0]) || 'coffee')),
    category: filters[0],
    kicker: s.productType || s.vendor || '',
    bagName: s.title,
    notes: [],
    pitch: sentences[0] || '',
    story: { title: s.title, body: s.description ? [s.description] : [] },
    facts: {},
    bag: '#3b2415',
    ink: '#f5efe6',
    weight: '',
    image: s.featuredImage?.url,
    ...(Object.keys(taste).length === axes.length && { profile: taste, roast: taste.intensity }),
    ...shopifyPart(s),
  }
}

// Attach Shopify data to the designed coffees, then add the remaining Shopify products.
export function mergeCatalogue(local, remote, lang) {
  const left = [...remote]
  const take = (test) => { const i = left.findIndex(test); return i < 0 ? null : left.splice(i, 1)[0] }
  const merged = []
  for (const p of local) {
    const s = take((s) => s.handle === p.id) || take((s) => {
      const text = plain(`${s.handle.replace(/-/g, ' ')} ${s.title}`)
      const word = matchWords[p.id]?.some((w) => new RegExp(`(^|\\s)${w}(\\s|$)`).test(text))
      return word && (p.category !== 'blend' || blendWord.test(text))
    })
    if (!s) continue
    // Keep the curated name, story and pack art; prices, options and stock come from Shopify.
    // Characteristics filled in Shopify win over the built-in ones, and the text follows them.
    const taste = tasteOf(s)
    const withTaste = Object.keys(taste).length ? redescribe({ ...p, profile: { ...p.profile, ...taste } }, lang) : p
    merged.push({ ...withTaste, ...shopifyPart(s), image: p.photo ? undefined : s.featuredImage?.url })
  }
  return [...merged, ...left.map(standalone)]
}

const CatalogContext = createContext({ products: null, source: 'loading' })

export function CatalogProvider({ children }) {
  const { lang } = useLang()
  const [state, setState] = useState({ lang: null, remote: null, source: 'loading' })

  useEffect(() => {
    if (!shopify.enabled) { setState({ lang, remote: [], source: 'demo' }); return }
    let live = true
    fetchProducts(lang)
      .then((remote) => live && setState({ lang, remote, source: remote.length ? 'shopify' : 'demo' }))
      .catch((err) => {
        console.warn('Shopify catalogue unavailable, using demo data:', err)
        if (live) setState({ lang, remote: [], source: 'demo' })
      })
    return () => { live = false }
  }, [lang])

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>
}

// Products for the current language: Shopify-backed when connected, demo otherwise.
// While Shopify is still loading, the demo catalogue is shown so the page never sits empty.
export function useProducts() {
  const { t } = useLang()
  const { remote, source } = useContext(CatalogContext)
  return useMemo(() => {
    const local = localizedProducts(t)
    return source === 'shopify' ? mergeCatalogue(local, remote, t.code) : local
  }, [t, remote, source])
}

export const useCatalogSource = () => useContext(CatalogContext).source
