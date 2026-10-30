// Country calling codes for the phone field. Greece first, then neighbours and
// the rest of Europe, then other common countries. Names come from
// Intl.DisplayNames in the page language; flags are in /public/flags
// (from flag-icons, MIT). `min` is the fewest digits a local number can have.
export const countries = [
  ['gr', '+30', 10], ['cy', '+357', 8],
  ['al', '+355'], ['bg', '+359'], ['mk', '+389'], ['tr', '+90'], ['ro', '+40'], ['rs', '+381'],
  ['it', '+39'], ['de', '+49'], ['fr', '+33'], ['es', '+34'], ['pt', '+351'], ['nl', '+31'],
  ['be', '+32'], ['lu', '+352'], ['at', '+43'], ['ch', '+41'], ['gb', '+44'], ['ie', '+353'],
  ['pl', '+48'], ['cz', '+420'], ['hu', '+36'], ['hr', '+385'], ['si', '+386'],
  ['se', '+46'], ['dk', '+45'], ['no', '+47'], ['fi', '+358'],
  ['us', '+1'], ['ca', '+1'], ['au', '+61'], ['ae', '+971'], ['il', '+972'], ['eg', '+20'],
].map(([id, dial, min = 6]) => ({ id, dial, min }))

const names = {}
export function countryName(id, lang) {
  names[lang] ??= new Intl.DisplayNames([lang], { type: 'region' })
  return names[lang].of(id.toUpperCase())
}
