import { Link } from 'react-router-dom'

const orange = '#F08221'
const charcoal = '#2D323E'
const checkGreen = '#74D160'

type LogoProps = {
  iconOnly?: boolean
  className?: string
}

/**
 * Logo mark: clean document with check — resume approved. Works at any size.
 */
export function LogoMark() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="overflow-visible"
    >
      {/* Document shape — rounded rectangle */}
      <path
        d="M8 6a2 2 0 0 1 2-2h10l6 6v16a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6z"
        fill={orange}
      />
      {/* Folded corner accent */}
      <path d="M24 4v6h-6l6-6z" fill="rgba(0,0,0,0.12)" />
      {/* Checkmark */}
      <path
        d="M14 18.5l4 4 8-9"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function Logo({ iconOnly = false, className = '' }: LogoProps) {
  const linkClass =
    'inline-flex items-center gap-2.5 no-underline shrink-0 transition-opacity hover:opacity-90 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ' +
    className

  return (
    <Link to="/" className={linkClass} aria-label="Cvmora – Home">
      <span className="flex items-center justify-center flex-shrink-0">
        <LogoMark />
      </span>
      {!iconOnly && (
        <span
          className="font-semibold tracking-tight"
          style={{
            fontSize: '1.15rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: orange }}>Cv</span>
          <span style={{ color: charcoal }}>mora</span>
        </span>
      )}
    </Link>
  )
}
