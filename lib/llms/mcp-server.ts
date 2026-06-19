import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getCategoryContent } from './content';

// ---------------------------------------------------------------------------
// MeetingBaas documentation MCP — served in-process by the docs app itself.
//
// Ported from the standalone mcp-on-vercel-documentation server, but instead of
// fetching `https://docs.meetingbaas.com/llms/<category>` over HTTP, it reads
// the MDX straight off disk via getCategoryContent(). Same bundle format, so
// the index/page parsing below is unchanged.
//
// PUBLIC_DOCS is the browser-facing host used to build citable page links.
// ---------------------------------------------------------------------------
const DOCS_HOST = process.env.DOCS_HOST || 'docs.meetingbaas.com';
const PUBLIC_DOCS = `https://${DOCS_HOST}`;

// Source-path → public page URL. Tolerates an optional "./" prefix, so it works
// whether glob emits "./content/docs/..." or "content/docs/...".
const slugFromSource = (p: string) =>
  p
    .replace(/^\.?\/?content\/docs\//, '')
    .replace(/\.mdx$/, '')
    .replace(/\/index$/, '');
// The public docs serve pages at the root (the site 301-redirects /docs/* → /*),
// so cite the canonical URL without the /docs prefix.
const pageUrl = (slug: string) => `${PUBLIC_DOCS}/${slug}`;

const DOC_CATEGORIES = {
  ALL: 'all',
  API_V2: 'api-v2',
  API_V2_BOTS: 'api-v2/bots',
  API_V2_CALENDARS: 'api-v2/calendars',
  API_V2_WEBHOOKS: 'api-v2/webhooks',
  API_V2_CALLBACKS: 'api-v2/callbacks',
  API_V2_ZOOM_CREDENTIALS: 'api-v2/zoom-credentials',
  API_V1: 'api',
  CALENDARS: 'calendars',
  WEBHOOKS: 'webhooks',
  TRANSCRIPT_SEEKER: 'transcript-seeker',
  SPEAKING_BOTS: 'speaking-bots',
  TYPESCRIPT_SDK: 'typescript-sdk',
  MCP_SERVERS: 'mcp-servers',
  SELF_HOSTING: 'self-hosting',
  UPDATES: 'updates',
} as const;
export const ALL_CATEGORY_VALUES = Object.values(DOC_CATEGORIES) as [string, ...string[]];

// The v2 API sections, for the index and slug→section routing.
const V2_SECTIONS: { cat: string; tool: string; label: string }[] = [
  { cat: DOC_CATEGORIES.API_V2_BOTS, tool: 'getApiV2BotsDocs', label: 'Bots' },
  { cat: DOC_CATEGORIES.API_V2_CALENDARS, tool: 'getApiV2CalendarsDocs', label: 'Calendars' },
  { cat: DOC_CATEGORIES.API_V2_CALLBACKS, tool: 'getApiV2CallbacksDocs', label: 'Callbacks' },
  { cat: DOC_CATEGORIES.API_V2_WEBHOOKS, tool: 'getApiV2WebhooksDocs', label: 'Webhooks' },
  { cat: DOC_CATEGORIES.API_V2_ZOOM_CREDENTIALS, tool: 'getApiV2ZoomCredentialsDocs', label: 'Zoom Credentials' },
];

// In-process TTL cache. Disk reads are cheap, but parsing every section on each
// getApiDocs call adds up; cache the assembled bundle per category.
const CACHE_TTL_MS = Number(process.env.DOCS_CACHE_TTL_MS) || 12 * 60 * 1000;
type CacheEntry = { body: string; expires: number };
const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<string>>();

async function loadCategory(category: string): Promise<string> {
  const now = Date.now();
  const cached = cache.get(category);
  if (cached && cached.expires > now) return cached.body;

  const existing = inflight.get(category);
  if (existing) return existing;

  const work = (async () => {
    const body = await getCategoryContent(category);
    cache.set(category, { body, expires: Date.now() + CACHE_TTL_MS });
    return body;
  })().finally(() => inflight.delete(category));

  inflight.set(category, work);
  return work;
}

// Strip MDX/Fumadocs boilerplate and turn "### Source: ./content/docs/X.mdx"
// markers into citable public links.
function enrich(raw: string): string {
  return raw
    .replace(/\{\/\*[\s\S]*?\*\/\}\s*/g, '')
    .replace(
      /^### Source:\s*(\.?\/?content\/docs\/\S+\.mdx)\s*$/gm,
      (_m, p: string) => `**Source:** ${pageUrl(slugFromSource(p))}`,
    );
}

type DocPage = { slug: string; title: string; url: string; body: string };

// Split a section bundle into individual pages, anchored on "### Source:".
function parsePages(raw: string): DocPage[] {
  const lines = raw.split('\n');
  const srcIdx: number[] = [];
  lines.forEach((l, i) => {
    if (/^### Source:\s*\.?\/?content\/docs\/\S+\.mdx/.test(l)) srcIdx.push(i);
  });
  const titleAbove = (si: number): number => {
    let t = si - 1;
    while (t >= 0 && !/^##\s+/.test(lines[t])) t--;
    return t;
  };
  const pages: DocPage[] = [];
  for (let k = 0; k < srcIdx.length; k++) {
    const si = srcIdx[k];
    const p = (lines[si].match(/(\.?\/?content\/docs\/\S+\.mdx)/) || [])[1] || '';
    const slug = slugFromSource(p);
    const ti = titleAbove(si);
    const title = ti >= 0 ? lines[ti].replace(/^##\s+/, '').trim() : slug.split('/').pop() || slug;
    const endExclusive = k + 1 < srcIdx.length ? Math.max(titleAbove(srcIdx[k + 1]), si + 1) : lines.length;
    const bodyLines = lines.slice(si + 1, endExclusive);
    while (
      bodyLines.length &&
      (bodyLines[bodyLines.length - 1].trim() === '' || bodyLines[bodyLines.length - 1].trim() === '---')
    ) {
      bodyLines.pop();
    }
    pages.push({ slug, title, url: pageUrl(slug), body: enrich(bodyLines.join('\n')).trim() });
  }
  return pages;
}

const categoryForSlug = (slug: string): string | null => {
  const m = slug.match(/^api-v2\/reference\/([^/]+)(?:\/|$)/);
  return m ? `api-v2/${m[1]}` : null;
};

// --- Core doc operations (string in, string out). Shared by the MCP tools
// below and the in-process AI-SDK tools in ./ai-tools. ---

export async function getCategoryDoc(category: string): Promise<string> {
  try {
    return enrich(await loadCategory(category));
  } catch (error) {
    const stale = cache.get(category);
    if (stale) return enrich(stale.body);
    const msg = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`[docs-mcp] documentation error for '${category}':`, error);
    return `Error retrieving documentation for '${category}'. Error: ${msg}`;
  }
}

// Parse a category's pages, falling back to stale cache if a fresh load fails
// (mirrors getCategoryDoc). Throws only if there's no cached copy either.
async function pagesFor(category: string): Promise<DocPage[]> {
  try {
    return parsePages(await loadCategory(category));
  } catch (error) {
    const stale = cache.get(category);
    if (stale) return parsePages(stale.body);
    throw error;
  }
}

// Match a normalized slug to a page: exact match first, then a suffix match
// only if it's unambiguous (exactly one). Avoids returning the wrong page when
// a partial slug ends several pages.
function matchPage(pages: DocPage[], norm: string): DocPage | undefined {
  const exact = pages.find((p) => p.slug === norm);
  if (exact) return exact;
  const suffix = pages.filter((p) => p.slug.endsWith(norm));
  return suffix.length === 1 ? suffix[0] : undefined;
}

// reference-section → section tool, for the hint in the index.
const SECTION_TOOL: Record<string, string> = {
  bots: 'getApiV2BotsDocs',
  calendars: 'getApiV2CalendarsDocs',
  callbacks: 'getApiV2CallbacksDocs',
  webhooks: 'getApiV2WebhooksDocs',
  'zoom-credentials': 'getApiV2ZoomCredentialsDocs',
};

// Build a complete index of EVERY v2 page (loaded once from the api-v2 bundle),
// grouped into guides/concepts + each reference section — so nothing is
// invisible to the model. Fetch any line with getDocsPage({ slug }).
export async function buildApiIndex(): Promise<string> {
  const blocks: string[] = [
    '# MeetingBaas API v2 — Index (all pages)',
    'Fetch any page with getDocsPage({ slug }), or a whole section with getDocsByCategory({ category }).',
    '',
  ];

  let pages: DocPage[];
  try {
    pages = await pagesFor(DOC_CATEGORIES.API_V2);
  } catch {
    blocks.push('(index unavailable; call getApiV2FullDocs)');
    return blocks.join('\n');
  }

  // Group by section: api-v2/reference/<section>/… → <section>; everything else
  // (getting-started, batch-operations, streaming, …) → guides.
  const groups = new Map<string, DocPage[]>();
  for (const p of pages) {
    const m = p.slug.match(/^api-v2\/reference\/([^/]+)/);
    const key = m ? m[1] : 'guides';
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(p);
  }

  const emit = (heading: string, list: DocPage[]) => {
    if (!list.length) return;
    blocks.push(`## ${heading}`);
    for (const p of list) blocks.push(`- ${p.title} — ${p.url}  \`slug: ${p.slug}\``);
    blocks.push('');
  };

  // Guides first (how-to / conceptual), then reference sections (known order, then any others).
  emit('Guides & Concepts — fetch with `getDocsPage({ slug })`', groups.get('guides') ?? []);
  groups.delete('guides');

  const known = Object.keys(SECTION_TOOL).filter((k) => groups.has(k));
  const rest = [...groups.keys()].filter((k) => !(k in SECTION_TOOL)).sort();
  for (const sec of [...known, ...rest]) {
    const tool = SECTION_TOOL[sec];
    emit(`${sec} (reference)${tool ? ` — \`${tool}\`` : ''}`, groups.get(sec) ?? []);
  }

  return blocks.join('\n');
}

export async function getPageBySlug(slug: string): Promise<string> {
  const norm = slug.replace(/^\/?(docs\/)?/, '').replace(/\/$/, '').replace(/\.mdx$/, '');
  if (!norm) return 'No slug provided. Call getApiDocs to list valid slugs.';
  const cat = categoryForSlug(norm) || DOC_CATEGORIES.API_V2;
  try {
    let page = matchPage(await pagesFor(cat), norm);
    if (!page && cat !== DOC_CATEGORIES.API_V2) {
      page = matchPage(await pagesFor(DOC_CATEGORIES.API_V2), norm);
    }
    if (!page) return `No page found for slug '${norm}'. Call getApiDocs to list valid slugs.`;
    return `# ${page.title}\n\n**Source:** ${page.url}\n\n${page.body}`;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return `Error fetching page '${norm}': ${msg}`;
  }
}

export function listCategoriesText(): string {
  return `MeetingBaas Documentation (v2-first):

START HERE: getApiDocs → a small INDEX of the v2 API (sections + endpoints + links).
Then drill in with a section tool, or getDocsPage({ slug }) for ONE endpoint.

v2 section tools: ${V2_SECTIONS.map((s) => s.tool).join(', ')}
Full v2 dump (large, last resort): getApiV2FullDocs
Other: getTypeScriptSdkDocs, getMcpServersDocs, getSelfHostingDocs, getTranscriptSeekerDocs, getSpeakingBotsDocs, getUpdatesDocs
Legacy v1 (only if explicitly asked): getApiV1Docs
Everything in one bundle (very large): getAllDocs`;
}

const fetchDoc = (category: string) =>
  getCategoryDoc(category).then((text) => ({ content: [{ type: 'text' as const, text }] }));

export function registerDocsTools(server: McpServer): McpServer {
  server.tool(
    'listCategories',
    'List MeetingBaas documentation categories. The current API is v2 (api-v2); prefer it. Use getApiDocs for a small v2 index, then a section tool or getDocsPage for detail.',
    {},
    async () => ({ content: [{ type: 'text' as const, text: listCategoriesText() }] }),
  );

  server.tool(
    'getApiDocs',
    'Get an INDEX of the current MeetingBaas v2 API: sections and their endpoints with links — small and fast. Use this first, then call a section tool (e.g. getApiV2BotsDocs) or getDocsPage({ slug }) for the actual content. For the full v2 dump use getApiV2FullDocs (large).',
    {},
    async () => ({ content: [{ type: 'text' as const, text: await buildApiIndex() }] }),
  );

  server.tool(
    'getDocsPage',
    'Fetch a SINGLE documentation page by slug (cheapest option). Get slugs from getApiDocs. Example slug: api-v2/reference/bots/createBot.',
    { slug: z.string().describe("Page slug, e.g. 'api-v2/reference/bots/createBot' (as shown by getApiDocs)") },
    async ({ slug }: { slug: string }) => ({
      content: [{ type: 'text' as const, text: await getPageBySlug(slug) }],
    }),
  );

  server.tool('getApiV2BotsDocs', "Get v2 Bots API docs — create/list/manage bots, recording, chat. Start here for 'how do I send a bot?'.", {}, async () => fetchDoc(DOC_CATEGORIES.API_V2_BOTS));
  server.tool('getApiV2CalendarsDocs', 'Get v2 Calendars API docs — connections, events, calendar bots.', {}, async () => fetchDoc(DOC_CATEGORIES.API_V2_CALENDARS));
  server.tool('getApiV2WebhooksDocs', 'Get v2 Webhooks API docs.', {}, async () => fetchDoc(DOC_CATEGORIES.API_V2_WEBHOOKS));
  server.tool('getApiV2CallbacksDocs', 'Get v2 Callbacks API docs.', {}, async () => fetchDoc(DOC_CATEGORIES.API_V2_CALLBACKS));
  server.tool('getApiV2ZoomCredentialsDocs', 'Get v2 Zoom Credentials API docs.', {}, async () => fetchDoc(DOC_CATEGORIES.API_V2_ZOOM_CREDENTIALS));

  server.tool(
    'getApiV2FullDocs',
    'Get the ENTIRE v2 API reference in one bundle. Large (~90k tokens) — prefer getApiDocs (index) + section tools / getDocsPage. Use only when you truly need everything.',
    {},
    async () => fetchDoc(DOC_CATEGORIES.API_V2),
  );

  server.tool(
    'getApiV1Docs',
    'DEPRECATED: legacy v1 API documentation. Only if the user explicitly asks about v1; otherwise use getApiDocs (v2).',
    {},
    async () => fetchDoc(DOC_CATEGORIES.API_V1),
  );

  server.tool('getCalendarsDocs', 'Get Calendars documentation (v2 reference).', {}, async () => fetchDoc(DOC_CATEGORIES.CALENDARS));
  server.tool('getWebhooksDocs', 'Get Webhooks documentation (v2 reference).', {}, async () => fetchDoc(DOC_CATEGORIES.WEBHOOKS));
  server.tool('getTypeScriptSdkDocs', 'Get TypeScript SDK documentation.', {}, async () => fetchDoc(DOC_CATEGORIES.TYPESCRIPT_SDK));
  server.tool('getTranscriptSeekerDocs', 'Get Transcript Seeker documentation.', {}, async () => fetchDoc(DOC_CATEGORIES.TRANSCRIPT_SEEKER));
  server.tool('getSpeakingBotsDocs', 'Get Speaking Bots documentation.', {}, async () => fetchDoc(DOC_CATEGORIES.SPEAKING_BOTS));
  server.tool('getMcpServersDocs', 'Get MCP servers documentation.', {}, async () => fetchDoc(DOC_CATEGORIES.MCP_SERVERS));
  server.tool('getSelfHostingDocs', 'Get self-hosting documentation.', {}, async () => fetchDoc(DOC_CATEGORIES.SELF_HOSTING));
  server.tool('getUpdatesDocs', 'Get MeetingBaas product updates and changelog.', {}, async () => fetchDoc(DOC_CATEGORIES.UPDATES));

  server.tool(
    'getAllDocs',
    'Get ALL docs in one bundle. WARNING: ~200k tokens — almost never the right tool. Prefer getApiDocs + a section tool / getDocsPage.',
    {},
    async () => fetchDoc(DOC_CATEGORIES.ALL),
  );

  server.tool(
    'getDocsByCategory',
    'Get a documentation category bundle by name. Prefer v2 (api-v2, api-v2/bots, …); `api` is legacy v1.',
    { category: z.enum(ALL_CATEGORY_VALUES).describe('Category to fetch (v2-first; `api` is legacy v1)') },
    async ({ category }: { category: string }) => fetchDoc(category),
  );

  return server;
}

export default registerDocsTools;
