# Meaningful Plushies Scroll Homepage

Next.js homepage with an Apple-style scroll story section for influencer acquisition.

Live deployment: https://i-want-to-develop-a-new.vercel.app

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add scroll objects

Edit `lib/storyItems.js`. Each item supports:

```js
{
  id: "unique-id",
  type: "image", // "image" | "video" | "text"
  src: "https://...",
  start: 0.1,
  end: 0.3,
  animation: {
    from: { x: -80, y: 40, scale: 0.8, rotate: -4, opacity: 0 },
    focus: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
    to: { x: 80, y: -40, scale: 0.85, rotate: 4, opacity: 0 }
  }
}
```

Video objects are scrubbed with scroll progress by mapping segment progress to `video.currentTime` inside `requestAnimationFrame`.
