import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { fetchReleases } from '@/lib/releases';
import { RELEASES_URL } from '@/lib/release-urls';
import { SECTION_META } from '@/lib/release-sections';

/**
 * "v2.6.16 — headline · Sep 16" pill for the docs home, linking to the latest
 * stable release. Renders nothing when GitHub cannot be read so the home page
 * never depends on it. Server component; the underlying fetch is revalidated
 * every 5 minutes.
 */
export async function LatestReleasePill({ className }: { className?: string }) {
  const result = await fetchReleases();
  if (result.status !== 'ok') return null;
  const latest = result.releases.find((release) => !release.prerelease);
  if (!latest) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-2', className)}>
      <Link
        href={latest.href}
        className={cn(
          'group border-hairline bg-fd-card hover:bg-fd-accent/50 inline-flex min-w-0 max-w-[30rem] items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-[13px] no-underline transition-colors duration-200',
          latest.breaking && 'border-red-500/40',
        )}
      >
        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold',
            latest.breaking
              ? 'bg-red-500/15 text-red-700 dark:text-red-300'
              : 'bg-fd-primary/15 text-fd-primary',
          )}
        >
          {latest.breaking ? `${SECTION_META.breaking.emoji} ` : ''}
          {latest.version}
        </span>
        <span className="min-w-0 truncate text-fd-foreground">
          {latest.headline ?? 'Latest release'}
        </span>
        <span className="text-fd-muted-foreground shrink-0">· {latest.dateLabel}</span>
        <ArrowRight className="text-fd-muted-foreground size-3.5 shrink-0 transition-transform duration-200 ease-[var(--ease-docs)] group-hover:translate-x-0.5" />
      </Link>
      <Link
        href={RELEASES_URL}
        className="text-fd-muted-foreground hover:text-fd-primary text-[13px] no-underline"
      >
        All releases
      </Link>
    </div>
  );
}
