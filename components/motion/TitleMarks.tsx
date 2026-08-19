"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The bar under a heading draws itself in from zero as the heading arrives.
//
// It is a ::after, so there is no node to hand to GSAP. Instead the tween drives
// a custom property on the heading and the pseudo-element reads it as a scaleX
// (see .title-mark in globals.css) — scaleX rather than width, so nothing
// reflows while it grows.
//
// FAILS OPEN. --mark-grow defaults to 1 in CSS, so with no JS, slow JS or a JS
// error the bar is simply there at full width. This file can only ever take a
// bar that is already visible and animate it in.
const START = 0.85; // matches Reveal's threshold, so the two land together

export function TitleMarks() {
  const pathname = usePathname();

  useEffect(() => {
    const marks = Array.from(
      document.querySelectorAll<HTMLElement>(".title-mark")
    );
    if (!marks.length) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Reduced motion: the designed static path — every bar at full width.
    if (prefersReduced) {
      marks.forEach((el) => el.style.setProperty("--mark-grow", "1"));
      return;
    }

    const tweens = marks.map((el) => {
      // Anything already in or above the viewport keeps its bar — collapsing it
      // to zero just to grow it back is a blink, not an entrance.
      if (el.getBoundingClientRect().top < window.innerHeight * START) {
        el.style.setProperty("--mark-grow", "1");
        return null;
      }
      gsap.set(el, { "--mark-grow": 0 });
      return gsap.to(el, {
        "--mark-grow": 1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: `top ${START * 100}%`,
          toggleActions: "play none none none",
        },
      });
    });

    return () => {
      tweens.forEach((t) => {
        if (!t) return;
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [pathname]);

  return null;
}
