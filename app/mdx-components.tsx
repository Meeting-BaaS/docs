import { Callout } from '@/components/fumadocs/callout';
import { Tabs as CustomTabs, Tab } from '@/components/fumadocs/tabs';
import { Banner } from 'fumadocs-ui/components/banner';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import {
    Braces,
    Brain,
    BrainCircuit,
    Calendar,
    Code,
    FileCode,
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
        User
    };
} 