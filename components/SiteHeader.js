"use client";

import { useEffect, useState } from "react";
import { assetUrl } from "@/lib/assets";

export default function SiteHeader() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let rafId = 0;

    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (Math.abs(delta) > 4) {
        setIsHidden(delta > 0 && currentY > 42);
        lastY = currentY;
      }

      rafId = 0;
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
    };
  }, []);

  return (
    <header className={`site-header${isHidden ? " is-hidden" : ""}`} aria-label="Primary navigation">
      <a className="brand" href="#top" aria-label="Meaningful Plushies home">
        <img src={assetUrl("/assets/logo.png")} alt="" />
        <span>Influencer Studio</span>
      </a>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="#objects">Objects</a>
        <a href="#proof">Proof</a>
        <a href="#contact">Start</a>
      </nav>
      <a className="nav-cta" href="#contact">Book intro</a>
    </header>
  );
}
