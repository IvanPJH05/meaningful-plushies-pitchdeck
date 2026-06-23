import { assetUrl } from "@/lib/assets";

export const storyItems = [
  {
    id: "gift-creators",
    type: "image",
    src: assetUrl("/assets/meaningful-logo.png"),
    start: 0.04,
    end: 0.22,
    kicker: "Find",
    headline: "Start with creators who already make soft moments feel shareable.",
    body: "Gift guides, plush hauls, desk setups, cozy rooms, and Kawaii lifestyle accounts enter the first sourcing wave.",
    animation: {
      from: { x: -120, y: 40, scale: 0.82, rotate: -6, opacity: 0 },
      focus: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
      to: { x: 90, y: -70, scale: 0.9, rotate: 5, opacity: 0 }
    }
  },
  {
    id: "sample-video",
    type: "image",
    src: assetUrl("/assets/meaningful-cloud-cover.png"),
    start: 0.24,
    end: 0.44,
    kicker: "Sequence",
    headline: "Use image frames for smooth product motion on scroll.",
    body: "Product motion is exported into WebP frames and drawn on canvas, avoiding the stutter of video currentTime scrubbing.",
    animation: {
      from: { x: 110, y: 80, scale: 0.78, rotate: 5, opacity: 0 },
      focus: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
      to: { x: -80, y: -80, scale: 0.86, rotate: -4, opacity: 0 }
    }
  },
  {
    id: "creator-card",
    type: "text",
    variant: "productCard",
    start: 0.46,
    end: 0.64,
    kicker: "Match",
    headline: "Pair each creator with the plush character that fits their world.",
    body: "Audience mood, content format, comment language, and gifting angle become the match score.",
    metrics: ["Kawaii fit 94%", "Gift guide fit 88%", "Reply chance 71%"],
    animation: {
      from: { x: 0, y: 130, scale: 0.72, rotate: 0, opacity: 0 },
      focus: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
      to: { x: 0, y: -120, scale: 0.82, rotate: 0, opacity: 0 }
    }
  },
  {
    id: "launch-copy",
    type: "text",
    start: 0.66,
    end: 0.84,
    kicker: "Activate",
    headline: "Turn samples into posts, discount codes, and repeat creator waves.",
    body: "The story closes with a clear acquisition motion: source, gift, brief, post, measure, and refill the pipeline.",
    animation: {
      from: { x: -70, y: 110, scale: 0.84, rotate: -2, opacity: 0 },
      focus: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
      to: { x: 70, y: -90, scale: 0.9, rotate: 2, opacity: 0 }
    }
  }
];
