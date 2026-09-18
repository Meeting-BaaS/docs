/**
 * Live view of the API's GitHub Releases.
 *
 * The docs read `https://api.github.com/repos/<owner>/<repo>/releases` at
 * request time (revalidated every few minutes, see `RELEASES_REVALIDATE`), so
 * publishing or editing a release on GitHub is all it takes to update
 * `/api-v2/releases`. The source repo is private, so a token with
 * read access to it must be present as `GITHUB_RELEASES_TOKEN`; when GitHub
 * cannot be read the pages render an "unavailable" state instead of failing.
 */

export const RELEASES_REPO =
  process.env.RELEASES_GITHUB_REPO ?? 'Meeting-BaaS/meeting-baas-v2';
export const RELEASES_REVALIDATE = 300; // seconds
const GITHUB_API_URL = process.env.GITHUB_API_URL ?? 'https://api.github.com';
export { RELEASES_URL, VERSIONING_URL } from './release-urls';
import { RELEASES_URL } from './release-urls';

const SOURCE_REPO_URL = `https://github.com/${RELEASES_REPO}`;

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
};

export type Release = {
  version: string;
  slug: string;
  href: string;
  date: string | null;
  dateLabel: string;
  /** The part of the release title after the version, if any. */
  headline: string | null;
  /** First paragraph of the notes, markdown stripped, for the timeline. */
  summary: string;
  breaking: boolean;
  deprecations: boolean;
  prerelease: boolean;
  /** Notes as markdown, cleaned of private-repo links and empty sections. */
  body: string;
};

export type ReleasesResult =
  | { status: 'ok'; releases: Release[] }
  | { status: 'error'; message: string };

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

export async function fetchReleases(): Promise<ReleasesResult> {
  const token = process.env.GITHUB_RELEASES_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const releases: GitHubRelease[] = [];
  try {
    // The API pages at 100; walk `page` until a short page comes back.
    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `${GITHUB_API_URL}/repos/${RELEASES_REPO}/releases?per_page=100&page=${page}`,
        {
          headers,
          next: { revalidate: RELEASES_REVALIDATE, tags: ['releases'] },
        },
      );
      if (!response.ok) {
        const hint =
          !token && (response.status === 404 || response.status === 401)
            ? ' (is GITHUB_RELEASES_TOKEN set?)'
            : '';
        return {
          status: 'error',
          message: `GitHub responded ${response.status} for ${RELEASES_REPO}${hint}`,
        };
      }
      const batch = (await response.json()) as GitHubRelease[];
      releases.push(...batch);
      if (batch.length < 100) break;
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
    };
  }

  const seen = new Set<string>();
  const cleaned = releases
    .filter((release) => !release.draft && typeof release.tag_name === 'string')
    .sort(compareReleases)
    .map(toRelease)
    .filter((release) => {
      if (seen.has(release.slug)) return false;
      seen.add(release.slug);
      return true;
    });

  return { status: 'ok', releases: cleaned };
}

export async function getRelease(slug: string): Promise<Release | null> {
  const result = await fetchReleases();
  if (result.status !== 'ok') return null;
  return result.releases.find((release) => release.slug === slug) ?? null;
}

export function neighbours(
  releases: Release[],
  slug: string,
): { newer?: Release; older?: Release } {
  const index = releases.findIndex((release) => release.slug === slug);
  if (index === -1) return {};
  return { newer: releases[index - 1], older: releases[index + 1] };
}

// ---------------------------------------------------------------------------
// Versions
// ---------------------------------------------------------------------------

type ParsedVersion = { nums: number[]; pre: string | null };

function parseVersion(tag: string): ParsedVersion | null {
  const match = /^v?(\d+(?:\.\d+)*)(?:-([0-9A-Za-z.-]+))?$/.exec(tag.trim());
  if (!match) return null;
  return { nums: match[1].split('.').map(Number), pre: match[2] ?? null };
}

