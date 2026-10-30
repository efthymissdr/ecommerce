// Wholesale enquiry email, sent with Web3Forms (free plan, no backend needed).
//
// The access key below sends to efthymis.sdr@gmail.com (the inbox it was created
// with at https://web3forms.com). It only allows sending to that inbox, so it is
// safe in the browser. To send elsewhere, create a new key with that inbox and
// replace it here, or set VITE_WEB3FORMS_KEY in the hosting environment.
// Without a key the form falls back to opening the visitor's email app.

const ENDPOINT = 'https://api.web3forms.com/submit'
export const enquiryKey = import.meta.env.VITE_WEB3FORMS_KEY || 'fa4f30d9-d375-473f-92ca-14a1734c6f0f'

// The email is always written in Greek, for the FUERTE team.
const el = {
  business: {
    bakery: 'Φούρνος / Αρτοποιείο',
    cafe: 'Καφετέρια / Coffee Shop',
    hotel: 'Ξενοδοχείο',
    market: 'Mini Market / Supermarket',
    restaurant: 'Εστιατόριο',
    office: 'Γραφείο / Εταιρεία',
    distributor: 'Χονδρέμπορος / Διανομέας',
    other: 'Άλλο',
  },
  consumption: {
    '10-20': '10–20 kg',
    '20-40': '20–40 kg',
    '40-80': '40–80 kg',
    '80+': 'πάνω από 80 kg',
    unknown: 'δεν γνωρίζει ακόμη (νέα επιχείρηση)',
  },
}

const businessLabel = (d) => (d.business === 'other' && d.businessOther?.trim() ? d.businessOther.trim() : el.business[d.business])

// One readable sentence, a summary for quick scanning, then the visitor's message.
export function composeEnquiry(d, topic) {
  const company = d.company?.trim()
  const phone = d.phone?.trim()

  const sentence = [
    `Ο/Η πελάτης ${d.name.trim()}`,
    company ? ` της επιχείρησης «${company}»` : '',
    phone ? `, με τηλέφωνο ${phone}` : '',
    ` και email ${d.email.trim()},`,
    ` διατηρεί επιχείρηση τύπου «${businessLabel(d)}»`,
    d.equipment === 'yes' ? ', διαθέτει ήδη δικό του/της επαγγελματικό εξοπλισμό καφέ' : ', δεν διαθέτει επαγγελματικό εξοπλισμό καφέ και χρειάζεται εξοπλισμό',
    !d.consumption ? '' : d.consumption === 'unknown' ? ' και δεν γνωρίζει ακόμη τη μηνιαία κατανάλωση καφέ (νέα επιχείρηση)' : ` και καταναλώνει περίπου ${el.consumption[d.consumption]} καφέ τον μήνα`,
    `. Ενδιαφέρεται για: ${topic}.`,
  ].join('')

  const summary = [
    ['Ονοματεπώνυμο', d.name.trim()],
    ['Επιχείρηση', company || '—'],
    ['Email', d.email.trim()],
    ['Τηλέφωνο', phone || '—'],
    ['Είδος επιχείρησης', businessLabel(d)],
    ['Εξοπλισμός', d.equipment === 'yes' ? 'Ναι, διαθέτει δικό του/της' : 'Όχι, χρειάζεται εξοπλισμό'],
    ['Μηνιαία κατανάλωση', d.consumption ? el.consumption[d.consumption] : '—'],
    ['Ενδιαφέρον για', topic],
  ].map(([k, v]) => `${k}: ${v}`).join('\n')

  const message = d.message?.trim() || '(Δεν άφησε μήνυμα.)'

  return {
    subject: `Νέο αίτημα χονδρικής: ${topic}${company ? ` · ${company}` : ''}`,
    body: `${sentence}\n\nΜήνυμα πελάτη:\n${message}\n\n———\n${summary}`,
  }
}

export async function sendEnquiry(d, topic) {
  const { subject, body } = composeEnquiry(d, topic)
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: enquiryKey,
      subject,
      from_name: 'FUERTE · Φόρμα χονδρικής',
      replyto: d.email.trim(), // "Reply" in the inbox answers the customer directly
      message: body,
      botcheck: d.botcheck || '', // honeypot: bots fill it, people never see it
    }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`)
}
