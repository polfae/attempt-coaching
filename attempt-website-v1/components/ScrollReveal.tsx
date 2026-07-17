"use client";

import { useEffect } from "react";

const revealSelector = [
  ".hero .kicker",
  ".hero h1",
  ".hero .lead",
  ".hero .actions",
  ".visualCard",
  ".trustStrip",
  ".sectionHeader",
  ".card",
  ".panel",
  ".processCard",
  ".trustPanel article",
].join(",");

export function ScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const elements = Array.from(document.querySelectorAll(revealSelector));

    elements.forEach((element, index) => {
      element.classList.add("reveal-ready");
      (element as HTMLElement).style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 6, 5) * 55}ms`,
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.16,
      },
    );

    elements.forEach((element) => observer.observe(element));

    let frame = 0;

    function revealPassedElements() {
      frame = 0;

      elements.forEach((element) => {
        if (element.classList.contains("is-visible")) {
          return;
        }

        const rect = element.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.92) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      });
    }

    function requestRevealCheck() {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(revealPassedElements);
    }

    window.addEventListener("scroll", requestRevealCheck, { passive: true });
    window.addEventListener("resize", requestRevealCheck);
    requestRevealCheck();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestRevealCheck);
      window.removeEventListener("resize", requestRevealCheck);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return null;
}
