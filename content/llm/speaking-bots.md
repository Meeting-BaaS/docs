# Speaking Bots, the Pipecat-powered bots

Documentation for Speaking Bots powered by Pipecat.

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

## Environment Variables

Configure environment variables for Speaking Bots

### Source: ./content/docs/speaking-bots/getting-started/environment-variables.mdx


Speaking Bots requires several API keys and configuration values to function properly. Here's a quick setup guide:

1. Copy the example environment file:

```bash
cp env.example .env
```

{" "}

<Callout type="warn">
  Never commit your `.env` file to version control. It contains sensitive API
  keys that should be kept private.
</Callout>

2. Add your credentials to `.env`: You'll need one key per pipeline stage (MeetingBaas, LLM, Speech-to-Text, and Text-to-Speech). Additional keys enable optional features.

<Callout type="info">
  Callers can also bring their own keys per bot through the `credentials` field
  of `POST /bots` (`llm_api_key`, `stt_api_key`, `tts_api_key`). Any key left
  out falls back to the server's own configuration.
</Callout>

## Core Bot Functionality (Required)

<Steps>
<Step>
### MeetingBaas Configuration

Required for sending meeting bots to Google Meet, Microsoft Teams and Zoom:

```txt
MEETING_BAAS_API_KEY=your_meetingbaas_api_key_here
```

Get your API key by:

