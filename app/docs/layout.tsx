import { baseOptions } from '@/app/layout.config';
import DocsGradient from '@/components/docs-gradient';
import { source } from '@/lib/source';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  sidebar: {
    tabs: {
      transform(option, node) {
        const meta = source.getNodeMeta(node);
        if (!meta) return option;

        // Each top-level content folder carries its own accent, defined as
        // --<folder>-color in globals.css.
        const dirname = meta.path.split('/')[0] ?? '';
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
