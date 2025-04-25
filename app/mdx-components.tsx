import { Banner } from 'fumadocs-ui/components/banner';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tabs } from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';

// Export components for MDX
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        // Basic components
        Tabs: Tabs,
        Steps: Steps,
        Step: Step,
        Callout: Callout,
        Card: Card,
        Cards: Cards,
        Banner: Banner,
    };
} 