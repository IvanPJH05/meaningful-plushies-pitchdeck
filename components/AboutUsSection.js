"use client";

import { useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/assets";

const aboutSlides = [
  {
    id: "momentum",
    eyebrow: "About us",
    title: ["A young plushie brand", "with real momentum"],
    body:
      "Meaningful Plushies started development in September 2025 and launched on January 10. In early February, one TikTok post went viral and the second restock sold out in 2 days.",
    stat: "Sold out in 2 days",
    image: assetUrl("/assets/creator-program/image3.jpeg"),
    alt: "Meaningful Plushies production momentum",
  },
  {
    id: "next",
    eyebrow: "What's next",
    title: ["Expanding to", "TikTok Shop"],
    body:
      "Now, we are growing the brand with creators who can turn meaningful gifting moments into content people want to share.",
    stat: "Grow with creators",
    image: assetUrl("/assets/creator-program/image14.jpeg"),
    alt: "Meaningful Plushies next growth chapter",
  },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export default function AboutUsSection() {
  const sectionRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let rafId = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      const switchProgress = clamp((progress - 0.18) / 0.46);

      section.style.setProperty("--about-first-opacity", (1 - switchProgress).toFixed(4));
      section.style.setProperty("--about-first-y", `${(-28 * switchProgress).toFixed(2)}px`);
      section.style.setProperty("--about-first-scale", (1 - 0.012 * switchProgress).toFixed(4));
      section.style.setProperty("--about-second-opacity", switchProgress.toFixed(4));
      section.style.setProperty("--about-second-y", `${(34 * (1 - switchProgress)).toFixed(2)}px`);
      section.style.setProperty("--about-second-scale", (0.988 + 0.012 * switchProgress).toFixed(4));

      setIsVisible(rect.top < window.innerHeight * 0.82 && rect.bottom > 0);
      setActiveSlide(switchProgress > 0.5 ? 1 : 0);
      rafId = 0;
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      id="about-us"
      className={`about-us-section${isVisible ? " is-visible" : ""}`}
      ref={sectionRef}
      aria-labelledby="about-us-title"
    >
      <div className="about-us-sticky">
        <div className="about-us-inner">
          {aboutSlides.map((slide, index) => (
            <article className={`about-us-slide ${activeSlide === index ? "is-active" : ""}`} key={slide.id}>
              <div className="about-us-copy">
                <p className="eyebrow">{slide.eyebrow}</p>
                <h2 id={index === 0 ? "about-us-title" : undefined}>
                  {slide.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <p>{slide.body}</p>
                <strong>{slide.stat}</strong>
              </div>

              <div className="about-us-visual">
                <img alt={slide.alt} src={slide.image} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
