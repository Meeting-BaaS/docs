import { baseOptions } from '@/app/layout.config';
import { LogoMark } from '@/components/brand';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <HomeLayout {...baseOptions}>
      {children}
      <Footer />
    </HomeLayout>
  );
}

function Footer(): React.ReactElement {
  return (
    <footer className="border-hairline bg-fd-card/40 relative mt-auto border-t">
      <div
        aria-hidden="true"
        className="via-fd-primary/40 pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-7" />
          <div>
            <p className="text-sm font-semibold tracking-tight">Meeting BaaS</p>
            <p className="text-fd-muted-foreground text-xs">
              Documentation ·{' '}
              <a
                href="https://meetingbaas.com/"
                rel="noreferrer noopener"
                target="_blank"
                className="hover:text-fd-primary underline-offset-4 hover:underline"
              >
                meetingbaas.com
              </a>
            </p>
          </div>
        </div>

        <nav className="text-fd-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a
            href="https://meetingbaas.com/pricing"
            className="hover:text-fd-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="https://github.com/Meeting-Baas"
            rel="noreferrer noopener"
            target="_blank"
            className="hover:text-fd-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://meetingbaas.com/company/contact"
            className="hover:text-fd-foreground transition-colors"
          >
            Contact
          </a>
          <span className="text-fd-muted-foreground/70">
            &copy; {new Date().getFullYear()} SAS SPOKE
          </span>
        </nav>
      </div>
    </footer>
  );
}
