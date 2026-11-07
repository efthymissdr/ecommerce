import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { storefront, checkUserErrors } from './storefront'
import { useCatalogSource } from './catalog'
import { shopify } from './config'

// The cart. With Shopify connected it is a real Storefront API cart (its id is
// kept in localStorage) and "Checkout" opens Shopify's checkout. With the demo
// catalogue it is a local list and checkout is disabled.

const CART_ID = 'fuerte-cart-id'
const DEMO_LINES = 'fuerte-demo-cart'
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }
const write = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

const CART = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 100) {
    nodes {
      ... on CartLine {
        id quantity
        cost { totalAmount { amount } }
        merchandise { ... on ProductVariant { id title image { url } product { id handle title featuredImage { url } } } }
      }
    }
  }`

const Q = {
  get: `query($id: ID!) { cart(id: $id) { ${CART} } }`,
  create: `mutation($input: CartInput) { cartCreate(input: $input) { cart { ${CART} } userErrors { message } } }`,
  add: `mutation($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART} } userErrors { message } } }`,
  update: `mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART} } userErrors { message } } }`,
  remove: `mutation($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART} } userErrors { message } } }`,
}

// Shopify cart → the shape the cart panel shows.
function fromShopify(cart) {
  if (!cart) return null
  return {
    checkoutUrl: cart.checkoutUrl,
    count: cart.totalQuantity,
    subtotal: Number(cart.cost.subtotalAmount.amount),
    lines: cart.lines.nodes.map((l) => ({
      id: l.id,
      qty: l.quantity,
      total: Number(l.cost.totalAmount.amount),
      title: l.merchandise.product.title,
      handle: l.merchandise.product.handle,
      shopifyProductId: l.merchandise.product.id,
      variantTitle: /default title/i.test(l.merchandise.title) ? '' : l.merchandise.title,
      image: l.merchandise.image?.url || l.merchandise.product.featuredImage?.url,
    })),
  }
}

const demoCart = (lines) => ({
  checkoutUrl: null,
  count: lines.reduce((n, l) => n + l.qty, 0),
  subtotal: lines.reduce((s, l) => s + l.price * l.qty, 0),
  lines: lines.map((l) => ({ ...l, total: l.price * l.qty })),
})

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const source = useCatalogSource()
  const live = source === 'shopify'
  const [remote, setRemote] = useState(null)
  const [demoLines, setDemoLines] = useState(() => read(DEMO_LINES) || [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)

  // Restore the Shopify cart (it disappears after checkout or expiry).
  useEffect(() => {
    if (!live) return
    const id = read(CART_ID)
    if (!id) return
    storefront(Q.get, { id })
      .then((d) => { if (d.cart) setRemote(fromShopify(d.cart)); else write(CART_ID, null) })
      .catch(() => {})
  }, [live])

  useEffect(() => { write(DEMO_LINES, demoLines) }, [demoLines])

  const run = useCallback(async (fn) => {
    setBusy(true); setError(null)
    try { return await fn() } catch (e) { console.error(e); setError(e.message); return null } finally { setBusy(false) }
  }, [])

  // product: the catalogue product; variantId: Shopify variant (defaults to the first available one).
  const addItem = useCallback(({ product, variantId, qty = 1, price, variantTitle = '' }) => {
    if (!live) {
      setDemoLines((ls) => {
        const key = `${product.id}|${variantTitle}`
        const hit = ls.find((l) => l.id === key)
        return hit
          ? ls.map((l) => (l.id === key ? { ...l, qty: l.qty + qty } : l))
          : [...ls, { id: key, productId: product.id, title: product.name, variantTitle, qty, price: price ?? product.price }]
      })
      return Promise.resolve(true)
    }
    const merchandiseId = variantId || product.shopify?.variants.find((v) => v.available)?.id || product.shopify?.variants[0]?.id
    if (!merchandiseId) return Promise.resolve(false)
    return run(async () => {
      const lines = [{ merchandiseId, quantity: qty }]
      const id = read(CART_ID)
      let cart
      if (id) {
        const d = await storefront(Q.add, { cartId: id, lines })
        cart = checkUserErrors(d.cartLinesAdd).cart
      }
      if (!cart) {
        const d = await storefront(Q.create, { input: { lines, buyerIdentity: { countryCode: shopify.country } } })
        cart = checkUserErrors(d.cartCreate).cart
        write(CART_ID, cart.id)
      }
      setRemote(fromShopify(cart))
      return true
    })
  }, [live, run])

  const setQty = useCallback((lineId, qty) => {
    if (!live) {
      setDemoLines((ls) => (qty > 0 ? ls.map((l) => (l.id === lineId ? { ...l, qty } : l)) : ls.filter((l) => l.id !== lineId)))
      return
    }
    run(async () => {
      const cartId = read(CART_ID)
      const d = qty > 0
        ? checkUserErrors((await storefront(Q.update, { cartId, lines: [{ id: lineId, quantity: qty }] })).cartLinesUpdate)
        : checkUserErrors((await storefront(Q.remove, { cartId, lineIds: [lineId] })).cartLinesRemove)
      setRemote(fromShopify(d.cart))
    })
  }, [live, run])

  const value = useMemo(() => {
    const cart = live ? (remote || demoCart([])) : demoCart(demoLines)
    return {
      ...cart, live, busy, error, addItem, setQty,
      open, openCart: () => setOpen(true), closeCart: () => setOpen(false),
    }
  }, [live, remote, demoLines, busy, error, addItem, setQty, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
