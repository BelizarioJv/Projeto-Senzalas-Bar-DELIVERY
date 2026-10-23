import type { CSSProperties } from "react";

const OUTLINE =
  "M40 30 L200 30 L172 320 Q170 336 154 336 L86 336 Q70 336 68 320 Z";

const BUBBLES = [
  { cx: 96, r: 3, delay: "0s", dur: "4.2s" },
  { cx: 120, r: 4, delay: "1.1s", dur: "5s" },
  { cx: 144, r: 2.5, delay: "0.5s", dur: "3.8s" },
  { cx: 108, r: 2, delay: "2.3s", dur: "4.6s" },
  { cx: 132, r: 3.5, delay: "1.8s", dur: "5.4s" },
  { cx: 118, r: 2, delay: "3s", dur: "4s" },
  { cx: 150, r: 3, delay: "2.7s", dur: "4.8s" },
];

export function BeerGlass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 370"
      className={className}
      role="img"
      aria-label="Copo de cerveja gelada com espuma">
      <defs>
        <clipPath id="glass-clip">
          <path d={OUTLINE} />
        </clipPath>
        <linearGradient id="beer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--chart-4)" />
        </linearGradient>
      </defs>

      <g clipPath="url(#glass-clip)">
        <rect x="30" y="70" width="180" height="280" fill="url(#beer)" />

        {BUBBLES.map((b, i) => (
          <circle
            key={i}
            className="bubble"
            cx={b.cx}
            cy={310}
            r={b.r}
            fill="var(--foreground)"
            fillOpacity="0.55"
            style={{ "--delay": b.delay, "--dur": b.dur } as CSSProperties}
          />
        ))}

        {/* espuma */}
        <rect x="30" y="20" width="180" height="46" fill="var(--foreground)" />
        {[56, 84, 112, 140, 168, 196].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={66 + (i % 2) * 5}
            r={17}
            fill="var(--foreground)"
          />
        ))}
      </g>

      <path
        d="M60 90 L76 300"
        stroke="var(--foreground)"
        strokeOpacity="0.35"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={OUTLINE}
        fill="none"
        stroke="var(--foreground)"
        strokeOpacity="0.5"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
