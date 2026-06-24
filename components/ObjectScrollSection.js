"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetUrl } from "@/lib/assets";
import ScrollImageSequence from "@/components/ScrollImageSequence";

gsap.registerPlugin(ScrollTrigger);

const objects = [
  {
    id: "speaker-animation",
    type: "sequence",
    frameBase: "/sequence/speaker",
    frameCount: 18,
    alt: "Speaker animation",
    duration: 0.6,
    feature: {
      eyebrow: "Voice capacity",
      options: ["5 seconds", "10 seconds", "20 seconds"],
      headline: ["Ultra clear", "sound"],
    },
  },
  {
    id: "nfc-card-animation",
    type: "sequence",
    frameBase: "/sequence/nfc-card",
    frameCount: 80,
    alt: "NFC card animation",
    duration: 1.45,
    info: {
      leftBlocks: [
        {
          title: ["Meaningful ID"],
          body: "Powered by NFC technology",
        },
        {
          title: ["The future", "of plushies"],
          body: "Tap to access your plushie's digital birth certificate",
        },
      ],
      certificateTitle: ["Fully customisable", "birth certificate"],
      certificateItems: [
        { label: "Plushie's Name", detail: "Name your plushie" },
        { label: "Plushie's Gender", detail: "Your plushie's gender" },
        { label: "Plushie's Birth Date", detail: "A meaningful date to you" },
        { label: "Plushie's Birth Place", detail: "A meaningful place to you" },
        { label: "Plushie's Favourite Person", detail: "Who the plushie loves the most" },
        { label: "Plushie Belongs to", detail: "Who the plushie is for" },
        { label: "Meaningful Note", detail: "A note for the plushie's owner" },
      ],
    },
  },
];

const SEQUENCE_ENTER_WEIGHT = 0.9;
const SEQUENCE_EXIT_WEIGHT = 0.9;
const FINAL_SEQUENCE_EXIT_WEIGHT = 0.72;
const SEQUENCE_SECONDS_TO_SCROLL_WEIGHT = 2.05;
const OBJECT_OVERLAP_WEIGHT = 0.46;
const SEQUENCE_VISUAL_OVERLAP = 0.04;

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function power2In(value) {
  const t = clamp(value);
  return t * t;
}

function power3Out(value) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 3);
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
  const overshoot = 1.18;
  return 1 + (overshoot + 1) * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
}

function setSpeakerFeatureProgress(node, progress, opacity) {
  if (!node) return;

  const selectedIndex = Math.round(clamp(progress) * 2);
  const copyIn = expoOut(clamp((progress - 0.12) / 0.22));
  const copyOpacity = opacity * copyIn;
  const copyY = (1 - copyIn) * 34;
  const floatProgress = sineInOut(progress);

  node.style.setProperty("--feature-progress", progress.toFixed(4));
  node.style.setProperty("--feature-opacity", opacity.toFixed(4));
  node.style.setProperty("--speaker-copy-opacity", copyOpacity.toFixed(4));
  node.style.setProperty("--speaker-copy-y", `${copyY.toFixed(2)}px`);
  node.dataset.capacity = String(selectedIndex);

  [0, 1, 2].forEach((index) => {
    const center = index / 2;
    const distance = Math.abs(progress - center);
    const active = power3Out(Math.max(0, 1 - distance * 2.8));
    const push = index === selectedIndex ? 0 : index < selectedIndex ? -14 : 14;
    const y = (index - 1) * 62 - floatProgress * 26 + push * power3Out(Math.max(0, 1 - distance * 2.2));
    const scale = 0.9 + active * 0.25;
    const itemOpacity = 0.42 + active * 0.58;

    node.style.setProperty(`--capacity-y-${index}`, `${y.toFixed(2)}px`);
    node.style.setProperty(`--capacity-scale-${index}`, scale.toFixed(4));
    node.style.setProperty(`--capacity-opacity-${index}`, itemOpacity.toFixed(4));
  });
}

