import { Body } from '@/app/layout.client';
import { AISearchTrigger } from '@/components/fumadocs/ai';
import { baseUrl, createMetadata } from '@/lib/metadata';
import '@/styles/globals.css';
import { GeistMono } from 'geist/font/mono';
import { MessageCircle } from 'lucide-react';
import type { Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { Providers } from './providers';

// Sofia Sans, the Meeting BaaS brand face, bundled locally (OFL, from
// google/fonts) like frontend-v2 does, so the build needs no Google fetch.
// Variable TTF covers the 400-700 range the design uses.
const sofiaSans = localFont({
  src: './fonts/SofiaSans.ttf',
  display: 'swap',
  weight: '400 700',
  variable: '--font-sofia-sans',
});

export const metadata = createMetadata({
  title: {
    template: '%s | Meeting BaaS',
    default: 'Meeting BaaS',
  },
  description: 'Deploy AI for video meetings through a single unified API.',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sofiaSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <Body>
        <Providers>
          {/* <Banner id="meetingbaas-chat" variant="rainbow">
            <strong>MeetingBaas Chat is now available!</strong> &mdash; <a href="https://chat.meetingbaas.com" className="underline hover:text-blue-300">https://chat.meetingbaas.com</a>
          </Banner> */}
          {children}
          <AISearchTrigger>
            <MessageCircle className="size-4" />
            Ask AI
          </AISearchTrigger>
        </Providers>
      </Body>
    </html>
  );
}
