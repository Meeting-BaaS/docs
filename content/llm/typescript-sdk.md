# TypeScript SDK for MeetingBaas

TypeScript SDK documentation for programmatically interacting with Meeting BaaS APIs.

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

Get started with the Meeting BaaS TypeScript SDK

### Source: ./content/docs/typescript-sdk/index.mdx


<Callout type="info">
  We provide optimized documentation for both LLMs and recent MCP server updates. For more on our LLM integration, 
  see [LLMs](../llms/sdk) and for MCP access, visit [auth.meetingbaas.com](https://auth.meetingbaas.com/home).
</Callout>

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

