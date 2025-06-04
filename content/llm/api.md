# MeetingBaas API, the main purpose of the documentation

API documentation for interacting with Meeting BaaS services.

## Community & Support

Join our Discord Community, or ping us on our socials.

### Source: ./content/docs/api/community-and-support.mdx


## Community:

- [Join our Discord](https://discord.com/invite/dsvFgDTr6c)
- [Star us on Github](https://github.com/Meeting-Baas/Meeting-Bot-As-A-Service)

## Contact & Support

Planning to use more than 100 hours a month?  
Expect a response within the day.

- Twitter
- <ContactLink />
- Slack and Teams channels for customers and partners.


---

## Events

Work with calendar events and schedule recordings

### Source: ./content/docs/api/getting-started/calendars/events.mdx


After [setting up your calendar integration](/docs/api/getting-started/calendars/setup), you can work with calendar events and schedule recordings. This guide explains how to manage calendar events through the Meeting BaaS API.

## Event Management

<Steps>

<Step>
### Listing and Retrieving Events

Monitor and manage calendar events:

- List Events: <a href="/docs/api/reference/calendars/list_events" target="_blank">List Events</a> - See all upcoming meetings
- Get Event Details: <a href="/docs/api/reference/calendars/get_event" target="_blank">Get Event Details</a> - View meeting info and bot status

#### List Events Example

```bash
curl -X GET "https://api.meetingbaas.com/calendars/cal_12345abcde/events" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date_gte": "2023-09-01T00:00:00Z",
    "start_date_lte": "2023-09-08T23:59:59Z",
    "updated_at_gte": "2023-08-29T18:30:00Z"  // Optional, for webhook integration
  }'
```

<Callout type="info">
  The List Events endpoint supports various filtering options:

- `calendar_id` (required) - Which calendar's events to retrieve

- `start_date_gte` - Filter events starting on or after this timestamp

- `start_date_lte` - Filter events starting on or before this timestamp

- `updated_at_gte` - Filter events updated on or after this timestamp

- `status` - Filter by meeting status ("upcoming", "past", "all") - default is "upcoming"

- `attendee_email` - Filter events with a specific attendee

- `organizer_email` - Filter events with a specific organizer

- `cursor` - For pagination through large result sets

See the <a href="/docs/api/reference/calendars/list_events" target="_blank">List Events API Reference</a> for full details.

</Callout>

#### Get Event Details Example

```bash
curl -X GET "https://api.meetingbaas.com/calendars/cal_12345abcde/events/evt_67890fghij" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

</Step>

<Step>
### Understanding Meeting Links

Meeting BaaS automatically detects meeting links within calendar events and can deploy bots based on your configuration.

<Callout type="info">
  Meeting links are detected from the event location, description, or custom
  properties depending on the calendar provider, habits or integrations of the
  user.
</Callout>

Each platform has its own link format that our system automatically recognizes.

</Step>

<Step>
### Recording Management

You can schedule or cancel recording events for specific calendar events:

- Schedule Recording: <a href="/docs/api/reference/calendars/schedule_record_event" target="_blank">Schedule Record Event</a> - Configure a bot to record a specific event
- Cancel Recording: <a href="/docs/api/reference/calendars/unschedule_record_event" target="_blank">Unschedule Record Event</a> - Cancel a scheduled recording

#### Schedule Recording Example

```bash
curl -X POST "https://api.meetingbaas.com/calendars/cal_12345abcde/events/evt_67890fghij/record" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recording_mode": "speaker_view",
    "include_transcription": true,
    "bot_name": "Recording Bot",
    "bot_avatar_url": "https://example.com/avatar.png",
    "entry_message": "This meeting is being recorded for note-taking purposes."
  }'
```

<Callout type="warn">
  When scheduling a recording, the bot will automatically join the meeting at
  the scheduled time and begin recording based on your configuration.
</Callout>

</Step>

<Step>
### Recording Options

The recording configuration supports the same options as manual bot deployment:

#### Visual Recording Options:

- `speaker_view` - Records the active speaker (default)
- `gallery_view` - Records all participants in a grid layout
- `audio_only` - Records only the audio from the meeting

#### Additional Features:

- `include_transcription: true|false` - Generate speech-to-text transcription
- `bot_name: "string"` - Custom name for the bot in the meeting
- `bot_avatar_url: "url"` - Custom profile picture for the bot
- `entry_message: "string"` - Message the bot will send upon joining

#### Canceling a Scheduled Recording

To cancel a scheduled recording:

```bash
curl -X DELETE "https://api.meetingbaas.com/calendars/cal_12345abcde/events/evt_67890fghij/record" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

<Callout type="info">
  Remember to handle webhook notifications to track the recording status and
  receive the final recording data. These updates can be used to determine
  whether to record new or updated meetings.
</Callout>

</Step>

</Steps>

## Next Steps

Now that you understand how to work with calendar events:

- Learn about [webhooks for calendar updates](/docs/api/getting-started/calendars/webhooks)
- Explore [custom meeting bot configurations](/docs/api/getting-started/sending-a-bot)
- Check out our [Live Meeting Updates](/docs/api/getting-started/getting-the-data) system


---

## Calendar Synchronization

Implement your own business logic fast and reliably

### Source: ./content/docs/api/getting-started/calendars/index.mdx


Meeting BaaS allows you to automatically sync calendars from Outlook and Google Workspace to deploy bots to scheduled meetings.

This helps you:

- **Automate recording and participation** in meetings without manual intervention

- **Implement your own business logic** with simple patching:
  - Apply business rules to new calendar events, and an initial patch for existing events registered by a given user
  - Update logic as your requirements change

<div className="grid grid-cols-1 gap-4 mt-0 md:grid-cols-2 lg:grid-cols-3">
  <Card title="1. Calendar Sync Setup" href="/docs/api/getting-started/calendars/setup" icon={<ChevronRight className="w-4 h-4" />}>
    Learn how to authenticate and set up calendar integrations with Google Workspace and Microsoft Outlook
  </Card>

<Card
  title="2. Managing Calendar Events"
  href="/docs/api/getting-started/calendars/events"
  icon={<ChevronRight className="h-4 w-4" />}
>
  Work with calendar events and schedule automated recordings for meetings
</Card>

  <Card title="3. Webhooks & Maintenance" href="/docs/api/getting-started/calendars/webhooks" icon={<ChevronRight className="w-4 h-4" />}>
    Receive real-time updates, handle errors, and maintain your calendar integrations
  </Card>
</div>

## Key Benefits

- **Automated Bot Deployment**: Automatically send bots to meetings as they appear on calendars
- **Multi-Calendar Support**: Connect to both Google Workspace and Microsoft Outlook calendars
- **Real-Time Updates**: Receive webhook notifications when calendar events change
- **Selective Recording**: Apply business logic to determine which meetings to record

## Implementation Overview

1. First, [set up calendar integrations](/docs/api/getting-started/calendars/setup) using OAuth authentication
2. Then, [work with calendar events](/docs/api/getting-started/calendars/events) to schedule automated recordings
3. Finally, [implement webhooks](/docs/api/getting-started/calendars/webhooks) to receive real-time updates and handle maintenance

## Customizable Business Logic

One of the core strengths of our calendar synchronization API is how easily you can integrate your own business logic. The abstraction layer we provide gives you:

- **Flexible Decision Making**: Decide which meetings should be recorded based on any criteria you define (participants, meeting titles, domains, etc.)
- **Custom Automation Rules**: Automatically apply different recording configurations based on meeting types
- **Error Handling Control**: Implement your own retry logic and error handling strategies tailored to your application's needs
- **Integration with Your Systems**: Build your own connections to your workflows or other business systems

#### For example, you might implement rules to only record meetings:

- With external clients but not internal team meetings
- That contain specific keywords in the title or description
- Where the organizer has opted into recording
- During specific business hours or for particular teams
- With specific participant emails

The webhook-based architecture ensures your business logic operates in real-time as calendar changes occur, giving you complete control over your meeting automation.


---

## Maintenance

Maintain your calendar integrations, handle errors, and clean up calendar accounts

### Source: ./content/docs/api/getting-started/calendars/maintenance.mdx


## Error Handling and Troubleshooting

### Common Errors

#### OAuth Token Expiration

Both your app's credentials (service level) and user's credentials (user level) can expire or be revoked. If this happens _Calendar sync operations will start failing_.

##### Detecting and fixing the issue

1. You can detect this by periodically checking the calendar status using the [Get Calendar](/docs/api/reference/calendars/get_calendar) endpoint
2. You should implement a monitoring strategy using this route to detect these failures and prompt users to reconnect their calendars

When this occurs, you need to, depending on whether it is your app's credentials or the user's credentials that are expired, you have 2 choices:

<Steps>

<Step>
User's credentials are expired

Prompt the user to reauthorize calendar access by:

1. Updating your database to mark the calendar integration as requiring reauthorization
2. Prompting the user to reconnect their calendar when they next access your application

</Step>

<Step>
Your app's credentials are expired

Reauthorize your app's credentials by:

1. Requiring new app credentials as shown in the [Setup](/docs/api/getting-started/calendars/setup) guide and storing them in your database
2. Patching the calendar integration with the new credentials using the [Update Calendar](/docs/api/reference/calendars/update_calendar) endpoint to update your app credentials while keeping the same user credentials

</Step>

</Steps>

### Rate Limiting Considerations

Calendar APIs enforce rate limits. Meeting BaaS handles these gracefully, but if you encounter persistent sync issues, check:

1. The frequency of your calendar operations
2. The number of events being synced
3. Other applications using the same OAuth credentials

<Callout type="info">
  For Google Workspace, you're limited to 1 million queries per day per project.
  For Microsoft, limits vary by subscription type.
</Callout>

If you're building a high-volume application, consider implementing these best practices:

- Batch calendar operations where possible
- Implement exponential backoff for retries
- Monitor your API usage with logging and alerts
- Consider using multiple projects for very high-volume needs

## Maintenance and Cleanup

<Steps>

<Step>
### Removing Calendar Integrations

To remove a calendar integration, use the <a href="/docs/api/reference/calendars/delete_calendar" target="_blank">Delete Calendar</a> endpoint.

```bash
curl -X DELETE "https://api.meetingbaas.com/calendars/cal_12345abcde" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

This will:

1. Stop syncing the calendar
2. Cancel any scheduled recordings for events from this calendar
3. Remove the calendar integration from your account

<Callout type="info">
  This operation does not revoke OAuth access. However MeetingBaaS will have completely deleted the calendar integration from your account and its records.

To completely remove access, users should also revoke access via Google or Microsoft security settings.
users should also revoke access via Google or Microsoft security settings.

</Callout>
</Step>

</Steps>

## Next Steps

Now that you've mastered calendar synchronization:

- Learn about [custom meeting bot configurations](/docs/api/getting-started/sending-a-bot)
- Explore our [Live Meeting Updates](/docs/api/getting-started/getting-the-data) for real-time meeting data
- Check out our [Community & Support](/docs/api/community-and-support) resources


---

## Setup

### Source: ./content/docs/api/getting-started/calendars/setup.mdx


Meeting BaaS allows you to automatically sync calendars from Outlook and Google Workspace to deploy bots to scheduled meetings.

## Prerequisites

Before starting the calendar sync integration, ensure you have:

- An active Meeting BaaS account with API access
- A webhook endpoint configured in your Meeting BaaS account to receive calendar event notifications
- Developer access to Google Cloud Console and/or Microsoft Entra ID

<Steps>

<Step>

### Authentication: Get your OAuth credentials

To start syncing calendars, you'll need two sets of credentials:

1. **Your App's Credentials (Service Level)**

- For Outlook: Your app's Microsoft Client ID and Client Secret
- For Google Workspace: Your app's Google Client ID and Client Secret

2. **End User's Credentials (User Level)**

- OAuth refresh token obtained when user grants calendar access to your app

<Callout type="info">
  Best Practice: Request calendar access as a separate step after initial user
  signup. Users are more likely to grant calendar access when it's clearly tied
  to a specific feature they want to use.
</Callout>

#### Required OAuth Scopes

For **Google Workspace**:

- `https://www.googleapis.com/auth/calendar.readonly` - To read calendar and event data
- `https://www.googleapis.com/auth/calendar.events.readonly` - To access event details

For **Microsoft Outlook**:

- `Calendars.Read` - To read calendar and event data
- `Calendars.ReadWrite` - Required if you need to modify calendar events

</Step>

<Step>

### Optional: List Raw Calendars

Before syncing calendars, you can use the <a href="/docs/api/reference/calendars/list_raw_calendars" target="_blank">List Raw Calendars</a> endpoint to view all your user's available calendars. This is particularly useful when a user has multiple calendars and you need to choose which ones to sync.

#### Request Example

```bash
curl -X GET "https://api.meetingbaas.com/calendars/raw" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "refresh_token": "USER_REFRESH_TOKEN",
    "client_id": "YOUR_GOOGLE_CLIENT_ID",
    "client_secret": "YOUR_GOOGLE_CLIENT_SECRET"
  }'
```

#### Response Example

```json
{
  "calendars": [
    {
      "id": "primary",
      "name": "Main Calendar",
      "description": "User's primary calendar",
      "is_primary": true
    },
    {
      "id": "team_calendar@group.calendar.google.com",
      "name": "Team Calendar",
      "description": "Shared team meetings",
      "is_primary": false
    }
  ]
}
```

<Callout type="info">
  Calendar IDs differ between providers. Google uses email-like IDs, while
  Microsoft uses GUID formats.
</Callout>

</Step>

<Step>
### Create a Calendar Integration

Create a new calendar integration by calling the <a href="/docs/api/reference/calendars/create_calendar" target="_blank">Create Calendar</a> endpoint with the previously obtained credentials.

#### Request Example

```bash
curl -X POST "https://api.meetingbaas.com/calendars" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "refresh_token": "USER_REFRESH_TOKEN",
    "client_id": "YOUR_GOOGLE_CLIENT_ID",
    "client_secret": "YOUR_GOOGLE_CLIENT_SECRET",
    "raw_calendar_id": "team_calendar@group.calendar.google.com"  // Optional
  }'
```

If the `raw_calendar_id` parameter is not provided, Meeting BaaS will sync the user's primary calendar by default.

#### Response Example

```json
{
  "id": "cal_12345abcde",
  "provider": "google",
  "status": "syncing",
  "created_at": "2023-08-15T14:30:00Z",
  "raw_calendar_id": "team_calendar@group.calendar.google.com",
  "calendar_name": "Team Calendar"
}
```

<Callout type="warn">
  Store the returned calendar ID safely - you'll need it for future operations.
</Callout>

</Step>

<Step>
### Managing Calendars

Once authenticated, you can manage your calendars as described in the [Managing Calendar Events](/docs/api/getting-started/calendars/events) guide.

<Callout type="info">
  After initial setup, Meeting BaaS handles all calendar API interactions. You
  only need to respond to webhook events for calendar changes, which are covered
  in the [webhooks guide](/docs/api/getting-started/calendars/webhooks).
</Callout>

Calendar integrations can have the following status values:

- `syncing` - Initial sync in progress
- `active` - Calendar is actively syncing
- `error` - Sync encountered an error (check the `error_message` field)
- `disconnected` - The calendar connection has been terminated

</Step>

</Steps>

## Next Steps

Now that you've set up your calendar integration:

- Learn how to [manage calendar events and recordings](/docs/api/getting-started/calendars/events)
- Set up [webhooks for calendar updates](/docs/api/getting-started/calendars/webhooks)
- Explore our [main API documentation](/docs/api) for other features


---

## Webhooks

Receive real-time updates, handle errors, and maintain your calendar integrations

### Source: ./content/docs/api/getting-started/calendars/webhooks.mdx


## Webhook Integration

<Steps>

<Step>
### Understanding Calendar Webhooks

In addition to live meeting events via the <a href="/docs/api/getting-started/getting-the-data" target="_blank">Live Meeting Updates</a>, your Meeting BaaS webhook endpoint defined in your account will receive calendar sync events with the type `calendar.sync_events`. These events notify you about:

- New meeting schedules
- Meeting changes or cancellations
- Calendar sync status updates

When a calendar change is detected, a webhook is sent to your registered endpoint. This allows you to take real-time actions, such as scheduling a recording for new meetings or updating your database.

</Step>

<Step>
### Webhook Payload Structure

#### Example Webhook Payload

```json
{
  "event": "calendar.sync_events",
  "data": {
    "calendar_id": "cal_12345abcde",
    "last_updated_ts": "2023-09-01T15:30:45Z",
    "affected_event_uuids": [
      "evt_67890fghij",
      "evt_12345abcde",
      "evt_98765zyxwv"
    ]
  }
}
```

The payload includes:

- `event`: The type of webhook event (e.g., `calendar.sync_events`)
- `data`: Contains the details about what changed:
  - `calendar_id`: The ID of the calendar that had changes
  - `last_updated_ts`: When the changes occurred (UTC timestamp)
  - `affected_event_uuids`: Array of event IDs that were added, updated, or deleted

<Callout type="info">
  All webhook timestamps are in UTC format. Always process timestamps
  accordingly in your application.
</Callout>

</Step>

<Step>
### Processing Webhook Updates

There are two approaches to processing calendar updates:

#### 1. Using the last_updated_ts timestamp

This approach gets all events updated after a certain timestamp:

```javascript
app.post('/webhooks/meeting-baas', async (req, res) => {
  const event = req.body;

  // Acknowledge receipt immediately with 200 OK
  res.status(200).send('Webhook received');

  // Process the event asynchronously
  if (event.event === 'calendar.sync_events') {
    try {
      // Fetch updated events
      const updatedEvents = await fetchUpdatedEvents(
        event.data.calendar_id,
        event.data.last_updated_ts,
      );

      // Process each event based on your business logic
      for (const evt of updatedEvents) {
        if (shouldRecordMeeting(evt)) {
          await scheduleRecording(event.data.calendar_id, evt.id);
        } else if (wasRecordingScheduled(evt) && shouldCancelRecording(evt)) {
          await cancelRecording(event.data.calendar_id, evt.id);
        }
      }
    } catch (error) {
      // Log error and implement retry mechanism
      console.error('Failed to process calendar sync event', error);
      // Add to retry queue
    }
  }
});
```

#### 2. More efficient approach using affected_event_uuids

This approach only processes the specific events that changed:

```javascript
app.post('/webhooks/meeting-baas', async (req, res) => {
  const event = req.body;

  // Acknowledge receipt immediately with 200 OK
  res.status(200).send('Webhook received');

  // Process the event asynchronously
  if (
    event.event === 'calendar.sync_events' &&
    event.data.affected_event_uuids &&
    event.data.affected_event_uuids.length > 0
  ) {
    try {
      // Process only the specific affected events
      for (const eventUuid of event.data.affected_event_uuids) {
        const eventDetails = await fetchEventDetails(
          event.data.calendar_id,
          eventUuid,
        );

        // Apply your business logic
        if (shouldRecordMeeting(eventDetails)) {
          await scheduleRecording(event.data.calendar_id, eventUuid);
        } else if (
          wasRecordingScheduled(eventDetails) &&
          shouldCancelRecording(eventDetails)
        ) {
          await cancelRecording(event.data.calendar_id, eventUuid);
        }
      }
    } catch (error) {
      // Log error and implement retry mechanism
      console.error('Failed to process calendar sync event', error);
      // Add to retry queue
    }
  }
});
```

<Callout type="info">
  This allows you to:

- Track all calendar changes in real-time

- Decide whether to record new or modified meetings

- Keep your system synchronized with the latest meeting data

</Callout>

<Callout type="warn">
  Always return a 200 OK response promptly to acknowledge receipt of the webhook
  before processing the data. This prevents webhook retry mechanisms from
  sending duplicate events.
</Callout>

</Step>

<Step>
### Webhook Best Practices

#### Idempotent Processing

Implement idempotent webhook processing - you may receive the same webhook multiple times in rare circumstances:

```javascript
// Example of idempotent processing using a processed events cache
const processedEvents = new Set();

app.post('/webhooks/meeting-baas', async (req, res) => {
  const event = req.body;
  const eventId = `${event.event}-${event.data.calendar_id}-${event.data.last_updated_ts}`;

  // Always acknowledge receipt immediately
  res.status(200).send('Webhook received');

  // Skip if we've already processed this exact event
  if (processedEvents.has(eventId)) {
    console.log(`Skipping already processed event: ${eventId}`);
    return;
  }

  // Add to processed events before processing
  processedEvents.add(eventId);

  // Process the event...
  // ...

  // In a production environment, you would use a persistent store
  // like Redis or a database instead of an in-memory Set
});
```

#### Retry Logic

Configure your webhook endpoint to process these real-time updates and implement appropriate retry logic for reliability:

```javascript
async function processWithRetry(fn, maxRetries = 3, delay = 1000) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;

      if (retries >= maxRetries) {
        throw error;
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, retries - 1)),
      );
    }
  }
}

// Example usage
app.post('/webhooks/meeting-baas', async (req, res) => {
  // Always acknowledge receipt immediately
  res.status(200).send('Webhook received');

  // Process with retry logic
  try {
    await processWithRetry(async () => {
      // Your processing logic here
    });
  } catch (error) {
    console.error('Failed after multiple retries', error);
    // Log to monitoring system, add to dead letter queue, etc.
  }
});
```

</Step>

</Steps>

## Next Steps

Now that you understand webhooks and error handling:

- Learn how to [maintain and clean up your calendar integrations](/docs/api/getting-started/calendars/maintenance)


---

## Getting the Data

Learn how to receive meeting data through webhooks

### Source: ./content/docs/api/getting-started/getting-the-data.mdx


# Getting Meeting Data

Your webhook URL will receive two types of data:

1. Live meeting events during the meeting
2. Final meeting data after completion

These events will start flowing in after [sending a bot to a meeting](/docs/api/getting-started/sending-a-bot).

## 1. Live Meeting Events

```http
POST /your-endpoint
x-meeting-baas-api-key: YOUR-API-KEY

{
  "event": "bot.status_change",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": {
      "code": "joining_call",
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### Status Event Fields

- `event`: The key-value pair for bot status events. Always `bot.status_change`.
- `data.bot_id`: The identifier of the bot.
- `data.status.code`: The code of the event. One of:
  - `joining_call`: The bot has acknowledged the request to join the call.
  - `in_waiting_room`: The bot is in the "waiting room" of the meeting.
  - `in_call_not_recording`: The bot has joined the meeting, however it is not recording yet.
  - `in_call_recording`: The bot is in the meeting and recording the audio and video.
  - `recording_paused`: The recording has been temporarily paused.
  - `recording_resumed`: The recording has resumed after being paused.
  - `call_ended`: The bot has left the call.
  - `bot_rejected`: The bot was rejected from joining the meeting.
  - `bot_removed`: The bot was removed from the meeting.
  - `waiting_room_timeout`: The bot timed out while waiting to be admitted.
  - `invalid_meeting_url`: The provided meeting URL was invalid.
  - `meeting_error`: An unexpected error occurred during the meeting.
- `data.status.created_at`: An ISO string of the datetime of the event.

When receiving an `in_call_recording` event, additional data is provided:

- `data.status.start_time`: The timestamp when the recording started.

For `meeting_error` events, additional error details are provided:

- `data.status.error_message`: A description of the error that occurred.
- `data.status.error_type`: The type of error encountered.

## 2. Final Meeting Data

You'll receive either a `complete` or `failed` event.

### Success Response (`complete`)

```http
POST /your-endpoint
x-meeting-baas-api-key: YOUR-API-KEY

{
  "event": "complete",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "mp4": "https://bots-videos.s3.eu-west-3.amazonaws.com/path/to/video.mp4?X-Amz-Signature=...",
    "speakers": ["Alice", "Bob"],
    "transcript": [{
      "speaker": "Alice",
      "words": [{
        "start": 1.3348110430839002,
        "end": 1.4549110430839003,
        "word": "Hi"
      }, {
        "start": 1.4549110430839003,
        "end": 1.5750110430839004,
        "word": "Bob!"
      }]
    }, {
      "speaker": "Bob",
      "words": [{
        "start": 2.6583010430839,
        "end": 2.778401043083901,
        "word": "Hello"
      }, {
        "start": 2.778401043083901,
        "end": 2.9185110430839005,
        "word": "Alice!"
      }]
    }]
  }
}
```

<Callout type="warn" icon={<AlertTriangle className="h-5 w-5" />}>
  **IMPORTANT**: The mp4 URL is a pre-signed AWS S3 URL that is only valid for 2
  hours. Make sure to download the recording promptly or generate a new URL
  through the API if needed.
</Callout>

#### Complete Response Fields

- `bot_id`: The identifier of the bot.
- `mp4`: A private AWS S3 URL of the mp4 recording of the meeting. Valid for two hours only.
- `speakers`: The list of speakers in this meeting. Currently requires transcription to be enabled.
- `transcript` (optional): The meeting transcript. Only given when `speech_to_text` is set when asking for a bot. An array containing:
  - `transcript.speaker`: The speaker name.
  - `transcript.words`: The list of words, each containing:
    - `transcript.words.start`: The start time of the word
    - `transcript.words.end`: The end time of the word
    - `transcript.words.word`: The word itself

### Failure Response (`failed`)

```http
POST /your-endpoint
x-meeting-baas-api-key: YOUR-API-KEY

