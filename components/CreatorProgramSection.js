"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { assetUrl } from "@/lib/assets";

const stages = [
  {
    id: "benefits",
    kicker: "VIP creator benefits",
    title: ["Grow with us", "on TikTok Shop"],
    body:
      "Creators get a free Meaningful Plushie, 11% affiliate commission on every sale, early access to new drops, and TikTok view bonuses up to RM500 per video.",
    stat: "Up to RM500 bonus",
    image: assetUrl("/assets/creator-program/image4.jpeg"),
  },
  {
    id: "requirements",
    kicker: "Creator requirements",
    title: ["Simple creator rules", "clear earning upside"],
    body:
      "We only require one TikTok Shop post about Meaningful Plushies. You can post more if you want, and more content means more earning potential.",
    stat: "Minimum 1 post",
    image: assetUrl("/assets/creator-program/image1.jpeg"),
  },
  {
    id: "content",
    kicker: "Content essentials",
    title: ["Show the plushie", "talking"],
    body:
      "Videos must clearly feature the plushie, include the TikTok Shop affiliate product link, remain public for at least 30 days, and be original creator content.",
    stat: "Core feature: voice",
    image: assetUrl("/assets/creator-program/image8.jpeg"),
  },
  {
    id: "nfc",
    kicker: "Optional sales boost",
    title: ["Show the", "Meaningful ID"],
    body:
      "The Meaningful ID is one of our unique features. Including the NFC experience can help customers understand the product faster and drive more sales.",
    stat: "NFC-powered profile",
    image: assetUrl("/assets/creator-program/image9.jpeg"),
  },
];

const benefits = [
  "Free Meaningful Plushie for you and your partner",
  "11% TikTok Shop affiliate commission",
  "Earn up to RM500 per video",
  "Early access to new drops",
];

const bonusTiers = [
  { tier: "Tier 1", views: "50K - 100K", payout: "RM50" },
  { tier: "Tier 2", views: "100K - 500K", payout: "RM150" },
  { tier: "Tier 3", views: "500K - 1M", payout: "RM300" },
  { tier: "Tier 4", views: "Above 1M", payout: "RM500" },
];

const contentIdeas = [
  {
    views: "110K",
    creator: "QYHAAAA",
    concept: "Gift exchange",
    image: assetUrl("/assets/creator-program/image10.jpeg"),
    video: assetUrl("/assets/creator-program/videos/qyhaaa.mp4"),
  },
  {
    views: "500K",
    creator: "6marsyaa",
    concept: "Unboxing",
    image: assetUrl("/assets/creator-program/image11.jpeg"),
    video: assetUrl("/assets/creator-program/videos/6marsyaa.mp4"),
  },
  {
    views: "72K",
    creator: "sxffiinzmm",
    concept: "Surprise gift",
    image: assetUrl("/assets/creator-program/image12.jpeg"),
    video: assetUrl("/assets/creator-program/videos/sffi.mp4"),
  },
  {
    views: "1.7M",
    creator: "kgv_jans",
    concept: "Lifestyle",
    image: assetUrl("/assets/creator-program/image13.jpeg"),
    video: assetUrl("/assets/creator-program/videos/kgv-jans.mp4"),
  },
];

