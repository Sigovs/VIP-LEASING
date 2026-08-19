import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1600px] px-6 md:px-12",
        className
      )}
    >
      {children}
    </Tag>
  );
}
