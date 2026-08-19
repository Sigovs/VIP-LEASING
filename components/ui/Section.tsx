import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  spacing = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  spacing?: "default" | "tight" | "hero";
}) {
  const spacingClass =
    spacing === "hero"
      ? ""
      : spacing === "tight"
        ? "py-16 md:py-24"
        : "py-20 md:py-32";
  return (
    <section id={id} className={cn(spacingClass, className)}>
      {children}
    </section>
  );
}
