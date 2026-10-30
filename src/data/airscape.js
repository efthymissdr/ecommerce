// Airscape® section on the product page and the "Airscape secured" badge.
// Shown for products with `airscape: true` in src/data/content.js.

const el = {
  badge: 'Airscape secured',
  eyebrow: 'Airscape®',
  title: 'Η φρεσκάδα,',
  titleEm: 'κλειδωμένη.',
  intro: 'Ο αέρας, το φως και η υγρασία είναι οι μεγαλύτεροι εχθροί του φρέσκου καφέ. Γι’ αυτό αυτός ο καφές συνοδεύεται από δοχείο Airscape®, που κρατά το άρωμα και τη γεύση του όπως την ημέρα που τον καβουρδίσαμε.',
  features: [
    ['air', 'Αφαιρεί τον αέρα', 'Το εσωτερικό καπάκι λειτουργεί σαν έμβολο: το πιέζετε προς τα κάτω και διώχνει τον αέρα από το δοχείο.'],
    ['valve', 'Βαλβίδα μίας κατεύθυνσης', 'Ο φρέσκος καφές απελευθερώνει διοξείδιο του άνθρακα. Η βαλβίδα το αφήνει να βγει, χωρίς να μπαίνει οξυγόνο.'],
    ['down', 'Πάντα πάνω στον καφέ', 'Όσο ο καφές λιγοστεύει, χαμηλώνετε το καπάκι μέχρι τους κόκκους, ώστε να μη μένει αέρας από πάνω.'],
    ['light', 'Προστασία από φως και υγρασία', 'Το αεροστεγές δοχείο κρατά μακριά την υγρασία και το φως, που αλλοιώνουν το άρωμα.'],
  ],
  steps: ['Γεμίστε με καφέ', 'Πιέστε το καπάκι μέχρι τους κόκκους', 'Κλείστε το εξωτερικό καπάκι'],
  trademark: 'Το Airscape® είναι εμπορικό σήμα της Planetary Design.',
}

const en = {
  badge: 'Airscape secured',
  eyebrow: 'Airscape®',
  title: 'Freshness,',
  titleEm: 'locked in.',
  intro: 'Air, light and moisture are fresh coffee’s worst enemies. That’s why this coffee comes with an Airscape® canister, which keeps its aroma and flavour as they were on the day we roasted it.',
  features: [
    ['air', 'Pushes the air out', 'The inner lid works like a plunger: press it down and it forces the air out of the canister.'],
    ['valve', 'One-way valve', 'Fresh coffee releases carbon dioxide. The valve lets it out without letting oxygen in.'],
    ['down', 'Always on the coffee', 'As the coffee runs low, press the lid down to the beans so no air is left above them.'],
    ['light', 'Shields from light and moisture', 'The airtight canister keeps out the moisture and light that dull the aroma.'],
  ],
  steps: ['Fill with coffee', 'Press the lid down to the beans', 'Close the outer lid'],
  trademark: 'Airscape® is a trademark of Planetary Design.',
}

export const airscapeText = { el, en }
