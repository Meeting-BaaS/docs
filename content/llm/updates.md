# updates Documentation

Documentation for updates.

## December 12, 2024

API - New webhooks, events, and pagination updates

### Source: ./content/docs/updates/api-2024-12-12.mdx


# 🐟 API Updates - Calendar API Update

<Callout type="info" icon={<Info className="h-5 w-5" />}>
  Paris, the 12th of December 2024.
</Callout>

We're excited to announce several improvements to our Calendar API endpoints. These changes include new features and some breaking changes.

## New Features

### Webhook Configuration Flexibility

- The `webhook_url` parameter is now optional on [`POST /calendar`](/docs/api/reference/calendars/create_calendar) endpoint if a webhook URL is already configured on the account

### Enhanced Event Information

- [`GET /calendar_events`](/docs/api/reference/calendars/list_events) now includes attendees information for each event
- [`GET /calendar_events/uuid`](/docs/api/reference/calendars/get_event) now returns the `calendar_id` of the event

### Recurring Events Bot Management

- New query parameter `all_occurrences` added to [`POST /calendar_events/uuid/bot`](/docs/api/reference/calendars/schedule_record_event)
- Allows scheduling a bot for all instances of a recurring event
- Same functionality added to [`DELETE /calendar_events/uuid/bot`](/docs/api/reference/calendars/unschedule_record_event)
- Enables bot removal from all occurrences of a recurring event

## Breaking Changes

<Callout type="warn">
### Bot Management Response Format

- [`POST /calendar_events/uuid/bot`](/docs/api/reference/calendars/schedule_record_event) now returns an array of events instead of a single event
- [`DELETE /calendar_events/uuid/bot`](/docs/api/reference/calendars/unschedule_record_event) now returns an array of events instead of a single event

</Callout>

<Callout type="warn">
### Pagination Changes
- [`GET /calendar_events`](/docs/api/reference/list_events) endpoint no longer supports `offset/limit` pagination
- Implemented cursor-based pagination
- Response format changed to include a `next` field for fetching subsequent events
- Events are returned in batches of 100
- Example response structure:
  ````json
  {
    "events": [...],
    "next": "cursor_token_for_next_page"
  }
  ````
</Callout>
## Migration Guide

1. Update your pagination implementation to use the new cursor-based system
2. Modify your bot management logic to handle arrays of events instead of single events
3. Review any webhook configuration logic to take advantage of the new optional webhook_url parameter

## Implementation Timeline

These changes are now live in production.


---

## January 04, 2025

API - New streaming formats, WebSocket configurations, and client improvements

### Source: ./content/docs/updates/api-2025-01-04.mdx


# 🐟 API Updates - Streaming and Client Updates

<Callout type="info" icon={<Info className="h-5 w-5" />}>
  Paris, the 4th of January 2025.
</Callout>

We're excited to announce several improvements to our streaming API and client applications for Zoom, Microsoft Teams, and Google Meet. These updates enhance stability, performance, and functionality.

## New Features

### Streaming Format Specification

- You can now specify the streaming format for WebSocket streams, 16kHz or 24kHz.
- **audio_frequency**: The audio frequency for the WebSocket streams, defaults to 24kHz. Can be one of `16khz` or `24khz`.

### Microsoft Teams Client Update

- We've updated our Microsoft Teams client, reducing the number of bugs by 50%.
- Now supports live Teams links, including Microsoft Live Meeting URLs (e.g., `https://teams.live.com/meet/...`).

### Google Meet Client Update

- We've updated our Google Meet client, reducing the number of bugs by 10%.

### Zoom Client Update

- Released an entirely new Zoom client. Currently, video capture isn't supported, but we plan to release this feature within the next two weeks.
- Zoom is expected to be our most stable client.

## Implementation Timeline

These changes are now live in production.


---

## February 27, 2025

API - Teams/GMeet stability improvements and new transcription capabilities

### Source: ./content/docs/updates/api-2025-02-27.mdx


# 🐟 API Updates - Improvements & Retranscribe Route

<Callout type="info" icon={<Info className="h-5 w-5" />}>
  **Paris**, the 27th of February 2025.
</Callout>

We're excited to announce significant improvements to our platform stability and the introduction of new API capabilities.

## Platform Stability Improvements

### Teams & Google Meet Enhancement

- Complete engine rewrite for both Teams and Google Meet platforms
- Migrated from Puppeteer to Playwright for improved stability
- Significantly enhanced performance and reliability
- Successfully tested with extended runtime (15+ hours) showing excellent stability

## New API Features

### New Retranscribe Endpoint

- Introduced new [`POST /bots/retranscribe`](/docs/api/reference/retranscribe_bot) endpoint
- Allows transcription or retranscription of a bot's audio
- Supports both default and custom speech-to-text providers
- Flexible webhook configuration for processing notifications

### OCR Capabilities

- Added Optical Character Recognition (OCR) inside bots for better detection of current meeting status
- This will enable future features including:
  - Sharing screenshots of meeting content
  - OCR'ed content shared in meetings (for RAG and other AI-enhanced applications)
- Improves bot awareness of visual meeting context

### Join Endpoint Enhancement

- Added `audio_only` parameter to [`POST /bots`](/docs/api/reference/join) endpoint
- Enables audio-only participation in meetings
- Optimized for scenarios requiring only audio capabilities

## Implementation Details

### Retranscribe API

The new retranscribe endpoint accepts the following parameters:

- `bot_uuid`: Identifier for the target bot
- `provider`: Choice of speech-to-text provider
- `webhook_url`: Optional callback URL for completion notifications

<Callout type="info">
  The retranscribe feature is particularly useful for:
  - Improving existing transcriptions
  
  - Using different speech-to-text providers

- Recovering from any transcription issues

</Callout>

## Future Enhancements

We're actively working on expanding the capabilities of the retranscribe endpoint:

- Additional speech-to-text providers will be supported in upcoming releases
- Custom provider parameters will be exposed through a flexible JSON configuration field
- This will enable fine-tuned control over transcription settings and provider-specific features

## Migration Guide

No breaking changes were introduced with these updates. All new features are additive and backward compatible with existing implementations.

## Implementation Timeline

These changes are now live in production and available for immediate use.


---

## March 1, 2025

API - Improved filtering, comprehensive event details, and calendar management

### Source: ./content/docs/updates/api-2025-03-01.mdx


# 🐟 API Updates - Calendar API Enhancements

<Callout type="info" icon={<Info className="h-5 w-5" />}>
  Paris, the 1st of March 2025.
</Callout>

We've expanded our Calendar API with new filtering capabilities and improved calendar management. These enhancements provide more flexibility when working with calendar events and integrations.

## New Features

### Enhanced Event Filtering

The [`GET /calendar_events`](/docs/api/reference/calendars/list_events) endpoint now supports additional filtering parameters:

- `attendeeEmail` - Filter events by attendee email address
- `organizerEmail` - Filter events by organizer email address
- `startDateGte` - Filter events with start date greater than or equal to timestamp
- `startDateLte` - Filter events with start date less than or equal to timestamp
- `status` - Filter by meeting status (`upcoming`, `past`, or `all`)

### Improved Attendee Information

The `Attendee` object now includes a `name` field that provides the display name of the attendee when available from the calendar provider (Google, Microsoft).

## Migration Guide

1. Update your API clients to take advantage of the new filtering parameters

## Related Updates

- [Calendar API Update](/docs/api/updates/calendar-api-update) - Previous calendar API enhancements
- [Retranscribe Route](/docs/api/updates/retranscribe-route) - Information about the retranscribe endpoint


---

## March 2, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-02.mdx


# API Updates 🐟

<Callout type="info">
  Dive into the latest updates - we're casting a wide net of improvements! 🎣
</Callout>

## March 2, 2025 Release

### Key Updates

<Steps>
  <Step>Calendar Integration Enhancements</Step>
  <Step>Security and Performance Improvements</Step>
  <Step>Code Quality Refinements</Step>
</Steps>

### Highlights

<Accordions>
  <Accordion title="Calendar Improvements" value="calendar-updates">
    Enhanced event filtering, improved attendee information management, and more robust credential handling.
  </Accordion>
  <Accordion title="Security Enhancements" value="security-updates">
    Addressed potential SQL injection vulnerabilities and improved overall system security.
  </Accordion>
</Accordions>

### Development Focus

<TypeTable 
  type={{
    calendarFiltering: {
      description: 'Improved security and maintainability of calendar event queries',
      type: 'enhancement',
      impact: 'High'
    },
    credentialManagement: {
      description: 'Preserved UUID during credential updates',
      type: 'bugfix',
      impact: 'Medium'
    }
  }}
/>

<Callout type="warn">
  Note: Internal updates that do not directly impact external API specifications.
</Callout>

---

## March 3, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-03.mdx


# API Updates 🐟

<Callout type="info">
  Diving into the latest updates like a bass swimming through code currents! 🎣
</Callout>

## March 3, 2025 Updates

### Key Changes

<Tabs items={['Fix Insufficient Tokens', 'Playwright Improvements']}>
  <Tab value="Fix Insufficient Tokens">
    <Steps>
      <Step>Addressed email cooldown check account filtering</Step>
      <Step>Improved token management mechanisms</Step>
    </Steps>
  </Tab>
  <Tab value="Playwright Improvements">
    <Steps>
      <Step>Enhanced streaming service integration</Step>
      <Step>Improved AWS instance management</Step>
      <Step>Updated transcription provider settings</Step>
    </Steps>
  </Tab>
</Tabs>

### Notable Modifications

<Accordions>
  <Accordion title="Token and Email Handling" value="token-management">
    Fixed issues related to insufficient token detection and email cooldown checks.
  </Accordion>
  <Accordion title="Streaming and Service Enhancements" value="streaming-improvements">
    Refined streaming service, improved error handling, and updated instance management processes.
  </Accordion>
</Accordions>

<Callout type="warn">
  Internal updates that do not directly impact external API specifications.
</Callout>

### Quick Highlights

- 🔧 Improved email cooldown filtering
- 🚀 Enhanced streaming service reliability
- ⏱️ Added timeout mechanisms for instance management
- 🔍 Refined error handling and detection processes

---

## March 4, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-04.mdx


# API Updates 🐟

<Callout type="info">
  Hooked on the latest API improvements? Let's dive into the updates! 🎣
</Callout>

## Overview

### Key Changes

<Tabs items={['Summary', 'Technical Details']}>
  <Tab value="Summary">
    - Minor documentation improvements
    - Internal wording refinements
  </Tab>
  <Tab value="Technical Details">
    <Files>
      <Folder name="api_server">
        <Folder name="baas_engine">
          <Folder name="src">
            <Folder name="tokens">
              <File name="constants.rs" />
            </Folder>
          </Folder>
        </Folder>
      </Folder>
    </Files>
  </Tab>
</Tabs>

## Commit Details

<Accordions>
  <Accordion title="Commit Overview" value="commit-info">
    Documentation wording improvement merged into master branch
  </Accordion>
</Accordions>

<Callout type="warn">
  Note: Specific code changes are not disclosed for confidentiality reasons.
</Callout>

## Additional Information

<Steps>
  <Step>Review completed</Step>
  <Step>Documentation refined</Step>
  <Step>Merge request processed</Step>
</Steps>

---

## March 5, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-05.mdx


# API Updates 🐟

<Callout type="info">
  Diving into our latest API improvements - making waves in the development sea! 🌊
</Callout>

## March 5, 2025 Updates

### Key Changes

The recent updates focus on internal improvements across several core API components:

<Accordions>
  <Accordion title="Calendar Module Updates" value="calendar">
    Refinements in calendar data retrieval and event handling processes.
  </Accordion>
  <Accordion title="Bot Service Enhancements" value="bots">
    Improvements in bot-related error handling and public interfaces.
  </Accordion>
</Accordions>

### Affected Components

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="calendar/data/get.rs" />
      <File name="bots/error.rs" />
      <File name="bots/data/post.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="calendar/public/calendar_events.rs" />
      <File name="bots/public.rs" />
    </Folder>
  </Folder>
</Files>

### Implementation Notes

<Callout type="warn">
  These updates are internal improvements and do not directly impact external API contracts.
</Callout>

### Merge Request Details

Multiple merge requests were processed:
- MR !165: Documentation wording improvements
- MR !164: Additional documentation refinements
- MR !163: Default token adjustments

<TypeTable 
  type={{
    documentationScope: {
      description: 'Internal improvements and wording updates',
      type: 'string',
      default: 'N/A'
    },
    mergeCount: {
      description: 'Number of merge requests processed',
      type: 'number',
      default: '3'
    }
  }}
/>

---

## March 6, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-06.mdx


🐟 Hooked on API Updates? Let's dive into the latest catch! 

# Production Updates - March 6, 2025

<Callout type="info">
  Internal service improvements and refinements
</Callout>

## Key Changes

### Calendar and Filtering Improvements

The recent updates focus on two primary areas:

1. **Organizer Calendar Filtering**
   - Enhanced filtering mechanisms for calendar management
   - Improved data handling and retrieval processes

2. **Data Naming Conventions**
   - Transitioned to snake_case for calendar-related data structures
   - Standardized naming conventions across services

## Affected Components

<Files>
  <Folder name="meeting_bot">
    <Folder name="recording_server">
      <File name="browser.ts" />
      <Folder name="state-machine">
        <Folder name="states">
          <File name="error-state.ts" />
          <File name="initialization-state.ts" />
          <File name="recording-state.ts" />
        </Folder>
      </Folder>
    </Folder>
  </Folder>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="calendar/data/get.rs" />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  These updates are internal and do not directly impact external API interfaces.
</Callout>

---

## March 10, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-10.mdx


🐟 Hooked on Updates: Diving into the Latest API Changes! 🐟

<Callout type="info">
  Internal Service Updates - March 10, 2025
</Callout>

## Key Changes

This update focuses on improvements to our internal service infrastructure, with modifications spanning multiple components:

### Calendar and Webhook Enhancements

<Tabs items={['API Server', 'Meeting Bot']}>
  <Tab value="API Server">
    - Updated calendar data retrieval mechanisms
    - Improved distributed caching strategies
    - Enhanced webhook processing
  </Tab>
  <Tab value="Meeting Bot">
    - Refined browser initialization and recording state management
    - Updated RabbitMQ integration
    - Improved error handling in state machines
  </Tab>
</Tabs>

### Focus Areas

<Accordions>
  <Accordion title="Calendar Operations" value="calendar-ops">
    - Refined data fetching methods
    - Internal and public calendar API adjustments
    - Added test coverage for calendar functionality
  </Accordion>
  
  <Accordion title="Recording Infrastructure" value="recording-infra">
    - State machine improvements
    - Browser setup error management
    - Enhanced recording state transitions
  </Accordion>
</Accordions>

<Callout type="warn">
  These updates are internal improvements and do not directly impact external API contracts.
</Callout>

---

## March 11, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-11.mdx


# API Updates 🐟

<Callout type="info">
  Dive into the latest updates for our API service - we're making waves in backend improvements! 🌊
</Callout>

## Overview of Changes

This update focuses on improving browser setup and error handling across multiple components of our API and recording infrastructure.

### Key Improvements

<Steps>
  <Step>Enhanced browser setup reliability</Step>
  <Step>Improved error state management</Step>
  <Step>Refined calendar and webhook handling</Step>
</Steps>

### Affected Components

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="calendar/data/get.rs" />
      <File name="calendar/error.rs" />
      <File name="extend_axum/distributed_cache.rs" />
      <File name="webhook.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="calendar/api.rs" />
      <File name="calendar/internal.rs" />
      <File name="calendar/public/calendars.rs" />
      <File name="tests/calendar.rs" />
    </Folder>
  </Folder>
  <Folder name="meeting_bot/recording_server">
    <Folder name="src">
      <Folder name="state-machine/states">
        <File name="error-state.ts" />
        <File name="initialization-state.ts" />
        <File name="recording-state.ts" />
      </Folder>
      <File name="browser.ts" />
      <File name="main.ts" />
      <File name="rabbitmq.ts" />
    </Folder>
  </Folder>
</Files>

### Potential Impact

<Callout type="warn">
  These changes may affect browser initialization and error handling in the recording infrastructure.
</Callout>

### Recommendations

- Review browser setup processes
- Test error state transitions
- Verify calendar and webhook integrations

<Tabs items={['Production', 'Development']}>
  <Tab value="Production">
    Recommended to update in a staged rollout
  </Tab>
  <Tab value="Development">
    Immediate testing recommended
  </Tab>
</Tabs>

---

## March 12, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-12.mdx


# API Updates - March 12, 2025 🐟

<Callout type="info">
  Hooked on our latest API improvements? Let's dive into the details! 🎣
</Callout>

## Key Updates

### Data Deletion Endpoint 

<Tabs items={['Feature', 'Protection']}>
  <Tab value="Feature">
    - New `/:uuid/delete_data` endpoint for deleting transcription data
    - Selective deletion preserves essential metadata
    - Detailed status reporting on deletion process
  </Tab>
  <Tab value="Protection">
    - Rate limiting: 5 requests per minute per API key
    - Enhanced rate limit headers:
      - `X-RateLimit-Limit`
      - `X-RateLimit-Remaining`
      - `X-RateLimit-Reset`
  </Tab>
</Tabs>

### Calendar Sync Improvements

<Steps>
  <Step>Added tracking for affected event UUIDs in calendar webhooks</Step>
  <Step>Improved borrowing and code verbosity in sync logic</Step>
  <Step>Preserved event metadata during synchronization</Step>
</Steps>

## Technical Highlights

<Callout type="warn">
  These updates enhance data management and API reliability while maintaining user privacy and system performance.
</Callout>

<TypeTable 
  type={{
    deleteDataEndpoint: {
      description: 'Secure data deletion mechanism',
      type: 'API Route',
      protection: 'Rate Limited'
    },
    calendarSync: {
      description: 'Enhanced event UUID tracking',
      type: 'Webhook Improvement',
      metadata: 'Preserved'
    }
  }}
/>

---

## March 13, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-13.mdx


🐟 Dive into the latest API updates! Just like a bass swimming through code streams, we've got some fin-tastic improvements for you!

# API Updates - March 13, 2025

<Callout type="info">
Key Highlights:
- Added delete_data route for bots
- Improved OpenAPI specifications
- Enhanced bot filtering and sorting capabilities
</Callout>

## Major Changes

### Bot Management Improvements

<Tabs items={['New Features', 'Modifications']}>
  <Tab value="New Features">
    - Added `delete_data` route for bots
    - Implemented support for filtering and sorting bots by custom JSON fields
    - Restored `list_recent_bots` implementation
  </Tab>
  <Tab value="Modifications">
    - Refined OpenAPI documentation
    - Updated bot metadata route
    - Removed legacy authentication mechanisms
  </Tab>
</Tabs>

### Technical Enhancements

<Accordions>
  <Accordion title="Authentication Updates" value="auth">
    - Removed legacy authentication systems
    - Improved security and access control
  </Accordion>
  <Accordion title="Documentation Improvements" value="docs">
    - Enhanced OpenAPI specifications
    - Clarified route documentation
    - Added more constants for transcription files
  </Accordion>
</Accordions>

## Changed Components

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="tokens/constants.rs" />
      <File name="transcriber/providers/gladia.rs" />
      <File name="transcriber/providers/runpod.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="app_state.rs" />
      <File name="bots/public.rs" />
      <File name="routers.rs" />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  Note: Detailed code changes are not disclosed for confidentiality reasons.
</Callout>

---

## March 14, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-14.mdx


# API Updates 🐟

<Callout type="info">
  Dive into the latest API improvements - we're making waves in the development sea! 🌊
</Callout>

## Recent Changes Overview

This update focuses on improvements to bot-related functionality and API routing:

<Steps>
  <Step>Enhanced Recent Bots Pagination</Step>
  <Step>Improved Bot Metadata Handling</Step>
  <Step>Refined Authentication Mechanisms</Step>
</Steps>

### Key Improvements

<Accordions>
  <Accordion title="Cursor-Based Pagination" value="pagination">
    Implemented more robust cursor-based pagination for recent bots endpoint, improving data retrieval efficiency.
  </Accordion>
  <Accordion title="Route Modifications" value="routing">
    Updated bot-related routes, including metadata and deletion endpoints.
  </Accordion>
  <Accordion title="Authentication Updates" value="auth">
    Removed legacy authentication methods to streamline security processes.
  </Accordion>
