"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { defaultSiteSettings } from "@/lib/firestore";
import type { SiteSettings } from "@/lib/firestore";
import { Logo } from "./Logo";

const footerExploreLinks = [
  { href: "/coaching", label: "Coaching" },
  { href: "/programs", label: "Programs" },
  { href: "/app", label: "Attempt App" },
  { href: "/about", label: "About" },
];

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
          <div className="footerBrand">
            <Logo />

            <p>
              {safeSettings.footerText ||
                "Premium weightlifting coaching supported by a professional meet-day competition tool."}
            </p>

            <div className="footerSignals">
              <span>Weightlifting only</span>
              <span>Coach-led</span>
              <span>Meet-day ready</span>
            </div>
          </div>

          <div className="footerColumns">
            <div>
              <h3>Explore</h3>
              <div className="footerLinks">
                {footerExploreLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3>Start</h3>
              <div className="footerLinks">
                <Link href="/apply">Apply</Link>
                <Link href="/contact">Contact</Link>
                {safeSettings.contactEmail && (
                  <a href={`mailto:${safeSettings.contactEmail}`}>Email</a>
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
            </div>
          </div>
        </div>

        <div className="footerBottom">
          <button className="copyright" onClick={goToAdmin}>
            © {year} {safeSettings.siteName || "Attempt"}
          </button>
        </div>
      </div>
    </footer>
  );
}
