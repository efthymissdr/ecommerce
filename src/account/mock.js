// Sample data for the demo account page. Product ids match src/data/content.js.

export const demoOrders = [
  {
    id: '1042', date: '2026-10-02', status: 'shipped', payment: 'Visa •••• 4242', shipping: 0,
    items: [
      { productId: 'ethiopia', size: '250g', grind: 'filter', qty: 2, price: 13.9 },
      { productId: 'yellow', size: '500g', grind: 'whole', qty: 1, price: 18.9 },
    ],
    addressId: 'a1',
  },
  {
    id: '1031', date: '2026-08-21', status: 'delivered', payment: 'PayPal', shipping: 0,
    items: [
      { productId: 'red', size: '1kg', grind: 'espresso', qty: 1, price: 35.9 },
    ],
    addressId: 'a1',
  },
  {
    id: '1017', date: '2026-06-09', status: 'delivered', payment: 'Visa •••• 4242', shipping: 3.5,
    items: [
      { productId: 'colombia', size: '250g', grind: 'whole', qty: 1, price: 12.9 },
      { productId: 'brazil', size: '250g', grind: 'moka', qty: 1, price: 11.9 },
    ],
    addressId: 'a2',
  },
  {
    id: '1003', date: '2026-04-27', status: 'cancelled', payment: 'Visa •••• 4242', shipping: 3.5,
    items: [
      { productId: 'green', size: '250g', grind: 'espresso', qty: 1, price: 9.9 },
    ],
    addressId: 'a1',
  },
]

export const demoAddresses = (name) => [
  { id: 'a1', label: 'Σπίτι / Home', name: name || 'FUERTE Demo', street: 'Ερμού 25', floor: '3ος, Παπαδόπουλος', city: 'Αθήνα', zip: '10563', phone: '6900000000', isDefault: true },
  { id: 'a2', label: 'Γραφείο / Office', name: name || 'FUERTE Demo', street: 'Τσιμισκή 40', floor: '', city: 'Θεσσαλονίκη', zip: '54623', phone: '6900000001', isDefault: false },
]

export const demoPointsHistory = [
  { id: 'p4', type: 'order', ref: '1042', date: '2026-10-02', points: 46 },
  { id: 'p3', type: 'redeem', date: '2026-08-21', points: -100 },
  { id: 'p2', type: 'order', ref: '1031', date: '2026-08-21', points: 35 },
  { id: 'p1', type: 'order', ref: '1017', date: '2026-06-09', points: 24 },
  { id: 'pb', type: 'bonus', date: '2026-05-01', points: 25 },
]
