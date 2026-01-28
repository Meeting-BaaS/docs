import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Mermaid } from '@/components/mdx/mermaid';
import { Children, isValidElement, type ReactNode } from 'react';

// Helper function to extract text content from React children
function extractText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') return child;
      if (isValidElement(child)) {
        const props = child.props as { children?: ReactNode };
        if (props.children) {
          return extractText(props.children);
        }
      }
      return '';
    })
    .join('');
}

// Custom pre component that handles mermaid code blocks
function Pre({ children, ...props }: React.ComponentProps<'pre'>) {
  // Check if this is a mermaid code block
  if (isValidElement(children)) {
    const childProps = children.props as { className?: string; children?: ReactNode };
    const className = childProps.className || '';

    if (className.includes('language-mermaid')) {
      // Extract the mermaid definition text
      const chart = extractText(childProps.children);
      return <Mermaid chart={chart} />;
    }
  }

  // Otherwise use fumadocs default pre rendering (with syntax highlighting)
  const DefaultPre = defaultMdxComponents.pre;
  if (DefaultPre) {
    return <DefaultPre {...props}>{children}</DefaultPre>;
  }
  return <pre {...props}>{children}</pre>;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    pre: Pre,
    Mermaid, // Export Mermaid so it can be used directly in MDX
    ...components,
  };
}