{
  "event": "failed",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "error": "CannotJoinMeeting"
  }
}
```

### Error Types

| Error                 | Description                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CannotJoinMeeting     | The bot could not join the meeting URL provided. In most cases, this is because the meeting URL was only accessible for logged-in users invited to the meeting.                                                |
| TimeoutWaitingToStart | The bot has quit after waiting to be accepted. By default this is 10 minutes, configurable via `automatic_leave.waiting_room_timeout` or `automatic_leave.noone_joined_timeout` (both default to 600 seconds). |
| BotNotAccepted        | The bot has been refused in the meeting.                                                                                                                                                                       |
| BotRemoved            | The bot was removed from the meeting by a participant.                                                                                                                                                         |
| InternalError         | An unexpected error occurred. Please contact us if the issue persists.                                                                                                                                         |
| InvalidMeetingUrl     | The meeting URL provided is not a valid (Zoom, Meet, Teams) URL.                                                                                                                                               |

### Recording End Reasons

| Reason            | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| bot_removed       | Bot removed by participant                                      |
| no_attendees      | No participants present                                         |
| no_speaker        | Extended silence                                                |
| recording_timeout | Maximum duration reached                                        |
| api_request       | Bot [removed via API](/docs/api/getting-started/removing-a-bot) |
| meeting_error     | An error occurred during the meeting (e.g., connection issues)  |


---

## Removing a Bot

Learn how to remove a bot from an ongoing meeting using the API

### Source: ./content/docs/api/getting-started/removing-a-bot.mdx


# Removing a Bot

## Overview

When you need to end a bot's participation in a meeting, you can use the API to remove it immediately. This is useful for:

- Ending recordings early
- Freeing up bot resources
- Responding to meeting conclusion

## API Request

Send a DELETE request to `https://api.meetingbaas.com/bots/{YOUR_BOT_ID}`:

