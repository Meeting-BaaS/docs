# callbacks api-v2 Reference

Reference documentation for callbacks in api-v2.

## Completed

Completed payload structure

### Source: ./content/docs/api-v2/reference/callbacks/callbackcompleted.mdx




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

    - **`participants`** (object[]) **Required**
      List of participants who joined the meeting with their names and metadata. Empty array if participant information is not available

    - **`raw_transcription`** (string (uri) | null) **Required**
      Signed URL to download the raw transcription file. Valid for 4 hours. Null if raw transcription is not available or has been deleted

    - **`sent_at`** (string (date-time)) **Required**
      ISO 8601 timestamp when this webhook was sent

    - **`speakers`** (object[]) **Required**
      List of speakers detected in the meeting with their names and metadata. Empty array if speaker information is not available

    - **`transcription`** (string (uri) | null) **Required**
      Signed URL to download the processed transcription file. Valid for 4 hours. Null if transcription is not available or has been deleted

    - **`transcription_ids`** (string[] | null) **Required**
      Array of transcription job IDs from the transcription provider. Null if transcription was not enabled or if IDs are not available

    - **`transcription_provider`** (string | null) **Required**
      The transcription provider used (e.g., 'gladia', 'deepgram', 'assemblyai'). Null if transcription was not enabled or if provider information is not available

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

### Source: ./content/docs/api-v2/reference/callbacks/callbackfailed.mdx




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

## Callback Payloads

Reference documentation for all callback payload structures

### Source: ./content/docs/api-v2/reference/callbacks/index.mdx


This section contains reference documentation for all callback payload structures sent by Meeting BaaS v2.

## Callbacks

- [Callback Completed](/docs/api-v2/reference/callbacks/callbackcompleted)
- [Callback Failed](/docs/api-v2/reference/callbacks/callbackfailed)


---

