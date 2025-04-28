import { Accordion, Accordions } from '@/components/fumadocs/accordion';
import { Callout } from '@/components/fumadocs/callout';
import { ServiceCard, ServicesCompact, ServicesList } from '@/components/fumadocs/services-list';
import { Tabs as CustomTabs, Tab } from '@/components/fumadocs/tabs';
import { ServiceIcon } from '@/components/ui/service-icon';
import { Banner } from 'fumadocs-ui/components/banner';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import {
    Braces,
    Brain,
    BrainCircuit,
    Calendar,
    Code,
    FileCode,
    GitBranch,
    MonitorUp,
    Server,
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
        ServicesList,
        ServicesCompact,
        ServiceCard,
        ServiceIcon,

        // Icons
        Server,
        Braces,
        BrainCircuit,
        Brain,
        MonitorUp,
        FileCode,
        Code,
        TerminalSquare,
        Webhook,
        Calendar,
        User,
        GitBranch
    };
} 