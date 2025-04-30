import fs from 'fs';
import {
    Bot,
    Captions,
    GitBranch,
    ServerCog,
    Settings,
    Webhook,
    Zap,
    type LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import path from 'path';
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
    'production': '#f59e0b', // amber-500
};

// Map service keys to their respective icons
const serviceIconMap: Record<string, LucideIcon> = {
    'api': Webhook,
    'speaking-bots': Bot,
    'sdk': Settings,
    'mcp-servers': ServerCog,
    'transcript-seeker': Captions,
    'git': GitBranch,
    'production': Zap,
};

// Function to get the latest update file for each service
function getLatestUpdateUrls(): Record<string, string> {
    const updatesDir = path.join(process.cwd(), 'content', 'docs', 'updates');
    const result: Record<string, string> = {};

    try {
        // Check if the directory exists
        if (!fs.existsSync(updatesDir)) {
            return {};
        }

        // Read all files in the updates directory
        const files = fs.readdirSync(updatesDir)
            .filter(file => file.endsWith('.mdx') && file !== 'index.mdx' && file !== 'meta.json');

        // Group files by service
        const serviceFiles: Record<string, string[]> = {};

        files.forEach(file => {
            // Match service pattern in filename (service-YYYY-MM-DD.mdx)
            const match = file.match(/^([a-z-]+)-(\d{4}-\d{2}-\d{2})\.mdx$/);
            if (match) {
                const [_, service, date] = match;
                if (!serviceFiles[service]) {
                    serviceFiles[service] = [];
                }
                serviceFiles[service].push(file);
            }
        });

        // Sort files by date (newest first) and get the latest for each service
        for (const service in serviceFiles) {
            serviceFiles[service].sort((a, b) => {
                const dateA = a.match(/(\d{4}-\d{2}-\d{2})/)![1];
                const dateB = b.match(/(\d{4}-\d{2}-\d{2})/)![1];
                return dateB.localeCompare(dateA); // Newest first
            });

            // Get the latest file and create the URL
            const latestFile = serviceFiles[service][0];
            const fileBaseName = path.basename(latestFile, '.mdx');
            result[service] = `/docs/updates/${fileBaseName}`;
        }

        return result;
    } catch (error) {
        console.error('Error finding latest update files:', error);
        return {};
    }
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
        name: 'Production Updates',
        icon: 'Zap',
        serviceKey: 'production',
        description: 'API Internal Updates and Improvements',
        href: '/docs/updates#production-updates',
        additionalTags: ['production', 'release', 'open-source'],
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
    // Get the latest update URLs
    const latestUpdateUrls = getLatestUpdateUrls();

    // Update the services with the latest URLs
    const updatedServices = services.map(service => {
        // If we have a latest update URL for this service, use it
        if (latestUpdateUrls[service.serviceKey]) {
            return {
                ...service,
                href: latestUpdateUrls[service.serviceKey]
            };
        }
        // Otherwise, use the default URL
        return service;
    });

    return (
        <div className={cn("not-prose grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
            {updatedServices.map((service) => (
                <ServiceCardSSR key={service.serviceKey} service={service} />
            ))}
        </div>
    );
}

export function ServicesCompactSSR({
    className,
    services = SERVICES
}: ServicesListProps) {
    // Get the latest update URLs
    const latestUpdateUrls = getLatestUpdateUrls();

    // Update the services with the latest URLs
    const updatedServices = services.map(service => {
        // If we have a latest update URL for this service, use it
        if (latestUpdateUrls[service.serviceKey]) {
            return {
                ...service,
                href: latestUpdateUrls[service.serviceKey]
            };
        }
        // Otherwise, use the default URL
        return service;
    });

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {updatedServices.map((service) => (
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