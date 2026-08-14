/**
 * The HFT seal lockup: the circular badge artwork paired with the wordmark.
 *
 * The seal is a raster asset, so it ships pre-resized rather than scaling the
 * 2MB original -- a header mark renders at ~48px and must not cost 2MB on every
 * page. `sm` uses the 128px file, larger sizes step up to 256px.
 *
 * Three sizes are used across the site: `sm` in the sticky header, `md` in the
 * footer, `lg` for hero lockups.
 */

const sizes = {
  // Header: badge only. The lockup with text ran ~200px wide and crowded the
  // nav and CTA on one row; the seal alone is distinctive enough, and the
  // aria-label still gives screen readers the full name.
  // 62px inside an 80px bar leaves ~9px of breathing room top and bottom.
  // Both headers are h-20 so this fits either.
  sm: { seal: 62, src: "/hft-seal-128.png", wordmark: false, hft: "", sub: "" },
  md: {
    seal: 60,
    src: "/hft-seal-256.png",
    wordmark: true,
    hft: "text-[16px]",
    sub: "text-[9.5px]",
  },
  lg: {
    seal: 96,
    src: "/hft-seal-256.png",
    wordmark: true,
    hft: "text-[24px]",
    sub: "text-[13px]",
  },
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
      className={`relative flex shrink-0 select-none items-center gap-3 ${className}`}
      aria-label="High Frequency Talent"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- next/image needs a
          loader on Workers; the asset is already sized and served from Workers
          Assets, so a plain img avoids that dependency entirely. */}
      <img
        src={s.src}
        alt=""
        aria-hidden="true"
        width={s.seal}
        height={s.seal}
        loading="eager"
        decoding="async"
        className="shrink-0"
        style={{ width: s.seal, height: s.seal }}
      />

      {s.wordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display font-semibold uppercase tracking-[0.2em] text-white ${s.hft}`}
          >
            High Frequency
          </span>
          <span
            className={`mt-[0.35em] font-display font-semibold uppercase tracking-[0.34em] text-brand-500 ${s.sub}`}
          >
            Talent
          </span>
        </span>
      )}
    </span>
  );
}
