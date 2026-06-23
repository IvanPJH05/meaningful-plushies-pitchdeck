"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { storyItems } from '@/lib/storyItems';

gsap.registerPlugin(ScrollTrigger);

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const toGsapVars = (state) => ({ x: state.x, y: state.y, scale: state.scale, rotate: state.rotate, autoAlpha: state.opacity });

function useMediaPreference(queryText) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(queryText);
    setMatches(query.matches);
    const onChange = () => setMatches(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [queryText]);

  return matches;
}

function StoryVisual({ item, registerVideo, onVideoError }) {
  if (item.type === 'image') {
    return <img className="story-media story-image" src={item.src} alt="" loading="eager" />;
  }

  if (item.type === 'video') {
    return (
      <div className="story-video-shell">
        <video ref={(node) => registerVideo(item.id, node)} className="story-media" src={item.src} poster={item.poster} muted playsInline preload="metadata" onError={() => onVideoError(item.id)} />
        <span className="video-badge">scroll scrub video</span>
      </div>
    );
  }

  if (item.variant === 'productCard') {
    return (
      <div className="product-card" aria-label="Creator match card">
        <div className="product-card-top"><span>Creator Match</span><strong>94</strong></div>
        <div className="plush-stack"><span className="plush-dot pink" /><span className="plush-dot blue" /><span className="plush-dot gold" /></div>
        <div className="metric-list">{item.metrics?.map((metric) => <span key={metric}>{metric}</span>)}</div>
      </div>
    );
  }

  return <div className="text-object"><span>Meaningful</span><strong>Creator Wave</strong></div>;
}

export default function ScrollStory({ items = storyItems, height = '680vh' }) {
  const sectionRef = useRef(null);
  const objectRefs = useRef(new Map());
  const videoRefs = useRef(new Map());
  const videoTargets = useRef(new Map());
  const reducedMotion = useMediaPreference('(prefers-reduced-motion: reduce)');
  const mobileFallback = useMediaPreference('(max-width: 920px)');
  const useStaticStory = reducedMotion || mobileFallback;
  const [activeId, setActiveId] = useState(items[0]?.id);
  const [videoErrors, setVideoErrors] = useState({});
  const sortedItems = useMemo(() => [...items].sort((a, b) => a.start - b.start), [items]);

  useEffect(() => {
    if (!sectionRef.current || useStaticStory) return undefined;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
          onUpdate: (self) => {
            let nextActive = sortedItems[0]?.id;
            sortedItems.forEach((item) => {
              const node = objectRefs.current.get(item.id);
              const localProgress = clamp((self.progress - item.start) / (item.end - item.start));
              const inSegment = self.progress >= item.start && self.progress <= item.end;

              if (node) gsap.set(node, { pointerEvents: inSegment ? 'auto' : 'none', zIndex: inSegment ? 5 : 1 });
              if (inSegment) nextActive = item.id;

              if (item.type === 'video') {
                const video = videoRefs.current.get(item.id);
                if (video?.duration && Number.isFinite(video.duration)) videoTargets.current.set(item.id, localProgress * video.duration);
              }
            });
            setActiveId(nextActive);
          }
        }
      });

      timeline.to({}, { duration: 1 }, 0);
      sortedItems.forEach((item) => {
        const node = objectRefs.current.get(item.id);
        if (!node) return;
        const enterDuration = (item.end - item.start) * 0.5;
        const exitStart = item.start + enterDuration;
        timeline.fromTo(node, toGsapVars(item.animation.from), { ...toGsapVars(item.animation.focus), duration: enterDuration }, item.start);
        timeline.to(node, { ...toGsapVars(item.animation.to), duration: enterDuration }, exitStart);
      });
    }, sectionRef);

    let rafId = 0;
    const scrubVideos = () => {
      videoRefs.current.forEach((video, id) => {
        const target = videoTargets.current.get(id);
        if (video && typeof target === 'number' && Number.isFinite(target)) {
          video.pause();
          video.currentTime += (target - video.currentTime) * 0.32;
        }
      });
      rafId = window.requestAnimationFrame(scrubVideos);
    };
    rafId = window.requestAnimationFrame(scrubVideos);

    return () => {
      window.cancelAnimationFrame(rafId);
      context.revert();
    };
  }, [useStaticStory, sortedItems]);

  function registerObject(id, node) {
    if (node) objectRefs.current.set(id, node);
    else objectRefs.current.delete(id);
  }

  function registerVideo(id, node) {
    if (node) videoRefs.current.set(id, node);
    else videoRefs.current.delete(id);
  }

  if (useStaticStory) {
    return (
      <section className="scroll-story-fallback" aria-labelledby="story-title">
        <div className="section-heading"><p className="eyebrow">Creator acquisition story</p><h2 id="story-title">A scroll-led path from creator discovery to plushie launch.</h2></div>
        <div className="fallback-grid">{sortedItems.map((item) => <article className="fallback-card" key={item.id}><span>{item.kicker}</span><h3>{item.headline}</h3><p>{item.body}</p></article>)}</div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="scroll-story-section" style={{ '--story-height': height }} aria-labelledby="story-title">
      <div className="sticky-story">
        <div className="story-background" aria-hidden="true" />
        <div className="story-copy-rail"><p className="eyebrow">Apple-style scroll story</p><h2 id="story-title">Creator acquisition, told one plush moment at a time.</h2><div className="story-progress-list" aria-label="Story progress">{sortedItems.map((item) => <span className={activeId === item.id ? 'is-active' : ''} key={item.id}>{item.kicker}</span>)}</div></div>
        <div className="story-stage" aria-live="polite">{sortedItems.map((item) => <article ref={(node) => registerObject(item.id, node)} className={`story-object story-object-${item.type}`} key={item.id} data-active={activeId === item.id}><StoryVisual item={item} registerVideo={registerVideo} onVideoError={(id) => setVideoErrors((current) => ({ ...current, [id]: true }))} /><div className="object-copy"><span>{item.kicker}</span><h3>{item.headline}</h3><p>{videoErrors[item.id] ? item.fallbackBody || item.body : item.body}</p></div></article>)}</div>
      </div>
    </section>
  );
}
