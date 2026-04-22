import { OramaCloud } from '@orama/core';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import SearchDialog from 'fumadocs-ui/components/dialog/search-orama';
import { useMode } from '@/app/layout.client';

const projectId = process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_ORAMA_API_KEY;

if (!projectId || !apiKey) {
  throw new Error(
    'Orama project ID and API key must be defined in environment variables',
  );
}

const client = new OramaCloud({
  projectId,
  apiKey,
});

export default function CustomSearchDialog(
  props: SharedProps,
): React.ReactElement {
  return (
    <SearchDialog
      {...props}
      defaultTag={useMode() ?? 'ui'}
      allowClear
      tags={[
        {
          name: 'API',
          value: 'api',
        },
        {
          name: 'Transcript Seeker',
          value: 'transcript-seeker',
        },
        {
          name: 'Speaking Bots',
          value: 'speaking-bots',
        },
        {
          name: 'Typescript SDK',
          value: 'typescript-sdk',
        },
        {
          name: 'MCP Servers',
          value: 'mcp-servers'
        }
      ]}
      client={client}
      showOrama
    />
  );
}
