import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { Release } from '@/lib/releases';

export function ReleaseBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: 'breaking' | 'deprecation' | 'prerelease';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
        tone === 'breaking' &&
          'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
        tone === 'deprecation' &&
          'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        tone === 'prerelease' &&
          'border-fd-border bg-fd-muted text-fd-muted-foreground',
      )}
    >
      {children}
    </span>
  );
}

export function ReleaseBadges({ release }: { release: Pick<Release, 'breaking' | 'deprecations' | 'prerelease'> }) {
  return (
    <>
      {release.breaking && <ReleaseBadge tone="breaking">Breaking</ReleaseBadge>}
      {release.deprecations && (
        <ReleaseBadge tone="deprecation">Deprecations</ReleaseBadge>
      )}
      {release.prerelease && (
        <ReleaseBadge tone="prerelease">Pre-release</ReleaseBadge>
      )}
    </>
  );
}

/** Timeline of API releases, newest first. */
export function ReleaseList({ releases }: { releases: Release[] }) {
  return (
    <ol className="not-prose relative my-6 list-none space-y-0 border-l border-fd-border pl-6">
      {releases.map((release) => (
        <li key={release.slug} className="relative pb-8 last:pb-0">
          <span
            aria-hidden
            className={cn(
              'absolute -left-[31px] top-1.5 size-2.5 rounded-full border-2 border-fd-background',
              release.breaking ? 'bg-red-500' : 'bg-fd-primary',
            )}
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link
              href={release.href}
              className="font-mono text-base font-semibold text-fd-foreground no-underline hover:text-fd-primary"
            >
              {release.version}
            </Link>
            <time
              dateTime={release.date ?? undefined}
              className="text-sm text-fd-muted-foreground"
            >
              {release.dateLabel}
            </time>
            <ReleaseBadges release={release} />
          </div>
          {release.headline && (
            <p className="mt-1 text-[15px] font-medium text-fd-foreground">
              {release.headline}
            </p>
          )}
          {release.summary && (
            <p className="mt-1 text-sm leading-relaxed text-fd-muted-foreground">
              {release.summary}
            </p>
          )}
          <Link
            href={release.href}
            className="mt-2 inline-block text-sm text-fd-primary no-underline hover:underline"
          >
            Read the release notes →
          </Link>
        </li>
      ))}
    </ol>
  );
}
