// Airscape® section on the product page and the "Airscape secured" badge.
// Shown for products with `airscape: true` in src/data/content.js: coffees that
// FUERTE stores in Airscape canisters at its premises until they are packed.

const el = {
  badge: 'Airscape secured',
  eyebrow: 'Airscape®',
  title: 'Η φρεσκάδα,',
  titleEm: 'κλειδωμένη.',
  intro: 'Ο αέρας, το φως και η υγρασία είναι οι μεγαλύτεροι εχθροί του φρέσκου καφέ. Γι’ αυτό, από το καβούρδισμα μέχρι τη συσκευασία, αυτός ο καφές φυλάσσεται στις εγκαταστάσεις μας σε δοχεία Airscape®, ώστε να φτάνει σε εσάς με το άρωμα και τη γεύση της ημέρας που καβουρδίστηκε.',
  features: [
    ['air', 'Χωρίς αέρα', 'Το εσωτερικό καπάκι των δοχείων λειτουργεί σαν έμβολο: το πιέζουμε μέχρι τους κόκκους και διώχνει τον αέρα.'],
    ['valve', 'Βαλβίδα μίας κατεύθυνσης', 'Ο φρέσκος καφές απελευθερώνει διοξείδιο του άνθρακα. Η βαλβίδα το αφήνει να βγει, χωρίς να μπαίνει οξυγόνο.'],
    ['down', 'Πάντα πάνω στον καφέ', 'Όσο ο καφές λιγοστεύει, χαμηλώνουμε το καπάκι μέχρι τους κόκκους, ώστε να μη μένει ποτέ αέρας από πάνω.'],
    ['light', 'Προστασία από φως και υγρασία', 'Τα αεροστεγή δοχεία κρατούν μακριά την υγρασία και το φως, που αλλοιώνουν το άρωμα.'],
  ],
  stepsTitle: 'Η διαδρομή του',
  steps: ['Καβουρδίζουμε', 'Φυλάσσουμε σε Airscape®', 'Συσκευάζουμε', 'Σας τον στέλνουμε'],
  trademark: 'Το Airscape® είναι εμπορικό σήμα της Planetary Design.',
}

const en = {
  badge: 'Airscape secured',
  eyebrow: 'Airscape®',
  title: 'Freshness,',
  titleEm: 'locked in.',
  intro: 'Air, light and moisture are fresh coffee’s worst enemies. That’s why, from roasting until packing, we store this coffee at our premises in Airscape® canisters, so it reaches you with the aroma and flavour of the day it was roasted.',
  features: [
    ['air', 'No air', 'The canisters’ inner lid works like a plunger: we press it down to the beans and it forces the air out.'],
    ['valve', 'One-way valve', 'Fresh coffee releases carbon dioxide. The valve lets it out without letting oxygen in.'],
    ['down', 'Always on the coffee', 'As the coffee runs low, we press the lid down to the beans, so there is never air above them.'],
    ['light', 'Shielded from light and moisture', 'The airtight canisters keep out the moisture and light that dull the aroma.'],
  ],
  stepsTitle: 'Its journey',
  steps: ['We roast it', 'We store it in Airscape®', 'We pack it', 'We ship it to you'],
  trademark: 'Airscape® is a trademark of Planetary Design.',
}

export const airscapeText = { el, en }
