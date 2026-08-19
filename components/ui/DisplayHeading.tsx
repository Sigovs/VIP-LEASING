import { cn } from "@/lib/utils";

type Size = "xl" | "lg" | "md" | "sm";

// Inter Tight (the .font-title idiom — same display face as the home page
// section titles and the inventory H1). The grotesk wants negative tracking at
// display sizes; .font-title already pins it, so none is set per-size here.
const sizes: Record<Size, string> = {
  xl: "text-display-1 leading-[1.0]",
  lg: "text-display-2 leading-[1.04]",
  md: "text-display-3 leading-[1.08]",
  sm: "text-2xl md:text-[1.85rem] leading-[1.18]",
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
    <Tag className={cn("font-title text-text-1 font-bold", sizes[size], className)}>
      {children}
    </Tag>
  );
}
