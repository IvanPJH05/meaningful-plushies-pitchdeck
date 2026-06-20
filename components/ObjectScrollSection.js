"use client";

import { useEffect, useRef } from "react";
import { assetUrl } from "@/lib/assets";

const objects = [
  {
    id: "dino-plush",
    type: "image",
    src: assetUrl("/assets/object-1.jpeg"),
    alt: "Green Meaningful Plushies dinosaur plush",
  },
  {
    id: "speaker-animation",
    type: "video",
    src: assetUrl("/assets/speaker-animation.mp4"),
    alt: "Speaker animation",
  },
  {
    id: "nfc-card-animation",
    type: "video",
    src: assetUrl("/assets/nfc-card-animation.mp4"),
    alt: "NFC card animation",
  },
];

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let rafId = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      const segmentSize = 1 / objects.length;

      objects.forEach((object, index) => {
        const node = objectRefs.current[index];
        if (!node) return;

        const start = index * segmentSize;
        const local = clamp((progress - start) / segmentSize);
        const active = local > 0 && local < 1;
        const enter = clamp(local / 0.25);
        const hold = clamp((local - 0.25) / 0.5);
        const exit = clamp((local - 0.75) / 0.25);
        const y = (1 - ease(enter)) * 42 - ease(exit) * 42;
        const opacity = active ? Math.min(1, enter * 1.6, (1 - exit) * 1.6) : 0;
        const scale = 0.94 + Math.min(enter, 1 - exit) * 0.06;

        node.style.setProperty("--object-y", `${y.toFixed(2)}vh`);
        node.style.setProperty("--object-opacity", opacity.toFixed(4));
        node.style.setProperty("--object-scale", scale.toFixed(4));
        node.dataset.active = opacity > 0.45 ? "true" : "false";

        if (object.type === "video") {
          const video = videoRefs.current[index];
          if (video && Number.isFinite(video.duration) && video.duration > 0) {
            const targetTime = hold * video.duration;
            if (Math.abs(video.currentTime - targetTime) > 0.04) {
              video.currentTime = targetTime;
            }
          }
        }
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
      if (video) video.addEventListener("loadedmetadata", requestUpdate);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      videoRefs.current.forEach((video) => {
        if (video) video.removeEventListener("loadedmetadata", requestUpdate);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="objects"
      className="object-scroll-section"
      style={{ "--object-section-height": `${objects.length * 190 + 70}vh` }}
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
