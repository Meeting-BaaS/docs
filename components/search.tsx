import { OramaClient } from '@oramacloud/client';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import SearchDialog from 'fumadocs-ui/components/dialog/search-orama';
import { useMode } from '@/app/layout.client';

// Check if environment variables are defined
const endpoint = process.env.NEXT_PUBLIC_ORAMA_SEARCH_ENDPOINT;
const apiKey = process.env.NEXT_PUBLIC_ORAMA_SEARCH_API_KEY;

if (!endpoint || !apiKey) {
  throw new Error(
    'Orama search endpoint and API key must be defined in environment variables',
  );
}

const client = new OramaClient({
  endpoint,
  api_key: apiKey,
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
      ]}
      client={client}
      showOrama
    />
  );
}
