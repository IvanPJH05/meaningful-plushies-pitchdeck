# Meaningful Plushies Scroll Homepage

Next.js homepage with an Apple-style scroll story section.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Add More Story Objects

Edit `lib/storyItems.js`.

Each object supports:

```js
{
  id: "unique-id",
  type: "image", // "image" | "video" | "text"
  src: "/assets/file.png",
  poster: "/assets/poster.png", // video only
  start: 0.1,
  end: 0.25,
  kicker: "Find",
  headline: "Main object headline",
  body: "Supporting copy",
  animation: {
    from: { x: -100, y: 40, scale: 0.8, rotate: -4, opacity: 0 },
    focus: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
    to: { x: 100, y: -40, scale: 0.85, rotate: 4, opacity: 0 }
  }
}
```

## Scroll Image Sequences

The object showcase uses canvas image sequences instead of `video.currentTime` scrubbing. Export each video into WebP frames, then add the frame folder to `components/ObjectScrollSection.js`.

Requested full-size export command:

```bash
ffmpeg -i input.mp4 -vf "fps=24,scale=1920:-1" public/sequence/plushie/frame_%04d.webp
```

Optimized command used here:

```bash
ffmpeg -i input.mp4 -vf "fps=30,scale=1280:-1" -q:v 72 public/sequence/plushie/frame_%04d.webp
```

Frame objects look like this:

```js
{
  id: "speaker-animation",
  type: "sequence",
  frameBase: "/sequence/speaker",
  frameCount: 18,
  duration: 0.6
}
```