<Tabs items={['Bash', 'Python', 'JavaScript']}>
  <Tab value="Bash">
    ```bash title="leave_meeting.sh"
    curl -X DELETE "https://api.meetingbaas.com/bots/YOUR_BOT_ID" \
         -H "Content-Type: application/json" \
         -H "x-meeting-baas-api-key: YOUR-API-KEY"
    ```
  </Tab>
  <Tab value="Python">
    ```python title="leave_meeting.py"
    import requests

    bot_id = "YOUR_BOT_ID"
    url = f"https://api.meetingbaas.com/bots/{bot_id}"
    headers = {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": "YOUR-API-KEY",
    }

    response = requests.delete(url, headers=headers)
    if response.status_code == 200:
        print("Bot successfully removed from the meeting.")
    else:
        print("Failed to remove the bot:", response.json())
    ```

  </Tab>
  <Tab value="JavaScript">
    ```javascript title="leave_meeting.js"
    const botId = "YOUR_BOT_ID";
    fetch(`https://api.meetingbaas.com/bots/${botId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": "YOUR-API-KEY",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Bot successfully removed from the meeting.");
        } else {
          console.error("Failed to remove the bot:", response.statusText);
        }
      })
      .catch((error) => console.error("Error:", error));
    ```
  </Tab>
</Tabs>

## Required Parameters

- **Path Parameter**: `bot_id` - The unique identifier received when [sending the bot](/docs/api/getting-started/sending-a-bot)
- **Header**: `x-meeting-baas-api-key` - Your API key for authentication

Both parameters are mandatory for the request to succeed.

## Response

The API will respond with a simple confirmation:

```http
HTTP/2 200
Content-Type: application/json

