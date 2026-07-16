"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  createAnalyticsEvent,
  markAnalyticsEventEngaged,
} from "@/lib/firestore";

const visitorKey = "attempt_visitor_id";
const sessionKey = "attempt_session_id";
const sessionSeenKey = "attempt_session_seen_at";
const sessionWindow = 30 * 60 * 1000;

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getStoredId(key: string, prefix: string) {
  const existing = window.localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const next = makeId(prefix);
  window.localStorage.setItem(key, next);
  return next;
}

function getSessionId() {
  const now = Date.now();
  const existing = window.localStorage.getItem(sessionKey);
  const lastSeen = Number(window.localStorage.getItem(sessionSeenKey) || 0);

  if (existing && now - lastSeen < sessionWindow) {
    window.localStorage.setItem(sessionSeenKey, String(now));
    return existing;
  }

  const next = makeId("session");
  window.localStorage.setItem(sessionKey, next);
  window.localStorage.setItem(sessionSeenKey, String(now));
  return next;
}

function getDeviceType(): "desktop" | "tablet" | "mobile" {
  const width = window.innerWidth;

  if (width < 720) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getVisitorLocale() {
  return navigator.languages?.[0] || navigator.language || "unknown";
}

function getVisitorCountry(locale: string) {
  const region = locale.split("-")[1];

  if (!region || region.length !== 2) {
    return "Unknown";
  }

  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(region) || region;
  } catch {
    return region.toUpperCase();
  }
}

function getSource(searchParams: URLSearchParams) {
  const utmSource = searchParams.get("utm_source");

  if (utmSource) {
    return utmSource;
  }

  if (!document.referrer) {
    return "direct";
  }

  try {
    return new URL(document.referrer).hostname.replace(/^www\./, "");
  } catch {
    return "referral";
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    let cancelled = false;
    let markedEngaged = false;
    let eventId = "";
    const params = new URLSearchParams(window.location.search);
    const locale = getVisitorLocale();

    async function trackPageView() {
      const response = await createAnalyticsEvent({
        type: "page_view",
        path: pathname,
        title: document.title,
        referrer: document.referrer,
        source: getSource(params),
        device: getDeviceType(),
        country: getVisitorCountry(locale),
        timezone:
          Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
        locale,
        visitorId: getStoredId(visitorKey, "visitor"),
        sessionId: getSessionId(),
        engaged: false,
      });

      if (!cancelled && response && "id" in response) {
        eventId = response.id;
      }
    }

    function markEngaged() {
      if (markedEngaged || !eventId) {
        return;
      }

      markedEngaged = true;
      markAnalyticsEventEngaged(eventId).catch(() => undefined);
    }

    const timer = window.setTimeout(markEngaged, 15000);
    window.addEventListener("scroll", markEngaged, { passive: true });
    window.addEventListener("click", markEngaged);

    trackPageView().catch(() => undefined);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", markEngaged);
      window.removeEventListener("click", markEngaged);
    };
  }, [pathname]);

  return null;
}