</Accordions>

### Technical Highlights

<Callout type="warn">
  Note: These changes impact internal API routing and data management.
</Callout>

- Improved list_recent_bots endpoint functionality
- Added support for custom JSON field filtering and sorting
- Enhanced OpenAPI specification documentation
- Implemented new delete_data route for bots

<Tabs items={['Pagination', 'Routing', 'Authentication']}>
  <Tab value="Pagination">
    Refined cursor-based pagination to provide more accurate and efficient data retrieval for recent bots.
  </Tab>
  <Tab value="Routing">
    Updated bot metadata routes and implemented new endpoint for data deletion.
  </Tab>
  <Tab value="Authentication">
    Removed legacy authentication methods to improve security and simplify access management.
  </Tab>
</Tabs>

<Callout type="info">
  For detailed implementation specifics, please consult the latest API documentation.
</Callout>

---

## March 17, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-17.mdx


🐟 Dive into the latest API updates - where code meets creativity, and every commit is a wave of improvement!

# Production Updates - March 17, 2025

<Callout type="info">
  This update focuses on internal improvements to our API infrastructure, enhancing reliability and performance.
</Callout>

## Key Changes

### Transcription and Storage Improvements

The recent commits primarily addressed several critical areas:

- **Transcription Method Refinement**
  - Enhanced error handling for transcription processes
  - Improved API error management strategies

- **Storage and URL Handling**
  - Implemented consistent S3 URL building for audio files
  - Ensured public internet S3 usage for audio resources

### Environment and Configuration

<Tabs items={['Environment', 'Configuration']}>
  <Tab value="Environment">
    - Updated `.env` configuration
    - Refined environment variable management
  </Tab>
  <Tab value="Configuration">
    - Adjusted path handling for recording and transcription
    - Streamlined state machine logic in recording server
  </Tab>
</Tabs>

## Affected Components

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="transcriber/providers/gladia.rs" />
      <File name="transcriber/retry.rs" />
      <File name="transcriber/storage.rs" />
    </Folder>
  </Folder>
  <Folder name="meeting_bot">
    <Folder name="recording_server">
      <File name="recording/Transcoder.ts" />
      <File name="state-machine/states/*" />
      <File name="utils/PathManager.ts" />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  These changes are internal and do not directly impact external API consumers.
</Callout>

---

## March 18, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-18.mdx


🐟 Hooked on API Updates: Diving into the Latest Catch! 🐟

# API Service Updates

<Callout type="info">
  This update focuses on internal improvements to our transcription service.
</Callout>

## Key Changes

### Transcription Provider Enhancement

The recent update targets the audio extraction process for transcription, specifically modifying the Gladia provider implementation.

<Steps>
  <Step>Updated audio extraction logic in transcription provider</Step>
  <Step>Improved handling of audio processing</Step>
</Steps>

### Merge Request Details

<Accordions>
  <Accordion title="Merge Request Summary" value="mr-overview">
    Internal merge to improve audio transcription capabilities
  </Accordion>
</Accordions>

## Technical Highlights

<TypeTable 
  type={{
    provider: {
      description: 'Transcription service provider',
      type: 'string',
      default: 'Gladia'
    },
    audioExtraction: {
      description: 'Mechanism for extracting audio for transcription',
      type: 'method',
      default: 'Updated'
    }
  }}
/>

<Callout type="warn">
  Detailed code changes are not disclosed for confidentiality reasons.
</Callout>

---

## March 19, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-19.mdx


🐟 Hooked on Updates: Diving Deep into API Improvements! 

# Production Updates - March 19, 2025

<Callout type="info">
  Internal improvements to meeting recording and transcription systems
</Callout>

## Key Changes

### Meeting Management Enhancements

The recent updates focus on improving end management and state handling for meeting recording processes. Key areas of modification include:

- Refined transcription provider logic
- Enhanced bot internal handling
- Improved state machine for recording workflows
- Robust error state management

<Tabs items={['Overview', 'Technical Details']}>
  <Tab value="Overview">
    These changes aim to create more reliable and responsive meeting recording experiences, ensuring smoother transitions between different meeting states.
  </Tab>
  <Tab value="Technical Details">
    Updates span multiple components in the recording server, including event handling, state machine implementation, and meeting lifecycle management.
  </Tab>
</Tabs>

## Affected Components

<Files>
  <Folder name="meeting_bot/recording_server" defaultOpen>
    <Folder name="src">
      <File name="events.ts" />
      <File name="main.ts" />
      <File name="meeting.ts" />
      <Folder name="state-machine">
        <Folder name="states">
          <File name="error-state.ts" />
          <File name="recording-state.ts" />
          <File name="waiting-room-state.ts" />
        </Folder>
        <File name="machine.ts" />
      </Folder>
    </Folder>
  </Folder>
</Files>

## Potential Impact

<Callout type="warn">
  These internal updates may improve system stability and error handling, but do not introduce direct external API changes.
</Callout>

---

## March 21, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-21.mdx


# API Updates 🐟

<Callout type="info">
  Diving into the latest API improvements - no fishing required! 
</Callout>

## Overview of Changes

This update focuses on internal improvements to the meeting recording and transcription systems. The changes primarily involve adjustments to the recording server and transcription-related components.

### Key Modifications

<Steps>
  <Step>Temporary removal of transcription from trampoline-end process</Step>
  <Step>Updates to meeting recording state management</Step>
  <Step>Refinements in chrome extension and recording server logic</Step>
</Steps>

### Affected Components

<Files>
  <Folder name="meeting_bot">
    <Folder name="recording_server">
      <File name="src/events.ts" />
      <File name="src/main.ts" />
      <File name="src/server.ts" />
      <Folder name="src/state-machine">
        <Folder name="states">
          <File name="error-state.ts" />
          <File name="in-call-state.ts" />
          <File name="recording-state.ts" />
        </Folder>
      </Folder>
    </Folder>
  </Folder>
</Files>

### Impact

<Callout type="warn">
  These changes are internal and do not directly affect external API consumers. The modifications are focused on improving the meeting recording and transcription infrastructure.
</Callout>

### Recommended Actions

- No immediate action required for API users
- Verify compatibility with existing integrations
- Monitor for any potential performance improvements

<Tabs items={['Production', 'Development']}>
  <Tab value="Production">
    Update to the latest version when available
  </Tab>
  <Tab value="Development">
    Review state machine and recording server changes
  </Tab>
</Tabs>

---

## March 25, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-25.mdx


# API Updates 🐟

<Callout type="info">
  Looks like we're reeling in some API improvements today! Just another day of
  fishing for better code. 🎣
</Callout>

## Overview of Changes

The recent updates focus on enhancing the retry mechanism for API calls, ensuring more robust and reliable service interactions.

### Key Modifications

<Steps>
  <Step>Improved retry logic in API call handling</Step>
  <Step>Updated type definitions to support new retry strategy</Step>
</Steps>

### Affected Components

<Files>
  <Folder name="meeting_bot">
    <Folder name="recording_server">
      <Folder name="src">
        <File name="main.ts" />
        <File name="types.ts" />
      </Folder>
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  Potential Impact: These changes may affect existing API call retry behaviors.
</Callout>

## Recommendations

- Review the updated retry mechanism in your integration
- Test API calls to ensure compatibility with new implementation
- Verify error handling and retry logic in your current implementation

<Accordions>
  <Accordion title="Technical Details" defaultOpen>
    Specific implementation details are confidential and cannot be disclosed.
  </Accordion>
</Accordions>


---

## March 26, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-26.mdx


# API Updates 🐟

<Callout type="info">
  Diving deep into our latest API improvements - just like a bass exploring new waters! 🎣
</Callout>

## Overview of Changes

This update focuses on internal improvements to our API service, primarily addressing error handling and state management in various components.

### Key Areas of Modification

<Tabs items={['Transcription', 'Meeting Bot', 'State Management']}>
  <Tab value="Transcription">
    - Enhanced error handling in transcription providers
    - Improved retry mechanisms for transcription services
    - Updated storage and transcription logic
  </Tab>
  <Tab value="Meeting Bot">
    - Refined state machine implementation
    - Improved meeting lifecycle management
    - Enhanced error state handling
  </Tab>
  <Tab value="State Management">
    - Implemented more robust state transitions
    - Added improved error tracking
    - Optimized state machine logic
  </Tab>
</Tabs>

### Affected Components

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="transcriber" />
      <File name="meeting_bot" />
    </Folder>
    <Folder name="baas_handler">
      <File name="bots" />
    </Folder>
  </Folder>
  <Folder name="meeting_bot">
    <Folder name="recording_server">
      <File name="state-machine" />
      <File name="events" />
    </Folder>
  </Folder>
</Files>

## Highlights

<Callout type="warn">
  These changes are internal improvements and do not directly impact external API interfaces.
</Callout>

### Error Handling Improvements
- Enhanced error tracking in transcription providers
- More robust error state management in meeting bot lifecycle
- Improved retry mechanisms for service calls

### State Machine Refinements
- More precise state transitions
- Better error state detection and handling
- Optimized meeting lifecycle management

## Recommendations

<Steps>
  <Step>Review internal error handling processes</Step>
  <Step>Verify state machine behavior in edge cases</Step>
  <Step>Test transcription service resilience</Step>
</Steps>

---

## March 27, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-27.mdx


# 🐟 API Updates - March 27, 2025

<Callout type="info">
  These updates reflect internal improvements to our API service, focusing on enhancing transcription, error handling, and system reliability.
</Callout>

## Key Changes

### Transcription and Audio Handling Improvements

<Steps>
  <Step>Enhanced audio file extension handling for recordings</Step>
  <Step>Improved transcription segment processing</Step>
  <Step>Centralized storage and error management for transcription tasks</Step>
</Steps>

### Build and Versioning Updates

<Tabs items={['Version', 'Timestamp']}>
  <Tab value="Version">
    - Added `build_timestamp` to version information
    - Provides more detailed build metadata
  </Tab>
  <Tab value="Timestamp">
    - New field populated from `VERGEN_BUILD_TIMESTAMP`
    - Enhances tracking of build versions
  </Tab>
</Tabs>

### Error Handling Enhancements

<Accordions>
  <Accordion title="Unified Error Conversion" value="error-conversion">
    Implemented `From<Box<dyn Error + Send + Sync>>` for MeetingBotError to improve error handling and readability.
  </Accordion>
  <Accordion title="Transcription Error Management" value="transcription-errors">
    Added more robust error logging and handling for transcription processes, including provider-specific error tracking.
  </Accordion>
</Accordions>

## Detailed Improvements

<Files>
  <Folder name="api_server" defaultOpen>
    <Folder name="baas_engine">
      <File name="transcriber/storage.rs">Improved S3 client and configuration handling</File>
      <File name="transcriber/transcribe.rs">Centralized transcription logic</File>
      <File name="bots/data/get.rs">Enhanced speaker tracking and transcript generation</File>
    </Folder>
    <Folder name="baas_handler">
      <File name="bots/internal.rs">Updated meeting end transcription flow</File>
      <File name="routers.rs">Added build timestamp to version endpoint</File>
    </Folder>
  </Folder>
</Files>

## Performance and Reliability

<TypeTable 
  type={{
    transcriptionSegments: {
      description: 'Improved audio segmentation processing',
      type: 'number',
      default: '100 segments per bot'
    },
    maxBotDuration: {
      description: 'Maximum meeting duration for transcription',
      type: 'number',
      default: '14400 seconds (4 hours)'
    }
  }}
/>

<Callout type="warn">
  These changes are internal improvements and do not directly impact external API contracts.
</Callout>

---

## March 28, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-28.mdx


🐟 Hooked on API Updates: Reeling in the Latest Catch! 🎣

# Production Updates - March 28, 2025

<Callout type="info">
  This update focuses on internal improvements to our bot transcription and processing systems.
</Callout>

## Key Changes

### Garbage Collector Improvements for Stalled Bots

<Steps>
  <Step>Refined bot processing logic for stalled transcriptions</Step>
  <Step>Enhanced error handling for transcription tasks</Step>
  <Step>Improved status tracking for bot processing</Step>
</Steps>

### Transcription Task Optimization

<Tabs items={['Before', 'After']}>
  <Tab value="Before">
    - Redundant transcription attempts
    - Limited error tracking
  </Tab>
  <Tab value="After">
    - Synchronized transcription process
    - Comprehensive error handling
    - Improved bot status updates
  </Tab>
</Tabs>

### Error Handling Enhancements

<Callout type="warn">
  Key improvements in tracking and managing transcription errors
</Callout>

- Removed duplicate transcription logic
- Added detailed error logging
- Implemented bot status updates for task failures

## Technical Highlights

<TypeTable 
  type={{
    transcriptionProcess: {
      description: 'Synchronous transcription handling',
      type: 'boolean',
      default: 'true'
    },
    errorTracking: {
      description: 'Enhanced error capture and reporting',
      type: 'boolean',
      default: 'true'
    }
  }}
/>

<Callout type="info">
  These changes improve system reliability and provide more transparent error tracking for bot processing.
</Callout>

---

## March 31, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-03-31.mdx


# API Updates - March 31, 2025 🐟

<Callout type="info">
  Hooked on improvements! Just like a bass swimming through code streams... 🎣
</Callout>

## Overview of Changes

### Merge Branches

We've merged two significant branches into the master:

1. **Ended At for Bots Already Started**
2. **Async Transcription End Meeting**

<Tabs items={['Bot Management', 'Transcription']}>
  <Tab value="Bot Management">
    <Steps>
      <Step>Added `ended_at` handling for bots that were already started</Step>
      <Step>Improved bot lifecycle management</Step>
      <Step>Enhanced error tracking and logging</Step>
    </Steps>
  </Tab>
  <Tab value="Transcription">
    <Steps>
      <Step>Moved transcription processing to background task</Step>
      <Step>Removed duplicate code for setting `ended_at`</Step>
      <Step>Optimized meeting end process</Step>
    </Steps>
  </Tab>
</Tabs>

## Key Modifications

### Files Updated

<Files>
  <Folder name="api_server" defaultOpen>
    <Folder name="baas_engine">
      <File name="Cargo.toml" />
      <File name="src/meeting_bot/starter.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="Cargo.toml" />
      <File name="src/bots/internal.rs" />
      <File name="src/bots/public.rs" />
      <File name="src/calendar/api.rs" />
    </Folder>
  </Folder>
</Files>

### Technical Enhancements

<Callout type="warn">
  These changes improve system reliability and performance without modifying external API contracts.
</Callout>

- Implemented more robust bot lifecycle management
- Enhanced asynchronous transcription handling
- Improved error logging with bot identifier context

## Potential Impact

<TypeTable 
  type={{
    botLifecycle: {
      description: 'More precise tracking of bot start and end states',
      type: 'improved',
      default: 'previous implementation'
    },
    transcriptionProcessing: {
      description: 'Non-blocking background task for transcription',
      type: 'async',
      default: 'synchronous'
    }
  }}
/>

---

## April 1, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-01.mdx


# API Updates 🐟

<Callout type="info">
  Hooked on our latest updates? Dive into the sea of changes! 🎣
</Callout>

## Key Updates

### Calendar Resynchronization
- Performed a comprehensive resync of all private calendars
- Ensures data consistency and up-to-date calendar information

### OpenAPI Documentation Cleanup
- Removed bots sub-page from OpenAPI specification
- Streamlines API documentation for improved clarity

## Affected Components

<Tabs items={['API Server', 'Meeting Bot', 'Transcription']}>
  <Tab value="API Server">
    - Updated core API server configurations
    - Modified routing and handler logic
    - Refined webhook schemas
  </Tab>
  <Tab value="Meeting Bot">
    - Updated recording server implementation
    - Enhanced meeting type definitions
    - Improved meeting interaction mechanisms
  </Tab>
  <Tab value="Transcription">
    - Updated transcription provider integrations
    - Improved error handling and retry mechanisms
    - Enhanced storage and transcription workflows
  </Tab>
</Tabs>

## Technical Highlights

<Accordions>
  <Accordion title="Transcription Providers" value="transcription">
    - Added support for multiple transcription providers
    - Implemented robust retry and fallback mechanisms
    - Enhanced provider-specific error handling
  </Accordion>
  <Accordion title="Calendar API Improvements" value="calendar">
    - Refined public and internal calendar event APIs
    - Improved synchronization processes
    - Enhanced data retrieval methods
  </Accordion>
</Accordions>

<Callout type="warn">
  Note: These updates are internal and may not directly impact external API consumers.
</Callout>

---

## April 2, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-02.mdx


🐟 Diving into the API updates - looks like we're making some waves in the code ocean! Let's see what's swimming around... 

# API Internal Updates

<Callout type="info">
  This update focuses on internal improvements to the API service infrastructure.
</Callout>

## Key Changes

The recent updates primarily involve enhancements to several core components:

### Transcription and Meeting Bot Improvements

- Updated transcription provider handling
- Refined meeting bot startup and error management
- Improved webhook and storage mechanisms

### Server-Side Refinements

- Enhanced cookie and request handling
- Updated routing and parameter management
- Optimized Kubernetes job processing

## Technical Highlights

<Tabs items={['Rust Components', 'TypeScript Components']}>
  <Tab value="Rust Components">
    - Refined `baas_engine` and `baas_handler` modules
    - Improved error handling in transcription providers
    - Updated Cargo configuration files
  </Tab>
  <Tab value="TypeScript Components">
    - Updated recording server logic
    - Enhanced meeting type definitions
    - Improved main server entry point
  </Tab>
</Tabs>

## Affected Areas

<Files>
  <Folder name="api_server" defaultOpen>
    <Folder name="baas_engine">
      <File name="Cargo.toml" />
      <File name="src/transcriber/providers" />
    </Folder>
    <Folder name="baas_handler">
      <File name="src/routers.rs" />
      <File name="src/webhook_schemas.rs" />
    </Folder>
  </Folder>
  <Folder name="meeting_bot" defaultOpen>
    <Folder name="recording_server">
      <File name="src/main.ts" />
      <File name="src/types.ts" />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  These updates are internal and do not directly impact external API specifications.
</Callout>

---

## April 3, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-03.mdx


# API Updates 🐟

<Callout type="info">
  Hooked on our latest updates? Let's dive into the API improvements! 🎣
</Callout>

## Key Changes

### Authentication and Security Enhancements

<Steps>
  <Step>Cross-Subdomain Authentication Enabled</Step>
  <Step>Authentication Code Cleanup</Step>
  <Step>Improved UUID Parameter Handling</Step>
</Steps>

### OpenAPI Specification Updates

<Callout type="warn">
  Several modifications have been made to the OpenAPI specification to improve type safety and documentation.
</Callout>

### Type-Safe Parameter Handling

<TypeTable 
  type={{
    UuidParam: {
      description: 'Structured type for UUID path parameters',
      type: 'Typed UUID',
      benefits: 'Improved type safety and OpenAPI documentation'
    }
  }}
/>

### Changes Overview

<Tabs items={['Authentication', 'Parameter Handling', 'Code Cleanup']}>
  <Tab value="Authentication">
    - Enabled cross-subdomain authentication
    - Cleaned up authentication code structure
  </Tab>
  <Tab value="Parameter Handling">
    - Introduced `UuidParam` for type-safe UUID handling
    - Updated route handlers to use structured parameter types
  </Tab>
  <Tab value="Code Cleanup">
    - Removed unnecessary functions
    - Streamlined internal API implementation
  </Tab>
</Tabs>

<Callout type="info">
  These updates enhance the API's reliability, security, and developer experience. 🚀
</Callout>

---

## April 4, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-04.mdx


# API Updates 🐟

<Callout type="info">
  Diving into the depths of our API improvements - just like a bass swimming through code currents! 🐟
</Callout>

## Overview of Changes

This update focuses on enhancing waiting room management and improving various server-side components across multiple services.

### Key Improvements

<Tabs items={['API Server', 'Meeting Bot', 'Recording Server']}>
  <Tab value="API Server">
    - Enhanced cookie handling
    - Webhook management improvements
    - Router and parameter optimizations
  </Tab>
  <Tab value="Meeting Bot">
    - Refined waiting room state management
    - Meeting platform integration updates
  </Tab>
  <Tab value="Recording Server">
    - State machine enhancements
    - Meeting platform support improvements
  </Tab>
</Tabs>

