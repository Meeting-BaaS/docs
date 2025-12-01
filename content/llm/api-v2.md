# api-v2 Documentation

Documentation for api-v2.

## API Keys & Permissions

Learn about API keys, permissions, and access control in Meeting BaaS v2

### Source: ./content/docs/api-v2/api-keys.mdx


API keys are used to authenticate requests to the Meeting BaaS v2 API. Each API key is associated with a team and has specific permissions that determine which endpoints can be accessed.

## API Key Authentication

All v2 API requests must include your API key in the request header:

```http
x-meeting-baas-api-key: YOUR-API-KEY
```

## Permission Types

Meeting BaaS v2 supports two permission types for API keys:

### Full Access

API keys with **Full Access** can perform all operations on all endpoints:

- Create, list, view, update, and delete bots
- Create, list, view, update, and delete scheduled bots
- Manage calendar connections and events
- Schedule and manage calendar bots
- Use all batch operation endpoints
- Manage webhooks and callbacks

**Use cases:**
- Complete application integration
- Administrative operations
- Calendar management
- Webhook configuration
- Data management and cleanup

### Sending Access

API keys with **Sending Access** are designed for bot creation only. They can only send POST requests to bot creation endpoints:

**Allowed endpoints:**
- `POST /v2/bots` - Create a bot
- `POST /v2/bots/batch` - Create multiple bots
- `POST /v2/bots/scheduled` - Schedule a bot
- `POST /v2/bots/scheduled/batch` - Schedule multiple bots
- `POST /v2/calendars/:calendar_id/bots` - Schedule a bot for a calendar event

**Not allowed:**
- Any GET requests (including listing bots, getting bot details, checking status)
- Any PATCH or DELETE requests
- Calendar management endpoints
- Webhook or callback management

**Use cases:**
- Dedicated bot creation services
- Third-party integrations that only need to send bots
- Limited-scope applications
- Security isolation (prevents accidental data deletion or viewing)

## Rate Limiting

Rate limits are applied per team (not per API key). The rate limit determines how many requests per second your team can make. GET requests are not rate limited.

Default rate limits vary by plan, but can be customized for enterprise customers.

## Daily Bot Cap

Each team has a daily bot creation limit (e.g., 75 bots/day for pay-as-you-go, 300 for pro). This limit is checked before creating each bot. If the limit is reached, subsequent bot creation requests will fail with a `429 Too Many Requests` error.

The daily bot cap resets every 24 hours based on when bots were created.

## Best Practices

1. **Use separate API keys for different environments** (development, staging, production)
2. **Use Sending Access for public-facing services** that only need to create bots
3. **Rotate API keys regularly** for security
4. **Store API keys securely** - never commit them to version control
5. **Monitor your daily bot cap** to avoid hitting limits

## Error Responses

If an API key lacks permission for an endpoint, you'll receive a `403 Forbidden` response:

```json
{
  "success": false,
  "error": "Forbidden",
  "code": "FST_ERR_FORBIDDEN",
  "statusCode": 403
}
```



---

## Batch Operations

Learn how to create multiple bots in a single request

### Source: ./content/docs/api-v2/batch-operations.mdx


# Batch Operations

Batch operations allow you to create multiple bots in a single API request. This is useful for bulk operations and reduces the number of API calls needed.

## Creating Multiple Bots

To create multiple bots at once, use the batch endpoint:

```bash
curl -X POST "https://api.meetingbaas.com/v2/bots/batch" \
     -H "Content-Type: application/json" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY" \
     -d '[
           {
             "meeting_url": "https://meet.google.com/abc-defg-hij",
             "bot_name": "Bot 1",
             "recording_mode": "speaker_view"
           },
           {
             "meeting_url": "https://zoom.us/j/123456789",
             "bot_name": "Bot 2",
             "recording_mode": "gallery_view"
           }
         ]'
```

## Response Format

The batch endpoint returns a response with both successful and failed items:

```json
{
  "success": true,
  "data": {
    "success": [
      {
        "index": 0,
        "bot_id": "123e4567-e89b-12d3-a456-426614174000",
        "extra": null
      }
    ],
    "errors": [
      {
        "index": 1,
        "code": "INSUFFICIENT_TOKENS",
        "message": "Insufficient tokens. Available: 0, Required: 0.5",
        "details": null,
        "extra": null
      }
    ]
  }
}
```

## Partial Success

Batch operations support **partial success**. This means:

- Some bots may be created successfully while others fail
- Each item is processed independently
- Errors for one item don't prevent other items from being processed
- The response includes both successful and failed items with their original indices

## Error Handling

Each item in the batch is validated and processed individually. Common errors include:

- `INSUFFICIENT_TOKENS`: Not enough tokens to create the bot
- `DAILY_BOT_CAP_REACHED`: Daily bot creation limit reached
- `BOT_ALREADY_EXISTS`: A bot already exists for this meeting URL (if `allow_multiple_bots` is `false`)
- `INVALID_MEETING_PLATFORM`: Could not determine meeting platform from URL
- `VALIDATION_ERROR`: Request validation failed

## Use Cases

Batch operations are ideal for:

- Bulk bot creation for multiple meetings
- Scheduled bot creation for recurring events
- Migrating bots from another system
- Creating test bots in bulk

## Batch Size Limits

- **Minimum**: 1 bot per batch
- **Maximum**: 100 bots per batch

If you exceed 100 items, the request will fail with a validation error.

## Best Practices

1. **Validate data before batching**: Ensure all meeting URLs and configurations are valid
2. **Handle partial success**: Always check both `success` and `errors` arrays in the response
3. **Use appropriate batch sizes**: Consider processing in batches of 10-50 items for better error handling and easier debugging
4. **Monitor token balance**: Ensure you have sufficient tokens for all bots in the batch
5. **Check daily bot cap**: Make sure you won't exceed your daily bot creation limit

## Scheduled Bot Batch

You can also create multiple scheduled bots in a single request:

```bash
curl -X POST "https://api.meetingbaas.com/v2/bots/scheduled/batch" \
     -H "Content-Type: application/json" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY" \
     -d '[
           {
             "meeting_url": "https://meet.google.com/abc-defg-hij",
             "bot_name": "Scheduled Bot 1",
             "join_at": "2025-01-20T14:00:00Z"
           },
           {
             "meeting_url": "https://zoom.us/j/123456789",
             "bot_name": "Scheduled Bot 2",
             "join_at": "2025-01-20T15:00:00Z"
           }
         ]'
```

## Token Reservation

Tokens are reserved individually for each bot in the batch. If one bot fails due to insufficient tokens, other bots in the batch may still succeed if tokens are available.

## Daily Bot Cap

The daily bot cap is checked for each bot individually. If you're creating 100 bots but your daily cap is 75, the first 75 will succeed and the remaining 25 will fail with `DAILY_BOT_CAP_REACHED`.



---

## Community & Support

Get help and connect with the Meeting BaaS community

### Source: ./content/docs/api-v2/community-and-support.mdx


# Community & Support

Need help? We're here for you!

## Support Channels

