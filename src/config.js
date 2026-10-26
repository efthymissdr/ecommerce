// Shopify integration points. Replace these when the store is connected.
export const shopify = {
  // The account UI (src/components/AuthPanel.jsx, AccountPage.jsx) talks only
  // to src/account/service.js, which is a browser-only demo for now. Connect
  // that file to Shopify's Customer Account API; or, to use Shopify's hosted
  // account pages instead, link the account button to:
  //   new customer accounts:     https://shopify.com/<shop-id>/account
  //   classic customer accounts: https://<store-domain>/account
  accountUrl: '/account',
}
