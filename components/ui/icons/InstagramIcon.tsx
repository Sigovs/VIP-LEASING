// Inline Instagram glyph. The project's pinned lucide-react v1.x doesn't
// ship this icon, and upgrading lucide for one glyph isn't worth the churn.
type Props = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function InstagramIcon({
  size = 18,
  strokeWidth = 1.5,
  className,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
