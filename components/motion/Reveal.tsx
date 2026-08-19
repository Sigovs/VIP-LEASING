"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
};

// The reveal. Content doesn't fade in — it surfaces: it rises a long way, from
// slightly oversized and out of focus, and settles into place on a long expo
// curve. The blur is what sells it; a plain fade-and-lift is the motion every
// template ships with.
//
// `y` is a weight hint, not a literal pixel travel — the motion layer owns the
// distance so the whole site moves as one system rather than per call site.
const TRAVEL_MIN = 90;
const TRAVEL_MAX = 160;
const BLUR = 14;

// Vanilla GSAP timeline — straight to port into the WP theme.
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Reduced motion: never animate, never hide.
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1, filter: "none" });
      return;
    }

    // Fail-open + no-flash guard. The element is rendered VISIBLE in SSR, so if
    // JS never loads (or the connection is too slow to reach this code) the cards
    // are always shown. When JS does boot, only hide elements that are still below
    // the reveal threshold — anything already in or above the viewport (including a
    // card a slow visitor already scrolled to) stays put and never blinks out.
    const START = 0.85; // matches ScrollTrigger "top 85%"
    if (el.getBoundingClientRect().top < window.innerHeight * START) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1, filter: "none" });
      return;
    }

    const travel = Math.min(Math.max(y * 3, TRAVEL_MIN), TRAVEL_MAX);

    gsap.set(el, {
      opacity: 0,
      y: travel,
      scale: 1.04,
      filter: `blur(${BLUR}px)`,
      willChange: "transform, opacity, filter",
    });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.6,
      delay,
      ease: "expo.out",
      // Drop the compositor hints once the element has landed — leaving
      // will-change on permanently keeps a layer alive for every revealed block.
      onComplete: () => gsap.set(el, { willChange: "auto", filter: "none" }),
      scrollTrigger: {
        trigger: el,
        start: `top ${START * 100}%`,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
