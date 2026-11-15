"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { bookHref, nav } from "@/content/site";
import { ButtonLink } from "@/components/ui";
import { Logo } from "./Logo";

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href.startsWith("/#") ? false : path === href || path.startsWith(href + "/"));

  return (
    <header className="sticky top-0 z-40 rounded-t-[var(--radius-sheet)] bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="RealtyCare.io home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-mist p-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors ${
                    isActive(item.href) ? "bg-paper text-ink shadow-[0_1px_3px_rgb(15_30_46/0.12)]" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <ButtonLink href={bookHref} arrow>
              Book a call
            </ButtonLink>
          </span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line px-4 pb-5 pt-2 md:hidden">
          <ul className="grid">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-12 items-center border-b border-line text-[17px] font-medium" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div onClick={() => setOpen(false)}>
            <ButtonLink href={bookHref} className="mt-4 w-full" arrow>
              Book a call
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
