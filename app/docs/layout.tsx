import { baseOptions } from '@/app/layout.config';
import DocsGradient from '@/components/docs-gradient';
import { source } from '@/lib/source';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';

/** Sections that keep their pages but no longer earn a top-level tab. */
const HIDDEN_TABS = new Set(['transcript-seeker']);

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  sidebar: {
    tabs: {
      transform(option, node) {
        const meta = source.getNodeMeta(node);
        if (!meta) return option;

        // Tabs are auto-collected from every folder marked `root: true`, so
        // dropping a section from content/docs/meta.json does not hide it —
        // returning a falsy option here does. The content and its own sidebar
        // are untouched, so /transcript-seeker still works as a direct link.
        const dirname = meta.path.split('/')[0] ?? '';
        if (HIDDEN_TABS.has(dirname)) return null;

        // Each top-level content folder carries its own accent, defined as
        // --<folder>-color in globals.css.
        const color = `var(--${dirname}-color, var(--color-fd-foreground))`;

        return {
          ...option,
          icon: (
            <div
              className="rounded-lg border p-1 transition-colors duration-300 [&_svg]:size-5"
              style={
                {
                  color,
                  borderColor: `color-mix(in oklab, ${color} 30%, transparent)`,
                  backgroundColor: `color-mix(in oklab, ${color} 10%, transparent)`,
                } as object
              }
            >
              {node.icon}
            </div>
          ),
        };
      },
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...docsOptions}
      nav={{ ...docsOptions.nav, mode: 'top' }}
      tabMode="navbar"
    >
      <DocsGradient />
      {children}
    </DocsLayout>
  );
}
