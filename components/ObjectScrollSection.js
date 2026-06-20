"use client";

import { useEffect, useRef } from "react";
import { assetUrl } from "@/lib/assets";

const objects = [
  {
    id: "dino-plush",
    type: "image",
    src: assetUrl("/assets/meaningful-object-1.png"),
    alt: "Green Meaningful Plushies dinosaur plush",
    scrollWeight: 1.45,
  },
  {
    id: "speaker-animation",
    type: "video",
    src: assetUrl("/assets/speaker-animation-v2.mp4"),
    alt: "Speaker animation",
    fallbackDuration: 6,
  },
  {
    id: "nfc-card-animation",
    type: "video",
    src: assetUrl("/assets/nfc-animation-2.mp4"),
    alt: "NFC card animation",
    fallbackDuration: 5,
  },
];

const VIDEO_ENTER_WEIGHT = 0.9;
const VIDEO_EXIT_WEIGHT = 0.9;
const VIDEO_SECONDS_TO_SCROLL_WEIGHT = 1.45;

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function ease(value) {
  return value * value * (3 - 2 * value);
}

export default function ObjectScrollSection() {
  const sectionRef = useRef(null);
  const objectRefs = useRef([]);
  const videoRefs = useRef([]);
  const durationsRef = useRef(objects.map((object) => object.fallbackDuration || 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let rafId = 0;

    const getObjectWeight = (object, index) => {
      if (object.type === "image") return object.scrollWeight || 1;

      const duration = durationsRef.current[index] || object.fallbackDuration || 3;
      return VIDEO_ENTER_WEIGHT + duration * VIDEO_SECONDS_TO_SCROLL_WEIGHT + VIDEO_EXIT_WEIGHT;
    };

    const getTimeline = () => {
      const weights = objects.map(getObjectWeight);
      const total = weights.reduce((sum, weight) => sum + weight, 0);
      let cursor = 0;

      return weights.map((weight) => {
        const start = cursor / total;
        cursor += weight;
        return {
          start,
          end: cursor / total,
          weight,
        };
      });
    };

    const update = () => {
      const totalWeight = objects.reduce((sum, object, index) => sum + getObjectWeight(object, index), 0);
      section.style.setProperty("--object-section-height", `${Math.max(520, Math.round(totalWeight * 118))}vh`);

      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      const timeline = getTimeline();
      const bgFade = clamp(progress / 0.16);
      section.style.setProperty("--object-bg-opacity", (1 - bgFade).toFixed(4));

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
          const travelY = 100 - local * 188;
          const distanceFromCenter = Math.abs(local - 0.5) * 2;

          y = travelY;
          opacity = active ? clamp((1 - distanceFromCenter) * 1.55) : 0;
          scale = 0.96 + (1 - distanceFromCenter) * 0.04;
        } else {
          const duration = durationsRef.current[index] || object.fallbackDuration || 3;
          const enterPortion = VIDEO_ENTER_WEIGHT / Math.max(segment.weight, 0.001);
          const exitPortion = VIDEO_EXIT_WEIGHT / Math.max(segment.weight, 0.001);
          const scrubStart = enterPortion;
          const scrubEnd = 1 - exitPortion;
          const enter = clamp(local / scrubStart);
          const scrub = clamp((local - scrubStart) / Math.max(scrubEnd - scrubStart, 0.001));
          const exit = clamp((local - scrubEnd) / exitPortion);

          y = (1 - ease(enter)) * 62 - ease(exit) * 62;
          opacity = active ? Math.min(1, enter * 1.35, (1 - exit) * 1.35) : 0;
          scale = 0.96 + Math.min(enter, 1 - exit) * 0.04;

          const video = videoRefs.current[index];
          if (video && Number.isFinite(video.duration) && video.duration > 0) {
            const targetTime = scrub * duration;
            if (Math.abs(video.currentTime - targetTime) > 0.04) {
              video.currentTime = targetTime;
            }
          }
        }

        node.style.setProperty("--object-y", `${y.toFixed(2)}vh`);
        node.style.setProperty("--object-opacity", opacity.toFixed(4));
        node.style.setProperty("--object-scale", scale.toFixed(4));
        node.dataset.active = opacity > 0.45 ? "true" : "false";
      });

      rafId = 0;
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    videoRefs.current.forEach((video) => {
      if (video) {
        video.addEventListener("loadedmetadata", () => {
          const index = videoRefs.current.indexOf(video);
          if (index >= 0 && Number.isFinite(video.duration)) {
            durationsRef.current[index] = video.duration;
          }
          requestUpdate();
        });
      }
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="objects"
      className="object-scroll-section"
      style={{ "--object-section-height": "760vh" }}
      aria-label="Meaningful Plushies object showcase"
    >
      <div className="object-scroll-sticky">
        <div className="object-scroll-background">
          <img src={assetUrl("/assets/home-2.png")} alt="" />
        </div>
        <div className="object-stage">
          {objects.map((object, index) => (
            <figure
              className="scroll-object"
              key={object.id}
              ref={(node) => {
                objectRefs.current[index] = node;
              }}
            >
              {object.type === "image" ? (
                <img className="scroll-object-media" src={object.src} alt={object.alt} />
              ) : (
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  className="scroll-object-media"
                  src={object.src}
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={object.alt}
                />
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
