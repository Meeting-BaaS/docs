# mcp-servers Documentation

Documentation for mcp-servers.

## Getting Started

Get started with Model Context Protocol servers for Meeting BaaS

### Source: ./content/docs/mcp-servers/getting-started.mdx


An MCP server acts as a bridge between AI assistants and Meeting BaaS services, providing:

- Real-time meeting transcription and analysis
- Automated meeting scheduling and management
- Context-aware AI interactions
- Secure API integrations
- Scalable infrastructure for enterprise needs

## Deployment Options

Meeting BaaS offers two robust MCP server implementations to match your specific needs:

<Cards>
  <Card
    title="MCP on Vercel"
    icon={<Cloud className="text-blue-400" />}
    href="/docs/mcp-servers/mcp-on-vercel"
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
    href="/docs/mcp-servers/meeting-mcp"
  >
    A self-hosted solution providing:
    - Complete infrastructure control
    - Custom deployment options
    - Enhanced security configurations
    - Local development flexibility
  </Card>
</Cards>

## System Requirements

Before proceeding with the setup, ensure you have:

### Essential Requirements
- Node.js v16.x or later
- npm or yarn package manager
- Git for version control
- A Meeting BaaS account with API access

### Additional Tools
- Docker (for local development)
- VS Code or preferred IDE
- Terminal access
- Basic knowledge of JavaScript/TypeScript

## Detailed Setup Guide

