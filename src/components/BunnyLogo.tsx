/** Original line-drawn bunny mark. Colors come from CSS variables so it follows the theme. */
export default function BunnyLogo({ size = 34 }: { size?: number }) {
  return (
    <svg className="bunny" width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <g fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17C12 13 11 6.5 12.6 3.6c1.5-2.6 4.6-.6 5 3.6.3 3.2-.1 6.8-.9 9" />
        <path d="M25.5 17c2.5-4 3.5-10.5 1.9-13.4-1.5-2.6-4.6-.6-5 3.6-.3 3.2.1 6.8.9 9" />
      </g>
      <ellipse cx="20" cy="26" rx="12.5" ry="10.5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
      <circle cx="15.2" cy="25" r="1.5" fill="var(--text)" />
      <circle cx="24.8" cy="25" r="1.5" fill="var(--text)" />
      <ellipse cx="11.6" cy="29.2" rx="2.2" ry="1.3" fill="var(--accent)" opacity="0.35" />
      <ellipse cx="28.4" cy="29.2" rx="2.2" ry="1.3" fill="var(--accent)" opacity="0.35" />
      <path d="M18 28.8q1 1.2 2 0q1 1.2 2 0" fill="none" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
