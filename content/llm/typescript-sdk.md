# TypeScript SDK for MeetingBaas

TypeScript SDK documentation for programmatically interacting with Meeting BaaS APIs.

## Advanced Examples

Advanced usage patterns and complex integration examples with the Meeting BaaS SDK.

### Source: ./content/docs/typescript-sdk/advanced-examples.mdx


### Comprehensive Bot Management Workflow

Here's a complete workflow for managing bots throughout their lifecycle:

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

const client = createBaasClient({
  api_key: "your-api-key",
  timeout: 60000
});

async function comprehensiveBotWorkflow() {
  try {
    // 1. Join a meeting with advanced configuration
    const joinResult = await client.joinMeeting({
      meeting_url: "https://meet.google.com/abc-defg-hij",
      bot_name: "Advanced Workflow Bot",
      reserved: false,
      bot_image: "https://example.com/bot-avatar.jpg",
      enter_message: "Hello! I'm here to record and transcribe this meeting.",
      extra: { 
        workflow_id: "comprehensive-example",
        user_id: "user123",
        session_type: "team-meeting"
      },
      recording_mode: "speaker_view",
      speech_to_text: { 
        provider: "Gladia",
        api_key: "your-gladia-key"
      },
      webhook_url: "https://your-app.com/webhooks/meeting-baas",
      noone_joined_timeout: 300, // 5 minutes
      waiting_room_timeout: 600  // 10 minutes
    });

    if (!joinResult.success) {
      console.error("Failed to join meeting:", joinResult.error);
      return;
    }

    const botId = joinResult.data.bot_id;
    console.log("Bot joined successfully:", botId);

    // 2. Monitor bot status and get meeting data
    let meetingData = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const dataResult = await client.getMeetingData({
        bot_id: botId,
        include_transcripts: true
      });

      if (dataResult.success) {
        meetingData = dataResult.data;
        
        // Check if meeting has ended
        if (meetingData.duration > 0) {
          console.log("Meeting completed. Duration:", meetingData.duration);
          break;
        }
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
      attempts++;
    }

    // 3. Process meeting data
    if (meetingData) {
      console.log("Meeting duration:", meetingData.duration);
      console.log("MP4 URL:", meetingData.mp4);
      console.log("Transcript count:", meetingData.bot_data.transcripts.length);
      
      // Process transcripts
      meetingData.bot_data.transcripts.forEach(transcript => {
        console.log(`Speaker: ${transcript.speaker}, Duration: ${transcript.end_time - transcript.start_time}s`);
      });
    }

    // 4. Leave the meeting
    const leaveResult = await client.leaveMeeting({ uuid: botId });
    if (leaveResult.success) {
      console.log("Bot left meeting successfully");
    }

    // 5. Clean up bot data
    const deleteResult = await client.deleteBotData({ uuid: botId });
    if (deleteResult.success) {
      console.log("Bot data deleted successfully");
    }

  } catch (error) {
    console.error("Unexpected error in workflow:", error);
  }
}
```

### Calendar Integration with Event Scheduling

Advanced calendar integration with automatic event scheduling:

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

const client = createBaasClient({
  api_key: "your-api-key"
});

async function advancedCalendarWorkflow() {
  try {
    // 1. Create calendar integration
    const calendarResult = await client.createCalendar({
      oauth_client_id: "your-oauth-client-id",
      oauth_client_secret: "your-oauth-client-secret",
      oauth_refresh_token: "your-oauth-refresh-token",
      platform: "Google"
    });

    if (!calendarResult.success) {
      console.error("Failed to create calendar:", calendarResult.error);
      return;
    }

    const calendarId = calendarResult.data.calendar.uuid;
    console.log("Calendar created:", calendarId);

    // 2. List upcoming events
    const eventsResult = await client.listCalendarEvents({
      calendar_id: calendarId,
      start_date_gte: new Date().toISOString(),
      start_date_lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "upcoming"
    });

    if (!eventsResult.success) {
      console.error("Failed to list events:", eventsResult.error);
      return;
    }

    console.log(`Found ${eventsResult.data.events.length} upcoming events`);

    // 3. Schedule recordings for events with meeting URLs
    for (const event of eventsResult.data.events) {
      if (event.meeting_url && event.is_organizer) {
        console.log(`Scheduling recording for: ${event.name}`);
        
        const scheduleResult = await client.scheduleCalendarRecordEvent({
          uuid: event.uuid,
          body: {
            bot_name: `Recording Bot - ${event.name}`,
            extra: {
              event_name: event.name,
              scheduled_by: "advanced-workflow",
              calendar_id: calendarId
            },
            recording_mode: "speaker_view",
            speech_to_text: { provider: "Gladia" },
            webhook_url: "https://your-app.com/webhooks/calendar-events",
            enter_message: `Hello! I'm here to record the meeting: ${event.name}`
          },
          query: { all_occurrences: event.is_recurring }
        });

        if (scheduleResult.success) {
          console.log(`Successfully scheduled recording for: ${event.name}`);
        } else {
          console.error(`Failed to schedule recording for: ${event.name}`, scheduleResult.error);
        }
      }
    }

    // 4. Monitor scheduled events
    const scheduledEventsResult = await client.listCalendarEvents({
      calendar_id: calendarId,
      status: "upcoming"
    });

    if (scheduledEventsResult.success) {
      scheduledEventsResult.data.events.forEach(event => {
        if (event.bot_param) {
          console.log(`Event "${event.name}" has bot scheduled:`, {
            bot_name: event.bot_param.bot_name,
            scheduled_time: event.start_time,
            meeting_url: event.meeting_url
          });
        }
      });
    }

  } catch (error) {
    console.error("Unexpected error in calendar workflow:", error);
  }
}
```

### Batch Operations and Error Handling

Advanced pattern for handling multiple operations with proper error handling:

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

const client = createBaasClient({
  api_key: "your-api-key"
});

interface BatchOperation {
  id: string;
  meeting_url: string;
  bot_name: string;
  expected_duration: number;
}

async function batchBotOperations(operations: BatchOperation[]) {
  const results = {
    successful: [] as string[],
    failed: [] as { id: string; error: string }[],
    in_progress: [] as string[]
  };

  // 1. Join all meetings
  const joinPromises = operations.map(async (op) => {
    try {
      const result = await client.joinMeeting({
        meeting_url: op.meeting_url,
        bot_name: op.bot_name,
        reserved: false,
        extra: { batch_id: op.id, expected_duration: op.expected_duration },
        webhook_url: "https://your-app.com/webhooks/batch-operations"
      });

      if (result.success) {
        results.in_progress.push(op.id);
        return { id: op.id, bot_id: result.data.bot_id, success: true };
      } else {
        results.failed.push({ id: op.id, error: result.error.message });
        return { id: op.id, success: false, error: result.error.message };
      }
    } catch (error) {
      results.failed.push({ id: op.id, error: error.message });
      return { id: op.id, success: false, error: error.message };
    }
  });

  const joinResults = await Promise.allSettled(joinPromises);
  
  // Process join results
  joinResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      console.log(`Bot joined for operation ${result.value.id}: ${result.value.bot_id}`);
    }
  });

  // 2. Monitor all active bots
  const activeBots = joinResults
    .filter((result, index) => result.status === 'fulfilled' && result.value.success)
    .map(result => (result as PromiseFulfilledResult<any>).value);

  if (activeBots.length > 0) {
    console.log(`Monitoring ${activeBots.length} active bots...`);
    
    // Wait for all meetings to complete
    const monitoringPromises = activeBots.map(async (bot) => {
      let attempts = 0;
      const maxAttempts = 60; // 30 minutes with 30-second intervals
      
      while (attempts < maxAttempts) {
        const dataResult = await client.getMeetingData({
          bot_id: bot.bot_id,
          include_transcripts: true
        });

        if (dataResult.success && dataResult.data.duration > 0) {
          // Meeting completed
          results.successful.push(bot.id);
          
          // Clean up
          await client.deleteBotData({ uuid: bot.bot_id });
          return { id: bot.id, duration: dataResult.data.duration };
        }

        await new Promise(resolve => setTimeout(resolve, 30000));
        attempts++;
      }

      // Timeout - force leave
      await client.leaveMeeting({ uuid: bot.bot_id });
      results.failed.push({ id: bot.id, error: "Meeting monitoring timeout" });
      return { id: bot.id, error: "Timeout" };
    });

    const monitoringResults = await Promise.allSettled(monitoringPromises);
    
    // Process monitoring results
    monitoringResults.forEach((result) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        console.log(`Operation ${result.value.id} completed in ${result.value.duration}s`);
      }
    });
  }

  // 3. Generate summary
  console.log("Batch operation summary:");
  console.log(`- Successful: ${results.successful.length}`);
  console.log(`- Failed: ${results.failed.length}`);
  console.log(`- In Progress: ${results.in_progress.length}`);

  if (results.failed.length > 0) {
    console.log("Failed operations:");
    results.failed.forEach(failure => {
      console.log(`  - ${failure.id}: ${failure.error}`);
    });
  }

  return results;
}

// Usage example
const operations: BatchOperation[] = [
  {
    id: "meeting-1",
    meeting_url: "https://meet.google.com/abc-def-ghi",
    bot_name: "Batch Bot 1",
    expected_duration: 3600
  },
  {
    id: "meeting-2", 
    meeting_url: "https://meet.google.com/jkl-mno-pqr",
    bot_name: "Batch Bot 2",
    expected_duration: 1800
  }
];

batchBotOperations(operations).then(summary => {
  console.log("Batch operations completed:", summary);
});
```

### Webhook Integration with Event Processing

Advanced webhook handling and event processing:

