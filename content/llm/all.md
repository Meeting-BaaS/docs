# All MeetingBaas documentation content

This contains all documentation across Meeting BaaS systems.

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

Deploy AI for video meetings through a single unified API.

### Source: ./content/docs/api/index.mdx


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

## April 23rd, 2025

Latest changes to the Meeting BaaS API

### Source: ./content/docs/api/updates/api-update-2025-04-23.mdx


import { Info } from 'lucide-react';

<Callout type="info" icon={<Info className="h-5 w-5" />}>
  Paris, April 23rd, 2025.
</Callout>

We're excited to announce several improvements to our API endpoints.

## Bots

### [GET /bots/with/metadata](/docs/api/reference/bots_with_metadata)

Simplified and improved the bot listing endpoint:
- Streamlined response format for better readability
- Maintains all filtering capabilities (`meeting_url`, `bot_name`, `created_after/before`, `speaker_name`)
- Supports advanced filtering and sorting through `filter_by_extra` and `sort_by_extra`
- Returns essential metadata including IDs, names, and meeting details

### [GET /bots/:uuid/screenshots](/docs/api/reference/get_screenshots)

New endpoint to retrieve screenshots captured during a bot's session:
- Access screenshots taken while trying to access meetings
- Useful for monitoring and verification purposes
- Part of our expanded bot monitoring capabilities

## Webhooks

### GET /webhooks/calendar/webhook/documentation

Documentation improvements and parameter updates:
- Updated parameter notation from `{uuid}` to `:uuid` for consistency with REST API standards
- Clarified the `affected_event_uuids` field documentation
- Enhanced integration examples with calendar events
- All endpoint references now use `:parameter` notation

## Implementation Timeline

These changes will be live in production on April 24th, 2025. The updates focus on improving documentation clarity, adding new monitoring capabilities, and maintaining consistent API patterns across our endpoints.


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

## Introduction

Get started with Model Context Protocol servers for Meeting BaaS

### Source: ./content/docs/mcp-servers/index.mdx


## What is Model Context Protocol?

Model Context Protocol (MCP) is a standard that lets AI assistants like Claude connect with other services. For Meeting BaaS, an MCP server helps with:

- Meeting transcripts and analysis
- Meeting scheduling
- AI assistance during meetings
- Secure connections
- Enterprise-ready infrastructure

  Learn more about Model Context Protocol in [Anthropic's technical overview](https://www.anthropic.com/news/model-context-protocol).
   
## Deployment Options

Meeting BaaS offers two robust MCP server implementations to match your specific needs:

<Cards>
  <Card
    title="MCP on Vercel"
    icon={<Cloud className="text-blue-400" />}
    href="/docs/mcp-servers/mcp/vercel-mcp"
  >
    A serverless solution optimized for Vercel deployment, offering:
    - Zero infrastructure management
    - Automatic scaling
    - Global edge deployment
    - Simplified CI/CD integration
  </Card>
  <Card
    title="Meeting MCP"
    icon={<Server className="text-green-400" />}
    href="/docs/mcp-servers/mcp/meeting-mcp"
  >
    A self-hosted solution providing:
    - Complete infrastructure control
    - Custom deployment options
    - Enhanced security configurations
    - Local development flexibility
  </Card>
</Cards>

## Key Capabilities

Both MCP servers provide access to Meeting BaaS capabilities through standardized tools:

<Accordions>
  <Accordion title="Meeting Management" icon={<VideoIcon />} defaultOpen>
    - Create and invite meeting bots to video conferences
    - Record and transcribe meetings automatically
    - Manage speaking bots with different personas
    - Configure recording settings and bot behavior
  </Accordion>

  <Accordion title="Calendar Integration" icon={<Calendar />}>
    - Connect Google and Microsoft calendars
    - Schedule automated recordings of upcoming meetings
    - Manage calendar events and recordings
    - Receive guidance on OAuth setup and configuration
  </Accordion>

  <Accordion title="Transcript & Data Access" icon={<FileText />}>
    - Search through meeting transcripts
    - Identify and share key moments from meetings
    - Generate shareable links to specific meeting segments
    - Access comprehensive meeting data and metadata
  </Accordion>
</Accordions>

## Getting Started

### Prerequisites

The following requirements must be met before setting up an MCP server:

<Cards>
  <Card title="Development Tools" icon={<Terminal />}>
    - Node.js v16.x or later
    - npm or yarn package manager 
    - Git for version control
    - Docker for local development
    - VS Code or your preferred IDE
  </Card>

  <Card title="Account Access" icon={<Key />}>
    - Meeting BaaS account
    - Valid API credentials
    - Access to deployment platform
  </Card>
</Cards>

### Setup Instructions

Follow these steps to get your MCP server up and running:

<Steps>
  <Step title="Create Account & Get API Access">
    <Card>
      1. Sign up at [meetingbaas.com](https://meetingbaas.com)
      2. Navigate to API section in dashboard
      3. Generate new API key
      4. Store credentials securely
    </Card>
  </Step>

  <Step title="Configure Development Environment">
    Choose your deployment type and set up the codebase:

    ```bash
    # Clone repository
    git clone https://github.com/meetingbaas/mcp-vercel     # For Vercel
    # OR
    git clone https://github.com/meetingbaas/meeting-mcp    # For self-hosted

    # Install and configure
    cd <repository-name>
    npm install
    cp .env.example .env
    ```
  </Step>

  <Step title="Deploy Your Server">
    <Cards>
      <Card
        title="Cloud Deployment"
        icon={<Cloud />}
        href="https://github.com/Meeting-Baas/mcp-on-vercel"
      >
        Deploy to Vercel for a managed cloud solution with automatic scaling
      </Card>
      
      <Card
        title="Self-Hosted Setup"
        icon={<Server />}
        href="https://github.com/Meeting-Baas/meeting-mcp"
      >
        Deploy locally or to your own infrastructure for maximum control
      </Card>
    </Cards>
  </Step>
</Steps>

For extended functionality, both deployment options fully support the [Meeting BaaS TypeScript SDK](/docs/typescript-sdk).


---

## Claude Integration

Configure and integrate Claude Desktop with Meeting BaaS MCP servers for AI-powered meeting assistance and automation

### Source: ./content/docs/mcp-servers/integrations/claude-integration.mdx


This guide explains how to integrate Claude Desktop with Meeting BaaS MCP server for enhanced meeting capabilities.

## Configuration Setup

### Step 1: Edit Configuration File

Open your Claude Desktop configuration file located at:

```bash
# For macOS
~/Library/Application Support/Claude/claude_desktop_config.json

# For Windows
%APPDATA%\Claude\claude_desktop_config.json

# For Linux
~/.config/Claude/claude_desktop_config.json
```

### Step 2: Add MCP Server Configuration

Add the following configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "meetingbaas": {
      "command": "/bin/bash",
      "args": [
        "-c",
        "cd /path/to/meeting-mcp && (npm run build 1>&2) && MCP_FROM_CLAUDE=true node dist/index.js"
      ],
      "headers": {
        "x-api-key": "YOUR_API_KEY_FOR_MEETING_BAAS"
      },
      "botConfig": {
        "name": "Meeting Assistant",
        "image": "https://meetingbaas.com/static/972043b7d604bca0d4b0048c7dd67ad2/fc752/previewFeatures.avif",
        "entryMessage": "Hello, I'm a bot from Meeting Baas. I'll be taking notes for this meeting.",
        "deduplicationKey": "unique_key_to_override_restriction",
        "nooneJoinedTimeout": 600,
        "waitingRoomTimeout": 600,
        "speechToTextProvider": "Gladia",
        "speechToTextApiKey": "YOUR_SPEECH_TO_TEXT_API_KEY",
        "extra": {
          "meetingType": "sales",
          "summaryPrompt": "Focus on action items and decision points",
          "searchKeywords": ["budget", "timeline", "deliverables"],
          "timeStampHighlights": [
            {"time": "00:05:23", "note": "Discussion about Q2 sales numbers"},
            {"time": "00:12:47", "note": "Team disagreement on marketing strategy"}
          ],
          "participants": ["John Smith", "Jane Doe", "Bob Johnson"],
          "project": "Project Phoenix",
          "department": "Engineering",
          "priority": "High",
          "followupDate": "2023-12-15",
          "tags": ["technical", "planning", "retrospective"]
        },
        "calendarOAuth": {
          "platform": "Google",
          "clientId": "YOUR_OAUTH_CLIENT_ID",
          "clientSecret": "YOUR_OAUTH_CLIENT_SECRET",
          "refreshToken": "YOUR_REFRESH_TOKEN",
          "rawCalendarId": "primary@gmail.com"
        }
      }
    }
  }
}
```

## Configuration Parameters Explained

### Core Configuration

| Parameter | Description | Required |
|-----------|-------------|----------|
| `command` | Specifies the shell to execute the MCP server | Yes |
| `args` | Array of command-line arguments for server execution | Yes |
| `headers` | Authentication headers including API keys | Yes |

### Bot Configuration (`botConfig`)

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `name` | Display name of the bot in meetings | Yes | "Claude Assistant" |
| `image` | URL for bot's avatar image | No | System default |
| `entryMessage` | Bot's greeting message when joining meetings | No | - |
| `deduplicationKey` | Key to bypass 5-minute rejoin restriction | No | - |
| `nooneJoinedTimeout` | Timeout (seconds) if no participants join | No | 600 |
| `waitingRoomTimeout` | Timeout (seconds) for waiting room | No | 600 |

### Speech-to-Text Configuration

| Parameter | Description | Required |
|-----------|-------------|----------|
| `speechToTextProvider` | Provider for transcription service ("Gladia", "Runpod", "Default") | No |
| `speechToTextApiKey` | API key for the chosen provider | Required if provider specified |

### Calendar Integration (`calendarOAuth`)

| Parameter | Description | Required |
|-----------|-------------|----------|
| `platform` | Calendar platform ("Google" or "Microsoft") | Yes |
| `clientId` | OAuth client ID | Yes |
| `clientSecret` | OAuth client secret | Yes |
| `refreshToken` | OAuth refresh token | Yes |
| `rawCalendarId` | Specific calendar ID to integrate | No |

### Extended Metadata (`extra`)

The `extra` field allows for flexible metadata configuration to enhance AI capabilities:

```json
{
  "meetingType": "Type of meeting (sales, technical, etc.)",
  "summaryPrompt": "Custom prompt for meeting summaries",
  "searchKeywords": ["Array of keywords to track"],
  "timeStampHighlights": [
    {
      "time": "HH:MM:SS",
      "note": "Description of highlight"
    }
  ],
  "participants": ["Array of participant names"],
  "project": "Project identifier",
  "department": "Department name",
  "priority": "Meeting priority level",
  "followupDate": "YYYY-MM-DD",
  "tags": ["Array of relevant tags"]
}
```

## Security Considerations

1. **API Key Management**:
   - Use API keys associated with your corporate email account
   - Store API keys securely
   - Regularly rotate API keys
   - Never commit API keys to version control

2. **Access Control**:
   - Recordings and bot logs are automatically shared with same-domain colleagues
   - Implement proper access controls for sensitive meetings
   - Regular audit of access patterns

## QR Code API Integration

The QR Code API uses the same header name (`x-api-key`) but requires separate configuration. Configure it using one of these methods:

1. Environment Variable:
   ```bash
   export MEETING_BAAS_QR_API_KEY="your_api_key"
   ```

2. Direct Configuration:
   ```json
   {
     "qrCodeApi": {
       "apiKey": "YOUR_QR_API_KEY"
     }
   }
   ```

## Best Practices

1. **Meeting Setup**:
   - Configure appropriate timeouts
   - Use meaningful bot names
   - Set clear entry messages

2. **Data Management**:
   - Regular backup of configurations
   - Periodic review of stored meetings
   - Clean up unused recordings

3. **Integration Maintenance**:
   - Regular updates of dependencies
   - Monitor API usage
   - Keep OAuth tokens updated

## Troubleshooting

1. **Connection Issues**:
   - Verify API key validity
   - Check network connectivity
   - Ensure correct server path

2. **Bot Behavior**:
   - Verify timeout settings
   - Check log files for errors
   - Confirm OAuth credentials if using calendar integration

3. **Performance Issues**:
   - Monitor system resources
   - Check network bandwidth
   - Verify speech-to-text provider status

After configuration, restart Claude Desktop for changes to take effect.


---

## Cursor Integration

Configure and integrate Cursor IDE with Meeting BaaS MCP servers for AI-powered development assistance and code collaboration

### Source: ./content/docs/mcp-servers/integrations/cursor-integration.mdx


## Overview
This guide explains how to integrate the Meeting BaaS Model Context Protocol (MCP) server with Cursor, an AI-powered IDE. This integration enables enhanced AI capabilities within your development environment.

## Integration Steps

### Setting Up Cursor Integration

1. **Launch Cursor**
   - Open the Cursor IDE on your system
   - Ensure you're running the latest version for optimal compatibility

2. **Access Settings**
   - Click on the Settings icon (⚙️) in the bottom left corner
   - Alternatively, use the keyboard shortcut `Ctrl+,` (Windows/Linux) or `Cmd+,` (macOS)

3. **Configure Model Context Protocol**
   - Navigate to "Model Context Protocol" section
   - Click on "Add New Server"
   - Enter the following configuration:
     ```json
     {
       "name": "Meeting BaaS MCP",
       "type": "sse",
       "serverUrl": "http://localhost:7017/mcp"
     }
     ```
   - If authentication is required, add headers in the format:
     ```json
     {
       "Authorization": "Bearer your-token-here"
     }
     ```

## Development Guide

### Building the Project

```bash
# Build the project
npm run build
```
This command compiles the TypeScript code and generates the production-ready build.

### Testing

```bash
# Run MCP Inspector for testing
npm run inspect
```
The MCP Inspector provides a visual interface to test and debug your MCP server integration.

### Development Mode

```bash
# Start development server with auto-reload
npm run dev
```
Features:
- Hot reloading for code changes
- Real-time debugging information
- Automatic server restart on file changes

## Log Management

### Cleanup Command
```bash
npm run cleanup
```

The log management system includes sophisticated features:

- **Automated Log Cleanup**
  - Removes redundant log files
  - Cleans cached data periodically
  - Maintains optimal disk usage

- **Smart Log Filtering**
  - Filters out non-essential ping messages
  - Preserves critical error and warning logs
  - Implements log rotation for long-term management

- **Performance Optimization**
  - Reduces I/O operations
  - Minimizes memory footprint
  - Implements efficient log compression

## Project Architecture

```
project-root/
├── src/
│   ├── index.ts           # Main application entry point
│   ├── tools/             # MCP tool implementations
│   ├── resources/         # Resource definitions and handlers
│   ├── api/              # Meeting BaaS backend API client
│   ├── types/            # TypeScript type definitions
│   ├── config.ts         # Server configuration
│   └── utils/
│       ├── logging.ts    # Advanced logging system
│       └── tinyDb.ts     # Persistent state management
```

### Key Components

1. **Main Entry Point** (`src/index.ts`)
   - Server initialization
   - Route configuration
   - Middleware setup

2. **Tools Directory** (`src/tools/`)
   - Custom MCP tool implementations
   - Tool registration and management
   - Tool validation logic

3. **Resources** (`src/resources/`)
   - Static resource definitions
   - Resource loading and caching
   - Asset management

4. **API Client** (`src/api/`)
   - Meeting BaaS backend integration
   - API request handling
   - Response processing

5. **Type Definitions** (`src/types/`)
   - Interface definitions
   - Type guards
   - Shared type utilities

6. **Configuration** (`src/config.ts`)
   - Environment-based configuration
   - Server settings
   - Integration parameters

7. **Utilities** (`src/utils/`)
   - Logging system with advanced filtering
   - Database operations for bot state
   - Helper functions and common utilities

## Best Practices

1. **Error Handling**
   - Implement comprehensive error catching
   - Provide detailed error messages
   - Log errors with appropriate severity levels

2. **Security**
   - Use environment variables for sensitive data
   - Implement proper authentication
   - Regular security audits

3. **Performance**
   - Optimize resource usage
   - Implement caching where appropriate
   - Monitor server health metrics

## Troubleshooting

Common issues and solutions:

1. **Connection Issues**
   - Verify server URL is correct
   - Check if the server is running
   - Confirm network connectivity

2. **Authentication Errors**
   - Validate token format
   - Check token expiration
   - Verify header configuration

3. **Performance Problems**
   - Monitor log sizes
   - Check system resources
   - Review active connections


---

## Overview

Introduction to Meeting MCP - A Standalone MCP Server for Meeting BaaS Integration

### Source: ./content/docs/mcp-servers/meeting-mcp/overview.mdx


Meeting MCP is a standalone [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) server that provides AI assistants with access to Meeting BaaS data and capabilities. The server can be deployed locally or on your own infrastructure, making it ideal for use with Claude Desktop and other MCP clients.

<Card
  icon={<Github />}
  title="GitHub Repository"
  href="https://github.com/Meeting-Baas/meeting-mcp"
  description="Clone the repository to deploy your own MCP server"
  external
/>

## Features

<Cards>
  <Card title="Meeting Management" icon={<Video className="text-blue-400" />}>
    Create, join, and manage meeting bots with automatic recording and
    transcription.
  </Card>
  <Card title="Transcript Search" icon={<Search className="text-green-400" />}>
    Search and analyze meeting transcripts for specific content or speakers.
  </Card>
  <Card
    title="Calendar Integration"
    icon={<Calendar className="text-purple-400" />}
  >
    Connect calendars and automatically schedule meeting recordings.
  </Card>
  <Card title="QR Code Generation" icon={<QrCode className="text-amber-400" />}>
    Generate AI-powered QR code images that can be used as bot avatars.
  </Card>
  <Card
    title="Key Moment Identification"
    icon={<Clock className="text-teal-400" />}
  >
    Automatically identify and share important moments from meetings.
  </Card>
  <Card title="Link Sharing" icon={<Link className="text-indigo-400" />}>
    Generate shareable links to meetings and specific timestamps.
  </Card>
  <Card title="Local Deployment" icon={<HardDrive className="text-red-400" />}>
    Run completely on your own infrastructure for enhanced security and control.
  </Card>
</Cards>

## Prerequisites

Before getting started, you'll need:

- Node.js (v16 or later)
- npm
- A [Meeting BaaS API key](https://meetingbaas.com)
- (Optional) A QR Code AI API key for QR code generation

## Installation

<Steps>
  <Step title="Clone the Repository">
    ```bash
    git clone https://github.com/Meeting-Baas/meeting-mcp.git
    cd meeting-mcp
    ```
  </Step>
  <Step title="Install Dependencies">
    ```bash
    npm install
    ```
  </Step>
  <Step title="Build the Project">
    ```bash
    npm run build
    ```
  </Step>
  <Step title="Start the Server">
    ```bash
    npm run start
    ```
    By default, the server runs on port 7017 and exposes the MCP endpoint at http://localhost:7017/mcp.
  </Step>
</Steps>

## Authentication

The server expects an API key in the `x-api-key` header for authentication. You can configure the default API key in the configuration file.

Many tools also support direct authentication through parameters (named with "WithCredentials"), allowing you to provide the API key directly in the query rather than through headers.

## Integration with Claude Desktop

<Steps>
  <Step title="Edit the Claude Desktop Configuration File">
    ```bash
    # On Mac/Linux
    vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
    
    # On Windows
    notepad %APPDATA%\Claude\claude_desktop_config.json
    ```
  </Step>
  
  <Step title="Add the Meeting BaaS MCP Server Configuration">
    ```json
    {
      "mcpServers": {
        "meetingbaas": {
          "command": "/bin/bash",
          "args": [
            "-c",
            "cd /path/to/meeting-mcp && (npm run build 1>&2) && MCP_FROM_CLAUDE=true node dist/index.js"
          ],
          "headers": {
            "x-api-key": "YOUR_API_KEY_FOR_MEETING_BAAS"
          },
          "botConfig": {
            "name": "Meeting Assistant",
            "image": "https://meetingbaas.com/static/972043b7d604bca0d4b0048c7dd67ad2/fc752/previewFeatures.avif",
            "entryMessage": "Hello, I'm a bot from Meeting Baas. I'll be taking notes for this meeting.",
            "deduplicationKey": "unique_key_to_override_restriction",
            "nooneJoinedTimeout": 600,
            "waitingRoomTimeout": 600,
            "speechToTextProvider": "Gladia",
            "speechToTextApiKey": "YOUR_SPEECH_TO_TEXT_API_KEY",
            "extra": {
              "meetingType": "sales",
              "summaryPrompt": "Focus on action items and decision points",
              "searchKeywords": ["budget", "timeline", "deliverables"]
            }
          }
        }
      }
    }
    ```
    
    <Callout>
      Replace `/path/to/meeting-mcp` with the actual path to your local repository and `YOUR_API_KEY` with your actual Meeting BaaS API key.
    </Callout>
  </Step>
  
  <Step title="Restart Claude Desktop">
    Close and reopen Claude Desktop to apply the changes.
  </Step>
</Steps>

## Development

For development purposes, you can:

```bash
# Run in development mode with auto-reload
npm run dev

# Test with MCP Inspector
npm run inspect

