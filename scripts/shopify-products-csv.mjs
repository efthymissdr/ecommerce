// Builds a Shopify product import file for the 9 FUERTE coffees, from the
// same data the site uses. Run: node scripts/shopify-products-csv.mjs
// Output: shopify/products-import.csv (Shopify admin → Products → Import).
// Prices are the site's placeholders: review them in Shopify after importing.
import { writeFileSync, mkdirSync } from 'node:fs'
import { localizedProducts, productOptions, priceFor } from '../src/data/content.js'

const products = localizedProducts({ code: 'el' })

// Greek option names and values, as shown on the product page.
const SIZE = 'Συσκευασία'
const ROAST = 'Καβούρδισμα'
const GRIND = 'Άλεσμα'
const roastLabel = { roasted: 'Καβουρδισμένος', green: 'Ακαβούρδιστος (πράσινος)' }
const grindLabel = { whole: 'Ολόκληρος κόκκος', espresso: 'Espresso', moka: 'Καφετιέρα moka', filter: 'Φίλτρου', press: 'Γαλλική πρέσα' }
const tagFor = { single: 'Μονής προέλευσης', blend: 'Blend' }

const columns = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value', 'Option3 Name', 'Option3 Value',
  'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Policy', 'Variant Fulfillment Service',
  'Variant Price', 'Variant Requires Shipping', 'Variant Taxable', 'Variant Weight Unit', 'Status',
]
const cell = (v) => {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const rows = []
for (const p of products) {
  const o = productOptions(p)
  const hasRoast = o.roasts.length > 1
  const combos = []
  for (const size of o.sizes) {
    for (const roast of o.roasts) {
      // Green coffee is sold as whole beans only.
      for (const grind of roast === 'green' ? ['whole'] : o.grinds) combos.push({ size, roast, grind })
    }
  }
  combos.forEach((c, i) => {
    const first = i === 0
    const opts = hasRoast
      ? [[SIZE, c.size.label], [ROAST, roastLabel[c.roast]], [GRIND, grindLabel[c.grind]]]
      : [[SIZE, c.size.label], [GRIND, grindLabel[c.grind]], ['', '']]
    rows.push({
      Handle: p.id,
      Title: first ? p.name : '',
      'Body (HTML)': first ? p.story.body.map((t) => `<p>${t}</p>`).join('') : '',
      Vendor: first ? 'FUERTE' : '',
      Type: first ? 'Καφές' : '',
      Tags: first ? [tagFor[p.category], p.airscape && 'Airscape'].filter(Boolean).join(', ') : '',
      Published: first ? 'TRUE' : '',
      'Option1 Name': first ? opts[0][0] : '', 'Option1 Value': opts[0][1],
      'Option2 Name': first ? opts[1][0] : '', 'Option2 Value': opts[1][1],
      'Option3 Name': first ? opts[2][0] : '', 'Option3 Value': opts[2][1],
      'Variant SKU': `FUERTE-${p.id}-${c.size.id}-${c.roast}-${c.grind}`.toUpperCase(),
      'Variant Grams': c.size.id,
      'Variant Inventory Tracker': '',
      'Variant Inventory Policy': 'deny',
      'Variant Fulfillment Service': 'manual',
      'Variant Price': priceFor(p, c.size.mult, c.roast).toFixed(2),
      'Variant Requires Shipping': 'TRUE',
      'Variant Taxable': 'TRUE',
      'Variant Weight Unit': 'g',
      Status: first ? 'active' : '',
    })
  })
}

mkdirSync('shopify', { recursive: true })
writeFileSync('shopify/products-import.csv', [columns.join(','), ...rows.map((r) => columns.map((c) => cell(r[c])).join(','))].join('\n') + '\n')
console.log(`${products.length} products, ${rows.length} variants → shopify/products-import.csv`)
