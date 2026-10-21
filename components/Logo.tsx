// The N is drawn as a highway: white road edges, dark asphalt and a saffron centre line.
const ROAD = "M12.5 37.5 V12.5 L31 35.5 V15.5";

// Brand mark: an "N" road monogram with a rising sun, set in a teal tile.
export function LogoMark({ size = 44, id = "lm" }: { size?: number; id?: string }) {
  const road = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#17988a" />
          <stop offset="1" stopColor="#063a34" />
        </linearGradient>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd166" />
          <stop offset="1" stopColor="#fb8500" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect width="48" height="48" rx="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="48" height="48" fill={`url(#${id}-bg)`} />
        <path d="M-2 41 Q10 35 22 39 T50 37 V50 H-2 Z" fill="#ffffff" opacity=".09" />
        <circle cx="39" cy="10" r="4.6" fill={`url(#${id}-sun)`} />
        <path d={ROAD} {...road} stroke="#ffffff" strokeWidth="11" />
        <path d={ROAD} {...road} stroke="#0b2f2b" strokeWidth="7.6" />
        <path d={ROAD} {...road} stroke="#ffb703" strokeWidth="1.6" strokeDasharray="3.2 2.6" />
      </g>
    </svg>
  );
}

export default function Logo({ id = "lm", light = false }: { id?: string; light?: boolean }) {
  return (
    <span className={`logo${light ? " logo-light" : ""}`}>
      <LogoMark id={id} />
      <span className="logo-text">
        <b>Nagpal</b>
        <small>Tour &amp; Travels</small>
      </span>
    </span>
  );
}
