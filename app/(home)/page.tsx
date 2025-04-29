import { cn } from '@/lib/cn';
import { BotIcon, CaptionsIcon, MonitorUp, ServerCog, Settings, WebhookIcon } from 'lucide-react';
import type { LinkProps } from 'next/link';
import Link from 'next/link';

export default function DocsPage(): React.ReactElement {
  return (
    <main className="container flex flex-col py-16">
      <h1 className="text-2xl font-semibold md:text-3xl">
        Welcome to Meeting BaaS Documentation
      </h1>
      <p className="text-fd-muted-foreground mt-1 text-lg">
        Meeting Bots as a Service - Deploy AI bots to your video meetings
        through a unified API.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
        <Item href="/api">
          <Icon className="api">
            <WebhookIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Meeting BaaS API</h2>
          <p className="text-fd-muted-foreground text-sm">
            API Documentation and guides. Deploy AI bots to Zoom, Teams, and Google Meet meetings
          </p>
        </Item>


        <Item href="/updates">
          <Icon className="updates">
            <MonitorUp className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Updates</h2>
          <p className="text-fd-muted-foreground text-sm">
            Latest improvements, changes, and releases for all Meeting BaaS services
          </p>
        </Item>

        <Item href="/typescript-sdk">
          <Icon className="typescript-sdk">
            <Settings className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">TypeScript SDK</h2>
          <p className="text-fd-muted-foreground text-sm">
            Official TypeScript SDK for direct integration with the Meeting BaaS API
          </p>
        </Item>

        <Item href="/mcp-servers">
          <Icon className="mcp-servers">
            <ServerCog className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">MCP Servers</h2>
          <p className="text-fd-muted-foreground text-sm">
            Model Context Protocol servers for AI integration with Meeting BaaS services
          </p>
        </Item>

        <Item href="/speaking-bots">
          <Icon className="speaking-bots">
            <BotIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Speaking Bots</h2>
          <p className="text-fd-muted-foreground text-sm">
            AI-powered speaking agents for Google Meet, Microsoft Teams and Zoom, powered by Pipecat
          </p>
        </Item>

        <Item href="/transcript-seeker">
          <Icon className="transcript-seeker">
            <CaptionsIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Transcript Seeker</h2>
          <p className="text-fd-muted-foreground text-sm">
            Open-source platform for uploading, transcribing, and interacting with meeting recordings
          </p>
        </Item>
      </div>
    </main>
  );
}

function Icon({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      className={cn(
        'shadow-fd-primary/30 mb-2 size-9 rounded-lg border p-1.5',
        className,
      )}
      style={{
        boxShadow: 'inset 0px 8px 8px 0px var(--tw-shadow-color)',
      }}
    >
      {children}
    </div>
  );
}

function Item(
  props: LinkProps & { className?: string; children: React.ReactNode },
): React.ReactElement {
  return (
    <Link
      {...props}
      className={cn(
        'border-border hover:bg-fd-accent bg-fd-accent/30 rounded-lg border p-6 shadow-xs transition-all',
        props.className,
      )}
    >
      {props.children}
    </Link>
  );
}
