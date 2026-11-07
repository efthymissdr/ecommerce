import { shopify } from './config'
import { fetchShopId, checkUserErrors } from './storefront'

// Customer Account API, as a public (PKCE) client running in the browser.
// The flow follows Shopify's Hydrogen implementation:
//   login    → https://shopify.com/authentication/{shopId}/oauth/authorize
//   callback → /account/callback exchanges the code at …/oauth/token
//   API      → https://shopify.com/{shopId}/account/customer/api/{version}/graphql
//   logout   → …/logout?id_token_hint=…&post_logout_redirect_uri=…
// Shopify only accepts the https origins listed in the Headless channel's
// Customer Account API settings (callback, JavaScript origin, logout).

const TOKENS = 'fuerte-customer-tokens'
const PENDING = 'fuerte-customer-login'
const SHOP_ID = 'fuerte-shop-id'
const SCOPE = 'openid email customer-account-api:full'
const CALLBACK_PATH = '/account/callback'

const read = (store, k) => { try { return JSON.parse(store.getItem(k)) } catch { return null } }
const write = (store, k, v) => { try { v == null ? store.removeItem(k) : store.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

async function shopId() {
  const cached = read(localStorage, SHOP_ID)
  if (cached) return cached
  const id = await fetchShopId()
  write(localStorage, SHOP_ID, id)
  return id
}
const authBase = (id) => `https://shopify.com/authentication/${id}`

// PKCE helpers.
const b64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const random = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)))
const challengeFor = async (verifier) => b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)))

export const isLoggedIn = () => !!read(localStorage, TOKENS)?.accessToken

// Sends the visitor to Shopify's login / sign-up page (email + one-time code).
export async function login({ returnTo = '/account', lang = 'el' } = {}) {
  const id = await shopId()
  const verifier = random(48)
  const state = random()
  const nonce = random()
  write(sessionStorage, PENDING, { verifier, state, nonce, returnTo })
  const url = new URL(`${authBase(id)}/oauth/authorize`)
  url.searchParams.set('client_id', shopify.customerClientId)
  url.searchParams.set('scope', SCOPE)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', `${window.location.origin}${CALLBACK_PATH}`)
  url.searchParams.set('state', state)
  url.searchParams.set('nonce', nonce)
  url.searchParams.set('code_challenge', await challengeFor(verifier))
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('locale', lang)
  window.location.assign(url.toString())
}