1. Signing up for [MeetingBaas](https://meetingbaas.com)
2. Accessing your API key from the MeetingBaas dashboard

To point the API at a self-hosted MeetingBaas deployment:

```txt
MEETING_BAAS_API_URL=https://your-meetingbaas-deployment.com
```

</Step>

<Step>
### LLM Configuration

Powers in-meeting AI interactions and persona management. `LLM_PROVIDER`
selects the provider (default `openai`; also `anthropic` and `zai`):

```txt
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

Optional provider tuning (see `env.example` for the full list):

```txt
# OpenAI
OPENAI_MODEL=gpt-5.4-mini
OPENAI_API_SURFACE=responses

# Anthropic (native Pipecat Claude bridge)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-haiku-4-5

# Z.ai GLM (OpenAI-compatible bridge)
ZAI_API_KEY=your_zai_api_key_here
ZAI_MODEL=glm-5.2
ZAI_BASE_URL=https://api.z.ai/api/paas/v4/
```

<Callout>
  `OPENAI_API_KEY` is also used for persona creation functionality.
</Callout>
</Step>

<Step>
### Speech-to-Text Configuration

Deepgram powers the bot's in-meeting listening:

```txt
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

The STT language comes from the persona's `language_code` (default `en-US`).

</Step>

<Step>
### Text-to-Speech Configuration

Required for voice synthesis and persona voices:

```txt
CARTESIA_API_KEY=your_cartesia_api_key_here
CARTESIA_VOICE_ID="79a125e8-cd45-4c13-8a67-188112f4dd22"
```

Voices are picked per persona via its `cartesia_voice_id`; this value is the
fallback. Optional default speaking speed (a request can override it per bot
with `speech_speed`):

```txt
CARTESIA_TTS_SPEED=1.2
```

</Step>
</Steps>

## Server Configuration

```txt
PORT=7014                  # API server port
BASE_URL=your_base_url     # Public base URL for the bot's WebSocket endpoints
WEBHOOK_SECRET=...         # Optional: require x-mb-secret on /webhook callbacks
```

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

```txt
REPLICATE_KEY=your_replicate_key_here
STABILITY_AI_API_KEY=your_stability_ai_key_here
UTFS_KEY=your_utfs_key_here
APP_ID=your_app_id_here
```

### Prompt Data Sources Limits

Bounds for `prompt_data_sources` URL fetching:

```txt
PROMPT_DATA_SOURCE_MAX_BYTES=1000000   # Max bytes fetched per URL
PROMPT_DATA_ALLOW_PRIVATE_URLS=false   # Only in trusted networks
```

### MCP & Turn-Taking

MCP connection details are supplied per `POST /bots` request (`mcp.servers`).
Optional server-side overrides:

```txt
MCP_ALLOW_PRIVATE_URLS=false
MCP_PROXY_ALL_URL=http://127.0.0.1:8109/mcp
MCP_PROXY_PERSONAL_URL=http://127.0.0.1:8110/mcp
MCP_PROXY_PROFESSIONAL_URL=http://127.0.0.1:8111/mcp
```

Bot turn-taking defaults (a request's `turn_config` overrides them per bot):

```txt
VAD_CONFIDENCE=0.5
VAD_START_SECS=0.25
VAD_STOP_SECS=0.8
VAD_MIN_VOLUME=0.6
```


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
  bot:
    proto: http
    addr: 7014
```

For more detailed information about ngrok configuration options, see the [official ngrok configuration documentation](https://ngrok.com/docs/agent/config/).

## Usage

This tunnel forwards public WebSocket connections to the API server, and is used by your bots to establish WebSocket connections with the meeting platforms. To start it, run:

```bash
ngrok start --all --config config/ngrok/config.yml
```

At startup, the API discovers active tunnels through the ngrok API (`localhost:4040`) and prefers tunnels pointing at the configured `PORT` (default `7014`). A single tunnel serves any number of bots — each bot's WebSocket path includes its own client id.

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
poetry run python app/main.py --local-dev
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
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` or `ZAI_API_KEY`: For the conversation LLM (`LLM_PROVIDER` selects which, default `openai`)
- `CARTESIA_API_KEY`: For text-to-speech
- `DEEPGRAM_API_KEY`: For speech-to-text

For production, also set:

```
BASE_URL=https://your-server-domain.com
```

See our full [Environment Variables Guide](/docs/speaking-bots/getting-started/environment-variables) for more details.

### 5. Run the API Server

The project now follows an API-first approach. There are two ways to run the server:

```bash
# Standard mode
poetry run uvicorn app:app --reload --host 0.0.0.0 --port 7014

# Local development mode with ngrok auto-configuration
poetry run python app/main.py --local-dev
```

Once the server is running, you can access:

- Interactive API docs: `http://localhost:7014/docs`
- OpenAPI specification: `http://localhost:7014/openapi.json`

To create a bot via the API:

```bash
curl -X POST http://localhost:7014/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: your-api-key" \
  -d '{
    "meeting_url": "https://meet.google.com/xxx-yyyy-zzz",
    "personas": ["interviewer"]
  }'
```


---

## Introduction

Deploy AI-powered speaking agents in video meetings

### Source: ./content/docs/speaking-bots/index.mdx


<Callout type="info">
  We provide optimized documentation for both LLMs and recent MCP server updates. For more on our LLM integration, 
  see [LLMs](/llms/speaking-bots) and for MCP access, visit [auth.meetingbaas.com](https://auth.meetingbaas.com/home).
</Callout>

This small open-source API demonstrates the capabilities of [MeetingBaas](https://meetingbaas.com) 🐟's video meeting APIs by integrating with [Pipecat](https://github.com/pipecat-ai/pipecat)'s Python framework for building voice and multimodal conversational agents:

```bash
curl -X POST https://speaking.meetingbaas.com/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: your-api-key" \
  -d '{
    "meeting_url": "https://us06web.zoom.us/j/123456789?pwd=example",
    "personas": ["baas_onboarder"]
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

- WebSocket infrastructure for bidirectional audio streaming between the bot and your voice pipeline (the bot streams at 16 kHz internally; the underlying MeetingBaas v2 API supports 16–48 kHz samples rates)
- Persona system with custom voice selection, language preferences, and contextual knowledge
- Per-bot LLM provider and model selection (OpenAI, Anthropic or Z.ai)
- Bring-your-own provider keys per bot (LLM, speech-to-text, text-to-speech)
- Prompt data sources: inline text or fetched URLs, loaded under a token budget
- MCP servers and trusted proxy profiles for tool access
- Voice Activity Detection with configurable parameters for natural conversation (per-bot turn-taking tuning)
- TTS speaking speed control
- Function calling tools (weather, time, etc.) that can be enabled or disabled
- Post-call transcription with the bot's own turns attributed to it by name

The join route supports options like custom bot names, avatar images, entry messages, ad-hoc prompts and specialized persona selection.

The API and implementation are open source. We welcome contributions and pull requests from the community. See our [getting started guide](/docs/speaking-bots/getting-started/set-up) for local development setup.

## Directory Structure

<Files>
  <Folder name="app" description="FastAPI server">
    <File name="main.py" description="Server startup and middleware" />
    <File name="routes.py" description="/bots, /personas and /webhook routes" />
    <File name="models.py" description="Request and response models" />
    <Folder name="services" description="Prompt context, MCP presets, persona details, images" />
  </Folder>
  <Folder name="config" description="Configuration and personas">
    <Folder name="personas" description="One folder per persona: README.md plus knowledge .md files">
      <Folder name="baas_onboarder" description="MeetingBaas API presentation persona">
        <File name="README.md" description="Persona definition and behaviour" />
        <File name="Content.md" description="Knowledge and contextual information" />
        <File name="Rules.md" description="Interaction and behavior guidelines" />
      </Folder>
    </Folder>
    <File name="persona_utils.py" description="Persona loading and management" />
    <File name="prompts.py" description="Default prompts and system messages" />
    <File name="voice_utils.py" description="Cartesia voice matching" />
    <File name="create_persona.py" description="Tools for creating new personas" />
  </Folder>
  <Folder name="core" description="Process and connection management">
    <File name="process.py" description="Pipecat child process lifecycle" />
    <File name="connection.py" description="WebSocket connection registry" />
  </Folder>
  <Folder name="meetingbaas_pipecat" description="Bot runtime package" />
  <Folder name="scripts" description="Bot runner and MeetingBaas client">
    <File name="meetingbaas.py" description="Pipecat voice pipeline runner (STT → LLM → TTS)" />
    <File name="meetingbaas_api.py" description="MeetingBaas v2 API client" />
  </Folder>
  <Folder name="utils" description="Floor control, LLM config, MCP client, ngrok, runtime" />
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

### Persona Dictionary

Each persona folder resolves to a dictionary with these keys (built by
`PersonaManager` from the folder's files):

```python
{
    "name": str,                 # From the README.md title
    "prompt": str,               # README.md content minus Metadata/Characteristics/Voice sections
    "image": str,                # Avatar URL from Metadata
    "entry_message": str,        # Spoken when the bot is admitted, from Metadata
    "cartesia_voice_id": str,    # Voice from Metadata
    "gender": str,               # From Metadata
    "relevant_links": [str],     # From Metadata
    "additional_content": str,   # Every other .md file in the folder, concatenated
}
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

## Adding Knowledge to a Persona

A persona's knowledge is whatever Markdown lives next to its `README.md`:

- `README.md` defines the persona: its prose becomes the system prompt, and the
  `## Metadata` block drives the avatar, voice, greeting and gender. The
  `## Characteristics` and `## Voice` sections are display-only and are not
  sent to the LLM.
- Every other `.md` file in the folder (`Content.md`, `Rules.md`, `pricing.md`,
  …) is loaded as additional context, appended to the system prompt under a
  `# Content from <filename>` heading.
- There is no retrieval step: all of it goes into the prompt, so keep the
  files curated and split by topic.
- The STT language comes from `language_code` in the persona (default
  `en-US`).

Personas are loaded once when the API starts — restart the server after
adding or editing persona files.

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

To launch this persona, create a bot through the API:

```bash
curl -X POST http://localhost:7014/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: your-api-key" \
  -d '{
    "meeting_url": "https://meet.google.com/xxx-yyyy-zzz",
    "personas": ["baas_onboarder"]
  }'
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

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots","method":"post"}]} />


---

## Leave Bot

### Source: ./content/docs/speaking-bots/reference/bots/leave_bot_bots__bot_id__delete.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Remove a bot from a meeting by its ID.

This will:
1. Call the MeetingBaas API to make the bot leave
2. Close WebSocket connections if they exist
3. Terminate the associated Pipecat process

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots/{bot_id}","method":"delete"}]} />


---

## Speaking Bots API Reference

API reference documentation for Speaking Bots

### Source: ./content/docs/speaking-bots/reference/index.mdx


# Speaking Bots API Reference

This section contains detailed documentation for the Speaking Bots API, which allows you to programmatically create and manage speaking bots in your meetings.

The Speaking Bots API provides endpoints to:

- Have bots join meetings
- Make bots leave meetings
- Generate persona images for bots

Each endpoint is documented with:

- Endpoint URL and method
- Request parameters and body schema
- Response details
- Example requests and responses

All API requests require a MeetingBaas API key to be passed in the `x-meeting-baas-api-key` header.

Use the navigation to explore the available endpoints.


---

## Generate Persona Image

### Source: ./content/docs/speaking-bots/reference/personas/generate_persona_image_personas_generate_image_post.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Generate an image for a persona using Replicate.

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/personas/generate-image","method":"post"}]} />


---

