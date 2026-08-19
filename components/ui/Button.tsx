import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type Variant = "accent" | "solid" | "outline" | "ghost";
type Size = "default" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  withArrow?: boolean;
  children: React.ReactNode;
}

// The one CTA voice on the site: Oswald, caps, 0.22em. Every button and every
// inline call-to-action resolves to exactly this recipe — before, eight CTAs on
// the home page ran five different ones (Inter in caps, Inter in sentence case,
// Oswald in caps), which is what made the page feel assembled rather than
// designed.
const base =
  "group inline-flex items-center justify-center gap-3 rounded-pill font-accent text-[0.75rem] font-medium uppercase tracking-[0.22em] md:text-[0.8rem] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  accent:
    "bg-accent text-bg hover:bg-accent-hover",
  solid:
    "bg-text-1 text-bg hover:bg-text-2",
  outline:
    "border border-text-1/30 text-text-1 hover:border-text-1 hover:bg-text-1/[0.04]",
  ghost: "text-text-1 hover:text-accent",
};

const sizes: Record<Size, string> = {
  default: "h-12 px-8",
  lg: "h-14 px-10 text-[0.8125rem]",
};

function Arrow() {
  return (
    <ChevronRight
      className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
      strokeWidth={1.25}
    />
  );
}

export function Button({
  variant = "accent",
  size = "default",
  className,
  withArrow = false,
  children,
  ...rest
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
      {withArrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  variant = "accent",
  size = "default",
  className,
  withArrow = false,
  href,
  children,
  ...rest
}: BaseProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
      {withArrow && <Arrow />}
    </Link>
  );
}
