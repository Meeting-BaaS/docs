# webhooks api-v2 Reference

Reference documentation for webhooks in api-v2.

## Bot Completed

Bot Completed payload structure

### Source: ./content/docs/api-v2/reference/webhooks/botwebhookcompleted.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |
| `extra` | object | null | Yes | Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`bot_id`** (string (uuid)) **Required**
      The UUID of the bot that completed

    - **`event_id`** (string (uuid) | null) **Required**
      The UUID of the calendar event associated with this bot. Null for non-calendar bots

    - **`participants`** (string[] | null) **Required**
      List of participant names or identifiers who joined the meeting. Null if participant information is not available

    - **`speakers`** (string[] | null) **Required**
      List of speaker names or identifiers detected in the meeting. Null if speaker information is not available

    - **`duration_seconds`** (integer | null) **Required**

    - **`joined_at`** (string (date-time) | null) **Required**
      ISO 8601 timestamp when the bot joined the meeting. Null if join time is not available

    - **`exited_at`** (string (date-time) | null) **Required**
      ISO 8601 timestamp when the bot exited the meeting. Null if exit time is not available

    - **`data_deleted`** (boolean) **Required**
      Whether the bot's data (artifacts, recordings) has been deleted. True if data has been permanently removed

    - **`video`** (string (uri) | null) **Required**
      Signed URL to download the video recording. Valid for 4 hours. Null if video recording is not available or has been deleted

    - **`audio`** (string (uri) | null) **Required**
      Signed URL to download the audio recording. Valid for 4 hours. Null if audio recording is not available or has been deleted

    - **`diarization`** (string (uri) | null) **Required**
      Signed URL to download the speaker diarization data. Valid for 4 hours. Null if diarization is not available or has been deleted

    - **`raw_transcription`** (string (uri) | null) **Required**
      Signed URL to download the raw transcription file. Valid for 4 hours. Null if raw transcription is not available or has been deleted

    - **`transcription`** (string (uri) | null) **Required**
      Signed URL to download the processed transcription file. Valid for 4 hours. Null if transcription is not available or has been deleted

    - **`transcription_provider`** (string | null) **Required**
      The transcription provider used (e.g., 'gladia'). Null if transcription was not enabled or if provider information is not available

    - **`transcription_ids`** (string[] | null) **Required**
      Array of transcription job IDs from the transcription provider. Null if transcription was not enabled or if IDs are not available

    - **`sent_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when this webhook was sent


- **`extra`** (object | null) **Required**
  Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking


## Example

```json
{
  "event": "exampleevent",
  "data": {
    "bot_id": "examplebot_id",
    "event_id": null,
    "participants": [],
    "speakers": [],
    "duration_seconds": null,
    "joined_at": null,
    "exited_at": null,
    "data_deleted": true,
    "video": null,
    "audio": null,
    "diarization": null,
    "raw_transcription": null,
    "transcription": null,
    "transcription_provider": null,
    "transcription_ids": [],
    "sent_at": "examplesent_at"
  },
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
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |
| `extra` | object | null | Yes | Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`bot_id`** (string (uuid)) **Required**
      The UUID of the bot that failed

    - **`event_id`** (string (uuid) | null) **Required**
      The UUID of the calendar event associated with this bot. Null for non-calendar bots

    - **`error_message`** (string) **Required**
      Human-readable error message describing why the bot failed

    - **`error_code`** (string) **Required**
      Machine-readable error code for programmatic handling. Common codes include 'MEETING_NOT_FOUND', 'MEETING_ENDED', 'BOT_CRASHED', etc.

    - **`sent_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when this webhook was sent


- **`extra`** (object | null) **Required**
  Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking


## Example

```json
{
  "event": "exampleevent",
  "data": {
    "bot_id": "examplebot_id",
    "event_id": null,
    "error_message": "exampleerror_message",
    "error_code": "exampleerror_code",
    "sent_at": "examplesent_at"
  },
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
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |
| `extra` | object | null | Yes | Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`bot_id`** (string (uuid)) **Required**
      The UUID of the bot that changed status

    - **`event_id`** (string (uuid) | null) **Required**
      The UUID of the calendar event associated with this bot. Null for non-calendar bots

    - **`status`** (object) **Required**
      Status information with code, timestamp, and optional status-specific fields


- **`extra`** (object | null) **Required**
  Additional metadata provided when creating the bot. This is user-defined data that can be used for correlation or tracking


## Example

```json
{
  "event": "exampleevent",
  "data": {
    "bot_id": "examplebot_id",
    "event_id": null,
    "status": {
      "code": "examplecode",
      "created_at": "examplecreated_at",
      "start_time": 0,
      "error_message": "exampleerror_message"
    }
  },
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
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the newly created calendar connection

    - **`calendar_platform`** ("google" | "microsoft") **Required**
      The calendar platform. Either 'google' for Google Calendar or 'microsoft' for Microsoft Outlook/365

    - **`account_email`** (string) **Required**
      The email address associated with the calendar account

    - **`status`** ("active" | "error" | "revoked" | "permission_denied") **Required**
      The current status of the calendar connection. Possible values: 'active' (connection is working), 'error' (connection has errors), 'revoked' (OAuth access was revoked), 'permission_denied' (insufficient permissions)

    - **`created_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when the calendar connection was created



## Example

```json
{
  "event": "exampleevent",
  "data": {
    "calendar_id": "examplecalendar_id",
    "calendar_platform": "examplecalendar_platform",
    "account_email": "exampleaccount_email",
    "status": "examplestatus",
    "created_at": "examplecreated_at"
  }
}
```


---

## Calendar Connection Deleted

Calendar Connection Deleted payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookconnectiondeleted.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the deleted calendar connection

    - **`calendar_platform`** ("google" | "microsoft") **Required**
      The calendar platform. Either 'google' for Google Calendar or 'microsoft' for Microsoft Outlook/365

    - **`deleted_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when the calendar connection was deleted



## Example

```json
{
  "event": "exampleevent",
  "data": {
    "calendar_id": "examplecalendar_id",
    "calendar_platform": "examplecalendar_platform",
    "deleted_at": "exampledeleted_at"
  }
}
```


---

## Calendar Connection Updated

Calendar Connection Updated payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookconnectionupdated.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the updated calendar connection

    - **`calendar_platform`** ("google" | "microsoft") **Required**
      The calendar platform. Either 'google' for Google Calendar or 'microsoft' for Microsoft Outlook/365

    - **`account_email`** (string) **Required**
      The email address associated with the calendar account

    - **`status`** ("active" | "error" | "revoked" | "permission_denied") **Required**
      The current status of the calendar connection after the update. Possible values: 'active' (connection is working), 'error' (connection has errors), 'revoked' (OAuth access was revoked), 'permission_denied' (insufficient permissions)

    - **`created_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when the calendar connection was originally created

    - **`updated_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when the calendar connection was updated



## Example

```json
{
  "event": "exampleevent",
  "data": {
    "calendar_id": "examplecalendar_id",
    "calendar_platform": "examplecalendar_platform",
    "account_email": "exampleaccount_email",
    "status": "examplestatus",
    "created_at": "examplecreated_at",
    "updated_at": "exampleupdated_at"
  }
}
```


---

## Calendar Event Cancelled

Calendar Event Cancelled payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookeventcancelled.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the calendar connection where the event was cancelled

    - **`event_type`** ("one_off" | "recurring") **Required**
      The type of event. 'one_off' for single events, 'recurring' for events that are part of a recurring series

    - **`series_id`** (string (uuid) | null) **Required**
      The UUID of the event series. Null only in rare cases where the series relationship could not be established

    - **`cancelled_instances`** (object[]) **Required**
      Array of event instances that were cancelled. For one-off events, this contains a single instance. For recurring events, this contains all instances that were cancelled



## Example

```json
{
  "event": "exampleevent",
  "data": {
    "calendar_id": "examplecalendar_id",
    "event_type": "exampleevent_type",
    "series_id": null,
    "cancelled_instances": []
  }
}
```


---

## Calendar Event Created

Calendar Event Created payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookeventcreated.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the calendar connection where the event was created

    - **`event_type`** ("one_off" | "recurring") **Required**
      The type of event. 'one_off' for single events, 'recurring' for events that are part of a recurring series

    - **`series_id`** (string (uuid) | null) **Required**
      The UUID of the event series. Null only in rare cases where the series relationship could not be established

    - **`series_bot_scheduled`** (boolean) **Required**
      Whether a bot has been scheduled for all occurrences of this series. True if a calendar bot schedule exists for the entire series

    - **`instances`** (object[]) **Required**
      Array of event instances that were created. For one-off events, this contains a single instance. For recurring events, this contains all instances that were created



## Example

```json
{
  "event": "exampleevent",
  "data": {
    "calendar_id": "examplecalendar_id",
    "event_type": "exampleevent_type",
    "series_id": null,
    "series_bot_scheduled": true,
    "instances": []
  }
}
```


---

## Calendar Events Synced

Calendar Events Synced payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookeventssynced.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the calendar connection that was synced

    - **`events`** (object[]) **Required**
      Array of event series that were synced. Each series contains its event instances



## Example

```json
{
  "event": "exampleevent",
  "data": {
    "calendar_id": "examplecalendar_id",
    "events": []
  }
}
```


---

## Calendar Event Updated

Calendar Event Updated payload structure

### Source: ./content/docs/api-v2/reference/webhooks/calendarwebhookeventupdated.mdx




## Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | The webhook event type |
| `data` | object | Yes |  |

## Field Details

- **`event`** (string) **Required**
  The webhook event type

- **`data`** (object) **Required**

  Properties:
    - **`calendar_id`** (string (uuid)) **Required**
      The UUID of the calendar connection where the event was updated

    - **`event_type`** ("one_off" | "recurring") **Required**
      The type of event. 'one_off' for single events, 'recurring' for events that are part of a recurring series

    - **`series_id`** (string (uuid) | null) **Required**
      The UUID of the event series. Null only in rare cases where the series relationship could not be established

    - **`series_bot_scheduled`** (boolean) **Required**
      Whether a bot has been scheduled for all occurrences of this series. True if a calendar bot schedule exists for the entire series

    - **`is_exception`** (boolean) **Required**
      Whether the updated instance is an exception to a recurring series. True if this instance has been modified differently from the recurring pattern

    - **`affected_instances`** (object[]) **Required**
      Array of event instances that were affected by the update. This includes the instance that was directly updated and any related instances



## Example

```json
{
  "event": "exampleevent",
  "data": {
    "calendar_id": "examplecalendar_id",
    "event_type": "exampleevent_type",
    "series_id": null,
    "series_bot_scheduled": true,
    "is_exception": true,
    "affected_instances": []
  }
}
```


---

## Webhook Payloads

Reference documentation for all webhook payload structures

### Source: ./content/docs/api-v2/reference/webhooks/index.mdx


This section contains reference documentation for all webhook payload structures sent by Meeting BaaS v2.

## Bot Webhooks

- [Bot Webhook Status Change](/docs/api-v2/reference/webhooks/botwebhookstatuschange)
- [Bot Webhook Completed](/docs/api-v2/reference/webhooks/botwebhookcompleted)
- [Bot Webhook Failed](/docs/api-v2/reference/webhooks/botwebhookfailed)

## Calendar Webhooks

- [Calendar Webhook Connection Created](/docs/api-v2/reference/webhooks/calendarwebhookconnectioncreated)
- [Calendar Webhook Connection Updated](/docs/api-v2/reference/webhooks/calendarwebhookconnectionupdated)
- [Calendar Webhook Connection Deleted](/docs/api-v2/reference/webhooks/calendarwebhookconnectiondeleted)
- [Calendar Webhook Events Synced](/docs/api-v2/reference/webhooks/calendarwebhookeventssynced)
- [Calendar Webhook Event Created](/docs/api-v2/reference/webhooks/calendarwebhookeventcreated)
- [Calendar Webhook Event Updated](/docs/api-v2/reference/webhooks/calendarwebhookeventupdated)
- [Calendar Webhook Event Cancelled](/docs/api-v2/reference/webhooks/calendarwebhookeventcancelled)


---

