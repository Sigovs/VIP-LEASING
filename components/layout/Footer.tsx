"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { BRAND, HAS_ADDRESS, SHOWROOM } from "@/lib/showroom";

const COLUMNS = [
  {
    heading: "Inventory",
    links: [
      { href: "/inventory", label: "All cars" },
      { href: "/inventory?make=Porsche", label: "Porsche" },
      { href: "/inventory?make=Ferrari", label: "Ferrari" },
      { href: "/inventory?make=McLaren", label: "McLaren" },
      { href: "/inventory?make=Lamborghini", label: "Lamborghini" },
      { href: "/sold", label: "Recently sold" },
    ],
  },
  {
    heading: "Services",
    links: [
      { href: "/sell", label: "Sell your car" },
      { href: "/financing", label: "Financing" },
      { href: "/service", label: "Service" },
      { href: "/contact", label: "Worldwide delivery" },
      { href: "/contact", label: "Appointments" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/contact", label: "Showroom" },
    ],
  },
];

export function Footer() {
  // v4 is a standalone mockup with its own copy of every page. Inside it the
  // footer has to stay there too — a link out to /inventory would drop the
  // visitor onto the shared build in the middle of the thing that exists to be
  // different from it. Same rule as the header.
  const pathname = usePathname();
  const onV4 = pathname === "/v4" || pathname.startsWith("/v4/");
  const to = (href: string) =>
    !onV4 ? href : href === "/" ? "/v4" : `/v4${href}`;

  return (
    <footer className="border-t border-border bg-paper text-text-1">
      <Container className="py-16 md:py-24">
        {/* Identity row. The reference site shows three marks here — two
            dealerships and a leasing partner. This house is one brand with no
            named lender, so the row is the wordmark and the line beneath it. */}
        <div className="flex flex-col items-center gap-6 text-center">
          <Link href={to("/")} aria-label={`${BRAND.name} — home`} className="block">
            <Image
              src="/logo.svg"
              alt={BRAND.name}
              width={184}
              height={61}
              className="h-12 w-auto object-contain md:h-14"
            />
          </Link>
          <p className="font-accent text-[0.85rem] uppercase tracking-[0.24em] text-text-2">
            {BRAND.tagline}
          </p>
        </div>

        {/* Directory — showroom contact + link columns */}
        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-border pt-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] md:mt-20 md:pt-16">
          <div>
            <h4 className="mb-5 text-sm font-semibold text-text-1">Showroom</h4>
            <address className="space-y-1 font-mono text-[0.85rem] not-italic leading-relaxed text-text-1">
              {HAS_ADDRESS ? (
                <>
                  <p>{SHOWROOM.street}</p>
                  <p>{SHOWROOM.cityStateZip}</p>
                </>
              ) : (
                <p>{SHOWROOM.market}</p>
              )}
              <p className="pt-2">
                <a
                  href={SHOWROOM.phoneHref}
                  className="text-text-1 transition-colors hover:text-accent"
                >
                  {SHOWROOM.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${SHOWROOM.email}`}
                  className="text-text-1 transition-colors hover:text-accent"
                >
                  {SHOWROOM.email}
                </a>
              </p>
            </address>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-fit items-center gap-2 font-mono text-[0.85rem] text-text-1 transition-colors hover:text-accent"
            >
              <InstagramIcon size={16} strokeWidth={1.5} />@{INSTAGRAM_HANDLE}
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-5 text-sm font-semibold text-text-1">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={to(l.href)}
                      className="text-sm text-text-1 transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-sm text-text-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="font-mono text-[0.8rem]">{SHOWROOM.hoursShort}</p>
        </div>
      </Container>
    </footer>
  );
}