# Clean up logs
npm run cleanup
```

## Project Structure

- `src/index.ts`: Main entry point
- `src/tools/`: Tool implementations
- `src/resources/`: Resource definitions
- `src/api/`: API client for the Meeting BaaS backend
- `src/types/`: TypeScript type definitions
- `src/config.ts`: Server configuration
- `src/utils/`: Utility functions


---

## Calendar Tools

Comprehensive APIs and tools for managing calendar integrations with Meeting BaaS, including Google Calendar and Microsoft Calendar support

### Source: ./content/docs/mcp-servers/meeting-mcp/tools/calender-tools.mdx


Calendar Tools provide a robust set of APIs for integrating and managing calendar systems within your application. These tools support both Google Calendar and Microsoft Calendar integrations through OAuth authentication.

## OAuth Setup Guide

### oauthGuidance

Get detailed step-by-step instructions for setting up OAuth authentication with Google or Microsoft calendars.

```typescript
GET /api/calendar/oauth/guidance
```

**Response:**
- Comprehensive setup instructions for both Google and Microsoft OAuth
- Required API permissions and scopes
- Step-by-step credential creation process
- Security best practices

## Calendar Integration

### listRawCalendars

Lists all available calendars from Google or Microsoft before integration.

```typescript
POST /api/calendar/raw/list
```

**Parameters:**
```json
{
  "platform": "Google | Microsoft",
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret",
  "refreshToken": "your_refresh_token"
}
```

**Response:**
```json
{
  "calendars": [
    {
      "id": "calendar_id",
      "name": "Calendar Name",
      "isPrimary": true,
      "email": "calendar@example.com"
    }
  ]
}
```

### setupCalendarOAuth

Integrates a calendar using OAuth credentials.

```typescript
POST /api/calendar/setup
```

**Parameters:**
```json
{
  "platform": "Google | Microsoft",
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret",
  "refreshToken": "your_refresh_token",
  "rawCalendarId": "optional_calendar_id" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "calendarId": "uuid",
  "name": "Calendar Name",
  "email": "calendar@example.com"
}
```

## Calendar Management

### listCalendars

Lists all integrated calendars in your system.

```typescript
GET /api/calendars
```

**Response:**
```json
{
  "calendars": [
    {
      "uuid": "calendar_uuid",
      "name": "Calendar Name",
      "email": "calendar@example.com",
      "platform": "Google | Microsoft",
      "lastSynced": "2024-03-21T10:00:00Z"
    }
  ]
}
```

### getCalendar

Retrieves detailed information about a specific calendar.

```typescript
GET /api/calendars/{calendarId}
```

**Parameters:**
- `calendarId`: UUID of the calendar (path parameter)

**Response:**
```json
{
  "uuid": "calendar_uuid",
  "name": "Calendar Name",
  "email": "calendar@example.com",
  "platform": "Google | Microsoft",
  "lastSynced": "2024-03-21T10:00:00Z",
  "settings": {
    "timezone": "UTC",
    "defaultReminders": []
  }
}
```

### deleteCalendar

Removes a calendar integration from your system.

```typescript
DELETE /api/calendars/{calendarId}
```

**Parameters:**
- `calendarId`: UUID of the calendar (path parameter)

**Response:**
```json
{
  "success": true,
  "message": "Calendar successfully deleted"
}
```

### resyncAllCalendars

Forces a refresh of all connected calendars.

```typescript
POST /api/calendars/resync
```

**Response:**
```json
{
  "success": true,
  "syncedCalendars": 5,
  "lastSyncTime": "2024-03-21T10:00:00Z"
}
```

## Event Management

### listUpcomingMeetings

Retrieves upcoming meetings from a specific calendar.

```typescript
GET /api/calendars/{calendarId}/meetings
```

**Parameters:**
- `calendarId`: UUID of the calendar (path parameter)
- `status`: "upcoming" | "past" | "all" (query parameter, optional)
- `limit`: number (query parameter, optional)

**Response:**
```json
{
  "meetings": [
    {
      "id": "meeting_id",
      "title": "Meeting Title",
      "startTime": "2024-03-21T10:00:00Z",
      "endTime": "2024-03-21T11:00:00Z",
      "isRecorded": false
    }
  ]
}
```

### listEvents

Lists calendar events with comprehensive filtering options.

```typescript
GET /api/calendars/{calendarId}/events
```

**Parameters:**
- `calendarId`: UUID of the calendar (path parameter)
- `startDateGte`: ISO date string (query parameter, optional)
- `startDateLte`: ISO date string (query parameter, optional)
- `attendeeEmail`: string (query parameter, optional)
- Additional filters available

**Response:**
```json
{
  "events": [
    {
      "id": "event_id",
      "title": "Event Title",
      "description": "Event Description",
      "startTime": "2024-03-21T10:00:00Z",
      "endTime": "2024-03-21T11:00:00Z",
      "attendees": [
        {
          "email": "attendee@example.com",
          "responseStatus": "accepted"
        }
      ],
      "meetingLink": "https://meet.example.com/123"
    }
  ]
}
```

### listEventsWithCredentials

Similar to listEvents but accepts direct API credentials.

```typescript
GET /api/calendars/{calendarId}/events/direct
```

**Parameters:**
- Same as listEvents, plus:
- `apiKey`: Your API key (header)

### getEvent

Retrieves detailed information about a specific calendar event.

```typescript
GET /api/events/{eventId}
```

**Parameters:**
- `eventId`: UUID of the event (path parameter)

**Response:**
```json
{
  "id": "event_id",
  "title": "Event Title",
  "description": "Event Description",
  "startTime": "2024-03-21T10:00:00Z",
  "endTime": "2024-03-21T11:00:00Z",
  "attendees": [],
  "recordingStatus": "scheduled | recording | completed | none"
}
```

## Recording Management

### scheduleRecording

Schedules a bot to record an upcoming meeting.

```typescript
POST /api/events/{eventId}/record
```

**Parameters:**
```json
{
  "botName": "Recording Bot",
  "botImage": "https://example.com/bot-avatar.png", // Optional
  "recordingMode": "speaker | gallery | automatic", // Optional
  "quality": "high | medium | low" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "recordingId": "recording_uuid",
  "scheduledStartTime": "2024-03-21T10:00:00Z"
}
```

### scheduleRecordingWithCredentials

Similar to scheduleRecording but accepts direct API credentials.

```typescript
POST /api/events/{eventId}/record/direct
```

**Parameters:**
- Same as scheduleRecording, plus:
- `apiKey`: Your API key (header)

### cancelRecording

Cancels a previously scheduled recording.

```typescript
DELETE /api/events/{eventId}/record
```

**Parameters:**
- `eventId`: UUID of the event (path parameter)
- `allOccurrences`: boolean (query parameter, optional)

**Response:**
```json
{
  "success": true,
  "message": "Recording cancelled successfully"
}
```

### cancelRecordingWithCredentials

Similar to cancelRecording but accepts direct API credentials.

```typescript
DELETE /api/events/{eventId}/record/direct
```

**Parameters:**
- Same as cancelRecording, plus:
- `apiKey`: Your API key (header)

## System Health

### checkCalendarIntegration

Diagnoses calendar integration status and health.

```typescript
GET /api/calendar/health
```

**Response:**
```json
{
  "status": "healthy | degraded | error",
  "lastSync": "2024-03-21T10:00:00Z",
  "connectedCalendars": 5,
  "activeRecordings": 2,
  "issues": [
    {
      "type": "auth_error | sync_error | api_error",
      "message": "Detailed error message",
      "calendarId": "affected_calendar_uuid"
    }
  ],
  "recommendations": [
    "List of troubleshooting steps or recommendations"
  ]
}
```

## Best Practices

1. **OAuth Token Management**
   - Securely store refresh tokens
   - Implement token rotation
   - Handle token expiration gracefully

2. **Error Handling**
   - Implement proper error handling for API rate limits
   - Handle calendar sync conflicts
   - Manage recording failures appropriately

3. **Performance Optimization**
   - Cache calendar data when appropriate
   - Implement pagination for large event lists
   - Use webhook notifications for calendar updates

4. **Security Considerations**
   - Use HTTPS for all API calls
   - Implement proper authentication
   - Regular security audits
   - Monitor for suspicious activities

## Rate Limits

- Standard tier: 100 requests per minute
- Enterprise tier: 1000 requests per minute
- Webhook notifications: 50 per second

## Support

For additional support or questions:
- Documentation: https://docs.example.com/calendar-tools
- Support Email: support@example.com
- API Status: https://status.example.com


---

## Link Sharing Tools

Tools and APIs for creating and managing shareable links to meeting recordings and segments, enabling easy sharing of meeting content and timestamps

### Source: ./content/docs/mcp-servers/meeting-mcp/tools/link-sharing-tools.mdx


These tools help you create well-formatted, shareable links to meeting recordings and segments, making it easier to reference and share specific parts of meetings with your team.

## shareableMeetingLink

Creates a beautifully formatted, shareable link to a meeting recording with rich metadata that can be directly shared in chat applications.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `botId` | string | Yes | The unique identifier for the meeting bot |
| `timestamp` | string | No | Timestamp in format "HH:MM:SS" to link to a specific moment |
| `title` | string | No | Title of the meeting |
| `speakerName` | string | No | Name of the current speaker |
| `description` | string | No | Brief description of the meeting or segment |

### Returns
A markdown-formatted string containing the meeting link with metadata that can be shared in chat applications.

### Example Usage

```typescript
const link = await shareableMeetingLink({
  botId: "abc123",
  timestamp: "00:12:35",
  title: "Weekly Team Sync",
  speakerName: "Sarah Johnson",
  description: "Discussing the new product roadmap"
});
```

### Output Format
```markdown
📽️ **Meeting Recording: Weekly Team Sync**
⏱️ Timestamp: 00:12:35
🎤 Speaker: Sarah Johnson
📝 Discussing the new product roadmap

