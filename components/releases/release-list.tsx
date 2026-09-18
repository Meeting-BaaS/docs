import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { Release } from '@/lib/releases';
import { SECTION_META, SECTION_ORDER } from '@/lib/release-sections';

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
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
        tone === 'breaking' && SECTION_META.breaking.chip,
        tone === 'deprecation' && SECTION_META.deprecations.chip,
        tone === 'prerelease' && SECTION_META.other.chip,
      )}
    >
      {children}
    </span>
  );
}

export function ReleaseBadges({
  release,
}: {
  release: Pick<Release, 'breaking' | 'deprecations' | 'prerelease'>;
}) {
  return (
    <>
      {release.breaking && (
        <ReleaseBadge tone="breaking">
          <span aria-hidden>{SECTION_META.breaking.emoji}</span> Breaking
        </ReleaseBadge>
      )}
      {release.deprecations && (
        <ReleaseBadge tone="deprecation">
          <span aria-hidden>{SECTION_META.deprecations.emoji}</span> Deprecations
        </ReleaseBadge>
      )}
      {release.prerelease && (
        <ReleaseBadge tone="prerelease">
          <span aria-hidden>🧪</span> Pre-release
        </ReleaseBadge>
      )}
    </>
  );
}

/** "✨ 3 new · ⚡ 2 improved · 🐛 4 fixed" for a release. */
export function SectionChips({
  release,
  className,
}: {
  release: Pick<Release, 'sections'>;
  className?: string;
}) {
  const chips = SECTION_ORDER.map((key) => ({
    meta: SECTION_META[key],
    count: release.sections.find((s) => s.key === key)?.count ?? 0,
  })).filter((chip) => chip.count > 0);
  if (chips.length === 0) return null;
  return (
    <ul className={cn('not-prose flex flex-wrap gap-1.5', className)}>
      {chips.map(({ meta, count }) => (
        <li
          key={meta.key}
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium',
            meta.chip,
          )}
          title={`${count} ${meta.label.toLowerCase()}`}
        >
          <span aria-hidden>{meta.emoji}</span>
          <span className="tabular-nums">{count}</span>
          <span className="opacity-80">{meta.label.toLowerCase()}</span>
        </li>
      ))}
    </ul>
  );
}

function monthOf(release: Release): string {
  if (!release.date) return 'Unreleased';
  const date = new Date(release.date);
  if (Number.isNaN(date.getTime())) return 'Unreleased';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function groupByMonth(releases: Release[]): { month: string; releases: Release[] }[] {
  const groups: { month: string; releases: Release[] }[] = [];
  for (const release of releases) {
    const month = monthOf(release);
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.releases.push(release);
    else groups.push({ month, releases: [release] });
  }
  return groups;
}

function ReleaseCard({ release, latest }: { release: Release; latest: boolean }) {
  return (
    <li className="relative pl-8">
      {/* timeline dot */}
      <span
        aria-hidden
        className={cn(
          'absolute left-0 top-5 size-3 -translate-x-1/2 rounded-full ring-4 ring-fd-background',
          release.breaking
            ? 'bg-red-500'
            : release.prerelease
              ? 'bg-fd-muted-foreground'
              : 'bg-fd-primary',
          latest && 'shadow-[0_0_0_6px_color-mix(in_oklab,var(--color-fd-primary)_25%,transparent)]',
        )}
      />
      <Link
        href={release.href}
        className={cn(
          'group block rounded-xl border border-fd-border bg-fd-card/60 p-4 no-underline transition-all duration-200',
          'hover:-translate-y-0.5 hover:border-fd-primary/50 hover:bg-fd-card hover:shadow-[0_8px_30px_-12px_color-mix(in_oklab,var(--color-fd-primary)_45%,transparent)]',
          release.breaking && 'border-red-500/30',
        )}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-mono text-lg font-semibold tracking-tight text-fd-foreground">
            {release.version}
          </span>
          {latest && (
            <span className="rounded-full bg-fd-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-fd-primary-foreground">
              Latest
            </span>
          )}
          <ReleaseBadges release={release} />
          <time
            dateTime={release.date ?? undefined}
            className="ml-auto text-xs text-fd-muted-foreground"
          >
            {release.dateLabel}
          </time>
        </div>
        {release.headline && (
          <p className="mt-2 text-[15px] font-medium leading-snug text-fd-foreground">
            {release.headline}
          </p>
        )}
        {release.summary && (
          <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">
            {release.summary}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <SectionChips release={release} />
          <span className="ml-auto text-xs font-medium text-fd-primary opacity-0 transition-opacity group-hover:opacity-100">
            Read the notes →
          </span>
        </div>
      </Link>
    </li>
  );
}

/** Timeline of API releases, newest first, grouped by month. */
export function ReleaseList({ releases }: { releases: Release[] }) {
  const groups = groupByMonth(releases);
  const latest = releases.find((release) => !release.prerelease) ?? releases[0];
  return (
    <div className="not-prose my-6">
      {groups.map((group) => (
        <section key={group.month} className="mb-8 last:mb-0">
          <h2 className="meta sticky top-[calc(var(--fd-nav-height,56px)+8px)] z-[1] mb-3 w-fit rounded-md bg-fd-background/80 px-1 py-0.5 backdrop-blur">
            {group.month}
          </h2>
          <ol className="space-y-4 border-l border-fd-border">
            {group.releases.map((release) => (
              <ReleaseCard
                key={release.slug}
                release={release}
                latest={release === latest}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
