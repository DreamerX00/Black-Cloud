"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * GSAP-powered character-by-character text reveal with stagger.
 * More premium feel than CSS-only approaches — each character
 * springs in with physics-based easing.
 *
 * Triggers on scroll intersection by default.
 */
export function GsapTextReveal({
  text,
  className,
  tag: Tag = "h2",
  stagger = 0.03,
  duration = 0.6,
  delay = 0,
}: {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  stagger?: number;
  duration?: number;
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll(".gsap-char");
    if (!chars.length) return;

    // Set initial state
    gsap.set(chars, { opacity: 0, y: 40, rotateX: -60 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration,
            stagger,
            delay,
            ease: "back.out(1.2)",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, stagger, duration, delay, reducedMotion]);

  // Split text into words, then characters
  const words = text.split(" ");

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      className={cn("overflow-hidden", className)}
      style={{ perspective: "600px" }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((char, ci) => (
            <span
              key={`${wi}-${ci}`}
              className="gsap-char inline-block"
              style={{ transformOrigin: "center bottom" }}
            >
              {char}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

/**
 * GSAP-powered parallax wrapper.
 * Children move at a different scroll speed, creating depth.
 */
export function GsapParallax({
  children,
  speed = 0.3,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * speed;
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial position
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