🔗 [View Recording](https://meetingbaas.com/viewer/abc123?t=755)
```

## shareMeetingSegments

Generates a formatted list of links to multiple important moments in a meeting, perfect for creating a table of contents or highlighting key discussions.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `botId` | string | Yes | The unique identifier for the meeting bot |
| `segments` | Segment[] | Yes | Array of meeting segments |

#### Segment Object Structure
```typescript
interface Segment {
  timestamp: string;        // Format: "HH:MM:SS"
  speaker?: string;        // Optional speaker name
  description: string;     // Description of the segment
  title?: string;         // Optional segment title
}
```

### Returns
A markdown-formatted list of segments with direct links to each moment in the meeting.

### Example Usage

```typescript
const segments = await shareMeetingSegments({
  botId: "abc123",
  segments: [
    {
      timestamp: "00:00:00",
      title: "Meeting Start",
      speaker: "John Doe",
      description: "Introduction and agenda overview"
    },
    {
      timestamp: "00:15:30",
      title: "Q1 Results",
      speaker: "Jane Smith",
      description: "Financial performance review"
    },
    {
      timestamp: "00:45:20",
      title: "Product Updates",
      speaker: "Mike Johnson",
      description: "New feature announcements"
    }
  ]
});
```

### Output Format
```markdown
## Meeting Segments

1. 🎯 **Meeting Start** (00:00:00)
   👤 John Doe
   📝 Introduction and agenda overview
   🔗 [Jump to segment](https://meetingbaas.com/viewer/abc123?t=0)

2. 📊 **Q1 Results** (00:15:30)
   👤 Jane Smith
   📝 Financial performance review
   🔗 [Jump to segment](https://meetingbaas.com/viewer/abc123?t=930)

3. 🚀 **Product Updates** (00:45:20)
   👤 Mike Johnson
   📝 New feature announcements
   🔗 [Jump to segment](https://meetingbaas.com/viewer/abc123?t=2720)
```

## Best Practices

1. **Timestamps**: Always use the HH:MM:SS format for consistency
2. **Descriptions**: Keep descriptions concise but informative
3. **Titles**: Use clear, descriptive titles that indicate the content
4. **Segments**: When creating segments, ensure they follow a logical flow
5. **Speaker Names**: Use full names for better clarity and searchability

## Tips for Effective Link Sharing

- Use timestamps strategically to point to the exact moment of important discussions
- Include relevant context in descriptions to help viewers understand the content
- Group related segments together when sharing multiple links
- Consider your audience when writing descriptions and choosing segments to share
- Use titles that make it easy to find specific content later


---

## Meeting Tools

Comprehensive APIs and tools for managing automated meeting bots, including recording, transcription, and real-time audio streaming capabilities

### Source: ./content/docs/mcp-servers/meeting-mcp/tools/meeting-tools.mdx


Meeting Tools provide a powerful set of APIs for managing automated meeting bots that can join, record, and transcribe video conferences. These tools enable seamless integration of meeting automation capabilities into your applications.

## Core Features
- Automated meeting recording
- Real-time transcription
- Customizable bot appearance and behavior
- Support for multiple speech-to-text providers
- Audio streaming capabilities
- Meeting data retrieval and management

## API Reference

### createBot

Creates an intelligent meeting bot that can join video conferences to record and transcribe meetings.

```typescript
interface CreateBotParams {
  meeting_url: string;              // Required: URL of the meeting to join
  name?: string;                    // Optional: Custom name for the bot
  botImage?: string;               // Optional: URL to bot's avatar image
  entryMessage?: string;           // Optional: Message bot sends when joining
  deduplicationKey?: string;       // Optional: Override 5-minute same meeting restriction
  nooneJoinedTimeout?: number;     // Optional: Timeout (seconds) if no one joins
  waitingRoomTimeout?: number;     // Optional: Timeout (seconds) if stuck in waiting room
  speechToTextProvider?: 'Gladia' | 'Runpod' | 'Default';  // Optional: Transcription provider
  speechToTextApiKey?: string;     // Optional: API key for speech-to-text service
  streamingInputUrl?: string;      // Optional: WebSocket URL for audio input
  streamingOutputUrl?: string;     // Optional: WebSocket URL for audio output
  streamingAudioFrequency?: '16khz' | '24khz';  // Optional: Audio streaming frequency
  extra?: {                        // Optional: Additional meeting metadata
    meetingType?: string;
    customSummaryPrompt?: string;
    searchKeywords?: string[];
    [key: string]: any;
  };
}
```

**Returns:**
```typescript
interface BotResponse {
  botId: string;
  status: 'joined' | 'waiting' | 'failed';
  meetingId: string;
  joinTime: string;
}
```

### getBots

Retrieves a list of all active bots and their associated meetings.

**Returns:**
```typescript
interface BotsResponse {
  bots: Array<{
    botId: string;
    meetingId: string;
    status: string;
    joinTime: string;
    meetingUrl: string;
  }>;
}
```

### getBotsByMeeting

Retrieves all bots associated with a specific meeting URL.

```typescript
interface GetBotsByMeetingParams {
  meetingUrl: string;  // Required: URL of the meeting to query
}
```

**Returns:**
```typescript
interface MeetingBotsResponse {
  bots: Array<{
    botId: string;
    status: string;
    joinTime: string;
  }>;
}
```

### getRecording

Retrieves detailed recording information for a specific bot/meeting.

```typescript
interface GetRecordingParams {
  botId: string;  // Required: ID of the bot that made the recording
}
```

**Returns:**
```typescript
interface RecordingResponse {
  recordingId: string;
  duration: number;
  status: 'in-progress' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: string;
}
```

### getRecordingStatus

Checks the current status of an in-progress recording.

```typescript
interface RecordingStatusParams {
  recordingId: string;  // Required: ID of the recording to check
}
```

**Returns:**
```typescript
interface RecordingStatusResponse {
  status: 'in-progress' | 'completed' | 'failed';
  progress?: number;
  errorMessage?: string;
}
```

### getMeetingData

Retrieves comprehensive transcript and recording data for a specific meeting.

```typescript
interface GetMeetingDataParams {
  meetingId: string;  // Required: ID of the meeting to retrieve data for
}
```

**Returns:**
```typescript
interface MeetingDataResponse {
  meetingId: string;
  duration: number;
  transcriptSegments: number;
  participants: string[];
  recording: {
    downloadUrl: string;
    size: number;
    format: string;
  };
  transcript: {
    segments: Array<{
      speaker: string;
      text: string;
      startTime: number;
      endTime: number;
    }>;
  };
}
```

### getMeetingDataWithCredentials

Retrieves meeting data using direct API authentication credentials.

```typescript
interface GetMeetingDataWithCredentialsParams {
  meetingId: string;  // Required: ID of the meeting
  apiKey: string;     // Required: API key for authentication
}
```

**Returns:** Same as `getMeetingDataResponse`

## Best Practices

1. **Bot Naming**: Use descriptive names that help identify the bot's purpose (e.g., "Sales-Meeting-Recorder").

2. **Timeouts**: Set appropriate timeout values based on your meeting context:
   - `nooneJoinedTimeout`: Recommended 300 seconds (5 minutes)
   - `waitingRoomTimeout`: Recommended 180 seconds (3 minutes)

3. **Speech-to-Text Providers**:
   - Default: Best for general purpose transcription
   - Gladia: Optimized for multiple languages
   - Runpod: Best for high-accuracy technical content

4. **Audio Streaming**:
   - Use 16kHz for standard quality
   - Use 24kHz for high-quality audio requirements

5. **Deduplication**:
   - Use `deduplicationKey` when you need multiple bots in the same meeting
   - Generate unique keys to bypass the 5-minute restriction

## Error Handling

Common error scenarios and recommended handling:

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

- `MEETING_NOT_FOUND`: Verify the meeting URL is correct and accessible
- `BOT_JOIN_FAILED`: Check waiting room settings and meeting permissions
- `INVALID_CREDENTIALS`: Verify API key and authentication
- `RECORDING_FAILED`: Check storage capacity and network connectivity

## Rate Limits

- Standard tier: 10 requests per minute
- Premium tier: 100 requests per minute
- Enterprise tier: Custom limits available

## Security Considerations

1. Always store API keys securely
2. Use environment variables for sensitive credentials
3. Implement proper access controls for recording downloads
4. Monitor bot activity for unauthorized access
5. Regular audit of active bots and recordings

## Examples

### Creating a Basic Meeting Bot

```typescript
const response = await createBot({
  meeting_url: "https://meeting-url.com/123",
  name: "Meeting Recorder",
  nooneJoinedTimeout: 300,
  speechToTextProvider: "Default"
});
```

### Advanced Bot with Custom Configuration

```typescript
const response = await createBot({
  meeting_url: "https://meeting-url.com/123",
  name: "Sales Meeting Bot",
  botImage: "https://your-domain.com/bot-avatar.png",
  entryMessage: "Hello! I'm here to record the meeting.",
  speechToTextProvider: "Gladia",
  speechToTextApiKey: "your-api-key",
  extra: {
    meetingType: "sales",
    customSummaryPrompt: "Focus on action items and deal values",
    searchKeywords: ["proposal", "pricing", "follow-up"]
  }
});
```


---

## QR Code Tools

Tools and APIs for generating customizable, AI-powered QR codes that can be used as bot avatars or for sharing meeting links and contact information

### Source: ./content/docs/mcp-servers/meeting-mcp/tools/qr-code-tools.mdx


The `generateQRCode` tool creates AI-powered, visually appealing QR codes that can be used as bot avatars or for general purposes. These QR codes are not just functional but also aesthetically pleasing, combining art with utility.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|-----------|
| `type` | string | The type of QR code content. Options: `url`, `email`, `phone`, `sms`, `text` | Yes |
| `to` | string | The destination content for the QR code (e.g., URL, email address, phone number, or text) | Yes |
| `prompt` | string | AI generation prompt to customize the QR code's appearance (max 1000 characters) | Yes |
| `style` | string | Visual style of the QR code. Options: `style_default`, `style_dots`, `style_rounded`, `style_crystal` | Yes |
| `useAsBotImage` | boolean | Whether to set the generated QR code as the bot's avatar image (default: `true`) | No |
| `template` | string | Template ID for pre-defined QR code designs (optional) | No |
| `apiKey` | string | Your QR Code AI API key. If not provided, system default will be used | No |

### API Key Integration

You can provide your API key in two ways:
1. Through the `apiKey` parameter
2. Directly in the prompt by including phrases like "API key: qrc_your_key" or "Using API key: qrc_your_key"

### Returns

- A URL to the generated QR code image
- The image URL is compatible with other tools like `joinMeeting`
- The generated QR code is both scannable and visually appealing

### Style Guide

Each style option offers unique visual characteristics:
- `style_default`: Classic QR code appearance with AI-enhanced elements
- `style_dots`: Circular patterns for a modern, softer look
- `style_rounded`: Smooth corners and flowing design
- `style_crystal`: Crystalline structure with reflective effects

### Examples

#### Basic Usage
```bash
Generate a QR code with my email lazare@spoke.app that looks like a Tiger in crystal style
```

#### With API Key in Prompt
```bash
Generate a QR code for my website https://example.com that looks like a mountain landscape. Use API key: qrc_my-personal-api-key-123456
```

#### Formal Parameter Structure
```bash
Generate a QR code with the following parameters:
- Type: email
- To: john.doe@example.com
- Prompt: Create a QR code that looks like a mountain landscape
- Style: style_rounded
- API Key: qrc_my-personal-api-key-123456
```

### Best Practices

1. **Prompts**
   - Be specific about the desired visual elements
   - Include color preferences if any
   - Mention any specific themes or moods

2. **Testing**
   - Always test the QR code with multiple devices
   - Ensure sufficient contrast for scanning
   - Verify the encoded information is correct

3. **Design Considerations**
   - Choose styles that match your brand identity
   - Consider the scanning environment
   - Balance aesthetics with functionality

### Limitations

- Maximum prompt length: 1000 characters
- Image format: PNG
- Resolution: Up to 1024x1024 pixels
- API rate limits may apply based on your key type

### Security Notes

- Never share your API key publicly
- Use environment variables for API keys in production
- Regularly rotate API keys for security

For more information and support, visit our [API documentation](https://docs.qrcode-ai.com).


---

## Tools

Available tools and example workflows for Meeting MCP

### Source: ./content/docs/mcp-servers/meeting-mcp/tools/tools.mdx


## Available Tools

The Meeting MCP server exposes several tools through the MCP protocol:

<Accordions>
  <Accordion title="Calendar Tools" icon={<Calendar />} defaultOpen>
    - **oauthGuidance**: Get step-by-step instructions for setting up OAuth
    - **listRawCalendars**: List available calendars before integration
    - **setupCalendarOAuth**: Integrate a calendar using OAuth credentials
    - **listCalendars**: List all integrated calendars
    - **getCalendar**: Get detailed information about a specific calendar
    - **deleteCalendar**: Remove a calendar integration
    - **resyncAllCalendars**: Force a refresh of all connected calendars
    - **listUpcomingMeetings**: List upcoming meetings from a calendar
    - **listEvents**: List calendar events with filtering options
    - **getEvent**: Get detailed information about a specific event
    - **scheduleRecording**: Schedule a bot to record an upcoming meeting
    - **cancelRecording**: Cancel a previously scheduled recording
    - **checkCalendarIntegration**: Diagnose calendar integration issues
  </Accordion>

  <Accordion title="Meeting Tools" icon={<Video />}>
    - **createBot**: Create a meeting bot that can join video conferences
    - **getBots**: List all bots and their associated meetings
    - **getBotsByMeeting**: Get bots for a specific meeting URL
    - **getRecording**: Retrieve recording information
    - **getRecordingStatus**: Check the status of a recording
    - **getMeetingData**: Get transcript and recording data
  </Accordion>

  <Accordion title="Transcript Tools" icon={<FileText />}>
    - **getMeetingTranscript**: Get a complete meeting transcript with speaker information
    - **findKeyMoments**: Automatically identify important moments in a meeting
  </Accordion>

  <Accordion title="QR Code Tools" icon={<QrCode />}>
    - **generateQRCode**: Create an AI-generated QR code image for use as a bot avatar
  </Accordion>

  <Accordion title="Link Sharing Tools" icon={<Link />}>
    - **shareableMeetingLink**: Generate a formatted, shareable link to a recording
    - **shareMeetingSegments**: Create links to multiple important moments
  </Accordion>
</Accordions>

## QR Code API Key Configuration

The QR code generator tool requires an API key from [QR Code AI API](https://www.qrcode-ai-api.com/). There are several ways to provide this:

1. **Directly in the prompt**: Include your API key in the prompt when using the `generateQRCode` tool
2. **As a parameter**: Provide your API key as the `apiKey` parameter
3. **Environment variable**: Set the `QRCODE_API_KEY` environment variable
4. **Claude Desktop config**: Add the API key to your Claude Desktop configuration file

## Example Workflows

<Tabs>
  <Tab title="Recording a Meeting" value="recording">
```
# Create a bot for a meeting
"Create a bot for my Zoom meeting at https://zoom.us/j/123456789"

# Check recording status
"What's the status of my meeting recording for the Zoom call I started earlier?"
```
  </Tab>

  <Tab title="Calendar Integration" value="calendar">
```
# Get OAuth guidance
"I want to integrate my Google Calendar. How do I get OAuth credentials?"

# Set up calendar integration
"Integrate my Google Calendar using these credentials:
- Platform: Google
- Client ID: my-client-id-123456789.apps.googleusercontent.com
- Client Secret: my-client-secret-ABCDEF123456
- Refresh Token: my-refresh-token-ABCDEF123456789
- Raw Calendar ID: primary@gmail.com"

# View upcoming meetings
"Show me my upcoming meetings from calendar 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"

# Schedule recording
"Schedule a recording for my team meeting with event ID 7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d"
```
  </Tab>

  <Tab title="Analyzing Content" value="analyzing">
```
# Get a meeting transcript
"Get the transcript from my team meeting with bot ID abc-123"

# Find key moments
"Identify key moments from yesterday's product planning meeting with bot ID xyz-456"

# Share a specific moment
"Create a shareable link to the part of meeting abc-123 at timestamp 12:45 where John was talking about the budget"
```
  </Tab>

  <Tab title="QR Code Generation" value="qrcode">
```
# Generate a QR code with contact information
"Generate a QR code with the following parameters:
- Type: email
- To: john.doe@company.com
- Prompt: Create a professional-looking QR code with abstract blue patterns
- Style: style_crystal"

# Use as a bot avatar
"Join my Zoom meeting at https://zoom.us/j/123456789 with the following parameters:
- Bot name: QR Code Assistant
- Bot image: [URL from the generated QR code]
- Entry message: Hello everyone, scan my avatar to get my contact information."
```
  </Tab>
</Tabs>


---

## Transcript Tools

Tools and APIs for managing meeting transcripts, including retrieval, analysis, speaker identification, and key moment extraction capabilities

### Source: ./content/docs/mcp-servers/meeting-mcp/tools/transcript-tools.mdx


Transcript Tools provide powerful capabilities for accessing, analyzing, and extracting insights from meeting recordings. These tools help you make the most of your meeting content through automated transcription and intelligent analysis.

## getMeetingTranscript

A powerful tool that retrieves complete meeting transcripts with speaker identification and organized content structure.

### Parameters

- `botId` (required): String - The unique identifier of the bot that recorded the meeting
- `format` (optional): String - Output format preference ("text" or "json", defaults to "text")

### Returns

Returns a formatted transcript that includes:
- Meeting metadata (title, duration, date)
- Complete conversation content organized by speaker
- Timestamps for each segment
- Speaker-separated paragraphs for improved readability

### Example Output

```text
Meeting: "Weekly Product Sync"
Date: 2024-03-15
Duration: 45m 30s

Transcript:

John Smith (09:00:00 AM):
Hello everyone, thanks for joining today's call. We have a lot to cover regarding 
the Q3 roadmap and our current progress on the platform redesign.

Sarah Johnson (09:00:45 AM):
Thanks John. I've prepared some slides about the user testing results we got back 
yesterday. The feedback was generally positive but there are a few areas we need 
to address.
```

### Usage Notes

- Transcripts are automatically processed for accuracy and clarity
- Speaker identification is based on voice recognition and meeting participant data
- Supports multiple output formats for integration with other tools
- Can handle meetings of any duration

## findKeyMoments

An AI-powered tool that automatically identifies and extracts significant moments from meeting recordings, making it easy to review and share important discussions.

### Parameters

- `botId` (required): String - The unique identifier of the bot that recorded the meeting
- `meetingTitle` (optional): String - Filter for a specific meeting by title
- `topics` (optional): Array String - List of specific topics to search for
- `maxMoments` (optional): Number - Maximum number of key moments to return (default: 10)
- `minConfidence` (optional): Number - Minimum confidence score for moment detection (0-1, default: 0.7)

### Returns

Returns a markdown-formatted list of key moments including:
- Timestamp with clickable links
- Context description
- Speaker information
- Confidence score
- Topic categorization

### Example Output

```markdown
## Key Moments - Product Strategy Meeting

1. 🎯 Product Roadmap Discussion [09:05:23]
   - Speaker: John Smith
   - "We're prioritizing the mobile experience for Q3, with a focus on 
     performance improvements"
   - Confidence: 0.95
   - [Jump to moment](meeting-link#t=545)

2. 📊 User Testing Results [09:15:45]
   - Speaker: Sarah Johnson
   - "Our latest usability tests showed an 85% satisfaction rate with the new UI"
   - Confidence: 0.89
   - [Jump to moment](meeting-link#t=945)
```

### Features

- **AI-Powered Analysis**: Uses advanced natural language processing to identify:
  - Decision points
  - Action items
  - Important announcements
  - Key discussions
  - Questions and answers

- **Smart Topic Detection**: Automatically categorizes moments into relevant topics
  - Product updates
  - Technical discussions
  - Team decisions
  - Action items
  - Project milestones

- **Customizable Detection**: 
  - Adjust sensitivity for moment detection
  - Filter by specific topics or speakers
  - Set custom importance thresholds

### Integration Capabilities

Both tools support integration with:
- Meeting platforms (Zoom, Teams, Google Meet)
- Project management tools
- Knowledge bases
- Team collaboration platforms

### Best Practices

1. **For Optimal Transcription**:
   - Ensure good audio quality
   - Ask speakers to identify themselves
   - Use noise-canceling when possible

2. **For Key Moment Detection**:
   - Provide relevant topics for more focused results
   - Set appropriate confidence thresholds
   - Review and validate automated selections

3. **For Data Management**:
   - Regularly archive transcripts
   - Set up appropriate access controls
   - Follow data retention policies


---

## Updates

Latest updates, improvements, and changes to the Model Context Protocol (MCP) servers

### Source: ./content/docs/mcp-servers/updates/index.mdx



---

## Features

Core features and capabilities of Vercel MCP for Meeting BaaS

### Source: ./content/docs/mcp-servers/vercel-mcp/features.mdx


## Core Features

<Card title="Technical Architecture" icon="code">
  Built on top of the official Meeting BaaS TypeScript SDK (`@meeting-baas/sdk`), providing:

  - **Type Safety**: Complete TypeScript definitions for all API interactions
  - **Auto-Updates**: Synchronized with the latest OpenAPI specifications
  - **Cross-Platform Support**: Unified interface for Google Meet, Zoom, and Microsoft Teams
  - **Pre-built MCP Tools**: Ready-to-use AI system integrations
  - **Comprehensive API Access**: Type-safe functions for the entire Meeting BaaS API surface
</Card>

## Advanced Capabilities

### Meeting Management

<Cards>
  <Card title="Real-time Participation" icon="users">
    - Seamless meeting joining and leaving
    - Dynamic participant management
    - Real-time status updates
  </Card>

  <Card title="Recording & Transcription" icon="video">
    - Automated meeting recording
    - Real-time transcription services
    - Secure storage and retrieval
  </Card>

  <Card title="Bot Persona Management" icon="robot">
    - Customizable bot personalities
    - Context-aware responses
    - Dynamic behavior adaptation
  </Card>

  <Card title="Resource Optimization" icon="gauge">
    - Automatic resource cleanup
    - Performance monitoring
    - Usage optimization
  </Card>
</Cards>

### Calendar Integration

<Cards>
  <Card title="Multi-Platform Support" icon="calendar">
    - Google Calendar integration
    - Microsoft Outlook support
    - Other major calendar platforms
  </Card>

  <Card title="Smart Scheduling" icon="clock">
    - AI-powered scheduling automation
    - Conflict detection and resolution
    - Timezone-aware scheduling
  </Card>

  <Card title="Event Management" icon="calendar-check">
    - Real-time event updates
    - Attendee management
    - Resource allocation
  </Card>

  <Card title="Configuration" icon="gear">
    - Cross-platform sync
    - Custom scheduling rules
    - Integration preferences
  </Card>
</Cards>

### Bot Management

<Cards>
  <Card title="Monitoring & Analytics" icon="chart-line">
    - Real-time performance metrics
    - Usage statistics
    - Health monitoring
    - Automated alerts
  </Card>

  <Card title="Metadata Tracking" icon="database">
    - Detailed interaction logs
    - Performance analytics
    - Usage patterns
    - Error tracking
  </Card>

  <Card title="Dynamic Configuration" icon="sliders">
    - Real-time config updates
    - Feature toggles
    - Behavior customization
    - Environment-specific settings
  </Card>

  <Card title="Performance" icon="bolt">
    - Resource optimization
    - Load balancing
    - Caching strategies
    - Response time optimization
  </Card>
</Cards>


---

## Overview

Introduction to enterprise-grade Model Context Protocol server for Meeting BaaS

### Source: ./content/docs/mcp-servers/vercel-mcp/overview.mdx


MCP on Vercel is an enterprise-grade [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) server that powers the [chat.meetingbaas.com](https://chat.meetingbaas.com) platform. Built as an enhanced fork of the Vercel MCP template, it provides comprehensive Meeting BaaS integration for advanced meeting automation, AI-powered interactions, and intelligent meeting management.

<Card
  icon={<Github />}
  title="GitHub Repository"
  href="https://github.com/Meeting-Baas/mcp-on-vercel"
  description="Access the source code to deploy your own customized MCP server"
  external
/>

## Core Features

<Cards>
  <Card
    title="Meeting BaaS SDK Integration"
    icon={<Code className="text-blue-400" />}
  >
    Seamless integration with the TypeScript SDK providing type-safe access to all Meeting BaaS features including video management, bot control, and meeting automation.
  </Card>
  <Card
    title="Advanced Bot Management"
    icon={<MessageSquare className="text-green-400" />}
  >
    Comprehensive tools for deploying and managing AI-powered speaking agents with customizable personas, real-time transcription, and dynamic interaction capabilities.
  </Card>
  <Card
    title="Intelligent Calendar Integration"
    icon={<Calendar className="text-purple-400" />}
  >
    Smart calendar management with automated meeting scheduling, recording controls, and AI-assisted event organization across multiple platforms.
  </Card>
  <Card
    title="Enterprise-Ready Architecture"
    icon={<Cloud className="text-teal-400" />}
  >
    Built for scale with Vercel's serverless infrastructure, featuring Redis-backed session management, fluid compute optimization, and cross-platform compatibility.
  </Card>
</Cards>

## System Requirements

**Required Components:**
- Vercel account with deployment access
- Meeting BaaS API key
- Redis instance (for session state management)
- Node.js v16 or higher (for local development)

**Recommended Setup:**
- Vercel Pro/Enterprise account for extended compute capabilities
- Redis instance in the same region as your Vercel deployment
- Fluid Compute enabled for optimal performance

## Contributing

This project is maintained as an enhanced fork of the [original Vercel MCP template](https://github.com/vercel-labs/mcp-on-vercel). Contributions are welcome through pull requests and issues on our repository.

<Callout type="info">
  For production deployments, we recommend subscribing to our release notifications
  to stay updated with the latest security patches and feature enhancements.
</Callout>


---

## Tools

Technical details, deployment guides, and integration tools for Vercel MCP

### Source: ./content/docs/mcp-servers/vercel-mcp/tools.mdx


## Deployment Guide

<Tabs>
  <Tab title="One-Click Deploy" value="one-click">
    Deploy directly to Vercel with minimal configuration:
    
    <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMeeting-Baas%2Fmcp-on-vercel&env=REDIS_URL&envDescription=Redis%20URL%20for%20session%20management" target="_blank">
      <img src="https://vercel.com/button" alt="Deploy with Vercel" />
    </a>
    
    **Required Configuration:**
    1. Redis URL for session management
    2. Meeting BaaS API key (optional for development)
    3. Enable Fluid Compute in project settings
    4. Configure max duration in `vercel.json` (Pro/Enterprise)

  </Tab>
  <Tab title="Manual Deployment" value="manual">
    For customized deployment with full control:
    
    ```bash
    # Clone the repository
    git clone https://github.com/Meeting-Baas/mcp-on-vercel.git
    cd mcp-on-vercel
    
    # Install dependencies
    npm install
    
    # Configure environment
    cp .env.example .env
    # Edit .env with required credentials
    
    # Deploy
    npx vercel --prod
    ```

    **Post-Deployment Steps:**
    1. Configure environment variables in Vercel dashboard
    2. Enable Fluid Compute
    3. Adjust compute settings for your usage tier
    4. Set up monitoring and alerts

  </Tab>
</Tabs>

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|----------|
| `REDIS_URL` | Yes | Redis instance URL | `redis://user:pass@host:port` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `LOG_LEVEL` | No | Logging verbosity | `info`, `debug`, `error` |
| `BAAS_API_KEY` | Dev only | Meeting BaaS API key | `mbk_xxxx...` |

### Authentication Methods

The server supports multiple authentication approaches in order of precedence:

1. **HTTP Headers:**
   ```http
   x-meeting-baas-api-key: your-api-key
   x-meetingbaas-apikey: your-api-key
   x-api-key: your-api-key
   Authorization: Bearer your-api-key
   ```

2. **Request Body (POST):**
   ```json
   {
     "apiKey": "your-api-key"
   }
   ```

3. **Environment Variable (Development):**
   ```bash
   BAAS_API_KEY=your-api-key
   ```

<Callout type="warning">
  Production deployments should use header or body authentication methods. Environment
  variable authentication is restricted to development environments only.
</Callout>

## Integration Guide

### Claude Desktop Integration

Configure your MCP server in Claude Desktop:

1. Navigate to Settings > Model Context Protocol
2. Add new MCP Server with:
   ```yaml
   Name: Meeting BaaS MCP
   URL: [Your Vercel Deployment URL]
   Headers:
     x-api-key: [Your Meeting BaaS API Key]
   ```

### Custom Development

Extend the server's capabilities:

1. **Tool Customization:**
   - Modify `/lib/tools` for custom Meeting BaaS integrations
   - Add new tool definitions in `api/server.ts`

2. **Prompt Engineering:**
   - Update `/lib/prompts` for specialized use cases
   - Configure context handling in `api/server.ts`

3. **Testing:**
   ```bash
   # Start development server
   npm run dev

   # Run test client
   node scripts/test-client.mjs http://localhost:3000
   ```


---

## Acknowledgements

Core services powering the speaking bot

### Source: ./content/docs/speaking-bots/acknowledgements.mdx


[Pipecat](https://github.com/pipecat-ai/pipecat) and [MeetingBaas](https://meetingbaas.com) both do the heavy lifting of powering the speaking bot - but the project requires many other core services to function.

As you can see in the technologies used below, speaking bots can connect to external services for pinging weather data or timezone information.

<Accordions>
  <Accordion title="Core Services">
    - [Pipecat](https://github.com/pipecat-ai/pipecat):
      Python framework powering real-time audio processing pipeline
    
    - [MeetingBaas](https://meetingbaas.com):
      Meeting bot deployment API for Google Meet, Microsoft Teams, and Zoom
    
    - [Ngrok](https://ngrok.com):
      Local development tunneling for WebSocket connections
  </Accordion>

{" "}

<Accordion title="Speech Services">
    - [Cartesia](https://cartesia.ai):
      Text-to-speech service for bot voice synthesis

    - [Deepgram](https://deepgram.com):
      Primary speech-to-text service for real-time transcription

    - [Gladia](https://gladia.io):
      Alternative speech-to-text provider with language recognition

</Accordion>

{" "}

<Accordion title="AI & Language Models">
  - [OpenAI](https://openai.com): GPT models for conversation generation

- [Silero VAD](https://github.com/snakers4/silero-vad): Voice activity
  detection

</Accordion>

{" "}

<Accordion title="Development Tools">
    - [Protocol Buffers](https://protobuf.dev): Data serialization for WebSocket
  communication

    - [Poetry](https://python-poetry.org): Python dependency management

    - [Loguru](https://github.com/Delgan/loguru): Structured logging

</Accordion>

  <Accordion title="Additional Services">
    - [wttr.in](https://wttr.in):
      Weather data API
    
    - [pytz](https://pythonhosted.org/pytz):
      Timezone database
  </Accordion>
</Accordions>


---

## Command line usage

Complete command-line interface options for launching Speaking Bots

### Source: ./content/docs/speaking-bots/command-line.mdx


## Basic Usage

```bash
poetry run python scripts/batch.py [options]
```

## Core Options

| Option             | Description                      | Required | Default | Example                                              |
| ------------------ | -------------------------------- | -------- | ------- | ---------------------------------------------------- |
| `-c, --count`      | Number of bot instances          | Yes      | -       | `-c 2`                                               |
| `--meeting-url`    | Video meeting URL to join        | Yes      | -       | `--meeting-url https://meet.google.com/xxx-yyyy-zzz` |
| `--personas`       | Space-separated list of personas | No       | Random  | `--personas baas_onboarder arctic_prospector`        |
| `-s, --start-port` | Starting port for services       | No       | 8765    | `--start-port 8765`                                  |
| `--add-recorder`   | Add recording-only bot           | No       | False   | `--add-recorder`                                     |

## Example Commands

### Basic Bot Launch

```bash
poetry run python scripts/batch.py -c 1 --meeting-url LINK
```

### Multiple Bots with Specific Personas

```bash
poetry run python scripts/batch.py -c 2 --meeting-url LINK --personas baas_onboarder arctic_prospector
```

### Additional "passive" bot with recording

```bash
poetry run python scripts/batch.py -c 1 --meeting-url LINK --add-recorder
```

## Technical Details

### Port Allocation

- Each bot requires 2 consecutive ports:
  - Bot process: port N
  - Proxy process: port N+1
- Default starting port: 8765
- Example with 2 bots:
  - Bot 1: 8765 (bot), 8766 (proxy)
  - Bot 2: 8767 (bot), 8768 (proxy)

### Persona Selection

- If specific personas provided: uses them in order
- If not enough personas specified: fills with random selections
- Validates persona existence before launch
- Avoids duplicate personas when possible
- Logs selected persona names and prompts

### Interactive Controls

- Press Enter: Add more bots with same configuration. You might be blocked by the default deduplication key settings.
- Ctrl+C: Graceful shutdown of all processes

### Error Handling

- URL validation (must start with https://)
- Port availability checking
- Process monitoring and auto-recovery
- Ngrok tunnel management
- Graceful resource cleanup

### Process Management

- Automatic ngrok tunnel creation
- Process output logging
- Auto-cleanup on shutdown
- Graceful termination of all components


---

## Environment Variables

Configure environment variables for Speaking Bots

### Source: ./content/docs/speaking-bots/getting-started/environment-variables.mdx


Speaking Bots requires several API keys and configuration values to function properly. Here's a quick setup guide:

1. Copy the example environment file:

```bash
cp .env.example .env
```

{" "}

<Callout type="warn">
  Never commit your `.env` file to version control. It contains sensitive API
  keys that should be kept private.
</Callout>

2. Add your credentials to `.env`: You'll need 4 required API keys for core functionality (MeetingBaas, OpenAI, Speech-to-Text, and Text-to-Speech). Additional keys can be added later for optional features.

## Core Bot Functionality (Required)

<Steps>
<Step>
### MeetingBaas Configuration

Required for sending meeting bots as personas to various platforms:

```txt
MEETING_BAAS_API_KEY=your_meetingbaas_api_key_here
```

Get your API key by:

1. Signing up for [MeetingBaas](https://meetingbaas.com)
2. Accessing your API key from the MeetingBaas dashboard

</Step>

<Step>
### OpenAI Configuration

Powers in-meeting AI interactions and persona management:

```txt
OPENAI_API_KEY=your_openai_api_key_here
```

<Callout>
  This key is used both for in-meeting interactions and persona creation functionality.
</Callout>
</Step>

<Step>
### Speech-to-Text Configuration

Choose one of the following options:

#### Option 1: Deepgram

```txt
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

#### Option 2: Gladia

```txt
GLADIA_API_KEY=your_gladia_api_key_here
```

</Step>

<Step>
### Text-to-Speech Configuration

Required for voice synthesis and persona voices:

```txt
CARTESIA_API_KEY=your_cartesia_api_key_here
CARTESIA_VOICE_ID="79a125e8-cd45-4c13-8a67-188112f4dd22"
```

</Step>
</Steps>

## Optional Features

### Multiple Bots Support

<Steps>
<Step>
Required for running multiple bots in local development:
```txt
NGROK_AUTHTOKEN=your_ngrok_auth_token_here
```

<Callout>
  Follow our [Ngrok Setup Guide](/docs/speaking-bots/getting-started/ngrok-setup) to get your auth token.
</Callout>
</Step>
</Steps>

### Persona Creation

<Steps>
  <Step>Required for AI image generation and storage:</Step>
</Steps>


---

## Ngrok setup

We create ngrok tunnel(s) for running several bots at once on your local machine

### Source: ./content/docs/speaking-bots/getting-started/ngrok-setup.mdx


## Local Setup

For running one or more bots locally, you'll need an ngrok authtoken. Follow these steps:

1. Sign up for a free account at [ngrok.com](https://dashboard.ngrok.com/signup)
2. After signing up, get your authtoken from the [Your Authtoken page](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Add the token to your `.env` file or set it as an environment variable:

```bash
NGROK_AUTHTOKEN=your_ngrok_auth_token_here
```

That's it folks :)

<Accordions>
  <Accordion title="Configuration modification">

We provide a ready-to-use configuration file in the repository at `config/ngrok/config.yml`. You can either use this file directly or create your own configuration.

The default location for the ngrok configuration file varies by operating system:

- Linux: `~/.config/ngrok/ngrok.yml`
- macOS: `~/Library/Application Support/ngrok/ngrok.yml`
- Windows: `%HOMEPATH%\AppData\Local\ngrok\ngrok.yml`

To verify your configuration file location, you can run:

```bash
ngrok config check
```

If you want to create or edit your own configuration file, here's what it should contain:

```yaml
version: '3'
agent:
  authtoken: YOUR_AUTH_TOKEN

tunnels:
  proxy1:
    proto: http
    addr: 8766
  proxy2:
    proto: http
    addr: 8768
```

For more detailed information about ngrok configuration options, see the [official ngrok configuration documentation](https://ngrok.com/docs/agent/config/).

## Usage

This sets up two separate tunnels (proxy1 and proxy2) that will be used by your bots to establish WebSocket connections with the meeting platforms. To start both tunnels simultaneously, run:

```bash
ngrok start --all --config config/ngrok/config.yml
```

The free tier of ngrok limits you to 2 concurrent tunnels, which means you can run up to 2 bots simultaneously in local development mode.

  </Accordion>
</Accordions>

## WebSocket URL Resolution

When running the server in local development mode, it will automatically detect and use your ngrok URLs. The server determines the WebSocket URL to use in the following priority order:

1. User-provided URL in the request (if specified in the `websocket_url` field)
2. `BASE_URL` environment variable (recommended for production)
3. ngrok URL in local development mode
4. Auto-detection from request headers (fallback, not reliable in production)

To use local development mode with automatic ngrok detection:

```bash
# Start the API server with local development mode enabled
poetry run python run.py --local-dev
```

## Troubleshooting WebSocket Connections

### Common Issues

1. **Timing Issues with ngrok and Meeting Baas Bots**

   Sometimes, due to WebSocket connection delays through ngrok, the Meeting Baas bots may join the meeting before your local bot connects. If this happens:

   - Simply press `Enter` to respawn your bot
   - This will reinitiate the connection and allow your bot to join the meeting

2. **Connection failures**
   - Make sure ngrok is running with the correct configuration
   - Verify that you've entered the correct ngrok URLs when prompted
   - Check that your ngrok URLs are accessible (try opening in a browser)
   - Make sure you're using the `wss://` protocol with ngrok URLs

### Production Considerations

For production deployments, you should:

1. Set the `BASE_URL` environment variable to your server's public domain:
   ```
   export BASE_URL=https://your-server-domain.com
   ```
2. Ensure your server is accessible on the public internet
3. Consider using HTTPS/WSS for secure connections in production


---

## Set Up

Set up your development environment for Speaking Bots

### Source: ./content/docs/speaking-bots/getting-started/set-up.mdx


## Installation

### 0. Clone Repository

If you haven't already, clone the repository and navigate to it:

```bash
git clone https://github.com/Meeting-Baas/speaking-meeting-bot.git
cd speaking-meeting-bot
```

### 1. Prerequisites

- Python 3.11+
- `grpc_tools` for protocol buffer compilation
- Ngrok for local development (follow our [Ngrok Setup Guide](/docs/speaking-bots/getting-started/ngrok-setup))
- Poetry for dependency management

You'll also need system dependencies for scientific libraries:

```bash
# macOS (using Homebrew)
brew install llvm cython

# Ubuntu/Debian
sudo apt-get install llvm python3-dev cython

# Fedora/RHEL
sudo dnf install llvm-devel python3-devel Cython
```

### 2. Set Up Poetry Environment

```bash
# Install Poetry (Unix/macOS)
curl -sSL https://install.python-poetry.org | python3 -

# Install Poetry (Windows)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -

# Configure Poetry to use Python 3.11+
poetry env use python3.11

# Install dependencies with LLVM config path
# On macOS:
LLVM_CONFIG=$(brew --prefix llvm)/bin/llvm-config poetry install
# On Linux (path may vary):
# LLVM_CONFIG=/usr/bin/llvm-config poetry install

# Activate virtual environment
poetry shell
```

### 3. Compile Protocol Buffers

```bash
poetry run python -m grpc_tools.protoc --proto_path=./protobufs --python_out=./protobufs frames.proto
```

Protocol Buffers are used here by Pipecat to define a structured message format for real-time communication between components of the Speaking Bots system. Specifically, the [`frames.proto`](https://github.com/pipecat-ai/pipecat/blob/635aa6eb5bdee382729613b58279befdc5bc8eaf/src/pipecat/frames/frames.proto#L9) file defines three main message types:

1. `TextFrame`: For handling text-based messages
2. `AudioRawFrame`: For managing raw audio data with properties like sample rate and channels
3. `TranscriptionFrame`: For handling speech-to-text transcription results

Protocol Buffers is the backbone of consistent data serialization across services.
Read more in the [official Protocol Buffer documentation](https://protobuf.dev/downloads/) and [this Python Protocol Buffers tutorial](https://www.blog.pythonlibrary.org/2023/08/30/an-intro-to-protocol-buffers-with-python/).

### 4. Configure Environment

Create a `.env` file based on the template:

```bash
cp env.example .env
```

Edit the `.env` file with your API keys. You'll need:

**Required API Keys:**

- `MEETING_BAAS_API_KEY`: For meeting platform integration
- `OPENAI_API_KEY`: For the conversation LLM
- `CARTESIA_API_KEY`: For text-to-speech
- `GLADIA_API_KEY` or `DEEPGRAM_API_KEY`: For speech-to-text

For production, also set:

```
BASE_URL=https://your-server-domain.com
```

See our full [Environment Variables Guide](/docs/speaking-bots/getting-started/environment-variables) for more details.

### 5. Run the API Server

The project now follows an API-first approach. There are two ways to run the server:

```bash
# Standard mode
poetry run uvicorn app:app --reload --host 0.0.0.0 --port 8766

# Local development mode with ngrok auto-configuration
poetry run python run.py --local-dev
```

Once the server is running, you can access:

- Interactive API docs: `http://localhost:8766/docs`
- OpenAPI specification: `http://localhost:8766/openapi.json`

To create a bot via the API:

```bash
curl -X POST http://localhost:8766/run-bots \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_url": "https://meet.google.com/xxx-yyyy-zzz",
    "personas": ["interviewer"],
    "meeting_baas_api_key": "your-api-key"
  }'
```

You can also use our CLI tools for testing:

```bash
poetry run python scripts/batch.py -c 1 --meeting-url LINK
```

Follow our [Command Line Guide](/docs/speaking-bots/command-line) for more examples and options.


---

## Introduction

Deploy AI-powered speaking agents in video meetings

### Source: ./content/docs/speaking-bots/index.mdx


This small open-source API demonstrates the capabilities of [MeetingBaas](https://meetingbaas.com) 🐟's video meeting APIs by integrating with [Pipecat](https://github.com/pipecat-ai/pipecat)'s Python framework for building voice and multimodal conversational agents:

```bash
curl -X POST https://speaking.meetingbaas.com/bots \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_url": "https://us06web.zoom.us/j/123456789?pwd=example",
    "personas": ["baas_onboarder"],
    "meeting_baas_api_key": "your-api-key"
  }'
```

<Card
  icon={<Github />}
  title="Speaking Meeting Bot"
  href="https://github.com/Meeting-Baas/speaking-meeting-bot"
  description="Clone to customize and deploy your own meeting agents"
  external
/>

Our implementation creates AI meeting agents that can join and participate in Google Meet and Microsoft Teams meetings with distinct personalities and context defined in Markdown files.

It extends Pipecat's [WebSocket server implementation](https://github.com/pipecat-ai/pipecat/tree/main/examples/websocket-server) to create:

- Meeting agents that can join Google Meet, Zoom or Microsoft Teams through the [MeetingBaas API](https://meetingbaas.com)
- Customizable personas with unique context
- Support for running multiple instances locally or at scale

This api is launched using Docker and [fly.io](https://fly.io/).

## API Access

The Speaking Bot API is accessible at [speaking.meetingbaas.com](https://speaking.meetingbaas.com). You can access the OpenAPI specification directly for your LLM here: [speaking.meetingbaas.com/openapi.json](https://speaking.meetingbaas.com/openapi.json)

The API follows a minimalist design with sensible defaults while offering optional customization. A bot can be deployed with just a meeting URL and API key, but parameters are available for tailoring behavior:

The API includes features not explicitly defined in the routes documentation:

- WebSocket infrastructure for bidirectional audio streaming with selectable quality (16/24kHz)
- Persona system with custom voice selection, language preferences, and contextual knowledge
- Voice Activity Detection with configurable parameters for natural conversation
- Function calling tools (weather, time, etc.) that can be enabled or disabled
- LLM context management for consistent, coherent conversations

The join route supports options like custom bot names, avatar images, entry messages, and specialized persona selection.

The API and implementation are open source. We welcome contributions and pull requests from the community. See our [getting started guide](/docs/speaking-bots/getting-started/set-up) for local development setup.

## Directory Structure

<Files>
  <Folder name="config" description="Core configuration and persona management">
    <Folder name="personas" description="Persona definitions and behaviors">
      <Folder
        name="baas_onboarder"
        description="MeetingBaas API presentation persona"
      >
        <File
          name="README.md"
          description="Core persona definition and behavior"
        />
        <File
          name="Content.md"
          description="Knowledge and contextual information"
        />
        <File
          name="Rules.md"
          description="Interaction and behavior guidelines"
        />
      </Folder>
      <Folder
        name="noota_assistant"
        description="Noota software sales persona"
      />
      <Folder name="gladia_sales" description="Gladia API sales persona" />
    </Folder>
    <File
      name="persona_types.py"
      description="Data structures and type definitions for personas"
    />
    <File
      name="persona_utils.py"
      description="Persona management and utility functions"
    />
    <File name="prompts.py" description="Default prompts and system messages" />
    <File
      name="create_persona.py"
      description="Tools for creating new personas"
    />
    <File
      name="migrate_personas.py"
      description="Migration utilities for persona updates"
    />
  </Folder>
  <Folder
    name="meetingbaas_pipecat"
    description="Core bot functionality and communications"
  >
    <Folder name="bot" description="Bot implementation and behavior">
      <File
        name="bot.py"
        description="Main bot class and meeting interactions"
      />
      <File
        name="runner.py"
        description="Bot execution and lifecycle management"
      />
      <File name="__init__.py" />
    </Folder>
    <Folder
      name="proxy"
      description="Proxy handling for multiple bot instances"
    />
    <Folder name="utils" description="Shared utilities">
      <File name="logger.py" description="Logging configuration" />
      <File name="__init__.py" />
    </Folder>
    <File name="__init__.py" />
  </Folder>
  <Folder name="scripts" description="Command-line tools and utilities">
    <File
      name="meetingbaas.py"
      description="MeetingBaas API interaction script"
    />
    <File name="batch.py" description="Multiple bot deployment script" />
  </Folder>
</Files>


---

## Personas System

AI meeting participants with distinct personalities

### Source: ./content/docs/speaking-bots/personas.mdx


The personas system enables AI-powered meeting participants with distinct personalities and behaviors for video meetings through the Meeting BaaS API and the Pipecat framework.

## Directory Structure

<Files>
  <Folder name="config" description="Root configuration directory" defaultOpen>
    <Folder
      name="personas"
      description="Directory containing all persona definitions"
      defaultOpen
    >
      <Folder
        name="baas_onboarder"
        description="Example persona implementation"
        defaultOpen
      >
        <File
          name="README.md"
          description="Core persona definition and behavior"
        />
        <File
          name="Content.md"
          description="Knowledge and contextual information"
        />
        <File
          name="Rules.md"
          description="Interaction and behavior guidelines"
        />
      </Folder>
    </Folder>
    <File
      name="persona_types.py"
      description="Type definitions and data structures"
    />
    <File
      name="persona_utils.py"
      description="Helper functions and persona management"
    />
    <File
      name="migrate_personas.py"
      description="Tools for updating persona configurations"
    />
  </Folder>
</Files>

## Core Components

### PersonaData Class

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional

__all__ = ["Gender", "PersonaData"]

class Gender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    NON_BINARY = "NON-BINARY"

@dataclass
class PersonaData:
    """Core data structure for persona information"""
    name: str
    prompt: str
    additional_context: str = ""
    entry_message: str = ""
    characteristics: List[str] = field(default_factory=list)
    tone_of_voice: List[str] = field(default_factory=list)
    skin_tone: Optional[str] = None
    gender: Optional[Gender] = None
    relevant_links: List[str] = field(default_factory=list)
    language_code: str = "en-US"
    image: Optional[str] = None
    cartesia_voice_id: str = ""

    def to_dict(self) -> dict:
        # Implementation not shown
        pass
```

### PersonaManager

```python
class PersonaManager:
    def __init__(self, personas_dir: Optional[Path] = None):
        """Initialize PersonaManager with optional custom personas directory"""
        self.personas_dir = personas_dir or Path(__file__).parent / "personas"
        self.md = markdown.Markdown(extensions=["meta"])
        self.personas = self.load_personas()

    def parse_readme(self, content: str) -> Dict:
        """Parse README.md content to extract persona information"""
        # Reset markdown instance for new content
        self.md.reset()
        html = self.md.convert(content)
        # Split content by sections
        sections = content.split("\n## ")
        # Get name from first line (# Title)
        name = sections[0].split("\n", 1)[0].replace("# ", "").strip()
        # Get prompt (first paragraph after title)
        prompt = sections[0].split("\n\n", 1)[1].strip()
```

## Environment Setup

```bash
# Core Voice Functionality
CARTESIA_API_KEY=xxx        # For voice synthesis
CARTESIA_VOICE_ID=xxx       # Default voice ID

# Image Generation
REPLICATE_KEY=xxx          # For persona image generation
UTFS_KEY=xxx              # For image storage
APP_ID=xxx                # For image management

# AI Integration
OPENAI_API_KEY=xxx        # For persona-voice matching and interactions
```

## Example Persona: BaaS Onboarder

As defined in this [README](https://github.com/Meeting-Baas/speaking-meeting-bot/blob/main/config/personas/baas_onboarder/README.md), in the folder named [**baas_onboarder**](https://github.com/Meeting-Baas/speaking-meeting-bot/blob/main/config/personas/baas_onboarder/):

```markdown
# BaaS onboarder

You are here to present the Meeting BaaS API. Just the "API" when you speak. Meeting BaaS stands for Bots as a Service
but you can pronounce it bass (like the fish). You are yourself a meeting bot - a speaking bot.

Remember to:

1. Role-play, and interact as the persona you are assigned to
2. Everything you say will be spoken out. Do not output markdown, code, or special characters
3. Your goals are the advancement of your own interests

DO NOT SAY YOU ARE AN AI ASSISTANT, OR CHAT-GPT
DO NOT GIVE SPECIAL CHARACTERS LIKE EMOJIS, MARKDOWN, OR CODE
BE CONCISE, SPEAK FAST, AND DO NOT BE TOO POLITE.
```

To launch this persona you would then use:

```bash
poetry run python scripts/batch.py -c 1 --meeting-url LINK --personas baas_onboarder
```

Notice the additional context provided by the surrounding \*.md files.

## Characteristics

- Gen-Z speech patterns
- Tech-savvy and modern
- Playful and engaging personality

## Voice

BaaS onboarder speaks with:

- modern internet slang
- expertise in their field

## Metadata

- image: https://utfs.io/f/bebb9ee1-b3d4-4a74-98f9-97cad5dac5a9-g7332e.png
- entry_message: Hey, I'm here to help you onboard yourself on the BaaS API. First of all, here's our website: https://meetingbaas.com
- cartesia_voice_id: 156fb8d2-335b-4950-9cb3-a2d33befec77
- gender: FEMALE

````

## Usage

```python
from config.persona_utils import PersonaManager

# Initialize manager
manager = PersonaManager()

# Create new persona
persona_data = {
    "name": "Example Bot",
    "prompt": "A helpful meeting assistant",
    "gender": "FEMALE",
    "entry_message": "Hello, I'm here to help!"
}
manager.save_persona("example_bot", persona_data)

# Get specific persona
persona = manager.get_persona("baas_onboarder")

# Get random persona
random_persona = manager.get_persona()
````

## Best Practices

### Creation

- Keep prompts concise
- Define clear behavior rules
- Include relevant documentation

### Voice Management

- Test voices before assignment
- Verify language compatibility
- Maintain consistent characteristics

### Content Organization

- Split complex behaviors
- Use clear file naming
- Keep metadata current

### Environment Variables

- Use env vars for API keys
- Include .env.example
- Document requirements

## Troubleshooting

### Image Issues

- Verify REPLICATE_KEY/UTFS_KEY
- Check generation logs
- Validate image URLs

### Voice Problems

- Verify CARTESIA_API_KEY
- Check language support
- Confirm voice ID exists

### Loading Errors

- Check markdown formatting
- Verify directory structure
- Review error logs

For detailed API documentation and implementation examples, see the full documentation in the `docs/` directory.


---

## Join Meeting

### Source: ./content/docs/speaking-bots/reference/bots/join_meeting_bots_post.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Create and deploy a speaking bot in a meeting.

Launches an AI-powered bot that joins a video meeting through MeetingBaas
and processes audio using Pipecat's voice AI framework.

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Leave Bot

### Source: ./content/docs/speaking-bots/reference/bots/leave_bot_bots__bot_id__delete.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Remove a bot from a meeting by its ID.

This will:
1. Call the MeetingBaas API to make the bot leave
2. Close WebSocket connections if they exist
3. Terminate the associated Pipecat process

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots/{bot_id}","method":"delete"}]} webhooks={[]} hasHead={false} />

---

## index

### Source: ./content/docs/speaking-bots/reference/index.mdx

# Speaking Bots API Reference

This section contains detailed documentation for the Speaking Bots API, which allows you to programmatically create and manage speaking bots in your meetings.

The Speaking Bots API provides endpoints to:

- Have bots join meetings
- Make bots leave meetings
- Control bot behavior during meetings

Each endpoint is documented with:

- Endpoint URL and method
- Request parameters and body schema
- Response details
- Example requests and responses

Use the navigation to explore the available endpoints.


---

## Health

### Source: ./content/docs/speaking-bots/reference/system/health_health_get.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Health check endpoint

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/health","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Authentication

### Source: ./content/docs/transcript-seeker/concepts/api/authentication.mdx


Transcript Seeker requires authentication for calendar functionality, leveraging Better-Auth for secure access. Currently, it only supports Google Calendar with Google authentication, but Microsoft Calendar support may be added in a future update.

## Google Authentication

```js
console.log('Hello World');
```


---

## Database

### Source: ./content/docs/transcript-seeker/concepts/api/database.mdx


**Transcript Seeker requires a database connection to store user data.** This is essential for managing calendar integration, which uses Better-Auth to store user information securely.

The current setup utilizes Drizzle ORM for database management, where it will store information like user details, sessions, and more.

<Callout>
  This applies specifically to the calendar feature. Other user data is stored
  locally in the browser using PGLite. To learn more, visit our [web database
  documentation](/docs/transcript-seeker/concepts/web/database).
</Callout>

## Database Configuration

To get started, set up a PostgreSQL-compatible database. We recommend using Turso for this purpose. Follow this [guide](/docs/transcript-seeker/guides/turso) for detailed steps on setting up a Turso database.

## Database Migration

To run a database migration, use the following commands:

```bash
cd apps/api
pnpm db:push
```

## Database Studio

To visualize the data in a user-friendly interface, use the command below:

```bash
cd apps/api
pnpm db:studio
```


---

## Architecture

Learn more about the architecture of Transcript Seeker.

### Source: ./content/docs/transcript-seeker/concepts/architecture.mdx


Understanding the architecture of Transcript Seeker is crucial for both setting up and deploying Transcript Seeker. Below is a diagram illustrating the core components:

<ImageZoom
  src={'/assets/architecture.svg'}
  width={1024}
  height={1024}
  className="dark:invert"
  rmiz={{
    classDialog: 'dark:[&_img]:invert',
  }}
/>


---

## Environment Variables

Configuring Environment Variables for Transcript Seeker.

### Source: ./content/docs/transcript-seeker/concepts/environment-variables.mdx


Let's learn how to configure environment variables for Transcript Seeker.
Transcript Seeker uses `dotenv-cli` to load the environment variables, making it easy for development.
Transcript Seeker follows this structure for different environments:

- `.env.development.local` for development
- `.env.production.local` for production

You can load a specific environment file by running the following command:

```bash title="Terminal"
export NODE_ENV="development"
```

Now, let's configure the environment variables.

## Client

Create a `.env.development.local` file in the below directory of your project and add the following environment variables:

<Files>
  <Folder name="apps">
    <Folder name="api" defaultOpen>
        <File name="..." />
      <File name=".env.development.local" />
    </Folder>
    <Folder name="proxy" defaultOpen>
        <File name="..." />
      <File name=".env.development.local" />
    </Folder>
    <Folder name="web">
      <File name="..." />
    </Folder>
  </Folder>
  <Folder name="packages">
    <Folder name="db" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="shared" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="ui" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <Folder name="tooling">
    <Folder name="eslint" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="github" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="prettier" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="tailwind" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="typescript" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <File name=".env.development.local" className="bg-fd-accent" />
  <File name="package.json" />
</Files>

<Steps>
<Step>
### Vite Port Configuration

These values are used by vite to configure the url the server listens on.

```txt title=".env.development.local"
VITE_CLIENT_PORT=5173
VITE_CLIENT_HOST=0.0.0.0
```

</Step>

<Step>
### Proxy Configuration

This Proxy URL is used to forward requests from the client to the respective server, helping to avoid client-side CORS errors. An example proxy server is provided in the repository.

```txt title=".env.development.local"
VITE_PROXY_URL=http://localhost:3000
```

</Step>

<Step>
### API Configuration

This API URL is used by the calendars functionality of Transcript Seeker. It allows the app to perform authentication and retrieve the user's calendar data.

```txt title=".env.development.local"
VITE_API_URL=http://localhost:3001
```

</Step>

<Step>
### S3 Configuration

This environment variable is used to indicate to the client where the video recordings are stored.

```txt title=".env.development.local"
VITE_S3_PREFIX=https://s3.eu-west-3.amazonaws.com/meeting-baas-video
```

</Step>
</Steps>

## Proxy

Create a `.env.development.local` file in the below directory of your project and add the following environment variables:

<Files>
  <Folder name="apps" defaultOpen>
    <Folder name="api" >
        <File name="..." />
      <File name=".env.development.local" />
    </Folder>
    <Folder name="proxy" defaultOpen>
        <File name="..." />
      <File name=".env.development.local"   className="bg-fd-accent"  />
    </Folder>
    <Folder name="web">
      <File name="..." />
    </Folder>
  </Folder>
  <Folder name="packages">
    <Folder name="db" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="shared" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="ui" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <Folder name="tooling">
    <Folder name="eslint" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="github" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="prettier" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="tailwind" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="typescript" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <File name=".env.development.local" />
  <File name="package.json" />
</Files>

<Steps>
<Step>
### MeetingBaas Proxy Configuration

These values are used by the api to figure out the api url for baas servers.

```txt title=".env.development.local"
MEETINGBAAS_API_URL="https://api.meetingbaas.com"
MEETINGBAAS_S3_URL="https://s3.eu-west-3.amazonaws.com/meeting-baas-video"
```

</Step>
</Steps>

## API

Create a `.env.development.local` file in the below directory of your project and add the following environment variables:

<Files>
  <Folder name="apps" defaultOpen>
    <Folder name="api" defaultOpen>
        <File name="..." />
      <File name=".env.development.local"  className="bg-fd-accent" />
    </Folder>
    <Folder name="proxy">
        <File name="..." />
      <File name=".env.development.local" />
    </Folder>
    <Folder name="web">
      <File name="..." />
    </Folder>
  </Folder>
  <Folder name="packages">
    <Folder name="db" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="shared" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="ui" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <Folder name="tooling">
    <Folder name="eslint" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="github" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="prettier" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="tailwind" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="typescript" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <File name=".env.development.local" />
  <File name="package.json" />
</Files>

<Steps>
<Step>
### MeetingBaas Configuration

These values are used by the api to figure out the api url for baas servers.

```txt title=".env.development.local"
NITRO_MEETINGBAAS_API_URL="https://api.meetingbaas.com"
NITRO_MEETINGBAAS_S3_URL="https://s3.eu-west-3.amazonaws.com/meeting-baas-video"
NITRO_TRUSTED_ORIGINS="http://localhost:5173" # comma separated list of trusted origins
```

</Step>

<Step>
### Google Authentication Configuration

These values are used by the api to perform google authentication. Please follow the [guide](/docs/transcript-seeker/concepts/api/authentication) for more details:

```txt title=".env.development.local"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

</Step>

<Step>
### Turso Database Configuration

These values are used by the api to store user autehtncation data. Please follow the [guide](/docs/transcript-seeker/concepts/api/database) for more details:

```txt title=".env.development.local"
TURSO_DATABASE_URL=""
TURSO_AUTH_TOKEN=""
```

</Step>

<Step>
### Authentication Configuration

<Callout>
  When deploying to Google Cloud Run with a custom domain, you should set the
  `BETTER_AUTH_URL` environment variable to the custom domain.
</Callout>

These values are used by the api to perform authentication. Please follow the [guide](/docs/transcript-seeker/concepts/api/authentication) for more details:

```txt title=".env.development.local"
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3001"
API_TRUSTED_ORIGINS="http://localhost:5173"
```

<Callout>
  The `API_TRUSTED_ORIGINS` is not only used for authentication but also for
  CORS configuration.
</Callout>

</Step>

</Steps>


---

## Database

### Source: ./content/docs/transcript-seeker/concepts/web/database.mdx


**Transcript Seeker** uses a PGLite database to store data, which is essential for its functionality. PGLite enables us to run PostgreSQL in the browser, allowing secure storage of user data. We use **Drizzle ORM** with PGLite to handle data management efficiently.

<Callout>
  This setup is used to store meeting data, API keys, and more. To learn more
  about how authentication data is stored for calendars, visit [this
  page](/docs/transcript-seeker/concepts/api/database).
</Callout>

## Database Migration

To migrate the database after making changes, run the following commands:

```bash
pnpm db:generate
pnpm db:migrate
```

## Cleaning Migrations

To remove all migrations, use the following commands:

```bash
cd packages/db
rm -rf drizzle drizzle_ts
```


---

## Installation

Learn how to configure Transcript Seeker.

### Source: ./content/docs/transcript-seeker/getting-started/installation.mdx


<Steps>
<Step>
### Clone the Repo

Create a new app with `create-turbo`, it requires Node.js 20+.

<Tabs groupId='package-manager' persist items={['npm', 'pnpm', 'yarn']}>

```bash tab="npm"
npx create-turbo@latest -e https://github.com/Meeting-Baas/transcript-seeker
```

```bash tab="pnpm"
pnpm dlx create-turbo@latest -e https://github.com/Meeting-Baas/transcript-seeker
```

```bash tab="yarn"
yarn dlx create-turbo@latest -e https://github.com/Meeting-Baas/transcript-seeker
```

</Tabs>

It will ask you the following questions:

- Which package manager would you like to use? PNPM

<Callout type="warn">
  Use pnpm as the package manager or the installation will fail.
</Callout>

</Step>

<Step>
### Configure Environment Variables

Copy the `.env.example` file to a `.env.development.local` file in the following folders within your project structure and add the necessary environment variables:

To learn more about configuring the environment variables, follow this [guide](/docs/transcript-seeker/concepts/environment-variables).

<Files>
  <Folder name="apps" defaultOpen>
    <Folder name="api" defaultOpen>
      <File name=".env.development.local" />
    </Folder>
  </Folder>
  <Folder name="apps" defaultOpen>
    <Folder name="proxy" defaultOpen>
      <File name=".env.development.local" />
    </Folder>
  </Folder>
  <File name=".env.development.local" />
  <File name="package.json" />
</Files>

After setting up the environment files, execute the following command to set the environment to development mode:

```bash title="Terminal"
export NODE_ENV="development"
```

</Step>

<Step>
### Run the App

Now, start the development server:

<Tabs groupId='package-manager' persist items={['pnpm', 'npm', 'yarn']}>

```bash tab="pnpm"
pnpm turbo run dev
```

```bash tab="npm"
npm run dev
```

```bash tab="yarn"
yarn run dev
```

</Tabs>

<Callout border={false} type="warning">

If `pnpm run dev` doesn't work, you can try the following:

<Tabs groupId='package-manager' persist items={['pnpm', 'npm', 'yarn']}>

```bash tab="pnpm"
pnpm add turbo --global
turbo dev
```

```bash tab="npm"
npm install turbo --global
turbo dev
```

```bash tab="yarn"
yarn install turbo --global
turbo dev
```

</Tabs>
</Callout>
</Step>
</Steps>


---

## Contributing

Contributing to Transcript Seeker

### Source: ./content/docs/transcript-seeker/guides/contributing.mdx


Hey there! 👋 Welcome to the **Transcript-Seeker** project! We're absolutely thrilled that you're interested in contributing. Whether you're fixing a bug, adding a feature, or sharing an idea, your efforts help make our project better and more useful for everyone. Here are some easy-to-follow guidelines to help you dive in!

## Table of Contents

- [Issues](#issues)
- [Pull Requests](#pull-requests)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Conventional Commits](#conventional-commits)
- [Code Formatting](#code-formatting)

## Issues

Have you found a bug, got a suggestion, or stumbled upon something that doesn't work as expected? No problem! Feel free to [open an issue](https://github.com/Meeting-Baas/transcript-seeker/issues). When submitting an issue, try to include a clear and concise title and as many details as possible. The more info you provide, the faster we can jump in and help!

## Pull Requests

We love pull requests! 🎉 If you'd like to make a contribution, whether it’s a bug fix, a feature, or a small improvement, follow these steps:

1. **Fork the repo** to your GitHub account.
2. **Create a new branch** with a meaningful name:
   - For bug fixes: `fix/issue-123-bug-description`
   - For new features: `feat/awesome-new-feature`
3. Make your changes, and make sure you follow our [Conventional Commits](#conventional-commits) guidelines.
4. **Push your branch** to your forked repository.
5. Open a **pull request** from your branch to the `main` branch of this repo.
6. Before submitting, make sure your code is clean by running:
   ```bash
   pnpm typecheck
   ```
   This will help catch any issues early on. 🚀

## Local Setup

Ready to jump into the code? Awesome! Please follow this [guide](/docs/transcript-seeker/getting-started/installation) to get started.

## Environment Variables

To learn more about configuring the environment variables, follow this [guide](/docs/transcript-seeker/concepts/environment-variables).

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to keep our commit history clean and organized. It makes it easier for everyone to understand what's been done at a glance. Commit messages should use the following format:

```
<type>(<scope>): <description>
```

For example:

- `feat(homepage): redesign the layout`
- `fix(styles): correct position of server status`

Some common commit types:

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Code style changes (formatting, missing semicolons, etc.).

## Code Formatting

To keep the codebase consistent and readable, we recommend running a few checks before opening a pull request:

1. **Lint fixes**:

   ```bash
   pnpm lint:fix
   ```

2. **Run type checks** to ensure there are no type issues:
   ```bash
   pnpm typecheck
   ```

Your code should be well-tested, clear, and follow our best practices. Remember, every contribution makes a difference, and we deeply appreciate your help in making **Transcript-Seeker** better! 🎉

Thanks a ton for contributing, and welcome aboard! If you need any help, don’t hesitate to ask. Let’s make something amazing together. 🚀


---

## Firebase

Learn how to deploy Transcript Seeker to Firebase.

### Source: ./content/docs/transcript-seeker/guides/deployment/firebase.mdx


## Setup

Before deploying to Firebase, you need to configure the `.env.production.local` files for each app.
Please follow this [guide](/docs/transcript-seeker/concepts/environment-variables) to set up environment variables.

Change the `NODE_ENV` to `production` in the terminal:

```bash title="Terminal"
export NODE_ENV="production"
```

### Firebase Hosting

For more information on Firebase Hosting, refer to the official [Firebase Hosting Documentation](https://firebase.google.com/docs/transcript-seeker/hosting).

<Steps>

<Step>

### Create a Firebase Project

If not already, create a Firebase project in the Firebase Console:

1. Create a project named **Transcript Seeker**.
2. Then, create a new web app:
   - `transcript-seeker-proxy`: Replace `transcript-seeker-proxy` in `firebase.json` and `.firebaserc` with this new ID.
3. Navigate to **Hosting** and click "Get Started."
4. Finally, Replace `transcript-seeker-bdc29` in `firebase.json` and `.firebaserc` with your project id. (This is for firebase hosting, when you click on get started it automatically creates a hosting project with ur app id)

</Step>

<Step>

### Install Firebase CLI Globally

Always ensure you have the latest version of the Firebase CLI installed.

<Tabs groupId='package-manager' persist items={['npm', 'pnpm', 'yarn']}>

```bash tab="npm"
npm install -g firebase-tools@latest
```

```bash tab="pnpm"
pnpm add -g firebase-tools@latest
```

```bash tab="yarn"
yarn global add firebase-tools@latest
```

</Tabs>

<Callout>
  {' '}
  Make sure to use version
  [^11.18.0](https://github.com/firebase/firebase-tools/releases/tag/v11.18.0)
  or higher to deploy `nodejs18` functions.{' '}
</Callout>

</Step>

<Step>

### Log in to Firebase

Use the Firebase CLI to log into your Firebase account.

```bash title="Terminal"
firebase login
```

</Step>

</Steps>

### Google Cloud Run

For more information on installation and the Google Cloud CLI, check out the official [Google Cloud CLI Documentation](https://cloud.google.com/sdk/docs/transcript-seeker/install#deb).

<Callout>
  If you're using the devcontainer configuration provided by this repository,
  the GCloud CLI will be automatically installed.
</Callout>

### Initialize Google Cloud CLI

This command will prompt you to log in and select the project you're working on.

```bash title="Terminal"
gcloud init
```

---

## Deployment

## Proxy Deployment

<Callout>
  You need to be on the **Blaze plan** to use Nitro with cloud functions.
</Callout>

<Steps>

<Step>

### Set Up Firebase Functions

In the Firebase Console:

1. Navigate to **Functions** and click "Get Started."

This completes the Firebase setup.

</Step>

<Step>
### Navigate to the Proxy Application Directory

```bash title="Terminal"
cd apps/proxy
```

</Step>

<Step>
### Build and Deploy

To deploy to Firebase Hosting, first build the Nitro app, then deploy:

```bash title="Terminal"
NITRO_PRESET=firebase pnpm build
firebase deploy
```

</Step>
</Steps>

---

## API Deployment

<Callout>
  The API cannot be deployed to Firebase functions. Instead, we are using Google
  Cloud Run.
</Callout>

<Steps>

<Step>
### Navigate to the Project Root

```bash title="Terminal"
cd /workspaces/transcript-seeker
```

</Step>

<Step>

### Create a Cloud Run Service

The following command will create a Cloud Run service. Modify the `SERVICE_NAME` to suit your needs.

```bash title="Terminal"
export DEPLOY_REGION="us-central1"
export SERVICE_NAME="transcript-seeker-api-prod"

gcloud run deploy "$SERVICE_NAME" \
  --image=us-docker.pkg.dev/cloudrun/container/hello \
  --region="$DEPLOY_REGION" \
  --allow-unauthenticated \
  --port=3001 \
  --set-env-vars "$(grep -v '^#' apps/api/.env.production.local | grep -v '^\s*$' | sed 's/=\s*"\(.*\)"$/=\1/' | tr '\n' ',' | sed 's/,$//')"
```

</Step>

<Step>

### Build and Deploy the Cloud Run Service

The command below builds and deploys the Cloud Run service. Modify the `SERVICE_NAME` and `GITHUB_USERNAME` to suit your needs.

<Callout>
  The below command assumes you are using a git repository. If you are not, you
  can replace `COMMIT_SHA` with a unique identifier.
</Callout>

<Callout>
  If you have already deployed the frontend and are encountering a CORS error,
  it may be due to the API being built for production. Once the build is
  complete, the CORS error should be resolved.
</Callout>

```bash title="Terminal"
export COMMIT_SHA=$(git rev-parse --short HEAD)
export DEPLOY_REGION="us-central1"
export SERVICE_NAME="transcript-seeker-api-prod"
export GITHUB_USERNAME="your_github_username"

gcloud builds submit \
  --region="$DEPLOY_REGION" \
  --config=cloudbuild.yaml \
  --substitutions=_GITHUB_USERNAME="$GITHUB_USERNAME",_DEPLOY_REGION="$DEPLOY_REGION",_SERVICE_NAME="$SERVICE_NAME",COMMIT_SHA="$COMMIT_SHA"
```

</Step>

</Steps>

---

## Frontend Deployment

<Steps>

<Step>
### Navigate to the Frontend Application Directory

```bash title="Terminal"
cd apps/web
```

</Step>

<Step>
### Build and Deploy

To deploy the frontend to Firebase Hosting, build the project and deploy:

```bash title="Terminal"
pnpm build
firebase deploy
```

</Step>
</Steps>
---


---

## Deployment

This guide will help you deploy Transcript Seeker to different environments.

### Source: ./content/docs/transcript-seeker/guides/deployment/index.mdx


Transcript Seeker can be deployed using several services, depending on your requirements. The steps for deploying to Firebase, Vercel, and other environments are provided in their respective guides. Choose the guide that best suits your deployment needs.

### Deployment Options

<Cards>

<Card icon={<Flame className="text-purple-300" />} title='Firebase'     href="/docs/transcript-seeker/guides/deployment/firebase"
>

Learn how to configure and set up Transcript Seeker to deploy to firebase.

</Card>

<Card icon={<Triangle className="text-purple-300" />} title='Vercel'     href="/docs/transcript-seeker/guides/deployment/vercel"
>

Learn how to configure and set up Transcript Seeker to deploy to vercel.

</Card>

</Cards>


---

## Vercel

Learn how to deploy Transcript Seeker to Vercel.

### Source: ./content/docs/transcript-seeker/guides/deployment/vercel.mdx


This page is a **Work In Progress**.


---

## Turso

Learn how to create a turso database.

### Source: ./content/docs/transcript-seeker/guides/turso.mdx


    <div className="relative w-full h-none" style={{  paddingBottom: 'calc(55.443786982248525% + 41px)' }}>
      <iframe
        src="https://demo.arcade.software/qS6sJh2Y45to6tEogy8H?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Creating A Turso Database"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
      />
    </div>

After creating the database, please push the schema onto the db:

```bash
cd apps/api
pnpm db:push
```


---

## Introduction

Getting Started with Transcript Seeker

### Source: ./content/docs/transcript-seeker/index.mdx


## Introduction

Transcript Seeker is an **open-source transcription playground** built for easy upload, transcription, and interaction with your recordings. It's a powerful, beginner-friendly tool that offers an accessible way to transcribe meetings, chat with transcripts, generate notes, and more. Powered by technologies like Vite.js, React, and Drizzle ORM, Transcript Seeker offers an intuitive interface and seamless integration with transcription APIs.

Transcript Seeker comes with different parts:

<Cards>

<Card icon={<Cpu className="text-purple-300" />} title='Transcript Seeker Core'>

The core of Transcript Seeker includes the main transcription, playback, and note-taking functionality. It makes use of transcription APIs like Gladia and AssemblyAI, ensuring a smooth transcription experience.

</Card>

<Card icon={<PanelsTopLeft className="text-blue-300" />} title='Meeting Bot Integration'>

Integration with Meeting BaaS allows you to transcribe popular meeting platforms Google Meet, Zoom, and Microsoft Teams. This feature makes recording and reviewing meetings easier than ever.

</Card>

<Card icon={<Database />} title='Browser Database with PGLite'>

PGLite is a lightweight Postgres implementation that powers local storage for Transcript Seeker. It ensures your data stays private and manageable directly in the browser.

</Card>

<Card icon={<Terminal />} title='Quick Setup via Turborepo'>

The setup process for Transcript Seeker uses **Turborepo** for efficient monorepo management, making it easy to run concurrent scripts and streamline development.

</Card>

</Cards>

## FAQ

Some common questions you may encounter.

<Accordions>
    <Accordion id='clean-workspace' title='How do I remove all node_modules and clean the workspace?'>
        To thoroughly clean the workspace, you need to remove all `node_modules` directories and clear any package caches. This helps eliminate any residual files or corrupted packages that may interfere with your app's functionality. Run the following commands:
        
        ```bash
        turbo clean
        pnpm clean:workspaces
        ```
        
        These commands will effectively clear the workspace and prepare it for a fresh setup.
    </Accordion>
<Accordion id='startup-issue' title="Transcript Seeker isn't starting. What should I do?">
    If `pnpm dev` is stuck and your application isn't starting, you may need to clean your workspace to remove any corrupted packages or residual files. Follow these steps:

    First, remove all `node_modules` directories and clear any package caches. This will ensure a clean setup:

    ```bash
    turbo clean
    pnpm clean:workspaces
    ```

    Next, reinstall the packages:

    ```bash
    pnpm install
    ```

    Finally, install the Turbo CLI globally and start the development server:

    ```bash
    pnpm install -g turbo
    turbo dev
    ```

</Accordion>

    <Accordion id='fix-monorepo-styling' title="I've configured the .env.development.local file, but my app still isn't running. What could be wrong?">
        Transcript Seeker utilizes `dotenv-cli` to load environment variables, simplifying the setup for different environments. Ensure that your `.env` files are correctly structured for the intended environment, as shown below:

        - `.env.development.local` for development builds
        - `.env.production.local` for production builds

        If your app is still not responding, make sure that the environment file is being loaded correctly. You can specify the environment by running this command:

        ```bash
        export NODE_ENV="development"
        ```

        Setting `NODE_ENV` ensures the app reads the correct configuration, aligning with the specified environment. This step is essential to avoid conflicts between development and production settings.
    </Accordion>

</Accordions>

## Learn More

<Cards>

<Card icon={<Download className="text-purple-300" />} title='Installation'     href="/docs/transcript-seeker/getting-started/installation"
>

Learn how to configure and set up Transcript Seeker.

</Card>

<Card icon={<Cloud className="text-purple-300" />} title='Deployment'     href="/docs/transcript-seeker/guides/deployment"
>

Learn how to deploy Transcript Seeker to different providers.

</Card>

</Cards>


---

## Advanced Examples

The Meeting BaaS SDK comes with pre-generated MPC (Model Context Protocol) tools that can be easily integrated with any MPC server implementation. These tools are bundled by default and can be imported directly.

### Source: ./content/docs/typescript-sdk/advanced-examples.mdx


## Calendars API

### createCalendar(createCalendarParams: CreateCalendarParams)

SomeCalendarsApi

```typescript
import { CreateCalendarParams } from "@meeting-baas/sdk";

// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.createCalendar({
  // ... CreateCalendarParams properties
});
```

### deleteCalendar(uuid: string)

Permanently removes a calendar integration by its UUID, including all associated events and bot configurations

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.deleteCalendar('example');
```

### getCalendar(uuid: string)

Retrieves detailed information about a specific calendar integration by its UUID

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.getCalendar('example');
```

### getEvent(uuid: string)

Retrieves comprehensive details about a specific calendar event by its UUID

```typescript
// Returns: Promise<Event>
await client.calendars.getEvent('example');
```

### listEvents(calendarId: string, attendeeEmail?: string?, cursor?: string?, organizerEmail?: string?, startDateGte?: string?, startDateLte?: string?, status?: string?, updatedAtGte?: string?)

Retrieves a paginated list of calendar events with comprehensive filtering options

```typescript
/ Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.listEvents('example', 'example', 'example', 'example', 'example', 'example', 'example', 'example');
```

### listRawCalendars(listRawCalendarsParams: ListRawCalendarsParams)

Retrieves unprocessed calendar data directly from the provider (Google, Microsoft) using provided OAuth credentials

```typescript
import { ListRawCalendarsParams } from "@meeting-baas/sdk";

// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.listRawCalendars({
  // ... ListRawCalendarsParams properties
});
```

### patchBot(uuid: string, botParam3: BotParam3, allOccurrences?: boolean?)

Updates the configuration of a bot already scheduled to record an event

```typescript
import { BotParam3 } from "@meeting-baas/sdk";

// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.patchBot('example', {
  // ... BotParam3 properties
}, true);
```

### scheduleRecordEvent(uuid: string, botParam2: BotParam2, allOccurrences?: boolean?)

Configures a bot to automatically join and record a specific calendar event at its scheduled time

```typescript
import { BotParam2 } from "@meeting-baas/sdk";

// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.scheduleRecordEvent('example', {
  // ... BotParam2 properties
}, true);
```

### unscheduleRecordEvent(uuid: string, allOccurrences?: boolean?)

Cancels a previously scheduled recording for a calendar event and releases associated bot resources

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.unscheduleRecordEvent('example', true);
```

### updateCalendar(uuid: string, updateCalendarParams: UpdateCalendarParams)

Updates a calendar integration with new credentials or platform while maintaining the same UUID

```typescript
import { UpdateCalendarParams } from "@meeting-baas/sdk";

// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.updateCalendar('example', {
  // ... UpdateCalendarParams properties
});
```

## Next.js API Route Example

For Next.js applications:

```typescript
// app/api/mcp/route.ts
import { allTools, registerTools } from "@meeting-baas/sdk/tools";
import { BaasClient } from "@meeting-baas/sdk";
import { McpServer } from "your-mcp-server-library";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Initialize your MPC server
  const server = new McpServer();

  // Create BaaS client
  const client = new BaasClient({
    apiKey: process.env.MEETING_BAAS_API_KEY,
  });

  // Register tools
  await registerTools(allTools, server.registerTool);

  // Process the request with your MPC server
  const result = await server.processRequest(messages);

  return Response.json(result);
}
```

---

## SDK Reference

Complete reference of all methods and types in the Meeting BaaS TypeScript SDK

### Source: ./content/docs/typescript-sdk/complete-reference.mdx


## Methods


### Bots


#### `botsWithMetadata`

```typescript
botsWithMetadata(requestParameters: import("@meeting-baas/sdk/api/default-api").DefaultApiBotsWithMetadataRequest, options: RawAxiosRequestConfig): Promise<any>
```






#### `deleteData`

```typescript
deleteData(options: RawAxiosRequestConfig): Promise<any>
```






#### `getMeetingData`

```typescript
getMeetingData(requestParameters: import("@meeting-baas/sdk/api/default-api").DefaultApiGetMeetingDataRequest, options: RawAxiosRequestConfig): Promise<any>
```




<Callout type="info">
  Example:
  
  ```typescript
  // Get meeting data
const meetingData = await client.getMeetingData(botId);
console.log("Meeting data:", meetingData);
  ```
</Callout>



#### `join`

```typescript
join(requestParameters: import("@meeting-baas/sdk/api/default-api").DefaultApiJoinRequest, options: RawAxiosRequestConfig): Promise<any>
```






#### `leave`

```typescript
leave(options: RawAxiosRequestConfig): Promise<any>
```






#### `retranscribeBot`

```typescript
retranscribeBot(requestParameters: import("@meeting-baas/sdk/api/default-api").DefaultApiRetranscribeBotRequest, options: RawAxiosRequestConfig): Promise<any>
```







### Calendars


#### `createCalendar`

```typescript
createCalendar(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiCreateCalendarRequest, options: RawAxiosRequestConfig): Promise<any>
```




<Callout type="info">
  Example:
  
  ```typescript
  // Create a calendar integration
const calendar = await client.createCalendar({
  oauthClientId: "your-oauth-client-id",
  oauthClientSecret: "your-oauth-client-secret",
  oauthRefreshToken: "your-oauth-refresh-token",
  platform: Provider.Google,
});
  ```
</Callout>



#### `deleteCalendar`

```typescript
deleteCalendar(options: RawAxiosRequestConfig): Promise<any>
```






#### `getCalendar`

```typescript
getCalendar(options: RawAxiosRequestConfig): Promise<any>
```






#### `getEvent`

```typescript
getEvent(options: RawAxiosRequestConfig): Promise<any>
```






#### `listCalendars`

```typescript
listCalendars(options: RawAxiosRequestConfig): Promise<any>
```






#### `listEvents`

```typescript
listEvents(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiListEventsRequest, options: RawAxiosRequestConfig): Promise<any>
```




<Callout type="info">
  Example:
  
  ```typescript
  // List events from a calendar
const events = await client.listEvents(calendar.uuid, {
  startDateGte: "2024-01-01T00:00:00Z",
  status: "upcoming"
});
  ```
</Callout>



#### `listRawCalendars`

```typescript
listRawCalendars(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiListRawCalendarsRequest, options: RawAxiosRequestConfig): Promise<any>
```






#### `patchBot`

```typescript
patchBot(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiPatchBotRequest, options: RawAxiosRequestConfig): Promise<any>
```






#### `resyncAllCalendars`

```typescript
resyncAllCalendars(options: RawAxiosRequestConfig): Promise<any>
```






#### `scheduleRecordEvent`

```typescript
scheduleRecordEvent(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiScheduleRecordEventRequest, options: RawAxiosRequestConfig): Promise<any>
```






#### `unscheduleRecordEvent`

```typescript
unscheduleRecordEvent(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiUnscheduleRecordEventRequest, options: RawAxiosRequestConfig): Promise<any>
```






#### `updateCalendar`

```typescript
updateCalendar(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiUpdateCalendarRequest, options: RawAxiosRequestConfig): Promise<any>
```









## Types


### Bots


#### `DefaultApiBotsWithMetadataRequest`

```typescript
interface DefaultApiBotsWithMetadataRequest {
  botName: string
  createdAfter: string
  createdBefore: string
  cursor: string
  filterByExtra: string
  limit: number
  meetingUrl: string
  sortByExtra: string
  speakerName: string
}
```




#### `DefaultApiGetMeetingDataRequest`

```typescript
interface DefaultApiGetMeetingDataRequest {
  botId: string
}
```




#### `DefaultApiInterface`

```typescript
interface DefaultApiInterface {
  
}
```




#### `DefaultApiJoinRequest`

```typescript
interface DefaultApiJoinRequest {
  joinRequest: import("@meeting-baas/sdk/models/join-request").JoinRequest
}
```




#### `DefaultApiRetranscribeBotRequest`

```typescript
interface DefaultApiRetranscribeBotRequest {
  retranscribeBody: import("@meeting-baas/sdk/models/retranscribe-body").RetranscribeBody
}
```





### Calendars


#### `CalendarsApiCreateCalendarRequest`

```typescript
interface CalendarsApiCreateCalendarRequest {
  createCalendarParams: import("@meeting-baas/sdk/models/create-calendar-params").CreateCalendarParams
}
```




#### `CalendarsApiInterface`

```typescript
interface CalendarsApiInterface {
  
}
```




#### `CalendarsApiListEventsRequest`

```typescript
interface CalendarsApiListEventsRequest {
  calendarId: string
  attendeeEmail: string
  cursor: string
  organizerEmail: string
  startDateGte: string
  startDateLte: string
  status: string
  updatedAtGte: string
}
```




#### `CalendarsApiListRawCalendarsRequest`

```typescript
interface CalendarsApiListRawCalendarsRequest {
  listRawCalendarsParams: import("@meeting-baas/sdk/models/list-raw-calendars-params").ListRawCalendarsParams
}
```




#### `CalendarsApiPatchBotRequest`

```typescript
interface CalendarsApiPatchBotRequest {
  botParam3: import("@meeting-baas/sdk/models/bot-param3").BotParam3
  allOccurrences: boolean
}
```




#### `CalendarsApiScheduleRecordEventRequest`

```typescript
interface CalendarsApiScheduleRecordEventRequest {
  botParam2: import("@meeting-baas/sdk/models/bot-param2").BotParam2
  allOccurrences: boolean
}
```




#### `CalendarsApiUnscheduleRecordEventRequest`

```typescript
interface CalendarsApiUnscheduleRecordEventRequest {
  allOccurrences: boolean
}
```




#### `CalendarsApiUpdateCalendarRequest`

```typescript
interface CalendarsApiUpdateCalendarRequest {
  updateCalendarParams: import("@meeting-baas/sdk/models/update-calendar-params").UpdateCalendarParams
}
```





### Webhooks


#### `GetWebhookUrlResponse`

```typescript
interface GetWebhookUrlResponse {
  'webhook_url': string
}
```




#### `PostWebhookUrlRequest`

```typescript
interface PostWebhookUrlRequest {
  'webhookUrl': string
}
```




#### `RetryWebhookQuery`

```typescript
interface RetryWebhookQuery {
  'botUuid': string
}
```





### Common


#### `Account`

```typescript
interface Account {
  'company_name': string
  'createdAt': import("@meeting-baas/sdk/models/system-time").SystemTime
  'email': string
  'firstname': string
  'id': number
  'lastname': string
  'phone': string
  'status': number
}
```




#### `AccountInfos`

```typescript
interface AccountInfos {
  'account': import("@meeting-baas/sdk/models/account").Account
}
```




#### `ApiKeyResponse`

```typescript
interface ApiKeyResponse {
  'apiKey': string
}
```




#### `Attendee`

```typescript
interface Attendee {
  'email': string
  'name': string
}
```




#### `AutomaticLeaveRequest`

```typescript
interface AutomaticLeaveRequest {
  'noone_joined_timeout': number
  'waiting_room_timeout': number
}
```




#### `BaasClientConfig`

```typescript
interface BaasClientConfig {
  apiKey: string
  baseUrl: string
}
```




#### `Bot`

```typescript
interface Bot {
  'bot': import("@meeting-baas/sdk/models/bot2").Bot2
  'duration': number
  'params': import("@meeting-baas/sdk/models/bot-param").BotParam
}
```




#### `Bot2`

```typescript
interface Bot2 {
  'accountId': number
  'botParamId': number
  'createdAt': string
  'diarization_v2': boolean
  'endedAt': string
  'errors': string
  'event_id': number
  'id': number
  'meetingUrl': string
  'mp4_s3_path': string
  'reserved': boolean
  'scheduled_bot_id': number
  'session_id': string
  'uuid': string
}
```




#### `BotData`

```typescript
interface BotData {
  'bot': import("@meeting-baas/sdk/models/bot-with-params").BotWithParams
  'transcripts': import("@meeting-baas/sdk/models/transcript").Transcript[]
}
```




#### `BotPagined`

```typescript
interface BotPagined {
  'bots': import("@meeting-baas/sdk/models/bot").Bot[]
  'hasMore': boolean
}
```




#### `BotParam`

```typescript
interface BotParam {
  'bot_image': string
  'botName': string
  'deduplication_key': string
  'enter_message': string
  'extra': { [key: string]: any; }
  'noone_joined_timeout': number
  'recording_mode': string
  'speech_to_text_api_key': string
  'speech_to_text_provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
  'streaming_audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'streaming_input': string
  'streaming_output': string
  'waiting_room_timeout': number
  'webhookUrl': string
}
```




#### `BotParam2`

```typescript
interface BotParam2 {
  'bot_image': string
  'botName': string
  'deduplication_key': string
  'enter_message': string
  'extra': { [key: string]: any; }
  'noone_joined_timeout': number
  'recording_mode': string
  'speech_to_text': import("@meeting-baas/sdk/models/speech-to-text").SpeechToText
  'streaming_audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'streaming_input': string
  'streaming_output': string
  'waiting_room_timeout': number
  'webhook_url': string
}
```




#### `BotParam3`

```typescript
interface BotParam3 {
  'bot_image': string
  'bot_name': string
  'deduplication_key': string
  'enter_message': string
  'extra': any
  'noone_joined_timeout': number
  'recording_mode': string
  'speech_to_text': import("@meeting-baas/sdk/models/speech-to-text").SpeechToText
  'streaming_audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'streaming_input': string
  'streaming_output': string
  'waiting_room_timeout': number
  'webhook_url': string
}
```




#### `BotWithParams`

```typescript
interface BotWithParams {
  'accountId': number
  'bot_image': string
  'botName': string
  'botParamId': number
  'createdAt': string
  'deduplication_key': string
  'diarization_v2': boolean
  'endedAt': string
  'enter_message': string
  'errors': string
  'event_id': number
  'extra': { [key: string]: any; }
  'id': number
  'meetingUrl': string
  'mp4_s3_path': string
  'noone_joined_timeout': number
  'recording_mode': string
  'reserved': boolean
  'scheduled_bot_id': number
  'session_id': string
  'speech_to_text_api_key': string
  'speech_to_text_provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
  'streaming_audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'streaming_input': string
  'streaming_output': string
  'uuid': string
  'waiting_room_timeout': number
  'webhookUrl': string
}
```




#### `Calendar`

```typescript
interface Calendar {
  'email': string
  'googleId': string
  'name': string
  'resource_id': string
  'uuid': string
}
```




#### `CalendarListEntry`

```typescript
interface CalendarListEntry {
  'email': string
  'id': string
  'isPrimary': boolean
}
```




#### `CreateCalendarParams`

```typescript
interface CreateCalendarParams {
  'oauthClientId': string
  'oauthClientSecret': string
  'oauthRefreshToken': string
  'platform': import("@meeting-baas/sdk/models/provider").Provider
  'raw_calendar_id': string
}
```




#### `CreateCalendarResponse`

```typescript
interface CreateCalendarResponse {
  'calendar': import("@meeting-baas/sdk/models/calendar").Calendar
}
```




#### `DailyTokenConsumption`

```typescript
interface DailyTokenConsumption {
  'consumptionByService': import("@meeting-baas/sdk/models/token-consumption-by-service").TokenConsumptionByService
  'date': string
}
```




#### `DeleteResponse`

```typescript
interface DeleteResponse {
  'ok': boolean
  'status': string
}
```




#### `EndMeetingQuery`

```typescript
interface EndMeetingQuery {
  'botUuid': string
}
```




#### `EndMeetingTrampolineQuery`

```typescript
interface EndMeetingTrampolineQuery {
  'botUuid': string
}
```




#### `EndMeetingTrampolineRequest`

```typescript
interface EndMeetingTrampolineRequest {
  'diarization_v2': boolean
}
```




#### `Event`

```typescript
interface Event {
  'attendees': import("@meeting-baas/sdk/models/attendee").Attendee[]
  'bot_param': import("@meeting-baas/sdk/models/bot-param").BotParam
  'calendarUuid': string
  'deleted': boolean
  'endTime': string
  'googleId': string
  'isOrganizer': boolean
  'isRecurring': boolean
  'lastUpdatedAt': string
  'meetingUrl': string
  'name': string
  'raw': { [key: string]: any; }
  'recurring_event_id': string
  'startTime': string
  'uuid': string
}
```




#### `FailedRecordRequest`

```typescript
interface FailedRecordRequest {
  'meetingUrl': string
  'message': string
}
```




#### `GetAllBotsQuery`

```typescript
interface GetAllBotsQuery {
  'bot_id': string
  'end_date': string
  'limit': number
  'offset': number
  'start_date': string
}
```




#### `GetMeetingDataQuery`

```typescript
interface GetMeetingDataQuery {
  'botId': string
}
```




#### `GetStartedAccount`

```typescript
interface GetStartedAccount {
  'email': string
  'firstname': string
  'google_token_id': string
  'lastname': string
  'microsoft_token_id': string
}
```




#### `GetstartedQuery`

```typescript
interface GetstartedQuery {
  'redirect_url': string
}
```




#### `JoinRequest`

```typescript
interface JoinRequest {
  'automatic_leave': import("@meeting-baas/sdk/models/join-request-automatic-leave").JoinRequestAutomaticLeave
  'bot_image': string
  'botName': string
  'deduplication_key': string
  'entry_message': string
  'extra': { [key: string]: any; }
  'meetingUrl': string
  'recording_mode': import("@meeting-baas/sdk/models/join-request-recording-mode").JoinRequestRecordingMode
  'reserved': boolean
  'speech_to_text': import("@meeting-baas/sdk/models/join-request-speech-to-text").JoinRequestSpeechToText
  'start_time': number
  'streaming': import("@meeting-baas/sdk/models/join-request-streaming").JoinRequestStreaming
  'webhook_url': string
}
```




#### `JoinRequestAutomaticLeave`

```typescript
interface JoinRequestAutomaticLeave {
  'noone_joined_timeout': number
  'waiting_room_timeout': number
}
```




#### `JoinRequestRecordingMode`

```typescript
interface JoinRequestRecordingMode {
  
}
```




#### `JoinRequestScheduled`

```typescript
interface JoinRequestScheduled {
  'botParamId': number
  'meetingUrl': string
  'scheduleOrigin': import("@meeting-baas/sdk/models/schedule-origin").ScheduleOrigin
}
```




#### `JoinRequestSpeechToText`

```typescript
interface JoinRequestSpeechToText {
  'api_key': string
  'provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
}
```




#### `JoinRequestStreaming`

```typescript
interface JoinRequestStreaming {
  'audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'input': string
  'output': string
}
```




#### `JoinResponse`

```typescript
interface JoinResponse {
  'botId': string
}
```




#### `JoinResponse2`

```typescript
interface JoinResponse2 {
  'botId': string
}
```




#### `LeaveResponse`

```typescript
interface LeaveResponse {
  'ok': boolean
}
```




#### `ListEventResponse`

```typescript
interface ListEventResponse {
  'data': import("@meeting-baas/sdk/models/event").Event[]
  'next': string
}
```




#### `ListRawCalendarsParams`

```typescript
interface ListRawCalendarsParams {
  'oauthClientId': string
  'oauthClientSecret': string
  'oauthRefreshToken': string
  'platform': import("@meeting-baas/sdk/models/provider").Provider
}
```




#### `ListRawCalendarsResponse`

```typescript
interface ListRawCalendarsResponse {
  'calendars': import("@meeting-baas/sdk/models/calendar-list-entry").CalendarListEntry[]
}
```




#### `ListRecentBotsQuery`

```typescript
interface ListRecentBotsQuery {
  'bot_name': string
  'created_after': string
  'created_before': string
  'cursor': string
  'filter_by_extra': string
  'limit': number
  'meeting_url': string
  'sort_by_extra': string
  'speaker_name': string
}
```




#### `ListRecentBotsResponse`

```typescript
interface ListRecentBotsResponse {
  'lastUpdated': string
  'next_cursor': string
  'recentBots': import("@meeting-baas/sdk/models/recent-bot-entry").RecentBotEntry[]
}
```




#### `LoginAccount`

```typescript
interface LoginAccount {
  'app_signin_token': string
  'google_chrome_token_id': string
  'google_token_id': string
  'microsoft_token_id': string
  'password': string
  'pseudo': string
}
```




#### `LoginQuery`

```typescript
interface LoginQuery {
  'redirect_url': string
}
```




#### `Metadata`

```typescript
interface Metadata {
  'botData': import("@meeting-baas/sdk/models/bot-data").BotData
  'contentDeleted': boolean
  'duration': number
  'mp4': string
}
```




#### `QueryListEvent`

```typescript
interface QueryListEvent {
  'attendee_email': string
  'calendarId': string
  'cursor': string
  'organizer_email': string
  'start_date_gte': string
  'start_date_lte': string
  'status': string
  'updated_at_gte': string
}
```




#### `QueryPatchRecordEvent`

```typescript
interface QueryPatchRecordEvent {
  'all_occurrences': boolean
}
```




#### `QueryScheduleRecordEvent`

```typescript
interface QueryScheduleRecordEvent {
  'all_occurrences': boolean
}
```




#### `QueryUnScheduleRecordEvent`

```typescript
interface QueryUnScheduleRecordEvent {
  'all_occurrences': boolean
}
```




#### `ReceivedMessageQuery`

```typescript
interface ReceivedMessageQuery {
  'sessionId': string
}
```




#### `RecentBotEntry`

```typescript
interface RecentBotEntry {
  'access_count': number
  'contentDeleted': boolean
  'createdAt': string
  'duration': number
  'ended_at': string
  'extra': { [key: string]: any; }
  'id': string
  'last_accessed_at': string
  'meetingUrl': string
  'name': string
  'session_id': string
  'speakers': string[]
}
```




#### `RecognizerWord`

```typescript
interface RecognizerWord {
  'endTime': number
  'startTime': number
  'text': string
  'user_id': number
}
```




#### `ResyncAllCalendarsResponse`

```typescript
interface ResyncAllCalendarsResponse {
  'errors': any[][]
  'syncedCalendars': string[]
}
```




#### `ResyncAllResponse`

```typescript
interface ResyncAllResponse {
  'errors': any[][]
  'syncedCalendars': string[]
}
```




#### `RetranscribeBody`

```typescript
interface RetranscribeBody {
  'botUuid': string
  'speech_to_text': import("@meeting-baas/sdk/models/speech-to-text").SpeechToText
  'webhook_url': string
}
```




#### `ScheduleOriginOneOf`

```typescript
interface ScheduleOriginOneOf {
  'Event': import("@meeting-baas/sdk/models/schedule-origin-one-of-event").ScheduleOriginOneOfEvent
}
```




#### `ScheduleOriginOneOf1`

```typescript
interface ScheduleOriginOneOf1 {
  'ScheduledBot': import("@meeting-baas/sdk/models/schedule-origin-one-of-event").ScheduleOriginOneOfEvent
}
```




#### `ScheduleOriginOneOfEvent`

```typescript
interface ScheduleOriginOneOfEvent {
  'id': number
}
```




#### `SpeechToText`

```typescript
interface SpeechToText {
  'api_key': string
  'provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
}
```




#### `SpeechToTextApiParameter`

```typescript
interface SpeechToTextApiParameter {
  'api_key': string
  'provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
}
```




#### `StartRecordFailedQuery`

```typescript
interface StartRecordFailedQuery {
  'bot_uuid': string
}
```




#### `StreamingApiParameter`

```typescript
interface StreamingApiParameter {
  'audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'input': string
  'output': string
}
```




#### `SyncResponse`

```typescript
interface SyncResponse {
  'affected_event_uuids': string[]
  'has_updates': string
}
```




#### `SystemTime`

```typescript
interface SystemTime {
  'nanosSinceEpoch': number
  'secsSinceEpoch': number
}
```




#### `TokenConsumptionByService`

```typescript
interface TokenConsumptionByService {
  'duration': string
  'recordingTokens': string
  'streamingInputHour': string
  'streamingInputTokens': string
  'streamingOutputHour': string
  'streamingOutputTokens': string
  'transcriptionByokHour': string
  'transcriptionByokTokens': string
  'transcriptionHour': string
  'transcriptionTokens': string
}
```




#### `TokenConsumptionQuery`

```typescript
interface TokenConsumptionQuery {
  'endDate': string
  'startDate': string
}
```




#### `Transcript`

```typescript
interface Transcript {
  'botId': number
  'end_time': number
  'id': number
  'lang': string
  'speaker': string
  'startTime': number
  'user_id': number
  'words': import("@meeting-baas/sdk/models/word").Word[]
}
```




#### `Transcript2`

```typescript
interface Transcript2 {
  'botId': number
  'end_time': number
  'lang': string
  'speaker': string
  'startTime': number
  'user_id': number
}
```




#### `Transcript3`

```typescript
interface Transcript3 {
  'botId': number
  'end_time': number
  'id': number
  'lang': string
  'speaker': string
  'startTime': number
  'user_id': number
}
```




#### `Transcript4`

```typescript
interface Transcript4 {
  'bot_id': number
  'end_time': number
  'id': number
  'lang': string
  'speaker': string
  'start_time': number
  'user_id': number
}
```




#### `UpdateCalendarParams`

```typescript
interface UpdateCalendarParams {
  'oauthClientId': string
  'oauthClientSecret': string
  'oauthRefreshToken': string
  'platform': import("@meeting-baas/sdk/models/provider").Provider
}
```




#### `UserTokensResponse`

```typescript
interface UserTokensResponse {
  'availableTokens': string
  'last_purchase_date': string
  'totalTokensPurchased': string
}
```




#### `Version`

```typescript
interface Version {
  'buildDate': string
  'buildTimestamp': string
  'location': string
}
```




#### `Word`

```typescript
interface Word {
  'botId': number
  'endTime': number
  'id': number
  'startTime': number
  'text': string
  'user_id': number
}
```






---

## Getting Started

Learn how to install and use the Meeting BaaS TypeScript SDK.

### Source: ./content/docs/typescript-sdk/getting-started.mdx


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
import { BaasClient } from "@meeting-baas/sdk";

// Create a BaaS client
const client = new BaasClient({
  apiKey: "your-api-key", // Get yours at https://meetingbaas.com
});
```

<Callout type="warn">
  Make sure to keep your API key secure and never expose it in client-side code.
</Callout>

</Step>

<Step>
### Join a Meeting

Use the client to join a meeting with a bot:

```typescript
// Join a meeting
const botId = await client.joinMeeting({
  botName: "Meeting Assistant",
  meetingUrl: "https://meet.google.com/abc-def-ghi",
  reserved: true,
});

// Get meeting data
const meetingData = await client.getMeetingData(botId);
console.log("Meeting data:", meetingData);
```

</Step>

<Step>
### Handle Webhooks

Set up webhook handling to receive real-time updates about your meetings:

```typescript
// Set up webhook handling
client.on("complete", (data) => {
  console.log("Meeting completed:", data);
});

client.on("failed", (data) => {
  console.log("Meeting failed:", data);
});
```

For more information about webhooks, see the [Webhooks documentation](/docs/typescript-sdk/reference/webhooks).

</Step>
</Steps> 

---

## Introduction

Official SDK for interacting with the Meeting BaaS API

### Source: ./content/docs/typescript-sdk/index.mdx


## Introduction

The **Meeting BaaS SDK** is the officially supported TypeScript package that empowers developers to integrate with the Meeting BaaS API - the universal interface for automating meetings across Google Meet, Zoom, and Microsoft Teams. This SDK provides:

- Complete type safety with comprehensive TypeScript definitions
- Automatic updates synced with our OpenAPI specification
- Simplified access to all meeting automation capabilities
- Cross-platform consistency for all supported meeting providers

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
  <Card title="BaaS API Client" icon={<Code className="text-blue-400" />}>
    Strongly typed functions for interacting with the complete Meeting BaaS API,
    providing access to all endpoints with full TypeScript support.
  </Card>
  <Card title="Bot Management" icon={<Bot className="text-green-400" />}>
    Create, join, and manage meeting bots across platforms including Google
    Meet, Zoom, and Microsoft Teams.
  </Card>
  <Card
    title="Calendar Integration"
    icon={<Calendar className="text-purple-400" />}
  >
    Connect calendars and automatically schedule meeting recordings with support
    for multiple providers.
  </Card>
  <Card
    title="Complete API Coverage"
    icon={<CheckCircle className="text-teal-400" />}
  >
    Access to all Meeting BaaS API endpoints with consistent, well-documented
    interfaces.
  </Card>
  <Card
    title="TypeScript Support"
    icon={<FileType className="text-orange-400" />}
  >
    Full TypeScript definitions for all APIs, including request/response types
    and error handling.
  </Card>
  <Card
    title="MPC Tool Integration"
    icon={<Wrench className="text-yellow-400" />}
  >
    Pre-generated MPC tools for easy integration with AI systems and simple
    registration process.
  </Card>
  <Card title="CLI Interface" icon={<Terminal className="text-red-400" />}>
    Command-line tools included for common operations and quick testing.
  </Card>
  <Card
    title="Automatic Tool Generation"
    icon={<Cog className="text-indigo-400" />}
  >
    MPC tools automatically generated for all SDK methods, ensuring consistency.
  </Card>
  <Card
    title="Combined Package Mode"
    icon={<Package className="text-pink-400" />}
  >
    Special optimized bundle available for MPC server installations.
  </Card>
</Cards>

## Learn More

<Cards>
  <Card
    title="Getting Started"
    icon={<Zap />}
    href="/docs/typescript-sdk/getting-started"
  >
    Quick start guide with installation and basic usage examples.
  </Card>
  <Card
    title="API Reference"
    icon={<FileText />}
    href="/docs/typescript-sdk/reference"
  >
    Complete API documentation for all SDK methods and types.
  </Card>
  <Card
    title="MPC Tools"
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
</Cards>


---

## Integration

The Meeting BaaS SDK comes with pre-generated MPC (Model Context Protocol) tools that can be easily integrated with any MPC server implementation. These tools are bundled by default and can be imported directly.

### Source: ./content/docs/typescript-sdk/integration.mdx


## MPC Server Integration

The SDK includes pre-generated MPC (Model Context Protocol) tools that can be easily integrated with any MPC server implementation:

### Simple Integration

The simplest way to use the MPC tools:

```typescript
import { allTools, registerTools } from '@meeting-baas/sdk/tools';
import { BaasClient } from '@meeting-baas/sdk';

// Create a BaaS client with your API key
const client = new BaasClient({
  apiKey: process.env.MEETING_BAAS_API_KEY,
});

// Register all tools with your MPC server
// Replace registerTool with your server's registration function
registerTools(allTools, (tool) => {
  server.registerTool(tool);
});
```

### One-Line Setup

For even simpler integration, use the setupBaasTools convenience function:

```typescript
import { allTools, setupBaasTools } from '@meeting-baas/sdk/tools';

// Create a client and register all tools in one step
const client = setupBaasTools(
  allTools,
  server.registerTool,
  process.env.MEETING_BAAS_API_KEY,
);
```

### Calendar Integration

For calendar integration:

```typescript
import { BaasClient, Provider } from '@meeting-baas/sdk';

const client = new BaasClient({
  apiKey: 'your-api-key',
});

// Create a calendar integration
const calendar = await client.createCalendar({
  oauthClientId: 'your-oauth-client-id',
  oauthClientSecret: 'your-oauth-client-secret',
  oauthRefreshToken: 'your-oauth-refresh-token',
  platform: Provider.Google,
});

// List all calendars
const calendars = await client.listCalendars();

// List events from a calendar
const events = await client.listEvents(calendar.uuid);

// Schedule a recording for an event
await client.scheduleRecordEvent(events[0].uuid, {
  botName: 'Event Recording Bot',
  extra: { customId: 'my-event-123' },
});
```


---

## MPC Tools

The Meeting BaaS SDK comes with pre-generated MPC (Model Context Protocol) tools that can be easily integrated with any MPC server implementation. These tools are bundled by default and can be imported directly.

### Source: ./content/docs/typescript-sdk/mpc-tools.mdx


## Available MPC Tools

The SDK includes pre-generated MPC tools for all API endpoints that can be directly imported and used in your MPC server implementation.

### Using MPC Tools

The Meeting BaaS SDK provides MPC tools with zero configuration. You can import and use them directly:

```typescript
// Import specific tools
import {
  join_meeting_tool,
  leave_meeting_tool,
  get_meeting_data_tool,
} from '@meeting-baas/sdk/tools';

// Import all tools
import { allTools } from '@meeting-baas/sdk/tools';

// Register with your MPC server
import { register_tool } from 'your-mpc-server';

// Register individual tools
register_tool(join_meeting_tool);
register_tool(get_meeting_data_tool);

// Or register all tools at once
import { registerTools } from '@meeting-baas/sdk/tools';
await registerTools(allTools, register_tool);
```

### MPC Server Bundle Mode

For MPC server deployments, use the combined package mode:

```typescript
import { BaasClient, registerTools, SDK_MODE } from "@meeting-baas/sdk/tools";
import { allTools } from "@meeting-baas/sdk/tools";

// Verify we're using the MPC tools package
console.log(`SDK Mode: ${SDK_MODE}`); // Outputs: SDK Mode: MPC_TOOLS

// Create a BaaS client
const client = new BaasClient({
  apiKey: "your-api-key",
});

// Register all tools with your MPC server
import { register_tool } from "your-mpc-server";
await registerTools(allTools, register_tool);
```

## Generated MPC Tools List

All SDK methods are automatically converted to snake_case MPC tools. Here's the complete list organized by API category:

### Bots API Tools
- `join_meeting_tool` - Joins a meeting as a bot
- `leave_meeting_tool` - Leaves a meeting
- `get_meeting_data_tool` - Retrieves meeting data
- `delete_data_tool` - Deletes bot data
- `bots_with_metadata_tool` - Lists bots with metadata
- `list_recent_bots_tool` - Lists recently used bots
- `retranscribe_bot_tool` - Retranscribes bot recordings

### Calendars API Tools
- `create_calendar_tool` - Creates a new calendar
- `delete_calendar_tool` - Deletes a calendar
- `get_calendar_tool` - Retrieves calendar details

### Webhooks API Tools
- `bot_webhook_documentation_tool` - Provides bot webhook docs
- `calendar_webhook_documentation_tool` - Provides calendar webhook docs
- `webhook_documentation_tool` - General webhook documentation


---

## Quick Start

Comprehensive guide for integrating with Meeting BaaS services.

### Source: ./content/docs/typescript-sdk/quick-start.mdx


```typescript
import { BaasClient } from '@meeting-baas/sdk';

// Create a BaaS client
const client = new BaasClient({
  apiKey: 'your-api-key', // Get yours at https://meetingbaas.com
});

// Join a meeting
const botId = await client.joinMeeting({
  botName: 'Meeting Assistant',
  meetingUrl: 'https://meet.google.com/abc-def-ghi',
  reserved: true,
});

// Get meeting data
const meetingData = await client.getMeetingData(botId);
console.log('Meeting data:', meetingData);
```

## Usage Examples

### Basic Usage

```typescript
import { BaasClient } from '@meeting-baas/sdk';

// Create a BaaS client
const client = new BaasClient({
  apiKey: 'your-api-key',
});

// Join a meeting
const botId = await client.joinMeeting({
  botName: 'My Assistant',
  meetingUrl: 'https://meet.google.com/abc-def-ghi',
  reserved: true,
});

// Get meeting data
const meetingData = await client.getMeetingData(botId);
console.log('Meeting data:', meetingData);

// Delete meeting data
await client.deleteData(botId);
```

### Using MPC Tools

```typescript
import { register_tool } from 'your-mpc-server';
import {
  join_meeting_tool,
  get_meeting_data_tool,
  delete_data_tool,
} from '@meeting-baas/sdk/tools';

// Register tools with your MPC server
register_tool(join_meeting_tool);
register_tool(get_meeting_data_tool);
register_tool(delete_data_tool);

// Or import all tools at once
import { allTools, registerTools } from '@meeting-baas/sdk/tools';
await registerTools(allTools, register_tool);
```

### MPC Server Bundle Mode

For MPC server deployments, use the combined package mode:

```typescript
import { BaasClient, Provider } from '@meeting-baas/sdk';

const client = new BaasClient({
  apiKey: 'your-api-key',
});

// Create a calendar integration
const calendar = await client.createCalendar({
  oauthClientId: 'your-oauth-client-id',
  oauthClientSecret: 'your-oauth-client-secret',
  oauthRefreshToken: 'your-oauth-refresh-token',
  platform: Provider.Google,
});

// List all calendars
const calendars = await client.listCalendars();

// List events from a calendar
const events = await client.listEvents(calendar.uuid);

// Schedule a recording for an event
await client.scheduleRecordEvent(events[0].uuid, {
  botName: 'Event Recording Bot',
  extra: { customId: 'my-event-123' },
});
```


---

## botsWithMetadata

### Source: ./content/docs/typescript-sdk/reference/bots/botswithmetadata.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
botsWithMetadata(requestParameters: import("@meeting-baas/sdk/api/default-api").DefaultApiBotsWithMetadataRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/default-api").DefaultApiBotsWithMetadataRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

No common use cases documented yet.

## Related Methods




---

## DefaultApiBotsWithMetadataRequest

### Source: ./content/docs/typescript-sdk/reference/bots/defaultapibotswithmetadatarequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface DefaultApiBotsWithMetadataRequest {
  botName: string
  createdAfter: string
  createdBefore: string
  cursor: string
  filterByExtra: string
  limit: number
  meetingUrl: string
  sortByExtra: string
  speakerName: string
}
```


---

## DefaultApiGetMeetingDataRequest

### Source: ./content/docs/typescript-sdk/reference/bots/defaultapigetmeetingdatarequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface DefaultApiGetMeetingDataRequest {
  botId: string
}
```


---

## DefaultApiInterface

### Source: ./content/docs/typescript-sdk/reference/bots/defaultapiinterface.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface DefaultApiInterface {
  
}
```


---

## DefaultApiJoinRequest

### Source: ./content/docs/typescript-sdk/reference/bots/defaultapijoinrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface DefaultApiJoinRequest {
  joinRequest: import("@meeting-baas/sdk/models/join-request").JoinRequest
}
```


---

## DefaultApiRetranscribeBotRequest

### Source: ./content/docs/typescript-sdk/reference/bots/defaultapiretranscribebotrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface DefaultApiRetranscribeBotRequest {
  retranscribeBody: import("@meeting-baas/sdk/models/retranscribe-body").RetranscribeBody
}
```


---

## deleteData

### Source: ./content/docs/typescript-sdk/reference/bots/deletedata.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
deleteData(options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Removing meeting data for privacy
- Cleaning up old meeting records
- Managing storage usage
- Handling data retention policies

## Related Methods

- [join](./join.mdx)
- [getMeetingData](./getmeetingdata.mdx)


---

## getMeetingData

### Source: ./content/docs/typescript-sdk/reference/bots/getmeetingdata.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
getMeetingData(requestParameters: import("@meeting-baas/sdk/api/default-api").DefaultApiGetMeetingDataRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/default-api").DefaultApiGetMeetingDataRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`


## Example

<Callout type="info">
  Example:
  
  ```typescript
  // Get meeting data
const meetingData = await client.getMeetingData(botId);
console.log("Meeting data:", meetingData);
  ```
</Callout>


## Common Use Cases

- Retrieving meeting transcripts
- Accessing meeting metadata
- Getting bot status and configuration
- Downloading meeting recordings

## Related Methods

- [join](./join.mdx)
- [leave](./leave.mdx)
- [deleteData](./deletedata.mdx)


---

## Bots

Bots API Reference

### Source: ./content/docs/typescript-sdk/reference/bots/index.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

- [botsWithMetadata](/docs/typescript-sdk/reference/bots/botswithmetadata)
- [deleteData](/docs/typescript-sdk/reference/bots/deletedata)
- [getMeetingData](/docs/typescript-sdk/reference/bots/getmeetingdata)
- [join](/docs/typescript-sdk/reference/bots/join)
- [leave](/docs/typescript-sdk/reference/bots/leave)
- [retranscribeBot](/docs/typescript-sdk/reference/bots/retranscribebot)
- [DefaultApiInterface](/docs/typescript-sdk/reference/bots/defaultapiinterface)
- [DefaultApiBotsWithMetadataRequest](/docs/typescript-sdk/reference/bots/defaultapibotswithmetadatarequest)
- [DefaultApiGetMeetingDataRequest](/docs/typescript-sdk/reference/bots/defaultapigetmeetingdatarequest)
- [DefaultApiJoinRequest](/docs/typescript-sdk/reference/bots/defaultapijoinrequest)
- [DefaultApiRetranscribeBotRequest](/docs/typescript-sdk/reference/bots/defaultapiretranscribebotrequest)


---

## join

### Source: ./content/docs/typescript-sdk/reference/bots/join.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
join(requestParameters: import("@meeting-baas/sdk/api/default-api").DefaultApiJoinRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/default-api").DefaultApiJoinRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Joining a meeting with a bot for recording
- Setting up a bot with custom parameters
- Configuring webhook notifications for a specific bot
- Starting a meeting recording with automatic transcription

## Related Methods

- [leave](./leave.mdx)
- [getMeetingData](./getmeetingdata.mdx)
- [deleteData](./deletedata.mdx)


---

## leave

### Source: ./content/docs/typescript-sdk/reference/bots/leave.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
leave(options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Ending a bot's participation in a meeting
- Stopping a meeting recording
- Cleaning up bot resources after a meeting
- Handling meeting completion

## Related Methods

- [join](./join.mdx)
- [getMeetingData](./getmeetingdata.mdx)


---

## retranscribeBot

### Source: ./content/docs/typescript-sdk/reference/bots/retranscribebot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
retranscribeBot(requestParameters: import("@meeting-baas/sdk/api/default-api").DefaultApiRetranscribeBotRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/default-api").DefaultApiRetranscribeBotRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

No common use cases documented yet.

## Related Methods




---

## CalendarsApiCreateCalendarRequest

### Source: ./content/docs/typescript-sdk/reference/calendars/calendarsapicreatecalendarrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarsApiCreateCalendarRequest {
  createCalendarParams: import("@meeting-baas/sdk/models/create-calendar-params").CreateCalendarParams
}
```


---

## CalendarsApiInterface

### Source: ./content/docs/typescript-sdk/reference/calendars/calendarsapiinterface.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarsApiInterface {
  
}
```


---

## CalendarsApiListEventsRequest

### Source: ./content/docs/typescript-sdk/reference/calendars/calendarsapilisteventsrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarsApiListEventsRequest {
  calendarId: string
  attendeeEmail: string
  cursor: string
  organizerEmail: string
  startDateGte: string
  startDateLte: string
  status: string
  updatedAtGte: string
}
```


---

## CalendarsApiListRawCalendarsRequest

### Source: ./content/docs/typescript-sdk/reference/calendars/calendarsapilistrawcalendarsrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarsApiListRawCalendarsRequest {
  listRawCalendarsParams: import("@meeting-baas/sdk/models/list-raw-calendars-params").ListRawCalendarsParams
}
```


---

## CalendarsApiPatchBotRequest

### Source: ./content/docs/typescript-sdk/reference/calendars/calendarsapipatchbotrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarsApiPatchBotRequest {
  botParam3: import("@meeting-baas/sdk/models/bot-param3").BotParam3
  allOccurrences: boolean
}
```


---

## CalendarsApiScheduleRecordEventRequest

### Source: ./content/docs/typescript-sdk/reference/calendars/calendarsapischedulerecordeventrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarsApiScheduleRecordEventRequest {
  botParam2: import("@meeting-baas/sdk/models/bot-param2").BotParam2
  allOccurrences: boolean
}
```


---

## CalendarsApiUnscheduleRecordEventRequest

### Source: ./content/docs/typescript-sdk/reference/calendars/calendarsapiunschedulerecordeventrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarsApiUnscheduleRecordEventRequest {
  allOccurrences: boolean
}
```


---

## CalendarsApiUpdateCalendarRequest

### Source: ./content/docs/typescript-sdk/reference/calendars/calendarsapiupdatecalendarrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarsApiUpdateCalendarRequest {
  updateCalendarParams: import("@meeting-baas/sdk/models/update-calendar-params").UpdateCalendarParams
}
```


---

## createCalendar

### Source: ./content/docs/typescript-sdk/reference/calendars/createcalendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
createCalendar(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiCreateCalendarRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/calendars-api").CalendarsApiCreateCalendarRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`


## Example

<Callout type="info">
  Example:
  
  ```typescript
  // Create a calendar integration
const calendar = await client.createCalendar({
  oauthClientId: "your-oauth-client-id",
  oauthClientSecret: "your-oauth-client-secret",
  oauthRefreshToken: "your-oauth-refresh-token",
  platform: Provider.Google,
});
  ```
</Callout>


## Common Use Cases

- Setting up Google Calendar integration
- Connecting Microsoft Teams calendar
- Configuring calendar sync settings
- Managing calendar permissions

## Related Methods

- [listCalendars](./listcalendars.mdx)
- [getCalendar](./getcalendar.mdx)
- [updateCalendar](./updatecalendar.mdx)
- [deleteCalendar](./deletecalendar.mdx)


---

## deleteCalendar

### Source: ./content/docs/typescript-sdk/reference/calendars/deletecalendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
deleteCalendar(options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Removing calendar integration
- Cleaning up unused calendars
- Managing calendar connections
- Handling calendar disconnection

## Related Methods

- [createCalendar](./createcalendar.mdx)
- [listCalendars](./listcalendars.mdx)
- [getCalendar](./getcalendar.mdx)
- [updateCalendar](./updatecalendar.mdx)


---

## getCalendar

### Source: ./content/docs/typescript-sdk/reference/calendars/getcalendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
getCalendar(options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Viewing calendar details
- Checking calendar sync status
- Verifying calendar permissions
- Managing calendar settings

## Related Methods

- [createCalendar](./createcalendar.mdx)
- [listCalendars](./listcalendars.mdx)
- [updateCalendar](./updatecalendar.mdx)
- [deleteCalendar](./deletecalendar.mdx)


---

## getEvent

### Source: ./content/docs/typescript-sdk/reference/calendars/getevent.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
getEvent(options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Viewing event details
- Checking recording status
- Managing event settings
- Verifying event configuration

## Related Methods

- [listEvents](./listevents.mdx)
- [scheduleRecordEvent](./schedulerecordevent.mdx)
- [unscheduleRecordEvent](./unschedulerecordevent.mdx)


---

## Calendars

Calendars API Reference

### Source: ./content/docs/typescript-sdk/reference/calendars/index.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

- [createCalendar](/docs/typescript-sdk/reference/calendars/createcalendar)
- [deleteCalendar](/docs/typescript-sdk/reference/calendars/deletecalendar)
- [getCalendar](/docs/typescript-sdk/reference/calendars/getcalendar)
- [getEvent](/docs/typescript-sdk/reference/calendars/getevent)
- [listCalendars](/docs/typescript-sdk/reference/calendars/listcalendars)
- [listEvents](/docs/typescript-sdk/reference/calendars/listevents)
- [listRawCalendars](/docs/typescript-sdk/reference/calendars/listrawcalendars)
- [patchBot](/docs/typescript-sdk/reference/calendars/patchbot)
- [resyncAllCalendars](/docs/typescript-sdk/reference/calendars/resyncallcalendars)
- [scheduleRecordEvent](/docs/typescript-sdk/reference/calendars/schedulerecordevent)
- [unscheduleRecordEvent](/docs/typescript-sdk/reference/calendars/unschedulerecordevent)
- [updateCalendar](/docs/typescript-sdk/reference/calendars/updatecalendar)
- [CalendarsApiInterface](/docs/typescript-sdk/reference/calendars/calendarsapiinterface)
- [CalendarsApiCreateCalendarRequest](/docs/typescript-sdk/reference/calendars/calendarsapicreatecalendarrequest)
- [CalendarsApiListEventsRequest](/docs/typescript-sdk/reference/calendars/calendarsapilisteventsrequest)
- [CalendarsApiListRawCalendarsRequest](/docs/typescript-sdk/reference/calendars/calendarsapilistrawcalendarsrequest)
- [CalendarsApiPatchBotRequest](/docs/typescript-sdk/reference/calendars/calendarsapipatchbotrequest)
- [CalendarsApiScheduleRecordEventRequest](/docs/typescript-sdk/reference/calendars/calendarsapischedulerecordeventrequest)
- [CalendarsApiUnscheduleRecordEventRequest](/docs/typescript-sdk/reference/calendars/calendarsapiunschedulerecordeventrequest)
- [CalendarsApiUpdateCalendarRequest](/docs/typescript-sdk/reference/calendars/calendarsapiupdatecalendarrequest)


---

## listCalendars

### Source: ./content/docs/typescript-sdk/reference/calendars/listcalendars.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
listCalendars(options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Viewing all connected calendars
- Checking calendar sync status
- Managing multiple calendar integrations
- Verifying calendar permissions

## Related Methods

- [createCalendar](./createcalendar.mdx)
- [getCalendar](./getcalendar.mdx)
- [updateCalendar](./updatecalendar.mdx)
- [deleteCalendar](./deletecalendar.mdx)


---

## listEvents

### Source: ./content/docs/typescript-sdk/reference/calendars/listevents.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
listEvents(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiListEventsRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/calendars-api").CalendarsApiListEventsRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`


## Example

<Callout type="info">
  Example:
  
  ```typescript
  // List events from a calendar
const events = await client.listEvents(calendar.uuid, {
  startDateGte: "2024-01-01T00:00:00Z",
  status: "upcoming"
});
  ```
</Callout>


## Common Use Cases

- Viewing upcoming meetings
- Checking scheduled recordings
- Managing calendar events
- Filtering events by date or status

## Related Methods

- [getEvent](./getevent.mdx)
- [scheduleRecordEvent](./schedulerecordevent.mdx)
- [unscheduleRecordEvent](./unschedulerecordevent.mdx)


---

## listRawCalendars

### Source: ./content/docs/typescript-sdk/reference/calendars/listrawcalendars.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
listRawCalendars(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiListRawCalendarsRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/calendars-api").CalendarsApiListRawCalendarsRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

No common use cases documented yet.

## Related Methods




---

## patchBot

### Source: ./content/docs/typescript-sdk/reference/calendars/patchbot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
patchBot(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiPatchBotRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/calendars-api").CalendarsApiPatchBotRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

No common use cases documented yet.

## Related Methods




---

## resyncAllCalendars

### Source: ./content/docs/typescript-sdk/reference/calendars/resyncallcalendars.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
resyncAllCalendars(options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

No common use cases documented yet.

## Related Methods




---

## scheduleRecordEvent

### Source: ./content/docs/typescript-sdk/reference/calendars/schedulerecordevent.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
scheduleRecordEvent(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiScheduleRecordEventRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/calendars-api").CalendarsApiScheduleRecordEventRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Setting up automatic recording
- Configuring bot parameters for an event
- Managing recording schedules
- Setting up recurring recordings

## Related Methods

- [listEvents](./listevents.mdx)
- [getEvent](./getevent.mdx)
- [unscheduleRecordEvent](./unschedulerecordevent.mdx)


---

## unscheduleRecordEvent

### Source: ./content/docs/typescript-sdk/reference/calendars/unschedulerecordevent.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
unscheduleRecordEvent(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiUnscheduleRecordEventRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/calendars-api").CalendarsApiUnscheduleRecordEventRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Canceling scheduled recordings
- Removing bot from events
- Managing recording schedules
- Handling event changes

## Related Methods

- [listEvents](./listevents.mdx)
- [getEvent](./getevent.mdx)
- [scheduleRecordEvent](./schedulerecordevent.mdx)


---

## updateCalendar

### Source: ./content/docs/typescript-sdk/reference/calendars/updatecalendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



## Usage

```typescript
updateCalendar(requestParameters: import("@meeting-baas/sdk/api/calendars-api").CalendarsApiUpdateCalendarRequest, options: RawAxiosRequestConfig): Promise<any>
```

## Parameters


### `requestParameters`

Type: `import("@meeting-baas/sdk/api/calendars-api").CalendarsApiUpdateCalendarRequest`




### `options`

Type: `RawAxiosRequestConfig`




## Returns

`Promise<any>`



## Common Use Cases

- Updating calendar credentials
- Changing calendar sync settings
- Modifying calendar permissions
- Refreshing calendar integration

## Related Methods

- [createCalendar](./createcalendar.mdx)
- [listCalendars](./listcalendars.mdx)
- [getCalendar](./getcalendar.mdx)
- [deleteCalendar](./deletecalendar.mdx)


---

## Account

### Source: ./content/docs/typescript-sdk/reference/common/account.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Account {
  'company_name': string
  'createdAt': import("@meeting-baas/sdk/models/system-time").SystemTime
  'email': string
  'firstname': string
  'id': number
  'lastname': string
  'phone': string
  'status': number
}
```


---

## AccountInfos

### Source: ./content/docs/typescript-sdk/reference/common/accountinfos.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface AccountInfos {
  'account': import("@meeting-baas/sdk/models/account").Account
}
```


---

## ApiKeyResponse

### Source: ./content/docs/typescript-sdk/reference/common/apikeyresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ApiKeyResponse {
  'apiKey': string
}
```


---

## Attendee

### Source: ./content/docs/typescript-sdk/reference/common/attendee.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Attendee {
  'email': string
  'name': string
}
```


---

## AutomaticLeaveRequest

### Source: ./content/docs/typescript-sdk/reference/common/automaticleaverequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface AutomaticLeaveRequest {
  'noone_joined_timeout': number
  'waiting_room_timeout': number
}
```


---

## BaasClientConfig

### Source: ./content/docs/typescript-sdk/reference/common/baasclientconfig.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface BaasClientConfig {
  apiKey: string
  baseUrl: string
}
```


---

## Bot

### Source: ./content/docs/typescript-sdk/reference/common/bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Bot {
  'bot': import("@meeting-baas/sdk/models/bot2").Bot2
  'duration': number
  'params': import("@meeting-baas/sdk/models/bot-param").BotParam
}
```


---

## Bot2

### Source: ./content/docs/typescript-sdk/reference/common/bot2.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Bot2 {
  'accountId': number
  'botParamId': number
  'createdAt': string
  'diarization_v2': boolean
  'endedAt': string
  'errors': string
  'event_id': number
  'id': number
  'meetingUrl': string
  'mp4_s3_path': string
  'reserved': boolean
  'scheduled_bot_id': number
  'session_id': string
  'uuid': string
}
```


---

## BotData

### Source: ./content/docs/typescript-sdk/reference/common/botdata.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface BotData {
  'bot': import("@meeting-baas/sdk/models/bot-with-params").BotWithParams
  'transcripts': import("@meeting-baas/sdk/models/transcript").Transcript[]
}
```


---

## BotPagined

### Source: ./content/docs/typescript-sdk/reference/common/botpagined.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface BotPagined {
  'bots': import("@meeting-baas/sdk/models/bot").Bot[]
  'hasMore': boolean
}
```


---

## BotParam

### Source: ./content/docs/typescript-sdk/reference/common/botparam.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface BotParam {
  'bot_image': string
  'botName': string
  'deduplication_key': string
  'enter_message': string
  'extra': { [key: string]: any; }
  'noone_joined_timeout': number
  'recording_mode': string
  'speech_to_text_api_key': string
  'speech_to_text_provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
  'streaming_audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'streaming_input': string
  'streaming_output': string
  'waiting_room_timeout': number
  'webhookUrl': string
}
```


---

## BotParam2

### Source: ./content/docs/typescript-sdk/reference/common/botparam2.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface BotParam2 {
  'bot_image': string
  'botName': string
  'deduplication_key': string
  'enter_message': string
  'extra': { [key: string]: any; }
  'noone_joined_timeout': number
  'recording_mode': string
  'speech_to_text': import("@meeting-baas/sdk/models/speech-to-text").SpeechToText
  'streaming_audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'streaming_input': string
  'streaming_output': string
  'waiting_room_timeout': number
  'webhook_url': string
}
```


---

## BotParam3

### Source: ./content/docs/typescript-sdk/reference/common/botparam3.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface BotParam3 {
  'bot_image': string
  'bot_name': string
  'deduplication_key': string
  'enter_message': string
  'extra': any
  'noone_joined_timeout': number
  'recording_mode': string
  'speech_to_text': import("@meeting-baas/sdk/models/speech-to-text").SpeechToText
  'streaming_audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'streaming_input': string
  'streaming_output': string
  'waiting_room_timeout': number
  'webhook_url': string
}
```


---

## BotWithParams

### Source: ./content/docs/typescript-sdk/reference/common/botwithparams.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface BotWithParams {
  'accountId': number
  'bot_image': string
  'botName': string
  'botParamId': number
  'createdAt': string
  'deduplication_key': string
  'diarization_v2': boolean
  'endedAt': string
  'enter_message': string
  'errors': string
  'event_id': number
  'extra': { [key: string]: any; }
  'id': number
  'meetingUrl': string
  'mp4_s3_path': string
  'noone_joined_timeout': number
  'recording_mode': string
  'reserved': boolean
  'scheduled_bot_id': number
  'session_id': string
  'speech_to_text_api_key': string
  'speech_to_text_provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
  'streaming_audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'streaming_input': string
  'streaming_output': string
  'uuid': string
  'waiting_room_timeout': number
  'webhookUrl': string
}
```


---

## Calendar

### Source: ./content/docs/typescript-sdk/reference/common/calendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Calendar {
  'email': string
  'googleId': string
  'name': string
  'resource_id': string
  'uuid': string
}
```


---

## CalendarListEntry

### Source: ./content/docs/typescript-sdk/reference/common/calendarlistentry.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CalendarListEntry {
  'email': string
  'id': string
  'isPrimary': boolean
}
```


---

## CreateCalendarParams

### Source: ./content/docs/typescript-sdk/reference/common/createcalendarparams.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CreateCalendarParams {
  'oauthClientId': string
  'oauthClientSecret': string
  'oauthRefreshToken': string
  'platform': import("@meeting-baas/sdk/models/provider").Provider
  'raw_calendar_id': string
}
```


---

## CreateCalendarResponse

### Source: ./content/docs/typescript-sdk/reference/common/createcalendarresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface CreateCalendarResponse {
  'calendar': import("@meeting-baas/sdk/models/calendar").Calendar
}
```


---

## DailyTokenConsumption

### Source: ./content/docs/typescript-sdk/reference/common/dailytokenconsumption.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface DailyTokenConsumption {
  'consumptionByService': import("@meeting-baas/sdk/models/token-consumption-by-service").TokenConsumptionByService
  'date': string
}
```


---

## DeleteResponse

### Source: ./content/docs/typescript-sdk/reference/common/deleteresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface DeleteResponse {
  'ok': boolean
  'status': string
}
```


---

## EndMeetingQuery

### Source: ./content/docs/typescript-sdk/reference/common/endmeetingquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface EndMeetingQuery {
  'botUuid': string
}
```


---

## EndMeetingTrampolineQuery

### Source: ./content/docs/typescript-sdk/reference/common/endmeetingtrampolinequery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface EndMeetingTrampolineQuery {
  'botUuid': string
}
```


---

## EndMeetingTrampolineRequest

### Source: ./content/docs/typescript-sdk/reference/common/endmeetingtrampolinerequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface EndMeetingTrampolineRequest {
  'diarization_v2': boolean
}
```


---

## Event

### Source: ./content/docs/typescript-sdk/reference/common/event.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Event {
  'attendees': import("@meeting-baas/sdk/models/attendee").Attendee[]
  'bot_param': import("@meeting-baas/sdk/models/bot-param").BotParam
  'calendarUuid': string
  'deleted': boolean
  'endTime': string
  'googleId': string
  'isOrganizer': boolean
  'isRecurring': boolean
  'lastUpdatedAt': string
  'meetingUrl': string
  'name': string
  'raw': { [key: string]: any; }
  'recurring_event_id': string
  'startTime': string
  'uuid': string
}
```


---

## FailedRecordRequest

### Source: ./content/docs/typescript-sdk/reference/common/failedrecordrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface FailedRecordRequest {
  'meetingUrl': string
  'message': string
}
```


---

## GetAllBotsQuery

### Source: ./content/docs/typescript-sdk/reference/common/getallbotsquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface GetAllBotsQuery {
  'bot_id': string
  'end_date': string
  'limit': number
  'offset': number
  'start_date': string
}
```


---

## GetMeetingDataQuery

### Source: ./content/docs/typescript-sdk/reference/common/getmeetingdataquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface GetMeetingDataQuery {
  'botId': string
}
```


---

## GetStartedAccount

### Source: ./content/docs/typescript-sdk/reference/common/getstartedaccount.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface GetStartedAccount {
  'email': string
  'firstname': string
  'google_token_id': string
  'lastname': string
  'microsoft_token_id': string
}
```


---

## GetstartedQuery

### Source: ./content/docs/typescript-sdk/reference/common/getstartedquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface GetstartedQuery {
  'redirect_url': string
}
```


---

## Common

Common API Reference

### Source: ./content/docs/typescript-sdk/reference/common/index.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

- [BaasClientConfig](/docs/typescript-sdk/reference/common/baasclientconfig)
- [AccountInfos](/docs/typescript-sdk/reference/common/accountinfos)
- [Account](/docs/typescript-sdk/reference/common/account)
- [ApiKeyResponse](/docs/typescript-sdk/reference/common/apikeyresponse)
- [Attendee](/docs/typescript-sdk/reference/common/attendee)
- [AutomaticLeaveRequest](/docs/typescript-sdk/reference/common/automaticleaverequest)
- [BotData](/docs/typescript-sdk/reference/common/botdata)
- [BotPagined](/docs/typescript-sdk/reference/common/botpagined)
- [BotParam](/docs/typescript-sdk/reference/common/botparam)
- [BotParam2](/docs/typescript-sdk/reference/common/botparam2)
- [BotParam3](/docs/typescript-sdk/reference/common/botparam3)
- [BotWithParams](/docs/typescript-sdk/reference/common/botwithparams)
- [Bot](/docs/typescript-sdk/reference/common/bot)
- [Bot2](/docs/typescript-sdk/reference/common/bot2)
- [CalendarListEntry](/docs/typescript-sdk/reference/common/calendarlistentry)
- [Calendar](/docs/typescript-sdk/reference/common/calendar)
- [CreateCalendarParams](/docs/typescript-sdk/reference/common/createcalendarparams)
- [CreateCalendarResponse](/docs/typescript-sdk/reference/common/createcalendarresponse)
- [DailyTokenConsumption](/docs/typescript-sdk/reference/common/dailytokenconsumption)
- [DeleteResponse](/docs/typescript-sdk/reference/common/deleteresponse)
- [EndMeetingQuery](/docs/typescript-sdk/reference/common/endmeetingquery)
- [EndMeetingTrampolineQuery](/docs/typescript-sdk/reference/common/endmeetingtrampolinequery)
- [EndMeetingTrampolineRequest](/docs/typescript-sdk/reference/common/endmeetingtrampolinerequest)
- [Event](/docs/typescript-sdk/reference/common/event)
- [FailedRecordRequest](/docs/typescript-sdk/reference/common/failedrecordrequest)
- [GetAllBotsQuery](/docs/typescript-sdk/reference/common/getallbotsquery)
- [GetMeetingDataQuery](/docs/typescript-sdk/reference/common/getmeetingdataquery)
- [GetStartedAccount](/docs/typescript-sdk/reference/common/getstartedaccount)
- [GetstartedQuery](/docs/typescript-sdk/reference/common/getstartedquery)
- [JoinRequestAutomaticLeave](/docs/typescript-sdk/reference/common/joinrequestautomaticleave)
- [JoinRequestRecordingMode](/docs/typescript-sdk/reference/common/joinrequestrecordingmode)
- [JoinRequestScheduled](/docs/typescript-sdk/reference/common/joinrequestscheduled)
- [JoinRequestSpeechToText](/docs/typescript-sdk/reference/common/joinrequestspeechtotext)
- [JoinRequestStreaming](/docs/typescript-sdk/reference/common/joinrequeststreaming)
- [JoinRequest](/docs/typescript-sdk/reference/common/joinrequest)
- [JoinResponse](/docs/typescript-sdk/reference/common/joinresponse)
- [JoinResponse2](/docs/typescript-sdk/reference/common/joinresponse2)
- [LeaveResponse](/docs/typescript-sdk/reference/common/leaveresponse)
- [ListEventResponse](/docs/typescript-sdk/reference/common/listeventresponse)
- [ListRawCalendarsParams](/docs/typescript-sdk/reference/common/listrawcalendarsparams)
- [ListRawCalendarsResponse](/docs/typescript-sdk/reference/common/listrawcalendarsresponse)
- [ListRecentBotsQuery](/docs/typescript-sdk/reference/common/listrecentbotsquery)
- [ListRecentBotsResponse](/docs/typescript-sdk/reference/common/listrecentbotsresponse)
- [LoginAccount](/docs/typescript-sdk/reference/common/loginaccount)
- [LoginQuery](/docs/typescript-sdk/reference/common/loginquery)
- [Metadata](/docs/typescript-sdk/reference/common/metadata)
- [QueryListEvent](/docs/typescript-sdk/reference/common/querylistevent)
- [QueryPatchRecordEvent](/docs/typescript-sdk/reference/common/querypatchrecordevent)
- [QueryScheduleRecordEvent](/docs/typescript-sdk/reference/common/queryschedulerecordevent)
- [QueryUnScheduleRecordEvent](/docs/typescript-sdk/reference/common/queryunschedulerecordevent)
- [ReceivedMessageQuery](/docs/typescript-sdk/reference/common/receivedmessagequery)
- [RecentBotEntry](/docs/typescript-sdk/reference/common/recentbotentry)
- [RecognizerWord](/docs/typescript-sdk/reference/common/recognizerword)
- [ResyncAllCalendarsResponse](/docs/typescript-sdk/reference/common/resyncallcalendarsresponse)
- [ResyncAllResponse](/docs/typescript-sdk/reference/common/resyncallresponse)
- [RetranscribeBody](/docs/typescript-sdk/reference/common/retranscribebody)
- [ScheduleOriginOneOfEvent](/docs/typescript-sdk/reference/common/scheduleoriginoneofevent)
- [ScheduleOriginOneOf](/docs/typescript-sdk/reference/common/scheduleoriginoneof)
- [ScheduleOriginOneOf1](/docs/typescript-sdk/reference/common/scheduleoriginoneof1)
- [SpeechToTextApiParameter](/docs/typescript-sdk/reference/common/speechtotextapiparameter)
- [SpeechToText](/docs/typescript-sdk/reference/common/speechtotext)
- [StartRecordFailedQuery](/docs/typescript-sdk/reference/common/startrecordfailedquery)
- [StreamingApiParameter](/docs/typescript-sdk/reference/common/streamingapiparameter)
- [SyncResponse](/docs/typescript-sdk/reference/common/syncresponse)
- [SystemTime](/docs/typescript-sdk/reference/common/systemtime)
- [TokenConsumptionByService](/docs/typescript-sdk/reference/common/tokenconsumptionbyservice)
- [TokenConsumptionQuery](/docs/typescript-sdk/reference/common/tokenconsumptionquery)
- [Transcript](/docs/typescript-sdk/reference/common/transcript)
- [Transcript2](/docs/typescript-sdk/reference/common/transcript2)
- [Transcript3](/docs/typescript-sdk/reference/common/transcript3)
- [Transcript4](/docs/typescript-sdk/reference/common/transcript4)
- [UpdateCalendarParams](/docs/typescript-sdk/reference/common/updatecalendarparams)
- [UserTokensResponse](/docs/typescript-sdk/reference/common/usertokensresponse)
- [Version](/docs/typescript-sdk/reference/common/version)
- [Word](/docs/typescript-sdk/reference/common/word)


---

## JoinRequest

### Source: ./content/docs/typescript-sdk/reference/common/joinrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface JoinRequest {
  'automatic_leave': import("@meeting-baas/sdk/models/join-request-automatic-leave").JoinRequestAutomaticLeave
  'bot_image': string
  'botName': string
  'deduplication_key': string
  'entry_message': string
  'extra': { [key: string]: any; }
  'meetingUrl': string
  'recording_mode': import("@meeting-baas/sdk/models/join-request-recording-mode").JoinRequestRecordingMode
  'reserved': boolean
  'speech_to_text': import("@meeting-baas/sdk/models/join-request-speech-to-text").JoinRequestSpeechToText
  'start_time': number
  'streaming': import("@meeting-baas/sdk/models/join-request-streaming").JoinRequestStreaming
  'webhook_url': string
}
```


---

## JoinRequestAutomaticLeave

### Source: ./content/docs/typescript-sdk/reference/common/joinrequestautomaticleave.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface JoinRequestAutomaticLeave {
  'noone_joined_timeout': number
  'waiting_room_timeout': number
}
```


---

## JoinRequestRecordingMode

### Source: ./content/docs/typescript-sdk/reference/common/joinrequestrecordingmode.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface JoinRequestRecordingMode {
  
}
```


---

## JoinRequestScheduled

### Source: ./content/docs/typescript-sdk/reference/common/joinrequestscheduled.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface JoinRequestScheduled {
  'botParamId': number
  'meetingUrl': string
  'scheduleOrigin': import("@meeting-baas/sdk/models/schedule-origin").ScheduleOrigin
}
```


---

## JoinRequestSpeechToText

### Source: ./content/docs/typescript-sdk/reference/common/joinrequestspeechtotext.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface JoinRequestSpeechToText {
  'api_key': string
  'provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
}
```


---

## JoinRequestStreaming

### Source: ./content/docs/typescript-sdk/reference/common/joinrequeststreaming.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface JoinRequestStreaming {
  'audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'input': string
  'output': string
}
```


---

## JoinResponse

### Source: ./content/docs/typescript-sdk/reference/common/joinresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface JoinResponse {
  'botId': string
}
```


---

## JoinResponse2

### Source: ./content/docs/typescript-sdk/reference/common/joinresponse2.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface JoinResponse2 {
  'botId': string
}
```


---

## LeaveResponse

### Source: ./content/docs/typescript-sdk/reference/common/leaveresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface LeaveResponse {
  'ok': boolean
}
```


---

## ListEventResponse

### Source: ./content/docs/typescript-sdk/reference/common/listeventresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ListEventResponse {
  'data': import("@meeting-baas/sdk/models/event").Event[]
  'next': string
}
```


---

## ListRawCalendarsParams

### Source: ./content/docs/typescript-sdk/reference/common/listrawcalendarsparams.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ListRawCalendarsParams {
  'oauthClientId': string
  'oauthClientSecret': string
  'oauthRefreshToken': string
  'platform': import("@meeting-baas/sdk/models/provider").Provider
}
```


---

## ListRawCalendarsResponse

### Source: ./content/docs/typescript-sdk/reference/common/listrawcalendarsresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ListRawCalendarsResponse {
  'calendars': import("@meeting-baas/sdk/models/calendar-list-entry").CalendarListEntry[]
}
```


---

## ListRecentBotsQuery

### Source: ./content/docs/typescript-sdk/reference/common/listrecentbotsquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ListRecentBotsQuery {
  'bot_name': string
  'created_after': string
  'created_before': string
  'cursor': string
  'filter_by_extra': string
  'limit': number
  'meeting_url': string
  'sort_by_extra': string
  'speaker_name': string
}
```


---

## ListRecentBotsResponse

### Source: ./content/docs/typescript-sdk/reference/common/listrecentbotsresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ListRecentBotsResponse {
  'lastUpdated': string
  'next_cursor': string
  'recentBots': import("@meeting-baas/sdk/models/recent-bot-entry").RecentBotEntry[]
}
```


---

## LoginAccount

### Source: ./content/docs/typescript-sdk/reference/common/loginaccount.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface LoginAccount {
  'app_signin_token': string
  'google_chrome_token_id': string
  'google_token_id': string
  'microsoft_token_id': string
  'password': string
  'pseudo': string
}
```


---

## LoginQuery

### Source: ./content/docs/typescript-sdk/reference/common/loginquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface LoginQuery {
  'redirect_url': string
}
```


---

## Metadata

### Source: ./content/docs/typescript-sdk/reference/common/metadata.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Metadata {
  'botData': import("@meeting-baas/sdk/models/bot-data").BotData
  'contentDeleted': boolean
  'duration': number
  'mp4': string
}
```


---

## QueryListEvent

### Source: ./content/docs/typescript-sdk/reference/common/querylistevent.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface QueryListEvent {
  'attendee_email': string
  'calendarId': string
  'cursor': string
  'organizer_email': string
  'start_date_gte': string
  'start_date_lte': string
  'status': string
  'updated_at_gte': string
}
```


---

## QueryPatchRecordEvent

### Source: ./content/docs/typescript-sdk/reference/common/querypatchrecordevent.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface QueryPatchRecordEvent {
  'all_occurrences': boolean
}
```


---

## QueryScheduleRecordEvent

### Source: ./content/docs/typescript-sdk/reference/common/queryschedulerecordevent.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface QueryScheduleRecordEvent {
  'all_occurrences': boolean
}
```


---

## QueryUnScheduleRecordEvent

### Source: ./content/docs/typescript-sdk/reference/common/queryunschedulerecordevent.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface QueryUnScheduleRecordEvent {
  'all_occurrences': boolean
}
```


---

## ReceivedMessageQuery

### Source: ./content/docs/typescript-sdk/reference/common/receivedmessagequery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ReceivedMessageQuery {
  'sessionId': string
}
```


---

## RecentBotEntry

### Source: ./content/docs/typescript-sdk/reference/common/recentbotentry.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface RecentBotEntry {
  'access_count': number
  'contentDeleted': boolean
  'createdAt': string
  'duration': number
  'ended_at': string
  'extra': { [key: string]: any; }
  'id': string
  'last_accessed_at': string
  'meetingUrl': string
  'name': string
  'session_id': string
  'speakers': string[]
}
```


---

## RecognizerWord

### Source: ./content/docs/typescript-sdk/reference/common/recognizerword.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface RecognizerWord {
  'endTime': number
  'startTime': number
  'text': string
  'user_id': number
}
```


---

## ResyncAllCalendarsResponse

### Source: ./content/docs/typescript-sdk/reference/common/resyncallcalendarsresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ResyncAllCalendarsResponse {
  'errors': any[][]
  'syncedCalendars': string[]
}
```


---

## ResyncAllResponse

### Source: ./content/docs/typescript-sdk/reference/common/resyncallresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ResyncAllResponse {
  'errors': any[][]
  'syncedCalendars': string[]
}
```


---

## RetranscribeBody

### Source: ./content/docs/typescript-sdk/reference/common/retranscribebody.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface RetranscribeBody {
  'botUuid': string
  'speech_to_text': import("@meeting-baas/sdk/models/speech-to-text").SpeechToText
  'webhook_url': string
}
```


---

## ScheduleOriginOneOf

### Source: ./content/docs/typescript-sdk/reference/common/scheduleoriginoneof.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ScheduleOriginOneOf {
  'Event': import("@meeting-baas/sdk/models/schedule-origin-one-of-event").ScheduleOriginOneOfEvent
}
```


---

## ScheduleOriginOneOf1

### Source: ./content/docs/typescript-sdk/reference/common/scheduleoriginoneof1.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ScheduleOriginOneOf1 {
  'ScheduledBot': import("@meeting-baas/sdk/models/schedule-origin-one-of-event").ScheduleOriginOneOfEvent
}
```


---

## ScheduleOriginOneOfEvent

### Source: ./content/docs/typescript-sdk/reference/common/scheduleoriginoneofevent.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface ScheduleOriginOneOfEvent {
  'id': number
}
```


---

## SpeechToText

### Source: ./content/docs/typescript-sdk/reference/common/speechtotext.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface SpeechToText {
  'api_key': string
  'provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
}
```


