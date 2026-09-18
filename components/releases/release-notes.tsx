import { createCompiler } from '@fumadocs/mdx-remote';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { TableOfContents } from 'fumadocs-core/toc';
import type { ReactNode } from 'react';

/**
 * Release notes are plain GitHub markdown, so they are compiled with
 * `format: 'md'`: no JSX, no `{expressions}`, no ESM — a stray `<` or `{` in a
 * note can never break the page. Raw HTML is dropped by the markdown parser.
 */
const compiler = createCompiler({
  preset: 'fumadocs',
  format: 'md',
  rehypeCodeOptions: {
    lazy: true,
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
  },
});

export async function renderReleaseNotes(
  markdown: string,
): Promise<{ content: ReactNode; toc: TableOfContents }> {
  if (!markdown.trim()) {
    return {
      content: (
        <p className="text-fd-muted-foreground">
          No release notes were written for this version.
        </p>
      ),
      toc: [],
    };
  }
  const { body: Body, toc } = await compiler.compile({ source: markdown });
  return {
    content: <Body components={defaultMdxComponents} />,
    toc,
  };
}
