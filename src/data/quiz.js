// FUERTE taste quiz: questions, answers and points per coffee, entered from the
// FUERTE scoring sheet exactly as given. Each answer gives every coffee a number
// of points. The recommendation is the coffee with the most points in total.

// Column order of the scoring sheet.
const cols = ['colombia', 'costarica', 'brazil', 'green', 'ethiopia', 'honduras', 'rwanda', 'yellow', 'red']
const pts = (...v) => Object.fromEntries(cols.map((id, i) => [id, v[i]]))

export const questions = [
  {
    id: 'brew', // 1. How do you usually drink your coffee?
    options: [
      { id: 'espresso', pts: pts(3, 1, 2, 4, 5, 4, 3, 3, 4) },
      { id: 'freddo', pts: pts(1, 3, 3, 3, 3, 2, 3, 4, 3) },
      { id: 'latte', pts: pts(0, 3, 4, 2, 5, 4, 4, 3, 2) },
      { id: 'filter', pts: pts(-1, 2, 1, 1, 5, 4, 5, 1, 1) },
    ],
  },
  {
    id: 'flavour', // 2. Which flavours do you prefer?
    options: [
      { id: 'choc', pts: pts(4, 2, 5, 5, 1, 2, 0, 3, 4) },
      { id: 'caramel', pts: pts(5, 2, 4, 2, 1, 2, 1, 3, 3) },
      { id: 'fruit', pts: pts(2, 3, 2, 1, 5, 4, 3, 1, 0) },
    ],
  },
  {
    id: 'intensity', // 3. How intense do you like your coffee?
    options: [
      { id: 'mild', pts: pts(1, 3, 3, 1, 4, 4, 5, 2, 2) },
      { id: 'balanced', pts: pts(2, 3, 4, 3, 2, 2, 3, 5, 4) },
      { id: 'strong', pts: pts(5, 3, 3, 4, 5, 5, 2, 3, 5) },
    ],
  },
  {
    id: 'acidity', // 4. What acidity do you like?
    options: [
      { id: 'acidLow', pts: pts(2, 4, 3, 3, 3, 3, 4, 3, 4) },
      { id: 'acidMed', pts: pts(4, 3, 3, 3, 2, 2, 3, 2, 3) },
      { id: 'acidHigh', pts: pts(3, 2, 1, 1, 5, 5, 4, 2, 2) },
    ],
  },
  {
    id: 'body', // 5. What body do you prefer?
    options: [
      { id: 'bodyFull', pts: pts(5, 2, 3, 4, 3, 4, 1, 3, 5) },
      { id: 'bodyMed', pts: pts(2, 4, 5, 2, 1, 1, 2, 5, 5) },
      { id: 'bodyLight', pts: pts(2, 3, 3, 4, 5, 4, 5, 3, 3) },
    ],
  },
]

// Highest points a coffee can collect: 5 per question.
export const MAX_POINTS = questions.length * 5

// The visitor's taste on the same six axes as the coffees, used to draw the
// "your taste" shape on the chart and to break ties in the points.
const targets = {
  intensity: { mild: { intensity: 1.5 }, balanced: { intensity: 3 }, strong: { intensity: 4.5 } },
  acidity: { acidLow: { acidity: 1.5 }, acidMed: { acidity: 3 }, acidHigh: { acidity: 4.5 } },
  body: { bodyFull: { body: 4.5 }, bodyMed: { body: 3 }, bodyLight: { body: 1.5 } },
  flavour: {
    choc: { chocolatey: 4.5, sweetness: 3.5, fruity: 1.5 },
    caramel: { sweetness: 4.5, chocolatey: 3, fruity: 1.5 },
    fruit: { fruity: 4.5, sweetness: 3.5, chocolatey: 1.5 },
  },
}

export function tasteProfile(answers) {
  const prof = { intensity: 3, acidity: 3, sweetness: 3, body: 3, fruity: 3, chocolatey: 3 }
  answers.forEach((optId, qi) => Object.assign(prof, targets[questions[qi]?.id]?.[optId] || {}))
  return prof
}

export function recommend(answers, products) {
  const prof = tasteProfile(answers)
  const ranked = products
    .map((p) => {
      const score = answers.reduce((sum, optId, qi) => sum + (questions[qi].options.find((o) => o.id === optId)?.pts[p.id] ?? 0), 0)
      const dist = Math.sqrt(Object.keys(prof).reduce((s, a) => s + (p.profile[a] - prof[a]) ** 2, 0))
      return { product: p, score, dist, match: Math.round((Math.max(0, score) / MAX_POINTS) * 100) }
    })
    // Most points first; on equal points, the coffee closest to the visitor's taste.
    .sort((a, b) => b.score - a.score || a.dist - b.dist)
  return { profile: prof, ranked }
}

// Brewing methods a coffee suits best, from its question-1 points:
// every method scoring 4 or more, or the top-scoring method(s) if none do.
export function bestFor(productId) {
  const scored = questions[0].options.map((o) => [o.id, o.pts[productId]])
  const good = scored.filter(([, v]) => v >= 4).map(([id]) => id)
  if (good.length) return good
  const top = Math.max(...scored.map(([, v]) => v))
  return scored.filter(([, v]) => v === top).map(([id]) => id)
}