{ "ok": true }
```

## What Happens Next

When a bot is removed:

1. The bot leaves the meeting immediately
2. A `call_ended` status event is sent to your webhook
3. The final meeting data up to that point is delivered

For more details about these webhook events, see [Getting the Data](/docs/api/getting-started/getting-the-data).


---

## Sending a bot

Learn how to send AI bots to meetings through the Meeting BaaS API, with options for immediate or scheduled joining and customizable settings

### Source: ./content/docs/api/getting-started/sending-a-bot.mdx


# Sending a Bot to a Meeting

You can summon a bot in two ways:

1. **Immediately to a meeting**, provided your bot pool is sufficient.
2. **Reserved join in 4 minutes**, ideal for scheduled meetings.

## API Request

Send a POST request to [https://api.meetingbaas.com/bots](https://api.meetingbaas.com/bots):

<Tabs items={['Bash', 'Python', 'JavaScript']}>
  <Tab value="Bash">
    ```bash title="join_meeting.sh"
    curl -X POST "https://api.meetingbaas.com/bots" \
         -H "Content-Type: application/json" \
         -H "x-meeting-baas-api-key: YOUR-API-KEY" \
         -d '{
               "meeting_url": "YOUR-MEETING-URL",
               "bot_name": "AI Notetaker",
               "recording_mode": "speaker_view",
               "bot_image": "https://example.com/bot.jpg",
               "entry_message": "I am a good meeting bot :)",
               "reserved": false,
               "speech_to_text": {
                 "provider": "Default"
               },
               "automatic_leave": {
                 "waiting_room_timeout": 600
               }
             }'
    ```
  </Tab>
  <Tab value="Python">
    ```python title="join_meeting.py"
    import requests
    url = "https://api.meetingbaas.com/bots"
    headers = {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": "YOUR-API-KEY",
    }
    config = {
        "meeting_url": "YOUR-MEETING-URL",
        "bot_name": "AI Notetaker",
        "recording_mode": "speaker_view",
        "bot_image": "https://example.com/bot.jpg",
        "entry_message": "I am a good meeting bot :)",
        "reserved": False,
        "speech_to_text": {
            "provider": "Default"
        },
        "automatic_leave": {
            "waiting_room_timeout": 600  # 10 minutes in seconds
        }
    }
    response = requests.post(url, json=config, headers=headers)
    print(response.json())
    ```
  </Tab>
  <Tab value="JavaScript">
    ```javascript title="join_meeting.js"
    fetch("https://api.meetingbaas.com/bots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": "YOUR-API-KEY",
      },
      body: JSON.stringify({
        meeting_url: "YOUR-MEETING-URL",
        bot_name: "AI Notetaker",
        reserved: false,
        recording_mode: "speaker_view",
        bot_image: "https://example.com/bot.jpg",
        entry_message: "I am a good meeting bot :)",
        speech_to_text: {
          provider: "Default",
        },
        automatic_leave: {
          waiting_room_timeout: 600,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data.bot_id))
      .catch((error) => console.error("Error:", error));
    ```
  </Tab>
</Tabs>

## Request Parameters

### Required Parameters

- `meeting_url`: The meeting URL to join. Accepts Google Meet, Microsoft Teams or Zoom URLs.
- `bot_name`: The display name of the bot.
- `reserved`: Controls how the bot joins the meeting
  - `false`: Sends a bot from our pool of _always ready_ meeting bots, immediately. Beware that **demand might temporarily be higher than the number of currently available bots**, which could imply a delay in the bot joining. When possible, prefer the true option which reserves an instance of an AI meeting bot.
  - `true`: Reserves in advance a meeting bot for an upcoming meeting, ensuring the presence of the bot at the start of the meeting, typically for planned calendar events. You need to **call this route exactly 4 minutes before the start of the meeting**.

### Recording Options

- `recording_mode`: Optional. One of:
  - `"speaker_view"`: (default) The recording will only show the person speaking at any time
  - `"gallery_view"`: The recording will show all the speakers
  - `"audio_only"`: The recording will be a mp3

### Bot Appearance and Behavior

- `bot_image`: The URL of the image the bot will display. Must be a valid URI format. Optional.
- `entry_message`: Optional. The message the bot will write within 15 seconds after being accepted in the meeting.

### Transcription Settings

- `speech_to_text`: Optional. If not provided, no transcription will be generated and processing time will be faster.
  - Must be an object with:
    - `provider`: One of:
      - `"Default"`: Standard transcription, no API key needed
      - `"Gladia"` or `"Runpod"`: Requires their respective API key to be provided
    - `api_key`: Required when using Gladia or Runpod providers. Must be a valid API key from the respective service.

### Automatic Leaving

- `automatic_leave`: Optional object containing:
  - `waiting_room_timeout`: Time in seconds the bot will wait in a meeting room before dropping. Default is 600 (10 minutes)
  - `noone_joined_timeout`: Time in seconds the bot will wait if no one joins the meeting

### Advanced Options

- `webhook_url`: URL for webhook notifications
- `deduplication_key`: String for deduplication. By default, Meeting BaaS will reject you sending multiple bots to a same meeting within 5 minutes, to avoid spamming.
- `streaming`: Object containing optional WebSocket streaming configuration:
  - `audio_frequency`: Audio frequency for the WebSocket streams. Can be "16khz" or "24khz" (defaults to "24khz")
  - `input`: WebSocket endpoint to receive raw audio bytes and speaker diarization as JSON strings from the meeting
  - `output`: WebSocket endpoint to stream raw audio bytes back into the meeting, enabling bot speech
- `extra`: Additional custom data
- `start_time`: Unix timestamp (in milliseconds) for when the bot should join the meeting. The bot joins 4 minutes before this timestamp. For example, if you want the bot to join at exactly 2:00 PM, set this to the millisecond timestamp of 2:00 PM.

## Response

The API will respond with the unique identifier for your bot:

```http
HTTP/2 200
Content-Type: application/json

{
  "bot_id": 42
}
```

## Next Steps

Use this `bot_id` to:

- [Monitor the bot's status and receive meeting data](/docs/api/getting-started/getting-the-data)
- [Remove the bot from the meeting](/docs/api/getting-started/removing-a-bot)


---

## Syncing Calendars

Learn how to sync calendars with the API, and automatically send meeting bots to the right place at the right time

### Source: ./content/docs/api/getting-started/syncing-calendars.mdx


# Calendar Synchronization

<Callout type="info">
  This page has been moved to a new location. You'll be automatically redirected
  to [Calendar Synchronization](/docs/api/getting-started/calendars).
</Callout>

<meta
  http-equiv="refresh"
  content="0;url=/docs/api/getting-started/calendars"
/>

<script>window.location.href = "/docs/api/getting-started/calendars";</script>

Meeting BaaS allows you to automatically sync calendars from Outlook and Google Workspace to deploy bots to scheduled meetings. This helps you automate recording and participation in meetings without manual intervention.

<div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
  <Card title="1. Calendar Sync Setup" href="/docs/api/getting-started/calendars/setup" icon={<ChevronRight className="w-4 h-4" />}>
    Learn how to authenticate and set up calendar integrations with Google Workspace and Microsoft Outlook
  </Card>

<Card
  title="2. Managing Calendar Events"
  href="/docs/api/getting-started/calendars/events"
  icon={<ChevronRight className="h-4 w-4" />}
>
  Work with calendar events and schedule automated recordings for meetings
</Card>

  <Card title="3. Webhooks & Maintenance" href="/docs/api/getting-started/calendars/webhooks" icon={<ChevronRight className="w-4 h-4" />}>
    Receive real-time updates, handle errors, and maintain your calendar integrations
  </Card>
</div>

## Key Benefits

- **Automated Bot Deployment**: Automatically send bots to meetings as they appear on calendars
- **Multi-Calendar Support**: Connect to both Google Workspace and Microsoft Outlook calendars
- **Real-Time Updates**: Receive webhook notifications when calendar events change
- **Selective Recording**: Apply business logic to determine which meetings to record

## Implementation Overview

1. First, [set up calendar integrations](/docs/api/getting-started/calendars/setup) using OAuth authentication
2. Then, [work with calendar events](/docs/api/getting-started/calendars/events) to schedule automated recordings
3. Finally, [implement webhooks](/docs/api/getting-started/calendars/webhooks) to receive real-time updates and handle maintenance

This modular approach allows you to implement each component at your own pace and focuses the documentation on specific aspects of the integration.


---

## Introduction

Get started with the Meeting BaaS API

### Source: ./content/docs/api/index.mdx


<Callout type="info">
  WWe provide optimized documentation for both LLMs and recent MCP server updates. For more on our LLM integration, 
  see [LLMs](/llms/api) and for MCP access, visit [auth.meetingbaas.com](https://auth.meetingbaas.com/home).
</Callout>

**Meeting BaaS** 🐟 provides _Meetings Bots As A Service_, with integrated transcription.

This allows you to:

1. **interact with**
2. **transcribe**
3. **AI summarize**

video-meetings through a single unified API. Using Meeting BaaS, you can deploy bots on Microsoft Teams, Google Meet, and Zoom in less than 1 minute.

Our meeting bots act as regular meeting participants with full audio and visual capabilities.

They can listen, speak, use chat, and appear with customizable names and profile pictures.

Just provide a meeting URL through a simple command, and meeting bots will connect to the meeting, give their name and ask to be let in.

Once inside, they record the meeting until it ends, and provide you with the data as they go.


---

## List Bots with Metadata

### Source: ./content/docs/api/reference/bots_with_metadata.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieves a paginated list of the user's bots with essential metadata, including IDs, names, and meeting details. Supports filtering, sorting, and advanced querying options.

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/bots_with_metadata","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Create Calendar

### Source: ./content/docs/api/reference/calendars/create_calendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Integrates a new calendar with the system using OAuth credentials. This endpoint establishes a connection with the calendar provider (Google, Microsoft), sets up webhook notifications for real-time updates, and performs an initial sync of all calendar events. It requires OAuth credentials (client ID, client secret, and refresh token) and the platform type. Once created, the calendar is assigned a unique UUID that should be used for all subsequent operations. Returns the newly created calendar object with all integration details.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendars/","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Delete Calendar

### Source: ./content/docs/api/reference/calendars/delete_calendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Permanently removes a calendar integration by its UUID, including all associated events and bot configurations. This operation cancels any active subscriptions with the calendar provider, stops all webhook notifications, and unschedules any pending recordings. All related resources are cleaned up in the database. This action cannot be undone, and subsequent requests to this calendar's UUID will return 404 Not Found errors.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendars/{uuid}","method":"delete"}]} webhooks={[]} hasHead={false} />

---

## Get Calendar

### Source: ./content/docs/api/reference/calendars/get_calendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieves detailed information about a specific calendar integration by its UUID. Returns comprehensive calendar data including the calendar name, email address, provider details (Google, Microsoft), sync status, and other metadata. This endpoint is useful for displaying calendar information to users or verifying the status of a calendar integration before performing operations on its events.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendars/{uuid}","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Get Event

### Source: ./content/docs/api/reference/calendars/get_event.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieves comprehensive details about a specific calendar event by its UUID. Returns complete event information including title, meeting link, start and end times, organizer status, recurrence information, and the full list of attendees with their names and email addresses. Also includes any associated bot parameters if recording is scheduled for this event. The raw calendar data from the provider is also included for advanced use cases.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendar_events/{uuid}","method":"get"}]} webhooks={[]} hasHead={false} />

---

## List Calendars

### Source: ./content/docs/api/reference/calendars/list_calendars.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieves all calendars that have been integrated with the system for the authenticated user. Returns a list of calendars with their names, email addresses, provider information, and sync status. This endpoint shows only calendars that have been formally connected through the create_calendar endpoint, not all available calendars from the provider.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendars/","method":"get"}]} webhooks={[]} hasHead={false} />

---

## List Events

### Source: ./content/docs/api/reference/calendars/list_events.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieves a paginated list of calendar events with comprehensive filtering options. Supports filtering by organizer email, attendee email, date ranges (start_date_gte, start_date_lte), and event status. Results can be limited to upcoming events (default), past events, or all events. Each event includes full details such as meeting links, participants, and recording status. The response includes a 'next' pagination cursor for retrieving additional results.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendar_events/","method":"get"}]} webhooks={[]} hasHead={false} />

---

## List Raw Calendars

### Source: ./content/docs/api/reference/calendars/list_raw_calendars.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieves unprocessed calendar data directly from the provider (Google, Microsoft) using provided OAuth credentials. This endpoint is typically used during the initial setup process to allow users to select which calendars to integrate. Returns a list of available calendars with their unique IDs, email addresses, and primary status. This data is not persisted until a calendar is formally created using the create_calendar endpoint.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendars/raw","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Patch Bot

### Source: ./content/docs/api/reference/calendars/patch_bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Updates the configuration of a bot already scheduled to record an event. Allows modification of recording settings, webhook URLs, and other bot parameters without canceling and recreating the scheduled recording. For recurring events, the 'all_occurrences' parameter determines whether changes apply to all instances or just the specific occurrence. Returns the updated event(s) with the modified bot parameters.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendar_events/{uuid}/bot","method":"patch"}]} webhooks={[]} hasHead={false} />

---

## Resync All Calendars

### Source: ./content/docs/api/reference/calendars/resync_all.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Forces a sync of all your connected calendars with their providers (Google, Microsoft).

Processes each calendar individually and returns:
- `synced_calendars`: UUIDs of successfully synced calendars
- `errors`: Details of any failures

Sends webhook notifications for calendars with updates.

<APIPage document={"./openapi.json"} operations={[{"path":"/internal/calendar/resync_all","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Schedule Record Event

### Source: ./content/docs/api/reference/calendars/schedule_record_event.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Configures a bot to automatically join and record a specific calendar event at its scheduled time. The request body contains detailed bot configuration, including recording options, streaming settings, and webhook notification URLs. For recurring events, the 'all_occurrences' parameter can be set to true to schedule recording for all instances of the recurring series, or false (default) to schedule only the specific instance. Returns the updated event(s) with the bot parameters attached.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendar_events/{uuid}/bot","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Unschedule Record Event

### Source: ./content/docs/api/reference/calendars/unschedule_record_event.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Cancels a previously scheduled recording for a calendar event and releases associated bot resources. For recurring events, the 'all_occurrences' parameter controls whether to unschedule from all instances of the recurring series or just the specific occurrence. This operation is idempotent and will not error if no bot was scheduled. Returns the updated event(s) with the bot parameters removed.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendar_events/{uuid}/bot","method":"delete"}]} webhooks={[]} hasHead={false} />

---

## Update Calendar

### Source: ./content/docs/api/reference/calendars/update_calendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Updates a calendar integration with new credentials or platform while maintaining the same UUID. This operation is performed as an atomic transaction to ensure data integrity. The system automatically unschedules existing bots to prevent duplicates, updates the calendar credentials, and triggers a full resync of all events. Useful when OAuth tokens need to be refreshed or when migrating a calendar between providers. Returns the updated calendar object with its new configuration.

<APIPage document={"./openapi.json"} operations={[{"path":"/calendars/{uuid}","method":"patch"}]} webhooks={[]} hasHead={false} />

---

## Delete Data

### Source: ./content/docs/api/reference/delete_data.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Deletes a bot's data including recording, transcription, and logs. Only metadata is retained. Rate limited to 5 requests per minute per API key.

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/{uuid}/delete_data","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Get Meeting Data

### Source: ./content/docs/api/reference/get_meeting_data.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Get meeting recording and metadata

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/meeting_data","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Get Screenshots

### Source: ./content/docs/api/reference/get_screenshots.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieves screenshots captured during the bot's session

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/{uuid}/screenshots","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Join

### Source: ./content/docs/api/reference/join.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Have a bot join a meeting, now or in the future. You can provide a `webhook_url` parameter to receive webhook events specific to this bot, overriding your account's default webhook URL. Events include recording completion, failures, and transcription updates.

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Leave

### Source: ./content/docs/api/reference/leave.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Leave

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/{uuid}","method":"delete"}]} webhooks={[]} hasHead={false} />

---

## Retranscribe Bot

### Source: ./content/docs/api/reference/retranscribe_bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Transcribe or retranscribe a bot's audio using the Default or your provided Speech to Text Provider

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/retranscribe","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Bot Webhook Events Documentation

### Source: ./content/docs/api/reference/webhooks/bot_webhook_documentation.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Meeting BaaS sends the following webhook events related to bot recordings.

## Bot Webhook Event Types

### 1. `complete`
Sent when a bot successfully completes recording a meeting.

**Payload Structure:**
```json
{
  \"event\": \"complete\",
  \"data\": {
    \"bot_id\": \"123e4567-e89b-12d3-a456-426614174000\",
    \"transcript\": [
      {
        \"speaker\": \"John Doe\",
        \"offset\": 1.5,
        \"words\": [
          {
            \"start\": 1.5,
            \"end\": 1.9,
            \"word\": \"Hello\"
          },
          {
            \"start\": 2.0,
            \"end\": 2.4,
            \"word\": \"everyone\"
          }
        ]
      }
    ],
    \"speakers\": [
      \"Jane Smith\",
      \"John Doe\"
    ],
    \"mp4\": \"https://storage.example.com/recordings/video123.mp4?token=abc\",
    \"event\": \"complete\"
  }
}
```

**When it's triggered:**
- After a bot successfully records and processes a meeting
- After the recording is uploaded and made available
- When all processing of the meeting recording is complete

**What to do with it:**
- Download the MP4 recording for storage in your system
- Store the transcript data in your database
- Update meeting status in your application
- Notify users that the recording is available

### 2. `failed`
Sent when a bot fails to join or record a meeting.

**Payload Structure:**
```json
{
  \"event\": \"failed\",
  \"data\": {
    \"bot_id\": \"123e4567-e89b-12d3-a456-426614174000\",
    \"error\": \"meeting_not_found\",
    \"message\": \"Could not join meeting: The meeting ID was not found or has expired\"
  }
}
```

**Common error types:**
- `meeting_not_found`: The meeting ID or link was invalid or expired
- `access_denied`: The bot was denied access to the meeting
- `authentication_error`: Failed to authenticate with the meeting platform
- `network_error`: Network connectivity issues during recording
- `internal_error`: Internal server error

**What to do with it:**
- Log the failure for troubleshooting
- Notify administrators or users about the failed recording
- Attempt to reschedule if appropriate
- Update meeting status in your system

### 3. `transcription_complete`
Sent when transcription is completed separately from recording.

**Payload Structure:**
```json
{
  \"event\": \"transcription_complete\",
  \"data\": {
    \"bot_id\": \"123e4567-e89b-12d3-a456-426614174000\"
  }
}
```

**When it's triggered:**
- After requesting retranscription via the API
- When an asynchronous transcription job completes
- When a higher quality or different language transcription becomes available

**What to do with it:**
- Update the transcript data in your system
- Notify users that improved transcription is available
- Run any post-processing on the new transcript data

## Webhook Usage Tips

- Each event includes the `bot_id` so you can correlate with your internal data
- The complete event includes speaker identification and full transcript data
- For downloading recordings, the mp4 URL is valid for 24 hours
- Handle the webhook asynchronously and return 200 OK quickly to prevent timeouts

For security, always validate the API key in the `x-meeting-baas-api-key` header matches your API key.

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/webhooks/bot","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Calendar Webhook Events Documentation

### Source: ./content/docs/api/reference/webhooks/calendar_webhook_documentation.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Meeting BaaS sends the following webhook events related to calendar integrations.

## Calendar Webhook Event Types

### 1. `calendar.sync_events`
Sent when calendar events are synced with external providers.

**Payload Structure:**
```json
{
  \"event\": \"calendar.sync_events\",
  \"data\": {
    \"calendar_id\": \"123e4567-e89b-12d3-a456-426614174000\",
    \"last_updated_ts\": \"2023-05-01T12:00:00Z\",
    \"affected_event_uuids\": [
      \"123e4567-e89b-12d3-a456-426614174001\",
      \"123e4567-e89b-12d3-a456-426614174002\"
    ]
  }
}
```

**When it's triggered:**
- After initial calendar connection is established
- When external calendar providers (Google, Microsoft) send change notifications
- After manual calendar resync operations
- During scheduled periodic syncs
- When events are created, updated, or deleted in the source calendar

**What to do with it:**
- Update your local copy of calendar events
- Process any new events that match your criteria
- Remove any deleted events from your system
- Update schedules for any modified events
- Refresh your UI to show the latest calendar data

**Field details:**
- `calendar_id`: The UUID of the synchronized calendar
- `last_updated_ts`: ISO-8601 timestamp when the sync occurred
- `affected_event_uuids**: Array of UUIDs for events that were changed

