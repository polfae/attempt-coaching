"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { navLinks } from "@/lib/content";
import { defaultSiteSettings } from "@/lib/firestore";
import type { SiteSettings } from "@/lib/firestore";
import { Logo } from "./Logo";

export function PublicFooter({ settings }: { settings?: SiteSettings }) {
  const router = useRouter();
  const year = new Date().getFullYear();

  const safeSettings = {
    ...defaultSiteSettings,
    ...(settings || {}),
  };

  function goToAdmin() {
    router.push(auth?.currentUser ? "/admin" : "/admin/login");
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footerTop">
          <div>
            <Logo />

            <p style={{ maxWidth: 460 }}>
              {safeSettings.footerText ||
                "Premium weightlifting coaching supported by a professional meet-day competition tool."}
            </p>

            {(safeSettings.contactEmail || safeSettings.instagramUrl) && (
              <div className="footerLinks" style={{ marginTop: 18 }}>
                {safeSettings.contactEmail && (
                  <a href={`mailto:${safeSettings.contactEmail}`}>
                    {safeSettings.contactEmail}
                  </a>
                )}

                {safeSettings.instagramUrl && (
                  <a
                    href={safeSettings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="footerLinks">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}

            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <button className="copyright" onClick={goToAdmin}>
          © {year} {safeSettings.siteName || "Attempt"}
        </button>
      </div>
    </footer>
  );
}
