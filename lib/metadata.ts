import type { Metadata } from 'next/types';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://docs.meetingbaas.com',
      images: '/banner.png',
      siteName: 'Meeting BaaS',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@Meeting_BaaS',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/banner.png',
      ...override.twitter,
    },
  };
}

const productionUrl = 'https://docs.meetingbaas.com';

/**
 * Absolute origin used for `metadataBase` (OG images, canonical links) and the
 * sitemap.
 *
 * `VERCEL_URL` is the per-deployment host (`meetingbaas-docs-<hash>.vercel.app`),
 * even for production builds, so it must never be used as the canonical origin:
 * the sitemap was advertising a preview host to crawlers. Production resolves to
 * the real domain; preview deployments keep their own host so OG links resolve
 * while reviewing a PR.
 */
function resolveBaseUrl(): URL {
  if (process.env.NODE_ENV === 'development') {
    return new URL('http://localhost:3000');
  }
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL(productionUrl);
}

export const baseUrl = resolveBaseUrl();
