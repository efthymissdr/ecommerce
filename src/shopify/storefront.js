import { shopify } from './config'

// Minimal Storefront API client (public token, safe in the browser).
export async function storefront(query, variables = {}) {
  const res = await fetch(`https://${shopify.domain}/api/${shopify.apiVersion}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': shopify.storefrontToken },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`Storefront API ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '))
  return json.data
}

// Throws on user errors from a mutation payload ({ userErrors: [{ message }] }).
export function checkUserErrors(payload) {
  const errs = payload?.userErrors || []
  if (errs.length) throw new Error(errs.map((e) => e.message).join('; '))
  return payload
}

// A story slide can be a "Story slide" metaobject (image, text, title) or just an image file.
const SLIDE = `
  ... on MediaImage { image { url altText } }
  ... on Metaobject { fields { key type value reference { ... on MediaImage { image { url altText } } } } }`

const PRODUCTS = `
query Products($lang: LanguageCode, $country: CountryCode, $cursor: String) @inContext(language: $lang, country: $country) {
  products(first: 100, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle title description productType vendor tags availableForSale
      featuredImage { url altText }
      images(first: 6) { nodes { url altText } }
      options { name values }
      priceRange { minVariantPrice { amount currencyCode } }
      taste: metafields(identifiers: [
        { namespace: "custom", key: "intensity" }, { namespace: "custom", key: "acidity" }, { namespace: "custom", key: "sweetness" },
        { namespace: "custom", key: "body" }, { namespace: "custom", key: "fruity" }, { namespace: "custom", key: "chocolatey" }
      ]) { key value }
      story: metafields(identifiers: [
        { namespace: "custom", key: "story_slides" }, { namespace: "custom", key: "story_slide" }, { namespace: "custom", key: "story" },
        { namespace: "custom", key: "story_photos" }, { namespace: "custom", key: "story_images" }
      ]) {
        key type value
        reference { ${SLIDE} }
        references(first: 10) { nodes { ${SLIDE} } }
      }
      variants(first: 100) {
        nodes { id title availableForSale price { amount currencyCode } selectedOptions { name value } image { url } }
      }
    }
  }
}`

// Every published product in the Headless storefront, in the page language.
export async function fetchProducts(lang) {
  const all = []
  let cursor = null
  for (let page = 0; page < 10; page++) {
    const data = await storefront(PRODUCTS, { lang: lang === 'el' ? 'EL' : 'EN', country: shopify.country, cursor })
    all.push(...data.products.nodes)
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  return all
}

// Numeric shop id (from "gid://shopify/Shop/123"), needed for customer login.
export async function fetchShopId() {
  const data = await storefront('{ shop { id } }')
  return data.shop.id.split('/').pop()
}
