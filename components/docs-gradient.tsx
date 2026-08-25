import { cn } from '@/lib/cn';

/**
 * The docs backdrop.
 *
 * Deliberately not the marketing site's drifting aurora: a fine dot lattice
 * that fades out a third of the way down, with a single static accent wash
 * behind the page header. Graph paper, not stage lighting.
 */
const DocsGradient = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      'pointer-events-none absolute inset-x-0 top-0 z-[-1] block h-[32rem] overflow-hidden',
      className,
    )}
  >
    <span className="bg-blueprint mask-fade-top absolute inset-0 block" />
    <span
      className="absolute inset-x-0 top-0 block h-64"
      style={{
        background:
          'radial-gradient(60% 100% at 50% 0%, var(--blueprint-wash) 0%, transparent 70%)',
      }}
    />
    <span className="via-fd-primary/40 absolute inset-x-0 top-0 block h-px bg-gradient-to-r from-transparent to-transparent" />
  </span>
);

export default DocsGradient;
