"use client";

import { useEffect } from "react";

/**
 * Adds `.is-visible` to every `.reveal` element as it scrolls into view.
 * One observer for the whole page — cheaper than a wrapper component per
 * element, and it works for content rendered on the server.
 */
export default function Reveal() {
  useEffect(() => {
    const showAll = () =>
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((n) => n.classList.add("is-visible"));

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      showAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    // Observe after paint so the nodes queried here are the hydrated ones.
    const raf = requestAnimationFrame(() => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((n) => io.observe(n));
    });

    // Safety net: content must never be permanently invisible if the
    // observer is starved or the tree is re-rendered out from under it.
    const fallback = window.setTimeout(showAll, 2500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  return null;
}
