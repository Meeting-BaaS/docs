import Link from 'next/link';
import type { Metadata } from 'next';
import { Callout } from 'fumadocs-ui/components/callout';
import { ReleaseFrame, ReleasesUnavailable } from '@/components/releases/release-frame';
import { ReleaseList } from '@/components/releases/release-list';
import { createMetadata } from '@/lib/metadata';
import { SECTION_META } from '@/lib/release-sections';
import { fetchReleases, type Release, VERSIONING_URL } from '@/lib/releases';

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

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card/60 px-4 py-3">
      <p className="meta">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold text-fd-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-fd-muted-foreground">{sub}</p>}
    </div>
  );
}

function Overview({ releases }: { releases: Release[] }) {
  const stable = releases.filter((release) => !release.prerelease);
  const latest = stable[0] ?? releases[0];
  const latestBreaking = stable.find((release) => release.breaking);
  const thisYear = new Date().getUTCFullYear();
  const shippedThisYear = stable.filter(
    (release) => release.date && new Date(release.date).getUTCFullYear() === thisYear,
  ).length;

  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-3">
      <Stat
        label="Latest"
        value={<Link href={latest.href} className="hover:text-fd-primary">{latest.version}</Link>}
        sub={latest.dateLabel}
      />
      <Stat label={`Shipped in ${thisYear}`} value={shippedThisYear} sub={`${stable.length} releases in total`} />
      <Stat
        label="Last breaking change"
        value={
          latestBreaking ? (
            <Link href={latestBreaking.href} className="hover:text-fd-primary">
              {SECTION_META.breaking.emoji} {latestBreaking.version}
            </Link>
          ) : (
            '—'
          )
        }
        sub={latestBreaking ? latestBreaking.dateLabel : 'None so far'}
      />
    </div>
  );
}

export default async function ReleasesPage() {
  const result = await fetchReleases();
  if (result.status === 'error') {
    console.error(`[releases] ${result.message}`);
  }

  return (
    <ReleaseFrame title="Releases" description={description}>
      {result.status !== 'ok' ? (
        <ReleasesUnavailable />
      ) : result.releases.length === 0 ? (
        <Callout type="info" title="No releases published yet">
          Release notes appear here as soon as the first version is published.
        </Callout>
      ) : (
        <>
          <Overview releases={result.releases} />
          <p className="text-sm text-fd-muted-foreground">
            Read straight from the API&apos;s GitHub releases, so a new version shows
            up here within minutes of shipping. The{' '}
            <Link href={VERSIONING_URL}>versioning policy</Link> explains what a
            version number means and how {SECTION_META.breaking.emoji} breaking
            changes and {SECTION_META.deprecations.emoji} deprecations are announced.
          </p>
          <ReleaseList releases={result.releases} />
        </>
      )}
    </ReleaseFrame>
  );
}
