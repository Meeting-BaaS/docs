import { DocsPage, DocsPageProps } from 'fumadocs-ui/page';
import React, { ReactNode } from 'react';
import { ServicePageIcon } from '../ui/service-page-icon';

interface ServiceDocsPageProps extends Omit<DocsPageProps, 'children'> {
    page: {
        data: {
            service?: string;
            icon?: string;
            title?: string;
        };
    };
    children: ReactNode;
}

export function ServiceDocsPage({ page, children, ...props }: ServiceDocsPageProps) {
    // Instead of context, we'll modify the children to inject our icon
    let modifiedChildren = children;

    // If service is defined, we'll create our icon
    if (page.data.service) {
        const serviceIcon = <ServicePageIcon page={page} className="inline-block mr-2 h-6 w-6" />;

        // If the first child is the title, we'll add our icon to it
        if (Array.isArray(children) && children.length > 0) {
            const firstChild = children[0];
            if (firstChild && firstChild.type && firstChild.type.name === 'DocsTitle') {
                modifiedChildren = [
                    React.cloneElement(firstChild, {}, serviceIcon, firstChild.props.children),
                    ...children.slice(1)
                ];
            }
        }
    }

    return (
        <DocsPage {...props}>
            {modifiedChildren}
        </DocsPage>
    );
} 