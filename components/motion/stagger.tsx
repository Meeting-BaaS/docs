'use client';

import { cn } from '@/lib/cn';
import { type ReactNode, useEffect, useRef } from 'react';

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** ms between each child's start. */
  step?: number;
}

/**
 * Reveals its direct children in sequence when the group scrolls into view.
 * Same no-dependency approach as <Reveal />, applied per child so a grid of
 * cards resolves left-to-right instead of all at once.
 */
export function Stagger({ children, className, step = 45 }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const kids = Array.from(el.children) as HTMLElement[];
    for (const kid of kids) kid.dataset.reveal = '';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const kid of kids) kid.dataset.reveal = 'in';
      return;
    }

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        kids.forEach((kid, i) => {
          timers.push(
            window.setTimeout(() => {
              kid.dataset.reveal = 'in';
            }, i * step),
          );
        });
        observer.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      for (const t of timers) window.clearTimeout(t);
    };
  }, [step]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
