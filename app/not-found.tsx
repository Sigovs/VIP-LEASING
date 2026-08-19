import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

export default function NotFound() {
  return (
    <Container className="min-h-[60vh] flex flex-col justify-center py-32">
      <Eyebrow>404</Eyebrow>
      <DisplayHeading as="h1" size="lg" className="mt-4 max-w-[18ch]">
        The page you&apos;re looking for has moved on.
      </DisplayHeading>
      <Link
        href="/"
        className="mt-10 font-accent text-xs uppercase tracking-[0.22em] text-text-1 hover:text-text-2 inline-flex items-center gap-2"
      >
        Return home →
      </Link>
    </Container>
  );
}
