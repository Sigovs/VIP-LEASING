"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { cn } from "@/lib/utils";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { SHOWROOM } from "@/lib/showroom";

// Service sits beside Financing, not off with About: both answer "what does
// this house do for me once the car is mine", and the client asked for the tab
// explicitly.
const NAV = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/sold", label: "Sold" },
  { href: "/sell", label: "Sell" },
  { href: "/financing", label: "Financing" },
  { href: "/service", label: "Service" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Phone lives in lib/showroom.ts only — see AGENTS.md.
const PHONE_DISPLAY = SHOWROOM.phoneDisplay;
const PHONE_HREF = SHOWROOM.phoneHref;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled || open
          ? "bg-bg/90 border-border backdrop-blur-md"
          : "bg-transparent border-transparent"
      )}
    >
      {/* Legibility scrim while the bar floats transparent over the hero;
          fades out once the solid frosted background takes over on scroll. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent transition-opacity duration-300",
          scrolled || open ? "opacity-0" : "opacity-100"
        )}
      />
      <Container className="relative flex h-16 md:h-20 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="VIP Leasing — home"
          className="flex items-center shrink-0"
        >
          <Image
            src="/logo.svg"
            alt="VIP Leasing"
            width={1212}
            height={120}
            priority
            className="h-auto w-[150px] md:w-[190px] [filter:invert(1)]"
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-8">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative py-1 text-[0.78rem] uppercase tracking-[0.14em] font-semibold text-text-1"
                >
                  {item.label}
                  {/* Gold hairline: persistent when active, wipes in from the
                      left on hover (scaleX = GPU-friendly, no layout shift). */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ease-out",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>
          <span className="h-5 w-px bg-border" aria-hidden />
          <a
            href={PHONE_HREF}
            className="font-mono text-[0.78rem] text-text-1 hover:text-accent transition-colors whitespace-nowrap tabular-nums"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram @${INSTAGRAM_HANDLE}`}
            className="text-text-1 hover:text-accent transition-colors"
          >
            <InstagramIcon size={18} strokeWidth={1.5} />
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-text-1"
        >
          {open ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
        </button>
      </Container>

      {open && (
        <div className="md:hidden bg-bg border-t border-border">
          <Container className="py-8">
            <nav className="flex flex-col gap-6">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-3xl font-semibold tracking-tight transition-colors",
                      active ? "text-accent" : "text-text-1 hover:text-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-10 flex items-center gap-6">
              <a
                href={PHONE_HREF}
                onClick={() => setOpen(false)}
                className="text-base font-semibold tracking-[0.04em] text-text-2 hover:text-accent transition-colors tabular-nums"
              >
                {PHONE_DISPLAY}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram @${INSTAGRAM_HANDLE}`}
                className="text-text-2 hover:text-accent transition-colors"
              >
                <InstagramIcon size={20} strokeWidth={1.5} />
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