async function tokenRequest(id, fields) {
  const res = await fetch(`${authBase(id)}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: shopify.customerClientId, ...fields }),
  })
  if (!res.ok) throw new Error(`Customer login failed (${res.status})`)
  const json = await res.json()
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    idToken: json.id_token,
    expiresAt: Date.now() + (json.expires_in || 3600) * 1000,
  }
}

// Called on /account/callback. Returns the path to continue to.
export async function handleCallback(search) {
  const params = new URLSearchParams(search)
  const pending = read(sessionStorage, PENDING)
  write(sessionStorage, PENDING, null)
  if (params.get('error')) throw new Error(params.get('error_description') || params.get('error'))
  if (!pending || params.get('state') !== pending.state) throw new Error('Login state mismatch')
  const id = await shopId()
  const tokens = await tokenRequest(id, {
    grant_type: 'authorization_code',
    redirect_uri: `${window.location.origin}${CALLBACK_PATH}`,
    code: params.get('code'),
    code_verifier: pending.verifier,
  })
  write(localStorage, TOKENS, tokens)
  return pending.returnTo || '/account'
}

// A valid access token, refreshed two minutes before it expires; null if logged out.
async function accessToken() {
  const tokens = read(localStorage, TOKENS)
  if (!tokens?.accessToken) return null
  if (Date.now() < tokens.expiresAt - 120_000) return tokens.accessToken
  if (!tokens.refreshToken) { write(localStorage, TOKENS, null); return null }
  try {
    const next = await tokenRequest(await shopId(), { grant_type: 'refresh_token', refresh_token: tokens.refreshToken })
    write(localStorage, TOKENS, { ...next, refreshToken: next.refreshToken || tokens.refreshToken, idToken: next.idToken || tokens.idToken })
    return next.accessToken
  } catch {
    write(localStorage, TOKENS, null)
    return null
  }
}

export async function logout() {
  const tokens = read(localStorage, TOKENS)
  write(localStorage, TOKENS, null)
  if (!tokens?.idToken) return
  const url = new URL(`${authBase(await shopId())}/logout`)
  url.searchParams.set('id_token_hint', tokens.idToken)
  url.searchParams.set('post_logout_redirect_uri', `${window.location.origin}/`)
  window.location.assign(url.toString())
}

async function customerApi(query, variables = {}) {
  const token = await accessToken()
  if (!token) return null
  const res = await fetch(`https://shopify.com/${await shopId()}/account/customer/api/${shopify.apiVersion}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ query, variables }),
  })
  if (res.status === 401) { write(localStorage, TOKENS, null); return null }
  if (!res.ok) throw new Error(`Customer Account API ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '))
  return json.data
}

const ADDRESS = 'id firstName lastName company address1 address2 city zip phoneNumber countryCode'
const CUSTOMER = `
query Customer {
  customer {
    id firstName lastName creationDate
    emailAddress { emailAddress }
    phoneNumber { phoneNumber }
    defaultAddress { id }
    addresses(first: 20) { nodes { ${ADDRESS} } }
    orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
      nodes {
        id name number processedAt cancelledAt financialStatus fulfillmentStatus statusPageUrl
        totalPrice { amount } subtotal { amount } totalShipping { amount }
        shippingAddress { ${ADDRESS} }
        lineItems(first: 30) { nodes { title variantTitle quantity productId variantId image { url } price { amount } totalPrice { amount } } }
      }
    }
  }
}`

const amount = (m) => Number(m?.amount ?? 0)

// Shopify address → the shape the account page uses.
function fromAddress(a, defaultId) {
  return {
    id: a.id,
    name: [a.firstName, a.lastName].filter(Boolean).join(' '),
    street: a.address1 || '',
    floor: a.address2 || '',
    city: a.city || '',
    zip: a.zip || '',
    phone: a.phoneNumber || '',
    isDefault: a.id === defaultId,
  }
}

// Shopify wants phone numbers in international form; Greek numbers get +30.
const e164 = (phone) => {
  const digits = (phone || '').replace(/[^\d+]/g, '')
  if (!digits) return undefined
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('00')) return `+${digits.slice(2)}`
  return `+30${digits}`
}

function toAddressInput(a) {
  const [firstName, ...rest] = (a.name || '').trim().split(/\s+/)
  return {
    firstName: firstName || '',
    lastName: rest.join(' '),
    address1: a.street,
    address2: a.floor || '',
    city: a.city,
    zip: a.zip,
    phoneNumber: e164(a.phone),
    countryCode: 'GR',
  }
}

function orderStatus(o) {
  if (o.cancelledAt) return 'cancelled'
  if (o.fulfillmentStatus === 'FULFILLED') return 'shipped'
  return 'processing'
}

function fromOrder(o) {
  return {
    id: String(o.number || o.name.replace('#', '')),
    date: o.processedAt.slice(0, 10),
    status: orderStatus(o),
    financialStatus: o.financialStatus,
    statusPageUrl: o.statusPageUrl,
    shipping: amount(o.totalShipping),
    total: amount(o.totalPrice),
    address: o.shippingAddress ? fromAddress(o.shippingAddress) : null,
    items: o.lineItems.nodes.map((li) => ({
      shopifyProductId: li.productId,
      variantId: li.variantId,
      title: li.title,
      variantTitle: li.variantTitle,
      image: li.image?.url,
      qty: li.quantity,
      price: li.totalPrice ? amount(li.totalPrice) / Math.max(1, li.quantity) : amount(li.price),
    })),
  }
}

// The logged-in customer in the account page's shape, or null.
export async function getCustomer() {
  const data = await customerApi(CUSTOMER)
  const c = data?.customer
  if (!c) return null
  const defaultId = c.defaultAddress?.id
  return {
    shopify: true,
    firstName: c.firstName || '',
    lastName: c.lastName || '',
    email: c.emailAddress?.emailAddress || '',
    phone: c.phoneNumber?.phoneNumber || '',
    createdAt: c.creationDate?.slice(0, 10),
    addresses: c.addresses.nodes.map((a) => fromAddress(a, defaultId)),
    orders: c.orders.nodes.map(fromOrder),
    // Points need a loyalty app; none is connected yet.
    pointsHistory: [],
  }
}

const MUTATIONS = {
  create: `mutation($address: CustomerAddressInput!, $defaultAddress: Boolean) { customerAddressCreate(address: $address, defaultAddress: $defaultAddress) { customerAddress { id } userErrors { field message } } }`,
  update: `mutation($addressId: ID!, $address: CustomerAddressInput, $defaultAddress: Boolean) { customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) { customerAddress { id } userErrors { field message } } }`,
  remove: `mutation($addressId: ID!) { customerAddressDelete(addressId: $addressId) { deletedAddressId userErrors { field message } } }`,
}

// The account page edits the whole list; turn the difference into Shopify mutations.
export async function saveAddresses(previous, next) {
  const before = new Map(previous.map((a) => [a.id, a]))
  const after = new Map(next.map((a) => [a.id, a]))
  for (const a of previous) {
    if (!after.has(a.id)) checkUserErrors((await customerApi(MUTATIONS.remove, { addressId: a.id })).customerAddressDelete)
  }
  for (const a of next) {
    const old = before.get(a.id)
    if (!old) {
      checkUserErrors((await customerApi(MUTATIONS.create, { address: toAddressInput(a), defaultAddress: !!a.isDefault })).customerAddressCreate)
    } else if (JSON.stringify(toAddressInput(old)) !== JSON.stringify(toAddressInput(a)) || !!old.isDefault !== !!a.isDefault) {
      checkUserErrors((await customerApi(MUTATIONS.update, { addressId: a.id, address: toAddressInput(a), defaultAddress: !!a.isDefault })).customerAddressUpdate)
    }
  }
  return getCustomer()
}
