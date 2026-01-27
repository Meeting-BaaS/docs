import { Accordion, Accordions } from '@/components/fumadocs/accordion';
import { Callout } from '@/components/fumadocs/callout';
import { Tabs as CustomTabs, Tab } from '@/components/fumadocs/tabs';
import { Mermaid } from '@/components/mdx/mermaid';
import { ServiceIcon } from '@/components/ui/service-icon';
import { ServiceCardSSR, ServicesCompactSSR, ServicesListSSR } from '@/components/ui/services-list-ssr';
import { createGenerator } from 'fumadocs-typescript';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { Banner } from 'fumadocs-ui/components/banner';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import {
    Bot,
    Braces,
    Brain,
    BrainCircuit,
    Calendar,
    Captions,
    ChevronRight,
    Code,
    FileCode,
    GitBranch,
    MonitorUp,
    Server,
    ServerCog,
    Settings,
    TerminalSquare,
    User,
    Webhook
} from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import { Children, isValidElement, type ReactNode } from 'react';

// Create TypeScript generator for AutoTypeTable
const generator = createGenerator();

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

    // Otherwise use default pre rendering
    return <pre {...props}>{children}</pre>;
}

// Create a safer way to handle icon components
const safeIconComponents = {
    Bot,
    Server,
    Braces,
    BrainCircuit,
    Brain,
    Captions,
    ChevronRight,
    MonitorUp,
    FileCode,
    Code,
    ServerCog,
    Settings,
    TerminalSquare,
    Webhook,
    Calendar,
    User,
    GitBranch
};

// Export components for MDX
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        // Override pre to handle mermaid diagrams
        pre: Pre,

        // Basic components
        Tabs: CustomTabs,
        Tab: Tab,
        Steps: Steps,
        Step: Step,
        Callout: Callout,
        Card: Card,
        Cards: Cards,
        Banner: Banner,
        Accordion: Accordion,
        Accordions: Accordions,
        Files: Files,
        File: File,
        Folder: Folder,

        // Advanced components
        DynamicCodeBlock,
        InlineTOC,
        TypeTable,
        ImageZoom,
        AutoTypeTable: (props) => <AutoTypeTable {...props} generator={generator} />,
        Mermaid,

        // Our custom service components
        ServicesList: ServicesListSSR,
        ServicesCompact: ServicesCompactSSR,
        ServiceCard: ServiceCardSSR,
        ServiceIcon,

        // Icons - explicitly mapped to prevent passing objects directly
        ...Object.fromEntries(
            Object.entries(safeIconComponents).map(([name, Component]) => [
                name,
                (props: any) => <Component {...props} />
            ])
        )
    };
} 