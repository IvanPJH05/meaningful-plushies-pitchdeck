"use client";

import { useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/assets";

const reviews = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1;

  return {
    id: `review-${number.toString().padStart(2, "0")}`,
    label: `Review ${number.toString().padStart(2, "0")}`,
    src: assetUrl(`/assets/reviews/review-${number.toString().padStart(2, "0")}.webp`),
  };
});

export default function CustomerReviewsSection() {
  const sectionRef = useRef(null);
  const preloadedReviewsRef = useRef(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(0);

  const preloadReview = (index) => {
    if (typeof window === "undefined") return;

    const normalizedIndex = (index + reviews.length) % reviews.length;
    const review = reviews[normalizedIndex];
    if (!review || preloadedReviewsRef.current.has(review.src)) return;

    preloadedReviewsRef.current.add(review.src);
    const image = new window.Image();
    image.decoding = "async";
    image.src = review.src;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.04 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    [-3, -2, -1, 0, 1, 2, 3].forEach((offset) => preloadReview(selectedReview + offset));
  }, [selectedReview]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const preloadAll = () => {
      reviews.forEach((_, index) => preloadReview(index));
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preloadAll, { timeout: 1800 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preloadAll, 900);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const goToReview = (index) => {
    setSelectedReview((index + reviews.length) % reviews.length);
  };

  const visibleReviews = [-1, 0, 1].map((offset) => {
    const index = (selectedReview + offset + reviews.length) % reviews.length;
    return {
      ...reviews[index],
      index,
      position: offset === 0 ? "center" : offset < 0 ? "left" : "right",
    };
  });

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className={`customer-reviews-section${isVisible ? " is-visible" : ""}`}
      aria-labelledby="customer-reviews-title"
    >
      <div className="customer-reviews-inner">
        <div className="reviews-section-heading">
          <p className="eyebrow">What customers think</p>
          <h2 id="customer-reviews-title">Real meaningful moments</h2>
        </div>

        <div className="reviews-slider" aria-label="Customer review slider">
          <button
            aria-label="Show previous review"
            className="reviews-slider-arrow reviews-slider-arrow-left"
            onClick={() => goToReview(selectedReview - 1)}
            type="button"
          >
            Prev
          </button>

          <div className="reviews-slider-track">
            {visibleReviews.map((review) => (
              <button
                aria-label={`Open ${review.label}`}
                aria-pressed={review.position === "center"}
                className={`review-slide-card review-slide-card-${review.position}`}
                key={`${review.id}-${review.position}`}
                onClick={() => goToReview(review.index)}
                type="button"
              >
                <img
                  alt={`${review.label} customer WhatsApp review`}
                  decoding="async"
                  fetchPriority={review.position === "center" ? "high" : "auto"}
                  loading="eager"
                  src={review.src}
                />
              </button>
            ))}
          </div>

          <button
            aria-label="Show next review"
            className="reviews-slider-arrow reviews-slider-arrow-right"
            onClick={() => goToReview(selectedReview + 1)}
            type="button"
          >
            Next
          </button>

          <div className="reviews-slider-footer">
            <span>
              {String(selectedReview + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
            </span>
            <div className="reviews-slider-dots" aria-hidden="true">
              {reviews.slice(0, 6).map((review, index) => (
                <i className={Math.floor((selectedReview / reviews.length) * 6) === index ? "is-active" : ""} key={review.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
