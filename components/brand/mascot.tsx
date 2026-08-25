'use client';

import { cn } from '@/lib/cn';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const BUBBLES = [
  { left: '8%', top: '36%', size: 10, delay: '0s', duration: '5.5s' },
  { left: '15%', top: '50%', size: 6, delay: '1.2s', duration: '6.4s' },
  { left: '3%', top: '58%', size: 13, delay: '2.1s', duration: '5s' },
  { left: '20%', top: '30%', size: 5, delay: '3.4s', duration: '7s' },
] as const;

/**
 * Bass, matching the marketing site's mascot.
 *
 * The landing version rides `motion`; the docs ship no animation runtime, so
 * the same four layers are rebuilt by hand:
 *
 *   - a CSS bob and roll (the idle swim)
 *   - a bubble trail rising behind it
 *   - scroll-linked drift, so it sits at a different depth than the copy
 *   - a light lean toward the pointer
 *
 * The last two are written to CSS custom properties inside a single rAF loop
 * and consumed by a `translate`, so the browser only ever composites.
 */
export function Mascot({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 22;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 16;
      schedule();
    };

    const apply = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // -1 when the element sits below the fold, +1 once it has passed above
      const progress =
        (window.innerHeight / 2 - (rect.top + rect.height / 2)) /
        (window.innerHeight / 2 + rect.height / 2);
      const drift = Math.max(-1, Math.min(1, progress)) * 26;

      el.style.setProperty('--lean-x', `${pointerX.toFixed(2)}px`);
      el.style.setProperty('--lean-y', `${(pointerY + drift).toFixed(2)}px`);
      el.style.setProperty('--tilt', `${(drift * 0.06).toFixed(3)}deg`);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div
        aria-hidden="true"
        className="bg-fd-primary/10 absolute inset-0 scale-110 rounded-full blur-3xl"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {BUBBLES.map((b) => (
          <span
            key={b.left + b.top}
            className="border-fd-primary/40 bg-fd-primary/10 mascot-bubble absolute rounded-full border"
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      {/* Outer element carries scroll + pointer; inner carries the idle swim,
          so the two never fight over the same transform. */}
      <div ref={ref} className="mascot-lean">
        <Image
          src="/hero-image.png"
          alt=""
          aria-hidden="true"
          width={900}
          height={600}
          priority
          className="mascot-swim pointer-events-none relative w-full max-w-none select-none"
        />
      </div>
    </div>
  );
}