/** Newest first; semver-ish tags before anything else; final before pre-release. */
function compareReleases(a: GitHubRelease, b: GitHubRelease): number {
  const va = parseVersion(a.tag_name);
  const vb = parseVersion(b.tag_name);
  if (va && vb) {
    const len = Math.max(va.nums.length, vb.nums.length);
    for (let i = 0; i < len; i++) {
      const diff = (vb.nums[i] ?? 0) - (va.nums[i] ?? 0);
      if (diff !== 0) return diff;
    }
    if (va.pre && !vb.pre) return 1;
    if (!va.pre && vb.pre) return -1;
    return (vb.pre ?? '').localeCompare(va.pre ?? '');
  }
  if (va) return -1;
  if (vb) return 1;
  return (b.published_at ?? '').localeCompare(a.published_at ?? '');
}

export function slugForVersion(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Unreleased';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unreleased';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Releases are titled "v2.6.8 — Speaker mapping fixes, …". The part after the
 * version is the headline; a title that is only the tag has none.
 */
function headlineFor(release: GitHubRelease): string | null {
  const name = (release.name ?? '').trim();
  if (!name) return null;
  const withoutTag = name
    .replace(new RegExp(`^${escapeRegExp(release.tag_name)}\\s*`), '')
    .replace(/^[-–—:|]+\s*/, '')
    .trim();
  return withoutTag || null;
}

// ---------------------------------------------------------------------------
// Markdown handling
// ---------------------------------------------------------------------------

const FENCE = /^(`{3,}|~{3,})/;

type Segment = { code: boolean; text: string };

/** Split markdown into fenced-code and plain segments so code is never rewritten. */
function splitFences(md: string): Segment[] {
  const segments: Segment[] = [];
  let buffer: string[] = [];
  let fence: string | null = null;

  const flush = (code: boolean) => {
    if (buffer.length === 0) return;
    segments.push({ code, text: buffer.join('\n') });
    buffer = [];
  };

  for (const line of md.split('\n')) {
    const match = FENCE.exec(line);
    if (fence === null && match) {
      flush(false);
      fence = match[1];
      buffer.push(line);
    } else if (
      fence !== null &&
      match &&
      match[1][0] === fence[0] &&
      match[1].length >= fence.length
    ) {
      buffer.push(line);
      flush(true);
      fence = null;
    } else {
      buffer.push(line);
    }
  }
  if (fence !== null) buffer.push(fence);
  flush(fence !== null);
  return segments;
}

function plainText(body: string): string {
  return splitFences(body)
    .filter((segment) => !segment.code)
    .map((segment) => segment.text)
    .join('\n');
}

const PRIVATE_URL = escapeRegExp(SOURCE_REPO_URL);

/** Strip the GitHub-generated bits that point at the private repository. */
function stripPrivateReferences(text: string): string {
  return text
    .replace(/^\**Full Changelog\**:.*$/gim, '')
    .replace(new RegExp(`\\s+by @[\\w-]+ in ${PRIVATE_URL}\\S*`, 'g'), '')
    .replace(new RegExp(`\\[([^\\]]+)\\]\\(${PRIVATE_URL}[^)]*\\)`, 'g'), '$1')
    .replace(new RegExp(`${PRIVATE_URL}/pull/(\\d+)`, 'g'), '#$1')
    .replace(new RegExp(`${PRIVATE_URL}\\S*`, 'g'), '');
}

const EMPTY_SECTION =
  /^(none|n\/a|nothing|no (breaking )?changes?|no deprecations?)[.!]?$/i;
const HEADING = /^(#{1,6})\s/;

function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`]+/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Lines of a section, markdown stripped, blank lines dropped. */
function sectionContent(lines: string[], start: number, end: number): string[] {
  return lines
    .slice(start, end)
    .map((line) => stripMarkdown(line.replace(/^[-*+]\s+|^\d+\.\s+/, '')))
    .filter(Boolean);
}

/** A section whose only line is "None." (or similar). */
function saysNone(content: string[]): boolean {
  return content.length === 1 && EMPTY_SECTION.test(content[0]);
}

