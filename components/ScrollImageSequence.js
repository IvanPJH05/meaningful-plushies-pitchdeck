"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function drawCover(context, image, width, height) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  const drawHeight = imageRatio > canvasRatio ? height : width / imageRatio;
  const drawWidth = imageRatio > canvasRatio ? height * imageRatio : width;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  context.clearRect(0, 0, width, height);
  context.drawImage(image, x, y, drawWidth, drawHeight);
}

const ScrollImageSequence = forwardRef(function ScrollImageSequence(
  { alt, className = "", frameCount, getFrameSrc, fallbackSrc },
  ref
) {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const progressRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const firstFrame = useMemo(() => fallbackSrc || getFrameSrc(1), [fallbackSrc, getFrameSrc]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px), (prefers-reduced-motion: reduce)");
    const updateFallback = () => setUseFallback(query.matches);

    updateFallback();
    query.addEventListener("change", updateFallback);
    return () => query.removeEventListener("change", updateFallback);
  }, []);

  useEffect(() => {
    if (useFallback) return undefined;

    let cancelled = false;
    const frames = Array.from({ length: frameCount }, (_, index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = getFrameSrc(index + 1);
      return image;
    });

    framesRef.current = frames;

    Promise.all(
      frames.map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete) resolve();
            image.onload = resolve;
            image.onerror = resolve;
          })
      )
    ).then(() => {
      if (cancelled) return;
      setLoaded(true);
      drawFrame(progressRef.current);
    });

    return () => {
      cancelled = true;
    };
  }, [frameCount, getFrameSrc, useFallback]);

  useEffect(() => {
    if (useFallback) return undefined;

    const resize = () => drawFrame(progressRef.current);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [useFallback]);

  function drawFrame(progress) {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;

    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * pixelRatio));
    const height = Math.max(1, Math.round(rect.height * pixelRatio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const index = Math.min(frames.length - 1, Math.round(clamp(progress) * (frames.length - 1)));
    const image = frames[index];
    const context = canvas.getContext("2d");

    if (context && image?.complete && image.naturalWidth > 0) {
      drawCover(context, image, width, height);
    }
  }

  useImperativeHandle(ref, () => ({
    setProgress(progress) {
      progressRef.current = clamp(progress);
      if (loaded) drawFrame(progressRef.current);
    },
  }));

  if (useFallback) {
    return <img className={`scroll-object-media ${className}`} src={firstFrame} alt={alt} loading="eager" />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`scroll-object-media scroll-sequence-canvas ${className}`}
      role="img"
      aria-label={alt}
      data-loaded={loaded ? "true" : "false"}
    />
  );
});

export default ScrollImageSequence;
