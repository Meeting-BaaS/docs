import { Accordion, Accordions } from '@/components/fumadocs/accordion';
import { Callout } from '@/components/fumadocs/callout';
import { Tabs as CustomTabs, Tab } from '@/components/fumadocs/tabs';
import { ServiceIcon } from '@/components/ui/service-icon';
import { ServiceCardSSR, ServicesCompactSSR, ServicesListSSR } from '@/components/ui/services-list-ssr';
import { Banner } from 'fumadocs-ui/components/banner';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
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