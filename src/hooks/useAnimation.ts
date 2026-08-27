"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook to detect when an element enters the viewport.
 * Triggers once to enable entry animations.
 */
export function useInView(options: IntersectionObserverInit = { threshold: 0.1 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    // If reduced motion is preferred, immediately trigger
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsInView(true);
      return;
    }

    const currentRef = ref.current;
    if (!currentRef) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return { ref, isInView };
}

/**
 * Hook to smoothly animate a number count-up.
 */
export function useCountUp(
  targetValue: number,
  durationMs: number = 1000,
  shouldStart: boolean = true,
  decimals: number = 0
): number {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrentValue(targetValue);
      return;
    }

    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = easeOut * targetValue;
      setCurrentValue(Number(val.toFixed(decimals)));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCurrentValue(targetValue);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [targetValue, durationMs, shouldStart, decimals]);

  return currentValue;
}
