"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, Share2, Smartphone, Check, X, Mail, MessageSquare } from "lucide-react";
import { labelCls, inputCls } from "@/lib/formStyles";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Save · Share · Text to phone — the three things a vehicle page is expected to
// offer besides Inquire and Call, and this one offered none of them.
//
// Save was worse than missing: components/vehicle/SaveButton.tsx has existed in
// this codebase the whole time and was wired into nothing. A finished component
// nobody rendered.
//
// All three open a dialog rather than acting silently or expanding a panel in
// place. Save on its own gave no feedback beyond a heart filling; Share fell
// through to a clipboard write nobody saw; Text to phone pushed the rail's
// content down. One shell, the same one Inquire uses — a page should not have
// two languages for "a small window opened".
//
// ⚠️ Text to phone is a MOCKUP, like every other form here. Sending an SMS needs
// a gateway (Twilio or the like) and a number the dealer owns; there is no way
// to fake that honestly, so the dialog collects the number, says it was sent,
// and posts nowhere. Recorded in HANDOFF.md §5 with the rest.

const KEY = "vip:saved";

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

type Panel = "save" | "share" | "text" | null;

function Action({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Heart;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className={cn(
        "group inline-flex items-center gap-2.5 font-accent text-[0.8125rem] uppercase tracking-[0.14em] transition-colors",
        active ? "text-accent" : "text-text-3 hover:text-text-1"
      )}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", active && "fill-current")}
        strokeWidth={1.75}
        aria-hidden
      />
      {label}
    </button>
  );
}

// The Inquire shell, minus the vehicle header — these three ask far less than an
// inquiry does, so the panel is narrower and the padding shorter. Same backdrop,
// same entrance, same close affordances.
function ActionDialog({
  eyebrow,
  title,
  onClose,
  children,
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm motion-safe:animate-[fadeIn_420ms_ease-out]"
      />
      <div className="relative max-h-full w-full max-w-md overflow-y-auto rounded-md border border-border bg-bg shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] motion-safe:animate-[panelIn_520ms_cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-center justify-between border-b border-border px-7 py-5">
          <p className="font-accent text-xs uppercase tracking-[0.22em] text-text-3">
            {eyebrow}
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-text-2 transition-colors hover:text-text-1"
          >
            <X size={20} strokeWidth={1.25} />
          </button>
        </div>
        <div className="px-7 py-7">{children}</div>
      </div>
    </div>
  );
}

// A share destination: the row of ways out of the dialog.
function ShareRow({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: typeof Mail;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const cls =
    "flex w-full items-center gap-4 rounded-md border border-border px-5 py-4 text-left font-accent text-[0.8125rem] uppercase tracking-[0.14em] text-text-2 transition-colors hover:border-accent/40 hover:text-text-1";
  const inner = (
    <>
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
      {label}
    </>
  );
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function VehicleActions({ slug, label }: { slug: string; label: string }) {
  const [saved, setSaved] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [copied, setCopied] = useState(false);
  const [textSent, setTextSent] = useState(false);
  const [url, setUrl] = useState("");

  const close = useCallback(() => setPanel(null), []);

  // Read after mount: neither localStorage nor location exists during the static
  // export, so both reconcile on the client.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(readSaved().includes(slug));
    setUrl(window.location.href);
    const sync = () => setSaved(readSaved().includes(slug));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [slug]);

  const write = (next: string[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode — degrade to this session only */
    }
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
  };

  // Save acts first and reports second: the click saves the car, the dialog
  // confirms it and offers the way back out. Asking permission to save
  // something is a dialog nobody wants.
  const openSave = () => {
    if (!saved) {
      write([...readSaved().filter((s) => s !== slug), slug]);
      setSaved(true);
    }
    setPanel("save");
  };

  const remove = () => {
    write(readSaved().filter((s) => s !== slug));
    setSaved(false);
    close();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard refused — the field is selectable, which is the fallback */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share?.({ title: label, url: url || window.location.href });
      close();
    } catch {
      /* dismissed — nothing to report */
    }
  };

  const subject = encodeURIComponent(label);
  const body = encodeURIComponent(`${label}\n\n${url}`);

  return (
    <div className="mt-7 border-t border-border pt-6">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Action
          icon={Heart}
          label={saved ? "Saved" : "Save"}
          active={saved}
          onClick={openSave}
        />
        <Action
          icon={Share2}
          label="Share"
          active={panel === "share"}
          onClick={() => {
            setCopied(false);
            setPanel("share");
          }}
        />
        <Action
          icon={Smartphone}
          label="Text to phone"
          active={panel === "text"}
          onClick={() => {
            setTextSent(false);
            setPanel("text");
          }}
        />
      </div>

      {panel === "save" && (
        <ActionDialog eyebrow="Saved" title="Saved" onClose={close}>
          <div className="mb-6 flex items-start gap-4">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-pill border border-accent/40 text-accent">
              <Heart className="h-4 w-4 fill-current" strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-[-0.01em] text-text-1">
                {label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-2">
                Kept on this device, so it is here when you come back. Mention it
                when you call and we will have the file ready.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="accent" className="flex-1" onClick={close}>
              Done
            </Button>
            <Button variant="outline" className="flex-1" onClick={remove}>
              Remove
            </Button>
          </div>
        </ActionDialog>
      )}

      {panel === "share" && (
        <ActionDialog eyebrow="Share" title="Share this vehicle" onClose={close}>
          <p className="mb-6 text-sm leading-relaxed text-text-2">
            Send {label} to whoever is deciding with you.
          </p>
          <span className={labelCls}>Link</span>
          <div className="mb-6 flex items-end gap-3">
            <input
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              className={cn(inputCls(), "flex-1 text-sm")}
              aria-label="Link to this vehicle"
            />
            <Button
              variant="outline"
              size="default"
              onClick={copy}
              className="shrink-0"
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="space-y-3">
            {typeof navigator !== "undefined" && "share" in navigator && (
              <ShareRow icon={Share2} label="More options" onClick={nativeShare} />
            )}
            <ShareRow
              icon={Mail}
              label="Email"
              href={`mailto:?subject=${subject}&body=${body}`}
            />
            <ShareRow icon={MessageSquare} label="Message" href={`sms:?&body=${body}`} />
          </div>
        </ActionDialog>
      )}

      {panel === "text" && (
        <ActionDialog eyebrow="Text to phone" title="Text this listing" onClose={close}>
          {textSent ? (
            <div className="space-y-5">
              <span className="grid h-10 w-10 place-items-center rounded-pill border border-accent/40 text-accent">
                <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-[-0.01em] text-text-1">
                  On its way.
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-2">
                  Check your phone in a moment — the link opens straight to this
                  car.
                </p>
              </div>
              <Button variant="outline" className="w-full" onClick={close}>
                Close
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Placeholder. Real sending needs an SMS gateway — see the note
                // at the top of this file.
                setTextSent(true);
              }}
            >
              <p className="mb-6 text-sm leading-relaxed text-text-2">
                We will send you a link to {label}. Standard message rates apply.
              </p>
              <label className="block">
                <span className={labelCls}>Your mobile number</span>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(305) 555-0134"
                  className={inputCls()}
                />
              </label>
              <Button type="submit" variant="accent" size="lg" className="mt-6 w-full">
                Send me this listing
              </Button>
            </form>
          )}
        </ActionDialog>
      )}
    </div>
  );
}
