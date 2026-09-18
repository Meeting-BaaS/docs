import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Callout } from 'fumadocs-ui/components/callout';
import { ReleaseFrame } from '@/components/releases/release-frame';
import { ReleaseBadges } from '@/components/releases/release-list';
import { renderReleaseNotes } from '@/components/releases/release-notes';
import { createMetadata } from '@/lib/metadata';
import {
  fetchReleases,
  headingAnchor,
  neighbours,
  RELEASES_URL,
  VERSIONING_URL,
} from '@/lib/releases';

// Must be a literal: Next reads segment config statically. Keep in step with RELEASES_REVALIDATE.
export const revalidate = 300;

type Params = { params: Promise<{ version: string }> };

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

  return (
    <ReleaseFrame
      title={release.version}
      description={release.headline}
      meta={
        <>
          <span className="text-fd-muted-foreground/50">/</span>
          <span>Released {release.dateLabel}</span>
        </>
      }
      toc={toc}
    >
      <div className="not-prose -mt-4 mb-6 flex flex-wrap items-center gap-2 empty:hidden">
        <ReleaseBadges release={release} />
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

      <hr />
      <p className="text-sm">
        {newer && (
          <>
            Newer: <Link href={newer.href}>{newer.version}</Link> ·{' '}
          </>
        )}
        {older && (
          <>
            Older: <Link href={older.href}>{older.version}</Link> ·{' '}
          </>
        )}
        <Link href={RELEASES_URL}>All releases</Link>
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