- **Support Center**: Visit [Support center](https://dashboard.meetingbaas.com/support-center) to create and manage support tickets, view ticket status, and track your support requests
- **Discord**: Join our [Discord community](https://discord.com/invite/dsvFgDTr6c) for real-time support and discussions
- **Email**: Contact us at support@meetingbaas.com
- **Documentation**: Browse our comprehensive documentation

## Resources

- **API Reference**: Complete API documentation with examples
- **Getting Started Guides**: Step-by-step tutorials
- **Webhooks Guide**: Learn about webhook events and configuration
- **Examples**: Code samples in multiple languages

## Contributing

Found an issue or have a suggestion? We welcome contributions!

- Open an issue on GitHub
- Submit a pull request
- Share feedback in our Discord

## Status

Check our status page for real-time system status and incident updates.



---

## Deduplication & Rate Limiting

Learn about duplicate bot prevention and rate limiting in Meeting BaaS v2

### Source: ./content/docs/api-v2/deduplication-rate-limiting.mdx


# Deduplication & Rate Limiting

Meeting BaaS v2 includes built-in protection against duplicate bots and rate limiting to ensure fair usage.

## Deduplication

Deduplication prevents multiple bots from joining the same meeting within a short time window.

### How It Works

By default, when you create a bot with `allow_multiple_bots: false`, the system:

1. Checks if a bot already exists for the same meeting URL within the last 5 minutes
2. If a bot exists, the request fails with `BOT_ALREADY_EXISTS`
3. If no bot exists, a lock is acquired and the bot is created

### Lock Duration

The deduplication lock lasts for **5 minutes**. After this time, you can create another bot for the same meeting URL.

### Allowing Multiple Bots

If you want to allow multiple bots in the same meeting, set `allow_multiple_bots: true` when creating the bot:

```json
{
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "bot_name": "Bot 1",
  "allow_multiple_bots": true
}
```

With `allow_multiple_bots: true`, no deduplication lock is applied, and multiple bots can join the same meeting.

### Use Cases

**Prevent duplicates (`allow_multiple_bots: false`):**
- Production environments where duplicate bots are unwanted
- Preventing accidental double-booking
- Ensuring only one bot per meeting

**Allow multiple bots (`allow_multiple_bots: true`):**
- Testing scenarios
- Multiple recording perspectives
- Backup bots for reliability

## Rate Limiting

Rate limiting controls how many requests per second your team can make to the API.

### How It Works

- Rate limits are applied **per team** (not per API key)
- Limits are measured in **requests per second**
- **GET requests are not rate limited** (list and get endpoints)
- Only POST, PATCH, and DELETE requests are rate limited

### Default Rate Limits

Default rate limits vary by plan:

- **Pay-as-you-go**: 1 request/second
- **Pro**: 1 request/second
- **Scale**: 1 request/second
- **Enterprise**: 20 requests/second

### Rate Limit Headers

When making requests, the API includes rate limit headers:

- `x-ratelimit-limit`: Maximum requests per second
- `x-ratelimit-remaining`: Remaining requests in the current window
- `x-ratelimit-reset`: Time when the rate limit resets
- `retry-after`: Seconds to wait before retrying (when limit exceeded)

### Rate Limit Errors

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": "Too many requests",
  "code": "FST_ERR_TOO_MANY_REQUESTS",
  "statusCode": 429
}
```

The response includes a `retry-after` header indicating how many seconds to wait before retrying.

### Best Practices

1. **Respect rate limits**: Implement exponential backoff when you receive 429 errors
2. **Use batch operations**: Create multiple bots in a single request instead of multiple individual requests
3. **Cache responses**: Cache GET requests to reduce API calls
4. **Monitor headers**: Check rate limit headers to understand your current usage

## Daily Bot Cap

In addition to rate limiting, each team has a **daily bot creation limit**:

- **Pay-as-you-go**: 75 bots/day
- **Pro**: 300 bots/day
- **Scale**: 1,000 bots/day
- **Enterprise**: 3,000 bots/day

### How It Works

- The daily bot cap is checked **before** creating each bot
- The limit is based on a 24-hour rolling window
- If the limit is reached, subsequent bot creation requests fail with `DAILY_BOT_CAP_REACHED`
- The cap resets based on when bots were created (not a fixed time)

### Error Response

When the daily bot cap is reached:

```json
{
  "success": false,
  "error": "Daily bot cap has been reached: 75 bots created within the last 24 hours",
  "code": "FST_ERR_DAILY_BOT_CAP_REACHED",
  "statusCode": 429
}
```

## Combining Limits

All limits work together:

1. **Rate limiting**: Controls requests per second
2. **Daily bot cap**: Controls total bots per day
3. **Token availability**: Controls whether you have tokens to create bots
4. **Deduplication**: Prevents duplicate bots (if enabled)

Make sure to account for all these limits when designing your integration.



---

## Error Codes

Complete reference for bot process error codes in Meeting BaaS v2

### Source: ./content/docs/api-v2/error-codes.mdx


# Bot Process Error Codes

When a bot fails, the error information is included in the `bot.failed` webhook event and in the bot details response. This page documents all possible error codes and their meanings.

## Error Code Structure

Error codes are standardized strings that indicate the reason a bot failed. They are included in:

- `bot.failed` webhook events (`error_code` field)
- Bot details response (`error_code` field)
- Bot status history

## Normal End Reasons

These codes indicate the bot ended normally (not a failure):

### `BOT_REMOVED`
**Title:** Bot Removed  
**Description:** Bot was removed from the meeting.

### `NO_ATTENDEES`
**Title:** No Attendees  
**Description:** No attendees joined the meeting.

### `NO_SPEAKER`
**Title:** No Speaker  
**Description:** No speakers detected during recording.

### `RECORDING_TIMEOUT`
**Title:** Recording Timeout  
**Description:** Recording timeout reached.

### `API_REQUEST`
**Title:** API Request  
**Description:** Recording stopped via API request (using the leave endpoint).

## Error End Reasons

These codes indicate the bot failed due to an error:

### `BOT_NOT_ACCEPTED`
**Title:** Bot Not Accepted  
**Description:** Bot was not accepted into the meeting, either by the participants or the meeting platform.

**Token Charging:** Only recording tokens are charged (based on waiting room duration).

### `TIMEOUT_WAITING_TO_START`
**Title:** Timeout Waiting to Start  
**Description:** Timeout waiting to start recording.

**Token Charging:** Only recording tokens are charged (based on waiting room duration).

### `CANNOT_JOIN_MEETING`
**Title:** Cannot Join Meeting  
**Description:** Cannot join meeting - meeting is not reachable or may not exist.

### `BOT_REMOVED_TOO_EARLY`
**Title:** Bot Removed Too Early  
**Description:** Bot was removed too early; the video is too short.

### `INVALID_MEETING_URL`
**Title:** Invalid Meeting URL  
**Description:** Invalid meeting URL provided.

### `STREAMING_SETUP_FAILED`
**Title:** Streaming Setup Failed  
**Description:** Failed to set up streaming audio.

### `LOGIN_REQUIRED`
**Title:** Login Required  
**Description:** Login required to access the meeting.

### `INTERNAL_ERROR`
**Title:** Internal Error  
**Description:** Internal error occurred during recording.

## Crash Reasons

These codes indicate the bot process crashed:

### `OOM_KILLED`
**Title:** Out of Memory  
**Description:** Bot process was killed due to out of memory.

### `SIGTERM`
**Title:** Process Terminated  
**Description:** Bot process was terminated.

### `FORCE_KILLED`
**Title:** Force Killed  
**Description:** Bot process was force killed.

### `GENERAL_ERROR`
**Title:** General Error  
**Description:** Bot process exited with a general error.

## Transcription Errors

### `TRANSCRIPTION_FAILED`
**Title:** Transcription Failed  
**Description:** The transcription process failed. Please try again using re-transcribe endpoint or contact support.

**Token Charging:** Recording and streaming tokens are charged, but transcription tokens are not.

## Zoom-Specific Errors

These errors are specific to Zoom meetings:

### `WAITING_FOR_HOST_TIMEOUT`
**Title:** Waiting for Host Timeout  
**Description:** The bot timed out while waiting for the meeting host to join the meeting.

### `RECORDING_RIGHTS_NOT_GRANTED`
**Title:** Recording Rights Not Granted  
**Description:** The bot was unable to obtain recording rights from the meeting host.

### `CANNOT_REQUEST_RECORDING_RIGHT`
**Title:** Cannot Request Recording Right  
**Description:** The bot could not request recording rights. The meeting may not have recording enabled.

### `EXITING_MEETING_BEFORE_RECORD`
**Title:** Exiting Meeting Before Record  
**Description:** The meeting ended before the bot could start recording.

### `MEETING_ENDED_PREMATURELY`
**Title:** Meeting Ended Prematurely  
**Description:** The meeting ended before the bot could participate.

### `SET_ZOOM_ID_AND_PWD_TOGETHER`
**Title:** Zoom SDK Configuration Error  
**Description:** Zoom SDK ID and password must be set together.

### `CANNOT_GET_JWT_TOKEN`
**Title:** Cannot Get JWT Token  
**Description:** Unable to obtain JWT token with the provided Zoom SDK credentials.

### `SDK_AUTH_FAILED`
**Title:** SDK Authentication Failed  
**Description:** Zoom SDK authentication failed with the provided credentials.

### `ZOOM_ACCESS_TOKEN_ERROR`
**Title:** Zoom Access Token Error  
**Description:** An error occurred while obtaining the Zoom access token.

## System Errors

These errors occur when the system attempts to create a bot instance. For immediate bots, this happens at creation time and the error is returned in the API response. For scheduled and calendar bots, these errors can appear in `bot.failed` webhook events when the bot is being queued to join the meeting (at its scheduled join time).

### `INSUFFICIENT_TOKENS`
**Title:** Insufficient Tokens  
**Description:** Not enough tokens were available to launch the bot.

**When it occurs:**
- **Immediate bots**: When you call `POST /v2/bots` (error returned in API response)
- **Scheduled bots**: When the bot is being queued at its `join_at` time (error sent via `bot.failed` webhook)
- **Calendar bots**: When the bot is being queued at its scheduled join time (error sent via `bot.failed` webhook)

### `DAILY_BOT_CAP_REACHED`
**Title:** Daily Bot Cap Reached  
**Description:** The daily bot creation limit configured for this team has been reached.

**When it occurs:**
- **Immediate bots**: When you call `POST /v2/bots` (error returned in API response)
- **Scheduled bots**: When the bot is being queued at its `join_at` time (error sent via `bot.failed` webhook)
- **Calendar bots**: When the bot is being queued at its scheduled join time (error sent via `bot.failed` webhook)

**Note:** For scheduled and calendar bots, the daily bot cap is checked when the bot is being queued, not when it's scheduled. This means a bot scheduled for later in the day might fail if the daily cap is reached before its scheduled time.

### `BOT_ALREADY_EXISTS`
**Title:** Bot Already Exists  
**Description:** A bot is already running for this meeting URL.

**When it occurs:**
- **Immediate bots**: When you call `POST /v2/bots` and `allow_multiple_bots` is `false` (error returned in API response)
- **Scheduled bots**: When the bot is being queued and another bot already exists for the same meeting URL (error sent via `bot.failed` webhook)
- **Calendar bots**: When the bot is being queued and another bot already exists for the same meeting URL (error sent via `bot.failed` webhook)

## Unknown Error

### `UNKNOWN_ERROR`
**Title:** Unknown Error  
**Description:** An unknown error occurred. Please contact support.

This is a fallback error code used when the actual error cannot be determined or mapped to a known error code.

## Token Charging

Different error codes result in different token charges:

- **User-responsible errors** (`BOT_NOT_ACCEPTED`, `TIMEOUT_WAITING_TO_START`): Only recording tokens charged (based on waiting room duration)
- **Transcription errors** (`TRANSCRIPTION_FAILED`): Recording and streaming tokens charged, transcription tokens not charged
- **Other errors**: No tokens charged (reserved tokens are released)
- **Normal end reasons**: Full tokens charged based on meeting duration and features used

## Handling Errors

When you receive a `bot.failed` webhook:

1. Check the `error_code` to understand what went wrong
2. Review the `error_message` for additional context
3. For user-responsible errors (`BOT_NOT_ACCEPTED`, `TIMEOUT_WAITING_TO_START`), ensure meeting settings allow bots
4. For transcription errors, you can retry transcription using the re-transcribe endpoint
5. For system errors, check your token balance and daily bot cap
6. For unknown errors, contact support with the bot ID and error details



---

## Calendar integration

Learn how to integrate calendars and schedule bots automatically

### Source: ./content/docs/api-v2/getting-started/calendars.mdx


# Calendar Integration

Meeting BaaS v2 allows you to connect calendars (Google Calendar, Microsoft Outlook) and automatically schedule bots for calendar events. This guide walks you through setting up calendar integration in your application.

## Overview

Calendar integration enables:

- Automatic bot scheduling for calendar events
- Real-time sync of calendar events via push subscriptions
- Webhook notifications for calendar changes
- Support for recurring events
- Automatic handling of event reschedules and cancellations

## Prerequisites

Before you can integrate calendars, you need to set up OAuth applications with Google and/or Microsoft. Meeting BaaS v2 uses a **bring-your-own-credentials** model, meaning you create and manage your own OAuth applications and provide the credentials when creating calendar connections.

### What You Need

You'll need two sets of credentials:

1. **Your Application's OAuth Credentials** (Service Level):
   - Google: OAuth 2.0 Client ID and Client Secret
   - Microsoft: Azure AD Application (Client) ID and Client Secret

2. **User's OAuth Refresh Token** (User Level):
   - OAuth refresh token obtained when each user authorizes your application to access their calendar

<Callout type="info">
  **Best Practice**: Request calendar access as a separate step after initial user signup. Users are more likely to grant calendar access when it's clearly tied to a specific feature they want to use.
</Callout>

## Create Google Calendar OAuth Application

You'll need to create a Google OAuth application that users can authorize to access their calendar. You can skip this step if your application won't support Google Calendar. We recommend creating separate applications for development and production.

### Steps

1. **Create a Google Cloud Project**: Follow the directions [here](https://support.google.com/googleapi/answer/6158849?hl=en) to create a new Google Cloud project that uses OAuth.

2. **Enable Google Calendar API**: In your Google Cloud project, go to "APIs & Services" > "Library" and enable the [Google Calendar API](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com).

3. **Create OAuth 2.0 Credentials**: 
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type
   - Add your authorized redirect URIs
   - Use these scopes when requesting authorization:
     - `https://www.googleapis.com/auth/calendar.readonly` - To read calendar and event data
     - `https://www.googleapis.com/auth/userinfo.email` - To get the user's email address (optional but recommended)

4. **OAuth Consent Screen**: 
   - Configure your OAuth consent screen in "APIs & Services" > "OAuth consent screen"
   - Google will need to approve your application before external users can authorize it. See [here](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification) for more information
   - Until your app is approved, only users on your test users list can authorize it. To edit the test users list, go to "OAuth Consent Screen" > "Test Users"

### Important Notes for Google OAuth

- **Refresh Token Requirement**: Calendar connections require offline access. When implementing the OAuth flow, you **must** include:
  - `access_type=offline` parameter
  - `prompt=consent` parameter (to force the consent screen and ensure you get a refresh token)
- Without a refresh token, the connection will expire after ~1 hour and cannot be renewed

## Create Microsoft Calendar OAuth Application

You'll need to create a Microsoft Azure AD application that users can authorize to access their calendar. You can skip this step if your application won't support Microsoft Calendar. We recommend creating separate applications for development and production.

### Steps

1. **Register an Azure AD Application**: Follow the directions [here](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) to create a new Microsoft Azure Active Directory application. When it asks you to choose "Supported account types", select "Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)".

2. **Configure API Permissions**: 
   - Go to "API permissions" in your Azure AD app
   - Add these delegated permissions:
     - `Calendars.Read` - To read calendar and event data
     - `User.Read` - To get the user's profile information (optional but recommended)
   - Click "Add a permission" > "Microsoft Graph" > "Delegated permissions"

3. **Publisher Verification** (Optional but Recommended):
   - Microsoft can verify your application before external users can authorize it. See [here](https://learn.microsoft.com/en-us/entra/identity-platform/publisher-verification-overview) for more information
   - This process is automated and should take less than an hour
   - Steps to get verified:
     - [Join the Microsoft AI Cloud Partner Program](https://partner.microsoft.com/en-us/partnership)
     - [Configure your app's publisher domain](https://learn.microsoft.com/en-us/entra/identity-platform/howto-configure-publisher-domain)
     - [Mark your app as publisher verified](https://learn.microsoft.com/en-us/entra/identity-platform/mark-app-as-publisher-verified)

### Important Notes for Microsoft OAuth

- **Refresh Token Requirement**: Calendar connections require offline access. When implementing the OAuth flow, you **must** include:
  - `offline_access` scope in your OAuth request
- Without a refresh token, the connection will expire after ~1 hour and cannot be renewed
- **Tenant ID**: For Microsoft, you'll need to provide the Azure AD tenant ID. You can find this in Azure Portal > Azure Active Directory > Overview. You can also use `common`, `organizations`, or `consumers` for multi-tenant scenarios

## Implement OAuth Flow

You'll need to add code to handle the OAuth flow for users to authorize your Calendar OAuth applications. The flow is essentially the same for both Google and Microsoft:

1. **Add an authorization endpoint**: Redirect users to the OAuth provider's authorization URL
2. **Add a callback endpoint**: Handle the OAuth callback and exchange the authorization code for tokens
3. **Exchange authorization code for refresh token**: In your callback endpoint, exchange the authorization code for an access token and refresh token
4. **Create calendar connection**: After obtaining the refresh token, make a `POST /v2/calendars` request to create the calendar connection, passing:
   - `oauth_client_id`: Your OAuth client ID
   - `oauth_client_secret`: Your OAuth client secret
   - `oauth_refresh_token`: The refresh token obtained from the user's authorization
   - `oauth_tenant_id`: (Microsoft only) The Azure AD tenant ID
   - `raw_calendar_id`: The calendar ID to connect (use `POST /v2/calendars/list-raw` to get available calendars)

## Supported Platforms

- **Google Calendar**: Full support for Google Workspace and personal accounts
- **Microsoft Outlook**: Full support for Microsoft 365 and personal accounts

## Calendar Events

Once connected, calendar events are automatically synced. You can:

- List all calendars
- List events for a calendar
- Get event details
- Schedule bots for specific events or entire event series

## Scheduling Bots for Calendar Events

To schedule a bot for a calendar event:

```bash
curl -X POST "https://api.meetingbaas.com/v2/calendars/CALENDAR-ID/bots" \
     -H "Content-Type: application/json" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY" \
     -d '{
           "event_id": "EVENT-ID",
           "all_occurrences": false,
           "bot_name": "AI Notetaker",
           "recording_mode": "speaker_view"
         }'
```

**Options:**
- `event_id`: The specific event instance ID
- `all_occurrences`: Set to `true` to schedule for all occurrences of a recurring event
- `series_id`: Use this instead of `event_id` to schedule for an entire series

## Webhooks

Calendar integrations trigger webhook events for:
- Connection changes
- Event syncs
- Event creation, updates, and cancellations

See the [Webhooks documentation](/docs/api-v2/webhooks) for details on calendar webhook events.



---

## Getting the data

Learn how to retrieve meeting recordings, transcriptions, and other data from bots

### Source: ./content/docs/api-v2/getting-started/getting-the-data.mdx


# Getting Meeting Data

Once a bot completes recording a meeting, you can retrieve the meeting data including recordings, transcriptions, and metadata.

## Getting Bot Details

To get all information about a bot, including artifact URLs:

```bash
curl -X GET "https://api.meetingbaas.com/v2/bots/BOT-ID" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "completed",
    "meeting_url": "https://meet.google.com/...",
    "video": "https://s3.amazonaws.com/.../video.mp4",
    "audio": "https://s3.amazonaws.com/.../audio.mp3",
    "transcription": "https://s3.amazonaws.com/.../transcription.json",
    "diarization": "https://s3.amazonaws.com/.../diarization.json",
    "participants": ["Alice", "Bob"],
    "speakers": ["Alice", "Bob"],
    "duration_seconds": 3600,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

## Getting Bot Status

For a lightweight status check:

```bash
curl -X GET "https://api.meetingbaas.com/v2/bots/BOT-ID/status" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "in_call_recording",
    "transcription_status": "processing",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

## Getting Screenshots

To get screenshots taken during the meeting:

```bash
curl -X GET "https://api.meetingbaas.com/v2/bots/BOT-ID/screenshots" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY"
```

**Note:** Screenshots are only available for Google Meet and Microsoft Teams. Zoom does not support screenshots.

## Artifact URLs

All artifact URLs (video, audio, transcription, diarization) are **presigned S3 URLs** that are valid for **4 hours**. Make sure to download them within this time window.

## Recommended Approach

Instead of polling the API, we recommend:

1. **Use webhooks**: Configure webhooks in your account settings to receive `bot.completed` events automatically
2. **Use callbacks**: Provide a `callback_config` when creating the bot to receive notifications for that specific bot
3. **Poll only when necessary**: If you must poll, use a judicious interval (e.g., every 5-10 minutes) and only for reconciliation purposes

For more details, see the [Webhooks documentation](/docs/api-v2/webhooks).



---

## Removing a bot

Learn how to remove or delete bots from meetings

### Source: ./content/docs/api-v2/getting-started/removing-a-bot.mdx


# Removing a Bot

You can remove a bot from a meeting or delete bot data using the v2 API. There are two operations:

1. **Leave meeting**: Instruct a bot to leave the meeting immediately (while it's active)
2. **Delete data**: Permanently delete a bot and all its data (after it's completed or failed)

## Leave Meeting

To instruct a bot to leave the meeting immediately:

```bash
curl -X POST "https://api.meetingbaas.com/v2/bots/BOT-ID/leave" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Bot leave request sent successfully."
  }
}
```

### When Can You Leave a Bot?

The leave endpoint can only be called when the bot is in one of these statuses:

- `joining_call`: Bot is attempting to join the meeting
- `in_waiting_room`: Bot is waiting in the meeting's waiting room
- `in_call_not_recording`: Bot is in the meeting but not recording
- `in_call_recording`: Bot is actively recording
- `recording_paused`: Bot recording is paused
- `recording_resumed`: Bot recording has resumed

### Error Responses

**404 Not Found:**
```json
{
  "success": false,
  "error": "Bot with ID 'BOT-ID' not found",
  "code": "FST_ERR_BOT_NOT_FOUND_BY_ID",
  "statusCode": 404
}
```

**409 Conflict (Bot status doesn't allow leaving):**
```json
{
  "success": false,
  "error": "Status of bot 'BOT-ID' is: completed. Operation not permitted in this state.",
  "code": "FST_ERR_BOT_STATUS",
  "statusCode": 409
}
```

This error occurs when the bot is in a status that doesn't allow leaving, such as:
- `queued`: Bot hasn't started joining yet
- `transcribing`: Bot has left and is processing transcription
- `completed`: Bot has already completed
- `failed`: Bot has already failed

### How It Works

When you call the leave endpoint:
1. The system sends a stop recording command to the bot process
2. The bot stops recording and exits the meeting (usually within a few seconds)
3. The bot will transition to `transcribing` status (if transcription is enabled) or `completed` status
4. A final webhook event (`bot.completed` or `bot.failed`) will be sent when the bot finishes processing

**Note:** The leave command is sent immediately, but the bot may take a few seconds to actually exit the meeting and update its status.

## Delete Bot Data

To permanently delete a bot and all its associated data (recordings, transcriptions, etc.):

```bash
curl -X DELETE "https://api.meetingbaas.com/v2/bots/BOT-ID/delete-data" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "deleted": true
  }
}
```

### When Can You Delete Bot Data?

The delete endpoint can only be called when the bot is in one of these statuses:

- `completed`: Bot has successfully completed recording and processing
- `failed`: Bot has failed

### Error Responses

**404 Not Found:**
```json
{
  "success": false,
  "error": "Bot with ID 'BOT-ID' not found",
  "code": "FST_ERR_BOT_NOT_FOUND_BY_ID",
  "statusCode": 404
}
```

**409 Conflict (Bot status doesn't allow deletion):**
```json
{
  "success": false,
  "error": "Status of bot 'BOT-ID' is: in_call_recording. Operation not permitted in this state.",
  "code": "FST_ERR_BOT_STATUS",
  "statusCode": 409
}
```

This error occurs when the bot is still active (e.g., `in_call_recording`, `transcribing`, etc.). You must wait for the bot to complete or fail, or use the leave endpoint first.

**Note:** This permanently deletes the bot and all its data. This action cannot be undone.

## Cancel Scheduled Bot

To cancel a scheduled bot before it joins the meeting:

```bash
curl -X DELETE "https://api.meetingbaas.com/v2/bots/scheduled/SCHEDULED-BOT-ID" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY"
```

**Note:** You can only cancel scheduled bots that haven't started yet. Once a bot has joined the meeting, you must use the regular delete endpoint.

## Important Notes

- Deleting a bot removes all associated data including recordings, transcriptions, and screenshots
- Deleted bots cannot be recovered
- If a bot is currently recording, deletion will stop the recording and remove all data
- Scheduled bots can be cancelled before they join, but once they've joined, they must be deleted like regular bots



---

## Sending a bot

Learn how to send bots to meetings using the Meeting BaaS v2 API

### Source: ./content/docs/api-v2/getting-started/sending-a-bot.mdx


# Sending a Bot to a Meeting

You can send a bot to a meeting in two ways:

1. **Immediate**: The bot joins the meeting right away
2. **Scheduled**: The bot joins at a specific time in the future

## Immediate Bot

Send a POST request to `https://api.meetingbaas.com/v2/bots`:

<Tabs items={['Bash', 'Python', 'JavaScript']}>
  <Tab value="Bash">
    ```bash
    curl -X POST "https://api.meetingbaas.com/v2/bots" \
         -H "Content-Type: application/json" \
         -H "x-meeting-baas-api-key: YOUR-API-KEY" \
         -d '{
               "meeting_url": "https://meet.google.com/abc-defg-hij",
               "bot_name": "AI Notetaker",
               "recording_mode": "speaker_view",
               "transcription_enabled": true,
               "transcription_config": {
                 "provider": "gladia"
               }
             }'
    ```
  </Tab>
  <Tab value="Python">
    ```python
    import requests

    url = "https://api.meetingbaas.com/v2/bots"
    headers = {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": "YOUR-API-KEY",
    }
    data = {
        "meeting_url": "https://meet.google.com/abc-defg-hij",
        "bot_name": "AI Notetaker",
        "recording_mode": "speaker_view",
        "transcription_enabled": true,
        "transcription_config": {
            "provider": "gladia"
        }
    }
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```
  </Tab>
  <Tab value="JavaScript">
    ```javascript
    fetch("https://api.meetingbaas.com/v2/bots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": "YOUR-API-KEY",
      },
      body: JSON.stringify({
        meeting_url: "https://meet.google.com/abc-defg-hij",
        bot_name: "AI Notetaker",
        recording_mode: "speaker_view",
        transcription_enabled: true,
        transcription_config: {
          provider: "gladia"
        }
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data.data.bot_id))
      .catch((error) => console.error("Error:", error));
    ```
  </Tab>
</Tabs>

## Scheduled Bot

To schedule a bot to join at a specific time, use `POST /v2/bots/scheduled`:

<Tabs items={['Bash', 'Python', 'JavaScript']}>
  <Tab value="Bash">
    ```bash
    curl -X POST "https://api.meetingbaas.com/v2/bots/scheduled" \
         -H "Content-Type: application/json" \
         -H "x-meeting-baas-api-key: YOUR-API-KEY" \
         -d '{
               "meeting_url": "https://meet.google.com/abc-defg-hij",
               "bot_name": "AI Notetaker",
               "recording_mode": "speaker_view",
               "join_at": "2025-01-20T14:00:00Z"
             }'
    ```
  </Tab>
  <Tab value="Python">
    ```python
    import requests
    from datetime import datetime

    url = "https://api.meetingbaas.com/v2/bots/scheduled"
    headers = {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": "YOUR-API-KEY",
    }
    data = {
        "meeting_url": "https://meet.google.com/abc-defg-hij",
        "bot_name": "AI Notetaker",
        "recording_mode": "speaker_view",
        "join_at": "2025-01-20T14:00:00Z"  # ISO 8601 format
    }
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```
  </Tab>
  <Tab value="JavaScript">
    ```javascript
    fetch("https://api.meetingbaas.com/v2/bots/scheduled", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": "YOUR-API-KEY",
      },
      body: JSON.stringify({
        meeting_url: "https://meet.google.com/abc-defg-hij",
        bot_name: "AI Notetaker",
        recording_mode: "speaker_view",
        join_at: "2025-01-20T14:00:00Z"  // ISO 8601 format
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data.data.bot_id))
      .catch((error) => console.error("Error:", error));
    ```
  </Tab>
</Tabs>

## Request Parameters

### Required Parameters

- `meeting_url`: The meeting URL (Google Meet, Microsoft Teams, or Zoom)
- `bot_name`: The display name of the bot

### Recording Options

- `recording_mode`: One of:
  - `"speaker_view"` (default): Shows only the active speaker
  - `"gallery_view"`: Shows all participants
  - `"audio_only"`: Audio recording only (MP3)

### Bot Appearance

- `bot_image`: Optional. URL to the bot's avatar image (JPEG or PNG, HTTPS required)

### Transcription

- `transcription_enabled`: Set to `true` to enable transcription
- `transcription_config`: Required if `transcription_enabled` is `true`:
  - `provider`: `"gladia"` (default) or `"assemblyai"`
  - `api_key`: Optional. Your transcription provider API key (for BYOK transcription)
  - `custom_params`: Optional. Custom parameters for the transcription provider

### Callbacks

- `callback_enabled`: Set to `true` to enable callbacks for this bot
- `callback_config`: Required if `callback_enabled` is `true`:
  - `url`: The URL to receive callback notifications
  - `method`: `"POST"` (default) or `"PUT"`
  - `secret`: Optional. Secret key included in `x-mb-secret` header for verification

### Timeouts

- `timeout_config`: Optional object:
  - `waiting_room_timeout`: Seconds to wait in waiting room (default: 600)
  - `no_one_joined_timeout`: Seconds to wait if no one joins (default: 600, isn't used by Zoom)

### Advanced Options

- `allow_multiple_bots`: `true` (default) to allow multiple bots in the same meeting, `false` to prevent duplicates
- `entry_message`: Optional message the bot sends when joining
- `extra`: Optional custom metadata (included in webhooks and callbacks)
- `streaming_enabled`: Enable audio streaming
- `streaming_config`: Required if `streaming_enabled` is `true`

### Scheduled Bot Specific

- `join_at`: Required for scheduled bots. ISO 8601 timestamp when the bot should join

## Response

The API returns the bot ID:

```json
{
  "success": true,
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

For scheduled bots, the `bot_id` is returned immediately and will be reused when the bot actually joins the meeting.

## Next Steps

- [Get meeting data](/docs/api-v2/getting-started/getting-the-data)
- [Set up webhooks](/docs/api-v2/webhooks) for real-time notifications
- [Remove a bot](/docs/api-v2/getting-started/removing-a-bot)



---

## Setting up webhooks

Learn how to configure webhooks to receive real-time notifications

### Source: ./content/docs/api-v2/getting-started/webhooks.mdx


# Setting Up Webhooks

Webhooks allow you to receive real-time notifications about bot and calendar events without polling the API.

## Overview

Meeting BaaS v2 uses [SVIX](https://www.svix.com/) for reliable webhook delivery. Webhooks are configured at the account level and will receive notifications for all events.

## Configuring Webhooks

Webhooks are configured through your account settings (not via the API). Once configured, you'll receive webhook events for:

- Bot status changes
- Bot completion
- Bot failures
- Calendar events (connections, syncs, event changes)

## Webhook Events

### Bot Events

- `bot.status_change`: Triggered when a bot's status changes
- `bot.completed`: Triggered when a bot successfully completes
- `bot.failed`: Triggered when a bot fails

### Calendar Events

- `calendar.connection_created`: New calendar connection created
- `calendar.connection_updated`: Calendar connection updated
- `calendar.connection_deleted`: Calendar connection deleted
- `calendar.connection_error`: Calendar connection error
- `calendar.events_synced`: Calendar events synced - When a calendar syncs for the first time
- `calendar.event_created`: New calendar event created
- `calendar.event_updated`: Calendar event updated
- `calendar.event_cancelled`: Calendar event cancelled

For detailed information about each event type, see the [Webhooks documentation](/docs/api-v2/webhooks).

## Webhook Security

All webhooks are signed using SVIX's signature verification. Verify webhooks using:

- `svix-id`: Unique message ID
- `svix-timestamp`: Timestamp of the message
- `svix-signature`: Signature for verification

Use SVIX's verification libraries to verify webhook signatures in your code.

## Callbacks

In addition to account-level webhooks, you can also configure **callbacks** per-bot when creating a bot. Callbacks are direct HTTP requests sent to a URL you specify, and are only sent for `bot.completed` and `bot.failed` events.

See the [Webhooks documentation](/docs/api-v2/webhooks) for more details on callbacks.



---

## Introduction

Get started with the Meeting BaaS API v2

### Source: ./content/docs/api-v2/index.mdx


<Callout type="info">
  Meeting BaaS API v2 is the latest version of our API, featuring improved architecture, better error handling, and enhanced features. 
  Both v1 and v2 APIs are currently available and will run in parallel. For v1 documentation, see [API v1](/docs/api).
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

## What's New in v2?

- **Enhanced Error Handling**: More detailed error messages and standardized error responses
- **Better Token Management**: Improved token reservation and consumption tracking
- **Batch Operations**: Create multiple bots in a single request with partial success support
- **Advanced Filtering**: More powerful query parameters for listing bots and events
- **Comprehensive Webhooks**: Detailed webhook events for bot and calendar operations
- **Calendar Integration**: Enhanced calendar sync and bot scheduling features
- **Rate Limiting**: Liberal rate limits per team
- **Deduplication**: Built-in protection against duplicate bot creation

## Getting Started

Ready to start? Check out our [Getting Started Guide](/docs/api-v2/getting-started) to learn how to:

- Send your first bot to a meeting
- Retrieve meeting data
- Set up webhooks
- Integrate calendars

## API Reference

Browse the complete [API Reference](/docs/api-v2/reference) for detailed documentation on all endpoints, request/response schemas, and error codes.



---

## Migration Guide

Complete guide to migrating from Meeting BaaS API v1 to v2

### Source: ./content/docs/api-v2/migration-guide.mdx


# Migration Guide: v1 to v2

This guide helps you migrate your integration from Meeting BaaS API v1 to v2. Both APIs will run in parallel, but v2 offers improved architecture, better error handling, and enhanced features.

<Callout type="warn">
  **Important**: Meeting BaaS v2 does **not** support automatic data migration. Bot data, calendar connections, and scheduled bots from v1 will not be automatically migrated to v2. You'll need to recreate calendar connections and any scheduled bots in v2.
</Callout>

## Overview of Changes

### Key Architectural Changes

- **API Versioning**: v2 uses `/v2/*` prefix for all endpoints
- **Authentication**: Simplified to API key authentication only (no JWT)
- **Response Format**: Standardized `{success, data, error}` structure
- **Error Handling**: Consistent error codes with `FST_ERR_` prefix
- **Naming Convention**: Public API uses `snake_case` for all fields

### What's New in v2

- **Batch Operations**: Create multiple bots in a single request
- **Scheduled Bots**: Separate endpoints for scheduled bots with update/delete support
- **Enhanced Webhooks**: More detailed webhook events and callbacks
- **Better Error Codes**: Standardized error codes for programmatic handling
- **Rate Limiting**: Per-team rate limits with clear error messages
- **Deduplication**: Built-in protection against duplicate bot creation
- **Calendar Integration**: Improved calendar sync and bot scheduling

## Authentication Changes

### v1 Authentication

v1 public API routes used API key authentication:

- **Header**: `x-meeting-baas-api-key` or `x-spoke-api-key` (legacy)
- **Required**: All public `/bots/*` and `/calendars/*` endpoints required this header

### v2 Authentication

v2 uses the same API key authentication:

- **Header**: `x-meeting-baas-api-key`
- **Required**: All `/v2/*` endpoints require this header
- **Legacy Header**: `x-spoke-api-key` is no longer supported

**Migration Step**: 
- Ensure you're using `x-meeting-baas-api-key` header (not the legacy `x-spoke-api-key`)
- No other authentication changes needed - API key authentication works the same way

## Endpoint Mapping

### Bot Endpoints

| v1 Endpoint | v2 Endpoint | Changes |
|------------|-------------|---------|
| `POST /bots` | `POST /v2/bots` | Response format changed |
| `GET /bots/bots_with_metadata` | `GET /v2/bots` | New filtering options |
| `GET /bots/meeting_data` | `GET /v2/bots/:bot_id` | Different response structure |
| `DELETE /bots/:uuid` | `POST /v2/bots/:bot_id/leave` | Method changed, new status requirements |
| `POST /bots/:uuid/delete_data` | `DELETE /v2/bots/:bot_id/delete-data` | Method changed, path updated |
| `GET /bots/:uuid/screenshots` | `GET /v2/bots/:bot_id/screenshots` | Path parameter name changed |
| - | `GET /v2/bots/:bot_id/status` | New endpoint for lightweight status checks |
| - | `POST /v2/bots/batch` | New batch creation endpoint |
| - | `POST /v2/bots/scheduled` | New scheduled bot creation |
| - | `GET /v2/bots/scheduled` | New scheduled bot listing |
| - | `GET /v2/bots/scheduled/:bot_id` | New scheduled bot details |
| - | `PATCH /v2/bots/scheduled/:bot_id` | New scheduled bot update |
| - | `DELETE /v2/bots/scheduled/:bot_id` | New scheduled bot deletion |

### Calendar Endpoints

| v1 Endpoint | v2 Endpoint | Changes |
|------------|-------------|---------|
| `POST /calendars` | `POST /v2/calendars` | OAuth credentials required in request |
| `GET /calendars` | `GET /v2/calendars` | Response format changed |
| `GET /calendar_events` | `GET /v2/calendars/:calendar_id/events` | Path structure changed |
| - | `POST /v2/calendars/list-raw` | New endpoint to preview calendars |
| - | `GET /v2/calendars/:calendar_id` | New endpoint for calendar details |
| - | `PATCH /v2/calendars/:calendar_id` | New endpoint to update credentials |
| - | `DELETE /v2/calendars/:calendar_id` | New endpoint to delete connection |
| - | `POST /v2/calendars/:calendar_id/sync` | New endpoint to force sync |
| - | `POST /v2/calendars/:calendar_id/bots` | New endpoint to schedule bots for events |

## Request/Response Format Changes

### Response Structure

**v1 Response** (varied by endpoint):
```json
{
  "bot_id": "uuid",
  "status": "in_call_recording",
  ...
}
```

**v2 Response** (standardized):
```json
{
  "success": true,
  "data": {
    "bot_id": "uuid",
    "status": "in_call_recording",
    ...
  }
}
```

**Error Response** (v2):
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "FST_ERR_BOT_NOT_FOUND_BY_ID",
  "statusCode": 404,
  "details": null
}
```

### Field Naming

Both v1 and v2 use `snake_case` for all public API fields:

- `bot_id`
- `created_at`
- `meeting_url`
- `bot_name`

**No changes needed** - field naming remains consistent between v1 and v2.

### Bot Creation Request

**v1**:
```json
{
  "meeting_url": "https://meet.google.com/...",
  "bot_name": "AI Notetaker",
  "recording_mode": "speaker_view",
  "start_time": "2025-01-20T14:00:00Z"  // Optional, for scheduling
}
```

**v2** (Immediate):
```json
{
  "meeting_url": "https://meet.google.com/...",
  "bot_name": "AI Notetaker",
  "recording_mode": "speaker_view",
  "transcription_enabled": true,
  "transcription_config": {
    "provider": "gladia"
  }
}
```

**v2** (Scheduled - separate endpoint):
```json
{
  "meeting_url": "https://meet.google.com/...",
  "bot_name": "AI Notetaker",
  "recording_mode": "speaker_view",
  "join_at": "2025-01-20T14:00:00Z"  // Required for scheduled bots
}
```

**Key Changes**:
- Scheduled bots use separate endpoint (`POST /v2/bots/scheduled`)
- `start_time` renamed to `join_at` for scheduled bots
- `transcription_enabled` and `transcription_config` are explicit in v2

## Error Handling Changes

### Error Codes

v2 uses standardized error codes with `FST_ERR_` prefix:

| v1 Error | v2 Error Code | Description |
|----------|---------------|-------------|
| `InvalidApiKey` | `FST_ERR_FORBIDDEN` | Invalid or missing API key |
| `BotNotFound` | `FST_ERR_BOT_NOT_FOUND_BY_ID` | Bot not found |
| `InsufficientTokens` | `FST_ERR_INSUFFICIENT_TOKENS` | Not enough tokens |
| `TooManyRequests` | `FST_ERR_TOO_MANY_REQUESTS` | Rate limit exceeded |
| - | `FST_ERR_BOT_ALREADY_EXISTS` | Duplicate bot detected |
| - | `FST_ERR_DAILY_BOT_CAP_REACHED` | Daily bot limit reached |
| - | `FST_ERR_BOT_STATUS` | Invalid bot status for operation |

### Error Response Format

**v1** (varied):
```json
{
  "error": "Bot not found"
}
```

**v2** (standardized):
```json
{
  "success": false,
  "error": "Bot with ID 'uuid' not found",
  "code": "FST_ERR_BOT_NOT_FOUND_BY_ID",
  "statusCode": 404,
  "details": null
}
```

**Migration Step**: Update error handling code to check `success: false` and use `code` field for programmatic error handling.

## Webhook Changes

### Webhook Events

v2 introduces new webhook event types and improved payloads:

**New Events in v2**:
- `bot.status_change` - Bot status transitions
- `calendar.connection_created` - Calendar connection established
- `calendar.connection_updated` - Calendar credentials updated
- `calendar.connection_deleted` - Calendar connection removed
- `calendar.connection_error` - Calendar sync errors
- `calendar.events_synced` - Calendar events synced
- `calendar.event_created` - New calendar event detected
- `calendar.event_updated` - Calendar event modified
- `calendar.event_cancelled` - Calendar event cancelled

**Enhanced Events**:
- `bot.completed` - More detailed payload with error information
- `bot.failed` - Standardized error codes and messages

### Webhook Payload Structure

**v1** (varied by event):
```json
{
  "event": "bot.completed",
  "bot_id": "uuid",
  "status": "completed",
  ...
}
```

**v2** (standardized):
```json
{
  "event": "bot.completed",
  "data": {
    "bot_id": "uuid",
    "status": "completed",
    "error_code": null,
    "error_message": null,
    ...
  },
  "sent_at": "2025-01-20T14:00:00Z"
}
```

### Callbacks

v2 introduces **callbacks** - bot-specific HTTP POST/PUT requests separate from account-level webhooks:

- Configured per bot via `callback_config`
- Only sent for `bot.completed` and `bot.failed` events
- Uses the same payload structure as webhooks

**Migration Step**: Update webhook handlers to:
1. Check `event` field (same as v1, but new event types added)
2. Access data via `data` object
3. Handle new calendar webhook events
4. Consider implementing callbacks for bot-specific notifications

## Transcription Changes

v2 introduces significant improvements to transcription handling, providing better security, flexibility, and access to raw transcription data.

### Storage and Access Model

**v1 Transcription**:
- Transcription data embedded in webhook payloads
- No access to raw provider responses
- No transcription ID tracking

**v2 Transcription**:
- **S3-based storage**: All transcriptions stored as JSON files in S3
- **Presigned URLs**: Access transcriptions via secure, time-limited presigned URLs
- **Raw transcription access**: Full provider response preserved (includes LLM summaries if configured)
- **Transcription ID tracking**: Each transcription has a unique `provider_id` (useful for BYOK users)
- **Standardized output**: Consistent `output_transcription.json` format regardless of provider

### Transcription Files

v2 creates multiple transcription artifacts:

1. **Raw Transcription** (`raw_transcription.json`):
   - Contains the complete, unmodified response from the transcription provider
   - Includes all custom parameters you configured (e.g., LLM summaries, language detection)
   - Preserves provider-specific metadata
   - Multiple transcription chunks are combined into a single file
   - Accessible via presigned URL in bot artifacts
   - **Note**: Raw transcriptions are presented as an array without time duration offsets or speaker diarization. They're best used alongside the final `output_transcription.json` which includes proper timestamp adjustments and speaker mappings.

2. **Output Transcription** (`output_transcription.json`):
   - Standardized format across all providers
   - Diarized with speaker names mapped from meeting participants
   - Timestamps adjusted for multi-chunk transcriptions
   - Accessible via presigned URL in bot artifacts

### Accessing Transcriptions

**v1** (embedded in webhook):
```json
{
  "event": "complete",
  "bot_id": "uuid",
  "transcript": [
    {
      "speaker": "John Doe",
      "text": "Hello everyone",
      "start_time": 0.5,
      "end_time": 2.1
    }
  ]
}
```

**v2** (via presigned URLs):
```json
{
  "event": "bot.completed",
  "data": {
    "bot_id": "uuid",
    "raw_transcription": "https://s3.amazonaws.com/...",
    "transcription": "https://s3.amazonaws.com/...",
    "transcription_ids": ["gladia-job-12345"],
    "transcription_provider": "gladia"
  }
}
```

### Transcription IDs for BYOK Users

v2 provides `transcription_ids` as an array of provider job IDs in bot details and webhook payloads:

- **Useful for BYOK (Bring Your Own Key)**: Track your own transcription jobs with the provider
- **Error correlation**: Match transcription errors to specific provider job IDs
- **Multi-chunk support**: Each audio chunk gets its own provider ID

**Example** (from bot details or webhook):
```json
{
  "transcription_ids": ["gladia-job-12345", "gladia-job-12346"],
  "transcription_provider": "gladia"
}
```

### Custom Parameters and LLM Summaries

v2 preserves all custom parameters you pass to the transcription provider:

**Request**:
```json
{
  "transcription_config": {
    "provider": "gladia",
    "custom_parameters": {
      "llm_summary": true,
      "summary_prompt": "Summarize this meeting",
      "language_detection": true
    }
  }
}
```

**Raw Transcription Response** (in `raw_transcription.json`):
```json
{
  "bot_id": "uuid",
  "transcriptions": [
    {
      "transcription": {
        "utterances": [...],
        "summary": "Meeting discussed Q4 goals...",  // LLM summary if configured
        "languages": ["en", "es"],
        "metadata": {...}
      }
    }
  ]
}
```

### Security Improvements

**v1**: Transcription data sent directly in webhook payloads (potential size limits, security concerns)

**v2**: 
- Transcriptions stored securely in S3
- Access via presigned URLs with expiration
- No sensitive data in webhook payloads
- Better handling of large transcriptions
- Supports multi-chunk recordings without payload size issues

### Migration Steps

1. **Update Webhook Handlers**:
   - Instead of reading transcript from webhook payload, fetch from presigned URL
   - Handle both `raw_transcription` and `transcription` artifacts
   - Download and parse JSON files from S3

2. **Handle Presigned URLs**:
   - Presigned URLs expire after a set time (typically 24 hours)
   - Download transcriptions promptly after receiving webhook
   - Store transcriptions in your own storage if needed long-term

3. **Use Transcription IDs** (if BYOK):
   - Access `transcription_ids` array from bot details or webhook payload
   - Correlate with your own provider job tracking
   - Use for error handling and debugging

4. **Leverage Raw Transcription**:
   - Access LLM summaries and custom provider features
   - Use raw data for custom processing
   - Preserve provider-specific metadata

**Example Migration**:

**v1 Code**:
```javascript
webhookHandler(event) {
  const transcript = event.transcript; // Direct access
  processTranscript(transcript);
}
```

**v2 Code**:
```javascript
webhookHandler(event) {
  // Get transcription URL from webhook payload
  const transcriptionUrl = event.data.transcription;
  
  if (transcriptionUrl) {
    // Download from presigned URL
    const response = await fetch(transcriptionUrl);
    const transcription = await response.json();
    
    processTranscript(transcription.result.utterances);
  }
}
```

## Calendar Integration Changes

### OAuth Model

**v1**: Meeting BaaS managed OAuth applications

**v2**: **Bring-your-own-credentials** model:
- You create and manage your own OAuth applications
- You provide OAuth credentials (`client_id`, `client_secret`, `refresh_token`) when creating calendar connections
- More control and flexibility

### Calendar Connection Creation

**v1**:
```json
POST /calendars
{
  "platform": "google",
  "refresh_token": "user_refresh_token"
}
```

**v2**:
```json
POST /v2/calendars
{
  "calendar_platform": "google",
  "oauth_client_id": "your_client_id",
  "oauth_client_secret": "your_client_secret",
  "oauth_refresh_token": "user_refresh_token",
  "raw_calendar_id": "primary"
}
```

**Key Changes**:
- Must provide your own OAuth `client_id` and `client_secret`
- Must specify `raw_calendar_id` (use `POST /v2/calendars/list-raw` to get available calendars)
- Microsoft requires `oauth_tenant_id` (defaults to `"common"`)

**Migration Step**: 
1. Create OAuth applications with Google/Microsoft (see [Calendar Integration Guide](/docs/api-v2/getting-started/calendars))
2. Implement OAuth flow to get user refresh tokens
3. Recreate all calendar connections in v2 with new credentials

## Token Import from v1

v2 allows you to import your remaining tokens from v1, ensuring a smooth transition without losing your token balance.

### How to Import Tokens

1. **Access Token Settings**: Navigate to Settings > Usage in the v2 dashboard
2. **Click "Import from v1"**: This opens the import dialog
3. **Check Available Tokens**: The dialog shows your available v1 token balance
4. **Enter Amount**: Specify how many tokens to import (can import all or a portion)
5. **Confirm Import**: Tokens are immediately added to your v2 team's balance

### Important Notes

- **UI Only**: Token import is only available via the dashboard UI, not through the API
- **One-Time Import**: You can import tokens multiple times, but it's recommended to import all at once
- **Team-Based**: Imported tokens go to your current team's balance
- **Irreversible**: Once imported, tokens cannot be transferred back to v1
- **No Expiration**: Imported tokens don't expire and work the same as purchased tokens

## Data Migration

<Callout type="warn">
  **No Automatic Data Migration**: Meeting BaaS v2 does **not** automatically migrate data from v1. You'll need to:
</Callout>

### What's NOT Migrated

- **Bot Data**: Historical bot recordings, transcriptions, and metadata
- **Calendar Connections**: All calendar connections must be recreated
- **Scheduled Bots**: All scheduled bots must be recreated
- **Webhook Configurations**: Webhook endpoints must be reconfigured

### What You Need to Do

1. **Import Tokens** (if applicable):
   - Import remaining tokens from v1 (see [Token Import](#token-import-from-v1) above)
   - This ensures you don't lose your token balance

2. **Export Important Data** (if needed):
   - Download any bot recordings or transcriptions you need to keep
   - Note any scheduled bot configurations
   - Document calendar connection mappings

3. **Recreate Calendar Connections**:
   - Set up OAuth applications (see [Calendar Integration Guide](/docs/api-v2/getting-started/calendars))
   - Reconnect all user calendars via v2 API
   - Reschedule any calendar-based bots

4. **Recreate Scheduled Bots**:
   - List all active scheduled bots in v1
   - Recreate them in v2 using `POST /v2/bots/scheduled`

5. **Update Webhook Endpoints**:
   - Configure webhook endpoints in v2
   - Update webhook handlers to support new event types

## Step-by-Step Migration Checklist

### Phase 1: Preparation

- [ ] Review v2 API documentation
- [ ] Set up OAuth applications for calendar integration (if using calendars)
- [ ] Export any critical data from v1
- [ ] Test v2 API with a new API key in a development environment

### Phase 2: Code Updates

- [ ] Update base URL from `/bots` to `/v2/bots`
- [ ] Update authentication to use only `x-meeting-baas-api-key` header
- [ ] Update request/response parsing for standardized format
- [ ] Update error handling for new error codes
- [ ] Update field names to `snake_case`
- [ ] Separate immediate and scheduled bot creation logic
- [ ] Update webhook handlers for new event structure
- [ ] Implement calendar OAuth flow (if using calendars)

### Phase 3: Testing

- [ ] Test bot creation (immediate)
- [ ] Test bot creation (scheduled)
- [ ] Test bot listing and filtering
- [ ] Test bot status checks
- [ ] Test bot leave operation
- [ ] Test bot data deletion
- [ ] Test webhook delivery
- [ ] Test calendar integration (if using)
- [ ] Test error scenarios

### Phase 4: Deployment

- [ ] Deploy updated code to staging
- [ ] Monitor webhook delivery
- [ ] Verify calendar sync (if using)
- [ ] Deploy to production
- [ ] Monitor for issues

### Phase 5: Data Migration

- [ ] Recreate calendar connections in v2
- [ ] Reschedule any calendar-based bots
- [ ] Recreate scheduled bots in v2
- [ ] Configure webhook endpoints in v2
- [ ] Verify all integrations are working

## Common Migration Issues

### Issue: "Invalid API Key"

**Solution**: Ensure you're using the `x-meeting-baas-api-key` header (not JWT or legacy header).

### Issue: "Field not found" errors

**Solution**: Update all field names to `snake_case` (e.g., `botId` → `bot_id`).

### Issue: Webhooks not received

**Solution**: 
1. Verify webhook endpoint is configured in v2
2. Check webhook payload structure matches v2 format
3. Ensure your endpoint can handle new event types

### Issue: Calendar connection fails

**Solution**:
1. Verify OAuth credentials are correct
2. Ensure refresh token includes `offline_access` scope (Microsoft) or `access_type=offline` (Google)
3. Check that Google Calendar API is enabled in your Google Cloud project

### Issue: Scheduled bots not executing

**Solution**:
1. Verify `join_at` is in the future
2. Check bot status via `GET /v2/bots/scheduled/:bot_id`
3. Ensure sufficient tokens are available at execution time

## Getting Help

If you encounter issues during migration:

1. **Documentation**: Check the [v2 API Reference](/docs/api-v2/reference)
2. **Error Codes**: See [Error Codes Guide](/docs/api-v2/error-codes)
3. **Support**: Visit [Support Center](https://dashboard.meetingbaas.com/support-center)
4. **Community**: Join our Discord server

## Next Steps

After completing migration:

1. **Monitor**: Keep an eye on webhook delivery and error rates
2. **Optimize**: Take advantage of v2 features like batch operations
3. **Update**: Keep your integration updated with new v2 features

---

<Callout type="info">
  Both v1 and v2 APIs will continue to run in parallel. You can migrate at your own pace, but we recommend migrating to v2 to take advantage of improved features and better error handling.
</Callout>



---

## New Features

Discover all the enhancements and improvements in Meeting BaaS API v2

### Source: ./content/docs/api-v2/new-features.mdx


# New Features in v2

Meeting BaaS v2 introduces significant improvements across security, transparency, developer experience, and feature availability. This document highlights the key enhancements that make v2 a compelling upgrade from v1.

## Enhanced Webhook Management

v2 provides enterprise-grade webhook management with multiple endpoints, signing, and rotation capabilities.

### Multiple Webhook Endpoints

**v1**: Single webhook URL per account

**v2**: 
- Create multiple webhook endpoints per team
- Each endpoint can subscribe to different event types
- Name and organize endpoints for better management
- Enable/disable endpoints without deletion
- Perfect for routing different events to different systems

### Webhook Security

**v1**: Basic webhook delivery

**v2**:
- **Webhook Signing**: All webhooks are cryptographically signed using SVIX
- **Secret Rotation**: Rotate webhook secrets without downtime
- **Message History**: View and resend failed webhook deliveries
- **Delivery Tracking**: Monitor webhook delivery status and retry failed messages

### Benefits

- Route different events to different systems (e.g., `bot.completed` to analytics, `calendar.event_created` to scheduling system)
- Rotate secrets for security compliance
- Debug webhook issues with message history
- Ensure reliable delivery with automatic retries

## Multiple API Keys

v2 enables better API key management for teams and applications.

### Key Features

**v1**: Single API key per account

**v2**:
- **Multiple API Keys**: Create multiple named API keys
- **Permission Types**: 
  - **Full Access**: Read, write, and delete operations
  - **Sending Access**: Write-only for bot creation endpoints (perfect for webhook-only integrations)

### Use Cases

- Separate keys for production and staging environments
- Create read-only keys for monitoring dashboards
- Use "Sending Access" keys for webhook-only integrations

## Teams-First Design

v2 is built around teams, enabling better collaboration and organization.

### Team Features

**v1**: Account-based (single user focus)

**v2**:
- **Team Organization**: All resources (bots, calendars, API keys) belong to teams
- **Team Members**: Invite team members with different roles (owner, admin, member)
- **Team Switching**: Switch between multiple teams in the dashboard
- **Team-Level Limits**: Daily bot caps, calendar limits, and rate limits are per-team
- **Team-Level Features**: Plans and features are configured per team

### Benefits

- Organize resources by project or department
- Collaborate with team members
- Manage multiple projects with separate teams
- Better access control and permissions

## Advanced Token Management

v2 provides comprehensive token management with transparency and automation.

### Automatic Token Refilling

**v1**: Manual token purchases

**v2**:
- **Auto-Refill**: Automatically purchase tokens when balance drops below threshold
- **Configurable Threshold**: Set your preferred minimum token balance
- **Token Pack Selection**: Choose which token pack to auto-purchase
- **Zero Downtime**: Never run out of tokens with automatic refilling

### Token Reminders

**v1**: No reminder system

**v2**:
- **Email Reminders**: Get notified when token balance is low
- **Configurable Threshold**: Set reminder threshold
- **Custom Email**: Configure reminder email address
- **Proactive Management**: Stay ahead of token depletion

### Token Consumption Transparency

**v1**: Limited visibility into token usage

**v2**:
- **Bot-Level Tracking**: See exact token consumption per bot
- **Breakdown by Type**: 
  - Recording tokens
  - Transcription tokens (or BYOK transcription tokens)
  - Streaming input/output tokens
- **Reserved Tokens**: See tokens reserved by active bots
- **Usage Dashboard**: Track total tokens consumed, available, and reserved

### Token Import from v1

**v1**: Tokens locked in v1 account

**v2**:
- **One-Time Import**: Transfer remaining tokens from v1 to v2
- **Team-Based**: Imported tokens go to your team's balance
- **Flexible Amount**: Import all or a portion of your v1 tokens
- **Seamless Migration**: Continue using tokens without interruption

## Improved Transcription

v2 offers enhanced transcription capabilities with better models and more flexibility.

### Transcription Provider

**v1**: Basic transcription with limited options

**v2**:
- **Gladia Integration**: Enhanced transcription model with better accuracy
- **Custom Parameters**: Configure advanced transcription features:
  - **LLM Summaries**: Get AI-generated meeting summaries
  - **Language Detection**: Automatic language identification
  - **Translation**: Translate transcriptions to multiple languages
  - **Custom Vocabulary**: Improve accuracy for domain-specific terms
  - **Subtitles**: Generate subtitles in multiple formats
- **BYOK Support**: Use your own transcription provider API keys (saves tokens)

### Transcription Access

**v1**: Transcription embedded in webhook payloads

**v2**:
- **Raw Transcription**: Access complete provider response (includes LLM summaries, metadata)
- **Standardized Output**: Consistent transcription format across all providers
- **S3 Storage**: Secure storage with presigned URLs
- **Transcription IDs**: Track transcription jobs for BYOK users

## Standardized Request/Response Handling

v2 provides consistent, predictable API responses.

### Response Format

**v1**: Varied response structures across endpoints

**v2**:
- **Standardized Structure**: All responses follow `{success, data, error}` format
- **Consistent Error Format**: Uniform error responses with codes and messages
- **Better Error Codes**: Programmatic error codes (e.g., `FST_ERR_BOT_NOT_FOUND_BY_ID`)
- **Type Safety**: OpenAPI schemas for all endpoints

### Benefits

- Easier error handling in your code
- Better API documentation
- Consistent developer experience
- Type-safe integrations

## Integrated Support System

v2 includes a built-in support system for better customer service.

### Support Tickets

**v1**: External support channels

**v2**:
- **In-App Support**: Create support tickets directly from the dashboard
- **Bot-Specific Tickets**: Link tickets to specific bots for context
- **Screenshot Attachments**: Attach screenshots and files to tickets
- **Ticket Types**: 
  - Bug reports
  - Feature requests
  - General support
  - Billing inquiries
- **Status Tracking**: Track ticket status (open, in progress, resolved, closed)
- **Message Threads**: Maintain conversation history in tickets

### Benefits

- Faster support response times
- Better context with bot-specific tickets
- Feature request feedback loop
- Integrated support experience

## Invoice Management

v2 provides direct access to billing information.

### Invoice Features

**v1**: Invoices via email only

**v2**:
- **Dashboard Access**: View all invoices directly in the dashboard
- **Download PDFs**: Download invoice PDFs
- **Hosted Invoices**: Access Stripe-hosted invoice pages
- **Payment History**: Track payment status and history
- **Billing Information**: Manage billing details and payment methods

### Benefits

- Easy access to billing records
- Better expense tracking
- Simplified accounting
- Self-service billing management

## Automatic Data Deletion

v2 includes automatic data retention and deletion for compliance and cost management.

### Data Retention

**v1**: Manual data management

**v2**:
- **Automatic Deletion**: Data automatically deleted after retention period
- **Plan-Based Retention**: 
  - Pay-as-you-go: 3 days
  - Pro: 7 days
  - Scale: 14 days
  - Enterprise: 30 days
- **Bot Data Protection**: Bots with open support tickets are protected from deletion
- **Manual Deletion**: Delete data early via API if needed

### Benefits

- Compliance with data retention policies
- Automatic cleanup
- Protection for active support cases

## Calendar Integration for All Plans

v2 makes calendar integration available to all users, not just enterprise.

### Calendar Availability

**v1**: Calendar integration was enterprise-only

**v2**:
- **Pay-as-You-Go**: 2 calendar integrations included
- **Pro**: 10 calendar integrations
- **Scale**: 100 calendar integrations
- **Enterprise**: 1,000+ calendar integrations

### Enhanced Calendar Features

- **Bring-Your-Own-Credentials**: Use your own OAuth applications
- **Multiple Connections**: Connect multiple calendars per team
- **Better Sync**: Improved calendar event synchronization
- **Webhook Events**: Rich calendar webhook events for real-time updates

## Scheduled Bots Management

v2 provides full lifecycle management for scheduled bots.

### Scheduled Bot Features

**v1**: Basic scheduling with `start_time` parameter

**v2**:
- **Dedicated Endpoints**: Separate endpoints for scheduled bots
- **Update Support**: Modify scheduled bot configuration before execution
- **Delete Support**: Cancel scheduled bots before they execute
- **Status Tracking**: Track scheduled bot status (scheduled, active, completed, cancelled, failed)
- **Batch Operations**: Create multiple scheduled bots in one request

### Benefits

- Better control over scheduled meetings
- Update meetings that change
- Cancel unnecessary scheduled bots
- Manage recurring meetings efficiently

## Batch Operations

v2 enables efficient bulk operations.

### Batch Features

**v1**: One bot per request

**v2**:
- **Batch Bot Creation**: Create up to 100 bots in a single request
- **Batch Scheduled Bots**: Create multiple scheduled bots at once
- **Partial Success**: Get detailed results for each bot in the batch
- **Error Mapping**: Map errors to specific items in the batch

### Benefits

- Faster bulk operations
- Reduced API calls
- Better error handling
- Efficient onboarding workflows

## Enhanced Error Handling

v2 provides detailed, actionable error information.

### Error Improvements

**v1**: Generic error messages

**v2**:
- **Standardized Error Codes**: Consistent error codes (e.g., `FST_ERR_INSUFFICIENT_TOKENS`)
- **Detailed Messages**: Human-readable error messages
- **Error Context**: Additional error details when available
- **HTTP Status Codes**: Proper HTTP status codes for each error type

### Bot Process Errors

v2 includes comprehensive bot process error documentation:
- Normal end reasons (e.g., `BOT_REMOVED`, `NO_ATTENDEES`)
- Error end reasons (e.g., `BOT_NOT_ACCEPTED`, `TIMEOUT_WAITING_TO_START`)
- Transcription errors (e.g., `TRANSCRIPTION_FAILED`)
- Platform-specific errors (Zoom, Meet, Teams)

## Improved Deduplication

v2 provides better protection against duplicate bots.

### Deduplication Features

**v1**: Basic deduplication

**v2**:
- **Configurable**: Control deduplication per bot with `allow_multiple_bots` flag
- **Lock Window**: 4-minute lock window prevents race conditions
- **Clear Errors**: `BOT_ALREADY_EXISTS` error with helpful message
- **Fail-Open**: System continues to work even if deduplication check fails

## Rate Limiting Transparency

v2 provides clear rate limiting with per-team configuration.

### Rate Limiting Features

**v1**: Limited rate limiting visibility

**v2**:
- **Per-Team Limits**: Rate limits configured per team/plan
- **Per-Second Limits**: Clear per-second rate limit configuration
- **GET Request Exclusion**: GET requests don't count toward rate limits
- **Clear Error Messages**: `FST_ERR_TOO_MANY_REQUESTS` with retry information
- **Dashboard Display**: See rate limits in the dashboard

## Better Developer Experience

v2 focuses on making integration easier and more reliable.

### API Improvements

- **Better Documentation**: Comprehensive guides and examples
- **Error Codes**: Programmatic error handling
- **Webhook Reliability**: Message history and resend capabilities

### Dashboard Features

- **Bot Details**: Comprehensive bot information with token breakdown
- **Status History**: Track bot status changes over time
- **Artifact Management**: Easy access to recordings, transcriptions, and screenshots
- **Support Integration**: Create support tickets directly from bot details
- **Team Management**: Easy team switching and member management

## Summary

v2 represents a significant upgrade in:

- **Security**: Webhook signing, secret rotation, multiple API keys
- **Transparency**: Bot-level token tracking, detailed error codes, status history
- **Automation**: Auto-refill, token reminders, automatic data deletion
- **Flexibility**: Multiple webhooks, multiple API keys, team organization
- **Accessibility**: Calendar integration on all plans, better support system
- **Developer Experience**: Standardized responses, better errors, comprehensive documentation

These improvements make v2 the clear choice for new integrations and provide compelling reasons to migrate from v1.



---

## Create multiple bots

### Source: ./content/docs/api-v2/reference/bots/batch-create-bots.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Create multiple bots in a single request with partial success support.
    
    Processes each bot creation request sequentially (index 0, 1, 2...). Each item is validated and processed independently. If some bots fail to create, the request still returns 201 with a `data` array containing successful creations and an `errors` array containing failures. Each error includes the `index` of the failed item in the original request array.
    
    **Processing Order:** Items are processed in the order they appear in the request array. Each item goes through the same validation and checks as a single bot creation: platform detection, BYOK transcription check, daily bot cap check, token availability check, and deduplication lock acquisition.
    
    **Partial Success:** The response always has `success: true`, even if all items fail. Check the `errors` array to identify failed items. The `data` array contains successfully created bots with their `bot_id` and preserved `extra` metadata. The `errors` array contains failed items with `index`, `code`, `message`, `details`, and preserved `extra` metadata.
    
    **Daily Bot Cap:** The daily bot cap is checked per item, not per batch. If the cap is reached mid-batch, subsequent items will fail with `DAILY_BOT_CAP_REACHED` error. The cap is based on bots created in the last 24 hours.
    
    **Token Reservation:** Tokens are reserved individually for each successful bot creation (0.5 tokens per bot). If token availability becomes insufficient mid-batch, subsequent items will fail with `INSUFFICIENT_TOKENS`.
    
    **Error Index Mapping:** Each error includes an `index` field (0-based) that corresponds to the item's position in the request array. Use this to correlate errors with your original request. Validation errors include detailed validation issues in the `details` field.
    
    **Error Isolation:** Each bot creation is processed independently. If one bot creation fails, it does not affect other bots in the batch. Failed items are included in the `errors` array while successful items are in the `data` array.
    
    Returns 201 with partial success response. All items may succeed, all may fail, or any combination. Always check both `data` and `errors` arrays.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/batch","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Create multiple scheduled bots

### Source: ./content/docs/api-v2/reference/bots/batch-create-scheduled-bots.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Create multiple scheduled bots in a single request with partial success support.
    
    Processes each scheduled bot creation request sequentially. Each item is validated and processed independently. Token reservation and daily bot cap checks are NOT performed at creation time - they are performed when each bot actually joins the meeting.
    
    **Processing Order:** Items are processed in the order they appear in the request array. Each item goes through validation: platform detection, BYOK transcription check, and join time validation. Unlike immediate bot creation, daily bot cap and token availability are not checked at creation time.
    
    **Partial Success:** The response always has `success: true`, even if all items fail. Check the `errors` array to identify failed items. The `data` array contains successfully scheduled bots with their `bot_id` and preserved `extra` metadata.
    
    **Join Time Validation:** Each scheduled bot's `join_at` time must be in the future (at least 1 minute ahead). If a join time is invalid, that item will fail with a validation error, but other items will continue processing.
    
    **Error Scenarios:** 
    - Validation errors: Invalid join time, invalid meeting URL, invalid configuration
    - Platform detection failures: `INVALID_MEETING_PLATFORM`
    - BYOK not enabled: `BYOK_TRANSCRIPTION_NOT_ENABLED_ON_PLAN`
    - System failures: `BOT_CREATE_FAILED`
    
    **Note:** Daily bot cap and token availability are checked when each bot joins, not at creation time. If these checks fail at join time, the bot will transition to `failed` status and send a failure webhook.
    
    Returns 201 with partial success response. All items may succeed, all may fail, or any combination.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/scheduled/batch","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Create a bot

### Source: ./content/docs/api-v2/reference/bots/create-bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Create a bot to join a meeting immediately.
    
    The bot will automatically join the meeting, request recording permissions, and start recording once accepted. You can provide a bot-specific callback URL to receive bot.completed and bot.failed events for this bot (in addition to your account's webhooks). The bot will send webhook events for status changes, completion, and failures.
    
    Returns a `bot_id` (UUID) that you can use to track status, retrieve meeting data, and manage the bot. The bot will be queued immediately and join the meeting as soon as possible (may take up to 2 minutes depending on availability of bot slots).
    
    **Token Reservation:** 0.5 tokens are reserved immediately upon creation. These tokens will be consumed based on the bot's duration and outcome. If the bot fails due to user-responsible errors (`BOT_NOT_ACCEPTED`, `TIMEOUT_WAITING_TO_START`), recording tokens will be charged based on the time spent in the waiting room.
    
    **Deduplication:** By default, multiple bots can join the same meeting URL. Set `allow_multiple_bots: false` to prevent duplicate bots within 5 minutes. The deduplication check expires after 5 minutes, allowing a new bot to join the same meeting URL after that period.
    
    **Rate Limits:** Subject to your API key's rate limits and your team's daily bot cap. The daily bot cap is checked before token reservation. If the cap is reached, the request will fail with a 429 status code.
    
    **Error Scenarios:**
    - `402 Payment Required`: Insufficient tokens available
    - `409 Conflict`: Bot already exists for the same meeting URL (when `allow_multiple_bots` is false)
    - `429 Too Many Requests`: Daily bot cap reached or rate limit exceeded

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Create scheduled bot

### Source: ./content/docs/api-v2/reference/bots/create-scheduled-bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Schedule a bot to join a meeting at a specific time in the future.
    
    The bot will automatically join the meeting at the specified `join_at` time (ISO 8601 timestamp). You can provide a callback URL to receive events for this bot. The bot configuration is stored immediately, but token reservation and daily bot cap checks are performed when the bot actually joins the meeting.
    
    **Scheduling:** The `join_at` timestamp must be in the future (at least 1 minute ahead). The bot will automatically attempt to join the meeting at the specified time. There may be a small processing delay (typically less than a minute).
    
    **Token Reservation:** Tokens are NOT reserved at creation time. Token availability and daily bot cap are checked when the bot actually joins the meeting. If tokens are insufficient or the daily cap is reached at join time, the bot will fail with an appropriate error and transition to `failed` status.
    
    **Deduplication:** Deduplication is checked when the bot joins, not at creation time. This means you can schedule multiple bots for the same meeting URL, but only one will successfully join (unless `allow_multiple_bots` is true).
    
    **Status:** The scheduled bot starts in `scheduled` status and transitions to `completed` when the bot instance is created and queued to join. If the bot fails to join, it transitions to `failed` status.
    
    **Updates and Deletions:** Scheduled bots can be updated or deleted as long as they are in `scheduled` status and the join time is at least 4 minutes in the future. This ensures the bot can be modified before it starts processing.
    
    Returns a `bot_id` (UUID) that you can use to track and manage the scheduled bot. This UUID will be reused as the bot's UUID when it actually joins.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/scheduled","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Delete bot data

### Source: ./content/docs/api-v2/reference/bots/delete-bot-data.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Permanently delete all bot data including recordings, transcripts, summaries, and screenshots.
    
    This operation is irreversible. All artifacts (video, audio, transcription, diarization, screenshots) will be permanently deleted. Optionally delete transcription data from the transcription provider as well using the `delete_transcription` query parameter.
    
    **Data Deletion:** 
    - All artifacts (video, audio, transcription, diarization, screenshots) are permanently deleted
    - The `artifacts_deleted` field is set to `true`
    - Artifact URLs will return `null` in subsequent API calls
    - Bot metadata remains accessible but all associated data is removed
    
    **Transcription Provider Deletion:** If `delete_transcription=true` is provided, the transcription data will also be deleted from the transcription provider (e.g., Gladia). This requires the bot to have transcription enabled and a transcription provider configured. If the bot uses BYOK transcription, you must have access to the transcription provider API key.
    
    **Irreversible Operation:** Once data is deleted, it cannot be recovered. Make sure you have downloaded or backed up any data you need before calling this endpoint.
    
    **Status:** This operation can be performed on bots in any status. Even if the bot is still recording, the data will be deleted (though new data may continue to be generated until the bot completes).
    
    Returns 404 if the bot is not found or does not belong to your team.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/{bot_id}/delete-data","method":"delete"}]} webhooks={[]} hasHead={false} />

---

## Delete scheduled bot

### Source: ./content/docs/api-v2/reference/bots/delete-scheduled-bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Cancel and delete a scheduled bot.
    
    The bot must be in `scheduled` status and the join time must be at least 4 minutes in the future. This ensures the bot can be updated before it starts processing. Once deleted, the scheduled bot cannot be recovered.
    
    **Status Requirements:** The bot must be in `scheduled` status. Bots that have already joined (`completed`) or failed (`failed`) cannot be deleted via this endpoint. If the bot is in an invalid state, the request will fail with a 409 Conflict status.
    
    **Join Time Requirements:** The join time must be at least 4 minutes in the future. If the join time is too close, the request will fail with 409 Conflict. This ensures the bot can be cancelled before it starts processing.
    
    **Irreversible Operation:** Once a scheduled bot is deleted, it cannot be recovered. If you need to cancel a bot that is about to join, you should use the leave endpoint on the actual bot instance instead.
    
    **No Token Impact:** Since tokens are not reserved for scheduled bots, deleting a scheduled bot does not affect your token balance.
    
    Returns 404 if the scheduled bot is not found, or 409 if the bot's status does not allow deletion or the join time is too close.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/scheduled/{bot_id}","method":"delete"}]} webhooks={[]} hasHead={false} />

---

## Get bot details

### Source: ./content/docs/api-v2/reference/bots/get-bot-details.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Get comprehensive information about a specific bot.
    
    Returns detailed bot information including current status, configuration, meeting metadata, and presigned URLs for all artifacts (video, audio, transcription, diarization). Artifact URLs are valid for 4 hours from the time of request. Returns `null` for artifacts if the bot's data has been deleted.
    
    **Artifact URLs:** All artifact URLs (video, audio, transcription, diarization) are presigned URLs that expire after 4 hours. If the bot's data has been deleted (via the delete-data endpoint or data retention policy), these fields will be `null`. The `artifacts_deleted` field indicates whether the bot's data has been permanently removed.
    
    **Status Information:** The response includes the bot's current status (`status` field) and timestamps for key events (joined_at, exited_at, created_at). If the bot failed, the response includes `error_code` and `error_message` fields with details about what went wrong.
    
    **Meeting Metadata:** Includes meeting platform, meeting URL, participants list, speakers list, and meeting duration (if available). Some metadata may be `null` if the bot failed before joining or if the information is not available.
    
    **Transcription Information:** If transcription was enabled, the response includes transcription provider, transcription IDs (for BYOK providers), and URLs to raw and processed transcription files.
    
    Returns 404 if the bot is not found or does not belong to your team.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/{bot_id}","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Get bot screenshots

### Source: ./content/docs/api-v2/reference/bots/get-bot-screenshots.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieve a paginated list of screenshot URLs captured during the meeting.
    
    Screenshots are taken periodically during the meeting and can be used to visualize meeting content. Each screenshot is a presigned URL valid for 4 hours.
    
    **Screenshot Availability:** 
    - Screenshots are only available for Google Meet and Microsoft Teams bots
    - Screenshots are only available for bots with `recording_mode` set to `speaker_view` or `gallery_view`
    - Audio-only recordings do not have screenshots
    - Screenshots are captured at regular intervals during the meeting
    
    **Pagination:** Uses cursor-based pagination. Provide a `cursor` query parameter to fetch the next page. The `limit` parameter controls how many screenshots are returned per page (default: 50, max: 100).
    
    **URL Expiration:** All screenshot URLs are presigned URLs that expire after 4 hours. If the bot's data has been deleted, this endpoint will return an empty list.
    
    Returns 404 if the bot is not found or does not belong to your team.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/{bot_id}/screenshots","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Get bot status

### Source: ./content/docs/api-v2/reference/bots/get-bot-status.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Get the current status of a bot, including the latest status code, transcription status, and timestamp.
    
    Useful for polling bot state without fetching the full bot details. Returns lightweight status information including the current status code, transcription status, and when the status was last updated (`updated_at`).
    
    **Response Fields:**
    - `bot_id`: The UUID of the bot
    - `status`: The current bot status (queued, joining, in_call_recording, transcribing, completed, failed)
    - `transcription_status`: The current transcription status (not-applicable, not-started, queued, processing, done, error)
    - `updated_at`: ISO 8601 timestamp when the status was last updated
    
    **Transcription Status:** The transcription status is fetched in real-time from the transcription provider (e.g., Gladia) if transcription is enabled. This allows you to track transcription progress separately from the bot's overall status.
    
    **Polling Considerations:** 
    - **Not Recommended for Active Monitoring:** Due to the nature of meetings running for extended periods (often hours), frequent polling is not recommended. Instead, use `callback_config` when creating bots or configure webhooks at the account level to receive real-time status updates.
    - **Reconciliation Use Case:** This endpoint is better suited for reconciliation purposes (e.g., checking bot status after a webhook delivery failure or verifying final state).
    - **If Polling is Necessary:** If you must poll, use a judicious interval (e.g., every 5-10 minutes) and implement exponential backoff to avoid rate limits. Consider the meeting duration when determining polling frequency.
    
    Returns 404 if the bot is not found or does not belong to your team.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/{bot_id}/status","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Get scheduled bot details

### Source: ./content/docs/api-v2/reference/bots/get-scheduled-bot-details.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieve detailed information about a specific scheduled bot.
    
    Returns the scheduled bot's configuration, scheduled join time, current status, and associated bot instance (if the bot has already joined). Includes all the same configuration options as immediate bot creation.
    
    **Status Information:** The response includes the scheduled bot's current status (`scheduled`, `completed`, or `failed`) and when the status was last updated. If the bot has joined, the response includes a link to the actual bot instance.
    
    **Scheduled Join Time:** The `join_at` field contains the ISO 8601 timestamp when the bot is scheduled to join the meeting.
    
    **Bot Instance:** If the scheduled bot has transitioned to `completed` status, the bot instance has been created and is queued to join. You can use the `bot_id` (which will be reused as the bot's UUID when it joins) to query the bot's status and retrieve meeting data once it has joined.
    
    **Updates and Deletions:** If the bot is in `scheduled` status and the join time is at least 4 minutes in the future, you can update or delete the scheduled bot. This ensures the bot can be modified before it starts processing.
    
    Returns 404 if the scheduled bot is not found or does not belong to your team.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/scheduled/{bot_id}","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Leave meeting

### Source: ./content/docs/api-v2/reference/bots/leave-bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Instruct a bot to leave the meeting immediately.
    
    The bot will stop recording and processing, then exit the meeting. Only works if the bot is currently in the meeting (status is `in_call_recording` or `transcribing`). The bot will send a final webhook event when it leaves.
    
    **Status Requirements:** The bot must be in a state that allows leaving. Bots that have already completed, failed, or are not yet in the meeting cannot be left via this endpoint. If the bot is in an invalid state, the request will fail with a 409 Conflict status.
    
    **Token Consumption:** When a bot is manually left, tokens are consumed based on the duration from when recording started to when the bot left. The bot will transition to `completed` status and send a completion webhook.
    
    **Immediate Effect:** The leave command is sent to the bot process immediately. The bot will stop recording and exit the meeting as soon as it receives the command (usually within a few seconds).
    
    Returns 404 if the bot is not found, or 409 if the bot's status does not allow this operation.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/{bot_id}/leave","method":"post"}]} webhooks={[]} hasHead={false} />

---

## List bots

### Source: ./content/docs/api-v2/reference/bots/list-bots.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

List all bots for your team with pagination support.
    
    Filter by status (queued, joining, in_call_recording, transcribing, completed, failed), meeting platform (zoom, meet, teams), and date range. Results are ordered by creation date (newest first). Use cursor-based pagination for efficient navigation through large result sets.
    
    **Pagination:** Uses cursor-based pagination. Provide a `cursor` query parameter to fetch the next page. The response includes a `next_cursor` if more results are available. The `limit` parameter controls how many results are returned per page (default: 20, max: 100).
    
    **Filtering:** 
    - `status`: Filter by bot status (comma-separated for multiple statuses)
    - `platform`: Filter by meeting platform (zoom, meet, teams)
    - `created_after`: ISO 8601 timestamp - only return bots created after this time
    - `created_before`: ISO 8601 timestamp - only return bots created before this time
    
    **Date Range:** The `created_after` and `created_before` filters use ISO 8601 timestamps. Results are limited to bots created within the last 90 days by default.
    
    Returns a paginated list of bots with metadata including bot ID, status, meeting platform, creation time, and basic configuration.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots","method":"get"}]} webhooks={[]} hasHead={false} />

---

## List scheduled bots

### Source: ./content/docs/api-v2/reference/bots/list-scheduled-bots.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieve a paginated list of scheduled bots.
    
    Supports filtering by status (`scheduled`, `completed`, `failed`) and date range. Results are ordered by scheduled join time (earliest first). Use cursor-based pagination for efficient navigation.
    
    **Pagination:** Uses cursor-based pagination. Provide a `cursor` query parameter to fetch the next page. The `limit` parameter controls how many results are returned per page (default: 20, max: 100).
    
    **Filtering:**
    - `status`: Filter by scheduled bot status (comma-separated for multiple statuses)
    - `scheduled_after`: ISO 8601 timestamp - only return bots scheduled to join after this time
    - `scheduled_before`: ISO 8601 timestamp - only return bots scheduled to join before this time
    
    **Status Values:**
    - `scheduled`: Bot is scheduled but has not yet joined
    - `completed`: Bot instance was created and queued to join (bot may still be joining)
    - `failed`: Bot failed to join (token issues, daily cap, etc.)
    
    Returns a paginated list of scheduled bots with metadata including bot ID, scheduled join time, status, and basic configuration.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/scheduled","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Resend final webhook

### Source: ./content/docs/api-v2/reference/bots/resend-final-webhook.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Resend the final webhook (completed or failed) for a bot.
    
    Useful if the webhook delivery failed or you need to reprocess the webhook event. The webhook will be sent to all configured webhook endpoints for your account.
    
    **Webhook Delivery:** The webhook will be sent to all configured webhook endpoints for your account. The webhook payload will be identical to the original final webhook (either `bot.completed` or `bot.failed` event).
    
    **Status Requirements:** The bot must be in `completed` or `failed` status. Bots that are still in progress cannot have their final webhook resent. If the bot is in an invalid state, the request will fail with a 409 Conflict status.
    
    **Use Cases:** 
    - Webhook delivery failed due to network issues
    - Webhook endpoint was temporarily unavailable
    - Need to reprocess a webhook event
    - Testing webhook integration
    
    **Idempotency:** This operation is idempotent. You can call it multiple times, and it will resend the webhook each time. There is no limit on how many times you can resend a webhook.
    
    Returns 404 if the bot is not found, or 409 if the bot's status does not allow this operation.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/{bot_id}/resend-webhook","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Retry callback

### Source: ./content/docs/api-v2/reference/bots/retry-callback.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retry sending the transcription callback for a bot.
    
    You can override the callback configuration (URL, method, secret) if needed. Only works for bots that have completed or failed. The callback will be sent to the provided URL (or the bot's original callback URL if not overridden).
    
    **Callback Configuration:** You can override the callback URL, HTTP method (POST or PUT), and secret in the request body. If not provided, the bot's original callback configuration will be used. The secret will be included in the `x-mb-secret` header for validation.
    
    **Status Requirements:** The bot must be in `completed` or `failed` status and must have had transcription enabled. Bots without transcription or bots that are still in progress cannot have their callback retried. If the bot is in an invalid state, the request will fail with a 409 Conflict status.
    
    **Callback Payload:** The callback payload will be identical to the original callback (either `bot.completed` or `bot.failed` event with transcription data). The payload format matches the webhook format.
    
    **Use Cases:**
    - Callback delivery failed due to network issues
    - Callback endpoint was temporarily unavailable
    - Need to send callback to a different endpoint
    - Testing callback integration
    
    **Idempotency:** This operation is idempotent. You can call it multiple times with the same or different configurations.
    
    Returns 404 if the bot is not found, or 409 if the bot's status does not allow this operation or if no callback was configured.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/{bot_id}/retry-callback","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Update scheduled bot

### Source: ./content/docs/api-v2/reference/bots/update-scheduled-bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Update a scheduled bot's configuration or scheduled join time.
    
    The bot must be in `scheduled` status and the join time must be at least 4 minutes in the future. This ensures the bot can be updated before it starts processing.
    
    **Updateable Fields:** You can update any configuration field (bot name, image, recording mode, transcription settings, etc.) and the scheduled join time (`join_at`). All fields are optional - only provided fields will be updated.
    
    **Join Time Requirements:** 
    - The new `join_at` time must be in the future
    - The bot must be in `scheduled` status
    - The join time must be at least 4 minutes in the future (lock window)
    - If the join time is too close, the request will fail with 409 Conflict
    
    **Status Requirements:** The bot must be in `scheduled` status. Bots that have already joined (`completed`) or failed (`failed`) cannot be updated. If the bot is in an invalid state, the request will fail with a 409 Conflict status.
    
    **Validation:** All updated fields are validated using the same rules as bot creation. Invalid configurations will result in a 400 Bad Request error.
    
    Returns 404 if the scheduled bot is not found, or 409 if the bot's status does not allow update or the join time is too close.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/bots/scheduled/{bot_id}","method":"patch"}]} webhooks={[]} hasHead={false} />

---

## Schedule bot for calendar event

### Source: ./content/docs/api-v2/reference/calendars/create-calendar-bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Schedule a bot to automatically join a calendar event.
    
    You can schedule for all occurrences of a recurring event or specific event instances. The bot will use the meeting URL from the event. Returns partial success if some events fail to schedule (e.g., if a bot is already scheduled or if the event doesn't have a meeting URL).
    
    **Scheduling Options:**
    - `series_id`: Schedule for all occurrences of a recurring series
    - `event_id`: Schedule for a specific event instance
    - `all_occurrences`: Schedule for all future occurrences (for recurring events)
    
    **Meeting URL Requirement:** The event must have a meeting URL. If the event doesn't have a meeting URL, the scheduling will fail for that event. The meeting platform is automatically detected from the URL.
    
    **Bot Configuration:** You can provide bot configuration (name, image, recording mode, transcription settings, etc.) that will be used for all scheduled bots. The configuration applies to all events you're scheduling for.
    
    **Partial Success:** If you're scheduling for multiple events (e.g., all occurrences of a series), some events may fail to schedule (e.g., if a bot is already scheduled). The response includes information about which events succeeded and which failed.
    
    **Token Reservation:** Tokens are NOT reserved at scheduling time. Token availability and daily bot cap are checked when each bot actually joins the meeting. If tokens are insufficient or the daily cap is reached at join time, the bot will fail with an appropriate error.
    
    **Status:** The calendar bot schedule starts in `scheduled` status and transitions to `completed` when the bot instance is created and queued to join. If the bot fails to join, it transitions to `failed` status.
    
    Returns 201 with scheduling results. Returns 404 if the event series or event is not found.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}/bots","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Create calendar connection

### Source: ./content/docs/api-v2/reference/calendars/create-calendar-connection.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Connect a Google or Microsoft calendar to your account.
    
    The connection will automatically sync events and create push subscriptions for real-time updates. You must provide your own OAuth credentials (client ID, secret, refresh token). Once connected, the calendar will be synced immediately, and webhook subscriptions will be created for real-time event updates.
    
    **OAuth Credentials:** You must provide valid OAuth credentials for the calendar provider. The endpoint will validate the credentials by attempting to refresh the access token. If the refresh token is invalid or expired, the request will fail with 401 Unauthorized.
    
    **Initial Sync:** After creating the connection, an initial sync is performed automatically. This fetches all events from the calendar provider. The sync may take a few minutes for calendars with many events.
    
    **Push Subscriptions:** A push subscription is created automatically for real-time event updates. The subscription will send webhooks when events are created, updated, or cancelled. Subscriptions expire after a certain period (3 days for Microsoft, longer for Google) and need to be renewed using the resubscribe endpoint.
    
    **Calendar Limits:** There may be limits on the number of calendar connections per team. If the limit is exceeded, the request will fail with 403 Forbidden.
    
    **Duplicate Connections:** If a connection already exists for the same calendar ID and team, the request will fail with 409 Conflict. You can update an existing connection using the PATCH endpoint instead.
    
    Returns 201 with the newly created calendar connection. Returns 401 if OAuth token refresh failed, 403 if the calendar connection limit is exceeded, or 409 if the connection already exists.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Cancel calendar bot

### Source: ./content/docs/api-v2/reference/calendars/delete-calendar-bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Cancel one or more scheduled calendar bots.
    
    You can target a single event or all occurrences in a series using `series_id`, `all_occurrences`, and `event_id` in the request body. Bots must be in `scheduled` status and the join time must be at least 4 minutes in the future.
    
    **Cancellation Targets:**
    - `event_id`: Cancel bot for a specific event instance
    - `series_id`: Cancel bots for all occurrences of a series
    - `all_occurrences`: Cancel all future occurrences (for recurring events)
    
    **Status Requirements:** Bots must be in `scheduled` status. Bots that have already joined (`completed`) or failed (`failed`) cannot be cancelled via this endpoint. If a bot is in an invalid state, that bot will fail to cancel, but other bots may still be cancelled.
    
    **Join Time Requirements:** The join time must be at least 4 minutes in the future. If the join time is too close, the request will fail with 409 Conflict. This ensures the bot can be updated before it starts processing.
    
    **Partial Cancellation:** If cancelling multiple bots (e.g., all occurrences of a series), some bots may fail to cancel (e.g., if they're not in `scheduled` status). The response includes information about which bots were cancelled and which failed.
    
    **Irreversible Operation:** Once a calendar bot is cancelled, it cannot be recovered. If you need to cancel a bot that is about to join, you should use the leave endpoint on the actual bot instance instead.
    
    **No Token Impact:** Since tokens are not reserved for calendar bots, cancelling a bot does not affect your token balance.
    
    Returns 200 with cancellation results. Returns 404 if the event or calendar bot schedule is not found, or 409 if the bot's status does not allow deletion.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}/bots","method":"delete"}]} webhooks={[]} hasHead={false} />

---

## Delete calendar connection

### Source: ./content/docs/api-v2/reference/calendars/delete-calendar-connection.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Disconnect and delete a calendar connection.
    
    This will stop syncing events and remove all associated calendar data (events, event instances, series). The push subscription will be cancelled automatically. This operation is irreversible.
    
    **Data Deletion:** All calendar data associated with this connection will be deleted:
    - Event series and instances
    - Calendar bot schedules
    - Sync history
    
    **Subscription Cancellation:** The push subscription is cancelled automatically when the connection is deleted. You will no longer receive webhooks for this calendar.
    
    **Irreversible Operation:** Once a calendar connection is deleted, it cannot be recovered. All associated data is permanently removed. If you need to reconnect the calendar, you must create a new connection.
    
    **Bot Schedules:** If there are active calendar bot schedules for events in this calendar, they will be cancelled when the connection is deleted. Bots that have already joined meetings will continue to function normally.
    
    Returns 200 with confirmation of deletion. Returns 404 if the calendar connection is not found or does not belong to your team.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}","method":"delete"}]} webhooks={[]} hasHead={false} />

---

## Get calendar connection details

### Source: ./content/docs/api-v2/reference/calendars/get-calendar-details.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieve detailed information about a specific calendar connection.
    
    Returns the calendar connection's configuration, sync status, subscription status, and last sync time. Includes information about the OAuth credentials (without exposing sensitive data) and the calendar's metadata.
    
    **Sync Status:** The response includes the last sync time and whether the connection is actively syncing. If the connection has errors, the error information is included.
    
    **Subscription Status:** Includes information about the push subscription, including when it was created and when it expires. Subscriptions expire after a certain period and need to be renewed using the resubscribe endpoint.
    
    **Calendar Metadata:** Includes the calendar's ID, name, platform, and account email. This information is fetched from the calendar provider during the initial sync.
    
    Returns 404 if the calendar connection is not found or does not belong to your team.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}","method":"get"}]} webhooks={[]} hasHead={false} />

---

## Get event details

### Source: ./content/docs/api-v2/reference/calendars/get-event-details.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieve detailed information about a specific calendar event.
    
    Returns comprehensive event information including attendees, meeting URL, meeting platform, status, and whether a bot is scheduled. Returns deleted events as well (use the `include_deleted` parameter or check the `deleted_at` field).
    
    **Event Details:** Includes all event metadata:
    - Title, description, location
    - Start and end times (ISO 8601 timestamps)
    - Status (confirmed, cancelled, tentative)
    - Attendees list
    - Meeting URL (if available)
    - Meeting platform (if detected from URL)
    - Whether it's an all-day event
    - Whether it's an exception to a recurring series
    
    **Bot Scheduling:** The `bot_scheduled` field indicates whether a calendar bot schedule exists for this event. If the event is part of a recurring series, the `series_bot_scheduled` field indicates whether a bot is scheduled for all occurrences.
    
    **Deleted Events:** Deleted events are included in the response. Check the `deleted_at` field to determine if an event has been deleted. Deleted events may still have associated bot schedules if they were scheduled before deletion.
    
    Returns 404 if the event is not found or does not belong to the specified calendar.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}/events/{event_id}","method":"get"}]} webhooks={[]} hasHead={false} />

---

## List calendar connections

### Source: ./content/docs/api-v2/reference/calendars/list-calendars.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieve a paginated list of calendar connections.
    
    Supports filtering by calendar platform (google, microsoft) and connection status (active, error, revoked, permission_denied). Results are ordered by creation date (newest first). Use cursor-based pagination for efficient navigation.
    
    **Pagination:** Uses cursor-based pagination. Provide a `cursor` query parameter to fetch the next page. The `limit` parameter controls how many results are returned per page (default: 20, max: 100).
    
    **Filtering:**
    - `platform`: Filter by calendar platform (google, microsoft)
    - `status`: Filter by connection status (active, error, revoked, permission_denied)
    
    **Connection Status:**
    - `active`: Connection is working and syncing events
    - `error`: Connection has errors (OAuth token refresh failed, etc.)
    - `revoked`: OAuth access was revoked by the user
    - `permission_denied`: Insufficient permissions for the OAuth scopes
    
    Returns a paginated list of calendar connections with metadata including calendar ID, platform, account email, status, and last sync time.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars","method":"get"}]} webhooks={[]} hasHead={false} />

---

## List event series

### Source: ./content/docs/api-v2/reference/calendars/list-event-series.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieve a paginated list of event series (both one-off and recurring events).
    
    Each series includes its associated event instances. Supports filtering by event type (one_off, recurring) and whether series are deleted. Use cursor-based pagination for efficient navigation.
    
    **Pagination:** Uses cursor-based pagination. Provide a `cursor` query parameter to fetch the next page. The `limit` parameter controls how many results are returned per page (default: 20, max: 100).
    
    **Event Types:**
    - `one_off`: Single events (not part of a recurring series)
    - `recurring`: Events that are part of a recurring series
    
    **Series Information:** Each series includes its series ID, event type, whether a bot is scheduled for all occurrences (`series_bot_scheduled`), and an array of event instances. For one-off events, the instances array contains a single instance. For recurring events, it contains all instances that have been synced.
    
    **Filtering:**
    - `event_type`: Filter by event type (one_off, recurring)
    - `include_deleted`: Include deleted series in results (default: false)
    
    **Bot Scheduling:** The `series_bot_scheduled` field indicates whether a calendar bot schedule exists for all occurrences of this series. Individual instances may have different bot scheduling status.
    
    Returns a paginated list of event series with their instances.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}/series","method":"get"}]} webhooks={[]} hasHead={false} />

---

## List calendar events

### Source: ./content/docs/api-v2/reference/calendars/list-events.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Retrieve a paginated list of calendar events.
    
    Supports filtering by date range, status (confirmed, cancelled, tentative), and whether events are deleted. Results include whether a bot is scheduled for each event. Use cursor-based pagination for efficient navigation.
    
    **Pagination:** Uses cursor-based pagination. Provide a `cursor` query parameter to fetch the next page. The `limit` parameter controls how many results are returned per page (default: 20, max: 100).
    
    **Filtering:**
    - `start_after`: ISO 8601 timestamp - only return events starting after this time
    - `start_before`: ISO 8601 timestamp - only return events starting before this time
    - `status`: Filter by event status (confirmed, cancelled, tentative)
    - `include_deleted`: Include deleted events in results (default: false)
    
    **Event Information:** Each event includes its ID, title, start/end times, status, meeting URL (if available), meeting platform (if detected), and whether a bot is scheduled for the event.
    
    **Bot Scheduling:** The `bot_scheduled` field indicates whether a calendar bot schedule exists for this event. This does not mean the bot has joined - it means a bot is scheduled to join when the event starts.
    
    Returns a paginated list of calendar events with metadata.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}/events","method":"get"}]} webhooks={[]} hasHead={false} />

---

## List available calendars

### Source: ./content/docs/api-v2/reference/calendars/list-raw-calendars.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Preview available calendars from a Google or Microsoft account before creating a connection.
    
    Requires OAuth credentials (client ID, client secret, refresh token) to authenticate and list calendars. This endpoint does not create a connection - it only lists the calendars that are available for the given OAuth credentials. Useful for allowing users to select which calendars to sync.
    
    **OAuth Credentials:** You must provide valid OAuth credentials for the calendar provider. The endpoint will use the refresh token to obtain an access token and list calendars. If the refresh token is invalid or expired, the request will fail with 401 Unauthorized.
    
    **Calendar Information:** Returns a list of calendars with their IDs, names, descriptions, and whether they are primary calendars. Calendar IDs differ between providers (Google uses email-like IDs, Microsoft uses GUIDs).
    
    **Use Case:** This endpoint is typically called before creating a calendar connection to show users which calendars are available. Users can then select which calendars they want to sync.
    
    Returns 401 if OAuth token refresh failed, or 403 if a Microsoft account license is required.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/list-raw","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Resubscribe to calendar webhooks

### Source: ./content/docs/api-v2/reference/calendars/resubscribe-calendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Renew or recreate the push subscription for a calendar connection.
    
    Useful when subscriptions expire or need to be refreshed. A new subscription will be created and the old one will be cancelled. Subscriptions expire after a certain period (3 days for Microsoft, longer for Google) and need to be renewed periodically.
    
    **Subscription Renewal:** The endpoint creates a new push subscription with the calendar provider. The old subscription is cancelled to prevent duplicate webhooks. The new subscription will send webhooks for all calendar events (created, updated, cancelled).
    
    **Subscription Expiration:** Subscriptions expire automatically after a certain period:
    - Microsoft: 3 days maximum
    - Google: Longer period (varies)
    
    When a subscription expires, you will stop receiving webhook notifications. Use this endpoint to renew the subscription before it expires.
    
    **Use Cases:**
    - Subscription is about to expire
    - Subscription has expired and webhooks stopped working
    - Need to refresh subscription for troubleshooting
    
    **Response:** The response includes information about the new subscription, including when it was created and when it expires.
    
    Returns 200 with subscription information. Returns 401 if OAuth token refresh failed, 403 if permission is denied, or 404 if the calendar connection is not found.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}/resubscribe","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Sync calendar events

### Source: ./content/docs/api-v2/reference/calendars/sync-calendar.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Manually trigger a sync of calendar events.
    
    This will fetch all events from the calendar provider and update the calendar data. Events are normally synced automatically via push subscriptions, but you can use this endpoint to force a sync (e.g., after fixing connection errors or when you need immediate updates).
    
    **Sync Process:** The sync process fetches all events from the calendar provider. New events are added, updated events are modified, and cancelled events are marked as deleted. The sync may take a few minutes for calendars with many events.
    
    **Incremental vs Full Sync:** The endpoint performs a full sync, fetching all events from the calendar. Incremental syncs happen automatically via push subscriptions when events are created, updated, or cancelled.
    
    **Use Cases:**
    - Force a sync after fixing connection errors
    - Get immediate updates without waiting for push notifications
    - Recover from missed push notifications
    - Initial sync after creating a connection (though this happens automatically)
    
    **Response:** The response includes information about the sync operation, including how many events were synced. The actual event data is available via the list events endpoint.
    
    Returns 200 with sync results. Returns 401 if OAuth token refresh failed, or 404 if the calendar connection is not found.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}/sync","method":"post"}]} webhooks={[]} hasHead={false} />

---

## Update calendar bot

### Source: ./content/docs/api-v2/reference/calendars/update-calendar-bot.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Update one or more calendar bots for a calendar.
    
    You can target a single event or all occurrences in a series using `series_id`, `all_occurrences`, and `event_id` in the request body. The bot must be in `scheduled` status and the join time must be at least 4 minutes in the future.
    
    **Update Targets:**
    - `event_id`: Update bot for a specific event instance
    - `series_id`: Update bots for all occurrences of a series
    - `all_occurrences`: Update all future occurrences (for recurring events)
    
    **Updateable Fields:** You can update any bot configuration field (bot name, image, recording mode, transcription settings, etc.). All fields are optional - only provided fields will be updated.
    
    **Status Requirements:** The bot must be in `scheduled` status. Bots that have already joined (`completed`) or failed (`failed`) cannot be updated. If the bot is in an invalid state, the request will fail with a 409 Conflict status.
    
    **Join Time Requirements:** The join time must be at least 4 minutes in the future. If the join time is too close, the request will fail with 409 Conflict. This ensures the bot can be updated before it starts processing.
    
    **Partial Updates:** If updating multiple bots (e.g., all occurrences of a series), some bots may fail to update (e.g., if they're not in `scheduled` status). The response includes information about which bots were updated and which failed.
    
    Returns 200 with update results. Returns 404 if the event or calendar bot schedule is not found, or 409 if the bot's status does not allow update.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}/bots","method":"patch"}]} webhooks={[]} hasHead={false} />

---

## Update calendar connection

### Source: ./content/docs/api-v2/reference/calendars/update-calendar-connection.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Update a calendar connection with new OAuth credentials.
    
    Useful when refresh tokens expire or credentials need to be rotated. The connection will be validated and a new push subscription will be created. The old subscription will be cancelled automatically.
    
    **OAuth Credentials:** You can update the client ID, client secret, and refresh token. All fields are optional - only provided fields will be updated. The endpoint will validate the new credentials by attempting to refresh the access token.
    
    **Validation:** After updating credentials, the connection is validated by attempting to refresh the access token. If the refresh fails, the connection status is updated to `error` and the request may fail with 401 Unauthorized.
    
    **Subscription Renewal:** A new push subscription is created automatically after updating credentials. The old subscription is cancelled to prevent duplicate webhooks.
    
    **Use Cases:**
    - Refresh token expired and needs to be renewed
    - OAuth credentials rotated for security
    - Fixing connection errors by updating credentials
    
    Returns 200 with the updated calendar connection. Returns 401 if OAuth token refresh failed, 403 if permission is denied, or 404 if the calendar connection is not found.

<APIPage document={"./openapi-v2.json"} operations={[{"path":"/v2/calendars/{calendar_id}","method":"patch"}]} webhooks={[]} hasHead={false} />

---

## API Reference

Complete API reference for Meeting BaaS v2

### Source: ./content/docs/api-v2/reference/index.mdx


The API reference is automatically generated from the OpenAPI specification. All endpoints are organized by tag (Bots, Calendars, etc.).

<Note>
  The API reference pages are generated automatically. If you don't see any endpoints listed, make sure to:
  1. Fetch the v2 OpenAPI spec: `./scripts/update-openapi-v2.sh`
  2. Generate the docs: `pnpm build:pre`
</Note>

## Webhook & Callback Payloads

Reference documentation for all webhook and callback payload structures is available in the [Webhooks & Callbacks](./webhooks) section.



---

## Bot Completed

Bot Completed payload structure

### Source: ./content/docs/api-v2/reference/webhooks/botwebhookcompleted.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |
| `extra` | object | null | Yes | Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`audio`** (string (uri) | null) **Required**
      Signed URL to download the audio recording. Valid for 4 hours. Null if audio recording is not available or has been deleted

    - **`bot_id`** (string (uuid)) **Required**
      The UUID of the bot that completed

    - **`data_deleted`** (boolean) **Required**
      Whether the bot's data (artifacts, recordings) has been deleted. True if data has been permanently removed

    - **`diarization`** (string (uri) | null) **Required**
      Signed URL to download the speaker diarization data. Valid for 4 hours. Null if diarization is not available or has been deleted

    - **`duration_seconds`** (integer | null) **Required**

    - **`event_id`** (string (uuid) | null) **Required**
      The UUID of the calendar event associated with this bot. Null for non-calendar bots

    - **`exited_at`** (string (date-time) | null) **Required**
      ISO 8601 timestamp when the bot exited the meeting. Null if exit time is not available

    - **`joined_at`** (string (date-time) | null) **Required**
      ISO 8601 timestamp when the bot joined the meeting. Null if join time is not available

    - **`participants`** (string[] | null) **Required**
      List of participant names or identifiers who joined the meeting. Null if participant information is not available

    - **`raw_transcription`** (string (uri) | null) **Required**
      Signed URL to download the raw transcription file. Valid for 4 hours. Null if raw transcription is not available or has been deleted

    - **`sent_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when this webhook was sent

    - **`speakers`** (string[] | null) **Required**
      List of speaker names or identifiers detected in the meeting. Null if speaker information is not available

    - **`transcription`** (string (uri) | null) **Required**
      Signed URL to download the processed transcription file. Valid for 4 hours. Null if transcription is not available or has been deleted

    - **`transcription_ids`** (string[] | null) **Required**
      Array of transcription job IDs from the transcription provider. Null if transcription was not enabled or if IDs are not available

    - **`transcription_provider`** (string | null) **Required**
      The transcription provider used (e.g., 'gladia', 'assemblyai'). Null if transcription was not enabled or if provider information is not available

    - **`video`** (string (uri) | null) **Required**
      Signed URL to download the video recording. Valid for 4 hours. Null if video recording is not available or has been deleted


- **`event`** (string) **Required**
  The webhook event type

- **`extra`** (object | null) **Required**
  Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking


## Example

```json
{
  "data": {
    "audio": null,
    "bot_id": "examplebot_id",
    "data_deleted": true,
    "diarization": null,
    "duration_seconds": null,
    "event_id": null,
    "exited_at": null,
    "joined_at": null,
    "participants": [],
    "raw_transcription": null,
    "sent_at": "examplesent_at",
    "speakers": [],
    "transcription": null,
    "transcription_ids": [],
    "transcription_provider": null,
    "video": null
  },
  "event": "exampleevent",
  "extra": null
}
```


---

## Bot Failed

Bot Failed payload structure

### Source: ./content/docs/api-v2/reference/webhooks/botwebhookfailed.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |
| `extra` | object | null | Yes | Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`bot_id`** (string (uuid)) **Required**
      The UUID of the bot that failed

    - **`error_code`** (string) **Required**
      Machine-readable error code for programmatic handling. Common codes include 'MEETING_NOT_FOUND', 'MEETING_ENDED', 'BOT_CRASHED', etc.

    - **`error_message`** (string) **Required**
      Human-readable error message describing why the bot failed

    - **`event_id`** (string (uuid) | null) **Required**
      The UUID of the calendar event associated with this bot. Null for non-calendar bots

    - **`sent_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when this webhook was sent


- **`event`** (string) **Required**
  The webhook event type

- **`extra`** (object | null) **Required**
  Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking


## Example

```json
{
  "data": {
    "bot_id": "examplebot_id",
    "error_code": "exampleerror_code",
    "error_message": "exampleerror_message",
    "event_id": null,
    "sent_at": "examplesent_at"
  },
  "event": "exampleevent",
  "extra": null
}
```


---

## Bot Status Change

Bot Status Change payload structure

### Source: ./content/docs/api-v2/reference/webhooks/botwebhookstatuschange.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |
| `extra` | object | null | Yes | Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`bot_id`** (string (uuid)) **Required**
      The UUID of the bot that changed status

    - **`event_id`** (string (uuid) | null) **Required**
      The UUID of the calendar event associated with this bot. Null for non-calendar bots

    - **`status`** (object) **Required**
      Status information with code, timestamp, and optional status-specific fields


- **`event`** (string) **Required**
  The webhook event type

- **`extra`** (object | null) **Required**
  Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking


## Example

```json
{
  "data": {
    "bot_id": "examplebot_id",
    "event_id": null,
    "status": {
      "code": "examplecode",
      "created_at": "examplecreated_at",
      "error_message": "exampleerror_message",
      "start_time": 0
    }
  },
  "event": "exampleevent",
  "extra": null
}
```


---

## Calendar Connection Created

Calendar Connection Created payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookconnectioncreated.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`account_email`** (string) **Required**
      The email address associated with the calendar account

    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the newly created calendar connection

    - **`calendar_platform`** ("google" | "microsoft") **Required**
      The calendar platform. Either 'google' for Google Calendar or 'microsoft' for Microsoft Outlook/365

    - **`created_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when the calendar connection was created

    - **`status`** ("active" | "error" | "revoked" | "permission_denied") **Required**
      The current status of the calendar connection. Possible values: 'active' (connection is working), 'error' (connection has errors), 'revoked' (OAuth access was revoked), 'permission_denied' (insufficient permissions)


- **`event`** (string) **Required**
  The webhook event type


## Example

```json
{
  "data": {
    "account_email": "exampleaccount_email",
    "calendar_id": "examplecalendar_id",
    "calendar_platform": "examplecalendar_platform",
    "created_at": "examplecreated_at",
    "status": "examplestatus"
  },
  "event": "exampleevent"
}
```


---

## Calendar Connection Deleted

Calendar Connection Deleted payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookconnectiondeleted.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the deleted calendar connection

    - **`calendar_platform`** ("google" | "microsoft") **Required**
      The calendar platform. Either 'google' for Google Calendar or 'microsoft' for Microsoft Outlook/365

    - **`deleted_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when the calendar connection was deleted


- **`event`** (string) **Required**
  The webhook event type


## Example

```json
{
  "data": {
    "calendar_id": "examplecalendar_id",
    "calendar_platform": "examplecalendar_platform",
    "deleted_at": "exampledeleted_at"
  },
  "event": "exampleevent"
}
```


---

## Calendar Connection Updated

Calendar Connection Updated payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookconnectionupdated.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`account_email`** (string) **Required**
      The email address associated with the calendar account

    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the updated calendar connection

    - **`calendar_platform`** ("google" | "microsoft") **Required**
      The calendar platform. Either 'google' for Google Calendar or 'microsoft' for Microsoft Outlook/365

    - **`created_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when the calendar connection was originally created

    - **`status`** ("active" | "error" | "revoked" | "permission_denied") **Required**
      The current status of the calendar connection after the update. Possible values: 'active' (connection is working), 'error' (connection has errors), 'revoked' (OAuth access was revoked), 'permission_denied' (insufficient permissions)

    - **`updated_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when the calendar connection was updated


- **`event`** (string) **Required**
  The webhook event type


## Example

```json
{
  "data": {
    "account_email": "exampleaccount_email",
    "calendar_id": "examplecalendar_id",
    "calendar_platform": "examplecalendar_platform",
    "created_at": "examplecreated_at",
    "status": "examplestatus",
    "updated_at": "exampleupdated_at"
  },
  "event": "exampleevent"
}
```


---

## Calendar Event Cancelled

Calendar Event Cancelled payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookeventcancelled.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the calendar connection where the event was cancelled

    - **`cancelled_instances`** (object[]) **Required**
      Array of event instances that were cancelled. For one-off events, this contains a single instance. For recurring events, this contains all instances that were cancelled

    - **`event_type`** ("one_off" | "recurring") **Required**
      The type of event. 'one_off' for single events, 'recurring' for events that are part of a recurring series

    - **`series_id`** (string (uuid) | null) **Required**
      The UUID of the event series. Null only in rare cases where the series relationship could not be established


- **`event`** (string) **Required**
  The webhook event type


## Example

```json
{
  "data": {
    "calendar_id": "examplecalendar_id",
    "cancelled_instances": [],
    "event_type": "exampleevent_type",
    "series_id": null
  },
  "event": "exampleevent"
}
```


---

## Calendar Event Created

Calendar Event Created payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookeventcreated.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the calendar connection where the event was created

    - **`event_type`** ("one_off" | "recurring") **Required**
      The type of event. 'one_off' for single events, 'recurring' for events that are part of a recurring series

    - **`instances`** (object[]) **Required**
      Array of event instances that were created. For one-off events, this contains a single instance. For recurring events, this contains all instances that were created

    - **`series_bot_scheduled`** (boolean) **Required**
      Whether a bot has been scheduled for all occurrences of this series. True if a calendar bot schedule exists for the entire series

    - **`series_id`** (string (uuid) | null) **Required**
      The UUID of the event series. Null only in rare cases where the series relationship could not be established


- **`event`** (string) **Required**
  The webhook event type


## Example

```json
{
  "data": {
    "calendar_id": "examplecalendar_id",
    "event_type": "exampleevent_type",
    "instances": [],
    "series_bot_scheduled": true,
    "series_id": null
  },
  "event": "exampleevent"
}
```


---

## Calendar Events Synced

Calendar Events Synced payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookeventssynced.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the calendar connection that was synced

    - **`events`** (object[]) **Required**
      Array of event series that were synced. Each series contains its event instances


- **`event`** (string) **Required**
  The webhook event type


## Example

```json
{
  "data": {
    "calendar_id": "examplecalendar_id",
    "events": []
  },
  "event": "exampleevent"
}
```


---

## Calendar Event Updated

Calendar Event Updated payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookeventupdated.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`affected_instances`** (object[]) **Required**
      Array of event instances that were affected by the update. This includes the instance that was directly updated and any related instances

    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the calendar connection where the event was updated

    - **`event_type`** ("one_off" | "recurring") **Required**
      The type of event. 'one_off' for single events, 'recurring' for events that are part of a recurring series

    - **`is_exception`** (boolean) **Required**
      Whether the updated instance is an exception to a recurring series. True if this instance has been modified differently from the recurring pattern

    - **`series_bot_scheduled`** (boolean) **Required**
      Whether a bot has been scheduled for all occurrences of this series. True if a calendar bot schedule exists for the entire series

    - **`series_id`** (string (uuid) | null) **Required**
      The UUID of the event series. Null only in rare cases where the series relationship could not be established


- **`event`** (string) **Required**
  The webhook event type


## Example

```json
{
  "data": {
    "affected_instances": [],
    "calendar_id": "examplecalendar_id",
    "event_type": "exampleevent_type",
    "is_exception": true,
    "series_bot_scheduled": true,
    "series_id": null
  },
  "event": "exampleevent"
}
```


---

## Completed

Completed payload structure

### Source: ./content/docs/api-v2/reference/webhooks/callbackcompleted.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |
| `extra` | object | null | Yes | Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`audio`** (string (uri) | null) **Required**
      Signed URL to download the audio recording. Valid for 4 hours. Null if audio recording is not available or has been deleted

    - **`bot_id`** (string (uuid)) **Required**
      The UUID of the bot that completed

    - **`data_deleted`** (boolean) **Required**
      Whether the bot's data (artifacts, recordings) has been deleted. True if data has been permanently removed

    - **`diarization`** (string (uri) | null) **Required**
      Signed URL to download the speaker diarization data. Valid for 4 hours. Null if diarization is not available or has been deleted

    - **`duration_seconds`** (integer | null) **Required**

    - **`event_id`** (string (uuid) | null) **Required**
      The UUID of the calendar event associated with this bot. Null for non-calendar bots

    - **`exited_at`** (string (date-time) | null) **Required**
      ISO 8601 timestamp when the bot exited the meeting. Null if exit time is not available

    - **`joined_at`** (string (date-time) | null) **Required**
      ISO 8601 timestamp when the bot joined the meeting. Null if join time is not available

    - **`participants`** (string[] | null) **Required**
      List of participant names or identifiers who joined the meeting. Null if participant information is not available

    - **`raw_transcription`** (string (uri) | null) **Required**
      Signed URL to download the raw transcription file. Valid for 4 hours. Null if raw transcription is not available or has been deleted

    - **`sent_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when this webhook was sent

    - **`speakers`** (string[] | null) **Required**
      List of speaker names or identifiers detected in the meeting. Null if speaker information is not available

    - **`transcription`** (string (uri) | null) **Required**
      Signed URL to download the processed transcription file. Valid for 4 hours. Null if transcription is not available or has been deleted

    - **`transcription_ids`** (string[] | null) **Required**
      Array of transcription job IDs from the transcription provider. Null if transcription was not enabled or if IDs are not available

    - **`transcription_provider`** (string | null) **Required**
      The transcription provider used (e.g., 'gladia', 'assemblyai'). Null if transcription was not enabled or if provider information is not available

    - **`video`** (string (uri) | null) **Required**
      Signed URL to download the video recording. Valid for 4 hours. Null if video recording is not available or has been deleted


- **`event`** (string) **Required**
  The webhook event type

- **`extra`** (object | null) **Required**
  Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking


## Example

```json
{
  "data": {
    "audio": null,
    "bot_id": "examplebot_id",
    "data_deleted": true,
    "diarization": null,
    "duration_seconds": null,
    "event_id": null,
    "exited_at": null,
    "joined_at": null,
    "participants": [],
    "raw_transcription": null,
    "sent_at": "examplesent_at",
    "speakers": [],
    "transcription": null,
    "transcription_ids": [],
    "transcription_provider": null,
    "video": null
  },
  "event": "exampleevent",
  "extra": null
}
```


---

## Failed

Failed payload structure

### Source: ./content/docs/api-v2/reference/webhooks/callbackfailed.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | object | Yes |  |
| `event` | string | Yes | The webhook event type |
| `extra` | object | null | Yes | Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking |

## Field Details

- **`data`** (object) **Required**

  Properties:
    - **`bot_id`** (string (uuid)) **Required**
      The UUID of the bot that failed

    - **`error_code`** (string) **Required**
      Machine-readable error code for programmatic handling. Common codes include 'MEETING_NOT_FOUND', 'MEETING_ENDED', 'BOT_CRASHED', etc.

    - **`error_message`** (string) **Required**
      Human-readable error message describing why the bot failed

    - **`event_id`** (string (uuid) | null) **Required**
      The UUID of the calendar event associated with this bot. Null for non-calendar bots

    - **`sent_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when this webhook was sent


- **`event`** (string) **Required**
  The webhook event type

- **`extra`** (object | null) **Required**
  Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking


## Example

```json
{
  "data": {
    "bot_id": "examplebot_id",
    "error_code": "exampleerror_code",
    "error_message": "exampleerror_message",
    "event_id": null,
    "sent_at": "examplesent_at"
  },
  "event": "exampleevent",
  "extra": null
}
```


---

## Webhook & Callback Payloads

Reference documentation for all webhook and callback payload structures

### Source: ./content/docs/api-v2/reference/webhooks/index.mdx


This section contains reference documentation for all webhook and callback payload structures sent by Meeting BaaS v2.

## Bot Webhooks

- [Bot Webhook Completed](./botwebhookcompleted)
- [Bot Webhook Failed](./botwebhookfailed)
- [Bot Webhook Status Change](./botwebhookstatuschange)

## Calendar Webhooks

- [Calendar Webhook Connection Created](./calendarwebhookconnectioncreated)
- [Calendar Webhook Connection Deleted](./calendarwebhookconnectiondeleted)
- [Calendar Webhook Connection Updated](./calendarwebhookconnectionupdated)
- [Calendar Webhook Event Cancelled](./calendarwebhookeventcancelled)
- [Calendar Webhook Event Created](./calendarwebhookeventcreated)
- [Calendar Webhook Event Updated](./calendarwebhookeventupdated)
- [Calendar Webhook Events Synced](./calendarwebhookeventssynced)

## Callbacks

- [Callback Completed](./callbackcompleted)
- [Callback Failed](./callbackfailed)


---

## Transcription

Complete guide to transcription features, custom parameters, and BYOK

### Source: ./content/docs/api-v2/transcription.mdx


# Transcription Guide

Meeting BaaS v2 provides powerful transcription capabilities with support for custom parameters, multiple providers, and Bring Your Own Key (BYOK) options.

## Overview

Transcription in v2 offers:

- **Multiple Providers**: Currently supports Gladia, with Assembly AI and Deepgram coming soon
- **BYOK Support**: Use your own transcription provider API keys to save on token costs
- **Custom Parameters**: Configure LLM summaries, translation, language detection, and more
- **Raw & Processed Output**: Access both raw provider responses and standardized transcriptions
- **Transcription IDs**: Track transcription jobs for BYOK users

## Enabling Transcription

To enable transcription for a bot, include `transcription_config` in your bot creation request:

```json
{
  "meeting_url": "https://meet.google.com/...",
  "bot_name": "AI Notetaker",
  "transcription_enabled": true,
  "transcription_config": {
    "provider": "gladia",
    "api_key": null,
    "custom_params": null
  }
}
```

### Basic Configuration

**Required Fields:**
- `transcription_enabled`: Set to `true` to enable transcription
- `transcription_config.provider`: Currently `"gladia"` (default). Assembly AI and Deepgram support coming soon.

**Optional Fields:**
- `transcription_config.api_key`: Your transcription provider API key (for BYOK - see below)
- `transcription_config.custom_params`: Custom parameters for advanced features (see below)

## Transcription Providers

### Current Provider

**Gladia** (Default)
- High-accuracy transcription
- Speaker diarization
- Multi-language support
- Advanced features (summarization, translation, etc.)

### Coming Soon

- **Assembly AI**: Additional transcription provider option
- **Deepgram**: Additional transcription provider option

Provider selection will be available via the `provider` field in `transcription_config`.

## Bring Your Own Key (BYOK)

Using your own transcription provider API key can significantly reduce token costs. When you provide your own key:

- **Token Savings**: Transcription tokens are reduced from 0.25 tokens/hour to 0.05 tokens/hour
- **Provider Billing**: You're billed directly by the transcription provider
- **Full Control**: Manage your own provider account and usage

### Requirements

BYOK transcription is available on **Pro plans and above**. Pay-as-you-go plans use the platform's transcription keys.

### Setting Up BYOK

1. **Get Your API Key**: Obtain an API key from your transcription provider (e.g., Gladia)
2. **Include in Request**: Add the API key to `transcription_config.api_key`:

```json
{
  "transcription_enabled": true,
  "transcription_config": {
    "provider": "gladia",
    "api_key": "your-gladia-api-key-here",
    "custom_params": null
  }
}
```

3. **Track Jobs**: Use `transcription_ids` in bot details and webhooks to track your provider jobs

### BYOK Token Consumption

When using BYOK:
- **Recording tokens**: 1 token/hour (unchanged)
- **BYOK Transcription tokens**: 0.05 tokens/hour (vs 0.25 tokens/hour with platform key)
- **Total**: ~1.05 tokens/hour (vs ~1.25 tokens/hour)

## Custom Parameters

v2 supports advanced transcription features through custom parameters. These are provider-specific options that enhance transcription capabilities.

For complete documentation on all available custom parameters, see the [Gladia API Reference](https://docs.gladia.io/api-reference/v2/pre-recorded/init).

### Available Custom Parameters

#### Summarization

Generate AI-powered meeting summaries:

```json
{
  "transcription_config": {
    "provider": "gladia",
    "custom_params": {
      "summarization": true,
      "summarization_config": {
        "type": "general"  // or "bullet_points", "concise"
      }
    }
  }
}
```

**Summary Types:**
- `general`: General meeting summary
- `bullet_points`: Bullet-point format
- `concise`: Concise summary

#### Translation

Translate transcriptions to multiple languages:

```json
{
  "transcription_config": {
    "provider": "gladia",
    "custom_params": {
      "translation": true,
      "translation_config": {
        "target_languages": ["es", "fr", "de"],
        "model": "enhanced",  // or "base"
        "match_original_utterances": true,
        "lipsync": true,
        "context_adaptation": true
      }
    }
  }
}
```

**Translation Options:**
- `target_languages`: Array of ISO 639-1 language codes (e.g., `["es", "fr"]`)
- `model`: `"base"` (default) or `"enhanced"` for better quality
- `match_original_utterances`: Match translated utterances to original timing
- `lipsync`: Enable lip-sync for video
- `context_adaptation`: Adapt translation to context

#### Language Detection

Force specific languages or enable automatic detection:

```json
{
  "transcription_config": {
    "provider": "gladia",
    "custom_params": {
      "language_config": {
        "languages": ["en", "es"],  // Force specific languages
        "detect_language": true  // Enable automatic detection
      }
    }
  }
}
```

#### Subtitles

Generate subtitles in multiple formats:

```json
{
  "transcription_config": {
    "provider": "gladia",
    "custom_params": {
      "subtitles": true,
      "subtitles_config": {
        "formats": ["srt", "vtt"],
        "minimum_duration": 0.5,
        "maximum_duration": 5,
        "maximum_characters_per_row": 42,
        "maximum_rows_per_caption": 2,
        "style": "default"  // or "compliance"
      }
    }
  }
}
```

#### Custom Vocabulary

Improve accuracy for domain-specific terms:

```json
{
  "transcription_config": {
    "provider": "gladia",
    "custom_params": {
      "custom_vocabulary": [
        "MeetingBaaS",
        "API",
        "webhook"
      ],
      "custom_vocabulary_config": {
        "vocabulary": [
          {
            "value": "MeetingBaaS",
            "intensity": 0.8,
            "pronunciations": ["meeting-baas", "meeting-bass"]
          }
        ],
        "default_intensity": 0.7
      }
    }
  }
}
```

#### Additional Features

Other available custom parameters:

- **Moderation**: Content moderation and filtering
- **Named Entity Recognition**: Extract names, organizations, locations
- **Sentiment Analysis**: Analyze sentiment of utterances
- **Chapterization**: Automatically create meeting chapters
- **Name Consistency**: Maintain consistent speaker names
- **Custom Spelling**: Custom spelling dictionary
- **Structured Data Extraction**: Extract structured data using class definitions
- **Audio to LLM**: Apply LLM prompts to transcription output
- **Punctuation Enhanced**: Enhanced punctuation accuracy

For complete documentation on all custom parameters and their configuration options, see the [Gladia API Reference](https://docs.gladia.io/api-reference/v2/pre-recorded/init). You can also check the [Meeting BaaS API Reference](/docs/api-v2/reference) for our API schema.

## Transcription Output

v2 provides two types of transcription files:

### Raw Transcription (`raw_transcription.json`)

Contains the complete, unmodified response from the transcription provider:

- **Includes**: All custom parameters (LLM summaries, translations, metadata)
- **Format**: Provider-specific structure
- **Use Case**: Access advanced features like summaries, translations, custom metadata
- **Note**: Presented as an array without time duration offsets or speaker diarization. Best used alongside `output_transcription.json`.

**Example Structure:**
```json
{
  "bot_id": "uuid",
  "transcriptions": [
    {
      "transcription": {
        "utterances": [...],
        "summary": "Meeting discussed Q4 goals...",
        "languages": ["en", "es"],
        "metadata": {...}
      }
    }
  ]
}
```

### Output Transcription (`output_transcription.json`)

Standardized format across all providers:

- **Format**: Consistent structure regardless of provider
- **Features**: 
  - Speaker diarization with participant names
  - Timestamps adjusted for multi-chunk recordings
  - Standardized utterance format
- **Use Case**: General transcription processing and display

**Example Structure:**
```json
{
  "result": {
    "utterances": [
      {
        "start": 0.5,
        "end": 2.1,
        "text": "Hello everyone",
        "speaker": "John Doe",
        "language": "en"
      }
    ]
  }
}
```

## Accessing Transcriptions

Transcriptions are available via presigned S3 URLs in:

1. **Bot Details** (`GET /v2/bots/:bot_id`): Artifacts array includes transcription URLs
2. **Webhooks** (`bot.completed`): Transcription URLs in webhook payload
3. **Callbacks**: Same URLs as webhooks

### Presigned URLs

- **Validity**: 4 hours from generation
- **Security**: Time-limited access to transcription files
- **Download**: Fetch and store transcriptions promptly

**Example Webhook Payload:**
```json
{
  "event": "bot.completed",
  "data": {
    "bot_id": "uuid",
    "raw_transcription": "https://s3.amazonaws.com/.../raw_transcription.json",
    "transcription": "https://s3.amazonaws.com/.../output_transcription.json",
    "transcription_ids": ["gladia-job-12345"],
    "transcription_provider": "gladia"
  }
}
```

## Transcription IDs

For BYOK users, `transcription_ids` provides an array of provider job IDs:

- **Purpose**: Track your own transcription jobs with the provider
- **Error Correlation**: Match transcription errors to specific provider job IDs
- **Multi-Chunk Support**: Each audio chunk gets its own provider ID
- **Available In**: Bot details and webhook payloads

**Example:**
```json
{
  "transcription_ids": ["gladia-job-12345", "gladia-job-12346"],
  "transcription_provider": "gladia"
}
```

## Token Consumption

Transcription token consumption depends on whether you use BYOK:

### With Platform Key (Default)
- **Recording**: 1 token/hour
- **Transcription**: 0.25 tokens/hour
- **Total**: ~1.25 tokens/hour

### With BYOK
- **Recording**: 1 token/hour
- **BYOK Transcription**: 0.05 tokens/hour
- **Total**: ~1.05 tokens/hour

**Note**: Custom parameters (summarization, translation, etc.) may incur additional costs from the transcription provider when using BYOK. Check your provider's pricing.

## Error Handling

If transcription fails:

- **Error Code**: `TRANSCRIPTION_FAILED` in bot status
- **Token Charging**: Recording and streaming tokens are charged, but transcription tokens are not
- **Retry**: Use the re-transcribe endpoint to retry transcription
- **Webhook**: `bot.failed` webhook includes error details

See [Error Codes](/docs/api-v2/error-codes) for complete error information.

## Best Practices

1. **Use BYOK for Cost Savings**: If you have high transcription volume, BYOK can significantly reduce costs
2. **Download Promptly**: Presigned URLs expire after 4 hours - download transcriptions quickly
3. **Store Long-Term**: If you need transcriptions long-term, download and store them in your own storage
4. **Use Raw Transcription**: Access LLM summaries, translations, and custom features from raw transcription
5. **Track Transcription IDs**: For BYOK users, use `transcription_ids` to correlate with provider jobs
6. **Handle Errors**: Implement retry logic for transcription failures

## Examples

### Basic Transcription

```bash
curl -X POST "https://api.meetingbaas.com/v2/bots" \
  -H "x-meeting-baas-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Notetaker",
    "transcription_enabled": true,
    "transcription_config": {
      "provider": "gladia"
    }
  }'
```

### BYOK with Summarization

```bash
curl -X POST "https://api.meetingbaas.com/v2/bots" \
  -H "x-meeting-baas-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "AI Notetaker",
    "transcription_enabled": true,
    "transcription_config": {
      "provider": "gladia",
      "api_key": "your-gladia-api-key",
      "custom_params": {
        "summarization": true,
        "summarization_config": {
          "type": "bullet_points"
        }
      }
    }
  }'
```

### Multi-Language Translation

```bash
curl -X POST "https://api.meetingbaas.com/v2/bots" \
  -H "x-meeting-baas-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Multilingual Notetaker",
    "transcription_enabled": true,
    "transcription_config": {
      "provider": "gladia",
      "custom_params": {
        "translation": true,
        "translation_config": {
          "target_languages": ["es", "fr", "de"],
          "model": "enhanced"
        },
        "language_config": {
          "detect_language": true
        }
      }
    }
  }'
```

## Next Steps

- Learn about [Getting the Data](/docs/api-v2/getting-started/getting-the-data) to access transcriptions
- Set up [Webhooks](/docs/api-v2/webhooks) to receive transcription URLs automatically
- Check the [API Reference](/docs/api-v2/reference) for complete parameter documentation



---

## Webhooks

Complete guide to webhooks in Meeting BaaS v2

### Source: ./content/docs/api-v2/webhooks.mdx


Webhooks allow you to receive real-time notifications about bot and calendar events. Instead of polling the API, you can configure webhook endpoints that will receive HTTP POST requests when events occur.

## Overview

Meeting BaaS v2 uses [SVIX](https://www.svix.com/) for webhook delivery, ensuring reliable delivery with retries and delivery status tracking.

## Webhook Configuration

Webhooks are configured at the account level. You can set up webhook endpoints in your account settings to receive notifications for all bot and calendar events.

## Callbacks vs Webhooks

Meeting BaaS v2 supports two notification mechanisms:

1. **Webhooks** (Account-level): Configured in your account settings, sent via SVIX. All events for all bots are sent to your configured webhook endpoints.

2. **Callbacks** (Bot-specific): Configured per-bot when creating a bot using the `callback_config` parameter. Callbacks are direct HTTP requests (POST or PUT) sent to your specified URL when that specific bot completes or fails.

**Key Differences:**
- **Webhooks**: Account-level, sent via SVIX with signature verification, all events
- **Callbacks**: Bot-specific, direct HTTP requests, only for bot completion/failure events

You can use both webhooks and callbacks together - they serve different purposes and complement each other.

## Webhook Security

All webhooks are signed using SVIX's signature verification. The signature is included in the `svix-id`, `svix-timestamp`, and `svix-signature` headers.

To verify webhooks, use SVIX's verification libraries or verify the signature manually using your webhook signing secret.

## Bot Webhooks

### `bot.status_change`

Triggered whenever a bot's status changes (e.g., from `queued` to `joining`, from `joining` to `in_call_recording`, etc.).

**Use Cases:**
- Track bot progress in real-time
- Update UI to show current bot state
- Trigger actions based on status changes
- Monitor bot lifecycle

**Payload:**
```json
{
  "event": "bot.status_change",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "event_id": "789e0123-e45b-67c8-d901-234567890abc",
    "status": {
      "code": "in_call_recording",
      "created_at": "2025-01-15T10:30:00Z",
      "start_time": 1736941800
    },
    "extra": {
      "customer_id": "12345"
    }
  }
}
```

**Status Codes:**
- `queued`: Bot is queued and waiting to join
- `joining`: Bot is attempting to join the meeting
- `in_call_recording`: Bot is in the meeting and recording
- `transcribing`: Bot has exited and transcription is in progress
- `completed`: Bot has completed successfully
- `failed`: Bot has failed

### `bot.completed`

Triggered when a bot successfully completes recording and processing.

**Use Cases:**
- Download meeting recordings automatically
- Process transcriptions
- Trigger post-meeting workflows
- Update meeting records in your system

**Payload:**
```json
{
  "event": "bot.completed",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "event_id": "789e0123-e45b-67c8-d901-234567890abc",
    "transcription": "https://s3.amazonaws.com/.../transcription.json",
    "mp4": "https://s3.amazonaws.com/.../video.mp4",
    "audio": "https://s3.amazonaws.com/.../audio.mp3",
    "diarization": "https://s3.amazonaws.com/.../diarization.json",
    "duration_seconds": 3600,
    "participants": [...],
    "speakers": [...],
    "extra": {
      "customer_id": "12345"
    }
  }
}
```

**Note:** All artifact URLs (transcription, mp4, audio, diarization) are presigned S3 URLs valid for 4 hours.

### `bot.failed`

Triggered when a bot fails to complete successfully.

**Use Cases:**
- Handle errors gracefully
- Retry bot creation if appropriate
- Log failures for analysis
- Notify users of failures

**Payload:**
```json
{
  "event": "bot.failed",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "event_id": "789e0123-e45b-67c8-d901-234567890abc",
    "error_code": "BOT_NOT_ACCEPTED",
    "error_message": "Bot was not accepted into the meeting",
    "extra": {
      "customer_id": "12345"
    }
  }
}
```

**Common Error Codes:**
- `BOT_NOT_ACCEPTED`: Bot was not accepted into the meeting
- `TIMEOUT_WAITING_TO_START`: Meeting didn't start within the timeout period
- `INSUFFICIENT_TOKENS`: Not enough tokens to create the bot
- `DAILY_BOT_CAP_REACHED`: Daily bot creation limit reached
- `INVALID_MEETING_PLATFORM`: Could not determine meeting platform from URL
- `TRANSCRIPTION_ERROR`: Error occurred during transcription

## Calendar Webhooks

### `calendar.connection_created`

Triggered when a new calendar connection is created.

**Use Cases:**
- Confirm calendar integration success
- Initialize calendar-specific workflows
- Track calendar connections

**Payload:**
```json
{
  "event": "calendar.connection_created",
  "data": {
    "calendar_id": "123e4567-e89b-12d3-a456-426614174000",
    "platform": "google",
    "account_email": "user@example.com",
    "calendar_name": "Primary"
  }
}
```

### `calendar.connection_updated`

Triggered when a calendar connection is updated (e.g., OAuth credentials refreshed).

**Use Cases:**
- Track credential updates
- Monitor connection health
- Update connection status in your system

**Payload:**
```json
{
  "event": "calendar.connection_updated",
  "data": {
    "calendar_id": "123e4567-e89b-12d3-a456-426614174000",
    "platform": "google",
    "status": "active"
  }
}
```

### `calendar.connection_deleted`

Triggered when a calendar connection is deleted.

**Use Cases:**
- Clean up calendar-related data
- Notify users of disconnection
- Update UI to reflect removal

**Payload:**
```json
{
  "event": "calendar.connection_deleted",
  "data": {
    "calendar_id": "123e4567-e89b-12d3-a456-426614174000",
    "platform": "google"
  }
}
```

### `calendar.connection_error`

Triggered when a calendar connection encounters an error (e.g., OAuth token refresh failed).

**Use Cases:**
- Alert users to connection issues
- Trigger automatic reconnection attempts
- Log errors for troubleshooting

**Payload:**
```json
{
  "event": "calendar.connection_error",
  "data": {
    "calendar_id": "123e4567-e89b-12d3-a456-426614174000",
    "platform": "google",
    "error": "OAuth token refresh failed",
    "status": "error"
  }
}
```

### `calendar.events_synced`

Triggered after a calendar sync operation completes (initial sync or manual sync).

**Use Cases:**
- Confirm sync completion
- Process newly synced events
- Update event cache

**Payload:**
```json
{
  "event": "calendar.events_synced",
  "data": {
    "calendar_id": "123e4567-e89b-12d3-a456-426614174000",
    "events_synced": 42,
    "sync_type": "full"
  }
}
```

### `calendar.event_created`

Triggered when a new event is created in a connected calendar.

**Use Cases:**
- Automatically schedule bots for new events
- Update event calendars
- Trigger event-specific workflows

**Payload:**
```json
{
  "event": "calendar.event_created",
  "data": {
    "calendar_id": "123e4567-e89b-12d3-a456-426614174000",
    "event_type": "one_off",
    "series_id": "789e0123-e45b-67c8-d901-234567890abc",
    "series_bot_scheduled": false,
    "instances": [
      {
        "event_id": "abc123...",
        "title": "Team Meeting",
        "start_time": "2025-01-20T10:00:00Z",
        "end_time": "2025-01-20T11:00:00Z",
        "meeting_url": "https://meet.google.com/...",
        "bot_scheduled": false
      }
    ]
  }
}
```

### `calendar.event_updated`

Triggered when an existing event is updated in a connected calendar.

**Use Cases:**
- Update bot schedules if meeting time changes
- Sync event changes to your system
- Handle event modifications

**Payload:**
```json
{
  "event": "calendar.event_updated",
  "data": {
    "calendar_id": "123e4567-e89b-12d3-a456-426614174000",
    "event_type": "recurring",
    "series_id": "789e0123-e45b-67c8-d901-234567890abc",
    "series_bot_scheduled": true,
    "affected_instances": [
      {
        "event_id": "abc123...",
        "title": "Team Meeting",
        "start_time": "2025-01-20T10:00:00Z",
        "end_time": "2025-01-20T11:00:00Z",
        "meeting_url": "https://meet.google.com/...",
        "bot_scheduled": true
      }
    ]
  }
}
```

### `calendar.event_cancelled`

Triggered when an event is cancelled in a connected calendar.

**Use Cases:**
- Cancel scheduled bots for cancelled events
- Update event status
- Clean up event-related data

**Payload:**
```json
{
  "event": "calendar.event_cancelled",
  "data": {
    "calendar_id": "123e4567-e89b-12d3-a456-426614174000",
    "event_type": "one_off",
    "series_id": "789e0123-e45b-67c8-d901-234567890abc",
    "series_bot_scheduled": false,
    "cancelled_instances": [
      {
        "event_id": "abc123...",
        "title": "Team Meeting",
        "start_time": "2025-01-20T10:00:00Z"
      }
    ]
  }
}
```

## Webhook Delivery

- **Retries**: SVIX automatically retries failed webhook deliveries
- **Timeout**: Webhook endpoints should respond within 30 seconds
- **Idempotency**: Webhooks may be delivered multiple times - ensure your handler is idempotent
- **Ordering**: Webhooks are delivered in order, but network issues may cause out-of-order delivery

## Testing Webhooks

You can test your webhook endpoint using tools like:
- [ngrok](https://ngrok.com/) for local development
- [webhook.site](https://webhook.site/) or [webhook.cool](https://webhook.cool) for testing
- [SVIX CLI](https://www.svix.com/docs/cli/) for local testing

## Callbacks

Callbacks are bot-specific HTTP requests sent directly to a URL you provide when creating a bot. Unlike webhooks (which are account-level and sent via SVIX), callbacks are:

- **Bot-specific**: Configured per-bot using `callback_config` when creating a bot
- **Direct HTTP**: Sent directly to your URL (not via SVIX)
- **Limited events**: Only sent for `bot.completed` and `bot.failed` events
- **Same payload**: Uses the same payload structure as webhooks

### Configuring Callbacks

When creating a bot, include the `callback_config` in your request:

```json
{
  "bot_name": "My Bot",
  "meeting_url": "https://meet.google.com/...",
  "callback_enabled": true,
  "callback_config": {
    "url": "https://your-server.com/webhook",
    "method": "POST",
    "secret": "your-secret-key"
  }
}
```

### Callback Security

If you provide a `secret` in `callback_config`, it will be included in the `x-mb-secret` header of all callback requests. Use this to verify that callbacks are coming from Meeting BaaS.

### Retrying Callbacks

If a callback delivery fails, you can retry it using the `POST /v2/bots/:bot_id/retry-callback` endpoint.

## Resending Webhooks

If a webhook delivery fails, you can resend it using the `POST /v2/bots/:bot_id/resend-webhook` endpoint.



---

