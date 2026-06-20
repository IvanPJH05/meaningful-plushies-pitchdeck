"use client";

import { useEffect, useRef } from "react";
import { assetUrl } from "@/lib/assets";

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export default function HeroReveal() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let rafId = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      section.style.setProperty("--reveal-progress", progress.toFixed(4));
      rafId = 0;
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  function revealOnClick(event) {
    event.preventDefault();

    const section = sectionRef.current;
    if (!section) return;

    const targetTop = section.offsetTop + section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }

  return (
    <section ref={sectionRef} id="top" className="hero-reveal" aria-label="Meaningful Plushies home reveal">
      <div className="hero-reveal-sticky">
        <img className="reveal-bg reveal-bg-two" src={assetUrl("/assets/home-2.png")} alt="" />
        <img className="reveal-bg reveal-bg-one" src={assetUrl("/assets/home-1.png")} alt="" />
        <div className="reveal-soft-overlay" />

        <a className="reveal-logo-button" href="#objects" onClick={revealOnClick} aria-label="Reveal Meaningful Plushies">
          <img src={assetUrl("/assets/logo.png")} alt="Meaningful Plushies" />
        </a>
      </div>
    </section>
  );
}
