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
      <div className="container">
        <div className="nav">
          <div className="headerBrand">
            <Logo />
            <span>Weightlifting coaching</span>
          </div>

          <nav className="navLinks" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const isActive = isCurrent(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="menuButton"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="menuButtonLabel">Menu</span>
            <span className="menuIcon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="container">
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
        </div>
      )}
    </header>
  );
}