function setNfcInfoProgress(node, progress, opacity) {
  if (!node) return;

  const enter = power4Out(clamp((progress - 0.06) / 0.26));
  const exit = power2In(clamp((progress - 0.88) / 0.12));
  const firstHeading = expoOut(clamp((progress - 0.06) / 0.18));
  const firstBody = power3Out(clamp((progress - 0.16) / 0.18));
  const secondHeading = expoOut(clamp((progress - 0.32) / 0.18));
  const secondBody = power3Out(clamp((progress - 0.46) / 0.18));
  const certificateEnter = expoOut(clamp((progress - 0.16) / 0.22));
  const baseOpacity = opacity;
  const visibleOpacity = baseOpacity * enter;

  node.style.setProperty("--nfc-info-opacity", visibleOpacity.toFixed(4));
  node.style.setProperty("--nfc-info-y", `${((1 - enter) * 34 - exit * 24).toFixed(2)}px`);
  node.style.setProperty("--nfc-block-0-title-opacity", (baseOpacity * firstHeading).toFixed(4));
  node.style.setProperty("--nfc-block-0-title-y", `${((1 - firstHeading) * 28 - exit * 18).toFixed(2)}px`);
  node.style.setProperty("--nfc-block-0-body-opacity", (baseOpacity * firstBody).toFixed(4));
  node.style.setProperty("--nfc-block-0-body-y", `${((1 - firstBody) * 18 - exit * 16).toFixed(2)}px`);
  node.style.setProperty("--nfc-block-1-title-opacity", (baseOpacity * secondHeading).toFixed(4));
  node.style.setProperty("--nfc-block-1-title-y", `${((1 - secondHeading) * 28 - exit * 18).toFixed(2)}px`);
  node.style.setProperty("--nfc-block-1-body-opacity", (baseOpacity * secondBody).toFixed(4));
  node.style.setProperty("--nfc-block-1-body-y", `${((1 - secondBody) * 18 - exit * 16).toFixed(2)}px`);
  node.style.setProperty("--nfc-certificate-opacity", (baseOpacity * certificateEnter).toFixed(4));
  node.style.setProperty("--nfc-certificate-y", `${((1 - certificateEnter) * 22 - exit * 18).toFixed(2)}px`);

  Array.from({ length: 7 }).forEach((_, index) => {
    const itemIn = power3Out(clamp((progress - (0.24 + index * 0.05)) / 0.18));
    node.style.setProperty(`--nfc-click-opacity-${index}`, (baseOpacity * itemIn).toFixed(4));
    node.style.setProperty(`--nfc-click-y-${index}`, `${((1 - itemIn) * 18 - exit * 10).toFixed(2)}px`);
  });
}

