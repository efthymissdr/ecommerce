import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useLang } from '../i18n'
import { useCart } from '../shopify/cart'
import { useProducts } from '../shopify/catalog'
import { shopText } from '../shopify/text'
import { Bag, Close, Plus, ArrowRight } from './Art'

const euro = (n, code) => new Intl.NumberFormat(code === 'el' ? 'el-GR' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(n)
// Smaller Shopify CDN image for the thumbnails.
const sized = (url, w) => (url ? `${url}${url.includes('?') ? '&' : '?'}width=${w}` : url)

// Slide-in cart. CSS transitions only, so it stays light.
export default function CartPanel() {
  const { t } = useLang()
  const c = shopText[t.code] || shopText.en
  const cart = useCart()
  const products = useProducts()
  const sheet = useRef(null)

  useEffect(() => {
    if (!cart.open) return
    const key = (e) => { if (e.key === 'Escape') cart.closeCart() }
    window.addEventListener('keydown', key)
    const id = setTimeout(() => sheet.current?.querySelector('button')?.focus(), 300)
    return () => { window.removeEventListener('keydown', key); clearTimeout(id) }
  }, [cart.open, cart])

  // The catalogue product for a line, for its pack art when there is no photo.
  const productFor = (l) => products.find((p) => p.id === l.productId || (l.shopifyProductId && p.shopify?.id === l.shopifyProductId))

  return (
    <div className={`fixed inset-0 z-[90] ${cart.open ? '' : 'pointer-events-none'}`} aria-hidden={!cart.open}>
      <div onClick={cart.closeCart} className={`absolute inset-0 bg-espresso/70 backdrop-blur-sm transition-opacity duration-500 ${cart.open ? 'opacity-100' : 'opacity-0'}`} />
      <aside
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-cream/10 bg-roast shadow-2xl transition-transform duration-500 ease-expo ${cart.open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
          <div>
            <h2 className="font-display text-3xl text-cream">{c.title}</h2>
            <p className="text-xs text-muted">{c.count(cart.count)}</p>
          </div>
          <button type="button" onClick={cart.closeCart} aria-label={c.close} tabIndex={cart.open ? 0 : -1} className="grid size-11 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10">
            <Close />
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="text-cream/70">{c.empty}</p>
            <Link to="/#shop" onClick={cart.closeCart} tabIndex={cart.open ? 0 : -1} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-espresso transition-colors hover:bg-crema">
              {c.browse} <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <ul data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-6 py-5">
            {cart.lines.map((l) => {
              const p = productFor(l)
              return (
                <li key={l.id} className="flex gap-4 rounded-2xl border border-cream/10 bg-espresso/40 p-3">
                  <span className="grid w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-cream/5">
                    {p ? <span className="w-11"><Bag product={p} /></span> : l.image ? <img src={sized(l.image, 160)} alt="" className="aspect-square w-full object-cover" /> : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl leading-tight text-cream">{p?.name || l.title}</p>
                    {l.variantTitle && <p className="mt-0.5 text-xs text-muted">{l.variantTitle}</p>}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-cream/15">
                        <button type="button" onClick={() => cart.setQty(l.id, l.qty - 1)} disabled={cart.busy} aria-label={c.less} tabIndex={cart.open ? 0 : -1} className="grid size-9 place-items-center rounded-full text-cream hover:text-gold disabled:opacity-40">−</button>
                        <span className="w-6 text-center text-sm tabular-nums text-cream">{l.qty}</span>
                        <button type="button" onClick={() => cart.setQty(l.id, l.qty + 1)} disabled={cart.busy} aria-label={c.more} tabIndex={cart.open ? 0 : -1} className="grid size-9 place-items-center rounded-full text-cream hover:text-gold disabled:opacity-40"><Plus className="size-3.5" /></button>
                      </div>
                      <p className="text-sm font-semibold tabular-nums text-cream">{euro(l.total, t.code)}</p>
                    </div>
                    <button type="button" onClick={() => cart.setQty(l.id, 0)} disabled={cart.busy} tabIndex={cart.open ? 0 : -1} className="mt-2 text-xs text-muted underline-offset-4 hover:text-gold hover:underline">{c.remove}</button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {cart.lines.length > 0 && (
          <footer className="border-t border-cream/10 px-6 py-5">
            {cart.error && <p role="alert" className="mb-3 text-sm text-[#f08a7e]">{c.error}</p>}
            <div className="flex items-baseline justify-between">
              <p className="text-sm uppercase tracking-[0.2em] text-muted">{c.subtotal}</p>
              <p className="font-display text-3xl tabular-nums text-gold">{euro(cart.subtotal, t.code)}</p>
            </div>
            <p className="mt-1 text-xs text-muted">{c.shippingNote}</p>
            {cart.checkoutUrl ? (
              // Shopify's checkout: payment, shipping and the order confirmation happen there.
              <a href={cart.checkoutUrl} tabIndex={cart.open ? 0 : -1} className={`mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-gold text-base font-semibold text-espresso transition-colors hover:bg-crema ${cart.busy ? 'pointer-events-none opacity-60' : ''}`}>
                {c.checkout} <ArrowRight className="size-4" />
              </a>
            ) : (
              <p className="mt-5 rounded-2xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-sm text-gold">{c.demo}</p>
            )}
          </footer>
        )}
      </aside>
    </div>
  )
}
