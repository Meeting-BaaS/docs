import { format } from 'date-fns';
import { ServiceConfig } from './types';

// Define constants
export const CURRENT_DATE = format(new Date(), 'yyyy-MM-dd');
export const UPDATES_DIR = './content/docs/updates';
export const META_JSON_PATH = './content/docs/meta.json';
export const LLM_CONTENT_DIR = './content/llm';
export const API_REF_PATH = './content/api-reference';
export const PACKAGE_JSON_PATH = './package.json';

// Service configurations
export const SERVICES: ServiceConfig[] = [
  {
    name: 'API',
    dirPattern: API_REF_PATH,
    icon: 'Webhook',
    serviceKey: 'api',
    additionalTags: ['api-reference'],
  },
  {
    name: 'TypeScript SDK',
    dirPattern: 'content/docs/typescript-sdk',
    icon: 'Settings',
    serviceKey: 'sdk',
    additionalTags: ['sdk', 'typescript'],
  },
  {
    name: 'Speaking Bots',
    dirPattern: 'content/docs/speaking-bots',
    icon: 'Bot',
    serviceKey: 'speaking-bots',
    additionalTags: ['bots', 'persona'],
  },
  {
    name: 'MCP Servers',
    dirPattern: 'content/docs/mcp-servers',
    icon: 'ServerCog',
    serviceKey: 'mcp-servers',
    additionalTags: ['mcp', 'server'],
  },
  {
    name: 'Transcript Seeker',
    dirPattern: 'content/docs/transcript-seeker',
    icon: 'Captions',
    serviceKey: 'transcript-seeker',
    additionalTags: ['transcript', 'seeker'],
  },
  // Add other services as needed
];

// Also export as default to ensure it's accessible
export default SERVICES;
