import { axes } from './content.js'

// Each option nudges the taste profile (p, around a neutral 3) and/or adds
// points to coffee categories (c). The recommendation is the product whose
// profile is closest to the visitor's, plus a bonus for fitting how they brew.
export const questions = [
  {
    id: 'brew',
    options: [
      { id: 'espresso', c: { espresso: 2.2, single: 0.6 } },
      { id: 'briki', c: { greek: 7 } },
      { id: 'filter', c: { filter: 2.2, single: 1.6, espresso: -1.2 } },
      { id: 'press', p: { body: 0.8 }, c: { single: 1.2, filter: 1 } },
    ],
  },
  {
    id: 'milk',
    options: [
      { id: 'black', p: { acidity: 0.6 }, c: { single: 0.4 } },
      { id: 'splash', p: {} },
      { id: 'lots', p: { body: 1, bitterness: 0.8, acidity: -1 }, c: { espresso: 1.2 } },
    ],
  },
  {
    id: 'flavour',
    options: [
      { id: 'choc', p: { body: 1, sweetness: 0.6, acidity: -1 } },
      { id: 'fruit', p: { acidity: 2, body: -1, bitterness: -1 }, c: { single: 1 } },
      { id: 'caramel', p: { sweetness: 2, bitterness: -0.5 } },
      { id: 'smoky', p: { bitterness: 2, body: 1, acidity: -1.2 } },
    ],
  },
  {
    id: 'acidity',
    options: [
      { id: 'bright', p: { acidity: 1.5 } },
      { id: 'balanced', p: {} },
      { id: 'low', p: { acidity: -1.5 } },
    ],
  },
  {
    id: 'strength',
    options: [
      { id: 'gentle', p: { body: -1, bitterness: -1 } },
      { id: 'medium', p: {} },
      { id: 'intense', p: { body: 1.5, bitterness: 1 } },
    ],
  },
  {
    id: 'adventure',
    options: [
      { id: 'classic', c: { espresso: 0.6, greek: 0.6, filter: 0.4 } },
      { id: 'explore', c: { single: 1.8 } },
    ],
  },
]

const clamp = (v) => Math.min(5, Math.max(1, v))

export function tasteProfile(answers) {
  const prof = Object.fromEntries(axes.map((a) => [a, 3]))
  answers.forEach((optId, qi) => {
    const opt = questions[qi]?.options.find((o) => o.id === optId)
    Object.entries(opt?.p || {}).forEach(([k, v]) => { prof[k] += v })
  })
  return Object.fromEntries(axes.map((a) => [a, clamp(prof[a])]))
}

export function recommend(answers, products) {
  const prof = tasteProfile(answers)
  const cats = {}
  answers.forEach((optId, qi) => {
    const opt = questions[qi]?.options.find((o) => o.id === optId)
    Object.entries(opt?.c || {}).forEach(([k, v]) => { cats[k] = (cats[k] || 0) + v })
  })
  const ranked = products
    .map((p) => {
      const dist = Math.sqrt(axes.reduce((s, a) => s + (p.profile[a] - prof[a]) ** 2, 0))
      const bonus = cats[p.category] || 0
      const score = -dist + 0.8 * bonus
      // Match % is a monotonic mapping of the score, so the ranking and the percentages agree.
      return { product: p, score, match: Math.round(Math.min(98, Math.max(60, 85 + score * 5))) }
    })
    .sort((a, b) => b.score - a.score)
  return { profile: prof, ranked }
}
