'use client';

import { cn } from '@/lib/cn';
import { type ElementType, type ReactNode, useEffect, useRef } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** ms to wait after the element enters the viewport. */
  delay?: number;
  as?: ElementType;
}

/**
 * Scroll reveal for the docs, with no animation library behind it.
 *
 * The element ships with `data-reveal` (opacity 0, 10px down, transition
 * declared in globals.css); an IntersectionObserver flips it to
 * `data-reveal="in"` once and disconnects. That keeps the docs bundle free of
 * a motion runtime — appropriate for pages people read rather than scroll
 * through — while still giving content a considered entrance.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.reveal = 'in';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const timer = window.setTimeout(() => {
          el.dataset.reveal = 'in';
        }, delay);
        observer.disconnect();
        return () => window.clearTimeout(timer);
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} data-reveal="" className={cn(className)}>
      {children}
    </Tag>
  );
}
