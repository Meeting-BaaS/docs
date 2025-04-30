import { DocsTitle } from 'fumadocs-ui/page';
import { ReactNode } from 'react';
import { ServicePageIcon } from '../ui/service-page-icon';

interface ServiceTitleProps {
    children: ReactNode;
    page?: {
        data: {
            service?: string;
        };
    };
}

export function ServiceTitle({ children, page }: ServiceTitleProps) {
    // If page and service are provided, create the icon directly
    const serviceIcon = page?.data?.service ? (
        <ServicePageIcon page={page} className="inline-block mr-2 h-6 w-6" />
    ) : null;

    return (
        <DocsTitle>
            {serviceIcon}
            {children}
        </DocsTitle>
    );
} 