export default function ObjectScrollSection() {
  const sectionRef = useRef(null);
  const objectRefs = useRef([]);
  const sequenceRefs = useRef([]);
  const [activeCertificateItem, setActiveCertificateItem] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let rafId = 0;
    let latestProgress = 0;

    const getSequenceExitWeight = (index) => (index === objects.length - 1 ? FINAL_SEQUENCE_EXIT_WEIGHT : SEQUENCE_EXIT_WEIGHT);

    const getObjectWeight = (object, index) => {
      if (object.type === "image") return object.scrollWeight || 1;

      return SEQUENCE_ENTER_WEIGHT + object.duration * SEQUENCE_SECONDS_TO_SCROLL_WEIGHT + getSequenceExitWeight(index);
    };

    const getTimeline = () => {
      const weights = objects.map((object, index) => getObjectWeight(object, index));
      const total =
        weights.reduce((sum, weight) => sum + weight, 0) - OBJECT_OVERLAP_WEIGHT * Math.max(objects.length - 1, 0);
      let cursor = 0;

      return weights.map((weight, index) => {
        const start = Math.max(0, cursor) / total;
        cursor += weight;
        if (index < weights.length - 1) cursor -= OBJECT_OVERLAP_WEIGHT;

        return {
          start,
          end: Math.min(1, (start * total + weight) / total),
          weight,
        };
      });
    };

    const update = (progress) => {
      const isMobile = window.matchMedia("(max-width: 920px)").matches;
      const totalWeight =
        objects.reduce((sum, object, index) => sum + getObjectWeight(object, index), 0) -
        OBJECT_OVERLAP_WEIGHT * Math.max(objects.length - 1, 0);
      section.style.setProperty("--object-section-height", `${Math.max(520, Math.round(totalWeight * 118))}vh`);

      const timeline = getTimeline();

      objects.forEach((object, index) => {
        const node = objectRefs.current[index];
        if (!node) return;

        const segment = timeline[index];
        const local = clamp((progress - segment.start) / Math.max(segment.end - segment.start, 0.001));
        const active = local > 0 && local < 1;
        let y = 0;
        let opacity = 0;
        let scale = 1;

        if (object.type === "image") {
          const exit = clamp((local - 0.76) / 0.24);
          const enterEase = power4Out(clamp(local / 0.34));
          const exitEase = power2In(exit);

          y = isMobile ? 0 : 36 - enterEase * 74 - exitEase * 52;
          opacity = local < 1 ? Math.min(1, power3Out(local / 0.22), 1 - exitEase) : 0;
          scale = Math.min(1.012, 0.975 + backOut(clamp(local / 0.36)) * 0.032) * (1 - exitEase * 0.018);
        } else {
          const enterPortion = SEQUENCE_ENTER_WEIGHT / Math.max(segment.weight, 0.001);
          const exitPortion = getSequenceExitWeight(index) / Math.max(segment.weight, 0.001);
          const scrubStart = enterPortion;
          const scrubEnd = 1 - exitPortion;
          const enter = clamp(local / scrubStart);
          const scrub = clamp((local - scrubStart) / Math.max(scrubEnd - scrubStart, 0.001));
          const exit = clamp((local - scrubEnd) / exitPortion);

          const enterEase = power4Out(enter);
          const exitEase = power2In(exit);
          const settle = Math.min(backOut(enter), 1.18);
          const exitOpacity = 1 - exitEase;
          const visualEntry = power4Out(clamp((local - SEQUENCE_VISUAL_OVERLAP) / 0.36));
          const visualEntryGate = power3Out(clamp((local - SEQUENCE_VISUAL_OVERLAP) / 0.24));
          const visualExitGate = 1 - power2In(clamp((local - (1 - SEQUENCE_VISUAL_OVERLAP - 0.16)) / 0.16));

          y = isMobile ? 0 : (1 - visualEntry) * 42 - (index === objects.length - 1 ? 0 : exitEase * 28);
          opacity = active
            ? Math.min(1, power3Out(enter) * 1.12, exitOpacity * 1.18, visualEntryGate, visualExitGate)
            : 0;
          scale = Math.min(1.012, 0.955 + settle * 0.048) * (1 - exitEase * 0.025);

          sequenceRefs.current[index]?.setProgress(scrub);

          if (object.feature) {
            setSpeakerFeatureProgress(node, scrub, opacity);
          }

          if (object.info) {
            const mobileScroll = isMobile ? -power3Out(clamp((scrub - 0.62) / 0.28)) * 300 : 0;
            node.style.setProperty("--nfc-mobile-scroll", `${mobileScroll.toFixed(2)}px`);
            setNfcInfoProgress(node, scrub, opacity);
          }
        }

        node.style.setProperty("--object-y", `${y.toFixed(2)}vh`);
        node.style.setProperty("--object-opacity", opacity.toFixed(4));
        node.style.setProperty("--object-scale", scale.toFixed(4));
        node.dataset.active = opacity > 0.45 ? "true" : "false";
      });

      rafId = 0;
    };

    const readLayoutProgress = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      return clamp(-rect.top / travel);
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => update(latestProgress));
    };

    const requestLayoutUpdate = () => {
      latestProgress = readLayoutProgress();
      requestUpdate();
    };

    section.style.setProperty(
      "--object-section-height",
      `${Math.max(
        520,
        Math.round(
          (objects.reduce((sum, object, index) => sum + getObjectWeight(object, index), 0) -
            OBJECT_OVERLAP_WEIGHT * Math.max(objects.length - 1, 0)) *
            118
        )
      )}vh`
    );

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        latestProgress = self.progress;
        requestUpdate();
      },
    });

    requestLayoutUpdate();
    window.addEventListener("scroll", requestLayoutUpdate, { passive: true });
    window.addEventListener("resize", requestLayoutUpdate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestLayoutUpdate);
      window.removeEventListener("resize", requestLayoutUpdate);
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="objects"
      className="object-scroll-section"
      style={{ "--object-section-height": "700vh" }}
      aria-label="Meaningful Plushies object showcase"
    >
      <div className="object-scroll-sticky">
        <div className="object-scroll-background" />
        <div className="object-stage">
          {objects.map((object, index) => (
            <figure
              className="scroll-object"
              key={object.id}
              ref={(node) => {
                objectRefs.current[index] = node;
              }}
            >
              {object.feature ? (
                <div className="speaker-feature" aria-hidden="true">
                  <div className="speaker-capacity">
                    <span>{object.feature.eyebrow}</span>
                    <div className="capacity-selector">
                      {object.feature.options.map((option, optionIndex) => (
                        <span className={`capacity-option capacity-option-${optionIndex}`} key={option}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="speaker-copy">
                    {object.feature.headline.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              {object.info ? (
                <div className="nfc-info">
                  <div className="nfc-copy-stack">
                    {object.info.leftBlocks.map((block, blockIndex) => (
                      <div className={`nfc-info-panel nfc-info-block nfc-info-block-${blockIndex}`} key={block.body}>
                        <h3>
                          {block.title.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </h3>
                        <p>{block.body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="nfc-certificate">
                    <h3>
                      {object.info.certificateTitle.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </h3>
                    <div className="nfc-click-pills" role="list" aria-label="Birth certificate fields">
                      {object.info.certificateItems.map((item, itemIndex) => (
                        <button
                          aria-expanded={activeCertificateItem === itemIndex}
                          className={`nfc-click-pill nfc-click-pill-${itemIndex} ${
                            activeCertificateItem === itemIndex ? "is-active" : ""
                          }`}
                          key={item.label}
                          onClick={() => setActiveCertificateItem(itemIndex)}
                          type="button"
                        >
                          <span>{item.label}</span>
                          <strong>{item.detail}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              {object.type === "image" ? (
                <img className="scroll-object-media" src={object.src} alt={object.alt} />
              ) : (
                <ScrollImageSequence
                  ref={(node) => {
                    sequenceRefs.current[index] = node;
                  }}
                  alt={object.alt}
                  frameCount={object.frameCount}
                  fallbackSrc={assetUrl(`${object.frameBase}/frame_0001.webp`)}
                  getFrameSrc={(frame) => assetUrl(`${object.frameBase}/frame_${String(frame).padStart(4, "0")}.webp`)}
                />
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