## Integration with Meeting BaaS Calendar API

After receiving a calendar webhook event, you can:
1. Use the `/calendar_events` endpoint to retrieve detailed information about specific events
2. Use the `/calendars/:uuid` endpoint to get calendar metadata
3. Schedule recording bots for any new meetings with the `/calendar_events/:uuid/bot` endpoint

## Webhook Usage Tips

- Each event includes affected event UUIDs for efficient processing
- You don't need to retrieve all calendar events - just process the changed ones
- The timestamp helps determine the sequence of updates
- For high-frequency calendars, consider batch processing of multiple events

For security, always validate the API key in the `x-meeting-baas-api-key` header matches your API key.

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/webhooks/calendar","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Webhook Events Documentation

### Source: ./content/docs/api/reference/webhooks/webhook_documentation.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Meeting BaaS sends webhook events to your configured webhook URL when specific events occur.

## Webhook Event Types

### 1. `complete`
Sent when a bot successfully completes recording a meeting. Contains full transcription data and a link to the recording.
```json
{
  \"event\": \"complete\",
  \"data\": {
    \"bot_id\": \"123e4567-e89b-12d3-a456-426614174000\",
    \"transcript\": [
      {
        \"speaker\": \"John Doe\",
        \"offset\": 1.5,
        \"words\": [
          {
            \"start\": 1.5,
            \"end\": 1.9,
            \"word\": \"Hello\"
          },
          {
            \"start\": 2.0,
            \"end\": 2.4,
            \"word\": \"everyone\"
          }
        ]
      }
    ],
    \"speakers\": [
      \"John Doe\",
      \"Jane Smith\"
    ],
    \"mp4\": \"https://storage.example.com/recordings/video123.mp4?token=abc\",
    \"event\": \"complete\"
  }
}
```

