import type { ReactNode } from "react";

/** Тематические SVG-иллюстрации. Свой PNG: public/topics/{id}.png → imageSrc в topic-map-display. */

interface TopicCardArtProps {
  branchId: string;
  className?: string;
}

export function TopicCardArt({ branchId, className = "" }: TopicCardArtProps) {
  const art = ARTS[branchId] ?? ARTS.default;
  return (
    <svg
      viewBox="0 0 200 140"
      className={className}
      aria-hidden
      role="img"
    >
      {art}
    </svg>
  );
}

const ARTS: Record<string, ReactNode> = {
  "logic-knights": (
    <>
      <ellipse cx="70" cy="118" rx="28" ry="6" fill="#000" opacity="0.08" />
      <ellipse cx="130" cy="118" rx="28" ry="6" fill="#000" opacity="0.08" />
      <g transform="translate(48,18)">
        <rect x="8" y="52" width="18" height="28" rx="4" fill="#94A3B8" />
        <rect x="0" y="28" width="34" height="30" rx="8" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
        <rect x="10" y="12" width="14" height="18" rx="3" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
        <line x1="17" y1="0" x2="17" y2="12" stroke="#64748B" strokeWidth="2" />
        <path d="M34 40 L52 24" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 24 L58 18 L54 30 Z" fill="#F59E0B" />
      </g>
      <g transform="translate(112,18) scale(-1,1) translate(-34,0)">
        <rect x="8" y="52" width="18" height="28" rx="4" fill="#94A3B8" />
        <rect x="0" y="28" width="34" height="30" rx="8" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
        <rect x="10" y="12" width="14" height="18" rx="3" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
        <line x1="17" y1="0" x2="17" y2="12" stroke="#64748B" strokeWidth="2" />
        <path d="M34 40 L52 24" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 24 L58 18 L54 30 Z" fill="#F59E0B" />
      </g>
    </>
  ),

  "logic-euler": (
    <>
      <circle cx="88" cy="62" r="34" fill="#FCA5A5" opacity="0.85" />
      <circle cx="112" cy="62" r="34" fill="#FDE68A" opacity="0.85" />
      <circle cx="100" cy="82" r="34" fill="#93C5FD" opacity="0.85" />
      <circle cx="100" cy="48" r="28" fill="#86EFAC" opacity="0.75" />
    </>
  ),

  "comb-tree": (
    <>
      <circle cx="100" cy="24" r="10" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2" />
      <line x1="100" y1="34" x2="62" y2="58" stroke="#7C3AED" strokeWidth="2.5" />
      <line x1="100" y1="34" x2="138" y2="58" stroke="#7C3AED" strokeWidth="2.5" />
      <circle cx="62" cy="66" r="9" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="2" />
      <circle cx="138" cy="66" r="9" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="2" />
      <line x1="62" y1="75" x2="42" y2="98" stroke="#7C3AED" strokeWidth="2" />
      <line x1="62" y1="75" x2="82" y2="98" stroke="#7C3AED" strokeWidth="2" />
      <line x1="138" y1="75" x2="118" y2="98" stroke="#7C3AED" strokeWidth="2" />
      <line x1="138" y1="75" x2="158" y2="98" stroke="#7C3AED" strokeWidth="2" />
      {[42, 82, 118, 158].map((x) => (
        <circle key={x} cx={x} cy={106} r="7" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.5" />
      ))}
    </>
  ),

  "modeling-heads-legs": (
    <>
      {[36, 68, 100, 132].map((x, i) => (
        <g key={x} transform={`translate(${x - 12}, ${i % 2 === 0 ? 28 : 36})`}>
          <circle cx="12" cy="10" r={i % 2 === 0 ? 9 : 7} fill={["#F472B6", "#FB7185", "#F9A8D4", "#FDA4AF"][i]} />
          <rect x="6" y="20" width="12" height={i % 2 === 0 ? 36 : 28} rx="4" fill={["#EC4899", "#F43F5E", "#DB2777", "#E11D48"][i]} opacity="0.85" />
          <rect x="4" y="52" width="5" height="18" rx="2" fill="#BE185D" />
          <rect x="15" y="52" width="5" height="18" rx="2" fill="#BE185D" />
        </g>
      ))}
    </>
  ),

  "proof-dirichlet": (
    <>
      <ellipse cx="100" cy="112" rx="40" ry="8" fill="#000" opacity="0.06" />
      <ellipse cx="100" cy="72" rx="38" ry="32" fill="#94A3B8" />
      <circle cx="88" cy="62" r="5" fill="#1E293B" />
      <circle cx="112" cy="62" r="5" fill="#1E293B" />
      <path d="M88 78 Q100 86 112 78" stroke="#475569" strokeWidth="2" fill="none" />
      <path d="M72 68 Q58 58 52 48" stroke="#64748B" strokeWidth="2" fill="none" />
      <rect x="118" y="58" width="22" height="16" rx="3" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5" transform="rotate(12 129 66)" />
      <rect x="76" y="82" width="18" height="14" rx="2" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.2" transform="rotate(-8 85 89)" />
    </>
  ),

  "inv-parity": (
    <>
      <rect x="52" y="36" width="96" height="72" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={52 + col * 24}
            y={36 + row * 18}
            width="24"
            height="18"
            fill={(row + col) % 2 === 0 ? "#FDE68A" : "#78350F"}
            opacity={(row + col) % 2 === 0 ? 1 : 0.85}
          />
        ))
      )}
      <path d="M118 52 L126 36 L134 52 L150 54 L138 66 L142 82 L126 74 L110 82 L114 66 L102 54 Z" fill="#1E293B" />
    </>
  ),

  "graphs-paths": (
    <>
      {[
        [60, 90],
        [100, 40],
        [140, 90],
        [100, 110],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="12" fill="#A78BFA" stroke="#6D28D9" strokeWidth="2" />
      ))}
      <line x1="60" y1="90" x2="100" y2="40" stroke="#4C1D95" strokeWidth="2.5" />
      <line x1="100" y1="40" x2="140" y2="90" stroke="#4C1D95" strokeWidth="2.5" />
      <line x1="60" y1="90" x2="100" y2="110" stroke="#4C1D95" strokeWidth="2.5" />
      <line x1="140" y1="90" x2="100" y2="110" stroke="#4C1D95" strokeWidth="2.5" />
      <line x1="60" y1="90" x2="140" y2="90" stroke="#4C1D95" strokeWidth="2.5" />
    </>
  ),

  "games-winning": (
    <>
      <rect x="58" y="30" width="84" height="84" rx="8" fill="#ECFEFF" stroke="#0891B2" strokeWidth="2" />
      {[
        [2, 7, 6],
        [9, 5, 1],
        [4, 3, 8],
      ].map((row, ri) =>
        row.map((n, ci) => (
          <g key={`${ri}-${ci}`}>
            <rect x={62 + ci * 26} y={34 + ri * 26} width="24" height="24" rx="4" fill="#fff" stroke="#A5F3FC" strokeWidth="1" />
            <text x={74 + ci * 26} y={52 + ri * 26} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0E7490">
              {n}
            </text>
          </g>
        ))
      )}
    </>
  ),

  "inv-coloring": (
    <>
      <rect x="50" y="40" width="100" height="70" rx="6" fill="#fff" stroke="#64748B" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={54 + i * 18} y="44" width="16" height="62" fill={["#FCA5A5", "#FDE68A", "#86EFAC", "#93C5FD", "#C4B5FD"][i]} opacity="0.9" />
      ))}
    </>
  ),

  "logic-sets": (
    <>
      <rect x="40" y="50" width="50" height="40" rx="6" fill="#93C5FD" opacity="0.7" />
      <rect x="70" y="50" width="50" height="40" rx="6" fill="#FCA5A5" opacity="0.7" />
      <rect x="110" y="50" width="50" height="40" rx="6" fill="#86EFAC" opacity="0.7" />
    </>
  ),

  default: (
    <>
      <rect x="62" y="38" width="76" height="64" rx="10" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="2" />
      <line x1="100" y1="38" x2="100" y2="102" stroke="#C4B5FD" strokeWidth="2" />
      <rect x="72" y="54" width="20" height="4" rx="2" fill="#A78BFA" />
      <rect x="72" y="66" width="28" height="4" rx="2" fill="#C4B5FD" />
    </>
  ),
};
