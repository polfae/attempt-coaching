"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/content";
import { Logo } from "./Logo";

export function PublicHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isCurrent(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="container nav">
        <Logo />

        <nav className="navLinks" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isActive = isCurrent(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                style={isActive ? { opacity: 1, color: "white" } : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link className="btn btnPrimary headerCta" href="/apply">
          Apply
        </Link>

        <button
          className="menuButton"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          Menu
        </button>
      </div>

      {menuOpen && (
        <nav className="mobileNavPanel" aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const isActive = isCurrent(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            );
          })}

          <Link href="/apply" onClick={closeMenu}>
            Apply for Coaching
          </Link>
        </nav>
      )}
    </header>
  );
}