const SLIDE_PROGRESS_END = 0.78;
const DETAILS_START = 0.88;
const CONTROLLED_SCROLL_MS = 1120;
const WHEEL_THRESHOLD = 18;

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function easeInOutQuint(value) {
  const t = clamp(value);

  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

export default function CreatorProgramSection() {
  const sectionRef = useRef(null);
  const autoScrollRef = useRef(false);
  const progressRef = useRef(0);
  const touchStartYRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  const [isDetailsActive, setIsDetailsActive] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let rafId = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      const stageProgress = Math.min(progress / SLIDE_PROGRESS_END, 0.999);
      const nextStage = Math.min(stages.length - 1, Math.round(stageProgress * (stages.length - 1)));

      progressRef.current = progress;
      setIsVisible(rect.bottom > 0);
      setActiveStage(nextStage);
      setIntroProgress(stageProgress);
      setIsIntroExiting(progress >= DETAILS_START);
      setIsDetailsActive(progress >= DETAILS_START);
      rafId = 0;
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    const syncTimers = [80, 240, 700].map((delay) => window.setTimeout(requestUpdate, delay));
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);
    window.addEventListener("pageshow", requestUpdate);

    return () => {
      window.cancelAnimationFrame(rafId);
      syncTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
      window.removeEventListener("pageshow", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let animationFrame = 0;

    const getSectionMetrics = () => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);

      return { top, travel };
    };

    const isInControlledRange = () => {
      const rect = section.getBoundingClientRect();

      return rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
    };

    const getStops = () => [
      ...stages.map((_, index) => SLIDE_PROGRESS_END * (index / Math.max(stages.length - 1, 1))),
      DETAILS_START,
    ];

    const animateToProgress = (targetProgress) => {
      const { top, travel } = getSectionMetrics();
      const startY = window.scrollY;
      const targetY = top + travel * clamp(targetProgress);
      const distance = targetY - startY;
      const startTime = performance.now();
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;

      autoScrollRef.current = true;
      root.style.scrollBehavior = "auto";

      const tick = (time) => {
        const elapsed = time - startTime;
        const progress = clamp(elapsed / CONTROLLED_SCROLL_MS);
        const eased = easeInOutQuint(progress);

        window.scrollTo(0, startY + distance * eased);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
          return;
        }

        window.scrollTo(0, targetY);
        root.style.scrollBehavior = previousScrollBehavior;
        window.setTimeout(() => {
          autoScrollRef.current = false;
        }, 80);
      };

      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(tick);
    };

    const moveByDirection = (direction) => {
      const stops = getStops();
      const current = progressRef.current;
      const currentIndex = stops.reduce((closestIndex, stop, index) => (
        Math.abs(stop - current) < Math.abs(stops[closestIndex] - current) ? index : closestIndex
      ), 0);
      const targetIndex = clamp(currentIndex + direction, 0, stops.length - 1);

      if (targetIndex === currentIndex) return false;
      animateToProgress(stops[targetIndex]);
      return true;
    };

    const onWheel = (event) => {
      if (!isInControlledRange()) return;

      if (autoScrollRef.current) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      const didMove = moveByDirection(event.deltaY > 0 ? 1 : -1);
      if (didMove) event.preventDefault();
    };

    const onTouchStart = (event) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event) => {
      if (!isInControlledRange()) return;

      if (autoScrollRef.current) {
        event.preventDefault();
        return;
      }

      const startY = touchStartYRef.current;
      const currentY = event.touches[0]?.clientY;
      if (startY === null || typeof currentY !== "number") return;

      const delta = startY - currentY;
      if (Math.abs(delta) < WHEEL_THRESHOLD) return;

      const didMove = moveByDirection(delta > 0 ? 1 : -1);
      if (didMove) {
        event.preventDefault();
        touchStartYRef.current = currentY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      autoScrollRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!activeVideo) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveVideo(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeVideo]);

  const selectStage = (index) => {
    const section = sectionRef.current;
    if (!section) return;

    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    window.scrollTo({
      top: top + travel * (SLIDE_PROGRESS_END * (index / Math.max(stages.length - 1, 1))),
      behavior: "smooth",
    });
  };

  const stageProgressPercent = `${Math.min(100, introProgress * 100)}%`;
  const stagePosition = introProgress * (stages.length - 1);
  const getStageStyle = (index) => {
    const opacity = clamp(1 - Math.abs(stagePosition - index));

    return {
      "--stage-opacity": opacity.toFixed(4),
      "--stage-z": opacity > 0.01 ? "2" : "1",
    };
  };

  return (
    <section
      id="creator-program"
      className={`creator-program-section${isVisible ? " is-visible" : ""}${isDetailsActive ? " is-details-active" : ""}`}
      ref={sectionRef}
    >
      <div className="creator-program-sticky">
        <div className={`creator-program-inner${isIntroExiting ? " is-exiting" : ""}`}>
          <div className="creator-program-heading">
            <p className="eyebrow">VIP creator programme</p>
            <h2>Ready to grow with us?</h2>
          </div>

          <div className="creator-program-grid">
            <div className="creator-stage-stack">
              {stages.map((item, index) => (
                <div
                  className="creator-stage-copy creator-stage-panel"
                  data-active={activeStage === index}
                  key={item.id}
                  style={getStageStyle(index)}
                >
                  <span>{item.kicker}</span>
                  <h3>
                    {item.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p>{item.body}</p>
                  <strong>{item.stat}</strong>
                </div>
              ))}
            </div>

            <div className="creator-visual-stack">
              {stages.map((item, index) => (
                <div
                  className="creator-visual-panel creator-visual-slide"
                  data-active={activeStage === index}
                  key={item.image}
                  style={getStageStyle(index)}
                >
                  <img alt="" src={item.image} />
                </div>
              ))}
            </div>

            <div className="creator-benefit-panel">
              <h3>Creator benefits</h3>
              <div className="creator-benefit-list">
                {benefits.map((benefit) => (
                  <span key={benefit}>{benefit}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="creator-progress-row" style={{ "--creator-stage-progress": stageProgressPercent }}>
            {stages.map((item, index) => (
              <button
                aria-label={`Show ${item.kicker}`}
                className={activeStage === index ? "is-active" : ""}
                key={item.id}
                onClick={() => selectStage(index)}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className={`creator-program-details${isDetailsActive ? " is-active" : ""}`}>
          <div className="creator-bottom-grid">
            <div className="creator-tier-panel">
              <h3>TikTok view bonus</h3>
              <p>Views are counted during the first 7 days after posting. One highest eligible tier can be claimed per video.</p>
              <div className="creator-tier-grid">
                {bonusTiers.map((tier) => (
                  <article key={tier.tier}>
                    <span>{tier.tier}</span>
                    <strong>{tier.views}</strong>
                    <small>{tier.payout}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="creator-ideas-panel">
              <div>
                <h3>Content ideas</h3>
                <p>Real creator examples from the pitch deck.</p>
              </div>
              <div className="creator-idea-list">
                {contentIdeas.map((idea) => (
                  <button
                    aria-label={`Play ${idea.concept} video by ${idea.creator}`}
                    className="creator-idea-card"
                    key={idea.video}
                    onClick={() => setActiveVideo(idea)}
                    type="button"
                  >
                    <img alt="" src={idea.image} />
                    <span className="creator-idea-play">Play video</span>
                    <span>{idea.views} views</span>
                    <strong>{idea.concept}</strong>
                    <small>{idea.creator}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="creator-program-cta">
            <span>Contact us on WhatsApp to join</span>
            <a href="https://wa.me/60122260106" rel="noreferrer" target="_blank">
              0122260106
            </a>
          </div>
        </div>
      </div>
      {activeVideo && isMounted ? createPortal(
        <div
          aria-label={`${activeVideo.concept} video by ${activeVideo.creator}`}
          aria-modal="true"
          className="creator-video-modal"
          role="dialog"
        >
          <button
            aria-label="Close video"
            className="creator-video-backdrop"
            onClick={() => setActiveVideo(null)}
            type="button"
          />
          <div className="creator-video-dialog">
            <div className="creator-video-header">
              <div>
                <span>{activeVideo.creator}</span>
                <strong>{activeVideo.concept}</strong>
              </div>
              <button aria-label="Close video" onClick={() => setActiveVideo(null)} type="button">
                Close
              </button>
            </div>
            <video autoPlay controls playsInline src={activeVideo.video} />
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  );
}
