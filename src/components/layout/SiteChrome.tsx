"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Wraps pages in the marketing header and footer, except on /admin, which has its own plain layout. */
export function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const isAdmin = usePathname()?.startsWith("/admin");
  if (isAdmin) return <main id="main" className="min-h-screen bg-mist">{children}</main>;
  return (
    <>
      <div className="mx-2 mt-2 rounded-[var(--radius-sheet)] bg-paper sm:mx-3 sm:mt-3">
        {header}
        <main id="main">{children}</main>
      </div>
      {footer}
    </>
  );
}