The `complete` event includes:
- **bot_id**: Unique identifier for the bot that completed recording
- **speakers**: A set of speaker names identified in the meeting
- **transcript**: Full transcript data with speaker identification and word timing
- **mp4**: URL to the recording file (valid for 24 hours by default)
- **event**: Event type identifier ("complete")

### 2. `failed`
Sent when a bot fails to join or record a meeting. Contains error details.
```json
{
  \"event\": \"failed\",
  \"data\": {
    \"bot_id\": \"123e4567-e89b-12d3-a456-426614174000\",
    \"error\": \"meeting_not_found\",
    \"message\": \"Could not join meeting: The meeting ID was not found or has expired\"
  }
}
```

The `failed` event includes:
- **bot_id**: Unique identifier for the bot that failed
- **error**: Error code identifying the type of failure
- **message**: Detailed human-readable error message

Common error types include:
- `meeting_not_found`: The meeting ID or link was invalid or expired
- `access_denied`: The bot was denied access to the meeting
- `authentication_error`: Failed to authenticate with the meeting platform
- `network_error`: Network connectivity issues during recording
- `internal_error`: Internal server error

### 3. `calendar.sync_events`
Sent when calendar events are synced. Contains information about which events were updated.
```json
{
  \"event\": \"calendar.sync_events\",
  \"data\": {
    \"calendar_id\": \"123e4567-e89b-12d3-a456-426614174000\",
    \"last_updated_ts\": \"2023-05-01T12:00:00Z\",
    \"affected_event_uuids\": [
      \"123e4567-e89b-12d3-a456-426614174001\",
      \"123e4567-e89b-12d3-a456-426614174002\"
    ]
  }
}
```

