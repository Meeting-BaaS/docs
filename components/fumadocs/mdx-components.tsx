import { Banner } from 'fumadocs-ui/components/banner';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tabs } from 'fumadocs-ui/components/tabs';
import { StaticServiceIcon } from '../ui/service-icon';
import { ServicesListSSR } from '../ui/services-list-ssr';
import { Callout } from './callout';

// Export components for MDX
export const components = {
    // Basic components
    Tabs,
    Steps,
    Step,
    Callout,
    Card,
    Cards,
    Banner,
    ServicesListSSR,
    ServiceIcon: StaticServiceIcon // Use the static version for MDX compatibility
};

export default components; 