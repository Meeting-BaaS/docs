import { cn } from '@/lib/cn';
import { AlertCircle, AlertTriangle, Check, Info } from 'lucide-react';
import { type ReactNode } from 'react';

type CalloutProps = {
    children: ReactNode;
    type?: 'info' | 'warn' | 'error' | 'success';
    icon?: ReactNode;
    className?: string;
};

const icons = {
    info: <Info className="h-5 w-5" />,
    warn: <AlertTriangle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    success: <Check className="h-5 w-5" />,
};

const styles = {
    info: 'bg-fd-primary/10 text-fd-primary border-fd-primary/20',
    warn: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
};

export function Callout({
    children,
    type = 'info',
    icon,
    className,
}: CalloutProps) {
    return (
        <div
            className={cn(
                'my-6 flex gap-2.5 rounded-lg border p-4',
                styles[type],
                className
            )}
        >
            <div className="mt-1 flex-shrink-0">{icon ?? icons[type]}</div>
            <div>{children}</div>
        </div>
    );
} 