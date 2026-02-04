import type { InferPageType } from 'fumadocs-core/source';
import { source } from '@/lib/source';

type Page = InferPageType<typeof source>;

export const metadataImage = {
  withImage(slugs: string[], metadata: Record<string, unknown>) {
    return {
      ...metadata,
      openGraph: {
        ...((metadata.openGraph as Record<string, unknown>) ?? {}),
        images: `/og/${slugs.join('/')}/image.png`,
      },
    };
  },
  getImageMeta(slugs: string[]) {
    return {
      alt: 'Meeting BaaS Documentation',
      size: { width: 1200, height: 630 },
      contentType: 'image/png',
    };
  },
};
