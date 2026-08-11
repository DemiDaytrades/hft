import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BellIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function ChartIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M3 20h18" />
      <path d="M6 20v-6M11 20V9M16 20v-9" />
      <path d="m14 6 4-3 3 3.5" />
      <path d="M18 3v4h3" />
    </svg>
  );
}

export function VideoIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="2.5" y="6" width="14" height="12" rx="2.5" />
      <path d="m16.5 12.5 5 3.2V8.3l-5 3.2z" />
    </svg>
  );
}

export function DiscordIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M19.3 5.36A17.4 17.4 0 0 0 15 4l-.2.4a13 13 0 0 1 3.8 1.9 15.9 15.9 0 0 0-13.2 0A13 13 0 0 1 9.2 4.4L9 4a17.4 17.4 0 0 0-4.3 1.36C2 9.4 1.3 13.3 1.6 17.2A17.6 17.6 0 0 0 7 20l1.1-1.6a11.4 11.4 0 0 1-1.8-.9l.5-.3a12.6 12.6 0 0 0 10.4 0l.5.3a11.4 11.4 0 0 1-1.8.9L17 20a17.6 17.6 0 0 0 5.4-2.8c.4-4.5-.7-8.4-3.1-11.84ZM8.5 14.9c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Zm7 0c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Z" />
    </svg>
  );
}

export function TelegramIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M21.9 4.3 18.6 20c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16 9.4-8.49c.4-.36-.09-.56-.63-.2L5.76 13.44.76 11.88c-1.09-.34-1.11-1.09.23-1.61l19.2-7.4c.9-.33 1.7.21 1.7 1.43Z" />
    </svg>
  );
}

export function TargetIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </svg>
  );
}

export function JournalIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5 3.5h11a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M8 3.5v19" />
      <path d="M11.5 9h3.5M11.5 13h3.5" />
    </svg>
  );
}

export function CheckIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="m8.2 12.2 2.6 2.6 5-5.4" />
    </svg>
  );
}

export function CrossIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

export function ArrowRight(p: P) {
  return (
    <svg {...base} strokeWidth={2} {...p}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function LockIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function RocketIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2.5c3.2 2 5 5.6 5 9.3v3.4l-2.6 2.3H9.6L7 15.2v-3.4c0-3.7 1.8-7.3 5-9.3Z" />
      <circle cx="12" cy="10" r="1.9" />
      <path d="M7 14.5 4 17l.6 3.4L7.7 19M17 14.5l3 2.5-.6 3.4L16.3 19" />
      <path d="M10.4 21.5 12 19l1.6 2.5" />
    </svg>
  );
}

export function MoneyIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M9 2.5h6l-1.4 3.2h-3.2L9 2.5Z" />
      <path d="M13.6 5.7c3.6 1.5 6.4 5 6.4 9 0 3.4-3.6 5.8-8 5.8s-8-2.4-8-5.8c0-4 2.8-7.5 6.4-9" />
      <path d="M12 10v7M14 11.6c-.6-.7-1.3-1-2-1-1.1 0-2 .6-2 1.5s.9 1.3 2 1.5 2 .6 2 1.5-.9 1.5-2 1.5c-.7 0-1.4-.3-2-1" />
    </svg>
  );
}

export function HeartIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 20.3S3.5 15.4 3.5 9.6A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8.5 2.5c0 5.8-8.5 10.7-8.5 10.7Z" />
    </svg>
  );
}

export function UsersIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M2.8 19.5a6.4 6.4 0 0 1 12.4 0" />
      <path d="M16 5.7a3.2 3.2 0 0 1 0 5.7M17.6 14.2a6.4 6.4 0 0 1 3.6 5.3" />
    </svg>
  );
}

export function DiamondIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M7 3.5h10l4 5-9 12-9-12 4-5Z" />
      <path d="M3 8.5h18M9.5 8.5 12 3.5l2.5 5M12 20.5l2.5-12M12 20.5 9.5 8.5" />
    </svg>
  );
}

export function CrownIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M3 7.5 6.5 15h11L21 7.5l-5 3.2L12 4.5 8 10.7 3 7.5Z" />
      <path d="M6.5 18.5h11" />
    </svg>
  );
}

export function MusicIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </svg>
  );
}

export function ClockIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}

export function WaveIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M3 12v1M6.5 8v8M10 4.5v15M13.5 7v10M17 9.5v5M20.5 11.5v1" />
    </svg>
  );
}

export function ShieldIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2.8 4.5 6v6c0 4.4 3.1 8 7.5 9.2 4.4-1.2 7.5-4.8 7.5-9.2V6L12 2.8Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function BoltIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M13.5 2.5 4.5 13.6h6.2L10 21.5l9.5-11.4h-6.4l.4-7.6Z" />
    </svg>
  );
}

export function QuoteIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M9.5 5.5c-3.6 1.7-5.6 4.7-5.6 8.3 0 3 1.6 4.7 3.8 4.7 1.9 0 3.4-1.4 3.4-3.3 0-1.8-1.3-3.2-3-3.2-.3 0-.6 0-.8.1.4-1.7 1.7-3.3 3.6-4.4l-1.4-2.2Zm9 0c-3.6 1.7-5.6 4.7-5.6 8.3 0 3 1.6 4.7 3.8 4.7 1.9 0 3.4-1.4 3.4-3.3 0-1.8-1.3-3.2-3-3.2-.3 0-.6 0-.8.1.4-1.7 1.7-3.3 3.6-4.4l-1.4-2.2Z" />
    </svg>
  );
}

/* ── Social ─────────────────────────────────────────────────────── */

export function YoutubeIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M23 12s0-3.8-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.9 2.9 0 0 0 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2C23 15.8 23 12 23 12ZM9.8 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

export function InstagramIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M16.6 2h-3.2v13.4a2.6 2.6 0 1 1-2-2.5v-3.3a5.9 5.9 0 1 0 5.2 5.8V8.9a6.7 6.7 0 0 0 3.9 1.2V6.9a3.6 3.6 0 0 1-3.9-3.5V2Z" />
    </svg>
  );
}

export function XIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1-5.8 6.1H1.5l7.5-8.5L1.2 3h6.6l4.5 5.6L17.5 3Zm-1.1 16.1h1.8L7.7 4.8H5.8l10.6 14.3Z" />
    </svg>
  );
}

/** Icon registry so data files can reference icons by name. */
export const iconMap = {
  bell: BellIcon,
  chart: ChartIcon,
  video: VideoIcon,
  discord: DiscordIcon,
  telegram: TelegramIcon,
  target: TargetIcon,
  journal: JournalIcon,
  rocket: RocketIcon,
  money: MoneyIcon,
  heart: HeartIcon,
  users: UsersIcon,
  diamond: DiamondIcon,
  crown: CrownIcon,
  music: MusicIcon,
  clock: ClockIcon,
  wave: WaveIcon,
  shield: ShieldIcon,
  bolt: BoltIcon,
} as const;

export type IconKey = keyof typeof iconMap;

export function Icon({
  name,
  ...rest
}: { name: IconKey } & SVGProps<SVGSVGElement>) {
  const Cmp = iconMap[name];
  return <Cmp {...rest} />;
}
