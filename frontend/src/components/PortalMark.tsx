export function PortalMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="portalMarkGradient" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ecfccb" />
          <stop offset="45%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#365314" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="url(#portalMarkGradient)" />
      <ellipse
        cx="16"
        cy="16"
        rx="7"
        ry="10"
        fill="#1a2e05"
        opacity="0.55"
      />
      <circle cx="16" cy="16" r="15" fill="none" stroke="#d9f99d" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
