'use client';

import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import AISearch from '@/components/fumadocs/ai/search';

// Adapter so the AI docs-search dialog can be used as Fumadocs' cmd+K
// SearchDialog (which passes SharedProps, not Radix DialogProps).
export default function SearchAIDialog({ open, onOpenChange }: SharedProps) {
  return <AISearch open={open} onOpenChange={onOpenChange} />;
}
