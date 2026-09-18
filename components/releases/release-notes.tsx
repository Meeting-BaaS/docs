import { createCompiler } from '@fumadocs/mdx-remote';
import { Callout } from 'fumadocs-ui/components/callout';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { TableOfContents } from 'fumadocs-core/toc';
import type { MDXComponents } from 'mdx/types';
import { Children, isValidElement, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { classifyHeading, SECTION_META } from '@/lib/release-sections';

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

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return '';
    })
    .join('');
}

/** Section headings get their emoji marker; the anchor id from rehype is kept. */
function sectionHeading(level: 'h2' | 'h3') {
  const Default = defaultMdxComponents[level] ?? level;
  return function SectionHeading(props: ComponentProps<'h2'>) {
    const key = classifyHeading(textOf(props.children));
    if (key === 'other') return <Default {...props} />;
    const meta = SECTION_META[key];
    return (
      <Default {...props}>
        <span className="inline-flex items-center gap-3 align-middle">
          <span
            aria-hidden
            className={cn(
              'inline-flex shrink-0 items-center justify-center rounded-lg ring-1 ring-inset',
              level === 'h2' ? 'size-9 text-lg' : 'size-7 text-sm',
              meta.marker,
            )}
          >
            {meta.emoji}
          </span>
          <span>{props.children}</span>
        </span>
      </Default>
    );
  };
}

const components: MDXComponents = {
  ...defaultMdxComponents,
  h2: sectionHeading('h2'),
  h3: sectionHeading('h3'),
};

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
  try {
    const { body: Body, toc } = await compiler.compile({ source: markdown });
    return {
      content: <Body components={components} />,
      toc,
    };
  } catch (error) {
    // A mistyped fence language (```pyhton) makes the lazy Shiki loader reject
    // after the transformer has returned, so nothing downstream can recover it.
    // The notes matter more than their formatting: show the source instead of
    // failing the route.
    console.error('[releases] could not compile release notes', error);
    return {
      content: (
        <>
          <Callout type="warn" title="These notes could not be formatted">
            They are shown below exactly as they were written.
          </Callout>
          <pre className="whitespace-pre-wrap">
            <code>{markdown}</code>
          </pre>
        </>
      ),
      toc: [],
    };
  }
}
