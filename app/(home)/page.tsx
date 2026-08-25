import { LogoMark, Mascot } from '@/components/brand';
import { Stagger } from '@/components/motion';
import { cn } from '@/lib/cn';
import {
  ArrowRight,
  BotIcon,
  CaptionsIcon,
  HardDriveIcon,
  Server,
  ServerCog,
  Settings,
  WebhookIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface Area {
  href: string;
  slug: string;
  title: string;
  body: string;
  icon: ReactNode;
}

const AREAS: Area[] = [
  {
    href: '/api-v2',
    slug: 'api-v2',
    title: 'Meeting BaaS API v2',
    body: 'The current API. Bots, recordings, transcripts and webhooks.',
    icon: <WebhookIcon />,
  },
  {
    href: '/api',
    slug: 'api',
    title: 'Meeting BaaS API',
    body: 'The v1 API reference and guides.',
    icon: <WebhookIcon />,
  },
  {
    href: '/typescript-sdk',
    slug: 'typescript-sdk',
    title: 'TypeScript SDK',
    body: 'A typed client, generated from the same spec the API serves.',
    icon: <Settings />,
  },
  {
    href: '/mcp-servers',
    slug: 'mcp-servers',
    title: 'MCP Servers',
    body: 'Give Claude, Cursor and other AI tools access to meeting data.',
    icon: <ServerCog />,
  },
  {
    href: '/speaking-bots',
    slug: 'speaking-bots',
    title: 'Speaking Bots',
    body: 'AI agents that talk back, powered by Pipecat.',
    icon: <BotIcon />,
  },
  {
    href: '/transcript-seeker',
    slug: 'transcript-seeker',
    title: 'Transcript Seeker',
    body: 'Open-source uploading, transcribing and search.',
    icon: <CaptionsIcon />,
  },
  {
    href: '/self-hosting',
    slug: 'self-hosting',
    title: 'Self Hosting',
    body: 'Run v2 on your own infrastructure.',
    icon: <Server />,
  },
  {
    href: '/bring-your-own-storage',
    slug: 'bring-your-own-storage',
    title: 'Bring Your Own Storage',
    body: 'Point recordings at a bucket you control.',
    icon: <HardDriveIcon />,
  },
];

const START_HERE = [
  {
    n: '01',
    href: '/api-v2/getting-started/getting-the-data',
    title: 'Send your first bot',
    body: 'One POST with a meeting URL and a webhook.',
  },
  {
    n: '02',
    href: '/api-v2/webhooks',
    title: 'Receive the data',
    body: 'Recording, transcript and participant timeline.',
  },
  {
    n: '03',
    href: '/api-v2/reference',
    title: 'Read the reference',
    body: 'Every endpoint, parameter and error code.',
  },
];

export default function DocsPage(): React.ReactElement {
  return (
    <main className="relative isolate flex flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bg-blueprint mask-fade-top absolute inset-0 h-[26rem]" />
        <div
          className="absolute inset-x-0 top-0 h-56"
          style={{
            background:
              'radial-gradient(55% 100% at 50% 0%, var(--blueprint-wash) 0%, transparent 70%)',
          }}
        />
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 pt-14 pb-12 sm:px-6 md:pt-16 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-2xl">
            <div className="doc-enter-1 flex items-center gap-2.5">
              <LogoMark className="size-5" />
              <p className="meta">Documentation</p>
            </div>

            <h1 className="doc-enter-2 text-gradient mt-5 text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance">
              Everything you need to put a bot in a meeting
            </h1>

            <p className="doc-enter-3 text-fd-muted-foreground mt-4 max-w-xl leading-relaxed text-pretty">
              One API across Zoom, Google Meet and Microsoft Teams.
            </p>

            {/* A docs-only affordance, so the page reads as documentation
                rather than as a second marketing hero. */}
            <p className="doc-enter-3 text-fd-muted-foreground mt-5 text-[13.5px]">
              Press{' '}
              <kbd className="border-hairline bg-fd-muted rounded border px-1.5 py-0.5 font-mono text-[11px]">
                &#8984;K
              </kbd>{' '}
              to search, or ask the AI anything about these docs.
            </p>
          </div>

          {/* Bass, the same mascot the marketing site uses. */}
          <div className="hidden justify-self-end lg:block">
            <Mascot className="w-[21rem] xl:w-[25rem]" />
          </div>
        </div>

        <Stagger className="border-hairline bg-hairline mt-10 grid gap-px overflow-hidden rounded-lg border md:grid-cols-3">
          {START_HERE.map((step) => (
            <Link
              key={step.n}
              href={step.href}
              className="group bg-fd-card hover:bg-fd-accent/50 relative isolate flex flex-col p-4 transition-colors duration-200"
            >
              <span
                aria-hidden="true"
                className="bg-fd-primary pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-center scale-y-0 transition-transform duration-200 ease-[var(--ease-docs)] group-hover:scale-y-100"
              />
              <span className="meta text-fd-primary">{step.n}</span>
              <span className="mt-2.5 flex items-center gap-1.5 text-[15px] font-medium tracking-tight">
                {step.title}
                <ArrowRight className="text-fd-muted-foreground size-3.5 opacity-0 transition-all duration-200 ease-[var(--ease-docs)] group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
              <span className="text-fd-muted-foreground mt-1 text-[13.5px] leading-relaxed">
                {step.body}
              </span>
            </Link>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <Stagger className="border-hairline bg-hairline grid grid-cols-1 gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className={cn(
                area.slug,
                'group bg-fd-card hover:bg-fd-accent/50 relative isolate flex flex-col p-4 transition-colors duration-200',
              )}
            >
              <span
                aria-hidden="true"
                className="bg-fd-primary pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-center scale-y-0 transition-transform duration-200 ease-[var(--ease-docs)] group-hover:scale-y-100"
              />
              <span className="flex items-center gap-2">
                <span className="text-fd-primary shrink-0 [&_svg]:size-4">
                  {area.icon}
                </span>
                <span className="text-[15px] font-medium tracking-tight">
                  {area.title}
                </span>
                <ArrowRight className="text-fd-muted-foreground size-3.5 shrink-0 opacity-0 transition-all duration-200 ease-[var(--ease-docs)] group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
              <span className="text-fd-muted-foreground mt-1.5 text-[13.5px] leading-relaxed">
                {area.body}
              </span>
            </Link>
          ))}
        </Stagger>
      </section>
    </main>
  );
}