### Affected Components

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="Cargo.toml" />
      <File name="src/extend_axum/cookies.rs" />
      <File name="src/webhook.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="Cargo.toml" />
      <File name="src/routers.rs" />
      <File name="src/calendar/..." />
    </Folder>
  </Folder>
  <Folder name="meeting_bot">
    <Folder name="recording_server">
      <File name="src/state-machine/..." />
      <File name="src/meeting/..." />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  These updates are internal improvements that enhance system reliability and performance.
</Callout>

---

## April 7, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-07.mdx


# API Updates 🐟

<Callout type="info">
  Dive into the latest API improvements - we're making waves in the development ocean! 🌊
</Callout>

## Overview of Changes

This update focuses on internal improvements across multiple components of our API service and meeting bot infrastructure. The changes span several key areas:

### API Server Enhancements
- Updates to core API server components
- Modifications in handler and routing logic
- Improvements in webhook and cookie handling

### Meeting Bot Refinements
- State machine updates for recording server
- Enhancements in meeting platform integrations
- Typescript-based improvements in recording mechanisms

<Callout type="warn">
  Note: These changes are primarily internal and do not directly impact external API consumers.
</Callout>

## Key Areas of Update

### API Server Components
- Cargo configuration updates
- Cookie and webhook processing improvements
- Routing and parameter handling refinements

### Recording Server Improvements
- Enhanced state management for meeting recordings
- Cross-platform meeting integration updates
- TypeScript type and state machine optimizations

<Tabs items={['API Server', 'Recording Server']}>
  <Tab value="API Server">
    Key files modified:
    - `baas_engine/Cargo.toml`
    - `baas_handler/src/routers.rs`
    - `baas_handler/src/webhook_schemas.rs`
  </Tab>
  <Tab value="Recording Server">
    Key files modified:
    - `recording_server/src/state-machine/states/*`
    - `recording_server/src/meeting/*.ts`
    - `recording_server/src/types.ts`
  </Tab>
</Tabs>

## Recommendations

<Callout type="info">
  While these updates are primarily internal, developers should:
  - Review state machine and meeting integration changes
  - Check for any potential impact on existing integrations
  - Update dependencies if using internal API components
</Callout>

---

## April 8, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-08.mdx


🐟 Hooked on API Updates: Casting a Line into the Sea of Code! 🐟

# API Updates - April 8, 2025

<Callout type="info">
These updates reflect recent improvements to our API service and related infrastructure.
</Callout>

## Key Changes

### Chrome and Browser Improvements

<Tabs items={['Chrome Version', 'Platform Support']}>
  <Tab value="Chrome Version">
    - Updated Chrome version from `108.0.5359.94` to `126.0.6478.182`
    - Revised download URLs for multiple platforms
  </Tab>
  <Tab value="Platform Support">
    - Added macOS Chrome download link
    - Implemented platform-specific executable path detection
    - Updated extension ID flag to `--allowlisted-extension-id`
  </Tab>
</Tabs>

### Logging and Screenshot Enhancements

<Steps>
  <Step>Improved log upload mechanism to S3 bucket</Step>
  <Step>
    Enhanced screenshot utility with timestamp-based naming, disabled CSS animations, and improved image compression
  </Step>
  <Step>Added robust error handling for screenshot and log processes</Step>
</Steps>

### Dialog Management

<Accordions>
  <Accordion title="Dialog Observer Improvements" value="dialog-observer">
    Implemented more resilient dialog handling with:
    - Provider-specific mechanisms
    - Safety checks for page availability
    - Cleanup of existing observers
    - Multiple selector strategies
  </Accordion>
</Accordions>

## Changed Files

<Files>
  <Folder name="meeting_bot" defaultOpen>
    <Folder name="recording_server">
      <File name="package.json" />
      <File name="package-lock.json" />
      <File name="yarn.lock" />
      <Folder name="src">
        <File name="main.ts" />
        <File name="s3.ts" />
        <File name="browser.ts" />
      </Folder>
    </Folder>
    <File name="install_chrome.sh" />
  </Folder>
</Files>

<Callout type="warn">
  These updates improve system reliability, logging, and cross-platform compatibility.
</Callout>

---

## April 9, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-09.mdx


# 🐟 API Updates - Hooked on Improvements! 🐟

<Callout type="info">
  These updates reel in some exciting changes to our API service. Cast your line and dive into the details!
</Callout>

## Key Updates

### Zoom Integration Enhancements

<Tabs items={['Host Presence', 'Error Handling', 'Logging']}>
  <Tab value="Host Presence">
    - Implemented robust host presence verification before recording
    - Added polling mechanism to check for host in meeting
    - Graceful timeout handling for host-related scenarios
  </Tab>
  <Tab value="Error Handling">
    - Refined error message syntax
    - Improved grammatical correctness in error reporting
    - Enhanced error message clarity
  </Tab>
  <Tab value="Logging">
    - Added line number support in logs
    - Implemented more detailed logging configuration
    - Enhanced debug information visibility
  </Tab>
</Tabs>

### Dependency Updates

<TypeTable 
  type={{
    sharp: {
      description: 'Image processing library',
      type: 'string',
      version: '^0.34.1'
    },
    '@types/sharp': {
      description: 'TypeScript type definitions for Sharp',
      type: 'string', 
      version: '^0.31.1'
    }
  }}
/>

## Changed Files

<Files>
  <Folder name="meeting_bot">
    <Folder name="zoom">
      <File name="client/src/engine.rs" />
      <File name="client/src/remote_service.rs" />
    </Folder>
    <Folder name="recording_server">
      <File name="package.json" />
    </Folder>
  </Folder>
  <Folder name="api_server">
    <Folder name="baas_handler">
      <File name="src/main.rs" />
    </Folder>
  </Folder>
</Files>

## Commit Highlights

<Steps>
  <Step>Enhanced Zoom meeting bot state management</Step>
  <Step>Improved error message formatting</Step>
  <Step>Added dependency support for image processing</Step>
  <Step>Refined logging configuration</Step>
</Steps>

<Callout type="warn">
  These updates are internal and may impact service behavior. Test thoroughly before deployment.
</Callout>

---

## April 10, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-10.mdx


# API Updates 🐟

<Callout type="info">
  Dive into the latest API improvements - we're making waves in our development
  process! 🌊
</Callout>

## Key Updates

### Error Handling and File Management Improvements

Our recent updates focus on enhancing reliability and robustness in several critical areas:

<Tabs items={['S3 Handling', 'MP4 URL Generation', 'Webhook Enhancements']}>
  <Tab value="S3 Handling">
    - Implemented comprehensive error handling for S3 storage operations -
    Improved error detection and logging mechanisms
  </Tab>
  <Tab value="MP4 URL Generation">
    - Added file existence checks before generating MP4 URLs - Enhanced URL
    generation reliability
  </Tab>
  <Tab value="Webhook Enhancements">
    - Strengthened webhook processing logic - Added additional validation checks
  </Tab>
</Tabs>

### Modified Components

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="error.rs" />
      <File name="storage.rs" />
      <File name="webhook.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="public.rs" />
    </Folder>
  </Folder>
</Files>

## Development Notes

<Callout type="warn">
  These updates are internal improvements focusing on system reliability and
  error management.
</Callout>

<Accordions>
  <Accordion title="Additional Context">
    The changes primarily address: - Improved error detection - More robust file
    handling - Enhanced webhook processing
  </Accordion>
</Accordions>


---

## April 11, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-11.mdx


# API Updates 🐟

<Callout type="info">
  Dive into the latest API improvements! We're making waves in our service updates. 🌊
</Callout>

## Key Updates - April 11, 2025

### 🔍 Feature Highlights

<Tabs items={['Overview', 'Technical Details']}>
  <Tab value="Overview">
    - Enhanced MP4 file handling
    - Improved data retrieval logic
    - Webhook and transcription optimizations
  </Tab>
  <Tab value="Technical Details">
    The recent updates focus on more robust data processing and conditional URL generation for meeting-related resources.
  </Tab>
</Tabs>

### 🚧 Changes Overview

<Steps>
  <Step>Added file existence checks before URL generation</Step>
  <Step>Refined data fetching mechanisms</Step>
  <Step>Improved error handling and logging</Step>
</Steps>

### 🔬 Impacted Components

<Files>
  <Folder name="api_server" defaultOpen>
    <Folder name="baas_engine">
      <File name="auth/data/get.rs" />
      <File name="meeting_bot/starter.rs" />
      <File name="schema.rs" />
    </Folder>
    <Folder name="migrations">
      <Folder name="2025-04-08-140628_add_secret_into_account">
        <File name="up.sql" />
        <File name="down.sql" />
      </Folder>
    </Folder>
  </Folder>
</Files>

### 🎣 Key Improvements

<Callout type="warn">
  These updates ensure more reliable data handling and prevent unnecessary link generation when no data is available.
</Callout>

### 🔒 Confidentiality Note

<Callout type="info">
  Specific implementation details are kept confidential to maintain service integrity.
</Callout>

---

## April 14, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-14.mdx


🐟 Hooked on API Updates? Let's dive into the latest catch! 

# Production Updates - April 14, 2025

<Callout type="info">
  Internal updates to Zoom meeting bot infrastructure
</Callout>

## Key Changes

### Logging Improvements

Our team made some subtle adjustments to logging mechanisms:

- Updated logging boilerplate for Zoom integration
- Refined log file path management
- Ensured consistent logging approach across components

<Steps>
  <Step>Refactored logging configuration</Step>
  <Step>Standardized log file locations</Step>
  <Step>Improved log management scripts</Step>
</Steps>

### File System Optimizations

<Callout type="warn">
  Minor infrastructure adjustments detected
</Callout>

Modifications focused on:
- Consolidating log and screenshot storage
- Streamlining file organization in Zoom client scripts

## Technical Details

<Accordions>
  <Accordion title="Affected Components" value="components">
    <Files>
      <Folder name="meeting_bot">
        <Folder name="zoom">
          <Folder name="client">
            <File name="src/main.rs" />
            <File name="src/remote_service.rs" />
          </Folder>
          <Folder name="scripts">
            <File name="run.sh" />
          </Folder>
        </Folder>
      </Folder>
    </Files>
  </Accordion>
</Accordions>

<Callout type="info">
  These updates are internal and do not impact external API functionality.
</Callout>

---

## April 15, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-15.mdx


# API Updates 🐟

<Callout type="info">
  Diving deep into our latest API improvements - just like a bass exploring new waters! 🎣
</Callout>

## Key Updates

### Bot Meeting Integrity Checks
We've enhanced our meeting bot's reliability by adding a critical pre-action check to verify the bot's active presence in a meeting before executing any operations.

### Zoom Log Management
Implemented a new mechanism to upload Zoom logs to S3, improving our logging and diagnostics capabilities.

## File Changes Overview

<Files>
  <Folder name="api_server" defaultOpen>
    <Folder name="baas_engine">
      <File name="auth/data/get.rs" />
      <File name="meeting_bot/starter.rs" />
      <File name="schema.rs" />
      <File name="transcriber/providers/runpod.rs" />
      <File name="worker/worker_bot.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="main.rs" />
      <File name="routers.rs" />
    </Folder>
    <Folder name="migrations">
      <Folder name="2025-04-08-140628_add_secret_into_account">
        <File name="down.sql" />
        <File name="up.sql" />
      </Folder>
    </Folder>
  </Folder>
  <Folder name="meeting_bot/recording_server" defaultOpen>
    <Folder name="src">
      <File name="main.ts" />
      <File name="meeting/meet.ts" />
      <File name="recording/Transcoder.ts" />
      <File name="s3.ts" />
      <File name="types.ts" />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  Note: Detailed code changes are intentionally omitted to maintain confidentiality.
</Callout>

---

## April 17, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-17.mdx


🐟 Hopping through code like a bass in a meeting stream! Let's dive into these API updates. 🐟

# API Updates - April 17, 2025

<Callout type="info">
  This update focuses on enhancing the API service with improvements to routing, authentication, and bot interactions.
</Callout>

## Key Changes

### Route Path Parameter Updates
- Transitioned route path parameters from `{uuid}` to `:uuid` syntax
- Updated OpenAPI input declarations
- Refined documentation strings for endpoints

### Secret Management Enhancements
- Added `secret` field to `Account` and `WorkerBotMessage` structures
- Implemented database migration to include non-nullable `secret` column
- Integrated secret handling in S3 upload and bot configuration processes

### Meeting Bot Reliability Improvements
- Reduced maximum layout change retries
- Enhanced `isInMeeting` checks before and after critical UI actions
- Simplified bot presence detection logic

## Affected Components

<Files>
  <Folder name="api_server" defaultOpen>
    <Folder name="baas_engine">
      <File name="src/auth/data/get.rs" />
      <File name="src/meeting_bot/starter.rs" />
      <File name="src/schema.rs" />
      <File name="src/worker/worker_bot.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="src/main.rs" />
      <File name="src/routers.rs" />
    </Folder>
    <Folder name="migrations">
      <Folder name="2025-04-08-140628_add_secret_into_account">
        <File name="up.sql" />
        <File name="down.sql" />
      </Folder>
    </Folder>
  </Folder>
  <Folder name="meeting_bot" defaultOpen>
    <Folder name="recording_server">
      <File name="src/meeting/meet.ts" />
      <File name="src/utils/PathManager.ts" />
      <File name="src/utils/S3Uploader.ts" />
    </Folder>
  </Folder>
</Files>

## Highlights

<Tabs items={['Routing', 'Authentication', 'Bot Interactions']}>
  <Tab value="Routing">
    - Standardized route parameter syntax
    - Improved API documentation clarity
  </Tab>
  <Tab value="Authentication">
    - Introduced secret-based authentication
    - Enhanced account security mechanisms
  </Tab>
  <Tab value="Bot Interactions">
    - Reduced bot interaction failure points
    - Improved meeting presence detection
  </Tab>
</Tabs>

<Callout type="warn">
  These changes may require updates to existing integrations. Please review implementation details carefully.
</Callout>

---

## April 18, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-18.mdx


# 🐟 API Updates: Streamlining Credentials and Message Processing

<Callout type="info">
  Dive into the latest updates that keep our API swimming smoothly! 🏊‍♀️
</Callout>

## Key Updates

### Credential and Path Handling Improvements

<Steps>
  <Step>Enhanced AWS path generation with client secret integration</Step>
  <Step>Improved S3 recording path retrieval mechanisms</Step>
  <Step>Removed unnecessary fallback code</Step>
</Steps>

### RabbitMQ Message Processing Optimization

<Tabs items={['Before', 'After']}>
  <Tab value="Before">Potential race conditions in message handling</Tab>
  <Tab value="After">Serialized message processing with `isProcessing` flag</Tab>
</Tabs>

### Zoom Credential Management

<Callout type="warn">
  Custom Zoom credentials now implemented to improve authentication flexibility
</Callout>

## Changed Components

<Files>
  <Folder name="api_server" defaultOpen>
    <Folder name="baas_engine">
      <File name="src/bots/data/post.rs" />
      <File name="src/lib.rs" />
      <File name="src/s3/get_recording_path.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="src/bots/public.rs" />
    </Folder>
  </Folder>
  <Folder name="meeting_bot">
    <Folder name="recording_server">
      <File name="src/rabbitmq.ts" />
    </Folder>
  </Folder>
</Files>

## Performance Highlights

- 🚀 Improved error handling in S3 operations
- 🔒 Enhanced credential management
- 🐰 Optimized RabbitMQ message processing

<Callout type="info">
  These updates ensure more robust and efficient API operations behind the scenes.
</Callout>

---

## April 20, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-20.mdx


🐟 Hooked on Updates: Casting a Line into Our Latest API Improvements! 🐟

# API Updates - April 20, 2025

<Callout type="info">
  Quick Catch of the Day: Minor refinements to keep our API swimming smoothly!
</Callout>

## Key Changes

### Image Ratio Adjustment
- **Focus:** Correcting visual rendering precision
- **Impact:** Ensures consistent image display across platforms

### Syntax Refinement
- **Focus:** Code structure optimization
- **Impact:** Improved code readability and potential performance tweaks

## Affected Components

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="post.rs" />
    </Folder>
  </Folder>
  <Folder name="meeting_bot">
    <Folder name="recording_server">
      <File name="main.ts" />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  🚨 Heads Up: These updates are internal and do not directly impact external API contracts.
</Callout>

---

## April 22, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-22.mdx


# API Updates - April 22, 2025 🐟

<Callout type="info">
  Dive into the latest API improvements! We're scaling up our code like a bass swimming upstream. 🐟
</Callout>

## Overview of Changes

This update includes two primary merge requests focusing on documentation refinements and log upload processes.

### Documentation Refinement

<Steps>
  <Step>Updated schema documentation in `post.rs`</Step>
  <Step>Corrected typos and terminology</Step>
  <Step>Improved field descriptions</Step>
</Steps>

### Log Upload Enhancement

<Steps>
  <Step>Modified `PathManager` instantiation</Step>
  <Step>Added `secret` parameter to log upload process</Step>
  <Step>Improved path resolution for log files</Step>
</Steps>

## Key Files Updated

<Files>
  <Folder name="api_server">
    <Folder name="baas_engine">
      <File name="datetime.rs" />
      <File name="bots/data/post.rs" />
    </Folder>
    <Folder name="baas_handler">
      <File name="src/bots/public.rs" />
      <File name="src/routers.rs" />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  These changes are internal and do not directly impact external API consumers.
</Callout>

---

## April 23, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-23.mdx


# 🐟 API Updates - April 23, 2025

<Callout type="info">
Dive into the latest updates for our Meeting Bass API! 🎣 Just like a skilled angler, we've been refining our code to catch the best performance.
</Callout>

## Key Changes

### S3 Uploader Singleton Refactoring

<Steps>
<Step>Implemented singleton pattern for `S3Uploader`</Step>
<Step>Enhanced error handling and file existence checks</Step>
<Step>Consolidated S3 utility functions</Step>
</Steps>

### Logging Improvements

<Tabs items={['Before', 'After']}>
<Tab value="Before">
- Separate S3 utility files
- Limited error handling
</Tab>
<Tab value="After">
- Centralized S3 upload management
- Robust error logging
- Automatic crash log uploads
</Tab>
</Tabs>

### File Changes

<Files>
<Folder name="meeting_bot/recording_server/src" defaultOpen>
    <Folder name="utils">
        <File name="S3Uploader.ts" />
        <File name="pinoLogger.ts" />
        <File name="takeScreenshot.ts" />
    </Folder>
    <Folder name="recording">
        <File name="AudioExtractor.ts" />
        <File name="Transcoder.ts" />
    </Folder>
    <File name="main.ts" />
</Folder>
</Files>

### Sequence of Changes

```mermaid
sequenceDiagram
    participant App
    participant S3Uploader
    participant S3
    participant FS
    App->>S3Uploader: getInstance()
    App->>FS: Check file existence
    alt File Exists
        App->>S3Uploader: Upload File
        S3Uploader->>S3: Upload via AWS CLI
    else File Missing
        S3Uploader-->>App: Throw Error
    end
```

### Improvements Highlights

<TypeTable 
    type={{
        singletonPattern: {
            description: 'Ensures single S3Uploader instance',
            type: 'Design Pattern',
            default: 'Multiple instances'
        },
        errorHandling: {
            description: 'Enhanced error detection and logging',
            type: 'Robustness',
            default: 'Basic error handling'
        }
    }}
/>

---

## April 24, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-24.mdx


<Callout type="warn">
  This page contains automatically generated documentation based on Git activity related to the API service. 
  For the latest version of this content, please refer to the latest Git update.
</Callout>

# API Updates - April 24, 2025

## Commits

### first commit for auth.meetingbaas.com

**Author:** Lazare Rossillon

**Date:** 2025-04-24 14:42:18 +0200

**Hash:** `a869b844dbe2cb36c04696f64f8a8f8a7c195a67`

**Related PR/MR:** None found



## Changed Files

- 🔌 `api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql`
- 🔌 `api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql`
- 🔌 `api_server/migrations/2025-04-24-123941_better_auth_integration_continued/down.sql`
- 🔌 `api_server/migrations/2025-04-24-123941_better_auth_integration_continued/up.sql`
- 🤖 `meeting_bot/zoom/scripts/run.sh`

## Pull Request Comments

No pull request comments. 

## Code Diffs