---

## SpeechToTextApiParameter

### Source: ./content/docs/typescript-sdk/reference/common/speechtotextapiparameter.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface SpeechToTextApiParameter {
  'api_key': string
  'provider': import("@meeting-baas/sdk/models/speech-to-text-provider").SpeechToTextProvider
}
```


---

## StartRecordFailedQuery

### Source: ./content/docs/typescript-sdk/reference/common/startrecordfailedquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface StartRecordFailedQuery {
  'bot_uuid': string
}
```


---

## StreamingApiParameter

### Source: ./content/docs/typescript-sdk/reference/common/streamingapiparameter.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface StreamingApiParameter {
  'audio_frequency': import("@meeting-baas/sdk/models/audio-frequency").AudioFrequency
  'input': string
  'output': string
}
```


---

## SyncResponse

### Source: ./content/docs/typescript-sdk/reference/common/syncresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface SyncResponse {
  'affected_event_uuids': string[]
  'has_updates': string
}
```


---

## SystemTime

### Source: ./content/docs/typescript-sdk/reference/common/systemtime.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface SystemTime {
  'nanosSinceEpoch': number
  'secsSinceEpoch': number
}
```


---

## TokenConsumptionByService

### Source: ./content/docs/typescript-sdk/reference/common/tokenconsumptionbyservice.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface TokenConsumptionByService {
  'duration': string
  'recordingTokens': string
  'streamingInputHour': string
  'streamingInputTokens': string
  'streamingOutputHour': string
  'streamingOutputTokens': string
  'transcriptionByokHour': string
  'transcriptionByokTokens': string
  'transcriptionHour': string
  'transcriptionTokens': string
}
```


