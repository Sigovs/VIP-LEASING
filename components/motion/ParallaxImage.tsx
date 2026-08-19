"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Y-axis parallax on the inner element, plus a focus pull: the photograph arrives
// soft and sharpens as the section takes the frame. Two separate triggers on
// purpose — the travel is scrubbed to the scrollbar (it must track the finger
// exactly), while the focus pull runs on its own clock once, so it reads as a
// lens settling rather than a slider the user is dragging.
//
// `amount` is the TOTAL travel in pixels, not a percentage. It used to be a
// percentage of the inner element, which is why the effect was invisible: the
// inner overhung the frame by only 8%, so the travel had nowhere to go — the
// photograph moved 74px across an entire screen of scrolling, which is to say it
// didn't. The inner now overhangs 20% a side, which is the room the movement
// needs; anything more than that and the frame's edges show through.
const OVERHANG = 0.2; // fraction of the frame the image hangs past each edge

export function ParallaxImage({
  children,
  amount = 140,
  className,
}: {
  children: React.ReactNode;
  amount?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;
    const w = wrap.current;
    const i = inner.current;
    if (!w || !i) return;

    // Never travel further than the overhang, or the bare frame shows at the edge.
    const ceiling = w.offsetHeight * OVERHANG * 2;
    const travel = Math.min(amount, ceiling);

    const move = gsap.fromTo(
      i,
      { y: -travel / 2 },
      {
        y: travel / 2,
        ease: "none",
        scrollTrigger: {
          trigger: w,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    // Focus pull. Fail-open: if the section is already on screen at mount, the
    // image is simply left sharp rather than blurred and waiting for a trigger.
    const alreadyInView =
      w.getBoundingClientRect().top < window.innerHeight * 0.9;

    const focus = alreadyInView
      ? null
      : gsap.fromTo(
          i,
          { filter: "blur(18px)" },
          {
            filter: "blur(0px)",
            duration: 1.3,
            ease: "expo.out",
            onComplete: () => gsap.set(i, { filter: "none" }),
            scrollTrigger: {
              trigger: w,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );

    return () => {
      move.scrollTrigger?.kill();
      move.kill();
      focus?.scrollTrigger?.kill();
      focus?.kill();
    };
  }, [amount]);

  return (
    <div ref={wrap} className={`relative overflow-hidden ${className ?? ""}`}>
      <div
        ref={inner}
        className="absolute inset-0 -top-[20%] -bottom-[20%] will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
