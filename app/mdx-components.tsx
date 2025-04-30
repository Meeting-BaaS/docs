import { Accordion, Accordions } from '@/components/fumadocs/accordion';
import { Callout } from '@/components/fumadocs/callout';
import { Tabs as CustomTabs, Tab } from '@/components/fumadocs/tabs';
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

// Create TypeScript generator for AutoTypeTable
const generator = createGenerator();

// Export components for MDX
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
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

        // Our custom service components
        ServicesList: ServicesListSSR,
        ServicesCompact: ServicesCompactSSR,
        ServiceCard: ServiceCardSSR,
        ServiceIcon,

        // Icons
        Bot,
        Server,
        Braces,
        BrainCircuit,
        Brain,
        Captions,
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
} 