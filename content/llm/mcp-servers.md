# mcp-servers Documentation

Documentation for mcp-servers.

## Chat MCP Overview

A Comprehensive Guide to Chat MCP - The Standalone Model Context Protocol Server for Meeting BaaS Integration

### Source: ./content/docs/mcp-servers/chat-mcp/overview.mdx


Chat MCP (Model Context Protocol) is a specialized server implementation that bridges AI assistants with Meeting BaaS's powerful chat and meeting capabilities. By implementing the [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol), it enables AI-powered bots to seamlessly participate in meetings, manage calendars, and handle sophisticated meeting operations through a unified, standardized interface.

## Key Features and Capabilities

<Cards>
  <Card title="Meeting Management" icon={<Video className="text-blue-400" />}>
    Comprehensive meeting control including joining, leaving, and real-time presence management. Supports full meeting lifecycle operations and data handling.
  </Card>
  <Card title="Calendar Integration" icon={<Calendar className="text-purple-400" />}>
    Robust calendar synchronization with support for multiple providers. Enables automated meeting scheduling, updates, and calendar event management.
  </Card>
  <Card title="Advanced Bot Management" icon={<Bot className="text-green-400" />}>
    Complete bot lifecycle management including status monitoring, configuration updates, and metadata handling. Supports multiple bot personas and behaviors.
  </Card>
  <Card title="Voice-Enabled AI Bots" icon={<Mic className="text-yellow-400" />}>
    Create and manage AI bots with advanced speech capabilities. Includes customizable voices, speaking patterns, and interactive responses.
  </Card>
  <Card title="Intelligent Event Scheduling" icon={<Clock className="text-amber-400" />}>
    Automated event and recording management with smart scheduling capabilities and conflict resolution.
  </Card>
  <Card title="Development Tools" icon={<Wrench className="text-gray-400" />}>
    Comprehensive testing suite and debugging utilities for development and maintenance. Includes logging, monitoring, and diagnostic tools.
  </Card>
</Cards>

## Technical Prerequisites

1. **Runtime Environment**
   - Node.js: Version 16.x or higher
   - NPM: Latest stable version
   - Operating System: Windows, Linux, or macOS

2. **Network Requirements**
   - Stable internet connection
   - Access to Meeting BaaS API endpoints
   - Firewall rules allowing WebSocket connections

## Account Requirements

1. **Meeting BaaS Account**
   - Active subscription
   - API access enabled
   - Appropriate service tier for intended usage

