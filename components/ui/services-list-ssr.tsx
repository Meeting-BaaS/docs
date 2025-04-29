import {
    Bot,
    Captions,
    GitBranch,
    ServerCog,
    Settings,
    Webhook,
    type LucideIcon
} from 'lucide-react';
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

// Static color mapping for icons (no client-side dark mode detection)
const serviceColorMap: Record<string, string> = {
    'api': '#3b82f6', // blue-500
    'speaking-bots': '#8b5cf6', // purple-500
    'sdk': '#22c55e', // green-500
    'mcp-servers': '#f97316', // orange-500
    'transcript-seeker': '#14b8a6', // teal-500
    'git': '#6b7280', // gray-500
};

// Map service keys to their respective icons
const serviceIconMap: Record<string, LucideIcon> = {
    'api': Webhook,
    'speaking-bots': Bot,
    'sdk': Settings,
    'mcp-servers': ServerCog,
    'transcript-seeker': Captions,
    'git': GitBranch,
};

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

// SSR-friendly version of ServiceIcon without client-side mode detection
function StaticServiceIcon({
    serviceKey,
    size = 16,
    className,
    ...props
}: {
    serviceKey: string;
    size?: number;
    className?: string;
}) {
    // Get the icon component for this service
    const IconComponent = serviceIconMap[serviceKey] ?? GitBranch;

    // Get static color for this service
    const color = serviceColorMap[serviceKey] ?? serviceColorMap.git;

    // Simple static style that works in SSR
    const staticStyle = {
        color,
        stroke: color,
        fill: 'none',
        strokeWidth: 2,
        backgroundColor: `${color}30`, // 30 = ~18% opacity
        borderRadius: '6px',
        padding: '4px',
    };

    return (
        <IconComponent
            className={className}
            size={size}
            style={staticStyle}
            {...props}
        />
    );
}

interface ServiceCardProps {
    service: Service;
    className?: string;
}

export function ServiceCardSSR({ service, className }: ServiceCardProps) {
    return (
        <Link
            href={service.href}
            className={cn("bg-background hover:bg-accent/50 block rounded-lg border p-4 transition-colors", className)}
        >
            <div className="mb-2 flex items-center">
                <StaticServiceIcon serviceKey={service.serviceKey} size={24} className="mr-2" />
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

export function ServicesListSSR({
    className,
    services = SERVICES
}: ServicesListProps) {
    return (
        <div className={cn("not-prose grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
            {services.map((service) => (
                <ServiceCardSSR key={service.serviceKey} service={service} />
            ))}
        </div>
    );
}

export function ServicesCompactSSR({
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
                    <StaticServiceIcon serviceKey={service.serviceKey} size={16} />
                    <span>{service.name}</span>
                </Link>
            ))}
        </div>
    );
} 