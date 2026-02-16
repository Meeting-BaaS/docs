import { baseUrl } from '@/lib/metadata';
import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, baseUrl).toString();

  // Add base route
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: url('/'),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ];

  // Process pages with error handling
  const pages = source.getPages();
  for (const page of pages) {
    try {
      console.log(`Processing sitemap for: ${page.url}`);
      const loaded = await (page.data as any).load();
      const lastModified = loaded?.lastModified;
      sitemap.push({
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      });
    } catch (error) {
      console.error(`Error processing sitemap for ${page.url}:`, error);
      // Continue with other pages instead of failing completely
    }
  }

  return sitemap;
}
