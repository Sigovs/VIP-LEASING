"use client";

import { Button } from "@/components/ui/Button";

// Opens the single InquireDrawer instance from anywhere on the VDP via a window
// event — so the hero buy-panel and the closing CTA both drive one drawer.
export function InquireButton({
  className,
  size = "lg",
  children = "Inquire",
}: {
  className?: string;
  size?: "default" | "lg";
  children?: React.ReactNode;
}) {
  return (
    <Button
      variant="accent"
      size={size}
      withArrow
      className={className}
      onClick={() => window.dispatchEvent(new Event("inquire:open"))}
    >
      {children}
    </Button>
  );
}
