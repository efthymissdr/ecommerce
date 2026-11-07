// Shopify connection (Headless channel → storefront "fuertecoffee.vercel.app").
//
// Both values are public by design: the Storefront API public token only reads
// the catalogue and manages carts, and the Customer Account API client is a
// public (PKCE) client with no secret. Never put the private Storefront token
// or a client secret here. Environment variables override the defaults.
export const shopify = {
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN || '8hhepn-pp.myshopify.com',
  storefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || 'e52e36da86de426cc471f055a724fbe4',
  customerClientId: import.meta.env.VITE_SHOPIFY_CUSTOMER_CLIENT_ID || 'acfcbd3f-2fbd-4c64-8846-55bdaf0a513f',
  apiVersion: '2026-10',
  country: 'GR',
  // Set VITE_SHOPIFY=off to run the site on the built-in demo data only.
  enabled: import.meta.env.VITE_SHOPIFY !== 'off',
}

// Customer login needs an https origin that is listed in the Headless channel's
// Customer Account API settings (callback, JavaScript origin, logout).
export const customerLoginAvailable = () => typeof window !== 'undefined' && window.location.protocol === 'https:'
