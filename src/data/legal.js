// Text of the footer's information pages (terms, privacy, payment, shipping, returns).
//
// DRAFT: written as a starting point from the usual Greek e-shop framework
// (Ν. 2251/1994 for consumer protection, GDPR & Ν. 4624/2019 for personal data).
// Anything in [brackets] is a placeholder, and the whole text must be checked by
// FUERTE's legal / accounting advisor before going live.
//
// Each page: { title, intro, sections: [{ h, p: [paragraphs], list?: [items] }] }

export const legalSlugs = ['terms', 'privacy', 'payment', 'shipping', 'returns']

export const company = {
  name: 'FUERTE COFFEE',
  address: 'Δαμοκλέους 4, Περιστέρι',
  addressEn: '4 Damokleous St, Peristeri, Greece',
  email: 'info@fuerte.gr',
  phone: '210 5715166',
}

const c = company

const el = {
  nav: 'Πληροφορίες',
  updated: 'Τελευταία ενημέρωση',
  date: '[ημερομηνία]',
  draft: 'Προσχέδιο: το κείμενο είναι ενδεικτικό και θα οριστικοποιηθεί πριν τη λειτουργία του καταστήματος.',
  other: 'Άλλες σελίδες',
  questions: 'Έχετε απορία;',
  contact: 'Επικοινωνήστε μαζί μας',
  pages: {
    terms: {
      title: 'Γενικοί όροι',
      intro: `Οι παρόντες όροι ισχύουν για κάθε αγορά από το ηλεκτρονικό κατάστημα fuerte.gr. Με την ολοκλήρωση μιας παραγγελίας αποδέχεστε τους όρους αυτούς.`,
      sections: [
        { h: 'Στοιχεία επιχείρησης', p: [`Το κατάστημα λειτουργεί από την ${c.name}, ${c.address}, ΑΦΜ [ΑΦΜ], ΔΟΥ [ΔΟΥ], ΓΕΜΗ [αριθμός ΓΕΜΗ]. Επικοινωνία: ${c.email}, τηλ. ${c.phone}.`] },
        { h: 'Προϊόντα και τιμές', p: [
          'Οι φωτογραφίες και οι περιγραφές των προϊόντων είναι όσο το δυνατόν ακριβέστερες. Μικρές διαφορές στη συσκευασία ή στο χρώμα δεν αποτελούν ελάττωμα.',
          'Όλες οι τιμές είναι σε ευρώ και περιλαμβάνουν ΦΠΑ. Τα μεταφορικά εμφανίζονται χωριστά πριν την ολοκλήρωση της παραγγελίας. Διατηρούμε το δικαίωμα αλλαγής τιμών, χωρίς να επηρεάζονται οι παραγγελίες που έχουν ήδη καταχωρηθεί.',
        ] },
        { h: 'Παραγγελίες', p: [
          'Μετά την υποβολή της παραγγελίας λαμβάνετε email επιβεβαίωσης. Η σύμβαση ολοκληρώνεται με την αποστολή της επιβεβαίωσης αυτής.',
          'Σε περίπτωση που ένα προϊόν δεν είναι διαθέσιμο, θα επικοινωνήσουμε μαζί σας για αντικατάσταση ή επιστροφή των χρημάτων σας.',
        ] },
        { h: 'Λογαριασμός πελάτη', p: ['Είστε υπεύθυνοι για τη φύλαξη του κωδικού του λογαριασμού σας. Οι πόντοι επιβράβευσης δεν εξαργυρώνονται σε μετρητά και ισχύουν σύμφωνα με τους όρους του προγράμματος.'] },
        { h: 'Πνευματική ιδιοκτησία', p: ['Το περιεχόμενο του ιστότοπου (κείμενα, φωτογραφίες, λογότυπα, σχέδια συσκευασιών) ανήκει στη FUERTE και δεν επιτρέπεται η χρήση του χωρίς γραπτή άδεια.'] },
        { h: 'Επίλυση διαφορών', p: ['Για οποιοδήποτε ζήτημα μπορείτε να επικοινωνήσετε πρώτα μαζί μας. Μπορείτε επίσης να απευθυνθείτε στον Συνήγορο του Καταναλωτή ή στην ευρωπαϊκή πλατφόρμα ηλεκτρονικής επίλυσης διαφορών (ec.europa.eu/consumers/odr). Εφαρμοστέο είναι το ελληνικό δίκαιο.'] },
      ],
    },
    privacy: {
      title: 'Προσωπικά δεδομένα',
      intro: 'Σεβόμαστε την ιδιωτικότητά σας. Εδώ εξηγούμε ποια δεδομένα συλλέγουμε, γιατί, και ποια δικαιώματα έχετε σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (ΕΕ) 2016/679 και τον Ν. 4624/2019.',
      sections: [
        { h: 'Υπεύθυνος επεξεργασίας', p: [`${c.name}, ${c.address}, ${c.email}, τηλ. ${c.phone}.`] },
        { h: 'Ποια δεδομένα συλλέγουμε', list: [
          'Στοιχεία ταυτότητας και επικοινωνίας: όνομα, email, τηλέφωνο, διεύθυνση αποστολής και τιμολόγησης.',
          'Στοιχεία παραγγελιών και ιστορικό αγορών, πόντοι επιβράβευσης.',
          'Τεχνικά δεδομένα: διεύθυνση IP, τύπος συσκευής, cookies (βλ. παρακάτω).',
        ], p: ['Τα στοιχεία της κάρτας σας δεν αποθηκεύονται από εμάς· τα επεξεργάζεται απευθείας ο πάροχος πληρωμών.'] },
        { h: 'Γιατί τα χρησιμοποιούμε', list: [
          'Για την εκτέλεση της παραγγελίας σας (αποστολή, τιμολόγηση, εξυπηρέτηση).',
          'Για τη λειτουργία του λογαριασμού σας και του προγράμματος πόντων.',
          'Για την αποστολή newsletter, μόνο εφόσον έχετε δώσει τη συγκατάθεσή σας.',
          'Για την τήρηση των φορολογικών και λογιστικών μας υποχρεώσεων.',
        ] },
        { h: 'Με ποιους τα μοιραζόμαστε', p: ['Μόνο με όσους είναι απαραίτητοι για την εξυπηρέτησή σας: την πλατφόρμα του καταστήματος (Shopify), τον πάροχο πληρωμών, τις εταιρείες ταχυμεταφορών και τον λογιστή μας. Δεν πουλάμε ποτέ τα δεδομένα σας.'] },
        { h: 'Πόσο τα κρατάμε', p: ['Όσο διατηρείτε λογαριασμό, και στη συνέχεια όσο απαιτεί η φορολογική νομοθεσία για τα παραστατικά. Τα δεδομένα του newsletter διαγράφονται μόλις απεγγραφείτε.'] },
        { h: 'Cookies', p: ['Χρησιμοποιούμε απαραίτητα cookies για τη λειτουργία του καλαθιού και της σύνδεσης. Cookies στατιστικών ή διαφήμισης χρησιμοποιούνται μόνο με τη συγκατάθεσή σας, την οποία μπορείτε να ανακαλέσετε οποτεδήποτε.'] },
        { h: 'Τα δικαιώματά σας', p: [
          `Έχετε δικαίωμα πρόσβασης, διόρθωσης, διαγραφής, περιορισμού, φορητότητας και εναντίωσης στην επεξεργασία, καθώς και ανάκλησης της συγκατάθεσής σας. Στείλτε μας email στο ${c.email}.`,
          'Έχετε επίσης δικαίωμα καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr).',
        ] },
      ],
    },
    payment: {
      title: 'Τρόποι πληρωμής',
      intro: 'Μπορείτε να πληρώσετε την παραγγελία σας με όποιον από τους παρακάτω τρόπους σας εξυπηρετεί. Όλες οι συναλλαγές γίνονται μέσω ασφαλούς σύνδεσης.',
      sections: [
        { h: 'Χρεωστική ή πιστωτική κάρτα', p: ['Δεχόμαστε κάρτες Visa, Mastercard και Maestro. Η πληρωμή γίνεται σε ασφαλές περιβάλλον του παρόχου πληρωμών με πιστοποίηση 3-D Secure· εμείς δεν βλέπουμε ούτε αποθηκεύουμε τα στοιχεία της κάρτας σας.'] },
        { h: 'Apple Pay και Google Pay', p: ['Πληρώστε γρήγορα από το κινητό ή τον υπολογιστή σας, με τα στοιχεία που έχετε ήδη αποθηκεύσει.'] },
        { h: 'PayPal', p: ['Θα μεταφερθείτε στο PayPal για να ολοκληρώσετε την πληρωμή με τον λογαριασμό σας.'] },
        { h: 'Αντικαταβολή', p: ['Πληρώνετε μετρητά ή με κάρτα στον courier κατά την παράδοση. Ισχύει επιπλέον χρέωση [ποσό] €.'] },
        { h: 'Τραπεζική κατάθεση', p: ['Καταθέστε το ποσό στον λογαριασμό [τράπεζα, IBAN], με αιτιολογία τον αριθμό της παραγγελίας σας. Η παραγγελία αποστέλλεται μόλις πιστωθεί το ποσό.'] },
        { h: 'Παραστατικά', p: ['Με κάθε παραγγελία εκδίδεται απόδειξη λιανικής. Αν χρειάζεστε τιμολόγιο, συμπληρώστε τα στοιχεία της επιχείρησής σας στο ταμείο.'] },
      ],
    },
    shipping: {
      title: 'Τρόποι αποστολής',
      intro: 'Καβουρδίζουμε σε μικρές παρτίδες και αποστέλλουμε τον καφέ σας φρέσκο, σε όλη την Ελλάδα.',
      sections: [
        { h: 'Χρόνος αποστολής', p: ['Οι παραγγελίες που ολοκληρώνονται έως τις [ώρα] τις εργάσιμες ημέρες αποστέλλονται την ίδια ή την επόμενη εργάσιμη ημέρα.'] },
        { h: 'Χρόνος παράδοσης', list: [
          'Αττική: 1–2 εργάσιμες ημέρες.',
          'Υπόλοιπη ηπειρωτική Ελλάδα: 2–3 εργάσιμες ημέρες.',
          'Νησιά και δυσπρόσιτες περιοχές: 3–5 εργάσιμες ημέρες.',
        ] },
        { h: 'Κόστος αποστολής', p: ['[Ποσό] € για παραγγελίες έως [ποσό] €. Δωρεάν αποστολή για παραγγελίες άνω των [ποσό] €. Το ακριβές κόστος εμφανίζεται στο ταμείο πριν πληρώσετε.'] },
        { h: 'Παραλαβή από το κατάστημα', p: [`Μπορείτε να παραλάβετε την παραγγελία σας χωρίς χρέωση από το ${c.address}, τις ώρες λειτουργίας μας, αφού λάβετε email ότι είναι έτοιμη.`] },
        { h: 'Παρακολούθηση', p: ['Μόλις φύγει η παραγγελία σας, θα λάβετε email με τον αριθμό αποστολής για να την παρακολουθείτε.'] },
        { h: 'Κατεστραμμένο δέμα', p: ['Αν το δέμα φτάσει φανερά κατεστραμμένο, σημειώστε το στον courier και ενημερώστε μας εντός 48 ωρών με μια φωτογραφία, ώστε να σας στείλουμε νέο προϊόν.'] },
      ],
    },
    returns: {
      title: 'Υπαναχώρηση και επιστροφή προϊόντος',
      intro: 'Θέλουμε να είστε ικανοποιημένοι με κάθε φλιτζάνι. Παρακάτω θα βρείτε πώς μπορείτε να υπαναχωρήσετε από μια αγορά ή να επιστρέψετε ένα προϊόν.',
      sections: [
        { h: 'Δικαίωμα υπαναχώρησης', p: ['Σύμφωνα με τον Ν. 2251/1994, έχετε δικαίωμα να υπαναχωρήσετε από την αγορά εντός 14 ημερών από την παραλαβή, χωρίς να δώσετε αιτιολογία.'] },
        { h: 'Εξαιρέσεις', p: ['Για λόγους υγιεινής και επειδή πρόκειται για τρόφιμα, το δικαίωμα υπαναχώρησης δεν ισχύει για:'], list: [
          'Συσκευασίες καφέ που έχουν ανοιχτεί ή των οποίων έχει παραβιαστεί η σφράγιση μετά την παράδοση.',
          'Καφέ που αλέστηκε κατόπιν δικής σας επιλογής (π.χ. για espresso, φίλτρο ή μπρίκι), καθώς παρασκευάζεται σύμφωνα με τις προδιαγραφές σας.',
        ] },
        { h: 'Πώς κάνετε υπαναχώρηση', p: [
          `Στείλτε μας email στο ${c.email} με τον αριθμό της παραγγελίας σας και τα προϊόντα που επιστρέφετε. Στη συνέχεια στείλτε τα προϊόντα, σφραγισμένα και στην αρχική τους συσκευασία, στη διεύθυνση ${c.address}, εντός 14 ημερών.`,
          'Το κόστος της επιστροφής βαρύνει τον πελάτη, εκτός αν το προϊόν είναι ελαττωματικό ή λάθος.',
        ] },
        { h: 'Επιστροφή χρημάτων', p: ['Θα σας επιστρέψουμε το ποσό, μαζί με το αρχικό κόστος αποστολής, εντός 14 ημερών από τη στιγμή που θα λάβουμε τα προϊόντα, με τον ίδιο τρόπο πληρωμής που χρησιμοποιήσατε.'] },
        { h: 'Ελαττωματικό ή λάθος προϊόν', p: ['Αν λάβετε λάθος προϊόν ή προϊόν με πρόβλημα, ενημερώστε μας εντός 7 ημερών με μια φωτογραφία. Θα σας στείλουμε το σωστό προϊόν ή θα σας επιστρέψουμε τα χρήματα, χωρίς καμία χρέωση.'] },
      ],
    },
  },
}

