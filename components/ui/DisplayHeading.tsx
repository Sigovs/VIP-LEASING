import { cn } from "@/lib/utils";

type Size = "xl" | "lg" | "md" | "sm";

// Inter Tight (the .font-title idiom — same display face as the home page
// section titles and the inventory H1). The grotesk wants negative tracking at
// display sizes; .font-title already pins it, so none is set per-size here.
// The display face is a didone: below roughly 40px its hairlines stop being
// drawn, so the smallest step is set in the body face instead. It is a subhead,
// not display, and pretending otherwise just makes it fragile.
const sizes: Record<Size, string> = {
  xl: "font-title text-display-1 leading-[1.0]",
  lg: "font-title text-display-2 leading-[1.04]",
  md: "font-title text-display-3 leading-[1.08]",
  sm: "font-sans text-2xl md:text-[1.85rem] leading-[1.18]",
};

export function DisplayHeading({
  children,
  as: Tag = "h2",
  size = "lg",
  className,
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  size?: Size;
  className?: string;
}) {
  return (
    <Tag className={cn("text-text-1 font-bold", sizes[size], className)}>
      {children}
    </Tag>
  );
}
