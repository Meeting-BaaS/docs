'use client';

import {
    Bot,
    Captions,
    GitBranch,
    ServerCog,
    Settings,
    Webhook,
    type LucideIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ColoredIcon } from './colored-icon';

// Define service colors - using direct color values for better overrides
const serviceColors: Record<string, { light: string, dark: string }> = {
    'api': { light: '#3b82f6', dark: '#60a5fa' }, // blue-500/400
    'speaking-bots': { light: '#8b5cf6', dark: '#a78bfa' }, // purple-500/400
    'sdk': { light: '#22c55e', dark: '#4ade80' }, // green-500/400
    'mcp-servers': { light: '#f97316', dark: '#fb923c' }, // orange-500/400
    'transcript-seeker': { light: '#14b8a6', dark: '#2dd4bf' }, // teal-500/400
    'git': { light: '#6b7280', dark: '#9ca3af' }, // gray-500/400
    // Add more services as needed
};

// Map service keys to their respective icons
const serviceIcons: Record<string, LucideIcon> = {
    'api': Webhook,
    'speaking-bots': Bot,
    'sdk': Settings,
    'mcp-servers': ServerCog,
    'transcript-seeker': Captions,
    'git': GitBranch,
    // Add more icons as needed
};

export interface ServiceIconProps {
    serviceKey: string;
    className?: string;
    size?: number;
}

// Create a static version of ServiceIcon for server-side rendering (SSR)
// This will be exported as default for mdx-components to use
export function StaticServiceIcon({
    serviceKey,
    className,
    size = 16,
    ...props
}: ServiceIconProps & Omit<React.SVGProps<SVGSVGElement>, 'size'>) {
    // Get the icon component for this service
    const IconComponent = serviceIcons[serviceKey] ?? GitBranch;

    // Get the default light color for this service (for SSR)
    const defaultColor = serviceColors[serviceKey]?.light ?? serviceColors.git.light;

    // Create a stronger static style object for SSR with !important flags
    const staticStyle = {
        color: `${defaultColor} !important`,
        stroke: `${defaultColor} !important`,
        fill: 'none !important',
        strokeWidth: 2,
        backgroundColor: `${defaultColor}30 !important`, // 30 = ~18% opacity
        borderRadius: '6px',
        padding: '4px',
        boxShadow: `0 0 4px ${defaultColor}60 !important`
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

// The client-side version with dynamic dark mode detection
export function ServiceIcon({
    serviceKey,
    className,
    size = 16,
    ...props
}: ServiceIconProps & Omit<React.SVGProps<SVGSVGElement>, 'size'>) {
    // Get the icon component for this service
    const IconComponent = serviceIcons[serviceKey] ?? GitBranch;

    // Get the colors for this service
    const colors = serviceColors[serviceKey] ?? serviceColors.git;

    // State for dark mode - initialized false but updated in useEffect
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Effect to detect and update color scheme
    useEffect(() => {
        // Check if window exists (client-side only)
        if (typeof window !== 'undefined') {
            // Set initial value
            setIsDarkMode(
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
            );

            // Listen for changes
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                setIsDarkMode(e.matches);
            };

            // Add listener
            darkModeMediaQuery.addEventListener('change', handleChange);

            // Clean up
            return () => {
                darkModeMediaQuery.removeEventListener('change', handleChange);
            };
        }
    }, []);

    // Select the appropriate color based on mode
    const color = isDarkMode ? colors.dark : colors.light;

    // Then use ColoredIcon for rendering with any additional styling needed
    return (
        <ColoredIcon
            serviceKey={serviceKey}
            className={className}
            size={size}
            style={{
                backgroundColor: `${color}30 !important`,
                borderRadius: '6px',
                padding: '4px',
                boxShadow: `0 0 4px ${color}60 !important`,
                border: `1px solid ${color}40 !important`
            }}
            {...props}
        />
    );
}

// Set the default export to the static version for MDX compatibility
export default StaticServiceIcon;

// Specific service icon components for convenience
export function ApiIcon(props: Omit<ServiceIconProps, 'serviceKey'>) {
    return <ServiceIcon serviceKey="api" {...props} />;
}

export function SpeakingBotIcon(props: Omit<ServiceIconProps, 'serviceKey'>) {
    return <ServiceIcon serviceKey="speaking-bots" {...props} />;
}

export function SdkIcon(props: Omit<ServiceIconProps, 'serviceKey'>) {
    return <ServiceIcon serviceKey="sdk" {...props} />;
}

export function McpServerIcon(props: Omit<ServiceIconProps, 'serviceKey'>) {
    return <ServiceIcon serviceKey="mcp-servers" {...props} />;
}

export function TranscriptSeekerIcon(props: Omit<ServiceIconProps, 'serviceKey'>) {
    return <ServiceIcon serviceKey="transcript-seeker" {...props} />;
}

export function GitIcon(props: Omit<ServiceIconProps, 'serviceKey'>) {
    return <ServiceIcon serviceKey="git" {...props} />;
} 