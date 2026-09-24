// Hand-drawn SVG art (no raster assets): coffee beans, bags, cup, icons.

export function Bean({ className = '', color = 'currentColor', crease = '#0f0b08', style }) {
  return (
    <svg viewBox="0 0 40 56" className={className} style={style} aria-hidden="true">
      <ellipse cx="20" cy="28" rx="17" ry="25" fill={color} />
      <path d="M20 5c-7 9 7 21 0 46" stroke={crease} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85" />
      <ellipse cx="13" cy="18" rx="4" ry="8" fill="#fff" opacity=".08" />
    </svg>
  )
}

export function Bag({ product, className = '' }) {
  const { bag, ink, name, kicker, weight, roast } = product
  return (
    <svg viewBox="0 0 220 300" className={className} role="img" aria-label={`${name} coffee bag`}>
      <defs>
        <linearGradient id={`shade-${product.id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".28" />
          <stop offset=".18" stopColor="#000" stopOpacity="0" />
          <stop offset=".82" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".32" />
        </linearGradient>
      </defs>
      {/* body */}
      <path d="M28 40 L192 40 L204 286 Q110 296 16 286 Z" fill={bag} />
      <path d="M28 40 L192 40 L204 286 Q110 296 16 286 Z" fill={`url(#shade-${product.id})`} />
      {/* crimped top */}
      <rect x="24" y="14" width="172" height="30" rx="3" fill={bag} />
      <rect x="24" y="14" width="172" height="30" rx="3" fill="#000" opacity=".18" />
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={i} x1={30 + i * 8} x2={30 + i * 8} y1="18" y2="40" stroke="#000" strokeOpacity=".2" strokeWidth="1.2" />
      ))}
      {/* valve */}
      <circle cx="110" cy="72" r="7" fill="none" stroke={ink} strokeOpacity=".5" strokeWidth="1.5" />
      <circle cx="110" cy="72" r="2.5" fill={ink} fillOpacity=".5" />
      {/* label */}
      <text x="110" y="120" textAnchor="middle" fill={ink} fontFamily="Montserrat Variable, sans-serif" fontSize="10" letterSpacing="5" fontWeight="600">FUERTE</text>
      <line x1="70" x2="150" y1="132" y2="132" stroke={ink} strokeOpacity=".4" />
      <text x="110" y="172" textAnchor="middle" fill={ink} fontFamily="Cormorant Variable, serif" fontSize="30" fontStyle="italic" fontWeight="600">{name}</text>
      <text x="110" y="194" textAnchor="middle" fill={ink} fillOpacity=".75" fontFamily="Montserrat Variable, sans-serif" fontSize="7.5" letterSpacing="1.5">{kicker.toUpperCase()}</text>
      {/* roast dots */}
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={86 + i * 12} cy="222" r="3.4" fill={ink} fillOpacity={i < roast ? 0.9 : 0.2} />
      ))}
      <text x="110" y="262" textAnchor="middle" fill={ink} fillOpacity=".6" fontFamily="Montserrat Variable, sans-serif" fontSize="8" letterSpacing="2">{weight} · 100% ARABICA</text>
    </svg>
  )
}

export function Cup({ className = '' }) {
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden="true">
      <g className="steam" fill="none" stroke="#f5efe6" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round">
        <path d="M100 92c-14-16 14-26 0-44" />
        <path d="M130 92c-14-16 14-26 0-44" />
        <path d="M160 92c-14-16 14-26 0-44" />
      </g>
      <ellipse cx="130" cy="222" rx="104" ry="18" fill="#000" opacity=".35" />
      <ellipse cx="130" cy="212" rx="98" ry="16" fill="#e7dccb" />
      <path d="M52 108h156l-14 78a30 30 0 0 1-30 24H96a30 30 0 0 1-30-24z" fill="#f5efe6" />
      <path d="M206 124c30 0 34 46 0 50" fill="none" stroke="#f5efe6" strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="130" cy="108" rx="78" ry="13" fill="#3b2415" />
      <ellipse cx="130" cy="108" rx="60" ry="8" fill="#8a5a2b" opacity=".7" />
      <path d="M112 106c10-6 26-6 36 0" stroke="#d9b77a" strokeWidth="2" fill="none" opacity=".8" />
    </svg>
  )
}

const icon = (d) =>
  function Icon({ className = 'size-5' }) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
      </svg>
    )
  }

export const ArrowRight = icon(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>)
export const ArrowUpRight = icon(<><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>)
export const Bag2 = icon(<><path d="M6 7h12l1 13H5z" /><path d="M9 7a3 3 0 0 1 6 0" /></>)
export const Plus = icon(<><path d="M12 5v14" /><path d="M5 12h14" /></>)
export const Leaf = icon(<><path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 16-9 0 9-3 16-9 16Z" /><path d="M4 21c4-4 7-7 11-10" /></>)
export const Flame = icon(<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7Z" />)
export const Award = icon(<><circle cx="12" cy="9" r="6" /><path d="m9 14-1 8 4-2 4 2-1-8" /></>)
export const Truck = icon(<><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>)
export const Menu = icon(<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h10" /></>)
export const Close = icon(<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>)
export const Instagram = icon(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></>)
export const Facebook = icon(<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" />)
export const Mail = icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>)
