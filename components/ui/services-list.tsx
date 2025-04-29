'use client';

import { ServiceIcon } from '@/components/ui/service-icon';
import Link from 'next/link';
import { cn } from '../../lib/fumadocs/cn';

export interface Service {
    name: string;
    icon: string;
    serviceKey: string;
    description?: string;
    href: string;
    additionalTags?: string[];
}

// Services configuration matching what's in constants.ts
export const SERVICES: Service[] = [
    {
        name: 'API',
        icon: 'Webhook',
        serviceKey: 'api',
        description: 'API changes and improvements',
        href: '/docs/updates#api-updates',
        additionalTags: ['api-reference'],
    },
    {
        name: 'TypeScript SDK',
        icon: 'Settings',
        serviceKey: 'sdk',
        description: 'SDK releases and updates',
        href: '/docs/updates#sdk-updates',
        additionalTags: ['sdk', 'typescript'],
    },
    {
        name: 'Speaking Bots',
        icon: 'Bot',
        serviceKey: 'speaking-bots',
        description: 'Speaking bot features',
        href: '/docs/updates#speaking-bots-updates',
        additionalTags: ['bots', 'persona'],
    },
    {
        name: 'MCP Servers',
        icon: 'ServerCog',
        serviceKey: 'mcp-servers',
        description: 'Model Context Protocol server changes',
        href: '/docs/updates#mcp-servers-updates',
        additionalTags: ['mcp', 'server'],
    },
    {
        name: 'Transcript Seeker',
        icon: 'Captions',
        serviceKey: 'transcript-seeker',
        description: 'Transcript platform improvements',
        href: '/docs/updates#transcript-seeker-updates',
        additionalTags: ['transcript', 'seeker'],
    },
];

interface ServiceCardProps {
    service: Service;
    className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
    return (
        <Link
            href={service.href}
            className={cn("bg-background hover:bg-accent/50 block rounded-lg border p-4 transition-colors", className)}
        >
            <div className="mb-2 flex items-center">
                <ServiceIcon serviceKey={service.serviceKey} size={24} className="mr-2" />
                <h3 className="text-lg font-medium">{service.name}</h3>
            </div>
            {service.description && (
                <p className="text-muted-foreground text-sm">{service.description}</p>
            )}
        </Link>
    );
}

interface ServicesListProps {
    className?: string;
    services?: Service[];
}

export function ServicesList({
    className,
    services = SERVICES
}: ServicesListProps) {
    return (
        <div className={cn("not-prose grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
            {services.map((service) => (
                <ServiceCard key={service.serviceKey} service={service} />
            ))}
        </div>
    );
}

export function ServicesCompact({
    className,
    services = SERVICES
}: ServicesListProps) {
    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {services.map((service) => (
                <Link
                    key={service.serviceKey}
                    href={service.href}
                    className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm hover:bg-accent"
                >
                    <ServiceIcon serviceKey={service.serviceKey} size={16} />
                    <span>{service.name}</span>
                </Link>
            ))}
        </div>
    );
} 