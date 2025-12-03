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

        const color = `var(--${meta.file.dirname}-color, var(--color-fd-foreground))`;

        // Add Beta badge for api-v2 section
        const isApiV2 = meta?.file?.dirname === 'api-v2';
        const originalTitle = option.title;
        const title = isApiV2 ? (
          <span className="flex items-center gap-2">
            {originalTitle}
            <span className="text-xs font-medium text-fd-muted-foreground italic">(Beta)</span>
          </span>
        ) : originalTitle;

        return {
          ...option,
          title,
          icon: (
            <div
              className="rounded-md p-1 shadow-lg ring-2 [&_svg]:size-5"
              style={
                {
                  color,
                  border: `1px solid color-mix(in oklab, ${color} 50%, transparent)`,
                  '--tw-ring-color': `color-mix(in oklab, ${color} 20%, transparent)`,
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