<Callout type="info">
  Code diffs require the `--with-diff --include-code` flags when running git_grepper.sh.
  
  For detailed diffs, please use the git command line or a git UI tool to view changes between commits.
</Callout> 

---

## April 25, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-25.mdx


<Callout type="warn">
  This page contains automatically generated documentation based on Git activity related to the API service. 
  For the latest version of this content, please refer to the latest Git update.
</Callout>

# API Updates - April 25, 2025

## Commits

### Compilation after migration

**Author:** mordak

**Date:** 2025-04-25 15:23:59 +0200

**Hash:** `a50a3f2b24fbc1dd1dcade9502a2decb9e23e6a9`

**Related PR/MR:** None found



### factorize migrations

**Author:** mordak

**Date:** 2025-04-25 15:01:47 +0200

**Hash:** `9e2278c2b4c154d551e7801f48d65cba723e18f9`

**Related PR/MR:** None found



### Add Last boilerplates into run.sh Zoom script

**Author:** mordak

**Date:** 2025-04-25 09:42:13 +0200

**Hash:** `0ac6247d59e2f52f8df00d2d097cfe0c4a63587c`

**Related PR/MR:** None found



## Changed Files

- 🔌 `api_server/baas_engine/src/auth/data/get.rs`
- 🔌 `api_server/baas_engine/src/schema.rs`
- 🔌 `api_server/baas_handler/src/auth/handler.rs`
- 🔌 `api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql`
- 🔌 `api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql`
- 🤖 `meeting_bot/zoom/scripts/run.sh`

## Pull Request Comments

No pull request comments. 

## Code Diffs

<Callout type="info">
  Code diffs require the `--with-diff --include-code` flags when running git_grepper.sh.
  
  For detailed diffs, please use the git command line or a git UI tool to view changes between commits.
</Callout> 

---

## April 28, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-04-28.mdx


<Callout type="warn">
  This page contains automatically generated documentation based on Git activity related to the API service. 
  For the latest version of this content, please refer to the latest Git update.
</Callout>

# API Updates - April 28, 2025

## Commits

### Add -no-listen script feature

**Author:** mordak

**Date:** 2025-04-28 15:26:08 +0200

**Hash:** `cc14fc3b14a7b60bbff81c82b9c7ca8ac2542452`

**Related PR/MR:** None found



### Hide GLADIA and RUNPOD api_keys into .env

**Author:** mordak

**Date:** 2025-04-28 15:26:08 +0200

**Hash:** `1953cfd5e417e41be07a83fa9960c445226ef468`

**Related PR/MR:** None found



### Unmute the cow

**Author:** mordak

**Date:** 2025-04-28 15:26:08 +0200

**Hash:** `ddea9e3f38efbd2af855bc0ac96a50b984eb5c7d`

**Related PR/MR:** None found



### Zoom lib part

**Author:** mordak

**Date:** 2025-04-28 15:26:08 +0200

**Hash:** `eaa8e394378a8675c7de14d2d6612254ba088477`

**Related PR/MR:** None found



### CPP boilerplate for unmute audio

**Author:** mordak

**Date:** 2025-04-28 15:26:08 +0200

**Hash:** `2274b9dc56ae9d96da0454265ecc892e8105c722`

**Related PR/MR:** None found



### Add Last boilerplates into run.sh Zoom script

**Author:** mordak

**Date:** 2025-04-28 15:26:08 +0200

**Hash:** `93432ba37d8ee89b6bbc656fa778b58dc33effe5`

**Related PR/MR:** None found



### fix: re-add password requirement

**Author:** Lazare Rossillon

**Date:** 2025-04-28 00:18:48 +0200

**Hash:** `2818f14c0cd10e670cd346d9467d09b04c415818`

**Related PR/MR:** None found



## Changed Files

- 🔌 `api_server/baas_engine/src/auth/data/get.rs`
- 🔌 `api_server/baas_engine/src/schema.rs`
- 🔌 `api_server/baas_handler/src/auth/handler.rs`
- 🔌 `api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql`
- 🔌 `api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql`
- 🖥️ `meeting_bot/recording_server/package-lock.json`
- 📦 `meeting_bot/recording_server/package.json`
- 📦 `meeting_bot/recording_server/src/main.ts`
- 📦 `meeting_bot/recording_server/src/state-machine/states/initialization-state.ts`
- 📦 `meeting_bot/recording_server/src/utils/pinoLogger.ts`
- 🖥️ `meeting_bot/recording_server/yarn.lock`
- 🤖 `meeting_bot/zoom/.env`
- 🤖 `meeting_bot/zoom/client/src/async_runtime.rs`
- 🤖 `meeting_bot/zoom/client/src/async_runtime/transcribe/gladia.rs`
- 🤖 `meeting_bot/zoom/client/src/engine.rs`
- 🤖 `meeting_bot/zoom/client/src/main.rs`
- 🤖 `meeting_bot/zoom/scripts/run.sh`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/build.rs`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/src/bindings.rs`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/src/services/meeting_service.rs`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/src/services/meeting_service/audio_controller.rs`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/c_meeting_service_interface.cpp`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/c_meeting_service_interface.h`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/modules/c_meeting_audio_interface.cpp`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/modules/c_meeting_audio_interface.h`

## Pull Request Comments

No pull request comments. 

## Code Diffs

<Callout type="info">
  Code diffs require the `--with-diff --include-code` flags when running git_grepper.sh.
  
  For detailed diffs, please use the git command line or a git UI tool to view changes between commits.
</Callout> 

---

## May 6, 2025

API - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/api-2025-05-06.mdx


<Callout type="warn">
  This page contains automatically generated documentation based on Git activity related to the API service. 
  For the latest version of this content, please refer to the latest Git update.
</Callout>

# API Updates - May 6, 2025

## Commits

### Merge branch 'reput_resync_all' into 'master'

**Author:** MordakLaVache

**Date:** 2025-05-06 14:10:59 +0000

**Hash:** `b2bc83a1ea29181a0bc2cf23e10891352873e30e`

