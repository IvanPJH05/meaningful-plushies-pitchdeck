"use client";

import { useEffect, useRef } from "react";
import { assetUrl } from "@/lib/assets";

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function power3Out(value) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 3);
}

function power2In(value) {
  const t = clamp(value);
  return t * t;
}

function power4Out(value) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 4);
}

function expoOut(value) {
  const t = clamp(value);
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function sineInOut(value) {
  const t = clamp(value);
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function backOut(value) {
  const t = clamp(value);
  const overshoot = 1.12;
  return 1 + (overshoot + 1) * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
}

function logoClickProgress(value) {
  const t = clamp(value);
  return sineInOut(t);
}

function rampOpacity(progress, start, holdStart, holdEnd, end) {
  if (progress <= start || progress >= end) return 0;
  if (progress >= holdStart && progress <= holdEnd) return 1;
  if (progress < holdStart) return power3Out((progress - start) / (holdStart - start));
  return 1 - power2In((progress - holdEnd) / (end - holdEnd));
}

function textMotion(progress, start, holdStart, holdEnd, end) {
  const opacity = rampOpacity(progress, start, holdStart, holdEnd, end);
  const enter = expoOut((progress - start) / (holdStart - start));
  const exit = power2In((progress - holdEnd) / (end - holdEnd));
  const y = 24 - enter * 24 - exit * 34;

  return {
    opacity,
    y,
  };
}

function imageMotion(progress, start, holdStart, holdEnd, end, keepCentered = false) {
  const opacity = rampOpacity(progress, start, holdStart, holdEnd, end);
  const exit = power2In((progress - holdEnd) / (end - holdEnd));
  const enter = power4Out((progress - start) / (holdStart - start));

  return {
    opacity,
    y: keepCentered ? 0 : (1 - enter) * 7 - exit * 62,
  };
}

const sequenceStart = 0.36;
const objectEntryStart = 0.218;
const objectEntryEnd = sequenceStart;
const whiteFadeStart = 0.16;
const whiteFadeDuration = 0.36;
const characterSegment = 0.16;
const imageFadeIn = 0.035;
const textFadeIn = 0.035;
const textHold = 0.035;
const textFadeOut = 0.055;
const logoClickTargetProgress = sequenceStart + imageFadeIn + textFadeIn;

const characterBeats = [
  {
    id: "billy",
    name: "Billy",
    lines: ["Customised voice", "talking plushie"],
    image: "/assets/meaningful-object-1.png",
  },
  {
    id: "tootsie",
    name: "Tootsie",
    lines: ["Over 1000+", "meaningful moments", "created"],
    image: "/assets/tootsie.png",
  },
  {
    id: "dragon",
    name: "Dragon Warrior",
    lines: ["Hand made", "with love"],
    image: "/assets/dragon-warrior.png",
  },
  {
    id: "hunnie",
    name: "Hunnie",
    lines: ["The new standard", "for plushies"],
    image: "/assets/hunnie.png",
  },
];

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
      const characterEntry = power4Out((progress - objectEntryStart) / (objectEntryEnd - objectEntryStart));
      const characterSettle = Math.min(backOut((progress - objectEntryStart) / (objectEntryEnd - objectEntryStart)), 1.14);
      const homeOneFade = power2In(clamp(progress / 0.24));
      const homeTwoEnter = power3Out(clamp(progress / 0.16));
      const homeTwoExit = power2In(clamp((progress - whiteFadeStart) / whiteFadeDuration));
      const whiteFade = power3Out((progress - whiteFadeStart) / whiteFadeDuration);
      const isMobile = window.matchMedia("(max-width: 920px)").matches;

      section.style.setProperty("--reveal-progress", progress.toFixed(4));
      section.style.setProperty("--home-one-opacity", (1 - homeOneFade).toFixed(4));
      section.style.setProperty("--home-two-opacity", Math.min(homeTwoEnter, 1 - homeTwoExit).toFixed(4));
      section.style.setProperty("--stage-white-opacity", whiteFade.toFixed(4));
      section.style.setProperty("--character-y", `${((1 - characterEntry) * 30).toFixed(2)}vh`);
      section.style.setProperty("--character-scale", Math.min(1.015, 0.96 + characterSettle * 0.05).toFixed(4));

      let activeObjectOpacity = progress < sequenceStart + imageFadeIn ? characterEntry : 0;

      characterBeats.forEach((character, index) => {
        const start = sequenceStart + index * characterSegment;
        const textStart = start + imageFadeIn;
        const textHoldStart = textStart + textFadeIn;
        const textHoldEnd = textHoldStart + textHold;
        const end = textHoldEnd + textFadeOut;
        const image = imageMotion(
          progress,
          start,
          start + imageFadeIn,
          textHoldEnd,
          end,
          isMobile || index === characterBeats.length - 1
        );
        const entranceOpacity = character.id === "billy" && progress < start + imageFadeIn ? characterEntry : 0;
        const opacity = Math.max(entranceOpacity, image.opacity);
        const copy = textMotion(progress, textStart, textHoldStart, textHoldEnd, end);

        activeObjectOpacity = Math.max(activeObjectOpacity, opacity);
        section.style.setProperty(`--${character.id}-opacity`, opacity.toFixed(4));
        section.style.setProperty(`--${character.id}-y`, `${image.y.toFixed(2)}vh`);
        section.style.setProperty(`--${character.id}-text-opacity`, copy.opacity.toFixed(4));
        section.style.setProperty(`--${character.id}-text-y`, `${copy.y.toFixed(2)}px`);
      });

      section.style.setProperty("--next-object-opacity", activeObjectOpacity.toFixed(4));
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

    const startTop = window.scrollY;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const targetTop = section.offsetTop + travel * logoClickTargetProgress;
    const distance = targetTop - startTop;
    const duration = Math.max(2600, Math.min(4200, Math.abs(distance) * 1.05));
    const startTime = performance.now();
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";

    const animate = (time) => {
      const progress = clamp((time - startTime) / duration);
      const eased = logoClickProgress(progress);

      window.scrollTo(0, startTop + distance * eased);

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        window.scrollTo(0, targetTop);
        root.style.scrollBehavior = previousScrollBehavior;
      }
    };

    window.requestAnimationFrame(animate);
  }

  return (
    <section ref={sectionRef} id="top" className="hero-reveal" aria-label="Meaningful Plushies home reveal">
      <div className="hero-reveal-sticky">
        <picture>
          <source media="(max-width: 920px)" srcSet={assetUrl("/assets/home-2-mobile.png")} />
          <img className="reveal-bg reveal-bg-two" src={assetUrl("/assets/home-2.png")} alt="" />
        </picture>
        <picture>
          <source media="(max-width: 920px)" srcSet={assetUrl("/assets/home-1-mobile.png")} />
          <img className="reveal-bg reveal-bg-one" src={assetUrl("/assets/home-1.png")} alt="" />
        </picture>
        <div className="reveal-next-object">
          {characterBeats.map((character) => (
            <img
              className={`reveal-character reveal-character-${character.id}`}
              src={assetUrl(character.image)}
              alt=""
              key={character.id}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="reveal-character-copy" aria-live="polite">
          {characterBeats.map((character) => (
            <div className={`character-copy character-copy-${character.id}`} key={character.id}>
              <h2>{character.name}</h2>
              <p>
                {character.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <div className="reveal-soft-overlay" />

        <a className="reveal-logo-button" href="#objects" onClick={revealOnClick} aria-label="Reveal Meaningful Plushies">
          <img src={assetUrl("/assets/logo.png")} alt="Meaningful Plushies" />
          <span className="sr-only">Reveal Meaningful Plushies</span>
        </a>
      </div>
    </section>
  );
}