/**
 * Remove sections that only say "None." so they do not clutter the page or its
 * TOC. A heading with nothing under it is kept: it usually groups sub-headings.
 */
function dropEmptySections(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!HEADING.test(lines[i])) {
      out.push(lines[i]);
      continue;
    }
    let end = i + 1;
    while (end < lines.length && !HEADING.test(lines[end])) end++;
    if (saysNone(sectionContent(lines, i + 1, end))) {
      i = end - 1;
      continue;
    }
    out.push(lines[i]);
  }
  return out.join('\n');
}

/** Shift headings so the smallest level used becomes `##` (the page title is the h1). */
function normaliseHeadings(segments: Segment[]): void {
  let min = Infinity;
  for (const segment of segments) {
    if (segment.code) continue;
    for (const match of segment.text.matchAll(/^(#{1,6})\s/gm)) {
      min = Math.min(min, match[1].length);
    }
  }
  if (!Number.isFinite(min) || min === 2) return;
  const shift = 2 - min;
  for (const segment of segments) {
    if (segment.code) continue;
    segment.text = segment.text.replace(
      /^(#{1,6})(\s)/gm,
      (_, hashes: string, space: string) =>
        '#'.repeat(Math.min(6, Math.max(1, hashes.length + shift))) + space,
    );
  }
}

function cleanBody(raw: string): string {
  const withoutComments = raw.replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '');
  const segments = splitFences(withoutComments);
  for (const segment of segments) {
    if (segment.code) continue;
    segment.text = dropEmptySections(stripPrivateReferences(segment.text));
  }
  normaliseHeadings(segments);
  return segments
    .map((segment) => segment.text)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * True when the notes have a section whose heading matches `pattern` and that
 * section says more than "None." — so notes can always carry the heading.
 */
function hasSection(body: string, pattern: RegExp): boolean {
  const lines = plainText(body).split('\n');
  const heading = new RegExp(`^#{1,6}\\s.*${pattern.source}`, 'i');
  const boldLead = new RegExp(`^\\s*[*_]{2}[^*_\\n]*${pattern.source}`, 'i');
  for (let i = 0; i < lines.length; i++) {
    if (boldLead.test(lines[i])) return true;
    if (!heading.test(lines[i])) continue;
    let end = i + 1;
    while (end < lines.length && !HEADING.test(lines[end])) end++;
    const content = sectionContent(lines, i + 1, end);
    return content.length > 0 && !saysNone(content);
  }
  return false;
}

/** Anchor of the first heading matching `pattern`, using the same slug rules as the rendered page. */
export function headingAnchor(body: string, pattern: RegExp): string | null {
  const match = new RegExp(`^#{1,6}\\s+(.*${pattern.source}.*)$`, 'im').exec(plainText(body));
  if (!match) return null;
  return match[1]
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function summaryFor(body: string, limit = 180): string {
  const paragraphs = plainText(body).split(/\n\s*\n/);
  for (const paragraph of paragraphs) {
    const lines = paragraph
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !HEADING.test(line));
    if (lines.length === 0) continue;
    const candidate = stripMarkdown(
      lines.map((line) => line.replace(/^[-*+]\s+|^\d+\.\s+/, '')).join(' '),
    );
    if (!candidate) continue;
    if (candidate.length <= limit) return candidate;
    const cut = candidate.slice(0, limit);
    return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), limit - 30)).trim()}…`;
  }
  return '';
}

function toRelease(release: GitHubRelease): Release {
  const slug = slugForVersion(release.tag_name);
  const body = cleanBody(release.body ?? '');
  return {
    version: release.tag_name,
    slug,
    href: `${RELEASES_URL}/${slug}`,
    date: release.published_at,
    dateLabel: formatDate(release.published_at),
    headline: headlineFor(release),
    summary: summaryFor(body),
    breaking: hasSection(body, /breaking/i),
    deprecations: hasSection(body, /deprecat/i),
    prerelease: Boolean(release.prerelease),
    body,
  };
}
