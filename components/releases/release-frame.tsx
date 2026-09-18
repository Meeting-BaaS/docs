import { Callout } from 'fumadocs-ui/components/callout';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import type { TableOfContents } from 'fumadocs-core/toc';
import type { ReactNode } from 'react';

/**
 * The same page chrome `app/docs/[[...slug]]/page.tsx` gives content pages,
 * for the release routes that are rendered from live GitHub data instead of
 * MDX files.
 */
export function ReleaseFrame({
  title,
  description,
  meta,
  toc = [],
  footer = true,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  toc?: TableOfContents;
  /** The previous/next cards fumadocs draws from the page tree; off for release pages, which bring their own. */
  footer?: boolean;
  children: ReactNode;
}) {
  return (
    <DocsPage
      toc={toc}
      tableOfContent={{ style: 'clerk', single: false }}
      footer={{ enabled: footer }}
    >
      <div className="api-v2 doc-enter-1 spine-accent mb-1">
        <p className="meta mb-2 flex items-center gap-2">
          <span>API v2</span>
          {meta}
        </p>
        <DocsTitle className="text-3xl tracking-[-0.025em]">{title}</DocsTitle>
      </div>
      {description && (
        <DocsDescription className="doc-enter-2 mb-8 text-[15px] leading-relaxed">
          {description}
        </DocsDescription>
      )}
      <DocsBody className="doc-enter-3">{children}</DocsBody>
    </DocsPage>
  );
}

/** Shown in place of the timeline when GitHub could not be read. */
export function ReleasesUnavailable() {
  return (
    <Callout type="warn" title="Release notes are temporarily unavailable">
      We could not reach GitHub to load the release notes. Please refresh the
      page in a few minutes.
    </Callout>
  );
}
