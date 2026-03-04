import { Link } from 'react-router-dom'

const orange = '#F08221'
const charcoal = '#2D323E'
const checkGreen = '#74D160'
const dogEar = '#B85C38'

type LogoProps = {
  iconOnly?: boolean
  className?: string
}

/**
 * Logo mark: orange circle, stacked documents (charcoal + white), green checkmarks, dog-ear.
 */
function LogoMark() {
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
      {/* Orange circle */}
      <circle cx="18" cy="18" r="17.5" fill={orange} />
      {/* Back document (charcoal, stacked) */}
      <path
        d="M10 14h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z"
        fill={charcoal}
        transform="rotate(-2 18 18)"
      />
      {/* Front document (white) with rounded corners; top-right cut for dog-ear */}
      <path
        d="M11.5 11.5a1.5 1.5 0 0 1 1.5-1.5h11l5 5v13a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-16a1.5 1.5 0 0 1 1.5-1.5z"
        fill="white"
      />
      {/* Dog-ear (folded corner) */}
      <path d="M23 11l5 0 0 5z" fill={dogEar} />
      {/* Three green checkmarks */}
      <path
        d="M14 17.5l2.5 2.5 5-5"
        stroke={checkGreen}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 23l2.5 2.5 5-5"
        stroke={checkGreen}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 28.5l2.5 2.5 5-5"
        stroke={checkGreen}
        strokeWidth="1.4"
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
