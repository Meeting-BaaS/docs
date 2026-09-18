import Link from 'next/link';
import type { Metadata } from 'next';
import { Callout } from 'fumadocs-ui/components/callout';
import { ReleaseFrame, ReleasesUnavailable } from '@/components/releases/release-frame';
import { ReleaseList } from '@/components/releases/release-list';
import { createMetadata } from '@/lib/metadata';
import { fetchReleases, VERSIONING_URL } from '@/lib/releases';

// Rendered from the live GitHub Releases of the API repository; the data is
// re-read every RELEASES_REVALIDATE seconds, so there is no build step.
// Must be a literal: Next reads segment config statically. Keep in step with RELEASES_REVALIDATE.
export const revalidate = 300;

const description =
  'Every Meeting BaaS API v2 release, newest first, with breaking changes and deprecations called out.';

export const metadata: Metadata = createMetadata({
  title: 'Releases',
  description,
  openGraph: { url: '/api-v2/releases' },
});

export default async function ReleasesPage() {
  const result = await fetchReleases();
  if (result.status === 'error') {
    console.error(`[releases] ${result.message}`);
  }

  const latestBreaking =
    result.status === 'ok'
      ? result.releases.find((release) => release.breaking && !release.prerelease)
      : undefined;

  return (
    <ReleaseFrame title="Releases" description={description}>
      <p>
        Each entry links to the full notes for that version. Releases are read
        straight from the API&apos;s GitHub releases, so this page reflects a new
        version within minutes of it shipping. Read the{' '}
        <Link href={VERSIONING_URL}>versioning policy</Link> for what a version
        number means and how breaking changes are announced.
      </p>

      {latestBreaking && (
        <Callout type="warn" title="Most recent breaking change">
          <Link href={latestBreaking.href}>{latestBreaking.version}</Link> (
          {latestBreaking.dateLabel})
          {latestBreaking.headline ? ` — ${latestBreaking.headline}` : ''}
        </Callout>
      )}

      {result.status !== 'ok' ? (
        <ReleasesUnavailable />
      ) : result.releases.length === 0 ? (
        <Callout type="info" title="No releases published yet">
          Release notes appear here as soon as the first version is published.
        </Callout>
      ) : (
        <ReleaseList releases={result.releases} />
      )}
    </ReleaseFrame>
  );
}
