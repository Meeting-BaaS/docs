'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import mermaid from 'mermaid';
import { Maximize2, X } from 'lucide-react';

interface MermaidProps {
  chart: string;
  className?: string;
}

export function Mermaid({ chart, className }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = resolvedTheme === 'dark';

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      themeVariables: isDark
        ? {
            // Dark theme
            primaryColor: '#00dbc6',
            primaryTextColor: '#0f172a',
            primaryBorderColor: '#00dbc6',
            lineColor: '#94a3b8',
            secondaryColor: '#1e293b',
            secondaryTextColor: '#f1f5f9',
            secondaryBorderColor: '#334155',
            tertiaryColor: '#1e293b',
            tertiaryTextColor: '#f1f5f9',
            tertiaryBorderColor: '#334155',
            background: '#0a0a0a',
            mainBkg: '#1e293b',
            nodeBorder: '#334155',
            clusterBkg: '#1e293b',
            clusterBorder: '#334155',
            titleColor: '#f1f5f9',
            edgeLabelBackground: '#1e293b',
            nodeTextColor: '#f1f5f9',
          }
        : {
            // Light theme
            primaryColor: '#00dbc6',
            primaryTextColor: '#1e293b',
            primaryBorderColor: '#00dbc6',
            lineColor: '#64748b',
            secondaryColor: '#f8fafc',
            secondaryTextColor: '#1e293b',
            secondaryBorderColor: '#e2e8f0',
            tertiaryColor: '#f8fafc',
            tertiaryTextColor: '#1e293b',
            tertiaryBorderColor: '#e2e8f0',
            background: '#ffffff',
            mainBkg: '#f8fafc',
            nodeBorder: '#e2e8f0',
            clusterBkg: '#f8fafc',
            clusterBorder: '#e2e8f0',
            titleColor: '#1e293b',
            edgeLabelBackground: '#ffffff',
            nodeTextColor: '#1e293b',
          },
      flowchart: {
        rankSpacing: 60,
        nodeSpacing: 40,
        curve: 'basis',
        padding: 15,
        htmlLabels: true,
        useMaxWidth: true,
      },
    });

    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        console.error('Mermaid render error:', err);
      }
    };

    renderChart();
  }, [chart, resolvedTheme]);

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        <p className="font-medium">Failed to render diagram</p>
        <pre className="mt-2 overflow-auto text-sm">{error}</pre>
      </div>
    );
  }

  const diagramContent = (
    <div
      className="[&_svg]:mx-auto [&_svg]:max-w-full [&_svg]:h-auto [&_.node_rect]:rx-2"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-fd-background/95 backdrop-blur-sm">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-fd-muted hover:bg-fd-accent transition-colors z-10"
          aria-label="Close fullscreen"
        >
          <X className="w-6 h-6" />
        </button>
        <div
          ref={containerRef}
          className="w-full h-full overflow-auto p-8 flex items-center justify-center [&_svg]:w-[90vw] [&_svg]:h-auto [&_svg]:max-h-[90vh]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    );
  }

  return (
    <div className={`group relative my-6 ${className || ''}`}>
      <button
        onClick={() => setIsFullscreen(true)}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-fd-muted/80 hover:bg-fd-accent opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="View fullscreen"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
      <div ref={containerRef} className="overflow-x-auto">
        {diagramContent}
      </div>
    </div>
  );
}
