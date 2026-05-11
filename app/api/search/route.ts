import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

export const { GET } = createFromSource(source, {
  buildIndex: async (page) => {
    const { structuredData } = await page.data.load();
    return {
      id: page.url,
      url: page.url,
      title: page.data.title ?? page.slugs[page.slugs.length - 1],
      description: page.data.description,
      structuredData,
      tag: page.slugs[0],
    };
  },
});
