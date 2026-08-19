import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-accent text-[0.75rem] tracking-[0.22em] text-text-3",
        className
      )}
    >
      {children}
    </span>
  );
}
