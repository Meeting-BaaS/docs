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
    icon: 'Server',
    serviceKey: 'api',
    additionalTags: ['api-reference'],
  },
  {
    name: 'TypeScript SDK',
    dirPattern: 'content/docs/typescript-sdk',
    icon: 'Braces',
    serviceKey: 'sdk',
    additionalTags: ['sdk', 'typescript'],
  },
  {
    name: 'LLM Integration',
    dirPattern: LLM_CONTENT_DIR,
    icon: 'BrainCircuit',
    serviceKey: 'llm',
    additionalTags: ['llm', 'ai'],
    excludePatterns: ['content/llm/all.md'],
  },
  {
    name: 'Speaking Bots',
    dirPattern: 'content/docs/speaking-bots',
    icon: 'Brain',
    serviceKey: 'speaking-bots',
    additionalTags: ['bots', 'persona'],
  },
  {
    name: 'MCP Servers',
    dirPattern: 'content/docs/mcp-servers',
    icon: 'Server',
    serviceKey: 'mcp-servers',
    additionalTags: ['mcp', 'server'],
  },
  // Add other services as needed
];
