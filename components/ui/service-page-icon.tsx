import { ServiceIcon } from './service-icon';

interface ServicePageIconProps {
    page: {
        data: {
            service?: string;
            icon?: string;
        };
    };
    className?: string;
}

export function ServicePageIcon({ page, className }: ServicePageIconProps) {
    // If the page has a service property, use the ServiceIcon component
    if (page.data.service) {
        return <ServiceIcon serviceKey={page.data.service} className={className} />;
    }

    // Otherwise, fallback to the standard icon handling
    return null;
} 