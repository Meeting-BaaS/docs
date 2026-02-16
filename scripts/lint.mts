import fg from 'fast-glob';
import { printErrors, scanURLs, validateFiles } from 'next-validate-link';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';
import { getTableOfContents } from 'fumadocs-core/content/toc';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { remarkInclude } from 'fumadocs-mdx/config';
import remarkMdx from 'remark-mdx';

async function readFromPath(file: string) {
  const content = await fs
    .readFile(path.resolve(file))
    .then((res) => res.toString());
  const parsed = matter(content);

  return {
    path: file,
    data: parsed.data,
    content: parsed.content,
  };
}

async function checkLinks() {
  const docsFiles = await Promise.all(
    await fg('content/docs/**/*.mdx').then((files) => files.map(readFromPath)),
  );

  const docs = docsFiles.map(async (file) => {
    const relativePath = path.relative('content/docs', file.path);

    return {
      value: getSlugs(relativePath),
      hashes: (
        await getTableOfContents(
          {
            path: file.path,
            value: file.content,
          },
          [remarkMdx, remarkInclude],
        )
      ).map((item) => item.url.slice(1)),
    };
  });

  const scanned = await scanURLs({
    populate: {
      'docs/[[...slug]]': await Promise.all(docs),
    },
  });

  console.log(
    `collected ${scanned.urls.size} URLs, ${scanned.fallbackUrls.length} fallbacks`,
  );

  const getUrl = createGetUrl('/docs');
  printErrors(
    await validateFiles([...docsFiles], {
      scanned,

      pathToUrl(value) {
        const relativePath = path.relative('content/docs', value);
        return getUrl(getSlugs(relativePath));
      },
    }),
    true,
  );
}

void checkLinks();
