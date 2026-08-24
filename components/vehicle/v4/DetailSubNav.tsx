"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Gallery" },
  { id: "specifications", label: "Specifications" },
  { id: "options", label: "Options" },
  { id: "inquire", label: "Inquire" },
];

export function DetailSubNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Vehicle sections"
      className="sticky top-16 md:top-20 z-30 bg-bg/90 backdrop-blur-md border-y border-border"
    >
      <div className="overflow-x-auto scroll-gallery">
        {/* Container, not its own px — so the nav obeys the same 1600px column and
            the same gutters as everything else. Then -mx-5 cancels the items' own
            px-5, which is what put the first label 20px INBOARD of the photograph
            above it. A misalignment that small is one you feel before you see:
            nothing looks broken, the page just feels slightly loose. The first
            label's ink now starts on the exact vertical the hero photo starts on. */}
        <Container>
          <ul className="-mx-5 flex min-w-max items-center gap-1">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={cn(
                  "relative block px-5 py-4 font-accent text-[0.8125rem] uppercase tracking-[0.22em] transition-colors",
                  active === s.id
                    ? "text-text-1"
                    : "text-text-3 hover:text-text-1"
                )}
              >
                {s.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-5 right-5 bottom-0 h-px transition-colors",
                    active === s.id ? "bg-accent" : "bg-transparent"
                  )}
                />
              </a>
            </li>
          ))}
          </ul>
        </Container>
      </div>
    </nav>
  );
}