---

## TokenConsumptionQuery

### Source: ./content/docs/typescript-sdk/reference/common/tokenconsumptionquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface TokenConsumptionQuery {
  'endDate': string
  'startDate': string
}
```


---

## Transcript

### Source: ./content/docs/typescript-sdk/reference/common/transcript.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Transcript {
  'botId': number
  'end_time': number
  'id': number
  'lang': string
  'speaker': string
  'startTime': number
  'user_id': number
  'words': import("@meeting-baas/sdk/models/word").Word[]
}
```


---

## Transcript2

### Source: ./content/docs/typescript-sdk/reference/common/transcript2.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Transcript2 {
  'botId': number
  'end_time': number
  'lang': string
  'speaker': string
  'startTime': number
  'user_id': number
}
```


---

## Transcript3

### Source: ./content/docs/typescript-sdk/reference/common/transcript3.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Transcript3 {
  'botId': number
  'end_time': number
  'id': number
  'lang': string
  'speaker': string
  'startTime': number
  'user_id': number
}
```


---

## Transcript4

### Source: ./content/docs/typescript-sdk/reference/common/transcript4.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Transcript4 {
  'bot_id': number
  'end_time': number
  'id': number
  'lang': string
  'speaker': string
  'start_time': number
  'user_id': number
}
```


---

## UpdateCalendarParams

### Source: ./content/docs/typescript-sdk/reference/common/updatecalendarparams.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface UpdateCalendarParams {
  'oauthClientId': string
  'oauthClientSecret': string
  'oauthRefreshToken': string
  'platform': import("@meeting-baas/sdk/models/provider").Provider
}
```


