# callbacks api-v2 Reference

Reference documentation for callbacks in api-v2.

## Completed

Completed payload structure

### Source: ./content/docs/api-v2/reference/callbacks/callbackcompleted.mdx




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

    - **`participants`** (object[]) **Required**
      List of participants who joined the meeting with their names and metadata. Empty array if participant information is not available

    - **`speakers`** (object[]) **Required**
      List of speakers detected in the meeting with their names and metadata. Empty array if speaker information is not available

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

## Failed

Failed payload structure

### Source: ./content/docs/api-v2/reference/callbacks/callbackfailed.mdx




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

## Callback Payloads

Reference documentation for all callback payload structures

### Source: ./content/docs/api-v2/reference/callbacks/index.mdx


This section contains reference documentation for all callback payload structures sent by Meeting BaaS v2.

## Callbacks

- [Callback Completed](/docs/api-v2/reference/callbacks/callbackcompleted)
- [Callback Failed](/docs/api-v2/reference/callbacks/callbackfailed)


---