```typescript
import { createBaasClient } from "@meeting-baas/sdk";
import express from 'express';

const app = express();
app.use(express.json());

const client = createBaasClient({
  api_key: "your-api-key"
});

// Webhook event handler
app.post('/webhooks/meeting-baas', async (req, res) => {
  const { event_type, bot_id, data } = req.body;

  try {
    switch (event_type) {
      case 'bot_joined':
        console.log(`Bot ${bot_id} joined meeting`);
        // Update UI, send notifications, etc.
        break;

      case 'bot_left':
        console.log(`Bot ${bot_id} left meeting`);
        
        // Get final meeting data
        const meetingDataResult = await client.getMeetingData({
          bot_id: bot_id,
          include_transcripts: true
        });

        if (meetingDataResult.success) {
          const meetingData = meetingDataResult.data;
          
          // Process meeting data
          await processMeetingData(meetingData);
          
          // Clean up bot data
          await client.deleteBotData({ uuid: bot_id });
        }
        break;

      case 'transcription_completed':
        console.log(`Transcription completed for bot ${bot_id}`);
        // Process transcripts, update database, etc.
        break;

      case 'error':
        console.error(`Error for bot ${bot_id}:`, data.error);
        // Handle errors, retry logic, etc.
        break;

      default:
        console.log(`Unknown event type: ${event_type}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function processMeetingData(meetingData: any) {
  // Process meeting data based on your application needs
  console.log(`Processing meeting data: ${meetingData.duration}s duration`);
  
  if (meetingData.mp4) {
    console.log(`Recording available at: ${meetingData.mp4}`);
  }
  
  if (meetingData.bot_data.transcripts.length > 0) {
    console.log(`Found ${meetingData.bot_data.transcripts.length} transcripts`);
    
    // Process transcripts
    meetingData.bot_data.transcripts.forEach((transcript: any) => {
      console.log(`Speaker: ${transcript.speaker}, Words: ${transcript.words.length}`);
    });
  }
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### Error Recovery and Retry Logic

Advanced error handling with retry logic:

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

const client = createBaasClient({
  api_key: "your-api-key",
  timeout: 60000
});

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  }
): Promise<T> {
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      
      if (attempt === config.maxAttempts) {
        // throw error if last attempt
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
        config.maxDelay
      );
      
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function robustBotOperation() {
  try {
    // Join meeting with retry logic
    const joinResult = await retryOperation(async () => {
      const result = await client.joinMeeting({
        meeting_url: "https://meet.google.com/abc-def-ghi",
        bot_name: "Robust Bot",
        reserved: false
      });

      if (!result.success) {
        throw new Error(result.error.message);
      }

      return result;
    });

    console.log("Bot joined successfully:", joinResult.data.bot_id);

    // Monitor with retry logic
    const meetingData = await retryOperation(async () => {
      const result = await client.getMeetingData({
        bot_id: joinResult.data.bot_id,
        include_transcripts: true
      });

      if (!result.success) {
        throw new Error(result.error.message);
      }

      if (result.data.duration === 0) {
        throw new Error("Meeting not yet completed");
      }

      return result;
    }, {
      maxAttempts: 20, // More attempts for monitoring
      baseDelay: 5000, // 5 second base delay
      maxDelay: 30000, // Max 30 second delay
      backoffMultiplier: 1.5
    });

    console.log("Meeting completed:", meetingData.data.duration);

  } catch (error) {
    console.error("Operation failed after all retries:", error);
  }
}
```


---

## API Reference

Complete reference of all methods in the Meeting BaaS TypeScript SDK

### Source: ./content/docs/typescript-sdk/complete-reference.mdx


## Client Creation

### `createBaasClient`

Creates a new Meeting BaaS client instance.

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `api_key` | `string` | ✅ Yes | - | Your Meeting BaaS API key. Get yours at [settings.meetingbaas.com](https://settings.meetingbaas.com/credentials) |
| `timeout` | `number` | ❌ No | `30000` | Request timeout in seconds. Some requests may take longer, so we recommend setting a longer timeout if you notice timeouts |
| `base_url` | `string` | ❌ No | `"https://api.meetingbaas.com"` | Base URL for the API (internal parameter) |

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

const client = createBaasClient({
  api_key: "your-api-key",
  timeout: 30000 // optional, default: 30000
});
```

**Returns:**
- `BaasClient` instance

## Bot Management Methods

### `joinMeeting`

Have a bot join a meeting, now or in the future.

**Parameters:**
- `params`: [JoinRequest](/docs/api/reference/join#request-body) - Join meeting configuration

**Returns:**
- `success`: Boolean (true if bot joined successfully, false in case of any errors)
- `data`: [JoinResponse](/docs/api/reference/join) - bot_id of the bot joining the meeting
- `error`: Error, if any

```typescript
// Type imports
import type { JoinRequest, JoinResponse } from "@meeting-baas/sdk";
```

```typescript
// Example
const { success, data, error } = await client.joinMeeting({
  bot_name: "Meeting Assistant",
  meeting_url: "https://meet.google.com/abc-def-ghi",
  reserved: true,
  bot_image: "https://example.com/bot-image.jpg",
  enter_message: "Hello from the bot!",
  extra: { custom_id: "my-meeting" },
  recording_mode: "speaker_view",
  speech_to_text: { provider: "Gladia" },
  webhook_url: "https://example.com/webhook",
  noone_joined_timeout: 300,
  waiting_room_timeout: 600
});

if (success) {
  console.log("Bot joined successfully:", data.bot_id);
} else {
  console.error("Error joining meeting:", error);
}
```

### `leaveMeeting`

Have a bot leave a meeting.

**Parameters:**
- `params`: `{ uuid: string }` - Bot UUID to leave the meeting

**Returns:**
- `success`: Boolean (true if bot left successfully, false in case of any errors)
- `data`: [LeaveResponse](/docs/api/reference/leave) - Bot leave confirmation data
- `error`: Error, if any

```typescript
// Type imports
import type { LeaveResponse } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.leaveMeeting({
  uuid: "123e4567-e89b-12d3-a456-426614174000"
});

if (success) {
  console.log("Bot left successfully:", data.bot_id);
} else {
  console.error("Error leaving meeting:", error);
}
```

### `getMeetingData`

Get meeting recording and metadata.

**Parameters:**
- `params`: [GetMeetingDataParams](/docs/api/reference/get_meeting_data#query-parameters) - Parameters for retrieving meeting data

**Returns:**
- `success`: Boolean (true if meeting data retrieved successfully, false in case of any errors)
- `data`: [Metadata](/docs/api/reference/get_meeting_data) - Meeting metadata and recording information
- `error`: Error, if any

```typescript
// Type imports
import type { GetMeetingDataParams, Metadata } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.getMeetingData({
  bot_id: "123e4567-e89b-12d3-a456-426614174000",
  include_transcripts: true
});

if (success) {
  console.log("Meeting duration:", data.duration);
  console.log("MP4 URL:", data.mp4);
  console.log("Transcript count:", data.bot_data.transcripts.length);
} else {
  console.error("Error getting meeting data:", error);
}
```

### `deleteBotData`

Delete bot data permanently.

**Parameters:**
- `params`: `{ uuid: string }` - Bot UUID to delete

**Returns:**
- `success`: Boolean (true if bot data deleted successfully, false in case of any errors)
- `data`: [DeleteResponse](/docs/api/reference/delete_data) - Deletion confirmation
- `error`: Error, if any

```typescript
// Type imports
import type { DeleteResponse } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.deleteBotData({
  uuid: "123e4567-e89b-12d3-a456-426614174000"
});

if (success) {
  console.log("Bot data deleted successfully");
} else {
  console.error("Error deleting bot data:", error);
}
```

### `listBots`

Retrieves a paginated list of the user's bots with essential metadata, including IDs, names, and meeting details.

**Parameters:**
- `params?`: [BotsWithMetadataParams](/docs/api/reference/bots_with_metadata#query-parameters) - Optional filtering and pagination parameters

**Returns:**
- `success`: Boolean (true if bots retrieved successfully, false in case of any errors)
- `data`: [ListRecentBotsResponse](/docs/api/reference/bots_with_metadata) - Paginated list of bots with metadata
- `error`: Error, if any

```typescript
// Type imports
import type { BotsWithMetadataParams, ListRecentBotsResponse } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.listBots({
  limit: 10,
  cursor: "base64-cursor-string",
  bot_name: "Sales",
  created_after: "2024-01-01T00:00:00Z",
  filter_by_extra: "customer_id:12345"
});

if (success) {
  console.log("Bots found:", data.bots.length);
  console.log("Has more:", data.has_more);
} else {
  console.error("Error listing bots:", error);
}
```

### `retranscribeBot`

Transcribe or retranscribe a bot's audio using the Default or your provided Speech to Text Provider.

**Parameters:**
- `params`: [RetranscribeBody](/docs/api/reference/retranscribe_bot#request-body) - Retranscription configuration

**Returns:**
- `success`: Boolean (true if retranscription started successfully, false in case of any errors)
- `error`: Error, if any

```typescript
// Type imports
import type { RetranscribeBody } from "@meeting-baas/sdk";
```

```typescript
const { success, error } = await client.retranscribeBot({
  bot_uuid: "123e4567-e89b-12d3-a456-426614174000",
  speech_to_text: { provider: "Gladia" },
  webhook_url: "https://example.com/webhook"
});

if (success) {
  console.log("Retranscription started successfully");
} else {
  console.error("Error starting retranscription:", error);
}
```

### `getScreenshots`

Retrieves screenshots captured during the bot's session before it joins a meeting.

**Parameters:**
- `params`: `{ uuid: string }` - Bot UUID to retrieve screenshots for

**Returns:**
- `success`: Boolean (true if screenshots retrieved successfully, false in case of any errors)
- `data`: [ScreenshotsList](/docs/api/reference/get_screenshots) - Array of screenshot data
- `error`: Error, if any

```typescript
// Type imports
import type { ScreenshotsList } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.getScreenshots({
  uuid: "123e4567-e89b-12d3-a456-426614174000"
});

if (success) {
  console.log("Screenshots found:", data.length);
  data.forEach(screenshot => {
    console.log("Screenshot:", screenshot.url, "Date:", screenshot.date);
  });
} else {
  console.error("Error getting screenshots:", error);
}
```

## Calendar Management Methods

### `createCalendar`

Integrates a new calendar with the system using OAuth credentials. This endpoint establishes a connection with the calendar provider (Google, Microsoft), sets up webhook notifications for real-time updates, and performs an initial sync of all calendar events. It requires OAuth credentials (client ID, client secret, and refresh token) and the platform type. Once created, the calendar is assigned a unique UUID that should be used for all subsequent operations. Returns the newly created calendar object with all integration details.

**Parameters:**
- `params`: [CreateCalendarParams](/docs/api/reference/calendars/create_calendar#request-body) - Calendar integration parameters

**Returns:**
- `success`: Boolean (true if calendar created successfully, false in case of any errors)
- `data`: [CreateCalendarResponse](/docs/api/reference/calendars/create_calendar) - Created calendar information
- `error`: Error, if any

```typescript
// Type imports
import type { CreateCalendarParams, CreateCalendarResponse } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.createCalendar({
  oauth_client_id: "your-oauth-client-id",
  oauth_client_secret: "your-oauth-client-secret",
  oauth_refresh_token: "your-oauth-refresh-token",
  platform: "Google",
  raw_calendar_id: "optional-calendar-id"
});

if (success) {
  console.log("Calendar created:", data.calendar.name);
  console.log("Calendar UUID:", data.calendar.uuid);
} else {
  console.error("Error creating calendar:", error);
}
```

### `listCalendars`

Retrieves all calendars that have been integrated with the system for the authenticated user. Returns a list of calendars with their names, email addresses, provider information, and sync status. This endpoint shows only calendars that have been formally connected through the create_calendar endpoint, not all available calendars from the provider.

**Parameters:**
- None

**Returns:**
- `success`: Boolean (true if calendars retrieved successfully, false in case of any errors)
- `data`: [Calendar[]](/docs/api/reference/calendars/list_calendars) - Array of integrated calendars
- `error`: Error, if any

```typescript
// Type imports
import type { Calendar } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.listCalendars();

if (success) {
  console.log("Calendars found:", data.length);
  data.forEach(calendar => {
    console.log("Calendar:", calendar.name, "Email:", calendar.email);
  });
} else {
  console.error("Error listing calendars:", error);
}
```

### `getCalendar`

Retrieves detailed information about a specific calendar integration by its UUID. Returns comprehensive calendar data including the calendar name, email address, provider details (Google, Microsoft), sync status, and other metadata. This endpoint is useful for displaying calendar information to users or verifying the status of a calendar integration before performing operations on its events.

**Parameters:**
- `params`: `{ uuid: string }` - Calendar UUID to retrieve

**Returns:**
- `success`: Boolean (true if calendar retrieved successfully, false in case of any errors)
- `data`: [Calendar](/docs/api/reference/calendars/get_calendar) - Calendar details
- `error`: Error, if any

```typescript
// Type imports
import type { Calendar } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.getCalendar({
  uuid: "123e4567-e89b-12d3-a456-426614174000"
});

if (success) {
  console.log("Calendar details:", data);
} else {
  console.error("Error getting calendar:", error);
}
```

### `updateCalendar`

Updates a calendar integration with new credentials or platform while maintaining the same UUID. This operation is performed as an atomic transaction to ensure data integrity. The system automatically unschedules existing bots to prevent duplicates, updates the calendar credentials, and triggers a full resync of all events. Useful when OAuth tokens need to be refreshed or when migrating a calendar between providers. Returns the updated calendar object with its new configuration.

**Parameters:**
- `params`: `{ uuid: string; body: [UpdateCalendarParams](/docs/api/reference/calendars/update_calendar#request-body) }` - Calendar UUID and update parameters

**Returns:**
- `success`: Boolean (true if calendar updated successfully, false in case of any errors)
- `data`: [CreateCalendarResponse](/docs/api/reference/calendars/update_calendar) - Updated calendar information
- `error`: Error, if any

```typescript
// Type imports
import type { UpdateCalendarParams, CreateCalendarResponse } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.updateCalendar({
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  body: {
    oauth_client_id: "new-oauth-client-id",
    oauth_client_secret: "new-oauth-client-secret",
    oauth_refresh_token: "new-oauth-refresh-token",
    platform: "Google"
  }
});

if (success) {
  console.log("Calendar updated successfully");
} else {
  console.error("Error updating calendar:", error);
}
```

### `deleteCalendar`

Permanently removes a calendar integration by its UUID, including all associated events and bot configurations. This operation cancels any active subscriptions with the calendar provider, stops all webhook notifications, and unschedules any pending recordings. All related resources are cleaned up in the database. This action cannot be undone, and subsequent requests to this calendar's UUID will return 404 Not Found errors.

**Parameters:**
- `params`: `{ uuid: string }` - Calendar UUID to delete

**Returns:**
- `success`: Boolean (true if calendar deleted successfully, false in case of any errors)
- `error`: Error, if any

```typescript
const { success, error } = await client.deleteCalendar({
  uuid: "123e4567-e89b-12d3-a456-426614174000"
});

if (success) {
  console.log("Calendar deleted successfully");
} else {
  console.error("Error deleting calendar:", error);
}
```

### `getCalendarEvent`

Retrieves comprehensive details about a specific calendar event by its UUID. Returns complete event information including title, meeting link, start and end times, organizer status, recurrence information, and the full list of attendees with their names and email addresses. Also includes any associated bot parameters if recording is scheduled for this event. The raw calendar data from the provider is also included for advanced use cases.

**Parameters:**
- `params`: `{ uuid: string }` - Event UUID to retrieve

**Returns:**
- `success`: Boolean (true if event retrieved successfully, false in case of any errors)
- `data`: [Event](/docs/api/reference/calendars/get_event) - Event details
- `error`: Error, if any

```typescript
// Type imports
import type { Event } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.getCalendarEvent({
  uuid: "123e4567-e89b-12d3-a456-426614174000"
});

if (success) {
  console.log("Event:", data.name);
  console.log("Start time:", data.start_time);
  console.log("Meeting URL:", data.meeting_url);
  console.log("Attendees:", data.attendees.length);
} else {
  console.error("Error getting event:", error);
}
```

### `scheduleCalendarRecordEvent`

Configures a bot to automatically join and record a specific calendar event at its scheduled time. The request body contains detailed bot configuration, including recording options, streaming settings, and webhook notification URLs. For recurring events, the 'all_occurrences' parameter can be set to true to schedule recording for all instances of the recurring series, or false (default) to schedule only the specific instance. Returns the updated event(s) with the bot parameters attached.

**Parameters:**
- `params`: `{` uuid: string; body: [BotParam2](/docs/api/reference/calendars/schedule_record_event#request-body); query?: [ScheduleRecordEventParams](/docs/api/reference/calendars/schedule_record_event#query-parameters) `}` - Event UUID, bot configuration, and optional query parameters

**Returns:**
- `success`: Boolean (true if recording scheduled successfully, false in case of any errors)
- `data`: [Event[]](/docs/api/reference/calendars/schedule_record_event) - Array of scheduled events
- `error`: Error, if any

```typescript
// Type imports
import type { BotParam2, ScheduleRecordEventParams, Event } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.scheduleCalendarRecordEvent({
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  body: {
    bot_name: "Event Recording Bot",
    extra: { event_id: "my-event-123" },
    recording_mode: "speaker_view",
    speech_to_text: { provider: "Gladia" },
    webhook_url: "https://example.com/webhook",
    enter_message: "Hello! I'm here to record this meeting."
  },
  query: { all_occurrences: true }
});

if (success) {
  console.log("Recording scheduled successfully");
} else {
  console.error("Error scheduling recording:", error);
}
```

### `unscheduleCalendarRecordEvent`

Cancels a previously scheduled recording for a calendar event and releases associated bot resources. For recurring events, the 'all_occurrences' parameter controls whether to unschedule from all instances of the recurring series or just the specific occurrence. This operation is idempotent and will not error if no bot was scheduled. Returns the updated event(s) with the bot parameters removed.

**Parameters:**
- `params`: `{` uuid: string; query?: [UnscheduleRecordEventParams](/docs/api/reference/calendars/unschedule_record_event#query-parameters) `}` - Event UUID and optional query parameters

**Returns:**
- `success`: Boolean (true if recording unscheduled successfully, false in case of any errors)
- `data`: [Event[]](/docs/api/reference/calendars/unschedule_record_event) - Array of unscheduled events
- `error`: Error, if any

```typescript
// Type imports
import type { UnscheduleRecordEventParams, Event } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.unscheduleCalendarRecordEvent({
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  query: { all_occurrences: true }
});

if (success) {
  console.log("Recording unscheduled successfully");
} else {
  console.error("Error unscheduling recording:", error);
}
```

### `patchBot`

Updates the configuration of a bot already scheduled to record an event. Allows modification of recording settings, webhook URLs, and other bot parameters without canceling and recreating the scheduled recording. For recurring events, the 'all_occurrences' parameter determines whether changes apply to all instances or just the specific occurrence. Returns the updated event(s) with the modified bot parameters.

**Parameters:**
- `params`: `{` uuid: string; body: [BotParam3](/docs/api/reference/calendars/patch_bot#request-body); query?: [PatchBotParams](/docs/api/reference/calendars/patch_bot#query-parameters) `}` - Event UUID, bot configuration updates, and optional query parameters

**Returns:**
- `success`: Boolean (true if bot configuration updated successfully, false in case of any errors)
- `data`: [Event[]](/docs/api/reference/calendars/patch_bot) - Array of updated events
- `error`: Error, if any

```typescript
// Type imports
import type { BotParam3, PatchBotParams, Event } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.patchBot({
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  body: {
    bot_name: "Updated Bot Name",
    enter_message: "Updated enter message",
    webhook_url: "https://new-webhook.com/webhook"
  },
  query: { all_occurrences: false }
});

if (success) {
  console.log("Bot configuration updated successfully");
} else {
  console.error("Error updating bot configuration:", error);
}
```

### `listCalendarEvents`

Retrieves a paginated list of calendar events with comprehensive filtering options. Supports filtering by organizer email, attendee email, date ranges (start_date_gte, start_date_lte), and event status. Results can be limited to upcoming events (default), past events, or all events. Each event includes full details such as meeting links, participants, and recording status. The response includes a 'next' pagination cursor for retrieving additional results.

**Parameters:**
- `query`: [ListEventsParams](/docs/api/reference/calendars/list_events#query-parameters) - Filtering and pagination parameters

**Returns:**
- `success`: Boolean (true if events retrieved successfully, false in case of any errors)
- `data`: [ListEventResponse](/docs/api/reference/calendars/list_events) - Paginated list of events
- `error`: Error, if any

```typescript
// Type imports
import type { ListEventsParams, ListEventResponse } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.listCalendarEvents({
  calendar_id: "123e4567-e89b-12d3-a456-426614174000",
  start_date_gte: "2024-01-01T00:00:00Z",
  start_date_lte: "2024-12-31T23:59:59Z",
  status: "upcoming",
  attendee_email: "user@example.com",
  organizer_email: "organizer@example.com"
});

if (success) {
  console.log("Events found:", data.events.length);
  console.log("Next cursor:", data.next);
} else {
  console.error("Error listing events:", error);
}
```

### `resyncAllCalendars`

Triggers a full resync of all calendar events for all integrated calendars. This operation is useful when you need to ensure that all calendar data is up-to-date in the system. It will re-fetch all events from the calendar providers and update the system's internal state. Returns a response indicating the status of the resync operation.

**Parameters:**
- None

**Returns:**
- `success`: Boolean (true if calendars resynced successfully, false in case of any errors)
- `data`: [ResyncAllResponse](/docs/api/reference/calendars/resync_all) - Resync results and any errors
- `error`: Error, if any

```typescript
// Type imports
import type { ResyncAllResponse } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.resyncAllCalendars();

if (success) {
  console.log("Calendars synced:", data.synced_calendars.length);
  if (data.errors.length > 0) {
    console.log("Sync errors:", data.errors);
  }
} else {
  console.error("Error resyncing calendars:", error);
}
```

### `listRawCalendars`

Retrieves unprocessed calendar data directly from the provider (Google, Microsoft) using provided OAuth credentials. This endpoint is typically used during the initial setup process to allow users to select which calendars to integrate. Returns a list of available calendars with their unique IDs, email addresses, and primary status. This data is not persisted until a calendar is formally created using the create_calendar endpoint.

**Parameters:**
- `params`: [ListRawCalendarsParams](/docs/api/reference/calendars/list_raw_calendars#request-body) - OAuth credentials and platform

**Returns:**
- `success`: Boolean (true if raw calendars retrieved successfully, false in case of any errors)
- `data`: [ListRawCalendarsResponse](/docs/api/reference/calendars/list_raw_calendars) - Raw calendar data from provider
- `error`: Error, if any

```typescript
// Type imports
import type { ListRawCalendarsParams, ListRawCalendarsResponse } from "@meeting-baas/sdk";
```

```typescript
const { success, data, error } = await client.listRawCalendars({
  oauth_client_id: "your-oauth-client-id",
  oauth_client_secret: "your-oauth-client-secret",
  oauth_refresh_token: "your-oauth-refresh-token",
  platform: "Google"
});

if (success) {
  console.log("Raw calendars found:", data.calendars.length);
  data.calendars.forEach(calendar => {
    console.log("Calendar:", calendar.email, "Primary:", calendar.is_primary);
  });
} else {
  console.error("Error listing raw calendars:", error);
}
```

## Webhook Methods

### `getWebhookDocumentation`

Retrieves the full documentation for the webhook events that Meeting BaaS sends to your webhook URL. This includes all event types, their payload structures, and any additional metadata. Useful for developers to understand and integrate webhook functionality into their applications.

**Parameters:**
- None

**Returns:**
- `success`: Boolean (true if documentation retrieved successfully, false in case of any errors)
- `data`: [Webhook documentation data](/docs/api/reference/webhooks/webhook_documentation#webhook-event-types)
- `error`: Error, if any

```typescript
const { success, data, error } = await client.getWebhookDocumentation();

if (success) {
  console.log("Webhook documentation:", data);
} else {
  console.error("Error getting webhook documentation:", error);
}
```

### `getBotWebhookDocumentation`

Retrieves the full documentation for the webhook events that Meeting BaaS sends to your webhook URL for a specific bot. This includes all event types, their payload structures, and any additional metadata. Useful for developers to understand and integrate webhook functionality into their applications.

**Parameters:**
- None

**Returns:**
- `success`: Boolean (true if documentation retrieved successfully, false in case of any errors)
- `data`: [Bot webhook documentation data](/docs/api/reference/webhooks/bot_webhook_documentation#bot-webhook-event-types)
- `error`: Error, if any

```typescript
const { success, data, error } = await client.getBotWebhookDocumentation();

if (success) {
  console.log("Bot Webhook documentation:", data);
} else {
  console.error("Error getting bot webhook documentation:", error);
}
```

### `getCalendarWebhookDocumentation`

Retrieves the full documentation for the webhook events that Meeting BaaS sends to your webhook URL for a specific calendar. This includes all event types, their payload structures, and any additional metadata. Useful for developers to understand and integrate webhook functionality into their applications.

**Parameters:**
- None

**Returns:**
- `success`: Boolean (true if documentation retrieved successfully, false in case of any errors)
- `data`: [Calendar webhook documentation data](/docs/api/reference/webhooks/calendar_webhook_documentation#calendar-webhook-event-types)
- `error`: Error, if any

```typescript
const { success, data, error } = await client.getCalendarWebhookDocumentation();

if (success) {
  console.log("Calendar Webhook documentation:", data);
} else {
  console.error("Error getting calendar webhook documentation:", error);
}
```

## Response Types

All SDK methods return a discriminated union response:

```typescript
type ApiResponse<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: ZodError | Error; data?: never }
```

### Success Response
When `success` is `true`, the response contains:
- `data`: The actual response data of type `T`
- `error`: Never present

### Error Response
When `success` is `false`, the response contains:
- `error`: Either a `ZodError` (validation error) or `Error` (API error)
- `data`: Never present

## Error Handling

The SDK provides type-safe error handling:

```typescript
import { ZodError } from "zod";

const result = await client.joinMeeting({
  meeting_url: "https://meet.google.com/abc-def-ghi",
  bot_name: "My Bot"
});

if (result.success) {
  // TypeScript knows result.data is JoinResponse
  console.log("Bot ID:", result.data.bot_id);
} else {
  // TypeScript knows result.error is ZodError | Error
  if (result.error instanceof ZodError) {
    console.error("Validation error:", result.error.errors);
  } else {
    console.error("API error:", result.error.message);
  }
}
```

## TypeScript Support

The SDK provides full TypeScript support with generated types from the OpenAPI specification:

```typescript
import type { 
  JoinRequest, 
  JoinResponse, 
  CreateCalendarParams,
  BotParam2,
  Metadata 
} from "@meeting-baas/sdk";

// All types are available for advanced usage
const joinParams: JoinRequest = {
  meeting_url: "https://meet.google.com/abc-def-ghi",
  bot_name: "My Bot",
  reserved: false
};
```

## Related Documentation

- **[Getting Started](/docs/typescript-sdk/getting-started)** - Quick setup guide
- **[Quick Start](/docs/typescript-sdk/quick-start)** - Comprehensive usage examples
- **[Integration Guide](/docs/typescript-sdk/integration)** - Advanced integration patterns
- **[MCP Tools](/docs/typescript-sdk/mpc-tools)** - Using with Model Context Protocol
- **[Advanced Examples](/docs/typescript-sdk/advanced-examples)** - Complex use cases


---

## Getting Started

Learn how to install and use the Meeting BaaS TypeScript SDK.

### Source: ./content/docs/typescript-sdk/getting-started.mdx

<Callout type="info">
  This guide uses v2 API, the recommended version for new projects. Get your API key at [dashboard.meetingbaas.com](https://dashboard.meetingbaas.com/onboarding).
</Callout>

<Steps>
<Step>
### Install the Package

Install the Meeting BaaS SDK using your preferred package manager:

<Tabs groupId='package-manager' persist items={['npm', 'pnpm', 'yarn']}>

```bash tab="npm"
npm install @meeting-baas/sdk
```

```bash tab="pnpm"
pnpm add @meeting-baas/sdk
```

```bash tab="yarn"
yarn add @meeting-baas/sdk
```

</Tabs>

</Step>

<Step>
### Create a Client

Create a new instance of the BaaS client with your API key:

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

// Create a v2 BaaS client (recommended for new projects)
const client = createBaasClient({
  api_key: "your-api-key", // Get yours at https://dashboard.meetingbaas.com
  api_version: "v2"
});
```

<Callout type="warn">
  Make sure to keep your API key secure and never expose it in client-side code.
</Callout>

</Step>

<Step>
### Invoke Meeting BaaS methods

With this client instance created, you can call Meeting BaaS methods, such as:

```typescript
// Create a bot to join a meeting
const { success, data, error } = await client.createBot({
  bot_name: "Meeting Assistant",
  meeting_url: "https://meet.google.com/abc-def-ghi",
});

if (success) {
  console.log("Bot created successfully:", data.bot_id);
} else {
  console.error("Error creating bot:", error);
}
```

```typescript
// Have a bot leave the meeting
const { success, data, error } = await client.leaveBot({
  bot_id: "123e4567-e89b-12d3-a456-426614174000"
});

if (success) {
  console.log("Bot left the meeting successfully");
} else {
  console.error("Error leaving meeting:", error);
}
```

</Step>
</Steps> 


---

## Introduction

Get started with the Meeting BaaS TypeScript SDK

### Source: ./content/docs/typescript-sdk/index.mdx


<Callout type="info">
  We provide optimized documentation for both LLMs and recent MCP server updates. For more on our LLM integration, 
  see [LLMs](../llms/sdk) and for MCP access, visit [auth.meetingbaas.com](https://auth.meetingbaas.com/home).
</Callout>

<Callout type="info">
  **New to Meeting BaaS?** Start with v2 API - it's our recommended version with enhanced security, better error handling, and more features.
  Sign up at [dashboard.meetingbaas.com](https://dashboard.meetingbaas.com/onboarding).
</Callout>

<Callout type="warn">
  **Migrating from v1?** SDK v6.0.0 supports both v1 and v2 APIs. See our [Migration to v2 API Guide](/docs/typescript-sdk/migration-to-v2) for upgrade instructions.
</Callout>

## Introduction

The **Meeting BaaS SDK** is the officially supported TypeScript package that empowers developers to integrate with the Meeting BaaS API - the universal interface for automating meetings across Google Meet, Zoom, and Microsoft Teams. This SDK provides:

- **Complete type safety** with comprehensive TypeScript definitions and discriminated union responses
- **Automatic parameter validation** using Zod schemas for all API calls
- **Simplified error handling** with no try/catch required for API errors
- **Tree-shakeable client** for optimized bundle sizes
- **Cross-platform consistency** for all supported meeting providers

## Quick Example

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

// Create a v2 client (recommended for new projects)
const client = createBaasClient({
  api_key: "your-api-key", // Get yours at https://dashboard.meetingbaas.com
  api_version: "v2"
});

// Create a bot to join and record a meeting
const { success, data, error } = await client.createBot({
  bot_name: "Meeting Assistant",
  meeting_url: "https://meet.google.com/abc-def-ghi",
});

if (success) {
  console.log("Bot created successfully:", data.bot_id);
} else {
  console.error("Error creating bot:", error);
}
```

<Cards>
  <Card title="GitHub Repository" icon={<Github className="text-gray-400" />} href="https://github.com/Meeting-Baas/sdk-generator">
    View the source code, contribute, and track issues on GitHub.
  </Card>
  <Card title="npm Package" icon={<Package className="text-red-400" />} href="https://www.npmjs.com/package/@meeting-baas/sdk">
    Install and manage the SDK through npm.
  </Card>
</Cards>

## Features

<Cards>
  <Card title="Type-Safe API Client" icon={<Code className="text-blue-400" />}>
    Factory-based client creation with discriminated union responses for type-safe error handling.
    All parameters automatically validated using Zod schemas.
  </Card>
  <Card title="Bot Management" icon={<Bot className="text-green-400" />}>
    Create, join, and manage meeting bots across platforms including Google
    Meet, Zoom, and Microsoft Teams with comprehensive lifecycle management.
  </Card>
  <Card
    title="Calendar Integration"
    icon={<Calendar className="text-purple-400" />}
  >
    Connect calendars and automatically schedule meeting recordings with support
    for Google Calendar and Microsoft Outlook integration.
  </Card>
  <Card
    title="Complete API Coverage"
    icon={<CheckCircle className="text-teal-400" />}
  >
    Access to all Meeting BaaS API endpoints with consistent, well-documented
    interfaces and automatic code generation from OpenAPI specification.
  </Card>
  <Card
    title="Enhanced TypeScript Support"
    icon={<FileType className="text-orange-400" />}
  >
    Full TypeScript definitions for all APIs, including request/response types,
    discriminated union responses, and comprehensive error handling.
  </Card>
  <Card
    title="Flexible MCP Integration"
    icon={<Wrench className="text-yellow-400" />}
  >
    Use SDK functions directly in your MCP tool handlers for complete control over
    schemas, descriptions, and error handling in your Model Context Protocol servers.
  </Card>
  <Card title="Node.js Compatibility" icon={<ShieldCheck className="text-red-400" />}>
    Compatible and tested with Node.js versions 18, 19, 20, 21, and 22.
    Comprehensive test coverage across all supported versions.
  </Card>
  <Card
    title="Automated Updates"
    icon={<Cog className="text-indigo-400" />}
  >
    SDK automatically stays up-to-date with API changes through daily automated
    workflows. No manual intervention required.
  </Card>
  <Card
    title="Tree-Shakeable Bundle"
    icon={<Package className="text-pink-400" />}
  >
    Optimized bundle with tree shaking capabilities. Only import and ship the
    methods you actually use in your application.
  </Card>
</Cards>

## Learn More

<Cards>
  <Card
    title="Getting Started"
    icon={<Download />}
    href="/docs/typescript-sdk/getting-started"
  >
    Quick start guide with installation and basic usage examples.
  </Card>
  <Card
    title="Quick Start"
    icon={<Zap />}
    href="/docs/typescript-sdk/quick-start"
  >
    Comprehensive guide with advanced examples and integration patterns.
  </Card>
  <Card
    title="Integration"
    icon={<FileText />}
    href="/docs/typescript-sdk/integration"
  >
    Learn how to integrate the Meeting BaaS SDK with your applications and MCP servers.
  </Card>
  <Card
    title="MCP Tools"
    icon={<Wrench />}
    href="/docs/typescript-sdk/mpc-tools"
  >
    Using the SDK with Model Context Protocol servers.
  </Card>
  <Card
    title="Advanced Examples"
    icon={<MessageSquareText />}
    href="/docs/typescript-sdk/advanced-examples"
  >
    Complex integration patterns and use cases.
  </Card>
  <Card
    title="API Reference"
    icon={<SquareFunction />}
    href="/docs/typescript-sdk/complete-reference"
  >
    Complete API documentation for all SDK methods and types.
  </Card>
  <Card
    title="Migration to v2 API"
    icon={<ArrowUpCircle />}
    href="/docs/typescript-sdk/migration-to-v2"
  >
    Guide for migrating to v6.0.0 with v2 API support.
  </Card>
</Cards>


---

## Integration

Learn how to integrate the Meeting BaaS SDK with your applications and MCP servers.

### Source: ./content/docs/typescript-sdk/integration.mdx


<Callout type="info">
  This guide uses v2 API, the recommended version for new projects. Get your API key at [dashboard.meetingbaas.com](https://dashboard.meetingbaas.com/onboarding).
</Callout>

## SDK Integration

The Meeting BaaS SDK provides a clean, type-safe interface for integrating with the Meeting BaaS API. Here are the main integration patterns:

### Basic SDK Integration

The simplest way to integrate the SDK:

```typescript
import { createBaasClient } from '@meeting-baas/sdk';

// Create a v2 BaaS client with your API key
const client = createBaasClient({
  api_key: process.env.MEETING_BAAS_API_KEY,
  api_version: 'v2'
});

// Use the client for API calls
const { success, data, error } = await client.createBot({
  bot_name: 'My Bot',
  meeting_url: 'https://meet.google.com/abc-def-ghi',
});

if (success) {
  console.log('Bot created successfully:', data.bot_id);
} else {
  console.error('Error creating bot:', error);
}
```

### MCP Server Integration

For MCP (Model Context Protocol) server integration, you can use the SDK functions directly within your tool handlers:

```typescript
import { createBaasClient } from "@meeting-baas/sdk"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0"
})

// @modelcontextprotocol/sdk expects the input schema to be a ZodRawShape (plain object with zod types)
const createBotInputSchema = {
  bot_name: z.string().default("Meeting BaaS Bot"),
  meeting_url: z.string()
}

// Add a createBot tool
server.registerTool(
  "createBot",
  {
    title: "Send a Meeting BaaS bot to a meeting",
    description:
      "Send a Meeting BaaS bot to a Google Meet/Teams/Zoom meeting to automatically record and transcribe the meeting with speech diarization",
    inputSchema: createBotInputSchema
  },
  async (args) => {
    const client = createBaasClient({
      api_key: "your-api-key",
      api_version: "v2"
    })

    const { success, data, error } = await client.createBot(args)

    if (success) {
      return {
        content: [{ type: "text", text: `Successfully created bot: ${JSON.stringify(data)}` }]
      }
    }

    return {
      content: [{ type: "text", text: `Failed to create bot: ${error}` }]
    }
  }
)
```

### Calendar Integration

For calendar integration:

```typescript
import { createBaasClient } from '@meeting-baas/sdk';

const client = createBaasClient({
  api_key: 'your-api-key',
  api_version: 'v2'
});

// Create a calendar connection
const calendarResult = await client.createCalendarConnection({
  calendar_platform: 'google',
  oauth_client_id: 'your-oauth-client-id',
  oauth_client_secret: 'your-oauth-client-secret',
  oauth_refresh_token: 'your-oauth-refresh-token',
  raw_calendar_id: 'primary'
});

if (calendarResult.success) {
  console.log('Calendar connected:', calendarResult.data);

  // List all calendars
  const calendarsResult = await client.listCalendars();
  if (calendarsResult.success) {
    console.log('All calendars:', calendarsResult.data);
  }

  // List events from a calendar
  const eventsResult = await client.listEvents({
    calendar_id: calendarResult.data.calendar_id
  });
  
  if (eventsResult.success) {
    console.log('Events:', eventsResult.data);
  }

  // Schedule a bot for an event
  if (eventsResult.success && eventsResult.data.events.length > 0) {
    const scheduleResult = await client.createCalendarBot({
      calendar_id: calendarResult.data.calendar_id,
      body: {
        event_id: eventsResult.data.events[0].event_id,
        bot_name: 'Event Recording Bot'
      }
    });
    
    if (scheduleResult.success) {
      console.log('Bot scheduled for event successfully');
    }
  }
} else {
  console.error('Error connecting calendar:', calendarResult.error);
}
```

### Next.js API Route Example

For Next.js applications:

```typescript
// app/api/meeting-baas/route.ts
import { createBaasClient } from "@meeting-baas/sdk";

export async function POST(req: Request) {
  const { meeting_url, bot_name } = await req.json();

  const client = createBaasClient({
    api_key: process.env.MEETING_BAAS_API_KEY!,
    api_version: 'v2'
  });

  const result = await client.createBot({
    meeting_url,
    bot_name: bot_name || 'Meeting BaaS Bot',
  });

  if (result.success) {
    return Response.json({ 
      success: true, 
      bot_id: result.data.bot_id 
    });
  } else {
    return Response.json({ 
      success: false, 
      error: result.error,
      code: result.code
    }, { status: result.statusCode || 400 });
  }
}
```

### Express.js Integration

For Express.js applications:

```typescript
import express from 'express';
import { createBaasClient } from '@meeting-baas/sdk';

const app = express();
app.use(express.json());

const client = createBaasClient({
  api_key: process.env.MEETING_BAAS_API_KEY!,
  api_version: 'v2'
});

app.post('/create-bot', async (req, res) => {
  const { meeting_url, bot_name } = req.body;

  const result = await client.createBot({
    meeting_url,
    bot_name: bot_name || 'Meeting BaaS Bot',
  });

  if (result.success) {
    res.json({ 
      success: true, 
      bot_id: result.data.bot_id 
    });
  } else {
    res.status(result.statusCode || 400).json({ 
      success: false, 
      error: result.error,
      code: result.code
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```


---

## MCP Tools

Learn how to create MCP (Model Context Protocol) tools using the Meeting BaaS SDK functions.

### Source: ./content/docs/typescript-sdk/mcp-tools.mdx


## Creating MCP Tools with the SDK

The Meeting BaaS SDK v5.0.0 provides a clean approach for creating MCP tools by using the SDK functions directly within your tool handlers. This gives you full control over tool schemas, descriptions, and registration.

### Basic MCP Tool Creation

Here's how to create MCP tools using the SDK:

```typescript
import { type JoinRequest, createBaasClient } from "@meeting-baas/sdk"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

// Create an MCP server
const server = new McpServer({
  name: "meeting-baas-server",
  version: "1.0.0"
})

// Define the input schema for the join meeting tool
const joinToolInputSchema = {
  bot_name: z.string().default("Meeting BaaS Bot"),
  meeting_url: z.string(),
  reserved: z.boolean().default(false)
}

// Register the join meeting tool
server.registerTool(
  "joinMeeting",
  {
    title: "Send a Meeting BaaS bot to a meeting",
    description:
      "Send a Meeting BaaS bot to a Google Meet/Teams/Zoom meeting to automatically record and transcribe the meeting with speech diarization",
    inputSchema: joinToolInputSchema
  },
  async (args) => {
    const client = createBaasClient({
      api_key: "your-api-key"
    })

    const { success, data, error } = await client.joinMeeting(args as JoinRequest)

    if (success) {
      return {
        content: [{ type: "text", text: `Successfully joined meeting: ${JSON.stringify(data)}` }]
      }
    }

    return {
      content: [{ type: "text", text: `Failed to join meeting: ${error}` }]
    }
  }
)
```

### Multiple Tools Example

Here's how to create multiple MCP tools:

```typescript
import { 
  type JoinRequest, 
  type GetMeetingDataParams,
  type LeaveRequest,
  createBaasClient 
} from "@meeting-baas/sdk"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

const server = new McpServer({
  name: "meeting-baas-server",
  version: "1.0.0"
})

// Join Meeting Tool
server.registerTool(
  "joinMeeting",
  {
    title: "Send a Meeting BaaS bot to a meeting",
    description: "Send a Meeting BaaS bot to a meeting to record and transcribe",
    inputSchema: {
      bot_name: z.string().default("Meeting BaaS Bot"),
      meeting_url: z.string(),
      reserved: z.boolean().default(false)
    }
  },
  async (args) => {
    const client = createBaasClient({ api_key: "your-api-key" })
    const { success, data, error } = await client.joinMeeting(args as JoinRequest)
    
    if (success) {
      return {
        content: [{ type: "text", text: `Bot joined successfully with ID: ${data.bot_id}` }]
      }
    }
    
    return {
      content: [{ type: "text", text: `Failed to join meeting: ${error}` }]
    }
  }
)

// Get Meeting Data Tool
server.registerTool(
  "getMeetingData",
  {
    title: "Get meeting recording and metadata",
    description: "Retrieve meeting data including transcripts and recording URL",
    inputSchema: {
      bot_id: z.string(),
      include_transcripts: z.boolean().default(true)
    }
  },
  async (args) => {
    const client = createBaasClient({ api_key: "your-api-key" })
    const { success, data, error } = await client.getMeetingData(args as GetMeetingDataParams)
    
    if (success) {
      return {
        content: [{ 
          type: "text", 
          text: `Meeting data retrieved: Duration: ${data.duration}s, MP4: ${data.mp4 || 'Not available'}` 
        }]
      }
    }
    
    return {
      content: [{ type: "text", text: `Failed to get meeting data: ${error}` }]
    }
  }
)

// Leave Meeting Tool
server.registerTool(
  "leaveMeeting",
  {
    title: "Have a bot leave a meeting",
    description: "Make a bot leave the meeting it's currently in",
    inputSchema: {
      uuid: z.string()
    }
  },
  async (args) => {
    const client = createBaasClient({ api_key: "your-api-key" })
    const { success, data, error } = await client.leaveMeeting(args as LeaveRequest)
    
    if (success) {
      return {
        content: [{ type: "text", text: `Bot left meeting successfully: ${data.bot_id}` }]
      }
    }
    
    return {
      content: [{ type: "text", text: `Failed to leave meeting: ${error}` }]
    }
  }
)
```

### Calendar Tools Example

Here's how to create calendar-related MCP tools:

```typescript
import { 
  type CreateCalendarParams,
  type ListCalendarEventsParams,
  createBaasClient 
} from "@meeting-baas/sdk"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

const server = new McpServer({
  name: "meeting-baas-calendar-server",
  version: "1.0.0"
})

// Create Calendar Tool
server.registerTool(
  "createCalendar",
  {
    title: "Create a calendar integration",
    description: "Integrate a new calendar with Meeting BaaS using OAuth credentials",
    inputSchema: {
      oauth_client_id: z.string(),
      oauth_client_secret: z.string(),
      oauth_refresh_token: z.string(),
      platform: z.enum(["Google", "Microsoft"]),
      raw_calendar_id: z.string().optional()
    }
  },
  async (args) => {
    const client = createBaasClient({ api_key: "your-api-key" })
    const { success, data, error } = await client.createCalendar(args as CreateCalendarParams)
    
    if (success) {
      return {
        content: [{ 
          type: "text", 
          text: `Calendar created successfully: ${data.calendar.name} (${data.calendar.uuid})` 
        }]
      }
    }
    
    return {
      content: [{ type: "text", text: `Failed to create calendar: ${error}` }]
    }
  }
)

// List Calendar Events Tool
server.registerTool(
  "listCalendarEvents",
  {
    title: "List calendar events",
    description: "Get a list of events from a specific calendar",
    inputSchema: {
      calendar_id: z.string(),
      start_date_gte: z.string().optional(),
      start_date_lte: z.string().optional(),
      status: z.enum(["upcoming", "past", "all"]).default("upcoming")
    }
  },
  async (args) => {
    const client = createBaasClient({ api_key: "your-api-key" })
    const { success, data, error } = await client.listCalendarEvents(args as ListCalendarEventsParams)
    
    if (success) {
      const eventCount = data.events.length
      return {
        content: [{ 
          type: "text", 
          text: `Found ${eventCount} events in calendar. Next cursor: ${data.next || 'None'}` 
        }]
      }
    }
    
    return {
      content: [{ type: "text", text: `Failed to list events: ${error}` }]
    }
  }
)
```

### Error Handling Best Practices

When creating MCP tools, it's important to handle errors gracefully:

```typescript
server.registerTool(
  "joinMeeting",
  {
    title: "Join Meeting",
    description: "Join a meeting with a bot",
    inputSchema: {
      meeting_url: z.string(),
      bot_name: z.string().default("Meeting BaaS Bot")
    }
  },
  async (args) => {
    try {
      const client = createBaasClient({ api_key: "your-api-key" })
      const { success, data, error } = await client.joinMeeting(args)
      
      if (success) {
        return {
          content: [{ 
            type: "text", 
            text: `Successfully joined meeting. Bot ID: ${data.bot_id}` 
          }]
        }
      } else {
        // Handle API errors
        if (error instanceof z.ZodError) {
          return {
            content: [{ 
              type: "text", 
              text: `Validation error: ${error.errors.map(e => e.message).join(', ')}` 
            }]
          }
        }
        
        return {
          content: [{ 
            type: "text", 
            text: `API error: ${error.message}` 
          }]
        }
      }
    } catch (unexpectedError) {
      // Handle unexpected errors
      return {
        content: [{ 
          type: "text", 
          text: `Unexpected error: ${unexpectedError}` 
        }]
      }
    }
  }
)
```

### Available SDK Methods for MCP Tools

You can create MCP tools for any of these SDK methods:

#### Bot Management
- `joinMeeting` - Have a bot join a meeting
- `leaveMeeting` - Have a bot leave a meeting
- `getMeetingData` - Get meeting recording and metadata
- `deleteBotData` - Delete bot data
- `listBots` - List bots with metadata
- `retranscribeBot` - Retranscribe bot recordings
- `getScreenshots` - Get bot screenshots

#### Calendar Management
- `createCalendar` - Create a calendar integration
- `listCalendars` - List all calendars
- `getCalendar` - Get calendar details
- `updateCalendar` - Update calendar credentials
- `deleteCalendar` - Delete a calendar
- `getCalendarEvent` - Get event details
- `scheduleCalendarRecordEvent` - Schedule recording for an event
- `unscheduleCalendarRecordEvent` - Unschedule recording
- `patchBot` - Update scheduled bot configuration
- `listCalendarEvents` - List calendar events
- `resyncAllCalendars` - Resync all calendars
- `listRawCalendars` - List raw calendars from provider

#### Webhooks
- `getWebhookDocumentation` - Get webhook documentation
- `getBotWebhookDocumentation` - Get bot webhook documentation
- `getCalendarWebhookDocumentation` - Get calendar webhook documentation

### Benefits of This Approach

1. **Full Control**: You have complete control over tool schemas and descriptions
2. **Type Safety**: Full TypeScript support with generated types
3. **Flexibility**: Customize error handling and responses
4. **Consistency**: Use the same SDK functions across your application
5. **Maintainability**: Easy to update when the SDK changes


---

## Migration to v2 API

Guide for migrating from Meeting BaaS SDK v5.x to v6.0.0 with v2 API support.

### Source: ./content/docs/typescript-sdk/migration-to-v2.mdx


<Callout type="info">
  **SDK v6.0.0** adds support for Meeting BaaS v2 API while maintaining full backward compatibility with v1 API. All existing v1 code continues to work without changes.
</Callout>

## About Meeting BaaS v2

Meeting BaaS v2 is a new revamp of API platform, built on your feedback and the experience of building a meeting bot api of the last two years.

<Cards>
  <Card title="v2 Release Notes" icon={<FileText />} href="https://www.meetingbaas.com/en/api/introducing-meeting-baas-v2">
    Read the full announcement with all new features, improvements, and what's coming next.
  </Card>
  <Card title="v2 API Migration Guide" icon={<ArrowRight />} href="/docs/api-v2/migration-guide">
    Complete guide to migrating your API calls from v1 to v2 (without the SDK).
  </Card>
</Cards>

## What's New in SDK v6.0.0

- **Dual API Support**: Support for both Meeting BaaS v1 and v2 APIs in parallel
- **Type-Safe Version Selection**: TypeScript automatically infers available methods based on `api_version`
- **Pass-Through v2 Responses**: v2 API responses are passed through without transformation
- **Backward Compatible**: All existing v1 code continues to work without changes
- **Easy Migration Path**: Simply change `api_version: "v2"` to migrate to v2 API

## No Breaking Changes

v6.0.0 is **fully backward compatible** with v5.x. All existing code using v1 API will continue to work without any changes.

## Configuration Options

The client accepts the following configuration options:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `api_key` | `string` | ✅ Yes | - | Your Meeting BaaS API key. Get yours at [meetingbaas.com](https://meetingbaas.com) |
| `api_version` | `"v1" \| "v2"` | ❌ No | `"v1"` | API version to use. Use `"v2"` for the new Meeting BaaS v2 API |
| `timeout` | `number` | ❌ No | `30000` | Request timeout in milliseconds |

```typescript
interface BaasClientConfig {
  api_key: string;           // Required: Your Meeting BaaS API key
  api_version?: "v1" | "v2"; // Optional: API version (default: "v1")
  base_url?: string;         // Optional: Base URL (internal use)
  timeout?: number;          // Optional: Request timeout in ms (default: 30000)
}
```

## Update Dependencies

```bash tab="npm"
npm install @meeting-baas/sdk@^6.0.0
```

```bash tab="pnpm"
pnpm add @meeting-baas/sdk@^6.0.0
```

```bash tab="yarn"
yarn add @meeting-baas/sdk@^6.0.0
```

## Using the v2 API

### Basic Usage

To use the v2 API, specify `api_version: "v2"` when creating the client:

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

// v1 API (default, backward compatible)
const v1Client = createBaasClient({
  api_key: "your-api-key"
  // api_version defaults to "v1"
});

// v2 API
const v2Client = createBaasClient({
  api_key: "your-api-key",
  api_version: "v2"
});
```

### Type-Safe Method Access

TypeScript automatically infers which methods are available based on the API version:

```typescript
// v1 client - only v1 methods available
const v1Client = createBaasClient({ api_key: "key" });
v1Client.joinMeeting({ ... }); // ✅ Available
v1Client.createBot({ ... }); // ❌ TypeScript error - not available

// v2 client - only v2 methods available
const v2Client = createBaasClient({ api_key: "key", api_version: "v2" });
v2Client.createBot({ ... }); // ✅ Available
v2Client.joinMeeting({ ... }); // ❌ TypeScript error - not available
```

## Response Format Differences

### v1 API Response

```typescript
type ApiResponse<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: ZodError | Error; data?: never }
```

### v2 API Response

```typescript
type ApiResponseV2<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string; statusCode: number; details: unknown | null }
```

**Key Differences:**

- v1: SDK wraps responses, `error` can be `ZodError | Error`
- v2: API already returns structured format, SDK passes through as-is
- v2 error responses include `code`, `statusCode`, and `details` fields

### Batch Routes (v2)

v2 batch routes return a special format for partial success:

```typescript
// Batch response format
{
  success: true,
  data: [...], // Successful items
  errors: [...] // Failed items with error details
}

// Example: batchCreateBots
const result = await v2Client.batchCreateBots({
  bots: [...]
});

if (result.success) {
  console.log("Successful:", result.data);
  if (result.errors.length > 0) {
    console.log("Failed:", result.errors);
  }
}
```

## v1 to v2 Method Mapping

When migrating from v1 to v2, use this mapping to find the equivalent v2 methods:

### Bot Methods

| v1 Method | v2 Method | Notes |
|-----------|-----------|-------|
| `joinMeeting` | `createBot` | Creates and joins immediately |
| `leaveMeeting` | `leaveBot` | - |
| `getMeetingData` | `getBotDetails` | - |
| `deleteBotData` | `deleteBotData` | Now accepts `delete_from_provider` option |
| `listBots` | `listBots` | - |
| `retranscribeBot` | - | Not available in v2 |
| `getScreenshots` | `getBotScreenshots` | Now supports pagination |

### Calendar Methods

| v1 Method | v2 Method | Notes |
|-----------|-----------|-------|
| `createCalendar` | `createCalendarConnection` | - |
| `listCalendars` | `listCalendars` | - |
| `getCalendar` | `getCalendarDetails` | - |
| `updateCalendar` | `updateCalendarConnection` | - |
| `deleteCalendar` | `deleteCalendarConnection` | - |
| `listCalendarEvents` | `listEvents` | Now requires `calendar_id` in path |
| `getCalendarEvent` | `getEventDetails` | Now requires `calendar_id` in path |
| `scheduleCalendarRecordEvent` | `createCalendarBot` | - |
| `unscheduleCalendarRecordEvent` | `deleteCalendarBot` | - |
| `patchBot` | `updateCalendarBot` | - |
| `listRawCalendars` | `listRawCalendars` | - |
| `resyncAllCalendars` | `syncCalendar` | Now per-calendar |

### New v2-Only Methods

These methods are only available in v2:

- `batchCreateBots` - Create multiple bots at once
- `getBotStatus` - Get bot status separately from details
- `resendFinalWebhook` - Resend the final webhook for a bot
- `retryCallback` - Retry a failed callback
- `createScheduledBot` - Create a bot scheduled for a future time
- `batchCreateScheduledBots` - Create multiple scheduled bots
- `listScheduledBots` - List scheduled bots
- `getScheduledBot` - Get scheduled bot details
- `updateScheduledBot` - Update a scheduled bot
- `deleteScheduledBot` - Delete a scheduled bot
- `listEventSeries` - List recurring event series
- `resubscribeCalendar` - Resubscribe to calendar webhooks

## Migration Examples

### Example 1: Migrating Bot Creation from v1 to v2

**Before (v1 API):**

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

const client = createBaasClient({
  api_key: "your-api-key"
});

const result = await client.joinMeeting({
  meeting_url: "https://meet.google.com/abc-def-ghi",
  bot_name: "My Bot",
  reserved: true
});

if (result.success) {
  console.log("Bot ID:", result.data.bot_id);
}
```

**After (v2 API):**

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

const client = createBaasClient({
  api_key: "your-api-key",
  api_version: "v2" // Only change needed!
});

// v2 uses createBot instead of joinMeeting
const result = await client.createBot({
  meeting_url: "https://meet.google.com/abc-def-ghi",
  bot_name: "My Bot"
});

if (result.success) {
  console.log("Bot ID:", result.data.bot_id);
} else {
  // v2 error format includes code and statusCode
  console.error("Error:", result.error);
  console.error("Code:", result.code);
  console.error("Status:", result.statusCode);
}
```

### Example 2: Using Both APIs in Parallel

You can use both APIs in the same codebase:

```typescript
import { createBaasClient } from "@meeting-baas/sdk";

const v1Client = createBaasClient({
  api_key: "your-api-key",
  api_version: "v1"
});

const v2Client = createBaasClient({
  api_key: "your-api-key",
  api_version: "v2"
});

// Use v1 for legacy operations
const v1Result = await v1Client.joinMeeting({ ... });

// Use v2 for new features
const v2Result = await v2Client.createBot({ ... });
```

## v2 API Methods Reference

### Bot Management

| Method | Description |
|--------|-------------|
| `createBot` | Create a bot |
| `batchCreateBots` | Create multiple bots |
| `listBots` | List bots |
| `getBotDetails` | Get bot details |
| `getBotStatus` | Get bot status |
| `getBotScreenshots` | Get bot screenshots |
| `leaveBot` | Leave meeting |
| `deleteBotData` | Delete bot data |
| `resendFinalWebhook` | Resend final webhook |
| `retryCallback` | Retry callback |

### Scheduled Bot Management

| Method | Description |
|--------|-------------|
| `createScheduledBot` | Create scheduled bot |
| `batchCreateScheduledBots` | Create multiple scheduled bots |
| `listScheduledBots` | List scheduled bots |
| `getScheduledBot` | Get scheduled bot details |
| `updateScheduledBot` | Update scheduled bot |
| `deleteScheduledBot` | Delete scheduled bot |

### Calendar Connection Management

| Method | Description |
|--------|-------------|
| `listRawCalendars` | List raw calendars (preview before creating connection) |
| `createCalendarConnection` | Create calendar connection |
| `listCalendars` | List calendar connections |
| `getCalendarDetails` | Get calendar connection details |
| `updateCalendarConnection` | Update calendar connection |
| `deleteCalendarConnection` | Delete calendar connection |
| `syncCalendar` | Sync calendar events |
| `resubscribeCalendar` | Resubscribe to calendar webhooks |

### Calendar Event Management

| Method | Description |
|--------|-------------|
| `listEvents` | List calendar events |
| `listEventSeries` | List event series |
| `getEventDetails` | Get event details |

### Calendar Bot Management

| Method | Description |
|--------|-------------|
| `createCalendarBot` | Schedule bot for calendar event |
| `updateCalendarBot` | Update calendar bot |
| `deleteCalendarBot` | Cancel calendar bot |

## Webhook Types (v2)

The v2 API includes comprehensive TypeScript types for all webhook events:

### Bot Webhooks

- `BotWebhookCompleted` - Sent when a bot successfully completes recording
- `BotWebhookFailed` - Sent when a bot fails to join or record
- `BotWebhookStatusChange` - Sent when a bot's status changes

### Calendar Webhooks

- `CalendarWebhookConnectionCreated` - Sent when a calendar connection is created
- `CalendarWebhookConnectionUpdated` - Sent when a calendar connection is updated
- `CalendarWebhookConnectionDeleted` - Sent when a calendar connection is deleted
- `CalendarWebhookEventCreated` - Sent when a calendar event is created
- `CalendarWebhookEventUpdated` - Sent when a calendar event is updated
- `CalendarWebhookEventCancelled` - Sent when a calendar event is cancelled
- `CalendarWebhookEventsSynced` - Sent when a calendar completes the initial sync

### Callback Payloads

- `CallbackCompleted` - Callback payload sent when a bot successfully completes recording (event: `"bot.completed"`)
- `CallbackFailed` - Callback payload sent when a bot fails to join or record (event: `"bot.failed"`)

<Callout type="info">
  Callback payloads have the same structure as webhook events but are sent to bot-specific callback URLs configured via `callback_config` when creating bots.
</Callout>

For detailed webhook documentation, see the [v2 API webhook reference](https://docs.meetingbaas.com/api-v2/reference/webhooks).

### Usage Example

```typescript
import type { V2 } from "@meeting-baas/sdk";

// Type-safe webhook handler
async function handleWebhook(payload: V2.BotWebhookCompleted) {
  if (payload.event === "bot.completed") {
    console.log("Bot completed:", payload.data.bot_id);
    console.log("Transcription:", payload.data.transcription);
    console.log("Video URL:", payload.data.video);
  }
}

// Handle multiple event types with discriminated unions
type WebhookEvent = 
  | V2.BotWebhookCompleted 
  | V2.BotWebhookFailed 
  | V2.BotWebhookStatusChange
  | V2.CalendarWebhookEventCreated;

async function handleAnyWebhook(payload: WebhookEvent) {
  switch (payload.event) {
    case "bot.completed":
      // TypeScript knows payload.data has BotWebhookCompletedData
      break;
    case "bot.failed":
      // TypeScript knows payload.data has BotWebhookFailedData
      break;
    // ... other cases
  }
}

// Callback payloads can be handled the same way
async function handleCallback(payload: V2.CallbackCompleted | V2.CallbackFailed) {
  if (payload.event === "bot.completed") {
    // TypeScript knows this is CallbackCompleted
    console.log("Callback - Bot completed:", payload.data.bot_id);
  } else if (payload.event === "bot.failed") {
    // TypeScript knows this is CallbackFailed
    console.log("Callback - Bot failed:", payload.data.bot_id);
  }
}
```

## Migration Checklist

<Steps>
<Step>
### Update Dependencies to SDK v6

```bash
npm install @meeting-baas/sdk@^6.0.0
```

</Step>

<Step>
### Test Existing Code

All existing v1 code should continue to work without changes. Test your application to ensure everything works as expected.

</Step>

<Step>
### Migrate to v2 (Optional)

If you want to use v2 API:

1. **Update client creation** to include `api_version: "v2"`
2. **Update method calls** to use v2 method names (e.g., `createBot` instead of `joinMeeting`)
3. **Update error handling** to use v2 error format (`code`, `statusCode`, `details`)
4. **Handle batch responses** if using batch operations (check `errors` array)

</Step>

<Step>
### Update Type Imports (if needed)

If you're importing types, they're now organized by version:

```typescript
// v1 types (from generated/v1/schema)
import type { JoinRequest, JoinResponse } from "@meeting-baas/sdk";

// v2 types (from generated/v2/schema)
import type { CreateBotRequest, CreateBotResponse } from "@meeting-baas/sdk";
```

</Step>
</Steps>

## Common Issues

### TypeScript Shows Wrong Methods

**Problem:** TypeScript shows v1 methods when you want v2, or vice versa.

**Solution:** Ensure `api_version` is correctly set in the client configuration:

```typescript
// Correct - must be explicitly set for v2
const client = createBaasClient({
  api_key: "key",
  api_version: "v2"
});
```

### Error Handling Differences

**Problem:** v2 error format is different from v1.

**Solution:** Update error handling to use v2 error fields:

```typescript
// v1 error handling
if (!result.success) {
  console.error(result.error); // ZodError | Error
}

// v2 error handling
if (!result.success) {
  console.error(result.error); // string
  console.error(result.code); // string
  console.error(result.statusCode); // number
  console.error(result.details); // unknown | null
}
```

### Batch Route Errors

**Problem:** Batch routes return `success: true` even when some items fail.

**Solution:** Check the `errors` array for partial failures:

```typescript
const result = await client.batchCreateBots({ bots: [...] });

if (result.success) {
  if (result.errors.length > 0) {
    // Some items failed
    console.log("Partial success:", result.data);
    console.log("Errors:", result.errors);
  } else {
    // All items succeeded
    console.log("All succeeded:", result.data);
  }
}
```

## Getting Help

If you encounter issues during migration:

1. Check this migration guide
2. Review the [API Reference](/docs/typescript-sdk/complete-reference) for current usage examples
3. Open an issue on [GitHub](https://github.com/Meeting-Baas/sdk-generator/issues)
4. Join our [Discord community](https://discord.com/invite/dsvFgDTr6c) for support



---

## Quick Start

Quick guide for integrating with Meeting BaaS services.

### Source: ./content/docs/typescript-sdk/quick-start.mdx


<Callout type="info">
  This guide uses v2 API, the recommended version for new projects. Get your API key at [dashboard.meetingbaas.com](https://dashboard.meetingbaas.com/onboarding).
</Callout>

```typescript
import { createBaasClient } from '@meeting-baas/sdk';

// Create a v2 BaaS client
const client = createBaasClient({
  api_key: 'your-api-key', // Get yours at https://dashboard.meetingbaas.com
  api_version: 'v2'
});

// Create a bot to join a meeting
const { success, data, error } = await client.createBot({
  bot_name: 'Meeting Assistant',
  meeting_url: 'https://meet.google.com/abc-def-ghi',
});

if (success) {
  console.log('Bot created successfully:', data.bot_id);
  
  // Get bot details
  const botDetails = await client.getBotDetails({
    bot_id: data.bot_id
  });
  
  if (botDetails.success) {
    console.log('Bot details:', botDetails.data);
  }
} else {
  console.error('Error creating bot:', error);
}
```

## Usage Examples

### Basic Usage

```typescript
import { createBaasClient } from '@meeting-baas/sdk';

// Create a v2 BaaS client
const client = createBaasClient({
  api_key: 'your-api-key',
  api_version: 'v2'
});

// Create a bot
const createResult = await client.createBot({
  bot_name: 'My Assistant',
  meeting_url: 'https://meet.google.com/abc-def-ghi',
});

if (createResult.success) {
  console.log('Bot created successfully:', createResult.data.bot_id);
  
  // Get bot details
  const botDetails = await client.getBotDetails({
    bot_id: createResult.data.bot_id
  });
  
  if (botDetails.success) {
    console.log('Bot details:', botDetails.data);
  } else {
    console.error('Error getting bot details:', botDetails.error);
  }
  
  // Delete bot data
  const deleteResult = await client.deleteBotData({
    bot_id: createResult.data.bot_id
  });
  
  if (deleteResult.success) {
    console.log('Bot data deleted successfully');
  }
} else {
  console.error('Error creating bot:', createResult.error);
}
```

### Calendar Integration

```typescript
import { createBaasClient } from '@meeting-baas/sdk';

const client = createBaasClient({
  api_key: 'your-api-key',
  api_version: 'v2'
});

// Create a calendar connection
const calendarResult = await client.createCalendarConnection({
  calendar_platform: 'google',
  oauth_client_id: 'your-oauth-client-id',
  oauth_client_secret: 'your-oauth-client-secret',
  oauth_refresh_token: 'your-oauth-refresh-token',
  raw_calendar_id: 'primary'
});

if (calendarResult.success) {
  console.log('Calendar connected:', calendarResult.data);

  // List all calendars
  const calendarsResult = await client.listCalendars();
  if (calendarsResult.success) {
    console.log('All calendars:', calendarsResult.data);
  }

  // List events from a calendar
  const eventsResult = await client.listEvents({
    calendar_id: calendarResult.data.calendar_id
  });
  
  if (eventsResult.success) {
    console.log('Events:', eventsResult.data);
  }
} else {
  console.error('Error connecting calendar:', calendarResult.error);
}
```

### Advanced Usage with Error Handling

```typescript
import { createBaasClient } from '@meeting-baas/sdk';

const client = createBaasClient({
  api_key: 'your-api-key',
  api_version: 'v2',
  timeout: 60000
});

async function comprehensiveExample() {
  // Create a bot with all options
  const createResult = await client.createBot({
    meeting_url: 'https://meet.google.com/abc-defg-hij',
    bot_name: 'Advanced Test Bot',
    bot_image: 'https://example.com/bot-image.jpg',
    entry_message: 'Hello from the advanced test bot!',
    recording_mode: 'speaker_view',
    transcription_config: { 
      provider: 'gladia' 
    },
    extra: { test_id: 'advanced-example' }
  });

  if (createResult.success) {
    const botId = createResult.data.bot_id;
    console.log('Bot created with ID:', botId);

    // Get bot status
    const statusResult = await client.getBotStatus({
      bot_id: botId
    });

    if (statusResult.success) {
      console.log('Bot status:', statusResult.data.status);
    }

    // Get bot details
    const detailsResult = await client.getBotDetails({
      bot_id: botId
    });

    if (detailsResult.success) {
      console.log('Bot details:', detailsResult.data);
    }

    // Leave the meeting
    const leaveResult = await client.leaveBot({
      bot_id: botId
    });

    if (leaveResult.success) {
      console.log('Bot left meeting successfully');
    }

    // Delete bot data
    const deleteResult = await client.deleteBotData({
      bot_id: botId
    });

    if (deleteResult.success) {
      console.log('Bot data deleted successfully');
    }
  } else {
    console.error('Error creating bot:', createResult.error);
    console.error('Error code:', createResult.code);
  }
}
```


---