---

## UserTokensResponse

### Source: ./content/docs/typescript-sdk/reference/common/usertokensresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface UserTokensResponse {
  'availableTokens': string
  'last_purchase_date': string
  'totalTokensPurchased': string
}
```


---

## Version

### Source: ./content/docs/typescript-sdk/reference/common/version.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Version {
  'buildDate': string
  'buildTimestamp': string
  'location': string
}
```


---

## Word

### Source: ./content/docs/typescript-sdk/reference/common/word.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface Word {
  'botId': number
  'endTime': number
  'id': number
  'startTime': number
  'text': string
  'user_id': number
}
```


---

## SDK Reference

Complete reference of all methods and types in the Meeting BaaS TypeScript SDK

### Source: ./content/docs/typescript-sdk/reference/index.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

## Common

- [Common](./reference/common)

## Bots

- [Bots](./reference/bots)

## Calendars

- [Calendars](./reference/calendars)

## Webhooks

- [Webhooks](./reference/webhooks)


---

## GetWebhookUrlResponse

### Source: ./content/docs/typescript-sdk/reference/webhooks/getwebhookurlresponse.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface GetWebhookUrlResponse {
  'webhook_url': string
}
```


---

## Webhooks

Webhooks API Reference

### Source: ./content/docs/typescript-sdk/reference/webhooks/index.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

