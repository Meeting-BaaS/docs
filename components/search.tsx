import { OramaClient } from '@oramacloud/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import SearchDialog from 'fumadocs-ui/components/dialog/search-orama'
import { useMode } from '@/app/layout.client'
import { useMemo } from 'react'

const endpoint = process.env.NEXT_PUBLIC_ORAMA_SEARCH_ENDPOINT
const apiKey = process.env.NEXT_PUBLIC_ORAMA_SEARCH_API_KEY
const hasCredentials = Boolean(endpoint && apiKey)

export default function CustomSearchDialog(
  props: SharedProps,
): React.ReactElement {
  const client = useMemo(
    () =>
      hasCredentials
        ? new OramaClient({
            endpoint: endpoint!,
            api_key: apiKey!,
          })
        : null,
    [],
  )

  if (!client) {
    return <div />
  }

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
          value: 'mcp-servers',
        },
      ]}
      client={client}
      showOrama
    />
  )
}
