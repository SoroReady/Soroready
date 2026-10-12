interface RadarIconProps {
  size?: number
  animado?: boolean
  className?: string
}

export function RadarIcon({ size = 64, animado = false, className = '' }: RadarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Soroready"
      className={className}
    >
      <circle cx="32" cy="32" r="30" fill="var(--c-fondo)" />
      <circle cx="32" cy="32" r="26" stroke="var(--c-primario)" strokeWidth="2" opacity="0.35" />
      <circle cx="32" cy="32" r="17" stroke="var(--c-primario)" strokeWidth="1.5" opacity="0.25" />
      <circle cx="32" cy="32" r="8" stroke="var(--c-primario)" strokeWidth="1.5" opacity="0.2" />
      <g style={{ transformOrigin: '32px 32px' }} className={animado ? 'animate-radar-sweep' : ''}>
        <path d="M32 32 L32 4 A28 28 0 0 1 56 18 Z" fill="url(#sweep)" />
      </g>
      <circle
        cx="46"
        cy="22"
        r="3"
        fill="var(--c-primario)"
        className={animado ? 'animate-radar-blip' : ''}
      />
      <circle cx="32" cy="32" r="30" stroke="var(--c-primario)" strokeWidth="1.5" />
      <defs>
        <linearGradient id="sweep" x1="32" y1="4" x2="56" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--c-primario)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--c-primario)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
