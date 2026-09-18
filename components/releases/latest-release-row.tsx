import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { fetchReleases } from '@/lib/releases';
import { RELEASES_URL } from '@/lib/release-urls';

/**
 * One quiet line for the API v2 card on the docs home:
 * "LATEST RELEASE  v2.6.16  Per-team status callbacks … · Sep 16, 2026   All releases →"
 *
 * Meant to sit inside a card that is itself a stretched link, so every link
 * here is `relative z-10` to stay clickable above it. Renders nothing when
 * GitHub cannot be read. Server component; the fetch revalidates every 5 min.
 */
export async function LatestReleaseRow({ className }: { className?: string }) {
  const result = await fetchReleases();
  if (result.status !== 'ok') return null;
  const latest = result.releases.find((release) => !release.prerelease);
  if (!latest) return null;

  return (
    <div
      className={cn(
        'border-hairline flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-[13.5px]',
        className,
      )}
    >
      <span className="meta">Latest release</span>
      <Link
        href={latest.href}
        className={cn(
          'relative z-10 inline-flex min-w-0 items-center gap-2 no-underline',
          'text-fd-foreground hover:text-fd-primary',
        )}
      >
        <span
          className={cn(
            'inline-flex items-center gap-1.5 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[12px] font-semibold',
            latest.breaking
              ? 'bg-red-500/15 text-red-700 dark:text-red-300'
              : 'bg-fd-primary/15 text-fd-primary',
          )}
          title={latest.breaking ? 'Contains breaking changes' : undefined}
        >
          {latest.breaking && (
            <span aria-hidden className="size-1.5 rounded-full bg-red-500" />
          )}
          {latest.version}
        </span>
        {latest.headline && (
          <span className="min-w-0 max-w-[28rem] truncate">{latest.headline}</span>
        )}
      </Link>
      <time
        dateTime={latest.date ?? undefined}
        className="text-fd-muted-foreground"
      >
        · {latest.dateLabel}
      </time>
      <Link
        href={RELEASES_URL}
        className="text-fd-muted-foreground hover:text-fd-primary relative z-10 ml-auto inline-flex items-center gap-1 no-underline"
      >
        All releases
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