**Related PR/MR:** GitLab MR !197 (https://gitlab.com/spoke-app/meeting-baas/-/merge_requests/197)



### Merge branch 'better_auth_integration' into 'master'

**Author:** MordakLaVache

**Date:** 2025-05-06 14:04:53 +0000

**Hash:** `ea8c5f185b278215b38cd565c014c4030fd13ed9`

**Related PR/MR:** GitLab MR !222 (https://gitlab.com/spoke-app/meeting-baas/-/merge_requests/222)



### Merge branch 'got_it_popup' into 'master'

**Author:** MordakLaVache

**Date:** 2025-05-06 13:29:49 +0000

**Hash:** `218c53ca174801446fbf82a684da36367c07071c`

**Related PR/MR:** GitLab MR !229 (https://gitlab.com/spoke-app/meeting-baas/-/merge_requests/229)



### Merge branch 'reput_resync_all' into 'master'

**Author:** MordakLaVache

**Date:** 2025-05-06 14:10:59 +0000

**Hash:** `b2bc83a1ea29181a0bc2cf23e10891352873e30e`

**Related PR/MR:** GitLab MR !197 (https://gitlab.com/spoke-app/meeting-baas/-/merge_requests/197)



### Merge branch 'better_auth_integration' into 'master'

**Author:** MordakLaVache

**Date:** 2025-05-06 14:04:53 +0000

**Hash:** `ea8c5f185b278215b38cd565c014c4030fd13ed9`

**Related PR/MR:** GitLab MR !222 (https://gitlab.com/spoke-app/meeting-baas/-/merge_requests/222)



### Merge branch 'got_it_popup' into 'master'

**Author:** MordakLaVache

**Date:** 2025-05-06 13:29:49 +0000

**Hash:** `218c53ca174801446fbf82a684da36367c07071c`

**Related PR/MR:** GitLab MR !229 (https://gitlab.com/spoke-app/meeting-baas/-/merge_requests/229)



### more resilient dialog observer

**Author:** Philippe Drion

**Date:** 2025-05-06 15:25:01 +0200

**Hash:** `b2b70dbe2739883b4279b88a4f7e9c3f21df358a`

**Related PR/MR:** None found



### Lisible logs

**Author:** Philippe Drion

**Date:** 2025-05-06 15:24:57 +0200

**Hash:** `0d9876c743af4c40d8f110d0fca3f6ec77c46882`

**Related PR/MR:** None found



## Changed Files

- 🔌 `api_server/baas_engine/src/auth/data/get.rs`
- 🔌 `api_server/baas_engine/src/schema.rs`
- 🔌 `api_server/baas_handler/src/auth/handler.rs`
- 🔌 `api_server/baas_handler/src/routers.rs`
- 🔌 `api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql`
- 🔌 `api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql`
- 📦 `meeting_bot/recording_server/src/state-machine/states/base-state.ts`
- 📦 `meeting_bot/recording_server/src/state-machine/states/recording-state.ts`
- 📦 `meeting_bot/recording_server/src/state-machine/types.ts`
- 🤖 `meeting_bot/zoom/.env`
- 🤖 `meeting_bot/zoom/client/src/async_runtime.rs`
- 🤖 `meeting_bot/zoom/client/src/async_runtime/transcribe/gladia.rs`
- 🤖 `meeting_bot/zoom/client/src/engine.rs`
- 🤖 `meeting_bot/zoom/client/src/main.rs`
- 🤖 `meeting_bot/zoom/scripts/run.sh`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/build.rs`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/src/bindings.rs`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/src/services/meeting_service.rs`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/src/services/meeting_service/audio_controller.rs`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/c_meeting_service_interface.cpp`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/c_meeting_service_interface.h`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/modules/c_meeting_audio_interface.cpp`
- 🤖 `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/modules/c_meeting_audio_interface.h`

## Pull Request Comments

### Comments for "Merge branch 'reput_resync_all' into 'master'"

> MR COMMENTS:

> Author: MordakLaVache

> Date: 2025-05-06T14:11:08.693Z

> mentioned in commit b2bc83a1ea29181a0bc2cf23e10891352873e30e

> Author: MordakLaVache

> Date: 2025-04-11T13:19:53.821Z

> approved this merge request

> Author: MordakLaVache

> Date: 2025-04-11T13:18:28.985Z

> &lt;div&gt;changed title from &lt;code class="idiff"&gt;&lt;span class="idiff left right deletion"&gt;🐷&lt;/span&gt; fix: reput resync all&lt;/code&gt; to &lt;code class="idiff"&gt;&lt;span class="idiff left right addition"&gt;🐰&lt;/span&gt; fix: reput resync all&lt;/code&gt;&lt;/div&gt;

> Author: MordakLaVache

> Date: 2025-04-11T13:18:01.652Z

> &lt;div&gt;changed title from &lt;code class="idiff"&gt;fix: reput resync all&lt;/code&gt; to &lt;code class="idiff"&gt;&lt;span class="idiff left right addition"&gt;🐷 &lt;/span&gt;fix: reput resync all&lt;/code&gt;&lt;/div&gt;

> Author: Philippe Drion

> Date: 2025-04-04T09:17:35.574Z

> approved this merge request

> Author: Lazare Rossillon

> Date: 2025-04-04T09:16:50.609Z

> requested review from @PhilippeDrion

> Author: Lazare Rossillon

> Date: 2025-04-04T09:16:46.718Z

> assigned to @Lazare-42

### Comments for "Merge branch 'better_auth_integration' into 'master'"

> MR COMMENTS:

> Author: MordakLaVache

> Date: 2025-05-06T14:04:59.516Z

> approved this merge request

> Author: MordakLaVache

> Date: 2025-05-06T14:04:59.418Z

> mentioned in commit ea8c5f185b278215b38cd565c014c4030fd13ed9

> Author: MordakLaVache

> Date: 2025-05-06T14:04:29.471Z

> resolved all threads

> Author: Lazare Rossillon

> Date: 2025-04-27T22:18:52.929Z

> added 1 commit

> &lt;ul&gt;&lt;li&gt;2818f14c - fix: re-add password requirement&lt;/li&gt;&lt;/ul&gt;

> &#91;Compare with previous version&#93;(/spoke-app/meeting-baas/-/merge_requests/222/diffs?diff_id=1339921686&start_sha=a50a3f2b24fbc1dd1dcade9502a2decb9e23e6a9)

> Author: MordakLaVache

> Date: 2025-04-25T13:53:14.352Z

> left review comments

> Author: MordakLaVache

> Date: 2025-04-25T13:53:13.907Z

> Dans la case PseudoPassword (Pourquou pseudo d'ailleurs ?), on checkera si passord de account est une option ou non, c'est incoherent as fuck.

> Author: MordakLaVache

> Date: 2025-04-25T13:24:10.987Z

> added 1 commit

> &lt;ul&gt;&lt;li&gt;a50a3f2b - Compilation after migration&lt;/li&gt;&lt;/ul&gt;

> &#91;Compare with previous version&#93;(/spoke-app/meeting-baas/-/merge_requests/222/diffs?diff_id=1338948147&start_sha=9e2278c2b4c154d551e7801f48d65cba723e18f9)

> Author: Rabbit Meeting Baas

> Date: 2025-04-25T13:02:45.750Z

> changed the description

> Author: MordakLaVache

> Date: 2025-04-25T13:02:14.035Z

> added 1 commit

> &lt;ul&gt;&lt;li&gt;9e2278c2 - factorize migrations&lt;/li&gt;&lt;/ul&gt;

> &#91;Compare with previous version&#93;(/spoke-app/meeting-baas/-/merge_requests/222/diffs?diff_id=1338911818&start_sha=a869b844dbe2cb36c04696f64f8a8f8a7c195a67)

> Author: MordakLaVache

> Date: 2025-04-24T16:57:06.797Z

> &lt;p&gt;changed title from &lt;code class="idiff"&gt;first commit for auth.meetingbaas.com&lt;/code&gt; to &lt;code class="idiff"&gt;&lt;span class="idiff left right addition"&gt;🐰 &lt;/span&gt;first commit for auth.meetingbaas.com&lt;/code&gt;&lt;/p&gt;

> Author: Rabbit Meeting Baas

> Date: 2025-04-24T12:42:46.691Z

> changed the description

> Author: Lazare Rossillon

> Date: 2025-04-24T12:42:35.558Z

> requested review from @mordaklavache

> Author: Lazare Rossillon

> Date: 2025-04-24T12:42:31.008Z

> assigned to @Lazare-42

> Author: Rabbit Meeting Baas

> Date: 2025-04-24T12:42:30.671Z

> &lt;&#33;-- This is an auto-generated comment: summarize by coderabbit.ai --&gt;

> &lt;&#33;-- walkthrough_start --&gt;

> ## Walkthrough

> This change introduces a database migration that enhances authentication-related functionality. The `accounts` table is updated with new columns for full name, email verification status, image, and an updated timestamp, while the password column is made nullable and a unique constraint is added to the email field. Three new tables—`provider_accounts`, `sessions`, and `verifications`—are created to support external authentication providers, session management, and verification workflows. Associated indexes and foreign key constraints are established for referential integrity and performance. The corresponding down migration reverses these changes, removing the new columns, tables, constraints, and indexes. Additionally, the `Account` data structure is extended with new optional fields, and the password verification logic in the login handler is updated to handle nullable passwords and unimplemented cases explicitly.

> ## Changes

> | File(s)                                                                                  | Change Summary                                                                                                                                                                                                                                    |

> |-----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> | api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql                  | Adds new columns to `accounts`, modifies constraints, and creates `provider_accounts`, `sessions`, and `verifications` tables with appropriate indexes and foreign keys for improved authentication integration.                                  |

> | api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql                | Reverses the changes made in the up migration: removes new columns and constraints from `accounts`, drops `provider_accounts`, `sessions`, and `verifications` tables, and deletes associated indexes and foreign key constraints.                |

> | api_server/baas_engine/src/auth/data/get.rs                                            | Changes `Account` struct: makes `password` optional and adds optional fields `full_name`, `email_verified`, `image`, and a non-optional `updated_at` timestamp to extend account data model.                                                       |

> | api_server/baas_engine/src/schema.rs                                                   | Updates schema for `accounts` table (nullable password, new columns), adds new tables `provider_accounts`, `sessions`, and `verifications` with their columns, foreign keys, and joinable relationships.                                           |

> | api_server/baas_handler/src/auth/handler.rs                                           | Modifies password verification logic in login handler to first check master password, then account password if present, and explicitly marks unimplemented handling for accounts without passwords using `todo&#33;()`.                              |

> ## Sequence Diagram(s)

```mermaid

> sequenceDiagram

> participant User

> participant AccountsDB

> participant ProviderAccountsDB

> participant SessionsDB

> participant VerificationsDB

> participant AuthHandler

> User-&gt;&gt;AuthHandler: Login with credentials

> AuthHandler-&gt;&gt;AccountsDB: Fetch account by email

> AuthHandler-&gt;&gt;AuthHandler: Check master password match?

> alt Master password matches

> AuthHandler--&gt;&gt;User: Login success

> else Master password does not match

> alt Account password exists

> AuthHandler-&gt;&gt;AuthHandler: Verify password

> alt Password valid

> AuthHandler--&gt;&gt;User: Login success

> else Password invalid

> AuthHandler--&gt;&gt;User: Bad password error

> end

> else Account password is None

> AuthHandler--&gt;&gt;User: Not implemented error (todo&#33;)

> end

> end

> User-&gt;&gt;AccountsDB: Register / Update account (full_name, email_verified, image, updated_at)

> User-&gt;&gt;ProviderAccountsDB: Link external provider account

> User-&gt;&gt;SessionsDB: Create session (token, user_id, etc.)

> User-&gt;&gt;VerificationsDB: Request verification (identifier, value, expires_at)

> AccountsDB--&gt;&gt;User: Confirmation/Status

> ProviderAccountsDB--&gt;&gt;User: Provider link status

> SessionsDB--&gt;&gt;User: Session token

> VerificationsDB--&gt;&gt;User: Verification status

```

> ## Poem

> &gt; 🐇 In fields of code where data grows,

> &gt; New columns bloom, and logic flows.

> &gt; Sessions hop and tokens gleam,

> &gt; Provider links join the team.

> &gt; Passwords optional, checks anew,

> &gt; This migration brings fresh clues&#33;

> &gt; ✨🌿

> &lt;&#33;-- walkthrough_end --&gt;

> ---

> &lt;details&gt;

> &lt;summary&gt;📜 Recent review details&lt;/summary&gt;

> **Configuration used: CodeRabbit UI**

> **Review profile: ASSERTIVE**

> **Plan: Free**

> &lt;details&gt;

> &lt;summary&gt;📥 Commits&lt;/summary&gt;

> Reviewing files that changed from the base of the PR and between a50a3f2b24fbc1dd1dcade9502a2decb9e23e6a9 and 2818f14c0cd10e670cd346d9467d09b04c415818.

> &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;📒 Files selected for processing (2)&lt;/summary&gt;

> * `api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql` (1 hunks)

> * `api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql` (1 hunks)

> &lt;/details&gt;

> &lt;/details&gt;

> &lt;&#33;-- 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 --&gt;

> &lt;&#33;-- tips_start --&gt;

> ---

> &gt; 📝 **NOTE**

> &gt; &lt;details&gt;

> &gt; &lt;summary&gt;🎁 Summarized by CodeRabbit Free&lt;/summary&gt;

> &gt;

> &gt; Your organization is on the Free plan. CodeRabbit will generate a high-level summary and a walkthrough for each pull request. For a comprehensive line-by-line review, please upgrade your subscription to CodeRabbit Pro by visiting &lt;https://app.coderabbit.ai/login&gt;.

> &gt;

> &gt; &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;🪧 Tips&lt;/summary&gt;

> ### Chat

> There are 3 ways to chat with &#91;CodeRabbit&#93;(https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=spoke-app/meeting-baas&utm_content=222):

> - Review comments: Directly reply to a review comment made by CodeRabbit. Example:

> - `I pushed a fix in commit &lt;commit_id&gt;, please review it.`

> - `Generate unit testing code for this file.`

> - Files and specific lines of code (under the "Files changed" tab): Tag `@rabbitformeetingbaas` in a new review comment at the desired location with your query. Examples:

> - `@rabbitformeetingbaas generate unit testing code for this file.`

> -	`@rabbitformeetingbaas modularize this function.`

> - PR comments: Tag `@rabbitformeetingbaas` in a new PR comment to ask questions about the PR branch. For the best results, please provide a very specific query, as very limited context is provided in this mode. Examples:

> - `@rabbitformeetingbaas gather interesting stats about this repository and render them as a table. Additionally, render a pie chart showing the language distribution in the codebase.`

> - `@rabbitformeetingbaas read src/utils.ts and generate unit testing code.`

> - `@rabbitformeetingbaas read the files in the src/scheduler package and generate a class diagram using mermaid and a README in the markdown format.`

> - `@rabbitformeetingbaas help me debug CodeRabbit configuration file.`

> Note: Be mindful of the bot's finite context window. It's strongly recommended to break down tasks such as reading entire modules into smaller chunks. For a focused discussion, use review comments to chat about specific files and their changes, instead of using the PR comments.

> ### CodeRabbit Commands (Invoked using PR comments)

> - `@rabbitformeetingbaas pause` to pause the reviews on a PR.

> - `@rabbitformeetingbaas resume` to resume the paused reviews.

> - `@rabbitformeetingbaas review` to trigger an incremental review. This is useful when automatic reviews are disabled for the repository.

> - `@rabbitformeetingbaas full review` to do a full review from scratch and review all the files again.

> - `@rabbitformeetingbaas summary` to regenerate the summary of the PR.

> - `@rabbitformeetingbaas generate sequence diagram` to generate a sequence diagram of the changes in this PR.

> - `@rabbitformeetingbaas resolve` resolve all the CodeRabbit review comments.

> - `@rabbitformeetingbaas configuration` to show the current CodeRabbit configuration for the repository.

> - `@rabbitformeetingbaas help` to get help.

> ### Other keywords and placeholders

> - Add `@rabbitformeetingbaas ignore` anywhere in the PR description to prevent this PR from being reviewed.

> - Add `@rabbitformeetingbaas summary` or `@coderabbitai summary` to generate the high-level summary at a specific location in the PR description.

> - Add `@rabbitformeetingbaas` or `@coderabbitai` anywhere in the PR title to generate the title automatically.

> ### CodeRabbit Configuration File (`.coderabbit.yaml`)

> - You can programmatically configure CodeRabbit by adding a `.coderabbit.yaml` file to the root of your repository.

> - Please see the &#91;configuration documentation&#93;(https://docs.coderabbit.ai/guides/configure-coderabbit) for more information.

> - If your editor has YAML language server enabled, you can add the path at the top of this file to enable auto-completion and validation: `# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json`

> ### Documentation and Community

> - Visit our &#91;Documentation&#93;(https://docs.coderabbit.ai) for detailed information on how to use CodeRabbit.

> - Join our &#91;Discord Community&#93;(http://discord.gg/coderabbit) to get help, request features, and share feedback.

> - Follow us on &#91;X/Twitter&#93;(https://twitter.com/coderabbitai) for updates and announcements.

> &lt;/details&gt;

> &lt;&#33;-- tips_end --&gt;

### Comments for "Merge branch 'got_it_popup' into 'master'"

> MR COMMENTS:

> Author: MordakLaVache

> Date: 2025-05-06T13:29:51.708Z

> mentioned in commit 218c53ca174801446fbf82a684da36367c07071c

> Author: Philippe Drion

> Date: 2025-05-06T13:25:30.854Z

> added 3 commits

> &lt;ul&gt;&lt;li&gt;0ac6247d - 1 commit from branch &lt;code&gt;master&lt;/code&gt;&lt;/li&gt;&lt;li&gt;0d9876c7 - Lisible logs&lt;/li&gt;&lt;li&gt;b2b70dbe - more resilient dialog observer&lt;/li&gt;&lt;/ul&gt;

> &#91;Compare with previous version&#93;(/spoke-app/meeting-baas/-/merge_requests/229/diffs?diff_id=1348339083&start_sha=bd6273d7b1d44a30ea929275ff886f1a989d1c79)

> Author: Rabbit Meeting Baas

> Date: 2025-05-06T13:22:07.910Z

> changed the description

> Author: Rabbit Meeting Baas

> Date: 2025-05-06T13:20:53.128Z

> &lt;&#33;-- This is an auto-generated comment: summarize by coderabbit.ai --&gt;

> &lt;&#33;-- walkthrough_start --&gt;

> ## Walkthrough

> This update introduces a new modular transcription system for Zoom bots, adds robust logging and error tracking, and extends authentication and session management in the backend. The Zoom bot now logs transcription metadata, uploads logs to S3, and exposes audio control via FFI. The backend tracks transcription failures and supports new OAuth/session tables.

> ## Changes

> | Files / Paths                                                                                 | Change Summary                                                                                                                                                                                                                                                                                                                                                                            |

> |----------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> | api_server/Cargo.toml, meeting_bot/zoom/Cargo.toml, meeting_bot/zoom/client/Cargo.toml        | Workspace and dependency updates: added/linked `zoom-transcribe` crate, removed trailing commas.                                                                                                                                                                                                                                                  |

> | api_server/Dockerfile, api_server/update_docker_image.sh, api_server/zoom-transcribe          | Docker build and context scripts updated to include `zoom-transcribe` directory; new directory added.                                                                                                                                                                                                                                             |

> | api_server/baas_engine/Cargo.toml                                                            | Upgraded `reqwest-retry` and `reqwest-middleware` dependencies; added local `zoom-transcribe` crate.                                                                                                                                                                                                                                              |

> | api_server/baas_engine/src/auth/data/get.rs, .../schema.rs                                   | `Account` struct and DB schema extended: nullable password, added user metadata fields, new tables for OAuth/session/verification, and `transcription_fails` column for bots.                                                                                                                               |

> | api_server/baas_engine/src/bots/data/get.rs, .../patch.rs, .../post.rs, .../consumption.rs   | `Bot` struct extended with `transcription_fails`; transcript logic refactored for diarization; duration calculation renamed; new logic for transcript-word association.                                                                                                                                    |

> | api_server/baas_engine/src/bots/utils.rs, .../src/webhook.rs, .../src/s3/logs.rs             | Platform detection now uses a strongly typed enum; webhook flow distinguishes incomplete/failed transcriptions; S3 log utilities added.                                                                                                                             |

> | api_server/baas_engine/src/transcriber/transcribe.rs, .../retry.rs, .../s3/get_recording_path.rs | Removed unused imports and transcript display code; simplified logging.                                                                                                                                                                                                                                    |

> | api_server/baas_handler/src/auth/handler.rs, .../bots/internal.rs, .../public.rs, .../calendar/api.rs, .../main.rs, .../routers.rs, .../tests/calendar.rs, .../webhook_schemas.rs | Password logic clarified; transcription fail count handled in bot endpoints; platform stats use enums; async calendar sync commented out; formatting and whitespace cleanups.                                                                                       |

> | api_server/migrations/2025-04-24-122051_better_auth_integration/*, .../2025-04-28-131737_add_colum_transcripition_fail_into_bot/* | DB migrations: add/remove user metadata columns, OAuth/session/verification tables, and `transcription_fails` to bots.                                                                                                                                                                                    |

> | api_server/rust-toolchain                                                                  | Rust version bumped from 1.82.0 to 1.85.0.                                                                                                                                                                                                                                                                |

> | meeting_bot/recording_server/package.json, .../src/main.ts, .../states/base-state.ts, .../states/initialization-state.ts, .../states/recording-state.ts, .../types.ts, .../utils/Logger.ts | Switched logging from `pino` to `winston`; added dialog observer heartbeat for robustness; extended context type; minor import and logic adjustments.                                                                                                               |

> | meeting_bot/zoom/.env, .../scripts/run.sh                                                  | Added API keys for Gladia/Runpod; updated sample config and meeting URL.                                                                                                                                                                                                                                  |

> | meeting_bot/zoom/client/src/async_runtime.rs, .../transcribe.rs, .../components/speech_to_text.rs, .../engine.rs, .../main.rs, .../remote_service.rs | Modularized transcription with provider abstraction; logs transcription metadata; uploads logs to S3; tracks transcription failures; exposes audio control; fetches API keys from env.                                                                              |

> | meeting_bot/zoom/zoom-sdk-linux-rs/build.rs, .../src/services/meeting_service.rs, .../audio_controller.rs, .../wrapper-cpp/* | Added FFI bindings and Rust module for meeting audio controller (unmute); build script updated to include audio module.                                                                                                                                                                                    |

> | meeting_bot/zoom/zoom-transcribe/Cargo.toml, .../src/lib.rs, .../src/providers/gladia.rs, .../src/providers/runpod.rs | New `zoom-transcribe` crate: provides provider-agnostic transcription with middleware, retry, and timestamp alignment; provider implementations generic over middleware.                                                                                            |

> ## Sequence Diagram(s)

```mermaid

> sequenceDiagram

> participant ZoomBot

> participant ZoomTranscribe

> participant S3

> participant Backend

> participant User

> User-&gt;&gt;ZoomBot: Start meeting

> ZoomBot-&gt;&gt;ZoomBot: Record audio, collect timestamps

> ZoomBot-&gt;&gt;ZoomTranscribe: start(provider, api_key, record_start_time, s3_url, user_id, ts, middleware)

> ZoomTranscribe-&gt;&gt;Provider: Transcribe audio (Gladia/Runpod)

> Provider--&gt;&gt;ZoomTranscribe: Transcription result (words)

> ZoomTranscribe-&gt;&gt;ZoomBot: Return words (timestamps aligned)

> ZoomBot-&gt;&gt;S3: Upload logs (Zoom and transcription)

> ZoomBot-&gt;&gt;Backend: Send words, transcription_fail_count

> Backend-&gt;&gt;User: Webhook (Complete or Incomplete, based on transcription_fail_count)

```

> ## Poem

> &gt; 🐇

> &gt; New words are whispered, logs now sing,

> &gt; With audio control, the Zoom bots spring.

> &gt; Transcriptions retry, and failures are tracked,

> &gt; OAuth and sessions keep users intact.

> &gt; Winston logs shine where Pino once stood—

> &gt; A leap for the code, as all rabbits would&#33;

> &gt; 🥕

> &lt;&#33;-- walkthrough_end --&gt;

> ---

> &lt;details&gt;

> &lt;summary&gt;📜 Recent review details&lt;/summary&gt;

> **Configuration used: CodeRabbit UI**

> **Review profile: ASSERTIVE**

> **Plan: Free**

> &lt;details&gt;

> &lt;summary&gt;📥 Commits&lt;/summary&gt;

> Reviewing files that changed from the base of the PR and between 90994f7db704ce1dbabc552fd232c5226c051d05 and bd6273d7b1d44a30ea929275ff886f1a989d1c79.

> &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;⛔ Files ignored due to path filters (4)&lt;/summary&gt;

> * `api_server/Cargo.lock` is excluded by `&#33;**/*.lock`

> * `meeting_bot/recording_server/package-lock.json` is excluded by `&#33;**/package-lock.json`

> * `meeting_bot/recording_server/yarn.lock` is excluded by `&#33;**/yarn.lock`, `&#33;**/*.lock`

> * `meeting_bot/zoom/Cargo.lock` is excluded by `&#33;**/*.lock`

> &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;📒 Files selected for processing (58)&lt;/summary&gt;

> * `api_server/Cargo.toml` (1 hunks)

> * `api_server/Dockerfile` (2 hunks)

> * `api_server/baas_engine/Cargo.toml` (1 hunks)

> * `api_server/baas_engine/src/auth/data/get.rs` (3 hunks)

> * `api_server/baas_engine/src/bots/consumption.rs` (3 hunks)

> * `api_server/baas_engine/src/bots/data/get.rs` (2 hunks)

> * `api_server/baas_engine/src/bots/data/patch.rs` (1 hunks)

> * `api_server/baas_engine/src/bots/data/post.rs` (2 hunks)

> * `api_server/baas_engine/src/bots/utils.rs` (4 hunks)

> * `api_server/baas_engine/src/s3/get_recording_path.rs` (0 hunks)

> * `api_server/baas_engine/src/s3/logs.rs` (2 hunks)

> * `api_server/baas_engine/src/schema.rs` (8 hunks)

> * `api_server/baas_engine/src/transcriber/retry.rs` (0 hunks)

> * `api_server/baas_engine/src/transcriber/transcribe.rs` (1 hunks)

> * `api_server/baas_engine/src/webhook.rs` (3 hunks)

> * `api_server/baas_handler/src/auth/handler.rs` (1 hunks)

> * `api_server/baas_handler/src/bots/internal.rs` (7 hunks)

> * `api_server/baas_handler/src/bots/public.rs` (2 hunks)

> * `api_server/baas_handler/src/calendar/api.rs` (3 hunks)

> * `api_server/baas_handler/src/main.rs` (3 hunks)

> * `api_server/baas_handler/src/routers.rs` (18 hunks)

> * `api_server/baas_handler/src/tests/calendar.rs` (1 hunks)

> * `api_server/baas_handler/src/webhook_schemas.rs` (2 hunks)

> * `api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql` (1 hunks)

> * `api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql` (1 hunks)

> * `api_server/migrations/2025-04-28-131737_add_colum_transcripition_fail_into_bot/down.sql` (1 hunks)

> * `api_server/migrations/2025-04-28-131737_add_colum_transcripition_fail_into_bot/up.sql` (1 hunks)

> * `api_server/rust-toolchain` (1 hunks)

> * `api_server/update_docker_image.sh` (1 hunks)

> * `api_server/zoom-transcribe` (1 hunks)

> * `meeting_bot/recording_server/package.json` (1 hunks)

> * `meeting_bot/recording_server/src/main.ts` (1 hunks)

> * `meeting_bot/recording_server/src/state-machine/states/base-state.ts` (3 hunks)

> * `meeting_bot/recording_server/src/state-machine/states/initialization-state.ts` (1 hunks)

> * `meeting_bot/recording_server/src/state-machine/states/recording-state.ts` (0 hunks)

> * `meeting_bot/recording_server/src/state-machine/types.ts` (1 hunks)

> * `meeting_bot/recording_server/src/utils/Logger.ts` (5 hunks)

> * `meeting_bot/zoom/.env` (1 hunks)

> * `meeting_bot/zoom/Cargo.toml` (1 hunks)

> * `meeting_bot/zoom/client/Cargo.toml` (1 hunks)

> * `meeting_bot/zoom/client/src/async_runtime.rs` (7 hunks)

> * `meeting_bot/zoom/client/src/async_runtime/transcribe.rs` (4 hunks)

> * `meeting_bot/zoom/client/src/components/speech_to_text.rs` (1 hunks)

> * `meeting_bot/zoom/client/src/engine.rs` (1 hunks)

> * `meeting_bot/zoom/client/src/main.rs` (4 hunks)

> * `meeting_bot/zoom/client/src/remote_service.rs` (8 hunks)

> * `meeting_bot/zoom/scripts/run.sh` (2 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/build.rs` (2 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/src/services/meeting_service.rs` (5 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/src/services/meeting_service/audio_controller.rs` (1 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/c_meeting_service_interface.cpp` (1 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/c_meeting_service_interface.h` (1 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/modules/c_meeting_audio_interface.cpp` (1 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/modules/c_meeting_audio_interface.h` (1 hunks)

> * `meeting_bot/zoom/zoom-transcribe/Cargo.toml` (1 hunks)

> * `meeting_bot/zoom/zoom-transcribe/src/lib.rs` (1 hunks)

> * `meeting_bot/zoom/zoom-transcribe/src/providers/gladia.rs` (6 hunks)

> * `meeting_bot/zoom/zoom-transcribe/src/providers/runpod.rs` (3 hunks)

> &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;💤 Files with no reviewable changes (3)&lt;/summary&gt;

> * meeting_bot/recording_server/src/state-machine/states/recording-state.ts

> * api_server/baas_engine/src/s3/get_recording_path.rs

> * api_server/baas_engine/src/transcriber/retry.rs

> &lt;/details&gt;

> &lt;/details&gt;

> &lt;&#33;-- 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 --&gt;

> &lt;&#33;-- tips_start --&gt;

> ---

> &gt; 📝 **NOTE**

> &gt; &lt;details&gt;

> &gt; &lt;summary&gt;🎁 Summarized by CodeRabbit Free&lt;/summary&gt;

> &gt;

> &gt; Your organization is on the Free plan. CodeRabbit will generate a high-level summary and a walkthrough for each pull request. For a comprehensive line-by-line review, please upgrade your subscription to CodeRabbit Pro by visiting &lt;https://app.coderabbit.ai/login&gt;.

> &gt;

> &gt; &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;🪧 Tips&lt;/summary&gt;

> ### Chat

> There are 3 ways to chat with &#91;CodeRabbit&#93;(https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=spoke-app/meeting-baas&utm_content=229):

> - Review comments: Directly reply to a review comment made by CodeRabbit. Example:

> - `I pushed a fix in commit &lt;commit_id&gt;, please review it.`

> - `Generate unit testing code for this file.`

> - Files and specific lines of code (under the "Files changed" tab): Tag `@rabbitformeetingbaas` in a new review comment at the desired location with your query. Examples:

> - `@rabbitformeetingbaas generate unit testing code for this file.`

> -	`@rabbitformeetingbaas modularize this function.`

> - PR comments: Tag `@rabbitformeetingbaas` in a new PR comment to ask questions about the PR branch. For the best results, please provide a very specific query, as very limited context is provided in this mode. Examples:

> - `@rabbitformeetingbaas gather interesting stats about this repository and render them as a table. Additionally, render a pie chart showing the language distribution in the codebase.`

> - `@rabbitformeetingbaas read src/utils.ts and generate unit testing code.`

> - `@rabbitformeetingbaas read the files in the src/scheduler package and generate a class diagram using mermaid and a README in the markdown format.`

> - `@rabbitformeetingbaas help me debug CodeRabbit configuration file.`

> ### Support

> Need help? Join our &#91;Discord community&#93;(https://discord.gg/coderabbit) for assistance with any issues or questions.

> Note: Be mindful of the bot's finite context window. It's strongly recommended to break down tasks such as reading entire modules into smaller chunks. For a focused discussion, use review comments to chat about specific files and their changes, instead of using the PR comments.

> ### CodeRabbit Commands (Invoked using PR comments)

> - `@rabbitformeetingbaas pause` to pause the reviews on a PR.

> - `@rabbitformeetingbaas resume` to resume the paused reviews.

> - `@rabbitformeetingbaas review` to trigger an incremental review. This is useful when automatic reviews are disabled for the repository.

> - `@rabbitformeetingbaas full review` to do a full review from scratch and review all the files again.

> - `@rabbitformeetingbaas summary` to regenerate the summary of the PR.

> - `@rabbitformeetingbaas generate sequence diagram` to generate a sequence diagram of the changes in this PR.

> - `@rabbitformeetingbaas resolve` resolve all the CodeRabbit review comments.

> - `@rabbitformeetingbaas configuration` to show the current CodeRabbit configuration for the repository.

> - `@rabbitformeetingbaas help` to get help.

> ### Other keywords and placeholders

> - Add `@rabbitformeetingbaas ignore` anywhere in the PR description to prevent this PR from being reviewed.

> - Add `@rabbitformeetingbaas summary` or `@coderabbitai summary` to generate the high-level summary at a specific location in the PR description.

> - Add `@rabbitformeetingbaas` or `@coderabbitai` anywhere in the PR title to generate the title automatically.

> ### CodeRabbit Configuration File (`.coderabbit.yaml`)

> - You can programmatically configure CodeRabbit by adding a `.coderabbit.yaml` file to the root of your repository.

> - Please see the &#91;configuration documentation&#93;(https://docs.coderabbit.ai/guides/configure-coderabbit) for more information.

> - If your editor has YAML language server enabled, you can add the path at the top of this file to enable auto-completion and validation: `# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json`

> ### Documentation and Community

> - Visit our &#91;Documentation&#93;(https://docs.coderabbit.ai) for detailed information on how to use CodeRabbit.

> - Join our &#91;Discord Community&#93;(http://discord.gg/coderabbit) to get help, request features, and share feedback.

> - Follow us on &#91;X/Twitter&#93;(https://twitter.com/coderabbitai) for updates and announcements.

> &lt;/details&gt;

> &lt;&#33;-- tips_end --&gt;

> Author: Philippe Drion

> Date: 2025-05-06T13:20:37.084Z

> assigned to @PhilippeDrion

> Author: Philippe Drion

> Date: 2025-05-06T13:20:37.058Z

> requested review from @mordaklavache

### Comments for "Merge branch 'reput_resync_all' into 'master'"

> MR COMMENTS:

> Author: MordakLaVache

> Date: 2025-05-06T14:11:08.693Z

> mentioned in commit b2bc83a1ea29181a0bc2cf23e10891352873e30e

> Author: MordakLaVache

> Date: 2025-04-11T13:19:53.821Z

> approved this merge request

> Author: MordakLaVache

> Date: 2025-04-11T13:18:28.985Z

> &lt;div&gt;changed title from &lt;code class="idiff"&gt;&lt;span class="idiff left right deletion"&gt;🐷&lt;/span&gt; fix: reput resync all&lt;/code&gt; to &lt;code class="idiff"&gt;&lt;span class="idiff left right addition"&gt;🐰&lt;/span&gt; fix: reput resync all&lt;/code&gt;&lt;/div&gt;

> Author: MordakLaVache

> Date: 2025-04-11T13:18:01.652Z

> &lt;div&gt;changed title from &lt;code class="idiff"&gt;fix: reput resync all&lt;/code&gt; to &lt;code class="idiff"&gt;&lt;span class="idiff left right addition"&gt;🐷 &lt;/span&gt;fix: reput resync all&lt;/code&gt;&lt;/div&gt;

> Author: Philippe Drion

> Date: 2025-04-04T09:17:35.574Z

> approved this merge request

> Author: Lazare Rossillon

> Date: 2025-04-04T09:16:50.609Z

> requested review from @PhilippeDrion

> Author: Lazare Rossillon

> Date: 2025-04-04T09:16:46.718Z

> assigned to @Lazare-42

### Comments for "Merge branch 'better_auth_integration' into 'master'"

> MR COMMENTS:

> Author: MordakLaVache

> Date: 2025-05-06T14:04:59.516Z

> approved this merge request

> Author: MordakLaVache

> Date: 2025-05-06T14:04:59.418Z

> mentioned in commit ea8c5f185b278215b38cd565c014c4030fd13ed9

> Author: MordakLaVache

> Date: 2025-05-06T14:04:29.471Z

> resolved all threads

> Author: Lazare Rossillon

> Date: 2025-04-27T22:18:52.929Z

> added 1 commit

> &lt;ul&gt;&lt;li&gt;2818f14c - fix: re-add password requirement&lt;/li&gt;&lt;/ul&gt;

> &#91;Compare with previous version&#93;(/spoke-app/meeting-baas/-/merge_requests/222/diffs?diff_id=1339921686&start_sha=a50a3f2b24fbc1dd1dcade9502a2decb9e23e6a9)

> Author: MordakLaVache

> Date: 2025-04-25T13:53:14.352Z

> left review comments

> Author: MordakLaVache

> Date: 2025-04-25T13:53:13.907Z

> Dans la case PseudoPassword (Pourquou pseudo d'ailleurs ?), on checkera si passord de account est une option ou non, c'est incoherent as fuck.

> Author: MordakLaVache

> Date: 2025-04-25T13:24:10.987Z

> added 1 commit

> &lt;ul&gt;&lt;li&gt;a50a3f2b - Compilation after migration&lt;/li&gt;&lt;/ul&gt;

> &#91;Compare with previous version&#93;(/spoke-app/meeting-baas/-/merge_requests/222/diffs?diff_id=1338948147&start_sha=9e2278c2b4c154d551e7801f48d65cba723e18f9)

> Author: Rabbit Meeting Baas

> Date: 2025-04-25T13:02:45.750Z

> changed the description

> Author: MordakLaVache

> Date: 2025-04-25T13:02:14.035Z

> added 1 commit

> &lt;ul&gt;&lt;li&gt;9e2278c2 - factorize migrations&lt;/li&gt;&lt;/ul&gt;

> &#91;Compare with previous version&#93;(/spoke-app/meeting-baas/-/merge_requests/222/diffs?diff_id=1338911818&start_sha=a869b844dbe2cb36c04696f64f8a8f8a7c195a67)

> Author: MordakLaVache

> Date: 2025-04-24T16:57:06.797Z

> &lt;p&gt;changed title from &lt;code class="idiff"&gt;first commit for auth.meetingbaas.com&lt;/code&gt; to &lt;code class="idiff"&gt;&lt;span class="idiff left right addition"&gt;🐰 &lt;/span&gt;first commit for auth.meetingbaas.com&lt;/code&gt;&lt;/p&gt;

> Author: Rabbit Meeting Baas

> Date: 2025-04-24T12:42:46.691Z

> changed the description

> Author: Lazare Rossillon

> Date: 2025-04-24T12:42:35.558Z

> requested review from @mordaklavache

> Author: Lazare Rossillon

> Date: 2025-04-24T12:42:31.008Z

> assigned to @Lazare-42

> Author: Rabbit Meeting Baas

> Date: 2025-04-24T12:42:30.671Z

> &lt;&#33;-- This is an auto-generated comment: summarize by coderabbit.ai --&gt;

> &lt;&#33;-- walkthrough_start --&gt;

> ## Walkthrough

> This change introduces a database migration that enhances authentication-related functionality. The `accounts` table is updated with new columns for full name, email verification status, image, and an updated timestamp, while the password column is made nullable and a unique constraint is added to the email field. Three new tables—`provider_accounts`, `sessions`, and `verifications`—are created to support external authentication providers, session management, and verification workflows. Associated indexes and foreign key constraints are established for referential integrity and performance. The corresponding down migration reverses these changes, removing the new columns, tables, constraints, and indexes. Additionally, the `Account` data structure is extended with new optional fields, and the password verification logic in the login handler is updated to handle nullable passwords and unimplemented cases explicitly.

> ## Changes

> | File(s)                                                                                  | Change Summary                                                                                                                                                                                                                                    |

> |-----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> | api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql                  | Adds new columns to `accounts`, modifies constraints, and creates `provider_accounts`, `sessions`, and `verifications` tables with appropriate indexes and foreign keys for improved authentication integration.                                  |

> | api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql                | Reverses the changes made in the up migration: removes new columns and constraints from `accounts`, drops `provider_accounts`, `sessions`, and `verifications` tables, and deletes associated indexes and foreign key constraints.                |

> | api_server/baas_engine/src/auth/data/get.rs                                            | Changes `Account` struct: makes `password` optional and adds optional fields `full_name`, `email_verified`, `image`, and a non-optional `updated_at` timestamp to extend account data model.                                                       |

> | api_server/baas_engine/src/schema.rs                                                   | Updates schema for `accounts` table (nullable password, new columns), adds new tables `provider_accounts`, `sessions`, and `verifications` with their columns, foreign keys, and joinable relationships.                                           |

> | api_server/baas_handler/src/auth/handler.rs                                           | Modifies password verification logic in login handler to first check master password, then account password if present, and explicitly marks unimplemented handling for accounts without passwords using `todo&#33;()`.                              |

> ## Sequence Diagram(s)

```mermaid

> sequenceDiagram

> participant User

> participant AccountsDB

> participant ProviderAccountsDB

> participant SessionsDB

> participant VerificationsDB

> participant AuthHandler

> User-&gt;&gt;AuthHandler: Login with credentials

> AuthHandler-&gt;&gt;AccountsDB: Fetch account by email

> AuthHandler-&gt;&gt;AuthHandler: Check master password match?

> alt Master password matches

> AuthHandler--&gt;&gt;User: Login success

> else Master password does not match

> alt Account password exists

> AuthHandler-&gt;&gt;AuthHandler: Verify password

> alt Password valid

> AuthHandler--&gt;&gt;User: Login success

> else Password invalid

> AuthHandler--&gt;&gt;User: Bad password error

> end

> else Account password is None

> AuthHandler--&gt;&gt;User: Not implemented error (todo&#33;)

> end

> end

> User-&gt;&gt;AccountsDB: Register / Update account (full_name, email_verified, image, updated_at)

> User-&gt;&gt;ProviderAccountsDB: Link external provider account

> User-&gt;&gt;SessionsDB: Create session (token, user_id, etc.)

> User-&gt;&gt;VerificationsDB: Request verification (identifier, value, expires_at)

> AccountsDB--&gt;&gt;User: Confirmation/Status

> ProviderAccountsDB--&gt;&gt;User: Provider link status

> SessionsDB--&gt;&gt;User: Session token

> VerificationsDB--&gt;&gt;User: Verification status

```

> ## Poem

> &gt; 🐇 In fields of code where data grows,

> &gt; New columns bloom, and logic flows.

> &gt; Sessions hop and tokens gleam,

> &gt; Provider links join the team.

> &gt; Passwords optional, checks anew,

> &gt; This migration brings fresh clues&#33;

> &gt; ✨🌿

> &lt;&#33;-- walkthrough_end --&gt;

> ---

> &lt;details&gt;

> &lt;summary&gt;📜 Recent review details&lt;/summary&gt;

> **Configuration used: CodeRabbit UI**

> **Review profile: ASSERTIVE**

> **Plan: Free**

> &lt;details&gt;

> &lt;summary&gt;📥 Commits&lt;/summary&gt;

> Reviewing files that changed from the base of the PR and between a50a3f2b24fbc1dd1dcade9502a2decb9e23e6a9 and 2818f14c0cd10e670cd346d9467d09b04c415818.

> &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;📒 Files selected for processing (2)&lt;/summary&gt;

> * `api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql` (1 hunks)

> * `api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql` (1 hunks)

> &lt;/details&gt;

> &lt;/details&gt;

> &lt;&#33;-- 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 --&gt;

> &lt;&#33;-- tips_start --&gt;

> ---

> &gt; 📝 **NOTE**

> &gt; &lt;details&gt;

> &gt; &lt;summary&gt;🎁 Summarized by CodeRabbit Free&lt;/summary&gt;

> &gt;

> &gt; Your organization is on the Free plan. CodeRabbit will generate a high-level summary and a walkthrough for each pull request. For a comprehensive line-by-line review, please upgrade your subscription to CodeRabbit Pro by visiting &lt;https://app.coderabbit.ai/login&gt;.

> &gt;

> &gt; &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;🪧 Tips&lt;/summary&gt;

> ### Chat

> There are 3 ways to chat with &#91;CodeRabbit&#93;(https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=spoke-app/meeting-baas&utm_content=222):

> - Review comments: Directly reply to a review comment made by CodeRabbit. Example:

> - `I pushed a fix in commit &lt;commit_id&gt;, please review it.`

> - `Generate unit testing code for this file.`

> - Files and specific lines of code (under the "Files changed" tab): Tag `@rabbitformeetingbaas` in a new review comment at the desired location with your query. Examples:

> - `@rabbitformeetingbaas generate unit testing code for this file.`

> -	`@rabbitformeetingbaas modularize this function.`

> - PR comments: Tag `@rabbitformeetingbaas` in a new PR comment to ask questions about the PR branch. For the best results, please provide a very specific query, as very limited context is provided in this mode. Examples:

> - `@rabbitformeetingbaas gather interesting stats about this repository and render them as a table. Additionally, render a pie chart showing the language distribution in the codebase.`

> - `@rabbitformeetingbaas read src/utils.ts and generate unit testing code.`

> - `@rabbitformeetingbaas read the files in the src/scheduler package and generate a class diagram using mermaid and a README in the markdown format.`

> - `@rabbitformeetingbaas help me debug CodeRabbit configuration file.`

> Note: Be mindful of the bot's finite context window. It's strongly recommended to break down tasks such as reading entire modules into smaller chunks. For a focused discussion, use review comments to chat about specific files and their changes, instead of using the PR comments.

> ### CodeRabbit Commands (Invoked using PR comments)

> - `@rabbitformeetingbaas pause` to pause the reviews on a PR.

> - `@rabbitformeetingbaas resume` to resume the paused reviews.

> - `@rabbitformeetingbaas review` to trigger an incremental review. This is useful when automatic reviews are disabled for the repository.

> - `@rabbitformeetingbaas full review` to do a full review from scratch and review all the files again.

> - `@rabbitformeetingbaas summary` to regenerate the summary of the PR.

> - `@rabbitformeetingbaas generate sequence diagram` to generate a sequence diagram of the changes in this PR.

> - `@rabbitformeetingbaas resolve` resolve all the CodeRabbit review comments.

> - `@rabbitformeetingbaas configuration` to show the current CodeRabbit configuration for the repository.

> - `@rabbitformeetingbaas help` to get help.

> ### Other keywords and placeholders

> - Add `@rabbitformeetingbaas ignore` anywhere in the PR description to prevent this PR from being reviewed.

> - Add `@rabbitformeetingbaas summary` or `@coderabbitai summary` to generate the high-level summary at a specific location in the PR description.

> - Add `@rabbitformeetingbaas` or `@coderabbitai` anywhere in the PR title to generate the title automatically.

> ### CodeRabbit Configuration File (`.coderabbit.yaml`)

> - You can programmatically configure CodeRabbit by adding a `.coderabbit.yaml` file to the root of your repository.

> - Please see the &#91;configuration documentation&#93;(https://docs.coderabbit.ai/guides/configure-coderabbit) for more information.

> - If your editor has YAML language server enabled, you can add the path at the top of this file to enable auto-completion and validation: `# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json`

> ### Documentation and Community

> - Visit our &#91;Documentation&#93;(https://docs.coderabbit.ai) for detailed information on how to use CodeRabbit.

> - Join our &#91;Discord Community&#93;(http://discord.gg/coderabbit) to get help, request features, and share feedback.

> - Follow us on &#91;X/Twitter&#93;(https://twitter.com/coderabbitai) for updates and announcements.

> &lt;/details&gt;

> &lt;&#33;-- tips_end --&gt;

### Comments for "Merge branch 'got_it_popup' into 'master'"

> MR COMMENTS:

> Author: MordakLaVache

> Date: 2025-05-06T13:29:51.708Z

> mentioned in commit 218c53ca174801446fbf82a684da36367c07071c

> Author: Philippe Drion

> Date: 2025-05-06T13:25:30.854Z

> added 3 commits

> &lt;ul&gt;&lt;li&gt;0ac6247d - 1 commit from branch &lt;code&gt;master&lt;/code&gt;&lt;/li&gt;&lt;li&gt;0d9876c7 - Lisible logs&lt;/li&gt;&lt;li&gt;b2b70dbe - more resilient dialog observer&lt;/li&gt;&lt;/ul&gt;

> &#91;Compare with previous version&#93;(/spoke-app/meeting-baas/-/merge_requests/229/diffs?diff_id=1348339083&start_sha=bd6273d7b1d44a30ea929275ff886f1a989d1c79)

> Author: Rabbit Meeting Baas

> Date: 2025-05-06T13:22:07.910Z

> changed the description

> Author: Rabbit Meeting Baas

> Date: 2025-05-06T13:20:53.128Z

> &lt;&#33;-- This is an auto-generated comment: summarize by coderabbit.ai --&gt;

> &lt;&#33;-- walkthrough_start --&gt;

> ## Walkthrough

> This update introduces a new modular transcription system for Zoom bots, adds robust logging and error tracking, and extends authentication and session management in the backend. The Zoom bot now logs transcription metadata, uploads logs to S3, and exposes audio control via FFI. The backend tracks transcription failures and supports new OAuth/session tables.

> ## Changes

> | Files / Paths                                                                                 | Change Summary                                                                                                                                                                                                                                                                                                                                                                            |

> |----------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> | api_server/Cargo.toml, meeting_bot/zoom/Cargo.toml, meeting_bot/zoom/client/Cargo.toml        | Workspace and dependency updates: added/linked `zoom-transcribe` crate, removed trailing commas.                                                                                                                                                                                                                                                  |

> | api_server/Dockerfile, api_server/update_docker_image.sh, api_server/zoom-transcribe          | Docker build and context scripts updated to include `zoom-transcribe` directory; new directory added.                                                                                                                                                                                                                                             |

> | api_server/baas_engine/Cargo.toml                                                            | Upgraded `reqwest-retry` and `reqwest-middleware` dependencies; added local `zoom-transcribe` crate.                                                                                                                                                                                                                                              |

> | api_server/baas_engine/src/auth/data/get.rs, .../schema.rs                                   | `Account` struct and DB schema extended: nullable password, added user metadata fields, new tables for OAuth/session/verification, and `transcription_fails` column for bots.                                                                                                                               |

> | api_server/baas_engine/src/bots/data/get.rs, .../patch.rs, .../post.rs, .../consumption.rs   | `Bot` struct extended with `transcription_fails`; transcript logic refactored for diarization; duration calculation renamed; new logic for transcript-word association.                                                                                                                                    |

> | api_server/baas_engine/src/bots/utils.rs, .../src/webhook.rs, .../src/s3/logs.rs             | Platform detection now uses a strongly typed enum; webhook flow distinguishes incomplete/failed transcriptions; S3 log utilities added.                                                                                                                             |

> | api_server/baas_engine/src/transcriber/transcribe.rs, .../retry.rs, .../s3/get_recording_path.rs | Removed unused imports and transcript display code; simplified logging.                                                                                                                                                                                                                                    |

> | api_server/baas_handler/src/auth/handler.rs, .../bots/internal.rs, .../public.rs, .../calendar/api.rs, .../main.rs, .../routers.rs, .../tests/calendar.rs, .../webhook_schemas.rs | Password logic clarified; transcription fail count handled in bot endpoints; platform stats use enums; async calendar sync commented out; formatting and whitespace cleanups.                                                                                       |

> | api_server/migrations/2025-04-24-122051_better_auth_integration/*, .../2025-04-28-131737_add_colum_transcripition_fail_into_bot/* | DB migrations: add/remove user metadata columns, OAuth/session/verification tables, and `transcription_fails` to bots.                                                                                                                                                                                    |

> | api_server/rust-toolchain                                                                  | Rust version bumped from 1.82.0 to 1.85.0.                                                                                                                                                                                                                                                                |

> | meeting_bot/recording_server/package.json, .../src/main.ts, .../states/base-state.ts, .../states/initialization-state.ts, .../states/recording-state.ts, .../types.ts, .../utils/Logger.ts | Switched logging from `pino` to `winston`; added dialog observer heartbeat for robustness; extended context type; minor import and logic adjustments.                                                                                                               |

> | meeting_bot/zoom/.env, .../scripts/run.sh                                                  | Added API keys for Gladia/Runpod; updated sample config and meeting URL.                                                                                                                                                                                                                                  |

> | meeting_bot/zoom/client/src/async_runtime.rs, .../transcribe.rs, .../components/speech_to_text.rs, .../engine.rs, .../main.rs, .../remote_service.rs | Modularized transcription with provider abstraction; logs transcription metadata; uploads logs to S3; tracks transcription failures; exposes audio control; fetches API keys from env.                                                                              |

> | meeting_bot/zoom/zoom-sdk-linux-rs/build.rs, .../src/services/meeting_service.rs, .../audio_controller.rs, .../wrapper-cpp/* | Added FFI bindings and Rust module for meeting audio controller (unmute); build script updated to include audio module.                                                                                                                                                                                    |

> | meeting_bot/zoom/zoom-transcribe/Cargo.toml, .../src/lib.rs, .../src/providers/gladia.rs, .../src/providers/runpod.rs | New `zoom-transcribe` crate: provides provider-agnostic transcription with middleware, retry, and timestamp alignment; provider implementations generic over middleware.                                                                                            |

> ## Sequence Diagram(s)

```mermaid

> sequenceDiagram

> participant ZoomBot

> participant ZoomTranscribe

> participant S3

> participant Backend

> participant User

> User-&gt;&gt;ZoomBot: Start meeting

> ZoomBot-&gt;&gt;ZoomBot: Record audio, collect timestamps

> ZoomBot-&gt;&gt;ZoomTranscribe: start(provider, api_key, record_start_time, s3_url, user_id, ts, middleware)

> ZoomTranscribe-&gt;&gt;Provider: Transcribe audio (Gladia/Runpod)

> Provider--&gt;&gt;ZoomTranscribe: Transcription result (words)

> ZoomTranscribe-&gt;&gt;ZoomBot: Return words (timestamps aligned)

> ZoomBot-&gt;&gt;S3: Upload logs (Zoom and transcription)

> ZoomBot-&gt;&gt;Backend: Send words, transcription_fail_count

> Backend-&gt;&gt;User: Webhook (Complete or Incomplete, based on transcription_fail_count)

```

> ## Poem

> &gt; 🐇

> &gt; New words are whispered, logs now sing,

> &gt; With audio control, the Zoom bots spring.

> &gt; Transcriptions retry, and failures are tracked,

> &gt; OAuth and sessions keep users intact.

> &gt; Winston logs shine where Pino once stood—

> &gt; A leap for the code, as all rabbits would&#33;

> &gt; 🥕

> &lt;&#33;-- walkthrough_end --&gt;

> ---

> &lt;details&gt;

> &lt;summary&gt;📜 Recent review details&lt;/summary&gt;

> **Configuration used: CodeRabbit UI**

> **Review profile: ASSERTIVE**

> **Plan: Free**

> &lt;details&gt;

> &lt;summary&gt;📥 Commits&lt;/summary&gt;

> Reviewing files that changed from the base of the PR and between 90994f7db704ce1dbabc552fd232c5226c051d05 and bd6273d7b1d44a30ea929275ff886f1a989d1c79.

> &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;⛔ Files ignored due to path filters (4)&lt;/summary&gt;

> * `api_server/Cargo.lock` is excluded by `&#33;**/*.lock`

> * `meeting_bot/recording_server/package-lock.json` is excluded by `&#33;**/package-lock.json`

> * `meeting_bot/recording_server/yarn.lock` is excluded by `&#33;**/yarn.lock`, `&#33;**/*.lock`

> * `meeting_bot/zoom/Cargo.lock` is excluded by `&#33;**/*.lock`

> &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;📒 Files selected for processing (58)&lt;/summary&gt;

> * `api_server/Cargo.toml` (1 hunks)

> * `api_server/Dockerfile` (2 hunks)

> * `api_server/baas_engine/Cargo.toml` (1 hunks)

> * `api_server/baas_engine/src/auth/data/get.rs` (3 hunks)

> * `api_server/baas_engine/src/bots/consumption.rs` (3 hunks)

> * `api_server/baas_engine/src/bots/data/get.rs` (2 hunks)

> * `api_server/baas_engine/src/bots/data/patch.rs` (1 hunks)

> * `api_server/baas_engine/src/bots/data/post.rs` (2 hunks)

> * `api_server/baas_engine/src/bots/utils.rs` (4 hunks)

> * `api_server/baas_engine/src/s3/get_recording_path.rs` (0 hunks)

> * `api_server/baas_engine/src/s3/logs.rs` (2 hunks)

> * `api_server/baas_engine/src/schema.rs` (8 hunks)

> * `api_server/baas_engine/src/transcriber/retry.rs` (0 hunks)

> * `api_server/baas_engine/src/transcriber/transcribe.rs` (1 hunks)

> * `api_server/baas_engine/src/webhook.rs` (3 hunks)

> * `api_server/baas_handler/src/auth/handler.rs` (1 hunks)

> * `api_server/baas_handler/src/bots/internal.rs` (7 hunks)

> * `api_server/baas_handler/src/bots/public.rs` (2 hunks)

> * `api_server/baas_handler/src/calendar/api.rs` (3 hunks)

> * `api_server/baas_handler/src/main.rs` (3 hunks)

> * `api_server/baas_handler/src/routers.rs` (18 hunks)

> * `api_server/baas_handler/src/tests/calendar.rs` (1 hunks)

> * `api_server/baas_handler/src/webhook_schemas.rs` (2 hunks)

> * `api_server/migrations/2025-04-24-122051_better_auth_integration/down.sql` (1 hunks)

> * `api_server/migrations/2025-04-24-122051_better_auth_integration/up.sql` (1 hunks)

> * `api_server/migrations/2025-04-28-131737_add_colum_transcripition_fail_into_bot/down.sql` (1 hunks)

> * `api_server/migrations/2025-04-28-131737_add_colum_transcripition_fail_into_bot/up.sql` (1 hunks)

> * `api_server/rust-toolchain` (1 hunks)

> * `api_server/update_docker_image.sh` (1 hunks)

> * `api_server/zoom-transcribe` (1 hunks)

> * `meeting_bot/recording_server/package.json` (1 hunks)

> * `meeting_bot/recording_server/src/main.ts` (1 hunks)

> * `meeting_bot/recording_server/src/state-machine/states/base-state.ts` (3 hunks)

> * `meeting_bot/recording_server/src/state-machine/states/initialization-state.ts` (1 hunks)

> * `meeting_bot/recording_server/src/state-machine/states/recording-state.ts` (0 hunks)

> * `meeting_bot/recording_server/src/state-machine/types.ts` (1 hunks)

> * `meeting_bot/recording_server/src/utils/Logger.ts` (5 hunks)

> * `meeting_bot/zoom/.env` (1 hunks)

> * `meeting_bot/zoom/Cargo.toml` (1 hunks)

> * `meeting_bot/zoom/client/Cargo.toml` (1 hunks)

> * `meeting_bot/zoom/client/src/async_runtime.rs` (7 hunks)

> * `meeting_bot/zoom/client/src/async_runtime/transcribe.rs` (4 hunks)

> * `meeting_bot/zoom/client/src/components/speech_to_text.rs` (1 hunks)

> * `meeting_bot/zoom/client/src/engine.rs` (1 hunks)

> * `meeting_bot/zoom/client/src/main.rs` (4 hunks)

> * `meeting_bot/zoom/client/src/remote_service.rs` (8 hunks)

> * `meeting_bot/zoom/scripts/run.sh` (2 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/build.rs` (2 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/src/services/meeting_service.rs` (5 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/src/services/meeting_service/audio_controller.rs` (1 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/c_meeting_service_interface.cpp` (1 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/c_meeting_service_interface.h` (1 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/modules/c_meeting_audio_interface.cpp` (1 hunks)

> * `meeting_bot/zoom/zoom-sdk-linux-rs/wrapper-cpp/modules/c_meeting_audio_interface.h` (1 hunks)

> * `meeting_bot/zoom/zoom-transcribe/Cargo.toml` (1 hunks)

> * `meeting_bot/zoom/zoom-transcribe/src/lib.rs` (1 hunks)

> * `meeting_bot/zoom/zoom-transcribe/src/providers/gladia.rs` (6 hunks)

> * `meeting_bot/zoom/zoom-transcribe/src/providers/runpod.rs` (3 hunks)

> &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;💤 Files with no reviewable changes (3)&lt;/summary&gt;

> * meeting_bot/recording_server/src/state-machine/states/recording-state.ts

> * api_server/baas_engine/src/s3/get_recording_path.rs

> * api_server/baas_engine/src/transcriber/retry.rs

> &lt;/details&gt;

> &lt;/details&gt;

> &lt;&#33;-- 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 --&gt;

> &lt;&#33;-- tips_start --&gt;

> ---

> &gt; 📝 **NOTE**

> &gt; &lt;details&gt;

> &gt; &lt;summary&gt;🎁 Summarized by CodeRabbit Free&lt;/summary&gt;

> &gt;

> &gt; Your organization is on the Free plan. CodeRabbit will generate a high-level summary and a walkthrough for each pull request. For a comprehensive line-by-line review, please upgrade your subscription to CodeRabbit Pro by visiting &lt;https://app.coderabbit.ai/login&gt;.

> &gt;

> &gt; &lt;/details&gt;

> &lt;details&gt;

> &lt;summary&gt;🪧 Tips&lt;/summary&gt;

> ### Chat

> There are 3 ways to chat with &#91;CodeRabbit&#93;(https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=spoke-app/meeting-baas&utm_content=229):

> - Review comments: Directly reply to a review comment made by CodeRabbit. Example:

> - `I pushed a fix in commit &lt;commit_id&gt;, please review it.`

> - `Generate unit testing code for this file.`

> - Files and specific lines of code (under the "Files changed" tab): Tag `@rabbitformeetingbaas` in a new review comment at the desired location with your query. Examples:

> - `@rabbitformeetingbaas generate unit testing code for this file.`

> -	`@rabbitformeetingbaas modularize this function.`

> - PR comments: Tag `@rabbitformeetingbaas` in a new PR comment to ask questions about the PR branch. For the best results, please provide a very specific query, as very limited context is provided in this mode. Examples:

> - `@rabbitformeetingbaas gather interesting stats about this repository and render them as a table. Additionally, render a pie chart showing the language distribution in the codebase.`

> - `@rabbitformeetingbaas read src/utils.ts and generate unit testing code.`

> - `@rabbitformeetingbaas read the files in the src/scheduler package and generate a class diagram using mermaid and a README in the markdown format.`

> - `@rabbitformeetingbaas help me debug CodeRabbit configuration file.`

> ### Support

> Need help? Join our &#91;Discord community&#93;(https://discord.gg/coderabbit) for assistance with any issues or questions.

> Note: Be mindful of the bot's finite context window. It's strongly recommended to break down tasks such as reading entire modules into smaller chunks. For a focused discussion, use review comments to chat about specific files and their changes, instead of using the PR comments.

> ### CodeRabbit Commands (Invoked using PR comments)

> - `@rabbitformeetingbaas pause` to pause the reviews on a PR.

> - `@rabbitformeetingbaas resume` to resume the paused reviews.

> - `@rabbitformeetingbaas review` to trigger an incremental review. This is useful when automatic reviews are disabled for the repository.

> - `@rabbitformeetingbaas full review` to do a full review from scratch and review all the files again.

> - `@rabbitformeetingbaas summary` to regenerate the summary of the PR.

> - `@rabbitformeetingbaas generate sequence diagram` to generate a sequence diagram of the changes in this PR.

> - `@rabbitformeetingbaas resolve` resolve all the CodeRabbit review comments.

> - `@rabbitformeetingbaas configuration` to show the current CodeRabbit configuration for the repository.

> - `@rabbitformeetingbaas help` to get help.

> ### Other keywords and placeholders

> - Add `@rabbitformeetingbaas ignore` anywhere in the PR description to prevent this PR from being reviewed.

> - Add `@rabbitformeetingbaas summary` or `@coderabbitai summary` to generate the high-level summary at a specific location in the PR description.

> - Add `@rabbitformeetingbaas` or `@coderabbitai` anywhere in the PR title to generate the title automatically.

> ### CodeRabbit Configuration File (`.coderabbit.yaml`)

> - You can programmatically configure CodeRabbit by adding a `.coderabbit.yaml` file to the root of your repository.

> - Please see the &#91;configuration documentation&#93;(https://docs.coderabbit.ai/guides/configure-coderabbit) for more information.

> - If your editor has YAML language server enabled, you can add the path at the top of this file to enable auto-completion and validation: `# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json`

> ### Documentation and Community

> - Visit our &#91;Documentation&#93;(https://docs.coderabbit.ai) for detailed information on how to use CodeRabbit.

> - Join our &#91;Discord Community&#93;(http://discord.gg/coderabbit) to get help, request features, and share feedback.

> - Follow us on &#91;X/Twitter&#93;(https://twitter.com/coderabbitai) for updates and announcements.

> &lt;/details&gt;

> &lt;&#33;-- tips_end --&gt;

> Author: Philippe Drion

> Date: 2025-05-06T13:20:37.084Z

> assigned to @PhilippeDrion

> Author: Philippe Drion

> Date: 2025-05-06T13:20:37.058Z

> requested review from @mordaklavache 

## Code Diffs

<Callout type="info">
  Code diffs require the `--with-diff --include-code` flags when running git_grepper.sh.
  
  For detailed diffs, please use the git command line or a git UI tool to view changes between commits.
</Callout> 

---

## Updates

Latest updates, improvements, and changes to Meeting BaaS services

### Source: ./content/docs/updates/index.mdx


# Meeting BaaS Updates

This section contains the latest updates, improvements, and changes to Meeting BaaS services.
Stay up-to-date with new features, bug fixes, and important announcements.

## Update Categories

<ServicesListSSR />

## How Updates Are Organized

1. **Date**: When the update was released
2. **Content Type**: Features, bug fixes, improvements
3. **Service**: Which Meeting BaaS service was updated
4. **Commit Details**: Information about the specific changes made

Click on any update in the sidebar to view detailed information about that update.



---

## March 8, 2025

MCP Servers - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/mcp-servers-2025-03-08.mdx


# MCP Servers Updates 🐟

<Callout type="info">
  Looks like we're diving deep into the MCP Servers today - hope you're ready to navigate these technical waters! 🌊
</Callout>

## Overview of Changes

The recent updates to the MCP Servers involve several key modifications across different components of the service.

### Key Files Updated
<Files>
  <File name="README.md" />
  <File name="api/server.ts" />
  <File name="public/index.html" />
  <File name="vercel.json" />
</Files>

### Commit Highlights

<Tabs items={['Initial Setup', 'Working Changes', 'Creation Fix', 'Log Updates']}>
  <Tab value="Initial Setup">
    - Initial project configuration established
    - Basic infrastructure set up
  </Tab>
  <Tab value="Working Changes">
    - Ongoing development and refinement
    - Potential improvements to existing functionality
  </Tab>
  <Tab value="Creation Fix">
    - Addressed potential creation-related issues
    - Ensuring robust initialization processes
  </Tab>
  <Tab value="Log Updates">
    - Logging mechanisms potentially enhanced
    - Improved tracking and monitoring capabilities
  </Tab>
</Tabs>

## Important Notes

<Callout type="warn">
  Detailed code diffs are not available. For comprehensive change information, use git command-line tools or a git UI.
</Callout>

## Next Steps

1. Review the updated files
2. Verify compatibility with existing systems
3. Test new configurations thoroughly

<Callout type="info">
  Remember: In the sea of code, always keep your development compass pointing true! 🧭🐟
</Callout>

---

## March 9, 2025

MCP Servers - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/mcp-servers-2025-03-09.mdx


# MCP Servers Updates 🐟

<Callout type="info">
  Diving deep into the code ocean today! Catch of the day: MCP Servers updates that'll make your development swim smoothly. 🎣
</Callout>

## Key Updates Overview

### Configuration and Environment Improvements

<Steps>
  <Step>
    **Redis Configuration**
    - `REDIS_URL` is now a required environment variable
    - Ensures proper connection and configuration
  </Step>
  
  <Step>
    **Timeout Handling**
    - Dynamic timeout mechanisms implemented
    - Improved server responsiveness and reliability
  </Step>
  
  <Step>
    **Capability Support**
    - Enhanced capability management
    - More flexible service configurations
  </Step>
</Steps>

### Infrastructure Updates

<Tabs items={['Vercel Config', 'README', 'Project Structure']}>
  <Tab value="Vercel Config">
    - Updated `vercel.json` for deployment optimizations
    - Potential performance and scaling improvements
  </Tab>
  
  <Tab value="README">
    - Documentation updates
    - Improved project information and guidelines
  </Tab>
  
  <Tab value="Project Structure">
    - Minor refactoring in project files
    - Cleanup of existing code
  </Tab>
</Tabs>

## Changed Files

<Files>
  <Folder name="project" defaultOpen>
    <File name="README.md" />
    <File name="vercel.json" />
    <Folder name="lib">
      <File name="mcp-api-handler.ts" />
    </Folder>
    <Folder name="api">
      <File name="server.ts" />
    </Folder>
  </Folder>
</Files>

<Callout type="warn">
  Detailed code changes are not disclosed for confidentiality reasons.
</Callout>

---

## March 10, 2025

MCP Servers - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/mcp-servers-2025-03-10.mdx


🐟 Looks like we're diving into some MCP Servers updates! Let's see what's swimming in our code ocean today.

# MCP Servers Updates

<Callout type="info">
  Quick snapshot of recent changes in the MCP Servers ecosystem
</Callout>

## Overview

### File Updated
- `lib/mcp-api-handler.ts`

<Tabs items={['Changes', 'Impact']}>
  <Tab value="Changes">
    <Callout type="warn">
      Minimal details available about specific code modifications
    </Callout>
  </Tab>
  <Tab value="Impact">
    No immediate user-facing changes detected
  </Tab>
</Tabs>

## Additional Context

<Accordions>
  <Accordion title="Commit Details" value="commit-info">
    - **Date:** March 10, 2025
    - **Commit Hash:** `d44c0c5baa0931414b166546bc45ac97d15ce460`
  </Accordion>
</Accordions>

<Callout type="info">
  For precise code changes, use git command-line tools or a Git UI for detailed diff review.
</Callout>

---

## March 11, 2025

MCP Servers - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/mcp-servers-2025-03-11.mdx


🐟 Navigating the MCP Servers update? Let's dive into the details! 

<Callout type="info">
  Quick Update: Minor changes to MCP Servers routing configuration
</Callout>

# MCP Servers Update

## Overview

A small but significant update was made to the MCP Servers routing configuration on March 11, 2025.

<Steps>
  <Step>Routing configuration modified</Step>
  <Step>README.md file updated</Step>
</Steps>

## Key Changes

### Routing Modification

The update involves removing routing to the root path (`/`). While specific implementation details are limited, this suggests a potential refinement of the service's routing strategy.

<Callout type="warn">
  Impact: Minimal expected user-facing changes
</Callout>

## File Changes

<Files>
  <File name="README.md" />
</Files>

## Additional Notes

<Accordions>
  <Accordion title="Detailed Diff Information">
    For comprehensive code differences, we recommend using Git command-line tools or a Git UI for precise change tracking.
  </Accordion>
</Accordions>

---

## April 7, 2025

MCP Servers - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/mcp-servers-2025-04-07.mdx


🐟 Hooked on updates? Let's dive into the latest MCP Servers catch of the day! 

<Callout type="info">
  Quick Snapshot: Minor updates and administrative housekeeping for the MCP Servers project.
</Callout>

# MCP Servers Updates

## Key Changes

### Project Maintenance

The team has made some administrative updates to the project:

<Steps>
  <Step>Added project LICENSE file</Step>
  <Step>Updated README.md documentation</Step>
</Steps>

### Modified Files

<Files>
  <File name="lib/mcp-api-handler.ts" />
  <File name="package.json" />
  <Folder name="scripts">
    <File name="test-streamable-http-client.mjs" />
  </Folder>
  <File name="LICENSE" />
  <File name="pnpm-lock.yaml" />
</Files>

## Additional Notes

<Callout type="warn">
  Detailed code changes are not publicly available. For specific diff information, use git command-line tools or a git UI.
</Callout>

<Accordions>
  <Accordion title="Want to know more?" value="details">
    Curious about the nitty-gritty? While we can't reveal all the details, these updates suggest ongoing project maintenance and potential minor improvements.
  </Accordion>
</Accordions>

---

## April 22, 2025

MCP Servers - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/mcp-servers-2025-04-22.mdx


🐟 Hooked on Updates: MCP Servers Edition! Let's dive into the latest changes that'll make your code swim smoothly. 

<Callout type="info">
  This update focuses on stateless MCP server improvements, bringing more flexibility to your infrastructure.
</Callout>

# MCP Servers Updates

## Key Changes

<Steps>
  <Step>Refactored server configuration</Step>
  <Step>Updated TypeScript configuration</Step>
  <Step>Package dependencies adjusted</Step>
</Steps>

## Modified Files

<Files>
  <File name="api/server.ts" />
  <File name="package.json" />
  <File name="tsconfig.json" />
</Files>

## Technical Insights

The recent commit introduces a stateless approach to MCP servers, which means:
- Improved scalability
- More predictable server behavior
- Enhanced deployment flexibility

<Callout type="warn">
  Developers should review their current server configurations to ensure compatibility with the new stateless model.
</Callout>

## Recommended Actions

- Review `api/server.ts` for configuration changes
- Check `package.json` for dependency updates
- Verify TypeScript configuration in `tsconfig.json`

<Tabs items={['Quick Check', 'Detailed Review']}>
  <Tab value="Quick Check">
    ```bash
    npm install
    npm run type-check
    ```
  </Tab>
  <Tab value="Detailed Review">
    ```bash
    # Perform comprehensive system tests
    npm run test:integration
    npm run lint
    ```
  </Tab>
</Tabs>

---

## April 23, 2025

MCP Servers - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/mcp-servers-2025-04-23.mdx


# MCP Servers Updates 🐟

<Callout type="info">
  Looks like we're scaling up our Meeting Bass (BaaS) SDK with some fin-tastic improvements! 🐟
</Callout>

## Key Updates

### SDK and Tool Enhancements

The recent updates focus on improving the Meeting BaaS SDK integration and tool registration:

<Steps>
  <Step>Integrated Meeting-BaaS SDK</Step>
  <Step>Implemented auto-tool registration</Step>
  <Step>Added type-safe tool execution</Step>
</Steps>

### API Key and Authentication

Significant improvements in API key handling:

- Implemented schema-based API key validation
- Refined API key checking mechanism
- Improved type definitions for authentication

### Performance and Reliability

<Tabs items={['Redis Integration', 'Timeout Handling']}>
  <Tab value="Redis Integration">
    Added Redis integration with Upstash for improved caching and performance
  </Tab>
  <Tab value="Timeout Handling">
    Enhanced timeout management for more robust tool execution
  </Tab>
</Tabs>

### Development Workflow

<Callout type="warn">
  Note: Several refactoring efforts were made to improve code organization and maintainability
</Callout>

- Moved tools to separate files
- Added TypeScript setup
- Simplified tool registration process

## File Changes

<Files>
  <Folder name="api" defaultOpen>
    <Folder name="tools">
      <File name="index.ts" />
      <File name="server.ts" />
      <Folder name="bots">
        <File name="join.ts" />
        <File name="join-speaking.ts" />
      </Folder>
    </Folder>
  </Folder>
  <File name="package.json" />
  <File name="global.d.ts" />
</Files>

---

## April 30, 2025

MCP Servers - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/mcp-servers-2025-04-30.mdx


<Callout type="warn">
  This page contains automatically generated documentation based on Git activity related to the MCP Servers service. 
  For the latest version of this content, please refer to the latest Git update.
</Callout>

# MCP Servers Updates - April 30, 2025

## Commits

### Merge pull request #23 from Meeting-Baas/fix_speaking_bots

**Author:** Lazare Rossillon

**Date:** 2025-04-30 17:00:19 +0200

**Hash:** `e5275fb1ba8824d584b7cb92a21cdeaf0c7f9761`

**Related PR/MR:** GitHub PR #23 (https://github.com/Meeting-Baas/mcp-on-vercel/pull/23)



### feat(speaking-bots): add direct image URL to persona generation response

**Author:** Lazare Rossillon

**Date:** 2025-04-30 16:48:36 +0200

**Hash:** `c4374debab63bccb45403607e9fc4a1a9bbdb208`

**Related PR/MR:** GitHub PR #9: Fix speaking bots (https://github.com/vercel-labs/mcp-on-vercel/pull/9)



### feat(speaking-bots): add header-based auth and image generation tool

**Author:** Lazare Rossillon

**Date:** 2025-04-30 16:42:10 +0200

**Hash:** `a08273707622bc9e27df468ebc5644c5817debad`

**Related PR/MR:** GitHub PR #9: Fix speaking bots (https://github.com/vercel-labs/mcp-on-vercel/pull/9)



## Changed Files

- 📁 `.gitignore`
- 📦 `api/tools.ts`
- 📦 `api/tools/bots/join-speaking.ts`
- 📦 `api/tools/index.ts`
- 📦 `lib/mcp-api-handler.ts`
- 📁 `scripts/test-client.mjs`

## Pull Request Comments

### Comments for "feat(speaking-bots): add direct image URL to persona generation response"

> @Lazare-42 is attempting to deploy a commit to the **Uncurated Tests** Team on &#91;Vercel&#93;(https://vercel.com).

> A member of the Team first needs to &#91;authorize it&#93;(https://vercel.com/git/authorize?team=Uncurated%20Tests&type=github&job=%7B%22headInfo%22%3A%7B%22sha%22%3A%22c4374debab63bccb45403607e9fc4a1a9bbdb208%22%7D%2C%22id%22%3A%22QmZheZnfPMS52EqLC7i6Fd2gMR283bzrMu3xSoAvpUHjgJ%22%2C%22org%22%3A%22vercel-labs%22%2C%22prId%22%3A9%2C%22repo%22%3A%22mcp-on-vercel%22%7D).

### Comments for "feat(speaking-bots): add header-based auth and image generation tool"

> @Lazare-42 is attempting to deploy a commit to the **Uncurated Tests** Team on &#91;Vercel&#93;(https://vercel.com).

> A member of the Team first needs to &#91;authorize it&#93;(https://vercel.com/git/authorize?team=Uncurated%20Tests&type=github&job=%7B%22headInfo%22%3A%7B%22sha%22%3A%22c4374debab63bccb45403607e9fc4a1a9bbdb208%22%7D%2C%22id%22%3A%22QmZheZnfPMS52EqLC7i6Fd2gMR283bzrMu3xSoAvpUHjgJ%22%2C%22org%22%3A%22vercel-labs%22%2C%22prId%22%3A9%2C%22repo%22%3A%22mcp-on-vercel%22%7D). 

## Code Diffs

<Callout type="info">
  Code diffs require the `--with-diff --include-code` flags when running git_grepper.sh.
  
  For detailed diffs, please use the git command line or a git UI tool to view changes between commits.
</Callout> 

---

## April 7, 2025

TypeScript SDK - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/sdk-2025-04-07.mdx


# TypeScript SDK Updates 🐟

<Callout type="info">
  Hooked on our latest SDK updates? Let's dive into the changes! 🎣
</Callout>

## Key Updates

### Generated API and Model Enhancements

This update introduces significant improvements to our SDK:

<Tabs items={['Generated APIs', 'New Models']}>
  <Tab value="Generated APIs">
    - Default API
    - Calendar API
    - Webhook API
  </Tab>
  <Tab value="New Models">
    - SpeechToTextProvider
    - AudioFrequency
    - RecordingMode
    - JoinRequest
  </Tab>
</Tabs>

### Changes Overview

<Steps>
  <Step>Updated `.gitignore` to track `dist/` and `src/generated/` directories</Step>
  <Step>Renamed `SpeechToText` type references to `SpeechToTextProvider`</Step>
  <Step>Improved code readability with method signature reformatting</Step>
</Steps>

### Type and Method Updates

<Accordions>
  <Accordion title="Type Refinements" value="types">
    - Consistent use of `SpeechToTextProvider` across type references
    - Updated parameter types in multiple methods
  </Accordion>
  <Accordion title="Method Signature Improvements" value="methods">
    - Reformatted `deleteData` method for better readability
    - No changes to method logic or return types
  </Accordion>
</Accordions>

<Callout type="warn">
  These changes improve type consistency and code readability without altering core functionality.
</Callout>

---

## April 17, 2025

TypeScript SDK - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/sdk-2025-04-17.mdx


# TypeScript SDK Updates 🐟

<Callout type="info">
  Dive into the latest updates for our TypeScript SDK - where code meets clarity, and updates swim smoothly! 
</Callout>

## Version 4.0.3 Highlights

### 🚀 Key Improvements

- Enhanced TypeScript ESM support
- Refined package export mappings
- Improved module compatibility

### 📦 Version Bump Details

<Tabs items={['Package', 'OpenAPI Generator']}>
  <Tab value="Package">
    - Updated to version 4.0.3
    - Added explicit type, ESM, and CommonJS entry points
  </Tab>
  <Tab value="OpenAPI Generator">
    - Version updated to 4.0.3
    - Improved configuration consistency
  </Tab>
</Tabs>

### 🛠 Build Process Enhancements

<Steps>
  <Step>Added TypeScript compiler option for declaration files</Step>
  <Step>Generated `.d.mts` files for ESM type declarations</Step>
  <Step>Improved module compatibility</Step>
</Steps>

### 🔍 Technical Details

<Accordions>
  <Accordion title="Export Mapping" value="exports">
    ```json
    "exports": {
      "./dist/baas/*": {
        "types": "./dist/baas/*.d.ts",
        "import": "./dist/baas/*.mjs",
        "require": "./dist/baas/*.js"
      }
    }
    ```
  </Accordion>
</Accordions>

### 📝 Changelog

- Bumped package version to 4.0.3
- Refined package export mappings
- Added TypeScript ESM support for declaration files

## Upgrade Recommendations

<Callout type="warn">
  When upgrading, ensure you're using the main package entry point for imports.
</Callout>

```typescript
// Recommended
import { YourType } from '@meeting-baas/sdk';

// Avoid direct imports from generated files

---

## March 2, 2025

Speaking Bots - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/speaking-bots-2025-03-02.mdx


🐟 Hooked on APIs: Where Every Request is a Catch of the Day! 🐟

<Callout type="info">
  This update introduces significant improvements to the Speaking Bots service, focusing on API-first architecture and enhanced bot management.
</Callout>

# Speaking Bots Service Updates

## Key Enhancements

<Tabs items={['API', 'Bot Management', 'Configuration']}>
  <Tab value="API">
    - Introduced FastAPI-based server for bot orchestration
    - Added `/run-bots` endpoint for dynamic bot creation
    - Implemented WebSocket support for real-time communication
  </Tab>
  <Tab value="Bot Management">
    - Enhanced bot configuration flexibility
    - Added support for multiple bot instances
    - Improved persona and meeting URL handling
  </Tab>
  <Tab value="Configuration">
    - New CLI arguments for granular control
    - Environment variable fallback mechanisms
    - Secure API key management
  </Tab>
</Tabs>

## API Endpoints

<Steps>
  <Step>POST `/run-bots`: Create and manage bot instances</Step>
  <Step>WebSocket `/ws/{client_id}`: Real-time communication</Step>
  <Step>GET `/`: Health check endpoint</Step>
</Steps>

## Example Bot Request

```json
{
  "count": 2,
  "meeting_url": "https://meeting.example.com",
  "personas": ["technical_expert", "facilitator"],
  "recorder_only": false,
  "websocket_url": "ws://localhost:8000"
}
```

## Notable Improvements

<Accordions>
  <Accordion title="API Architecture" value="api-arch">
    - Lightweight FastAPI server
    - Asynchronous bot management
    - Flexible configuration options
  </Accordion>
  
  <Accordion title="WebSocket Integration" value="websocket">
    - Multi-client support
    - Real-time bot communication
    - Robust connection handling
  </Accordion>
</Accordions>

## Deployment Considerations

<Callout type="warn">
  Ensure proper API key management and secure WebSocket configurations.
</Callout>

---

## April 15, 2025

Speaking Bots - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/speaking-bots-2025-04-15.mdx


🐟 Hooked on APIs: Where Every Endpoint is a Catch! 🎣

# Speaking Bots Service Updates - April 15, 2025

<Callout type="info">
  This update introduces a comprehensive API-first architecture for managing speaking meeting bots, replacing previous CLI and subprocess-based approaches.
</Callout>

## Key Highlights

### 🚀 New Architecture
- Introduced FastAPI server with robust HTTP and WebSocket endpoints
- Implemented modular, asynchronous bot lifecycle management
- Added ngrok integration for local development

### 🛠 Core Improvements
- Enhanced persona management
- Improved error handling and logging
- Streamlined deployment configurations

## Major Changes

<Tabs items={['API', 'WebSockets', 'Deployment']}>
  <Tab value="API">
    - Created typed Pydantic models for bot requests and responses
    - Implemented comprehensive API endpoints for bot creation and management
    - Added OpenAPI schema documentation
  </Tab>
  <Tab value="WebSockets">
    - Developed real-time audio streaming via WebSocket
    - Implemented connection management utilities
    - Added robust error handling for WebSocket communications
  </Tab>
  <Tab value="Deployment">
    - Updated Dockerfile for modern Python runtime
    - Added Fly.io deployment configuration
    - Improved environment variable management
  </Tab>
</Tabs>

## Code Structure Transformation

<Files>
  <Folder name="app" defaultOpen>
    <File name="main.py" />
    <File name="routes.py" />
    <File name="websockets.py" />
  </Folder>
  <Folder name="core">
    <File name="process.py" />
    <File name="connection.py" />
    <File name="router.py" />
  </Folder>
  <Folder name="utils">
    <File name="ngrok.py" />
    <File name="process.py" />
  </Folder>
</Files>

## Sequence of Bot Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant API Server
    participant MeetingBaas
    participant Pipecat
    participant ngrok

    Client->>API Server: POST /bots (BotRequest)
    API Server->>ngrok: Assign WebSocket URL
    API Server->>MeetingBaas: Create Meeting Bot
    MeetingBaas-->>API Server: Bot ID
    API Server-->>Client: JoinResponse
    Client->>API Server: WebSocket Connection
    API Server->>Pipecat: Start Subprocess
    Client-->>API Server: Audio/Text Data
    API Server->>Pipecat: Forward Data
    Pipecat-->>API Server: Response
    API Server-->>Client: Forward Response
```

## Breaking Changes

<Callout type="warn">
  - Removed legacy CLI and subprocess-based bot management
  - Replaced old bot creation methods with new API-driven approach
  - Requires updated client implementations to use new API endpoints
</Callout>

## Migration Guide

<Steps>
  <Step>Update client libraries to use new FastAPI endpoints</Step>
  <Step>Replace subprocess management with API calls</Step>
  <Step>Implement WebSocket communication according to new protocol</Step>
  <Step>Update environment configurations</Step>
</Steps>

## Future Roadmap

- Enhanced AI persona management
- More granular bot control interfaces
- Improved real-time communication protocols

<Callout type="info">
  Swim upstream with our new API architecture! 🐟
</Callout>

---

## April 23, 2025

Speaking Bots - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/speaking-bots-2025-04-23.mdx


# 🐟 Speaking Bots: Persona Image Generation Update

<Callout type="info">
Dive into our latest feature that brings personas to life with AI-generated images! 🎨
</Callout>

## New Feature: Persona Image Generation API

### Key Improvements

<Steps>
<Step>Added new endpoint for generating persona images</Step>
<Step>Implemented robust image generation service</Step>
<Step>Enhanced error handling and response structures</Step>
</Steps>

### Technical Details

<Tabs items={['Models', 'Routes', 'Image Service']}>
<Tab value="Models">
- Added `PersonaImageRequest` model
- Created `PersonaImageResponse` model
- Supports detailed persona description inputs
</Tab>

<Tab value="Routes">
- New POST endpoint: `/personas/generate-image`
- Accepts persona details like name, gender, description
- Returns generated image URL and metadata
</Tab>

<Tab value="Image Service">
- Integrates with Replicate AI for image generation
- Uploads generated images to UTFS
- Handles various image generation scenarios
</Tab>
</Tabs>

### Example Request

```python
# Generate a persona image
request = PersonaImageRequest(
    name="Alex Johnson",
    gender="neutral",
    description="A creative software engineer",
    characteristics=["glasses", "professional attire"]
)
```

### Sequence of Image Generation

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant ImageService
    participant ReplicateAPI
    participant UTFS

    Client->>API: POST /personas/generate-image
    API->>ImageService: Generate persona image
    ImageService->>ReplicateAPI: Request image generation
    ReplicateAPI-->>ImageService: Return image
    ImageService->>UTFS: Upload image
    UTFS-->>ImageService: Confirm upload
    ImageService-->>API: Return image details
    API-->>Client: Persona image response
```

<Callout type="warn">
⚠️ Beta Feature: Image generation may have occasional variations in output quality.
</Callout>

---

## April 24, 2025

Speaking Bots - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/speaking-bots-2025-04-24.mdx


# Speaking Bots Image Generation Update 🐟

<Callout type="info">
  Dive into the latest waves of our persona image generation feature! We're making image creation as smooth as a bass gliding through water. 🐟
</Callout>

## Key Updates

### Image Generation Improvements

<Steps>
  <Step>Enhanced persona image generation with more precise name-based prompts</Step>
  <Step>Improved image creation workflow</Step>
  <Step>Refined error handling and image upload process</Step>
</Steps>

### Major Changes

<Tabs items={['Models', 'Routes', 'Services']}>
  <Tab value="Models">
    - Removed `prompt` field from `PersonaImageResponse`
    - Added `name` field to response model
  </Tab>
  <Tab value="Routes">
    - Updated `generate_persona_image` endpoint
    - Improved prompt construction
    - Refined image generation parameters
  </Tab>
  <Tab value="Services">
    - Added new `generate_persona_image` method
    - Implemented robust image generation logic
    - Enhanced error handling
  </Tab>
</Tabs>

### Technical Highlights

<Callout type="warn">
  Image generation now focuses on creating persona-specific images using the persona's name as a key input.
</Callout>

#### Image Generation Workflow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant ImageService
    participant ReplicateAPI
    participant UTFS

    Client->>API: POST request with persona name
    API->>ImageService: Generate image
    ImageService->>ReplicateAPI: Create image
    ReplicateAPI-->>ImageService: Return image URL
    ImageService->>UTFS: Upload image
    UTFS-->>ImageService: Confirm upload
    ImageService-->>API: Return image details
    API-->>Client: Persona image response
```

### Improvements Breakdown

<TypeTable 
  type={{
    "Image Generation": {
      description: "More precise persona-specific image creation",
      type: "Enhanced Algorithm",
      impact: "High"
    },
    "Prompt Construction": {
      description: "Uses persona name for more accurate results",
      type: "String Transformation",
      impact: "Medium"
    },
    "Error Handling": {
      description: "Improved robustness in image generation process",
      type: "Error Management",
      impact: "High"
    }
  }}
/>

<Callout type="info">
  Swim smoothly through our updated image generation feature - making persona images as unique as each fish in the sea! 🐟
</Callout>

---

## April 28, 2025

Speaking Bots - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/speaking-bots-2025-04-28.mdx


<Callout type="warn">
  This page contains automatically generated documentation based on Git activity related to the Speaking Bots service. 
  For the latest version of this content, please refer to the latest Git update.
</Callout>

# Speaking Bots Updates - April 28, 2025

## Commits

### auth issue resolved, added a middleware, image-generation input description made required

**Author:** Muskan180203

**Date:** 2025-04-28 23:37:26 +0530

**Hash:** `17e0d1339fd17f8d64351599d69c483439204b24`

**Related PR/MR:** None found



## Changed Files

- 📁 `app/models.py`
- 📁 `app/routes.py`

## Pull Request Comments

No pull request comments. 

## Code Diffs

<Callout type="info">
  Code diffs require the `--with-diff --include-code` flags when running git_grepper.sh.
  
  For detailed diffs, please use the git command line or a git UI tool to view changes between commits.
</Callout> 

---

## April 29, 2025

Speaking Bots - Automatically generated documentation based on Git activity.

### Source: ./content/docs/updates/speaking-bots-2025-04-29.mdx


# Speaking Bots Service Update 🐟

<Callout type="info">
  Hooked on security? We just reeled in some serious API authentication
  improvements! 🎣
</Callout>

## Key Authentication Enhancements

### API Key Security Upgrade

The latest update introduces centralized API key authentication with the following improvements:

<Steps>
  <Step>Enforced API key authentication for all endpoints</Step>
  <Step>Implemented middleware-based authentication</Step>
  <Step>Enhanced OpenAPI documentation</Step>
</Steps>

### Major Changes

<Tabs items={['Authentication', 'Documentation', 'Code Structure']}>
  <Tab value="Authentication">
    - Added `x-meeting-baas-api-key` header requirement - Centralized API key
    retrieval from request headers - Middleware checks API key for
    non-documentation endpoints
  </Tab>
  <Tab value="Documentation">
    - Extended OpenAPI schema with security definitions - Added detailed schemas
    for persona image generation - Updated health check endpoint metadata
  </Tab>
  <Tab value="Code Structure">
    - Removed API key fields from request models - Updated endpoint logic to use
    middleware-based authentication - Improved request state management
  </Tab>
</Tabs>

### Code Refactoring Highlights

<Accordions>
  <Accordion title="API Key Middleware" value="middleware">

```python
# Centralized API key authentication middleware
async def api_key_middleware(request: Request, call_next):
    # Exclude documentation routes
    if request.url.path.startswith("/docs"):
        return await call_next(request)

    # Check for API key in headers
    api_key = request.headers.get("x-meeting-baas-api-key")
    if not api_key:
        raise HTTPException(status_code=401, detail="API key required")

    # Store API key in request state
    request.state.api_key = api_key
    return await call_next(request)
```

  </Accordion>
</Accordions>

<Callout type="warn">
  Breaking Change: All API requests now require the `x-meeting-baas-api-key`
  header
</Callout>

### Sequence of Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant API Endpoint
    Client->>Middleware: Request with API key
    Middleware-->>Client: 401 if no API key
    Middleware->>API Endpoint: Pass request with API key in state
    API Endpoint-->>Client: Process request
```


---

