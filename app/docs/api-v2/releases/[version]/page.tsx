import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Callout } from 'fumadocs-ui/components/callout';
import { ReleaseFrame } from '@/components/releases/release-frame';
import { ReleaseBadges, SectionChips } from '@/components/releases/release-list';
import { renderReleaseNotes } from '@/components/releases/release-notes';
import { cn } from '@/lib/cn';
import { createMetadata } from '@/lib/metadata';
import {
  fetchReleases,
  headingAnchor,
  neighbours,
  type Release,
  RELEASES_URL,
  VERSIONING_URL,
} from '@/lib/releases';

// Must be a literal: Next reads segment config statically. Keep in step with RELEASES_REVALIDATE.
export const revalidate = 300;

type Params = { params: Promise<{ version: string }> };

function NeighbourCard({
  release,
  direction,
}: {
  release?: Release;
  direction: 'newer' | 'older';
}) {
  if (!release) return <div />;
  return (
    <Link
      href={release.href}
      className={cn(
        'group flex flex-col gap-1 rounded-xl border border-fd-border bg-fd-card/60 p-4 no-underline transition-colors hover:border-fd-primary/50 hover:bg-fd-card',
        direction === 'older' && 'items-end text-right',
      )}
    >
      <span className="meta">{direction === 'newer' ? '← Newer' : 'Older →'}</span>
      <span className="font-mono text-base font-semibold text-fd-foreground">
        {release.version}
      </span>
      {release.headline && (
        <span className="line-clamp-2 text-sm text-fd-muted-foreground">
          {release.headline}
        </span>
      )}
    </Link>
  );
}

export default async function ReleasePage({ params }: Params) {
  const { version } = await params;
  const result = await fetchReleases();
  if (result.status !== 'ok') {
    if (result.status === 'error') console.error(`[releases] ${result.message}`);
    notFound();
  }

  const release = result.releases.find((item) => item.slug === version);
  if (!release) notFound();

  const { newer, older } = neighbours(result.releases, release.slug);
  const { content, toc } = await renderReleaseNotes(release.body);
  const breakingAnchor = release.breaking
    ? headingAnchor(release.body, /breaking/i)
    : null;
  const isLatest =
    (result.releases.find((item) => !item.prerelease) ?? result.releases[0])?.slug ===
    release.slug;

  return (
    <ReleaseFrame
      title={
        <span className="inline-flex flex-wrap items-center gap-3">
          <span className="font-mono">{release.version}</span>
          {isLatest && (
            <span className="rounded-full bg-fd-primary px-2.5 py-0.5 align-middle text-xs font-semibold uppercase tracking-wide text-fd-primary-foreground">
              Latest
            </span>
          )}
        </span>
      }
      description={release.headline}
      meta={
        <>
          <span className="text-fd-muted-foreground/50">/</span>
          <span>Released {release.dateLabel}</span>
        </>
      }
      toc={toc}
      footer={false}
    >
      <div className="not-prose -mt-4 mb-8 flex flex-wrap items-center gap-2 empty:hidden">
        <ReleaseBadges release={release} />
        <SectionChips release={release} className="ml-auto" />
      </div>

      {release.breaking ? (
        <Callout type="warn" title="This release contains breaking changes">
          Review the{' '}
          {breakingAnchor ? (
            <a href={`#${breakingAnchor}`}>breaking changes</a>
          ) : (
            'breaking changes'
          )}{' '}
          before upgrading. See the{' '}
          <Link href={VERSIONING_URL}>versioning policy</Link> for how they are
          announced and supported.
        </Callout>
      ) : release.prerelease ? (
        <Callout type="info" title="Pre-release">
          This version is available for early testing and may change before it
          is finalised.
        </Callout>
      ) : null}

      {content}

      <div className="not-prose mt-12 grid gap-4 border-t border-fd-border pt-8 sm:grid-cols-2">
        <NeighbourCard release={newer} direction="newer" />
        <NeighbourCard release={older} direction="older" />
      </div>
      <p className="not-prose mt-4 text-center text-sm">
        <Link href={RELEASES_URL} className="text-fd-muted-foreground hover:text-fd-primary">
          ↩ All releases
        </Link>
      </p>
    </ReleaseFrame>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { version } = await params;
  const result = await fetchReleases();
  const release =
    result.status === 'ok'
      ? result.releases.find((item) => item.slug === version)
      : undefined;
  if (!release) return createMetadata({ title: 'Release not found' });

  return createMetadata({
    title: `${release.version} release notes`,
    description:
      release.headline ?? `Meeting BaaS API v2 release ${release.version}`,
    openGraph: { url: release.href },
  });
}
