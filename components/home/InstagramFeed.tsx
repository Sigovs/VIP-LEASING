import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { asset } from "@/lib/asset";

// TODO: replace placeholder tiles with a live feed. Options:
//   (a) Instagram Basic Display API + a cached server fetch
//   (b) third-party embed (behold.so, lightwidget, juicer)
// Until then, the section reads as a "Follow us" prompt with sample
// imagery pulled from the showcase folder.

const PLACEHOLDER_TILES: { src: string; alt: string }[] = [
  { src: "/showcase/porsche-carrera-gt/06.webp", alt: "Recent post" },
  { src: "/showcase/mclaren-senna/04.webp", alt: "Recent post" },
  { src: "/showcase/ferrari-f50/05.webp", alt: "Recent post" },
  { src: "/showcase/f50-laferrari/05.webp", alt: "Recent post" },
];

export function InstagramFeed() {
  return (
    <Container>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h2 className="font-title text-3xl md:text-4xl font-bold text-text-1 leading-[1.05]">
          <span className="text-accent">@</span>
          {INSTAGRAM_HANDLE}
        </h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 px-7 md:px-9 py-3.5 md:py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-text-1 border border-text-1/80 hover:bg-text-1 hover:text-bg transition-all duration-300 self-start md:self-auto"
        >
          <InstagramIcon className="h-4 w-4" strokeWidth={1.75} />
          Follow
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.75}
          />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {PLACEHOLDER_TILES.map((t, i) => (
          <Reveal key={i} delay={(i % 4) * 0.04}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[16/10] overflow-hidden bg-paper"
              aria-label={`Instagram — ${t.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(t.src)}
                alt={t.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
                <InstagramIcon
                  className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  strokeWidth={1.5}
                />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
