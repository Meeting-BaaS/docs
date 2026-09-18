/**
 * The sections a release note is written in (see the api-release-notes skill)
 * and how each is shown. Shared by the server-side parser and the UI, so it
 * must stay free of server-only imports.
 */
export type SectionKey =
  | 'breaking'
  | 'features'
  | 'improvements'
  | 'fixes'
  | 'deprecations'
  | 'other';

export type SectionMeta = {
  key: SectionKey;
  emoji: string;
  label: string;
  /** Tailwind classes for the chip on the timeline. */
  chip: string;
  /** Tailwind classes for the heading marker on a release page. */
  marker: string;
};

export const SECTION_META: Record<SectionKey, SectionMeta> = {
  breaking: {
    key: 'breaking',
    emoji: '💥',
    label: 'Breaking',
    chip: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
    marker: 'bg-red-500/10 ring-red-500/30',
  },
  features: {
    key: 'features',
    emoji: '✨',
    label: 'New',
    chip: 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary',
    marker: 'bg-fd-primary/10 ring-fd-primary/30',
  },
  improvements: {
    key: 'improvements',
    emoji: '⚡',
    label: 'Improved',
    chip: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    marker: 'bg-sky-500/10 ring-sky-500/30',
  },
  fixes: {
    key: 'fixes',
    emoji: '🐛',
    label: 'Fixed',
    chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    marker: 'bg-emerald-500/10 ring-emerald-500/30',
  },
  deprecations: {
    key: 'deprecations',
    emoji: '⚠️',
    label: 'Deprecated',
    chip: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    marker: 'bg-amber-500/10 ring-amber-500/30',
  },
  other: {
    key: 'other',
    emoji: '📝',
    label: 'Notes',
    chip: 'border-fd-border bg-fd-muted text-fd-muted-foreground',
    marker: 'bg-fd-muted ring-fd-border',
  },
};

/** Order sections are summarised in on the timeline. */
export const SECTION_ORDER: SectionKey[] = [
  'breaking',
  'features',
  'improvements',
  'fixes',
  'deprecations',
  'other',
];

/** Map a heading's text to a section, tolerating the usual variations. */
export function classifyHeading(text: string): SectionKey {
  const t = text.toLowerCase();
  if (/breaking/.test(t)) return 'breaking';
  if (/deprecat/.test(t)) return 'deprecations';
  if (/\b(new|feature|added|addition)/.test(t)) return 'features';
  if (/\b(improv|enhanc|chang|perform|updat)/.test(t)) return 'improvements';
  if (/\b(fix|bug)/.test(t)) return 'fixes';
  return 'other';
}