The `calendar.sync_events` event includes:
- **calendar_id**: UUID of the calendar that was synced
- **last_updated_ts**: ISO-8601 timestamp of when the sync occurred
- **affected_event_uuids**: Array of UUIDs for calendar events that were added, updated, or deleted

This event is triggered when:
- Calendar data is synced with the external provider (Google, Microsoft)
- Multiple events may be created, updated, or deleted in a single sync operation
- Use this event to update your local cache of calendar events

### 4. `transcription_complete`
Sent when transcription is completed separately from recording (e.g., after retranscribing).
```json
{
  \"event\": \"transcription_complete\",
  \"data\": {
    \"bot_id\": \"123e4567-e89b-12d3-a456-426614174000\"
  }
}
```

The `transcription_complete` event includes:
- **bot_id**: Unique identifier for the bot with the completed transcription

This event is sent when:
- You request a retranscription via the `/bots/retranscribe` endpoint
- An asynchronous transcription process completes after the recording has ended

## Setting Up Webhooks

You can configure webhooks in two ways:
1. **Account-level webhook URL**: Set a default webhook URL for all bots in your account using the `/accounts/webhook_url` endpoint
2. **Bot-specific webhook URL**: Provide a `webhook_url` parameter when creating a bot with the `/bots` endpoint

