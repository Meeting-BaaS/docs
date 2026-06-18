import { tool, jsonSchema } from 'ai';
import {
  ALL_CATEGORY_VALUES,
  buildApiIndex,
  getCategoryDoc,
  getPageBySlug,
  listCategoriesText,
} from './mcp-server';

// The docs MCP tools, exposed as in-process AI-SDK tools for the docs site's
// own "Ask AI" assistant (app/api/chat/route.ts). Same logic as the /mcp
// endpoint — reads MDX off disk — but called directly, no transport hop.
//
// Schemas use jsonSchema() (raw JSON Schema) rather than zod so they're
// independent of the project's zod major version.
export const docsTools = {
  listCategories: tool({
    description:
      'List MeetingBaas documentation categories and how to navigate them. The current API is v2 (api-v2); prefer it.',
    parameters: jsonSchema<Record<string, never>>({ type: 'object', properties: {}, additionalProperties: false }),
    execute: async () => listCategoriesText(),
  }),

  getApiDocs: tool({
    description:
      'Get a small INDEX of the MeetingBaas v2 API: sections and their endpoints with links and slugs. Use this FIRST, then getDocsPage for one endpoint or getDocsByCategory for a whole section.',
    parameters: jsonSchema<Record<string, never>>({ type: 'object', properties: {}, additionalProperties: false }),
    execute: async () => buildApiIndex(),
  }),

  getDocsPage: tool({
    description:
      'Fetch a SINGLE documentation page by slug (cheapest). Get slugs from getApiDocs. Example: api-v2/reference/bots/createBot.',
    parameters: jsonSchema<{ slug: string }>({
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: "Page slug, e.g. 'api-v2/reference/bots/createBot' (as shown by getApiDocs)",
        },
      },
      required: ['slug'],
      additionalProperties: false,
    }),
    execute: async ({ slug }) => getPageBySlug(slug),
  }),

  getDocsByCategory: tool({
    description:
      'Get a whole documentation category/section bundle by name (e.g. api-v2, api-v2/bots, self-hosting). Prefer v2; `api` is legacy v1.',
    parameters: jsonSchema<{ category: string }>({
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ALL_CATEGORY_VALUES,
          description: 'Category to fetch (v2-first; `api` is legacy v1)',
        },
      },
      required: ['category'],
      additionalProperties: false,
    }),
    execute: async ({ category }) => getCategoryDoc(category),
  }),
};

export default docsTools;
