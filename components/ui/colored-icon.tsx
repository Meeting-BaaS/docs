'use client';

import {
    Bot,
    Captions,
    GitBranch,
    ServerCog,
    Settings,
    Webhook,
    type LucideIcon,
    type LucideProps
} from 'lucide-react';
import { cn } from '../../lib/fumadocs/cn';

// Define service colors
export const serviceColors: Record<string, string> = {
    'api': 'text-blue-500',
    'speaking-bots': 'text-purple-500',
    'sdk': 'text-green-500',
    'mcp-servers': 'text-orange-500',
    'transcript-seeker': 'text-teal-500',
    'git': 'text-gray-500',
};

// Map icon names to icon components
export const iconComponents: Record<string, LucideIcon> = {
    'Webhook': Webhook,
    'Bot': Bot,
    'ServerCog': ServerCog,
    'Settings': Settings,
    'Captions': Captions,
    'GitBranch': GitBranch
};

// Map service keys to icon names
export const serviceIcons: Record<string, string> = {
    'api': 'Webhook',
    'speaking-bots': 'Bot',
    'sdk': 'Settings',
    'mcp-servers': 'ServerCog',
    'transcript-seeker': 'Captions',
    'git': 'GitBranch',
};

export interface ColoredIconProps extends LucideProps {
    serviceKey?: string;
    iconName?: string;
    className?: string;
}

export function ColoredIcon({
    serviceKey,
    iconName,
    className,
    ...props
}: ColoredIconProps) {
    // Determine icon to use
    let iconToUse = iconName;
    if (!iconToUse && serviceKey) {
        iconToUse = serviceIcons[serviceKey];
    }

    // Get the color class for this service
    const colorClass = serviceKey ? serviceColors[serviceKey] ?? '' : '';

    // Find the icon component
    const IconComponent = iconToUse && iconComponents[iconToUse] ? iconComponents[iconToUse] : GitBranch;

    return (
        <IconComponent
            className={cn(colorClass, className)}
            {...props}
        />
    );
} 