2. **Authentication**
   - Valid API key from [Meeting BaaS Dashboard](https://meetingbaas.com)
   - Properly configured endpoint access
   - Whitelisted IP addresses (if required)

## Authentication Methods

Chat MCP supports two primary authentication methods:

### 1. Header-based Authentication
```typescript
// Using x-api-key header
headers: {
  'x-api-key': 'YOUR_API_KEY'
}
```

### 2. Parameter-based Authentication
```typescript
// Using WithCredentials variants in tool parameters
{
  credentials: {
    apiKey: 'YOUR_API_KEY'
  }
}
```

## Implementation Guide

### Basic Server Setup

```typescript
import { BaasClient } from "@meeting-baas/sdk/dist/baas/api/client";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

// Initialize the MCP server
const server = new McpServer();

// Configure your API key (use environment variables in production)
const apiKey = process.env.MEETING_BAAS_API_KEY;

// Initialize the BaaS client
const baasClient = new BaasClient({
  apiKey: apiKey,
  baseUrl: "https://api.meetingbaas.com/",
});

// Register required tools and middleware
registerTools(server, apiKey);
```

### Development Workflow

1. **Initial Setup**
   ```bash
   # Install project dependencies
   npm install

   # Build the project
   npm run build

   # Start the development server
   npm run start
   ```

2. **Configuration**
   - Set up environment variables
   - Configure logging levels
   - Set up development tools





---

## Server Configuration

A comprehensive guide to configuring and initializing the Chat MCP server

### Source: ./content/docs/mcp-servers/chat-mcp/server-configuration.mdx


This comprehensive guide covers the setup, configuration, and initialization of the Chat MCP server, including detailed explanations of API handler setup, tool registration, and available capabilities.

## API Handler Setup

The Chat MCP server utilizes a centralized API handler to manage tool registrations and server capabilities. Below is a detailed explanation of how to set up the API handler:

```typescript
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import registerTools from "./tools";

const handler = initializeMcpApiHandler(
  // Tool Registration Callback
  (server, apiKey) => {
    // Register Meeting BaaS SDK tools with the provided API key
    server = registerTools(server, apiKey);
  },
  // Server Capabilities Configuration
  {
    capabilities: {
      tools: {
        // Meeting Management Tools
        joinMeeting: {
          description: "Join's a meeting using the MeetingBaas api",
        },
        leaveMeeting: {
          description: "Leave a meeting using the MeetingBaas api",
        },
        getMeetingData: {
          description: "Get meeting data using the MeetingBaas api",
        },
        deleteData: {
          description: "Delete meeting data using the MeetingBaas api",
        },

        // Calendar Management Tools
        createCalendar: {
          description: "Create a calendar using the MeetingBaas api",
        },
        listCalendars: {
          description: "List calendars using the MeetingBaas api",
        },
        getCalendar: {
          description: "Get calendar using the MeetingBaas api",
        },
        deleteCalendar: {
          description: "Delete calendar using the MeetingBaas api",
        },
        updateCalendar: {
          description: "Update calendar using the MeetingBaas api",
        },
        resyncAllCalendars: {
          description: "Resync all calendars using the MeetingBaas api",
        },

        // Bot Management Tools
        botsWithMetadata: {
          description: "Get bots with metadata using the MeetingBaas api",
        },

        // Event Management Tools
        listEvents: {
          description: "List events using the MeetingBaas api",
        },
        scheduleRecordEvent: {
          description: "Schedule a recording using the MeetingBaas api",
        },
        unscheduleRecordEvent: {
          description: "Unschedule a recording using the MeetingBaas api",
        },

        // Speaking Bot Management Tools
        joinSpeakingMeeting: {
          description: "Join a speaking meeting using the MeetingBaas api",
        },
        leaveSpeakingMeeting: {
          description: "Leave a speaking meeting using the MeetingBaas api",
        },

        // Utility Tools
        echo: {
          description: "Echo a message for testing purposes",
        },
      },
    },
  }
);

export default handler;
```

## Server Initialization

The server initialization process consists of three crucial steps:

### 1. Import Required Dependencies

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
```

### 2. Create Tool Registration Function

```typescript
function registerTools(server: McpServer, apiKey: string): McpServer {
  // Register tools by category
  server = registerMeetingTools(server, apiKey);
  server = registerCalendarTools(server, apiKey);
  server = registerSpeakingTools(server, apiKey);
  server = registerUtilityTools(server);
  
  return server;
}
```

## Available Capabilities

### Meeting Management

<Card title="Core Meeting Controls" icon="users">
  <div className="space-y-4">
    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">Join Meeting (`joinMeeting`)</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>Enables seamless participant joining across multiple meeting platforms</li>
        <li>Handles secure authentication and connection setup</li>
        <li>Supports various meeting providers (Zoom, Teams, etc.)</li>
      </ul>
    </div>

    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">Leave Meeting (`leaveMeeting`)</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>Provides graceful exit handling from active meetings</li>
        <li>Ensures proper cleanup of session resources</li>
        <li>Manages participant departure notifications</li>
      </ul>
    </div>

    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">Meeting Data (`getMeetingData`)</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>Retrieves comprehensive meeting information and analytics</li>
        <li>Includes detailed participant data and engagement metrics</li>
        <li>Provides meeting duration and technical statistics</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-lg mb-2">Data Cleanup (`deleteData`)</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>Manages efficient meeting resource cleanup</li>
        <li>Ensures data privacy and GDPR compliance</li>
        <li>Optimizes storage through automated cleanup processes</li>
      </ul>
    </div>
  </div>
</Card>

### Calendar Management

<Card title="Calendar Operations" icon="calendar">
  <div className="space-y-4">
    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">Calendar Creation and Setup</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Create Calendar (`createCalendar`)
          <ul className="list-circle pl-6 mt-1">
            <li>Set up new calendars with custom configurations</li>
            <li>Define calendar properties and access controls</li>
            <li>Configure timezone and availability settings</li>
          </ul>
        </li>
      </ul>
    </div>

    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">Calendar Management Tools</h4>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          List Calendars (`listCalendars`)
          <ul className="list-circle pl-6 mt-1">
            <li>View all available calendars with filtering options</li>
            <li>Sort and organize calendar listings</li>
          </ul>
        </li>
        <li>
          Calendar Details (`getCalendar`)
          <ul className="list-circle pl-6 mt-1">
            <li>Access detailed calendar information and settings</li>
            <li>View calendar permissions and sharing status</li>
          </ul>
        </li>
        <li>
          Calendar Updates (`updateCalendar`)
          <ul className="list-circle pl-6 mt-1">
            <li>Modify existing calendar configurations</li>
            <li>Update access controls and sharing settings</li>
          </ul>
        </li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-lg mb-2">Synchronization Features</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Full Sync (`resyncAllCalendars`)
          <ul className="list-circle pl-6 mt-1">
            <li>Force synchronization across all connected platforms</li>
            <li>Ensure data consistency and real-time updates</li>
            <li>Resolve conflicts and maintain data integrity</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</Card>

### Bot Management

<Card title="Bot Intelligence" icon="robot">
  <div className="space-y-4">
    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">Bot Information Management</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Metadata Access (`botsWithMetadata`)
          <ul className="list-circle pl-6 mt-1">
            <li>Retrieve comprehensive bot information and status</li>
            <li>Access real-time performance analytics</li>
            <li>Monitor bot health and activity metrics</li>
          </ul>
        </li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-lg mb-2">Voice Integration Features</h4>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Meeting Voice Control
          <ul className="list-circle pl-6 mt-1">
            <li>`joinSpeakingMeeting`: Initialize voice interaction capabilities</li>
            <li>`leaveSpeakingMeeting`: Gracefully terminate voice sessions</li>
            <li>Real-time voice processing and response handling</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</Card>

### Event Management

<Card title="Event Orchestration" icon="calendar-check">
  <div className="space-y-4">
    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">Event Management Tools</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Event Listing (`listEvents`)
          <ul className="list-circle pl-6 mt-1">
            <li>Comprehensive view of all scheduled and ongoing events</li>
            <li>Advanced filtering and sorting capabilities</li>
            <li>Real-time event status monitoring</li>
          </ul>
        </li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-lg mb-2">Recording Management</h4>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Schedule Management
          <ul className="list-circle pl-6 mt-1">
            <li>`scheduleRecordEvent`: Configure automated recording sessions</li>
            <li>`unscheduleRecordEvent`: Modify or cancel planned recordings</li>
            <li>Manage recording settings and storage options</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</Card>

### Utility Features

<Card title="System Utilities" icon="wrench">
  <div className="space-y-4">
    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">System Health Monitoring</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Connectivity Testing (`echo`)
          <ul className="list-circle pl-6 mt-1">
            <li>Real-time system connectivity verification</li>
            <li>Response time monitoring and latency checks</li>
            <li>Service availability testing</li>
          </ul>
        </li>
      </ul>
    </div>

    <div className="border-b pb-4">
      <h4 className="font-semibold text-lg mb-2">Security Features</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>Secure API key management and rotation</li>
        <li>Authentication and authorization handling</li>
        <li>Access control and permission management</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-lg mb-2">Performance Monitoring</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>Resource utilization tracking and optimization</li>
        <li>System metrics and analytics</li>
        <li>Performance bottleneck identification</li>
      </ul>
    </div>
  </div>
</Card>

## Implementation Example 

Here's a complete example demonstrating how to implement and use the configured server in your application:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import handler from "./handler";

async function setupServer() {
  // Initialize the MCP server instance
  const server = new McpServer();
  
  // Retrieve API key from environment variables
  const apiKey = process.env.MEETING_BAAS_API_KEY;

  // Initialize the handler with server and API key
  await handler.initialize(server, apiKey);

  return server;
}

// Start the server with error handling
setupServer()
  .then((server) => {
    console.log("✅ MCP server successfully initialized with all capabilities");
  })
  .catch((error) => {
    console.error("❌ Failed to initialize MCP server:", error);
    process.exit(1);
  });
```


---

## Calendar Management Tools

Tools for managing calendar integrations and synchronization with Google and Microsoft calendars

### Source: ./content/docs/mcp-servers/chat-mcp/tools/calendar-management.mdx


This section covers the tools available for managing calendar integrations in your Meeting BaaS implementation. These tools enable you to create, manage, and synchronize calendar integrations for automated meeting recordings and bot scheduling.

## Available Tools

### createCalendar

Creates a new calendar integration for your Meeting BaaS instance.

#### Use Cases
- Setting up automatic meeting recordings
- Configuring calendar-based bot scheduling
- Enabling recurring meeting coverage

#### Parameters
- `oauthClientId` (string): OAuth client ID for authentication with the calendar service
- `oauthClientSecret` (string): OAuth client secret for secure authentication
- `oauthRefreshToken` (string): OAuth refresh token for maintaining persistent access
- `platform` (enum): Calendar service provider, must be either "Google" or "Microsoft"
- `rawCalendarId` (string, optional): Specific calendar ID to integrate. If not provided, defaults to primary calendar

#### Response
- Success: Returns a confirmation message indicating successful calendar creation
- Error: Returns an error message if creation fails

#### Example
```typescript
try {
  const response = await server.tools.createCalendar({
    oauthClientId: "your_client_id",
    oauthClientSecret: "your_client_secret",
    oauthRefreshToken: "your_refresh_token",
    platform: "Google",
    rawCalendarId: "primary"
  });
  console.log("Calendar created successfully");
} catch (error) {
  console.error("Failed to create calendar:", error);
}
```

### listCalendars

Retrieves a list of all configured calendar integrations in your system.

#### Use Cases
- Viewing all configured calendars
- Checking calendar integration status
- Managing multiple calendar integrations

#### Parameters
None required

#### Response
- Success: Returns a JSON object containing all configured calendars
- Error: Returns an error message if listing fails

#### Example
```typescript
try {
  const response = await server.tools.listCalendars();
  console.log("Configured calendars:", response);
} catch (error) {
  console.error("Failed to list calendars:", error);
}
```

### getCalendar

Retrieves detailed information about a specific calendar integration.

#### Use Cases
- Viewing specific calendar configuration
- Checking individual calendar status
- Verifying calendar settings

#### Parameters
- `calendarId` (string): The unique identifier of the calendar to retrieve

#### Response
- Success: Returns detailed information about the requested calendar
- Error: Returns an error message if retrieval fails

#### Example
```typescript
try {
  const response = await server.tools.getCalendar({
    calendarId: "calendar-123-xyz"
  });
  console.log("Calendar details:", response);
} catch (error) {
  console.error("Failed to get calendar:", error);
}
```

### deleteCalendar

Removes a calendar integration from your system.

#### Use Cases
- Removing unwanted calendar connections
- Stopping automatic recordings for specific calendars
- Cleaning up calendar integration data

#### Parameters
- `calendarId` (string): The unique identifier of the calendar to delete

#### Response
- Success: Returns a confirmation of calendar deletion
- Error: Returns an error message if deletion fails

#### Example
```typescript
try {
  const response = await server.tools.deleteCalendar({
    calendarId: "calendar-123-xyz"
  });
  console.log("Calendar deleted successfully");
} catch (error) {
  console.error("Failed to delete calendar:", error);
}
```

### updateCalendar

Updates an existing calendar integration's configuration.

#### Use Cases
- Modifying calendar settings
- Updating connection details
- Changing calendar configuration

#### Parameters
- `calendarId` (string): The unique identifier of the calendar to update
- `oauthClientId` (string): Updated OAuth client ID for authentication
- `oauthClientSecret` (string): Updated OAuth client secret for secure authentication
- `oauthRefreshToken` (string): Updated OAuth refresh token for maintaining persistent access
- `platform` (enum): Calendar service provider, must be either "Google" or "Microsoft"

#### Response
- Success: Returns a confirmation message indicating successful calendar update
- Error: Returns an error message if update fails

#### Example
```typescript
try {
  const response = await server.tools.updateCalendar({
    calendarId: "calendar-123-xyz",
    oauthClientId: "updated_client_id",
    oauthClientSecret: "updated_client_secret",
    oauthRefreshToken: "updated_refresh_token",
    platform: "Google"
  });
  console.log("Calendar updated successfully");
} catch (error) {
  console.error("Failed to update calendar:", error);
}
```

### resyncAllCalendars

Forces a synchronization of all configured calendar integrations.

#### Use Cases
- Updating calendar data manually
- Fixing synchronization issues
- Refreshing all calendar connections

#### Parameters
None required

#### Response
- Success: Returns a confirmation of successful resynchronization
- Error: Returns an error message if resync fails

#### Example
```typescript
try {
  const response = await server.tools.resyncAllCalendars();
  console.log("All calendars resynced successfully");
} catch (error) {
  console.error("Failed to resync calendars:", error);
}
```

## Error Handling

All calendar management tools include comprehensive error handling. It's recommended to implement try-catch blocks when using these tools:

```typescript
try {
  // Calendar operation
  const response = await server.tools.calendarOperation(params);
  // Handle success
} catch (error) {
  console.error("Calendar operation failed:", error);
  // Handle error appropriately
}
```

---

## Event Management Tools

Tools for managing meeting events and recordings

### Source: ./content/docs/mcp-servers/chat-mcp/tools/event-management.mdx


This section covers the comprehensive suite of tools available for managing meeting events, including scheduling recordings, managing calendar events, and handling automated bot activities.

## Available Tools

### listEvents

Lists all scheduled events from a specified calendar. This tool is particularly useful when you need to:
- View upcoming recordings
- Check scheduled transcriptions
- Monitor planned bot activities

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | Yes | The unique identifier of the calendar to list events from |

#### Response Format
The tool returns a structured response containing the list of events:

```typescript
interface EventResponse {
  content: Array<{
    type: string;
    text: string; // JSON stringified event data
  }>;
  isError?: boolean;
}
```

#### Example Usage
```typescript
try {
  const response = await server.tools.listEvents({
    calendarId: "calendar-123-xyz"
  });
  
  // Response will contain list of events
  console.log(response.content[0].text);
} catch (error) {
  // Handle error
}
```

### scheduleRecordEvent

Configures automatic recording for a specific calendar event. Use this tool when you need to:
- Set up automatic recording for meetings
- Schedule future transcriptions
- Plan meeting recordings with specific configurations

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventUuid` | string | Yes | Unique identifier of the event to be recorded |
| `botName` | string | Yes | Name of the recording bot that will handle the session |
| `extra` | object | No | Additional configuration parameters for recording |
| `allOccurrences` | boolean | No | Whether to schedule recording for all instances of a recurring event |

#### Extra Configuration Options
The `extra` parameter can include various recording configurations:
```typescript
{
  quality: "high" | "medium" | "low",
  transcription: boolean,
  // Additional configuration options as needed
}
```

#### Example Usage
```typescript
try {
  const response = await server.tools.scheduleRecordEvent({
    eventUuid: "event-123-xyz",
    botName: "Recording Bot",
    extra: {
      quality: "high",
      transcription: true
    },
    allOccurrences: false
  });
  
  // Handle successful scheduling
  console.log(response.content[0].text);
} catch (error) {
  // Handle error
}
```

### unscheduleRecordEvent

Cancels previously scheduled recordings for calendar events. This tool is useful when you need to:
- Cancel automatic recording
- Stop planned transcription
- Remove scheduled bot activity

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventUuid` | string | Yes | Unique identifier of the event |
| `allOccurrences` | boolean | No | Whether to cancel recordings for all instances of a recurring event |

#### Example Usage
```typescript
try {
  const response = await server.tools.unscheduleRecordEvent({
    eventUuid: "event-123-xyz",
    allOccurrences: false
  });
  
  // Handle successful cancellation
  console.log(response.content[0].text);
} catch (error) {
  // Handle error
}
```

## Error Handling

All event management tools include comprehensive error handling. Here's the recommended pattern:

```typescript
try {
  const response = await server.tools.eventOperation(params);
  if (response.isError) {
    // Handle error response
    console.error(response.content[0].text);
    return;
  }
  // Handle success
  console.log(response.content[0].text);
} catch (error) {
  // Handle unexpected errors
  console.error("Operation failed:", error);
}
```

## Response Structure

All tools return responses in a consistent format:

```typescript
interface EventResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}
```

### Success Response Example
```json
{
  "content": [
    {
      "type": "text",
      "text": "Successfully completed the operation"
    }
  ]
}
```

### Error Response Example
```json
{
  "content": [
    {
      "type": "text",
      "text": "Operation failed: Detailed error message"
    }
  ],
  "isError": true
}
```

---

## Meeting Management Tools

Comprehensive guide for managing meetings and bot interactions in the Meeting Control Platform

### Source: ./content/docs/mcp-servers/chat-mcp/tools/meeting-management.mdx


The Meeting Management Tools provide a robust set of functionalities for controlling and managing meeting operations through AI bots. These tools enable seamless integration of AI assistants into meetings, allowing them to join, participate, collect data, and manage meeting resources effectively.

## Available Tools

### 1. joinSpeaking

**Purpose**: Enables an AI bot to join a meeting with full speaking capabilities, allowing real-time voice interaction.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `meetingUrl` | string | Yes | The URL of the meeting to join |
| `botName` | string | Yes | Display name for the bot in the meeting |
| `extra` | object | No | Additional configuration options |

#### Example Usage

```typescript
try {
  const response = await server.tools.joinSpeaking({
    meetingUrl: "https://meet.example.com/123",
    botName: "Assistant Bot",
    extra: {
      role: "note-taker",
      capabilities: ["transcription", "recording"]
    }
  });
  console.log("Bot joined successfully:", response);
} catch (error) {
  console.error("Failed to join meeting:", error);
}
```

#### Response
The tool returns a response object containing:
- `botId`: Unique identifier for the bot instance
- `status`: Current connection status
- `joinedAt`: Timestamp of when the bot joined

### 2. leaveMeeting

**Purpose**: Gracefully removes an AI bot from an active meeting, ensuring proper cleanup of resources.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `botId` | string | Yes | Unique identifier of the bot to remove |

#### Example Usage

```typescript
try {
  const response = await server.tools.leaveMeeting({
    botId: "bot-123-xyz"
  });
  console.log("Bot left successfully:", response);
} catch (error) {
  console.error("Failed to leave meeting:", error);
}
```

### 3. getMeetingData

**Purpose**: Retrieves comprehensive meeting data including transcriptions, recordings, and bot status information.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `botId` | string | Yes | Bot identifier to fetch associated meeting data |

#### Example Usage

```typescript
try {
  const meetingData = await server.tools.getMeetingData({
    botId: "bot-123-xyz"
  });
  console.log("Meeting data retrieved:", meetingData);
} catch (error) {
  console.error("Failed to fetch meeting data:", error);
}
```

#### Response Structure
```typescript
interface MeetingData {
  meetingId: string;
  status: 'active' | 'ended';
  duration: number;
  participants: number;
  transcription?: {
    text: string;
    timestamp: number;
  }[];
  recording?: {
    url: string;
    duration: number;
    format: string;
  };
}
```

### 4. deleteData

**Purpose**: Permanently removes all data associated with a specific bot instance, including recordings and transcriptions.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `botId` | string | Yes | Identifier of the bot whose data should be deleted |

#### Example Usage

```typescript
try {
  await server.tools.deleteData({
    botId: "bot-123-xyz"
  });
  console.log("Data deleted successfully");
} catch (error) {
  console.error("Failed to delete data:", error);
}
```

### 5. botsWithMetadata

**Purpose**: Retrieves a comprehensive list of all active bots and their associated metadata.

#### Parameters
This tool takes no parameters.

#### Example Usage

```typescript
try {
  const botsList = await server.tools.botsWithMetadata();
  console.log("Active bots:", botsList);
} catch (error) {
  console.error("Failed to fetch bots:", error);
}
```

#### Response Structure
```typescript
interface BotMetadata {
  botId: string;
  name: string;
  status: 'active' | 'inactive';
  joinedAt: string;
  meetingUrl: string;
  capabilities: string[];
}
```

## Error Handling

All tools implement robust error handling with specific error types:

```typescript
try {
  const result = await server.tools.someOperation(params);
  // Handle success case
} catch (error) {
  if (error instanceof MeetingConnectionError) {
    // Handle connection issues
    console.error("Connection failed:", error.message);
  } else if (error instanceof AuthenticationError) {
    // Handle authentication issues
    console.error("Authentication failed:", error.message);
  } else {
    // Handle other types of errors
    console.error("Operation failed:", error);
  }
}
```

---

## Speaking Bot Tools

A comprehensive guide to managing AI speaking bots in your meetings

### Source: ./content/docs/mcp-servers/chat-mcp/tools/speaking-bot.mdx


Speaking Bot Tools provide a powerful interface for integrating AI-powered voice participants into your meetings. These tools enable you to create interactive, voice-capable AI bots that can join your video meetings, adopt specific personas, and engage in real-time conversations.

## Core Functionality

### Available Personas

The speaking bot system offers a diverse range of personas to suit different meeting contexts and requirements. Each persona comes with its unique communication style, expertise, and personality traits.

<Accordions type="single">
  <Accordion title="Browse Available Personas">
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <h4 className="font-medium">Technical Roles</h4>
        <ul className="list-disc pl-4">
          <li>C++ Veteran</li>
          <li>Golang Minimalist</li>
          <li>Grafana Guru</li>
          <li>Haskell Purist</li>
          <li>Lisp Enlightened</li>
          <li>Pair Programmer</li>
          <li>Rust Evangelist</li>
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Business Roles</h4>
        <ul className="list-disc pl-4">
          <li>BaaS Onboarder</li>
          <li>Corporate Girlboss</li>
          <li>Data Baron</li>
          <li>Factory Patriarch</li>
          <li>Hospital Administrator</li>
          <li>Interviewer</li>
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Specialty Roles</h4>
        <ul className="list-disc pl-4">
          <li>Academic Warlord</li>
          <li>Climate Engineer</li>
          <li>Deep Sea Therapist</li>
          <li>Futuristic AI Philosopher</li>
          <li>Military Strategist</li>
          <li>Quantum Physicist</li>
        </ul>
      </div>
    </div>
    
    <details>
      <summary className="mt-4 cursor-pointer text-sm text-gray-600">View Complete Persona List</summary>
      <ul className="mt-2 columns-2 md:columns-3 list-disc pl-4">
        {/* Original complete list of personas */}
        <li>1940s Noir Detective</li>
        <li>Ancient Alien Theorist</li>
        <li>Ancient Roman General</li>
        <li>Arctic Prospector</li>
        {/* ... rest of the personas ... */}
      </ul>
    </details>
  </Accordion>
</Accordions>

## API Reference

### joinSpeakingMeeting

Creates and sends an AI speaking bot to join a video meeting.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `meetingUrl` | string | Yes | The URL of the meeting to join |
| `botName` | string | Yes | Display name for the bot in the meeting |
| `meetingBaasApiKey` | string | Yes | Your MeetingBaas API authentication key |
| `personas` | string[] | No | Array of preferred personas (first available will be used) |
| `botImage` | string | No | Custom avatar URL for the bot |
| `entryMessage` | string | No | Initial message when joining |
| `enableTools` | boolean | No | Enable bot tools (default: true) |
| `extra` | object | No | Additional custom configuration |

#### Example Usage

```typescript
const response = await server.tools.joinSpeakingMeeting({
  meetingUrl: 'https://meet.example.com/123',
  botName: 'AI Assistant',
  meetingBaasApiKey: process.env.MEETING_BAAS_API_KEY,
  personas: ['pair_programmer', 'tech_support'],
  botImage: 'https://example.com/bot-avatar.png',
  entryMessage: "Hello! I'm here to assist with the meeting.",
  enableTools: true,
  extra: {
    role: 'technical_assistant',
    specialization: 'code_review'
  }
});
```

#### Response Structure

```typescript
interface JoinResponse {
  content: Array<{
    type: string;
    text: string; // Contains the bot ID
  }>;
  isError?: boolean;
}
```

### leaveSpeakingMeeting

Removes a speaking bot from an active meeting.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `botId` | string | Yes | The unique ID of the bot to remove |
| `meetingBaasApiKey` | string | Yes | Your MeetingBaas API authentication key |

#### Example Usage

```typescript
const response = await server.tools.leaveSpeakingMeeting({
  botId: 'bot-123-xyz',
  meetingBaasApiKey: process.env.MEETING_BAAS_API_KEY
});
```

## Implementation Guide

### Error Handling

Implement robust error handling to manage potential issues:

```typescript
try {
  const response = await server.tools.joinSpeakingMeeting(params);
  console.log('Bot joined successfully:', response.content[0].text);
} catch (error) {
  console.error('Failed to join meeting:', error);
  // Implement appropriate error recovery
}
```

## Complete Integration Example

Here's a comprehensive example showing how to integrate the speaking bot tools:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize server
const server = new McpServer();

async function manageSpeakingBot() {
  let botId;
  
  try {
    // Join meeting
    const joinResponse = await server.tools.joinSpeakingMeeting({
      meetingUrl: 'https://meet.example.com/123',
      botName: 'AI Assistant',
      meetingBaasApiKey: process.env.MEETING_BAAS_API_KEY,
      personas: ['pair_programmer'],
      entryMessage: 'Ready to assist with the meeting!'
    });

    // Extract bot ID from response
    botId = joinResponse.content[0].text.split(': ')[1];
    
    // Set up cleanup handler
    process.on('SIGINT', async () => {
      if (botId) {
        await cleanupBot(botId);
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Failed to manage bot:', error);
    if (botId) {
      await cleanupBot(botId);
    }
  }
}

async function cleanupBot(botId: string) {
  try {
    await server.tools.leaveSpeakingMeeting({
      botId,
      meetingBaasApiKey: process.env.MEETING_BAAS_API_KEY
    });
    console.log('Bot cleanup successful');
  } catch (error) {
    console.error('Bot cleanup failed:', error);
  }
}
```

## API Endpoints Reference

The speaking bot tools interact with the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/bots` | POST | Create and deploy a new speaking bot |
| `/bots/{botId}` | DELETE | Remove an active speaking bot |

## Response Types

### Success Response

```json
{
  "content": [
    {
      "type": "text",
      "text": "Successfully joined meeting with speaking bot ID: bot-123-xyz"
    }
  ]
}
```

### Error Response

```json
{
  "content": [
    {
      "type": "text",
      "text": "Failed to join meeting with speaking bot: Invalid meeting URL"
    }
  ],
  "isError": true
}
```


---

## Utility Tools

Essential utility tools for testing, debugging, and system maintenance

### Source: ./content/docs/mcp-servers/chat-mcp/tools/utility-tools.mdx


The MCP (Model Context Protocol) server provides a set of utility tools designed to facilitate testing, debugging, and basic system operations. These tools are essential for developers to ensure proper functionality and maintain their MCP server implementations.

## Available Tools

### Echo Tool

The Echo tool is a fundamental utility that provides a simple way to verify server connectivity and test basic functionality. It reflects back any message sent to it, making it ideal for testing and debugging purposes.

#### Purpose and Use Cases

1. **Server Verification**
   - Test initial server setup and configuration
   - Verify server responsiveness
   - Debug communication channels

2. **Health Monitoring**
   - Implement basic health checks
   - Monitor server latency
   - Validate message passing functionality

3. **Development and Testing**
   - Debug message formatting
   - Test error handling
   - Verify client-server communication

#### Technical Specification

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The message to be echoed back by the server |

##### Response Format

The Echo tool returns a response in the following structure:

```typescript
interface EchoResponse {
  content: Array<{
    type: "text";
    text: string;  // Format: "Tool echo: {message}"
  }>;
}
```

#### Implementation Guide

Below is a complete implementation example of the Echo tool using the MCP SDK:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

export function registerEchoTool(server: McpServer): McpServer {
  server.tool(
    "echo",
    "Echo back the provided message for testing purposes",
    { message: z.string() },
    async ({ message }: { message: string }) => ({
      content: [
        {
          type: "text",
          text: `Tool echo: ${message}`,
        },
      ],
    })
  );

  return server;
}
```

#### Usage Examples

1. **Basic Echo Test**
```typescript
const response = await server.tools.echo({
  message: "Hello, MCP!"
});

// Expected Response:
// {
//   "content": [
//     {
//       "type": "text",
//       "text": "Tool echo: Hello, MCP!"
//     }
//   ]
// }
```

2. **Integration Example**
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

// Initialize MCP server
const server = new McpServer();

// Register the echo tool
registerEchoTool(server);

// Example usage with error handling
async function testEchoTool() {
  try {
    const response = await server.tools.echo({
      message: "Testing MCP server connection"
    });
    
    console.log("Echo response:", response.content[0].text);
    return response;
  } catch (error) {
    console.error("Echo test failed:", error);
    throw error;
  }
}

// Execute the test
testEchoTool()
  .then(() => console.log("Echo test completed successfully"))
  .catch(() => console.log("Echo test failed"));
```

---

## Introduction

Get started with Model Context Protocol servers for Meeting BaaS

### Source: ./content/docs/mcp-servers/index.mdx


<Callout type="info">
  We provide detailed documentation optimized for both human readers and AI assistants. For more information about our LLM integration, see
  [LLMs](../llms/available).
</Callout>

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

