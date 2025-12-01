# webhooks api-v2 Reference

Reference documentation for webhooks in api-v2.

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