const en = {
  nav: 'Information',
  updated: 'Last updated',
  date: '[date]',
  draft: 'Draft: this text is indicative and will be finalised before the shop goes live.',
  other: 'Other pages',
  questions: 'Have a question?',
  contact: 'Get in touch',
  pages: {
    terms: {
      title: 'Terms & conditions',
      intro: 'These terms apply to every purchase from the fuerte.gr online shop. By completing an order you accept them.',
      sections: [
        { h: 'Company details', p: [`The shop is operated by ${c.name}, ${c.addressEn}, VAT no. [VAT], tax office [office], GEMI [number]. Contact: ${c.email}, tel. +30 ${c.phone}.`] },
        { h: 'Products and prices', p: [
          'Product photos and descriptions are as accurate as possible. Small differences in packaging or colour are not defects.',
          'All prices are in euros and include VAT. Shipping is shown separately before you complete your order. We may change prices at any time; orders already placed are not affected.',
        ] },
        { h: 'Orders', p: [
          'After you place an order you will receive a confirmation email. The contract is concluded when that confirmation is sent.',
          'If a product is unavailable, we will contact you to offer a replacement or a refund.',
        ] },
        { h: 'Customer account', p: ['You are responsible for keeping your password safe. Reward points cannot be exchanged for cash and are subject to the programme’s terms.'] },
        { h: 'Intellectual property', p: ['All site content (text, photos, logos, pack designs) belongs to FUERTE and may not be used without written permission.'] },
        { h: 'Disputes', p: ['Please contact us first about any issue. You may also contact the Greek Consumer Ombudsman or use the EU online dispute resolution platform (ec.europa.eu/consumers/odr). Greek law applies.'] },
      ],
    },
    privacy: {
      title: 'Privacy policy',
      intro: 'We respect your privacy. This page explains what data we collect, why, and your rights under the General Data Protection Regulation (EU) 2016/679 and Greek Law 4624/2019.',
      sections: [
        { h: 'Data controller', p: [`${c.name}, ${c.addressEn}, ${c.email}, tel. +30 ${c.phone}.`] },
        { h: 'What we collect', list: [
          'Identity and contact details: name, email, phone, shipping and billing address.',
          'Order details and purchase history, reward points.',
          'Technical data: IP address, device type, cookies (see below).',
        ], p: ['We never store your card details; they are processed directly by the payment provider.'] },
        { h: 'Why we use it', list: [
          'To fulfil your order (shipping, invoicing, support).',
          'To run your account and the points programme.',
          'To send our newsletter, only if you have opted in.',
          'To meet our tax and accounting obligations.',
        ] },
        { h: 'Who we share it with', p: ['Only those needed to serve you: our shop platform (Shopify), the payment provider, courier companies and our accountant. We never sell your data.'] },
        { h: 'How long we keep it', p: ['For as long as you have an account, and afterwards as long as tax law requires for invoices. Newsletter data is deleted as soon as you unsubscribe.'] },
        { h: 'Cookies', p: ['We use essential cookies for the cart and login. Analytics or advertising cookies are only used with your consent, which you can withdraw at any time.'] },
        { h: 'Your rights', p: [
          `You have the right to access, correct, delete, restrict and port your data, to object to its processing, and to withdraw your consent. Email us at ${c.email}.`,
          'You may also lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr).',
        ] },
      ],
    },
    payment: {
      title: 'Payment methods',
      intro: 'You can pay for your order in whichever of the ways below suits you. All transactions use a secure connection.',
      sections: [
        { h: 'Debit or credit card', p: ['We accept Visa, Mastercard and Maestro. Payment happens on the payment provider’s secure page with 3-D Secure; we never see or store your card details.'] },
        { h: 'Apple Pay and Google Pay', p: ['Pay quickly from your phone or computer with the details you have already saved.'] },
        { h: 'PayPal', p: ['You will be taken to PayPal to complete the payment with your account.'] },
        { h: 'Cash on delivery', p: ['Pay the courier in cash or by card on delivery. An extra charge of €[amount] applies.'] },
        { h: 'Bank transfer', p: ['Transfer the amount to [bank, IBAN], with your order number as the reference. Your order ships once the payment is received.'] },
        { h: 'Receipts and invoices', p: ['Every order comes with a receipt. If you need a VAT invoice, enter your company details at checkout.'] },
      ],
    },
    shipping: {
      title: 'Shipping',
      intro: 'We roast in small batches and ship your coffee fresh, anywhere in Greece.',
      sections: [
        { h: 'Dispatch time', p: ['Orders completed by [time] on working days ship the same or the next working day.'] },
        { h: 'Delivery time', list: [
          'Attica: 1–2 working days.',
          'Rest of mainland Greece: 2–3 working days.',
          'Islands and remote areas: 3–5 working days.',
        ] },
        { h: 'Shipping cost', p: ['€[amount] for orders up to €[amount]. Free shipping on orders over €[amount]. The exact cost is shown at checkout before you pay.'] },
        { h: 'Store pickup', p: [`You can collect your order free of charge from ${c.addressEn} during opening hours, once we email you that it is ready.`] },
        { h: 'Tracking', p: ['As soon as your order ships, you will get an email with the tracking number.'] },
        { h: 'Damaged parcel', p: ['If the parcel arrives visibly damaged, tell the courier and let us know within 48 hours with a photo, and we will send you a replacement.'] },
      ],
    },
    returns: {
      title: 'Withdrawal & returns',
      intro: 'We want you to enjoy every cup. Here is how to withdraw from a purchase or return a product.',
      sections: [
        { h: 'Right of withdrawal', p: ['Under Greek Law 2251/1994, you may withdraw from your purchase within 14 days of receiving it, without giving a reason.'] },
        { h: 'Exceptions', p: ['Because these are food products, and for hygiene reasons, the right of withdrawal does not apply to:'], list: [
          'Coffee packs that have been opened, or whose seal has been broken, after delivery.',
          'Coffee ground to your choice (e.g. for espresso, filter or Greek coffee), as it is prepared to your specification.',
        ] },
        { h: 'How to withdraw', p: [
          `Email us at ${c.email} with your order number and the products you are returning. Then send the products, sealed and in their original packaging, to ${c.addressEn} within 14 days.`,
          'Return shipping is paid by the customer, unless the product is faulty or wrong.',
        ] },
        { h: 'Refunds', p: ['We will refund the amount, including the original shipping cost, within 14 days of receiving the products, using the same payment method you used.'] },
        { h: 'Faulty or wrong product', p: ['If you receive a wrong or faulty product, let us know within 7 days with a photo. We will send the right product or refund you, at no cost.'] },
      ],
    },
  },
}

export const legalContent = { el, en }