Your webhook endpoint must:
- Accept POST requests with JSON payload
- Return a 2xx status code to acknowledge receipt
- Process requests within 10 seconds to avoid timeouts
- Handle each event type appropriately based on the event type

All webhook requests include:
- `x-meeting-baas-api-key` header with your API key for verification
- `content-type: application/json` header
- JSON body containing the event details

## Webhook Reliability

If your endpoint fails to respond or returns an error, the system will attempt to retry the webhook delivery. For critical events, we recommend implementing:

- Idempotency handling to prevent duplicate processing of the same event
- Proper logging of webhook receipts for audit purposes
- Asynchronous processing to quickly acknowledge receipt before handling the event data

For security, always validate the API key in the `x-meeting-baas-api-key` header matches your API key.

<APIPage document={"./openapi.json"} operations={[{"path":"/bots/webhooks","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Calendar API Enhancements

Improved filtering, comprehensive event details, and calendar management

### Source: ./content/docs/api/updates/calendar-api-enhancements.mdx


<Callout type="info" icon={<Info className="h-5 w-5" />}>
  Paris, the 2nd of March 2025.
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

## Calendar API Update

New webhooks, events, and pagination updates

### Source: ./content/docs/api/updates/calendar-api-update.mdx


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

## Streaming and Client Updates

New streaming formats, WebSocket configurations, and client improvements

### Source: ./content/docs/api/updates/minor-streaming-zoom-and-microsoft-teams.mdx


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

## Improvements & Retranscribe Route

Teams/GMeet stability improvements and new transcription capabilities

### Source: ./content/docs/api/updates/retranscribe-route.mdx


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