<Steps>
  <Step title="Account Setup">
    1. Create a Meeting BaaS account at [meetingbaas.com](https://meetingbaas.com)
    2. Generate an API key from your dashboard
    3. Save your API credentials securely
  </Step>

  <Step title="Environment Preparation">
    1. Install Node.js and npm
    ```bash
    # Check Node.js version
    node --version
    
    # Check npm version
    npm --version
    ```
    
    2. Set up your development environment
    3. Configure your IDE for TypeScript development
  </Step>

  <Step title="Choose Deployment Method">
    Select your preferred deployment approach based on your needs:

    **Cloud Deployment (MCP on Vercel)**
    - Ideal for teams wanting minimal infrastructure management
    - Perfect for production environments
    - Supports automatic scaling
    - Includes built-in monitoring

    **Self-Hosted (Meeting MCP)**
    - Best for complete control over infrastructure
    - Suitable for custom security requirements
    - Allows local development and testing
    - Enables custom modifications
  </Step>

  <Step title="Initial Configuration">
    1. Clone the appropriate repository
    ```bash
    # For Vercel deployment
    git clone https://github.com/meetingbaas/mcp-vercel
    
    # For self-hosted deployment
    git clone https://github.com/meetingbaas/meeting-mcp
    ```

    2. Install dependencies
    ```bash
    npm install
    ```

    3. Configure environment variables
    ```bash
    cp .env.example .env
    ```
  </Step>

  <Step title="Testing Your Setup">
    1. Run the development server
    ```bash
    npm run dev
    ```

    2. Verify the server is running
    3. Test API endpoints
    4. Configure your AI assistant
  </Step>
</Steps>


---

## Introduction

Model Context Protocol servers for Meeting BaaS integration

### Source: ./content/docs/mcp-servers/index.mdx


## What is Model Context Protocol?

The [Model Context Protocol (MCP)](https://github.com/anthropics/anthropic-model-context-protocol) is an open standard developed by Anthropic that enables AI assistants like Claude to securely connect with external data sources and tools. MCP provides a standardized way for AI models to:

- Access data from various repositories
- Use tools to take actions in external systems
- Maintain context when working across different applications

MCP follows a client-server architecture where AI assistants (clients) connect to lightweight servers that expose specific capabilities through a standardized interface.

## Meeting BaaS MCP Servers

Meeting BaaS offers two MCP server options to help you integrate AI capabilities with your meeting management:

<Cards>
  <Card
    title="MCP on Vercel"
    icon={<Cloud className="text-blue-400" />}
    href="/docs/mcp-servers/mcp-on-vercel"
  >
    A cloud-based MCP server optimized for deployment on Vercel, providing AI
    integration with Meeting BaaS services through a serverless architecture.
  </Card>
  <Card
    title="Meeting MCP"
    icon={<Server className="text-green-400" />}
    href="/docs/mcp-servers/meeting-mcp"
  >
    A standalone MCP server for local deployment, offering comprehensive meeting
    data management, transcript search, and bot control capabilities.
  </Card>
</Cards>

## Key Capabilities

Both MCP servers provide access to Meeting BaaS capabilities through standardized tools:

<Accordions>
  <Accordion title="Meeting Management" icon={<VideoIcon />} defaultOpen>
    - Create and invite meeting bots to video conferences - Record and
    transcribe meetings automatically - Manage speaking bots with different
    personas - Configure recording settings and bot behavior
  </Accordion>

  <Accordion title="Calendar Integration" icon={<Calendar />}>
    - Connect Google and Microsoft calendars - Schedule automated recordings of
    upcoming meetings - Manage calendar events and recordings - Receive guidance
    on OAuth setup and configuration
  </Accordion>

  <Accordion title="Transcript & Data Access" icon={<FileText />}>
    - Search through meeting transcripts - Identify and share key moments from
    meetings - Generate shareable links to specific meeting segments - Access
    comprehensive meeting data and metadata
  </Accordion>
</Accordions>

## MCP Client Integration

These MCP servers can be integrated with various MCP clients:

- **Claude Desktop**: Connect directly to your meetings and calendars through the Claude Desktop app
- **Cursor**: Enable meeting access and management directly from your IDE
- **Custom Applications**: Build your own MCP clients that leverage Meeting BaaS capabilities

## Getting Started

Choose the MCP server that best fits your needs:

<Cards>
  <Card
    title="Deploy to Vercel"
    icon={<ExternalLink />}
    href="https://github.com/Meeting-Baas/mcp-on-vercel"
  >
    Fork and deploy the cloud-based MCP server to your Vercel account.
  </Card>
  <Card
    title="Run Locally"
    icon={<Terminal />}
    href="https://github.com/Meeting-Baas/meeting-mcp"
  >
    Clone and run the standalone MCP server on your local machine.
  </Card>
</Cards>

Both servers integrate with the [Meeting BaaS TypeScript SDK](/docs/typescript-sdk) to provide comprehensive coverage of all API capabilities.


---

## MCP on Vercel

Enterprise-grade Model Context Protocol server for Meeting BaaS integration, optimized for Vercel deployment

### Source: ./content/docs/mcp-servers/mcp-on-vercel.mdx


MCP on Vercel is an enterprise-grade [Model Context Protocol](https://github.com/anthropics/anthropic-model-context-protocol) server that powers the [chat.meetingbaas.com](https://chat.meetingbaas.com) platform. Built as an enhanced fork of the Vercel MCP template, it provides comprehensive Meeting BaaS integration for advanced meeting automation, AI-powered interactions, and intelligent meeting management.

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

## Technical Architecture

### SDK Integration

The server leverages the official Meeting BaaS TypeScript SDK (`@meeting-baas/sdk`) which provides:

- **Type Safety**: Complete TypeScript definitions for all API interactions
- **Auto-Updates**: Synchronized with the latest OpenAPI specifications
- **Cross-Platform Support**: Unified interface for Google Meet, Zoom, and Microsoft Teams
- **Pre-built MCP Tools**: Ready-to-use AI system integrations
- **Comprehensive API Access**: Type-safe functions for the entire Meeting BaaS API surface

### System Requirements

**Required Components:**
- Vercel account with deployment access
- Meeting BaaS API key
- Redis instance (for session state management)
- Node.js v16 or higher (for local development)

**Recommended Setup:**
- Vercel Pro/Enterprise account for extended compute capabilities
- Redis instance in the same region as your Vercel deployment
- Fluid Compute enabled for optimal performance

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

## Advanced Features

### Meeting Management
- Real-time meeting joining and leaving
- Automated recording with transcription
- Dynamic bot persona management
- Resource cleanup and optimization

### Calendar Integration
- Multi-platform calendar support
- Intelligent scheduling automation
- Event management and updates
- Configuration synchronization

### Bot Management
- Active bot monitoring and metrics
- Detailed metadata tracking
- Dynamic configuration updates
- Performance optimization

## Contributing

This project is maintained as an enhanced fork of the [original Vercel MCP template](https://github.com/vercel-labs/mcp-on-vercel). Contributions are welcome through pull requests and issues on our repository.

<Callout type="info">
  For production deployments, we recommend subscribing to our release notifications
  to stay updated with the latest security patches and feature enhancements.
</Callout>


---

## Meeting MCP

Standalone MCP server for local deployment with Meeting BaaS integration

### Source: ./content/docs/mcp-servers/meeting-mcp.mdx


Meeting MCP is a standalone [Model Context Protocol](https://github.com/anthropics/anthropic-model-context-protocol) server that provides AI assistants with access to Meeting BaaS data and capabilities. The server can be deployed locally or on your own infrastructure, making it ideal for use with Claude Desktop and other MCP clients.

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

## Available Tools

The server exposes several tools through the MCP protocol:

<Accordions>
  <Accordion title="Calendar Tools" icon={<Calendar />} defaultOpen>
    - **oauthGuidance**: Get step-by-step instructions for setting up OAuth -
    **listRawCalendars**: List available calendars before integration -
    **setupCalendarOAuth**: Integrate a calendar using OAuth credentials -
    **listCalendars**: List all integrated calendars - **getCalendar**: Get
    detailed information about a specific calendar - **deleteCalendar**: Remove
    a calendar integration - **resyncAllCalendars**: Force a refresh of all
    connected calendars - **listUpcomingMeetings**: List upcoming meetings from
    a calendar - **listEvents**: List calendar events with filtering options -
    **getEvent**: Get detailed information about a specific event -
    **scheduleRecording**: Schedule a bot to record an upcoming meeting -
    **cancelRecording**: Cancel a previously scheduled recording -
    **checkCalendarIntegration**: Diagnose calendar integration issues
  </Accordion>

<Accordion title="Meeting Tools" icon={<Video />}>
  - **createBot**: Create a meeting bot that can join video conferences -
  **getBots**: List all bots and their associated meetings -
  **getBotsByMeeting**: Get bots for a specific meeting URL - **getRecording**:
  Retrieve recording information - **getRecordingStatus**: Check the status of a
  recording - **getMeetingData**: Get transcript and recording data
</Accordion>

<Accordion title="Transcript Tools" icon={<FileText />}>
  - **getMeetingTranscript**: Get a complete meeting transcript with speaker
  information - **findKeyMoments**: Automatically identify important moments in
  a meeting
</Accordion>

<Accordion title="QR Code Tools" icon={<QrCode />}>
  - **generateQRCode**: Create an AI-generated QR code image for use as a bot
  avatar
</Accordion>

  <Accordion title="Link Sharing Tools" icon={<Link />}>
    - **shareableMeetingLink**: Generate a formatted, shareable link to a
    recording - **shareMeetingSegments**: Create links to multiple important
    moments
  </Accordion>
</Accordions>

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

````
  </Tab>
</Tabs>

## Development

For development purposes, you can:

```bash
# Run in development mode with auto-reload
npm run dev

# Test with MCP Inspector
npm run inspect

# Clean up logs
npm run cleanup
````

## Project Structure

- `src/index.ts`: Main entry point
- `src/tools/`: Tool implementations
- `src/resources/`: Resource definitions
- `src/api/`: API client for the Meeting BaaS backend
- `src/types/`: TypeScript type definitions
- `src/config.ts`: Server configuration
- `src/utils/`: Utility functions


---

## Calendar Integration

Integrate and manage calendar services with Meeting BaaS for automated meeting scheduling, recording, and analysis

### Source: ./content/docs/mcp-servers/integrations/calendar-integration.mdx


## Overview

This guide covers how to integrate calendar services, manage meeting recordings, and utilize advanced features for meeting analysis and sharing. The system supports major calendar platforms including Google Calendar and Microsoft Outlook.

## Recording Meetings

### Creating Meeting Bots

To record a meeting, you can create a bot that automatically joins and records your video conference:

```bash
# Basic meeting bot creation
curl -X POST https://api.meetingbaas.com/v1/bots \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "meetingUrl": "https://zoom.us/j/123456789",
    "name": "Recording Bot",
    "recordingMode": "gallery_view"
  }'
```

### Checking Recording Status

You can check the status of your meeting recordings using the bot ID:

```bash
curl -X GET https://api.meetingbaas.com/v1/bots/{BOT_ID}/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Calendar Integration

### OAuth Setup

#### Google Calendar OAuth Setup

1. Visit the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials (Client ID and Client Secret)
6. Use the provided authorization flow to obtain a refresh token

Required credentials:
- Client ID
- Client Secret
- Refresh Token
- Calendar ID (optional, defaults to primary calendar)

#### Microsoft Calendar OAuth Setup

1. Visit the [Azure Portal](https://portal.azure.com)
2. Register a new application
3. Add Calendar.Read and Calendar.ReadWrite permissions
4. Create a client secret
5. Configure redirect URIs
6. Complete the OAuth flow to obtain refresh token

### Calendar Integration Commands

#### List Available Calendars

```bash
curl -X GET https://api.meetingbaas.com/v1/calendars \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "Google",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret",
    "refreshToken": "your-refresh-token"
  }'
```

#### Integrate Calendar

```bash
curl -X POST https://api.meetingbaas.com/v1/calendars \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "Google",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret",
    "refreshToken": "your-refresh-token",
    "calendarId": "primary@gmail.com"
  }'
```

### Automated Recording Management

#### Schedule Recording

```bash
curl -X POST https://api.meetingbaas.com/v1/recordings/schedule \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event-id",
    "botConfig": {
      "name": "Team Meeting Bot",
      "recordingMode": "gallery_view",
      "entryMessage": "Hello everyone, I'm here to record the meeting"
    }
  }'
```

#### View Scheduled Recordings

```bash
curl -X GET https://api.meetingbaas.com/v1/recordings/scheduled \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Cancel Recording

```bash
curl -X DELETE https://api.meetingbaas.com/v1/recordings/{EVENT_ID} \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Meeting Content Analysis

### Accessing Recordings

All recordings are available through the Meeting BaaS viewer:

```
https://meetingbaas.com/viewer/{BOT_ID}
```

Features include:
- Full video playback
- Searchable transcripts
- Speaker identification
- Topic navigation
- Timestamp sharing

### Transcript Access

```bash
curl -X GET https://api.meetingbaas.com/v1/meetings/{BOT_ID}/transcript \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Key Moments Analysis

```bash
curl -X GET https://api.meetingbaas.com/v1/meetings/{BOT_ID}/moments \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Advanced Features

### QR Code Bot Avatars

Create custom QR codes for bot avatars with various styles:
- style_crystal
- style_rounded
- style_dot
- style_corporate

Example:
```bash
curl -X POST https://api.meetingbaas.com/v1/qr \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "data": "contact@company.com",
    "style": "style_crystal",
    "prompt": "Professional blue corporate design"
  }'
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 7017 |
| API_BASE_URL | Meeting BaaS API URL | https://api.meetingbaas.com/v1 |
| DEFAULT_API_KEY | Default API key for testing | null |

### Security Notes

- All meeting recordings are automatically shared within your organization's email domain
- API keys should be kept secure and never exposed in client-side code
- OAuth credentials should be stored securely and never committed to version control
- Regular credential rotation is recommended

## Best Practices

1. **Recording Management**
   - Use descriptive bot names for easy identification
   - Set appropriate entry messages to inform participants
   - Regular cleanup of unused recordings

2. **Calendar Integration**
   - Maintain separate OAuth credentials for different environments
   - Regularly verify calendar sync status
   - Use specific calendar IDs instead of 'primary' when possible

3. **Meeting Analysis**
   - Tag important moments during meetings
   - Use timestamp sharing for specific references
   - Export transcripts for important meetings

## Troubleshooting

Common issues and solutions:

1. **Calendar Sync Issues**
   - Verify OAuth credentials
   - Check calendar permissions
   - Force resync using the API

2. **Recording Failures**
   - Verify meeting URL format
   - Check bot permissions
   - Ensure stable internet connection

3. **Access Problems**
   - Confirm API key validity
   - Verify email domain matches
   - Check organization permissions


---

## Claude Desktop Integration

Configure and integrate Claude Desktop with Meeting BaaS MCP servers for AI-powered meeting assistance and automation

### Source: ./content/docs/mcp-servers/integrations/claude-desktop-integration.mdx


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

## calender-tools

### Source: ./content/docs/mcp-servers/tools/calender-tools.mdx

# Calendar Tools

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

## link-sharing-tools

### Source: ./content/docs/mcp-servers/tools/link-sharing-tools.mdx

# Link Sharing Tools

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

## meeting-tools

### Source: ./content/docs/mcp-servers/tools/meeting-tools.mdx

# Meeting Tools

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

## qr-code-tools

### Source: ./content/docs/mcp-servers/tools/qr-code-tools.mdx

# QR Code Tools

## generateQRCode

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

## transcript-tools

### Source: ./content/docs/mcp-servers/tools/transcript-tools.mdx

# Transcript Tools

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

