// Account service: DEMO ONLY, no backend.
//
// Every function here has the shape the Shopify integration will need, so the
// UI will not change when it is connected. Replace the bodies with calls to
// Shopify's Customer Account API (or the Storefront API customer mutations):
//   login / register / logout  → customer login flow, customerCreate
//   getCustomer                → customer { firstName lastName email ... }
//   orders                     → customer { orders { ... } }
//   addresses                  → customer { addresses { ... } defaultAddress }
//                                + customerAddressCreate / Update / Delete,
//                                  customerDefaultAddressUpdate
//   points                     → a loyalty app (Shopify has no built-in points)
//
// Until then, accounts live in this browser's localStorage, passwords are not
// secure, and nothing leaves the device.

import { demoOrders, demoAddresses, demoPointsHistory } from './mock'

const KEY = 'fuerte-demo-accounts'
const SESSION = 'fuerte-demo-session'

// Example points rules, to be confirmed by FUERTE.
export const pointsRules = { perEuro: 1, rewardPoints: 100, rewardValue: 5, signupBonus: 50 }

const read = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback } catch { return fallback } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms)) // feels like a network call
const norm = (e) => e.trim().toLowerCase()

// Fixed demo customer, always available so the account page can be previewed.
export const demoUser = { email: 'demo@fuerte.gr', password: 'Fuerte2026!' }

function accounts() {
  const all = read(KEY, {})
  // (Re)create it if missing, or if an earlier test session left it with another password.
  if (all[demoUser.email]?.password !== demoUser.password) {
    all[demoUser.email] = sampleAccount({ ...demoUser, firstName: 'Γιώργος', lastName: 'Παπαδόπουλος', phone: '6912345678', newsletter: true }, true)
    write(KEY, all)
  }
  return all
}
function save(acc) { const all = accounts(); all[acc.email] = acc; write(KEY, all) }

function publicCustomer(acc) {
  if (!acc) return null
  const { password, ...rest } = acc
  return rest
}

export async function getCustomer() {
  const email = read(SESSION, null)
  return publicCustomer(email && accounts()[email])
}

export async function login({ email, password, remember }) {
  await wait()
  const acc = accounts()[norm(email)]
  // Demo convenience: an unknown email logs in to a sample account with demo data.
  if (!acc) {
    const demo = sampleAccount({ email: norm(email), password, firstName: email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), lastName: '' }, true)
    save(demo)
    write(SESSION, demo.email)
    return publicCustomer(demo)
  }
  if (acc.password !== password) throw new Error('credentials')
  write(SESSION, acc.email)
  void remember // Shopify decides session length; kept for the UI.
  return publicCustomer(acc)
}

export async function register({ firstName, lastName, email, password, newsletter }) {
  await wait()
  if (accounts()[norm(email)]) throw new Error('exists')
  const acc = sampleAccount({ email: norm(email), password, firstName, lastName, newsletter }, false)
  save(acc)
  write(SESSION, acc.email)
  return publicCustomer(acc)
}

export async function logout() {
  write(SESSION, null)
}

export async function requestPasswordReset() {
  await wait()
  // Shopify sends the reset email (customerRecover).
}

export async function saveAddresses(email, addresses) {
  await wait(200)
  const acc = accounts()[email]
  if (!acc) return null
  acc.addresses = addresses
  save(acc)
  return publicCustomer(acc)
}

// New sign-ups start empty with the welcome bonus; "demo" accounts come with
// sample orders, addresses and points so the account page can be explored.
function sampleAccount(base, withHistory) {
  const createdAt = withHistory ? '2025-03-14' : new Date().toISOString().slice(0, 10)
  const signup = { id: 'p0', type: 'signup', date: createdAt, points: pointsRules.signupBonus }
  return {
    ...base,
    createdAt,
    orders: withHistory ? demoOrders : [],
    addresses: withHistory ? demoAddresses(base.firstName) : [],
    pointsHistory: withHistory ? [...demoPointsHistory, signup] : [signup],
  }
}
