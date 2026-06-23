"use client";

import { useEffect, useState } from "react";
import { assetUrl } from "@/lib/assets";

export default function SiteHeader() {
  const [isHidden, setIsHidden] = useState(false);
  const whatsAppJoinUrl = "https://wa.me/60122260106";

  function scrollToFeatureStart(event) {
    event.preventDefault();

    const section = document.getElementById("objects");
    if (!section) return;

    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const targetTop = section.offsetTop + travel * 0.18;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  }

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
        <a href="#objects" onClick={scrollToFeatureStart}>Features</a>
        <a href="#reviews">Reviews</a>
        <a href="#about-us">About us</a>
        <a href="#creator-program">Vip Creator</a>
      </nav>
      <a className="nav-cta" href={whatsAppJoinUrl} rel="noreferrer" target="_blank">Join us</a>
    </header>
  );
}