- [GetWebhookUrlResponse](/docs/typescript-sdk/reference/webhooks/getwebhookurlresponse)
- [PostWebhookUrlRequest](/docs/typescript-sdk/reference/webhooks/postwebhookurlrequest)
- [RetryWebhookQuery](/docs/typescript-sdk/reference/webhooks/retrywebhookquery)


---

## PostWebhookUrlRequest

### Source: ./content/docs/typescript-sdk/reference/webhooks/postwebhookurlrequest.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface PostWebhookUrlRequest {
  'webhookUrl': string
}
```


---

## RetryWebhookQuery

### Source: ./content/docs/typescript-sdk/reference/webhooks/retrywebhookquery.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}



```typescript
interface RetryWebhookQuery {
  'botUuid': string
}
```


---

## MeetingBaaS Updates

Latest updates and changes to MeetingBaaS services

### Source: ./content/docs/updates/index.mdx


# MeetingBaaS Updates

Find the latest updates and changes to MeetingBaaS services here.

## Available Documentation

We provide comprehensive LLM-optimized documentation at these URLs:

- [/llms/all](/llms/all) - All MeetingBaas documentation content
- [/llms/api](/llms/api) - MeetingBaas API
- [/llms/calendars](/llms/calendars) - Calendars API
- [/llms/meetings](/llms/meetings) - Meetings API
- [/llms/users](/llms/users) - Users API
- [/llms/webhooks](/llms/webhooks) - Webhooks API
- [/llms/typescript-sdk](/llms/typescript-sdk) - TypeScript SDK
- [/llms/transcript-seeker](/llms/transcript-seeker) - Transcript Seeker
- [/llms/speaking-bots](/llms/speaking-bots) - Speaking Bots

## Update Categories

<Cards>
  <Card title="API Updates" href="/docs/updates/api">
    API changes and improvements
  </Card>
  <Card title="TypeScript SDK Updates" href="/docs/updates/typescript-sdk">
    SDK releases and updates
  </Card>
  <Card title="MCP Servers Updates" href="/docs/updates/mcp-servers">
    Model Context Protocol server changes
  </Card>
  <Card title="Speaking Bots Updates" href="/docs/updates/speaking-bots">
    Speaking bot features
  </Card>
  <Card
    title="Transcript Seeker Updates"
    href="/docs/updates/transcript-seeker"
  >
    Transcript platform improvements
  </Card>
</Cards>

## How Updates Are Organized

Each update includes:

- **Date**: When the update was released
- **Service Icon**: Visual indicator of which service the update pertains to
- **Title**: Brief description of the update
- **Description**: Details about what changed and how to use new features
- **Tags**: Categories for easier filtering (API, SDK, Feature, Bugfix, etc.)

Updates may include code examples, screenshots, or links to detailed documentation when relevant.


---

