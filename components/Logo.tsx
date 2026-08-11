/**
 * The HFT wordmark, rebuilt as live text + SVG so it stays crisp at any
 * size and inherits the site fonts. Three sizes are used across the site:
 * `sm` in the sticky header, `md` in the footer, `lg` for hero lockups.
 */

const sizes = {
  sm: { wrap: "w-[168px]", hft: "text-[34px]", sub: "text-[8.5px]", tal: "text-[10px]" },
  md: { wrap: "w-[210px]", hft: "text-[42px]", sub: "text-[10.5px]", tal: "text-[12px]" },
  lg: { wrap: "w-[280px]", hft: "text-[56px]", sub: "text-[14px]", tal: "text-[16px]" },
} as const;

export default function Logo({
  size = "sm",
  className = "",
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  const s = sizes[size];

  return (
    <span
      className={`relative block shrink-0 select-none ${s.wrap} ${className}`}
      aria-label="High Frequency Talent"
    >
      {/* Swoosh that wraps the lockup */}
      <svg
        viewBox="0 0 200 92"
        className="pointer-events-none absolute -right-1 top-1 h-full w-[62%] overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M8 88C64 92 148 78 176 44 190 27 186 12 170 4"
          fill="none"
          stroke="var(--color-brand-600)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>

      <span className="relative flex items-end gap-[3px]">
        {/* Ascending equalizer bars */}
        <svg
          viewBox="0 0 34 30"
          className="h-[0.78em] w-auto shrink-0 -translate-y-[0.06em]"
          style={{ fontSize: "inherit" }}
          aria-hidden="true"
        >
          <g fill="var(--color-brand-600)" transform="skewX(-12)">
            <rect x="2" y="20" width="4" height="10" rx="0.5" />
            <rect x="9" y="12" width="4" height="18" rx="0.5" />
            <rect x="16" y="4" width="4" height="26" rx="0.5" />
            <rect x="23" y="9" width="4" height="21" rx="0.5" />
          </g>
          <rect
            x="30"
            y="0"
            width="3"
            height="30"
            fill="#fff"
            transform="skewX(-12)"
          />
        </svg>

        <span
          className={`font-display font-extrabold italic leading-[0.8] tracking-[-0.02em] ${s.hft}`}
        >
          <span className="text-brand-600">H</span>
          <span className="text-white">F</span>
          <span className="text-brand-600">T</span>
        </span>
      </span>

      <span className="relative mt-[0.15em] block text-center">
        <span
          className={`block font-display font-semibold uppercase leading-none tracking-[0.24em] text-white ${s.sub}`}
        >
          High Frequency
        </span>
        <span className="mt-[0.35em] flex items-center justify-center gap-[0.5em]">
          <span className="h-px w-[1.6em] bg-brand-700" />
          <span
            className={`font-display font-semibold uppercase leading-none tracking-[0.3em] text-brand-500 ${s.tal}`}
          >
            Talent
          </span>
          <span className="h-px w-[1.6em] bg-brand-700" />
        </span>
        <span className="mt-[0.25em] block font-display text-[7px] uppercase leading-none tracking-[0.2em] text-white/70">
          LLC
        </span>
      </span>
    </span>
  );
}
