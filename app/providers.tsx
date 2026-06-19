'use client';
import { RootProvider } from 'fumadocs-ui/provider/next';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

// cmd+K opens the AI docs search — it answers from our own docs via the
// in-process docs tools (app/api/chat → lib/llms). Replaces Orama Cloud.
const SearchDialog = dynamic(() => import('@/components/search-ai'));

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
      theme={{
        defaultTheme: 'dark',
      }}
    >
      {children}
    </RootProvider>
  );
}
