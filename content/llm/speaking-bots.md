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

## cURL cookbook

Copy-paste requests for the common things people do with the API

### Source: ./content/docs/speaking-bots/command-line.mdx


Set these once; every example uses them.

```bash
API=https://speaking.meetingbaas.com      # or your own server
KEY=your-meetingbaas-api-key
```

## A bot from a prompt

```bash
curl -s -X POST $API/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: $KEY" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Vibe",
    "prompt": "You are Vibe, an upbeat engineer. Keep turns to 2-3 sentences.",
    "entry_message": "Hey everyone, Vibe here. Let us get into it.",
    "enable_tools": false
  }'
# → 201 {"bot_id":"c804aa7c-cfe3-474c-ac87-a1907fce5db1"}
```

## A bundled persona

```bash
curl -s -X POST $API/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: $KEY" \
  -d '{"meeting_url": "https://meet.google.com/abc-defg-hij", "personas": ["baas_onboarder"]}'
```

## A specific model, faster speech, patient turn-taking

```bash
curl -s -X POST $API/bots -H "Content-Type: application/json" -H "x-meeting-baas-api-key: $KEY" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Analyst",
    "prompt": "You are Analyst. Answer in two sentences.",
    "llm_provider": "openai",
    "llm_model": "gpt-5.4-mini",
    "speech_speed": 1.2,
    "turn_config": {"stop_secs": 1.0}
  }'
```

## With documents and an MCP server

```bash
curl -s -X POST $API/bots -H "Content-Type: application/json" -H "x-meeting-baas-api-key: $KEY" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Support",
    "prompt": "You are Support. Use the account notes and the CRM tools.",
    "prompt_data_sources": [{"name": "Account notes", "type": "url", "url": "https://example.com/acme.md"}],
    "mcp": {"servers": [{"name": "crm", "transport": "streamable_http", "url": "https://mcp.example.com/mcp",
                         "headers": {"Authorization": "Bearer ..."}, "tool_allowlist": ["get_account"]}]}
  }'
```

## On your own provider keys

```bash
curl -s -X POST $API/bots -H "Content-Type: application/json" -H "x-meeting-baas-api-key: $KEY" \
  -d "{
    \"meeting_url\": \"https://meet.google.com/abc-defg-hij\",
    \"prompt\": \"You are a concise meeting assistant.\",
    \"llm_provider\": \"anthropic\",
    \"credentials\": {\"llm_api_key\": \"$ANTHROPIC_API_KEY\", \"stt_api_key\": \"$DEEPGRAM_API_KEY\", \"tts_api_key\": \"$CARTESIA_API_KEY\"}
  }"
```

## Two bots debating

```bash
for who in "Vibe:FOR" "Skeptic:AGAINST"; do
  name=${who%%:*}; side=${who##*:}
  curl -s -X POST $API/bots -H "Content-Type: application/json" -H "x-meeting-baas-api-key: $KEY" \
    -d "{\"meeting_url\": \"https://meet.google.com/abc-defg-hij\", \"bot_name\": \"$name\",
         \"entry_message\": \"$name here.\",
         \"prompt\": \"You are $name. Argue $side shipping on Fridays. 2-3 sentences per turn.\",
         \"turn_config\": {\"stop_secs\": 1.2}}"
done
```

## Status, then remove

```bash
curl -s https://api.meetingbaas.com/v2/bots/<bot_id>/status -H "x-meeting-baas-api-key: $KEY"

curl -s -X DELETE $API/bots/<bot_id> \
  -H "Content-Type: application/json" -H "x-meeting-baas-api-key: $KEY" -d '{}'
```

## Is the server up?

```bash
curl -s $API/health   # {"status":"ok","version":"...",...}
curl -s $API/ready    # adds the public base URL the server resolved
```

Each option is explained in the [guides](/docs/speaking-bots/getting-started/sending-a-bot) and every field in the [reference](/docs/speaking-bots/reference).


---

## Bring your own keys

Run a bot on your own LLM, speech-to-text and text-to-speech accounts

### Source: ./content/docs/speaking-bots/getting-started/bring-your-own-keys.mdx


By default the hosted API runs the model, the live transcription and the voice behind every bot on Meeting BaaS provider accounts, and that provider usage is billed to you alongside the bot's meeting time (see [what provider usage costs](#what-provider-usage-costs)). If you would rather use your own provider accounts — for billing, rate limits, data-processing agreements, or a model the server does not have a key for — pass them per bot in `credentials`. One limit to weigh first, especially for a data-processing agreement: the keys live only in the memory of the running API, so if it restarts while the bot is in a call, the bot is respawned on the server's own keys.

```json
{
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "bot_name": "Analyst",
  "prompt": "...",
  "llm_provider": "anthropic",
  "llm_model": "claude-opus-4-7",
  "credentials": {
    "llm_api_key": "sk-ant-...",
    "stt_api_key": "<Deepgram key>",
    "tts_api_key": "<Cartesia key>"
  }
}
```

| Key | Provider | Used for |
|---|---|---|
| `llm_api_key` | the one in `llm_provider`: OpenAI, Anthropic or Z.ai | the conversation |
| `stt_api_key` | [Deepgram](https://deepgram.com) | hearing the room |
| `tts_api_key` | [Cartesia](https://cartesia.ai) | the bot's voice |

Every key is optional. Whatever you leave out falls back to the server's own key, so you can bring only the LLM key and keep speech on MeetingBaas. A key you supply also satisfies the provider check: `llm_provider: "zai"` works with your Z.ai key even when the server has none.

## What happens to the keys

- They are used only by the pipeline process of that one bot, passed to it through its environment, and discarded when the bot leaves.
- They are never written to disk, never logged, and never returned by any endpoint.
- Validation errors (`422`) do not echo the request body.

## What provider usage costs

A bot on Meeting BaaS keys is billed for what the providers charged: speech-to-text per second of meeting audio, text-to-speech per character spoken, the language model per token. A bot on your own keys is billed only for its meeting time; the providers bill you directly. You can mix: your LLM key with Meeting BaaS speech, for example.

Every bot keeps a usage report, live during the call and final afterwards:

```bash
curl -s https://speaking.meetingbaas.com/bots/<bot_id>/usage \
  -H "x-meeting-baas-api-key: $KEY"
```

```json
{
  "stt_audio_seconds": 1812.4,
  "tts_characters": 6950,
  "llm_turns": 14,
  "llm_prompt_tokens": 61200,
  "llm_cached_prompt_tokens": 48800,
  "llm_completion_tokens": 2100,
  "llm_provider": "openai",
  "llm_model": "gpt-5.4-mini",
  "key_sources": { "llm": "caller", "stt": "platform", "tts": "platform" },
  "duration_seconds": 1830.2
}
```

`key_sources` says, per provider, whether that bot ran on a Meeting BaaS key (`platform`, billed to you) or on one you supplied (`caller`, billed by the provider). The same report is delivered in the `speaking_bot.ended` event when you set a `callback_url`. Current provider rates are on the [pricing page](https://meetingbaas.com/pricing).

## What stays on the server's keys

The MeetingBaas side (joining, recording, the final transcript) always runs on the MeetingBaas account whose key is in `x-meeting-baas-api-key`. Deriving a persona from a `prompt` and generating persona images also use the server's own OpenAI and Replicate accounts.


---

## Callbacks and transcripts

How the API learns the bot is in the call, and where the recording and transcript end up

### Source: ./content/docs/speaking-bots/getting-started/callbacks-and-transcripts.mdx


## The MeetingBaas callback

When the API creates a bot it registers its own `/webhook` as the bot's callback URL. MeetingBaas calls it with the bot's status changes; the API uses two of them:

- **`in_call_recording`**: the bot has been admitted. The pipeline is told it may speak, and the entry message goes out. (The API also polls the bot's status for this, so a lost callback only delays the greeting.)
- **`call_ended`** (and `bot_left`, `meeting_ended`, `complete`): the pipeline stops, the usage report is closed, and a [briefing](/docs/speaking-bots/getting-started/representing-someone#the-briefing) is written for bots that asked for one.

`POST /webhook` is not part of the public API and is not for you to call: it only acts on bot IDs the server launched itself, and a self-hosted server can require a shared secret on it (`WEBHOOK_SECRET`, echoed by MeetingBaas in the `x-mb-secret` header).

## Your own webhooks

Want to be notified yourself? Use the MeetingBaas account-level webhooks: the speaking bot is an ordinary bot on your account, so every event documented under [API v2 webhooks](/docs/api-v2/webhooks) fires for it — `bot.status_change` as it joins and leaves, `bot.completed` with the recording and transcript, `bot.failed`, and so on.

## The bot's own events: `callback_url`

MeetingBaas tells you when the bot joined and left. The speaking API tells you what it did in between. Give it a `callback_url` (and a `callback_secret`) in `POST /bots` and it posts one JSON document per event:

| Event | When | `data` |
|---|---|---|
| `speaking_bot.utterance` | each reply the bot spoke | `text`, `started_at`, `ended_at` |
| `speaking_bot.escalation` | the bot handed a decision back to its owner | `escalation_id`, `question`, `category`, `context` |
| `speaking_bot.owner_message_delivered` | an owner message or escalation answer was relayed | `message_id`, `type`, `escalation_id` |
| `speaking_bot.ended` | the call is over | `status`, `reason`, `usage`, `briefing`, `escalations` |

Every delivery carries the event name in `x-speaking-bot-event` and, when a secret was given, `x-speaking-bot-signature: sha256=<hex>`, the HMAC-SHA256 of the exact request body with `callback_secret`. Verify it before trusting the payload. The envelope has `event`, `event_id`, `bot_id` (the MeetingBaas id), `created_at` and `data`.

Delivery is best effort: a `5xx` or a network error is retried three times over about fifteen seconds, a `4xx` is not, and redirects are never followed (a `3xx` counts as a failed delivery, since following it would resend the signed body elsewhere). The transcript, usage and briefing stay retrievable through the API if your endpoint was down. `callback_url` must be `https://` on a public host: loopback, private and link-local addresses are refused, both as written and after DNS resolution.

## Recording and transcript

The meeting is recorded by MeetingBaas and, by default, transcribed after it ends with the bot's own turns attributed to its `bot_name`. Retrieve them through the MeetingBaas API with the `bot_id` returned by `POST /bots`:

```bash
curl -s https://api.meetingbaas.com/v2/bots/<bot_id> \
  -H "x-meeting-baas-api-key: $KEY"
```

`transcription_enabled: false` skips the transcript; `transcription_provider` picks another MeetingBaas speech-to-text provider (default `gladia`). These control MeetingBaas's transcription of the recording; the live speech-to-text the bot uses to hear the room (Deepgram) is separate and always on.


---

## Context and tools

Give the bot documents to read and MCP servers to act on during the call

### Source: ./content/docs/speaking-bots/getting-started/context-and-tools.mdx


A `prompt` tells the bot who it is. Two more fields tell it what it knows and what it can do.

## Documents and URLs: `prompt_data_sources`

Up to ten sources are loaded when the bot starts and appended to its system prompt as labelled context blocks:

```json
{
  "meeting_url": "...",
  "prompt": "You are Analyst. Answer questions about the account using the notes.",
  "prompt_data_sources": [
    { "name": "Account notes", "type": "url", "url": "https://example.com/acme-notes.md" },
    { "name": "Pricing", "type": "text", "text": "Starter is $49/month, Team is $199/month..." }
  ],
  "prompt_data_token_limit": 6000
}
```

| Field | Notes |
|---|---|
| `name` | Label shown to the model above the block |
| `type` | `text` (inline, in `text`) or `url` (fetched, from `url`) |
| `headers` | Optional request headers for `url` sources, e.g. a bearer token; only over `https://` |
| `token_limit` | Per-source cap, applied before the request-level cap |
| `prompt_data_token_limit` | Total cap across all sources, default `4000`, max `50000`; `0` disables loading |

Sources are fetched once, at bot creation, with a 1 MB limit per URL. URLs on private networks or localhost are refused on the hosted API. A source that cannot be used fails the request instead of producing a bot that silently knows nothing: `400` for a bad source (refused host, too large, bad type), `502` when the URL could not be fetched.

Keep the budget in mind: everything you attach is sent to the model on every turn. A few thousand tokens of focused notes work better than a whole document.

## Tools: `mcp`

The bot can call tools on your [Model Context Protocol](https://modelcontextprotocol.io) servers mid-conversation — look up a customer, check a calendar, create a ticket — and speak the result.

```json
{
  "meeting_url": "...",
  "prompt": "You are the support bot. Use the CRM tools to answer account questions.",
  "mcp": {
    "instructions": "Only read data. Never modify an account during the call.",
    "servers": [
      {
        "name": "crm",
        "transport": "streamable_http",
        "url": "https://mcp.example.com/mcp",
        "headers": { "Authorization": "Bearer ..." },
        "tool_allowlist": ["get_account", "list_recent_calls"],
        "timeout_seconds": 20,
        "instructions": "Accounts are keyed by company name."
      }
    ]
  }
}
```

| Field | Notes |
|---|---|
| `transport` | `http`, `streamable_http` or `sse`. Omit it for a metadata-only server: the bot is told about the tools but cannot call them |
| `url`, `headers` | Where to connect and how to authenticate. Headers only over `https://` (or a private URL on a self-hosted server) |
| `tool_allowlist` | The only tools the bot may call from this server; everything else the server exposes is hidden |
| `tools` | Tool names to mention to the model when the server is metadata-only |
| `timeout_seconds` | Per-server connection and tool-call timeout (`0.1`–`300`) |
| `instructions` | Per-server guidance; `mcp.instructions` applies to all servers |
| `enabled` | `false` documents a server without connecting it |

Up to ten servers per bot. Tool calls run one at a time while the bot holds the floor, so keep tools fast; anything over a few seconds is dead air in the call. Headers you pass are kept in memory for the bot's lifetime and never written to disk or returned.

Stdio MCP servers are not available through the API. The `mcp_profile` presets (`professional`, `personal`, `all`) connect to a local mcpproxy and only make sense on a [self-hosted server](/docs/speaking-bots/self-hosting) that runs one; on the hosted API they fail to connect.


---

## Conversation tuning

Choose the model, the voice, the language, when the bot replies and how eagerly it takes its turn

### Source: ./content/docs/speaking-bots/getting-started/conversation-tuning.mdx


Every knob below is optional and per bot; leave it out and the server default applies.

## The model

```json
{
  "meeting_url": "...",
  "prompt": "...",
  "llm_provider": "anthropic",
  "llm_model": "claude-opus-4-7"
}
```

| Field | Values | Default |
|---|---|---|
| `llm_provider` | `openai`, `anthropic`, `zai` | the server's `LLM_PROVIDER` (Anthropic on the hosted API) |
| `llm_model` | any model name the provider accepts | the server's model for that provider (`claude-haiku-4-5` on the hosted API) |

The provider must have a key: the server's own, or one you pass in [`credentials`](/docs/speaking-bots/getting-started/bring-your-own-keys). Asking for a provider the server has no key for returns a `400` that names the missing one.

The defaults are the fast models on purpose: a spoken reply of a sentence or two gains little from a frontier model and waits seconds longer for it. Reasoning is turned off in whatever way the chosen model accepts, so picking a bigger `llm_model` costs latency but never a failed turn; on models whose reasoning is always on (Claude Fable, Opus 5.5 and newer) the bot runs at the lowest effort instead.

## Speech

Text-to-speech is Cartesia; the voice comes from the persona (`cartesia_voice_id` in its metadata) or the server default. `speech_speed` is a multiplier between `0.6` and `1.5`:

```json
{ "speech_speed": 1.15 }
```

A `prompt` bot that should sound brisk benefits from both a higher `speech_speed` and an instruction like "answer in two sentences" — the LLM decides how much is said, the speed only how fast.

Two more knobs shape the voice itself:

| Field | Values | Default |
|---|---|---|
| `speech_volume` | loudness multiplier between `0.5` and `2.0` | the provider default |
| `speech_emotion` | a Cartesia sonic-3 emotion tag such as `excited` or `calm` (experimental) | none: the model infers the tone from the text, which Cartesia recommends |

## Language

`language` is the language the bot listens for, as a BCP-47 tag (`en`, `en-NG`, `fr`), or `multi` to let the speech-to-text switch between its multilingual set during the call. It defaults to US English. What the bot says follows the prompt and the voice, so a French-speaking bot needs a French prompt as well.

## When the bot replies

`respond_mode` decides which turns the bot answers:

- `always` (default): every completed turn gets a reply. The right mode for a 1:1 call.
- `mentioned`: the bot stays quiet until someone says its name, then listens for a short window and answers. The mode for multi-party meetings; it still hears the whole conversation, so when addressed it knows what was said before.

Speech-to-text rarely writes an unusual name the way you spell it. `wake_phrases` lists the other ways the name may be heard — spellings, nicknames, how the transcript tends to render it — and each is also boosted in the recogniser. Up to 10 phrases of at most 40 characters:

```json
{
  "bot_name": "Baas",
  "respond_mode": "mentioned",
  "wake_phrases": ["Bass", "Bess", "Boss"]
}
```

The name itself and its split and joined variants are always accepted, so short, common names need no `wake_phrases` at all.

## Turn-taking

The bot decides that someone has finished talking with voice-activity detection. `turn_config` tunes it:

```json
{
  "turn_config": {
    "confidence": 0.5,
    "start_secs": 0.25,
    "stop_secs": 0.8,
    "min_volume": 0.6
  }
}
```

| Field | What it does | Default |
|---|---|---|
| `confidence` | How sure the detector must be that it hears speech (0–1) | `0.5` |
| `start_secs` | Sustained speech before a turn registers | `0.25` |
| `stop_secs` | Silence before the bot considers the speaker done and replies | `0.8` |
| `min_volume` | Minimum input level counted as speech (0–1) | `0.6` |

Two patterns cover most needs:

- **Humans talking to a bot**: keep the defaults, or lower `stop_secs` to `0.5` for snappier replies.
- **Bots talking to bots**: raise `stop_secs` to `1.2`–`1.5` and `start_secs` to `0.4` so they stop barging in on each other, and read [Multiple bots](/docs/speaking-bots/getting-started/multiple-bots).

## Re-engagement when the room is quiet

Once admitted, a bot that hears no new conversation for 15 seconds says something on its own, at most three times, then waits. This is what lets two reactive bots start a conversation without a human, and it stops a bot alone in a room from monologuing. On a self-hosted server the timing is `BOT_IDLE_REENGAGE_SECS` and the cap `BOT_MAX_REENGAGE`.

## Built-in tools

`enable_tools` (default `true`) gives the LLM two small functions, current weather and current time, plus the ability to save a short call summary. Set it to `false` for a pure conversation; it has no effect on [MCP tools](/docs/speaking-bots/getting-started/context-and-tools), which are configured separately.


---

## Multiple bots in one call

Panels, debates and interviews with several bots that take turns

### Source: ./content/docs/speaking-bots/getting-started/multiple-bots.mdx


Several bots can share a meeting: send `POST /bots` once per bot with the same `meeting_url`. Each gets its own pipeline; what makes it work is that they take turns.

## Floor control

Bots launched by the same server coordinate through a per-meeting floor: while one of them is speaking, its siblings hold their replies. A bot gives up the floor when it finishes its sentence, and a 20-second backstop cuts off any bot that holds it longer, so a long-winded persona cannot block the others forever.

Floor control keys off the display name MeetingBaas reports for each participant, which gives you the one hard rule:

<Callout type="warn">
  **Give every bot a distinct `bot_name`.** Two bots with the same name are not gated against each other and will talk over one another.
</Callout>

## Making a conversation start

Two reactive bots can both wait for someone else to speak first. Two things prevent the deadlock:

- Give exactly **one** bot an `entry_message` (the opener). Bundled personas without a persona entry message stay silent; a `prompt` bot always greets, so for prompt-based siblings set the opener's `entry_message` and give the others a very short one (or accept that each says hello once).
- The [re-engagement nudge](/docs/speaking-bots/getting-started/conversation-tuning#re-engagement-when-the-room-is-quiet) does the rest: a bot that hears nothing for 15 seconds says something, the sibling hears it through speech-to-text and answers.

## Keeping turns short

With bots talking to bots, patience in turn-taking matters more than speed. Put the length in the prompt ("2–3 sentences per turn") and raise `turn_config.stop_secs` so a bot does not jump in during a sibling's pause:

```bash
# Opener
curl -s -X POST $API/bots -H "Content-Type: application/json" -H "x-meeting-baas-api-key: $KEY" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Vibe",
    "entry_message": "Let us debate: should every team ship on Fridays?",
    "prompt": "You are Vibe. Argue FOR shipping on Fridays. 2-3 sentences per turn.",
    "turn_config": {"stop_secs": 1.2, "start_secs": 0.4}
  }'

# Reactive sibling
curl -s -X POST $API/bots -H "Content-Type: application/json" -H "x-meeting-baas-api-key: $KEY" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Skeptic",
    "entry_message": "Skeptic here.",
    "prompt": "You are Skeptic. Argue AGAINST shipping on Fridays. 2-3 sentences per turn.",
    "turn_config": {"stop_secs": 1.2, "start_secs": 0.4}
  }'
```

Each bot is its own MeetingBaas bot, so each counts against your recording time and the meeting is recorded once per bot. Remove each with its own `DELETE /bots/{bot_id}`.


---

## Representing someone

Send the bot to a meeting on a person's behalf, with limits on what it may say, escalation back to them and a briefing afterwards

### Source: ./content/docs/speaking-bots/getting-started/representing-someone.mdx


A persona tells the bot who it is. `authority` tells it whose place it is taking. With it, the bot introduces itself as an AI representative, states only the positions its owner approved, hands every real decision back to the owner instead of guessing, and writes a briefing when the meeting ends.

```json
{
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "bot_name": "RepMe",
  "prompt": "You attend team meetings for Ada Okafor when she cannot.",
  "respond_mode": "mentioned",
  "language": "en",
  "authority": {
    "owner_name": "Ada Okafor",
    "approved_positions": ["Ada supports option B for the vendor choice"],
    "escalate_on": ["any spending above 500 dollars"],
    "forbidden": ["agreeing to new deadlines"]
  },
  "briefing": { "language": "en" },
  "callback_url": "https://app.example.com/hooks/speaking-bot",
  "callback_secret": "a shared secret"
}
```

## What `authority` changes

| Field | Effect |
|---|---|
| `owner_name` | Who the bot represents. It says so when asked, and never pretends to be a human attendee. |
| `approved_positions` | The only positions it will state, in these words. Without any, it captures the discussion and brings questions back. |
| `escalate_on` | Decisions it must hand back. Spending, commitments and deadline changes are escalated even when not listed. |
| `forbidden` | Things it will not say or do, even if asked directly. |

The block is appended last to the system prompt, so it wins over the persona and the voice guidance. The bot also stops speaking unprompted: a representative does not fill silences. Pair it with `respond_mode: "mentioned"` for meetings where it should only answer when addressed.

## Escalations

When a participant asks for something outside the bot's authority, it calls its `escalate_to_owner` tool. That records the question, posts a `speaking_bot.escalation` event to your `callback_url`, and the bot tells the room it has asked the owner and will relay the answer. It does not decide, and it does not wait silently.

```bash
# What has been escalated so far
curl -s https://speaking.meetingbaas.com/bots/<bot_id>/escalations \
  -H "x-meeting-baas-api-key: $KEY"

# The owner's answer; the bot relays it to the meeting
curl -s -X POST https://speaking.meetingbaas.com/bots/<bot_id>/escalations/<escalation_id>/response \
  -H "x-meeting-baas-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{ "response": "No, hold at 500.", "decision": "declined" }'
```

`decision` is optional: `approved`, `declined`, `deferred` or `info`. An escalation nobody answers stays open and is reported as unresolved in the briefing. The bot never treats silence as approval.

## Messages from the owner

Anything the owner wants said mid-meeting goes through the same channel:

```bash
curl -s -X POST https://speaking.meetingbaas.com/bots/<bot_id>/messages \
  -H "x-meeting-baas-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{ "text": "I will join at half past. Go ahead with option B." }'
```

The bot relays it in its own words within a second or two, and a `speaking_bot.owner_message_delivered` event confirms it did. The relayed text appears in the transcript as the bot's turn.

## The briefing

With `briefing` set (an empty object is enough), the API runs one LLM call when the meeting ends, on the same provider and key the bot spoke with, and writes:

| Key | Contents |
|---|---|
| `summary` | A few sentences on what was covered and concluded |
| `decisions` | Decisions actually taken |
| `actions` | `{ owner, task, due }` items |
| `unresolved` | Open questions and items waiting on the owner |
| `what_the_representative_said` | The positions and statements the bot made |
| `escalations` | What was escalated, with status and answer |
| `coverage_notes` | Caveats: parts missed, unclear audio, a late join |

```bash
curl -s https://speaking.meetingbaas.com/bots/<bot_id>/briefing \
  -H "x-meeting-baas-api-key: $KEY"
```

`briefing.language` picks the language it is written in (a BCP-47 tag, default English) and `briefing.instructions` what to focus on. Bots that do not set `briefing` get none: it is an LLM call on a key, and only a bot that asked for it pays for it. The same object arrives in the `speaking_bot.ended` event.

Every per-bot route above answers only to the API key that created the bot; any other key gets a 404.

## Language

`language` sets the language the bot listens for, as a BCP-47 tag (`en`, `en-NG`, `fr`) or `multi` to let the speech-to-text switch between its multilingual set during the call. It defaults to US English. The language the bot speaks follows the prompt and the voice.

## Events and usage

Everything the bot says, escalates and consumes is reported to you. See [Callbacks and transcripts](/docs/speaking-bots/getting-started/callbacks-and-transcripts) for the `callback_url` events and [Bring your own keys](/docs/speaking-bots/getting-started/bring-your-own-keys) for the usage report and how provider usage is billed.


---

## Sending a bot

The request that puts a speaking bot in a meeting, and what happens next

### Source: ./content/docs/speaking-bots/getting-started/sending-a-bot.mdx


Everything starts with [`POST /bots`](/docs/speaking-bots/reference/bots/join_meeting_bots_post). The only required field is `meeting_url`; the rest shapes who the bot is and how it behaves.

```bash
API=https://speaking.meetingbaas.com
KEY=your-meetingbaas-api-key

curl -s -X POST $API/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: $KEY" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Vibe",
    "prompt": "You are Vibe, an upbeat engineer. Keep turns to 2-3 sentences.",
    "entry_message": "Hey everyone, Vibe here. Can you hear me?",
    "enable_tools": false
  }'
# → 201 {"bot_id":"c804aa7c-cfe3-474c-ac87-a1907fce5db1"}
```

The call returns as soon as MeetingBaas has accepted the bot. The `bot_id` is a regular MeetingBaas bot ID: use it with the [MeetingBaas API](/docs/api-v2) for status, recording and transcript, and with `DELETE /bots/{bot_id}` here to remove the bot.

<Callout type="warn">
  The body is a strict schema: a field the API does not know is rejected with a `422`. The error names the field but never echoes your input.
</Callout>

## Who the bot is

There are two ways to give the bot a personality, and they are resolved in this order:

<Steps>
<Step>
### `prompt` — a one-off persona

A system prompt written in the request. The API derives a short description from it and the bot speaks as that character for this call only. Best for bots you define programmatically.

```json
{ "meeting_url": "...", "bot_name": "Analyst", "prompt": "You are Analyst, a calm financial analyst. Answer questions about the Q3 numbers in two sentences." }
```

The prompt is spoken, so write it for speech: no markdown, no code, short turns.
</Step>

<Step>
### `personas` — a bundled persona

A list of persona keys from the [persona library](/docs/speaking-bots/personas); the first one available is used. A persona brings its own prompt, extra knowledge files, Cartesia voice, avatar image and default entry message.

```json
{ "meeting_url": "...", "personas": ["baas_onboarder"] }
```

If `bot_name` matches a persona key and `personas` is empty, that persona is used. With no `prompt`, no `personas` and no matching `bot_name`, a persona is picked at random from the library — set one of the three to keep control.
</Step>
</Steps>

`bot_name` is the display name in the call and the name MeetingBaas attributes the bot's own turns to in the transcript. It defaults to the persona's name. Keep it distinct per bot when you run [several bots in one call](/docs/speaking-bots/getting-started/multiple-bots). `bot_image` sets the avatar URL; personas carry their own.

## The entry message

`entry_message` is spoken verbatim the moment the bot is admitted into the call. It is resolved as:

1. `entry_message` from the request, if set
2. otherwise the persona's own entry message (bundled personas usually have one)
3. otherwise, for a `prompt` bot, a short default greeting ("Hello, I'm Analyst, ready to assist you throughout this session.")

A bundled persona with no entry message stays silent until someone speaks to it. A `prompt` bot always greets, so set `entry_message` when you want control over the first words.

## Lifecycle

1. **Created**: `201` returned, bot queued on MeetingBaas.
2. **In the lobby**: the bot asks to be let in. The API polls the bot's status for up to 15 minutes; if nobody admits it, it never speaks.
3. **Admitted**: `in_call_recording` on the MeetingBaas side. The pipeline starts speaking: entry message first, then it listens and replies.
4. **Quiet room**: if nobody has said anything for 15 seconds after admission, the bot says something on its own, up to three times, so a conversation can start even when every participant is waiting for someone else.
5. **Ends**: on `DELETE /bots/{bot_id}`, when the host removes it, or when the meeting ends. MeetingBaas then transcribes the recording (see [Callbacks and transcripts](/docs/speaking-bots/getting-started/callbacks-and-transcripts)).

Status along the way comes from MeetingBaas, not from this API:

```bash
curl -s https://api.meetingbaas.com/v2/bots/<bot_id>/status \
  -H "x-meeting-baas-api-key: $KEY"
# data.status: queued → joining_call → in_waiting_room → in_call_recording → …
```

## Removing the bot

```bash
curl -s -X DELETE $API/bots/<bot_id> \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: $KEY" -d '{}'
# → 200 {"message":"Bot removal request processed","status":"success","bot_id":"<bot_id>"}
```

The bot leaves the call, its audio channel is closed and its pipeline is stopped. `status` is `partial` when MeetingBaas confirmed the leave but the pipeline was already gone.

## Transcription of the recording

By default the meeting is recorded and transcribed by MeetingBaas once it ends (`transcription_enabled: true`, provider `gladia`), with the bot's own turns attributed to its `bot_name`. Set `transcription_enabled: false` for a recording without a transcript, or `transcription_provider` to another MeetingBaas provider. Retrieve the result with the MeetingBaas API using the `bot_id`.

## Errors you may see

| Status | Meaning |
|---|---|
| `400` | The provider you asked for in `llm_provider` is unknown, or has no key on the server and you supplied none in `credentials` |
| `401` | Missing `x-meeting-baas-api-key` |
| `409`, `401`, … passed through | MeetingBaas rejected the bot creation (duplicate bot for the meeting, bad key, no recording time left); the message is MeetingBaas's |
| `422` | Body validation failed: unknown field, bad URL, out-of-range value |
| `400` / `502` | A `prompt_data_sources` entry was refused or could not be fetched |
| `503` | The server's default provider is not configured — a hosting problem, not yours |

Next: [conversation tuning](/docs/speaking-bots/getting-started/conversation-tuning) — choosing the model and how the bot takes turns.


---

## Introduction

AI agents that join your meetings and talk

### Source: ./content/docs/speaking-bots/index.mdx


<Callout type="info">
  We provide optimized documentation for both LLMs and recent MCP server updates. For more on our LLM integration,
  see [LLMs](/llms/speaking-bots) and for MCP access, visit [auth.meetingbaas.com](https://auth.meetingbaas.com/home).
</Callout>

Speaking Bots is a hosted API that sends an AI participant into a Google Meet, Zoom or Microsoft Teams call. The bot joins through [MeetingBaas](https://meetingbaas.com) 🐟 like any recording bot, but it also listens, thinks and talks back, with a voice pipeline built on [Pipecat](https://github.com/pipecat-ai/pipecat). One request is enough:

```bash
curl -X POST https://speaking.meetingbaas.com/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: your-api-key" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Vibe",
    "prompt": "You are Vibe, an upbeat engineer. Keep turns to 2-3 sentences.",
    "entry_message": "Hey everyone, Vibe here. Let us get into it."
  }'
```

The bot joins the lobby, waits to be admitted, speaks its entry message, and then holds a conversation with whoever is in the call until you remove it or the meeting ends. The meeting is recorded and transcribed on your MeetingBaas account like any other bot.

## Endpoint

The hosted API is at `https://speaking.meetingbaas.com` and creates bots on `api.meetingbaas.com`. The live OpenAPI document is at [`/openapi.json`](https://speaking.meetingbaas.com/openapi.json) and there is a Swagger UI at [`/docs`](https://speaking.meetingbaas.com/docs).

## Authentication

Every request carries your MeetingBaas API key in the `x-meeting-baas-api-key` header. The bot is created on that account, so it appears in your dashboard, consumes your recording time, and its recording and transcript are retrieved through the regular [MeetingBaas API](/docs/api-v2) under the `bot_id` you get back.

The speech and language providers behind the bot (LLM, speech-to-text, text-to-speech) run on MeetingBaas accounts by default. You can [bring your own keys](/docs/speaking-bots/getting-started/bring-your-own-keys) per bot instead.

## What a bot can do

- Speak as a reusable **persona** from the bundled library, or as a one-off **prompt** you write in the request
- Use **OpenAI, Anthropic or Z.ai** as its brain, with the model chosen per bot
- Read **documents and URLs** you attach to the request, and call tools on your **MCP servers** during the call
- Take turns politely: configurable voice-activity detection, a re-engagement nudge when the room goes quiet, and **floor control** so several bots in one call do not talk over each other
- Speak faster or slower, with a Cartesia voice picked per persona
- Leave on request, and have the meeting **transcribed** by MeetingBaas with its own turns attributed to it by name

## How it works

<ImageZoom
  src={'/assets/speaking-bots/how-it-works.png'}
  alt="One request creates a MeetingBaas bot; meeting audio streams both ways between MeetingBaas and the Speaking Bots API's voice pipeline over a WebSocket"
  width={2800}
  height={1260}
  className="rounded-lg border"
/>

The API starts one voice pipeline per bot (speech-to-text → LLM → text-to-speech). Meeting audio streams both ways between MeetingBaas and that pipeline over a WebSocket on the API's own hostname, so the public hostname is part of the contract — which matters when you [self-host](/docs/speaking-bots/self-hosting).

## Where to go next

- [Sending a bot](/docs/speaking-bots/getting-started/sending-a-bot): the request, personas vs prompts, the bot's lifecycle
- [Conversation tuning](/docs/speaking-bots/getting-started/conversation-tuning): model, voice speed, turn-taking
- [Context and tools](/docs/speaking-bots/getting-started/context-and-tools): documents, URLs and MCP servers
- [API reference](/docs/speaking-bots/reference): every field, generated from the live schema
- [Self-hosting](/docs/speaking-bots/self-hosting): run the open-source server yourself

The server is open source: [Meeting-Baas/speaking-meeting-bot](https://github.com/Meeting-Baas/speaking-meeting-bot). Contributions and pull requests are welcome.


---

## Personas

Reusable characters with their own prompt, knowledge, voice and avatar

### Source: ./content/docs/speaking-bots/personas.mdx


A persona is a folder of Markdown under `config/personas/`. The hosted API ships about seventy of them — `baas_onboarder`, `interviewer`, `pair_programmer`, `level10_meeting_facilitator`, `debate_champion`, a `stoic_philosopher`, a `pirate_queen` and so on — and a self-hosted server can add its own. Ask for one by its folder name:

```json
{ "meeting_url": "...", "personas": ["interviewer"] }
```

`personas` is a list: the first one that exists is used. If `personas` is empty and `bot_name` matches a folder name, that persona is used. With neither, and no `prompt`, one is picked at random.

A `prompt` in the request replaces the persona entirely — see [Sending a bot](/docs/speaking-bots/getting-started/sending-a-bot#who-the-bot-is) for the precedence.

## Anatomy of a persona

```
config/personas/baas_onboarder/
├── README.md          # the persona: prompt, characteristics, voice, metadata
├── Content.md         # extra knowledge, appended to the prompt
├── Rules.md           # more of the same
└── pricing.md         # any .md file in the folder is loaded
```

`README.md` is the only required file. Its structure is parsed:

```md
# BaaS onboarder

You are here to present the Meeting Baas API. ... (the first paragraph is the prompt)

## Characteristics
- Gen-Z speech patterns
- Tech-savvy and modern

## Voice
BaaS onboarder speaks with:
- modern internet slang

## Metadata
- image: https://utfs.io/f/....png
- entry_message: Hey, I'm here to help you onboard yourself on the BaaS API.
- cartesia_voice_id: 156fb8d2-335b-4950-9cb3-a2d33befec77
- gender: FEMALE
- relevant_links:
```

| Part | Used for |
|---|---|
| Title (`# ...`) | Display name, and the default `bot_name` |
| First paragraph | The system prompt |
| Other sections | Appended to the prompt, except `Characteristics`, `Voice` and `Metadata`, which are parsed |
| `image` | Default avatar (`bot_image` in the request overrides it) |
| `entry_message` | Spoken when admitted, unless the request sets its own |
| `cartesia_voice_id` | The bot's voice; omit it for the server default |
| `language_code` | The language the bot listens for (Deepgram speech-to-text); default `en-US` |
| Every other `*.md` in the folder | Loaded as additional context, each under a "Content from &lt;file&gt;" heading |

There is no retrieval step: every file goes into the prompt on every turn, so keep the knowledge curated and split by topic rather than dumping a manual in.

Write for speech: short sentences, no markdown or code in the prompt, and tell the persona to be concise — everything the model produces is spoken aloud.

## Creating a persona

On a self-hosted server, add a folder with a `README.md` in that shape and restart; it is available by folder name immediately. There is also an interactive CLI that writes the folder for you, matches a Cartesia voice to the description with OpenAI, and generates an avatar with Replicate:

```bash
poetry run python config/create_persona.py tech_expert \
  --name "Tech Expert" \
  --prompt "You are a patient senior engineer who explains systems clearly." \
  --entry-message "Hi, Tech Expert here. What are we looking at?"
```

Add `--blank` for a minimal folder without image generation, or `--non-interactive` to skip the prompts. Image generation needs `REPLICATE_KEY`, `UTFS_KEY` and `APP_ID` ([environment variables](/docs/speaking-bots/self-hosting/environment-variables#persona-creation-optional)); the same generator is exposed on the API as [`POST /personas/generate-image`](/docs/speaking-bots/reference/personas/generate_persona_image_personas_generate_image_post).

The persona library is part of the open-source repository; a pull request is the way to get a new one onto the hosted API.


---

## Answer Escalation

### Source: ./content/docs/speaking-bots/reference/bots/answer_escalation_bots__bot_id__escalations__escalation_id__response_post.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Answer an escalation the bot raised.

The bot tells the participants the owner's answer, word for word in
substance, and the escalation is marked answered in the briefing. An
escalation that is never answered stays open and is reported as
unresolved; the bot never assumes approval. Only the API key that created
the bot may answer.

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots/{bot_id}/escalations/{escalation_id}/response","method":"post"}]} />


---

## Get Bot Briefing

### Source: ./content/docs/speaking-bots/reference/bots/get_bot_briefing_bots__bot_id__briefing_get.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

The post-meeting briefing: summary, decisions, actions, open items, what the
bot said and what it escalated. Written once the call ends, on the bot's own
LLM key; also delivered in the speaking_bot.ended event. Only the API key
that created the bot may read it.

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots/{bot_id}/briefing","method":"get"}]} />


---

## Get Bot Usage

### Source: ./content/docs/speaking-bots/reference/bots/get_bot_usage_bots__bot_id__usage_get.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

What the bot has consumed so far on speech-to-text, text-to-speech and the LLM.

Live while the bot is in the call, final once it has left. key_sources says
per provider whether the bot ran on the server's key (billed by Meeting
BaaS) or on one the request brought. Only the API key that created the bot
may read it.

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots/{bot_id}/usage","method":"get"}]} />


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

## List Escalations

### Source: ./content/docs/speaking-bots/reference/bots/list_escalations_bots__bot_id__escalations_get.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

The decisions the bot has handed back to its owner during this call.

Each entry carries the question, its category, who asked, and the owner's
answer once one was posted. The same list is in the call-end event. Only
the API key that created the bot may read it.

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots/{bot_id}/escalations","method":"get"}]} />


---

## Send Owner Message

### Source: ./content/docs/speaking-bots/reference/bots/send_owner_message_bots__bot_id__messages_post.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Have the bot relay a message from its owner to the meeting.

For things that come up while the owner is away: "tell them I'll join at
half past", "we can go with option B". The bot says it in its own words,
briefly, and the text appears in the transcript as its turn. Only the API
key that created the bot may use this.

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/bots/{bot_id}/messages","method":"post"}]} />


---

## Bot ended

### Source: ./content/docs/speaking-bots/reference/events/speaking_bot_ended.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

The bot has left the meeting; nothing follows this event.

Carries the final usage report, the briefing when one was requested and
every escalation of the call with its answer. Unlike the others this one
is awaited before the bot's process exits, so it is delivered even when
the call ends abruptly.

Delivered as an HTTP POST to the bot's `callback_url`, with the event name in the `x-speaking-bot-event` header and, when the bot was created with a `callback_secret`, `x-speaking-bot-signature: sha256=<hex>`: the HMAC-SHA256 of the exact request body with that secret. Answer with any 2xx. Network errors and 5xx are retried three times (after 1, 3 and 9 seconds); a redirect counts as a failed delivery and is not followed.

<APIPage document={"./speaking-bots-openapi.json"} webhooks={[{"name":"speaking_bot.ended","method":"post"}]} />

---

## Escalation raised

### Source: ./content/docs/speaking-bots/reference/events/speaking_bot_escalation.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

A representative bot handed a decision back to its owner.

Fires the moment the bot calls its escalate tool, before anyone has
answered. Reply with `POST /bots/{bot_id}/escalations/{escalation_id}/response`
and the bot relays the answer to the meeting.

Delivered as an HTTP POST to the bot's `callback_url`, with the event name in the `x-speaking-bot-event` header and, when the bot was created with a `callback_secret`, `x-speaking-bot-signature: sha256=<hex>`: the HMAC-SHA256 of the exact request body with that secret. Answer with any 2xx. Network errors and 5xx are retried three times (after 1, 3 and 9 seconds); a redirect counts as a failed delivery and is not followed.

<APIPage document={"./speaking-bots-openapi.json"} webhooks={[{"name":"speaking_bot.escalation","method":"post"}]} />

---

## Owner message delivered

### Source: ./content/docs/speaking-bots/reference/events/speaking_bot_owner_message_delivered.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

The bot relayed an owner message or an escalation answer to the meeting.

`data.message_id` matches the `message_id` returned when it was queued.

Delivered as an HTTP POST to the bot's `callback_url`, with the event name in the `x-speaking-bot-event` header and, when the bot was created with a `callback_secret`, `x-speaking-bot-signature: sha256=<hex>`: the HMAC-SHA256 of the exact request body with that secret. Answer with any 2xx. Network errors and 5xx are retried three times (after 1, 3 and 9 seconds); a redirect counts as a failed delivery and is not followed.

<APIPage document={"./speaking-bots-openapi.json"} webhooks={[{"name":"speaking_bot.owner_message_delivered","method":"post"}]} />

---

## Bot utterance

### Source: ./content/docs/speaking-bots/reference/events/speaking_bot_utterance.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

The bot finished saying something.

One event per spoken turn, including the entry message and anything
relayed from the owner. `data.text` is what went to text-to-speech.

Delivered as an HTTP POST to the bot's `callback_url`, with the event name in the `x-speaking-bot-event` header and, when the bot was created with a `callback_secret`, `x-speaking-bot-signature: sha256=<hex>`: the HMAC-SHA256 of the exact request body with that secret. Answer with any 2xx. Network errors and 5xx are retried three times (after 1, 3 and 9 seconds); a redirect counts as a failed delivery and is not followed.

<APIPage document={"./speaking-bots-openapi.json"} webhooks={[{"name":"speaking_bot.utterance","method":"post"}]} />

---

## Speaking Bots API Reference

API reference documentation for Speaking Bots

### Source: ./content/docs/speaking-bots/reference/index.mdx


# Speaking Bots API Reference

Generated from the service's live OpenAPI document, also served at [speaking.meetingbaas.com/openapi.json](https://speaking.meetingbaas.com/openapi.json). Each page shows the method, parameters, body schema, responses and examples, and lets you try the call.

- [`POST /bots`](/docs/speaking-bots/reference/bots/join_meeting_bots_post): send a bot — persona or prompt, model, voice, turn-taking, documents, MCP servers, your own keys
- [`DELETE /bots/{bot_id}`](/docs/speaking-bots/reference/bots/leave_bot_bots__bot_id__delete): remove it
- [`GET /bots/{bot_id}/escalations`](/docs/speaking-bots/reference/bots/list_escalations_bots__bot_id__escalations_get): the decisions a [representative bot](/docs/speaking-bots/getting-started/representing-someone) has handed back to its owner
- [`POST /bots/{bot_id}/escalations/{escalation_id}/response`](/docs/speaking-bots/reference/bots/answer_escalation_bots__bot_id__escalations__escalation_id__response_post): answer one; the bot relays it to the meeting
- [`POST /bots/{bot_id}/messages`](/docs/speaking-bots/reference/bots/send_owner_message_bots__bot_id__messages_post): have the bot relay a message from its owner
- [`GET /bots/{bot_id}/briefing`](/docs/speaking-bots/reference/bots/get_bot_briefing_bots__bot_id__briefing_get): the post-meeting briefing, when `briefing.enabled` was set
- [`GET /bots/{bot_id}/usage`](/docs/speaking-bots/reference/bots/get_bot_usage_bots__bot_id__usage_get): speech-to-text, text-to-speech and LLM usage so far, and whose keys paid for it
- [`POST /personas/generate-image`](/docs/speaking-bots/reference/personas/generate_persona_image_personas_generate_image_post): generate an avatar for a persona

Every request carries a MeetingBaas API key in `x-meeting-baas-api-key`. The bot is created on that account; its status, recording and transcript come from the [MeetingBaas API](/docs/api-v2) under the returned `bot_id`.


---

## Generate Persona Image

### Source: ./content/docs/speaking-bots/reference/personas/generate_persona_image_personas_generate_image_post.mdx


{/* This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. */}

Generate an image for a persona using Replicate.

<APIPage document={"./speaking-bots-openapi.json"} operations={[{"path":"/personas/generate-image","method":"post"}]} />


---

## Environment variables

Everything the server reads from its environment, grouped by what it does

### Source: ./content/docs/speaking-bots/self-hosting/environment-variables.mdx


Copy `env.example` to `.env` for a local run, or set these on the container. Only the first group is needed to get a bot talking.

<Callout>
  The MeetingBaas API key is **not** a server setting. Each `POST /bots` request carries the caller's key in `x-meeting-baas-api-key` and the bot is created on that account.
</Callout>

## Providers (required)

```txt
# Which LLM the bots use by default: openai (default), anthropic or zai.
# Callers can override per bot with llm_provider, and bring their own key.
LLM_PROVIDER=openai

# The default models are the fast ones: a voice reply of a sentence or two
# gains nothing from a frontier model and loses seconds to it. Thinking is
# turned off in whatever way the chosen model accepts; models whose thinking
# is always on (Claude Fable, Opus 5.5 and newer) run at low effort instead.
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
# responses (default, newest models) or chat
OPENAI_API_SURFACE=responses
# Optional OpenAI service tier: auto, flex, priority
OPENAI_SERVICE_TIER=

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-haiku-4-5

ZAI_API_KEY=
ZAI_MODEL=glm-5.2
ZAI_BASE_URL=https://api.z.ai/api/paas/v4/

# Optional global fallback model; the provider-specific variables win
LLM_MODEL=

# Speech-to-text (Deepgram) and text-to-speech (Cartesia)
DEEPGRAM_API_KEY=
CARTESIA_API_KEY=
CARTESIA_VOICE_ID=79a125e8-cd45-4c13-8a67-188112f4dd22
# Default speaking speed when a request sets no speech_speed (0.6 to 1.5)
CARTESIA_TTS_SPEED=1.2
```

Set the key of whichever `LLM_PROVIDER` you choose; a request for a provider with no key is refused with a `400` unless the caller supplies one in `credentials`.

## Server

```txt
# Port the API listens on
PORT=7014

# Public https URL of this server. MeetingBaas connects back to
# wss://<this host>/ws/<client_id> for audio. Required everywhere except a
# local ngrok run, where it is detected.
BASE_URL=https://speaking.example.com

# MeetingBaas API the bots are created on
MEETING_BAAS_API_URL=https://api.meetingbaas.com

# Writable directory for transcripts, floor files, ready signals, call
# summaries and meeting state. Defaults to the repository root; the
# container image sets /data.
SPEAKING_BOT_STATE_DIR=/data

# Comma-separated CORS origins; unset allows every origin
CORS_ALLOW_ORIGINS=

# When set, MeetingBaas callbacks to /webhook must carry it in x-mb-secret.
# The server passes it to MeetingBaas as the callback secret when creating bots.
WEBHOOK_SECRET=
```

## Conversation defaults

```txt
# Voice-activity detection defaults; a request's turn_config overrides them
VAD_CONFIDENCE=0.5
VAD_START_SECS=0.25
VAD_STOP_SECS=0.8
VAD_MIN_VOLUME=0.6

# Seconds of silence after admission before a bot speaks on its own, and how
# many times it may do so
BOT_IDLE_REENGAGE_SECS=15
BOT_MAX_REENGAGE=3
```

## Context and MCP

```txt
# Cap on each prompt_data_sources URL fetch, in bytes
PROMPT_DATA_SOURCE_MAX_BYTES=1000000
# Allow prompt_data_sources URLs on localhost / private networks (trusted networks only)
PROMPT_DATA_ALLOW_PRIVATE_URLS=false

# Allow remote MCP servers on localhost / private networks (trusted networks only),
# or list exact private URLs that are allowed
MCP_ALLOW_PRIVATE_URLS=false
MCP_ALLOWED_PRIVATE_URLS=

# Local mcpproxy groups behind the mcp_profile presets (optional)
MCP_PROXY_ALL_URL=http://127.0.0.1:8109/mcp
MCP_PROXY_PERSONAL_URL=http://127.0.0.1:8110/mcp
MCP_PROXY_PROFESSIONAL_URL=http://127.0.0.1:8111/mcp
```

MCP server credentials travel per request in `mcp.servers[].headers`; the server holds no global MCP secret.

## Persona creation (optional)

Only for `POST /personas/generate-image` and the persona CLI:

```txt
REPLICATE_KEY=
STABILITY_AI_API_KEY=
UTFS_KEY=
APP_ID=
```

## Local development (optional)

```txt
# ngrok tunnels for a public hostname during development
NGROK_AUTHTOKEN=
```

See [Local development](/docs/speaking-bots/self-hosting/local-development) and [Ngrok setup](/docs/speaking-bots/self-hosting/ngrok-setup).


---

## Self-hosting overview

Run the Speaking Bots server on your own infrastructure

### Source: ./content/docs/speaking-bots/self-hosting/index.mdx


The server behind the hosted API is open source ([Meeting-Baas/speaking-meeting-bot](https://github.com/Meeting-Baas/speaking-meeting-bot)) and runs anywhere a container runs. Self-host it when you want the bots' speech and language traffic to stay on your providers and your network, or when you want to change the pipeline itself. The bots still join meetings through MeetingBaas with your API key; only the voice pipeline moves.

## What the service is

One FastAPI process on port `7014` that, for every bot:

- creates the bot on MeetingBaas with your caller's key and points its audio stream at **its own public hostname** (`wss://<BASE_URL>/ws/<client_id>`);
- spawns one **Pipecat child process** for that bot (speech-to-text → LLM → text-to-speech) and bridges audio between it and MeetingBaas;
- keeps the bot's state (transcript, floor file, ready signal, call summary) in a **state directory** on local disk.

Three consequences shape every deployment:

<Callout type="warn">
  **Run exactly one replica.** Bot processes, WebSocket connections and floor-control files all live inside the one instance; a second replica behind the same hostname would receive audio for bots it does not know. Scale vertically, or run separate instances under separate hostnames.
</Callout>

- **A public HTTPS hostname is part of the contract.** MeetingBaas connects *back* to the server for audio, so `BASE_URL` must be reachable from the internet and WebSocket upgrades must pass through whatever sits in front (load balancer, ingress, reverse proxy), with idle timeouts long enough for a meeting.
- **A restart ends every live bot.** Plan rollouts for quiet hours; there is no draining.

## Requirements

- Linux, Python 3.11 (or the container image), `ffmpeg`
- Outbound HTTPS to MeetingBaas and to your providers (OpenAI / Anthropic / Z.ai, Deepgram, Cartesia)
- Roughly 0.5 vCPU and 600 MB of memory per concurrent bot on top of a ~1 GB baseline; the image warms the Pipecat imports at startup so the first bot does not pay a cold start
- Provider keys: one LLM provider, Deepgram, Cartesia — see [Environment variables](/docs/speaking-bots/self-hosting/environment-variables). Callers may also [bring their own](/docs/speaking-bots/getting-started/bring-your-own-keys), in which case the server's keys are only the fallback

## Run it with Docker

```bash
git clone https://github.com/Meeting-Baas/speaking-meeting-bot.git
cd speaking-meeting-bot
docker build -t speaking-bot .

docker run -d --name speaking-bot -p 7014:7014 \
  -e BASE_URL=https://speaking.example.com \
  -e LLM_PROVIDER=anthropic \
  -e ANTHROPIC_API_KEY=... \
  -e DEEPGRAM_API_KEY=... \
  -e CARTESIA_API_KEY=... \
  -v speaking-bot-state:/data \
  speaking-bot
```

The image sets `SPEAKING_BOT_STATE_DIR=/data` and `PORT=7014`; the volume keeps meeting state across a container restart so a bot whose audio reconnects can be respawned — on the server's own provider keys, since per-bot [`credentials`](/docs/speaking-bots/getting-started/bring-your-own-keys) are held only in memory and are not restored. Put a TLS-terminating reverse proxy in front of port 7014 that forwards WebSockets (nginx: `proxy_http_version 1.1`, `Upgrade`/`Connection` headers, `proxy_read_timeout 3600`), and point `BASE_URL` at its public hostname.

Check it:

```bash
curl -s https://speaking.example.com/ready
# {"status":"ready","service":"speaking-meeting-bot","version":"...","public_base_url":"https://speaking.example.com",...}
```

`public_base_url` must be the hostname MeetingBaas can reach; if it shows an internal address, `BASE_URL` is wrong.

## Other ways to run it

- [Kubernetes](/docs/speaking-bots/self-hosting/kubernetes): a single-replica Deployment with an ingress that passes WebSockets — what the hosted API runs on.
- Bare metal or a VM: `poetry install`, then `poetry run uvicorn app:app --host 0.0.0.0 --port 7014` under systemd with an `EnvironmentFile`; the repo also ships a `flake.nix` dev shell.
- [Local development](/docs/speaking-bots/self-hosting/local-development) with ngrok for a public hostname.

## Pointing callers at your server

Your server exposes the same API as the hosted one, so the [guides](/docs/speaking-bots/getting-started/sending-a-bot) apply unchanged with `API=https://speaking.example.com`. Callers still authenticate with a MeetingBaas API key; set `MEETING_BAAS_API_URL` if your bots should be created on a MeetingBaas environment other than production.


---

## Kubernetes

A single-replica Deployment with a WebSocket-aware ingress, as the hosted API runs it

### Source: ./content/docs/speaking-bots/self-hosting/kubernetes.mdx


The hosted API runs on Kubernetes with the manifests below in spirit (a Helm chart with the same shape). Adapt names, hostnames and the ingress class to your cluster.

## What matters

- **`replicas: 1`**, and a `RollingUpdate` with `maxSurge: 1, maxUnavailable: 0` so the API stays reachable through a rollout. The old pod's bots end when it is terminated; `terminationGracePeriodSeconds` only delays that.
- **The ingress must pass WebSockets** and keep them open for a whole meeting: with ingress-nginx, `proxy-read-timeout` / `proxy-send-timeout` of `3600`.
- **`BASE_URL` is the ingress hostname**, with TLS. MeetingBaas connects to it from the internet.
- **State on an `emptyDir`** at `/data` is enough: nothing in it needs to outlive the pod.
- Readiness on `/ready`, liveness on `/health`. Both answer as soon as uvicorn is up, independently of the Pipecat warm-up the server runs in the background at startup.

## Manifests

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: speaking-bot
type: Opaque
stringData:
  ANTHROPIC_API_KEY: "..."
  OPENAI_API_KEY: "..."
  DEEPGRAM_API_KEY: "..."
  CARTESIA_API_KEY: "..."
  WEBHOOK_SECRET: "..."
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: speaking-bot
data:
  PORT: "7014"
  BASE_URL: "https://speaking.example.com"
  MEETING_BAAS_API_URL: "https://api.meetingbaas.com"
  LLM_PROVIDER: "anthropic"
  ANTHROPIC_MODEL: "claude-haiku-4-5"
  OPENAI_MODEL: "gpt-5.4-mini"
  OPENAI_API_SURFACE: "responses"
  CARTESIA_VOICE_ID: "79a125e8-cd45-4c13-8a67-188112f4dd22"
  CARTESIA_TTS_SPEED: "1.2"
  CORS_ALLOW_ORIGINS: "*"
  SPEAKING_BOT_STATE_DIR: "/data"
  PROMPT_DATA_ALLOW_PRIVATE_URLS: "false"
  MCP_ALLOW_PRIVATE_URLS: "false"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: speaking-bot
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: speaking-bot
  template:
    metadata:
      labels:
        app: speaking-bot
    spec:
      terminationGracePeriodSeconds: 60
      volumes:
        - name: state
          emptyDir:
            sizeLimit: 2Gi
      containers:
        - name: speaking-bot
          image: your-registry/speaking-bot:2026-10-20-abcdef123456
          ports:
            - name: http
              containerPort: 7014
          envFrom:
            - configMapRef:
                name: speaking-bot
            - secretRef:
                name: speaking-bot
          volumeMounts:
            - name: state
              mountPath: /data
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 20
            periodSeconds: 30
          resources:
            requests:
              cpu: "1"
              memory: 2Gi
            limits:
              cpu: "2"
              memory: 6Gi
---
apiVersion: v1
kind: Service
metadata:
  name: speaking-bot
spec:
  selector:
    app: speaking-bot
  ports:
    - name: http
      port: 7014
      targetPort: http
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: speaking-bot
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  ingressClassName: nginx
  tls:
    - hosts: ["speaking.example.com"]
      secretName: speaking-example-com-tls
  rules:
    - host: speaking.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: speaking-bot
                port:
                  name: http
```

## Sizing

Budget about 0.5 vCPU and 600 MB per bot you expect to be in a call at the same time, on top of the ~1 GB the API and the warmed Pipecat imports take. The example above comfortably runs a handful of concurrent bots; for more, raise the limits before adding instances — a second instance needs its own hostname and its own `BASE_URL`.

## Rolling out a new version

A new image tag means a new pod and the end of every bot in a call at that moment. The Deployment uses the `Recreate` strategy on purpose: with a rolling update the old and new pods are briefly ready together, the Service can route a bot's WebSocket to the pod that did not create it, and each pod has its own `/data`, so the bot loses its audio. Deploy in quiet hours, or drain by refusing new `POST /bots` upstream for the length of a meeting first. The hosted API tags release images `<YYYY-MM-DD>-vX.Y.Z`; `GET /ready` reports the running tag as `version`, which is a quick way to confirm what a host is running.


---

## Local development

Run the server from a checkout and send a bot from your laptop

### Source: ./content/docs/speaking-bots/self-hosting/local-development.mdx


## 1. Clone and install

```bash
git clone https://github.com/Meeting-Baas/speaking-meeting-bot.git
cd speaking-meeting-bot

# Poetry (Unix/macOS)
curl -sSL https://install.python-poetry.org | python3 -

poetry env use python3.11
poetry install
```

You need Python 3.11+, [Poetry](https://python-poetry.org/) and `ffmpeg` on your `PATH` (`brew install ffmpeg` / `apt-get install ffmpeg`). The repository also ships a `flake.nix`; `nix develop` gives you a shell with everything.

## 2. Compile the protobufs

```bash
poetry run python -m grpc_tools.protoc --proto_path=./protobufs --python_out=./protobufs frames.proto
```

Pipecat frames the audio stream with Protocol Buffers; `frames.proto` defines the `TextFrame`, `AudioRawFrame` and `TranscriptionFrame` messages exchanged with MeetingBaas.

## 3. Configure

```bash
cp env.example .env
```

Fill in a provider key for your `LLM_PROVIDER`, `DEEPGRAM_API_KEY` and `CARTESIA_API_KEY`. Everything else has a default; the full list is in [Environment variables](/docs/speaking-bots/self-hosting/environment-variables).

## 4. A public hostname

MeetingBaas has to reach your laptop to stream audio, so the server needs a public `https://` URL. Two ways:

- **ngrok, detected automatically**: follow [Ngrok setup](/docs/speaking-bots/self-hosting/ngrok-setup), then start the server in local-dev mode (below). It picks the tunnel up as the bot's WebSocket URL.
- **Any tunnel, set by hand**: expose port `7014` however you like and put the public URL in `BASE_URL`.

## 5. Run

```bash
# Local-dev mode: detects ngrok tunnels, reloads on change
poetry run python app/main.py --local-dev

# Or plain uvicorn, with BASE_URL set in .env
poetry run uvicorn app:app --reload --host 0.0.0.0 --port 7014
```

Then:

- Swagger UI: `http://localhost:7014/docs`
- OpenAPI document: `http://localhost:7014/openapi.json`
- `http://localhost:7014/ready` shows `public_base_url`: `BASE_URL` when set, otherwise the host you called it on. In local-dev mode that is `localhost`, so confirm the tunnel from the `WebSocket URL:` line the server logs when you send a bot

## 6. Send a bot

```bash
curl -X POST http://localhost:7014/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: your-meetingbaas-api-key" \
  -d '{
    "meeting_url": "https://meet.google.com/xxx-yyyy-zzz",
    "personas": ["baas_onboarder"]
  }'
```

Admit it from the lobby and it speaks. The server log shows the Pipecat child's output prefixed `[Pipecat STDOUT]`; a wrong provider key shows up there right after "Started Pipecat process".

## Tests and the OpenAPI snapshot

```bash
poetry run pytest tests
poetry run ruff check .
# after changing a request/response model:
poetry run python scripts/export_openapi.py
```

`openapi.json` is committed and a test fails when it drifts from the app, so regenerate it with any API change. The docs site's reference pages are generated from that file.


---

## Ngrok setup

Give a local server the public hostname MeetingBaas needs to stream audio to it

### Source: ./content/docs/speaking-bots/self-hosting/ngrok-setup.mdx


MeetingBaas streams meeting audio *to* the server, so even a laptop run needs a public `https://` URL. ngrok is the quickest way to get one; local-dev mode picks the tunnel up automatically.

## Setup

1. Install the ngrok CLI: `brew install ngrok` on macOS, or the [download](https://ngrok.com/download) for your platform
2. Sign up for a free account at [ngrok.com](https://dashboard.ngrok.com/signup) and copy the token from the [Your Authtoken page](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Register it with the CLI once; the server does not read it, so it does not belong in `.env`:

```bash
ngrok config add-authtoken <your token>
```

## Tunnels

The repository ships a configuration at `config/ngrok/config.yml` with two tunnels, both forwarding to the one server on port `7014`:

```yaml
version: "2"

tunnels:
  proxy1:
    proto: http
    addr: 7014
  proxy2:
    proto: http
    addr: 7014
```

Start them together:

```bash
ngrok start --all --config config/ngrok/config.yml
```

ngrok's free tier allows two concurrent tunnels, which is why the file defines two: in local-dev mode each tunnel URL is handed to one bot at a time, so you can have two bots in meetings at once from a laptop. Both reach the same server, which tells bots apart by `client_id`. Your own ngrok config lives at `~/.config/ngrok/ngrok.yml` (Linux), `~/Library/Application Support/ngrok/ngrok.yml` (macOS) or `%HOMEPATH%\AppData\Local\ngrok\ngrok.yml` (Windows); `ngrok config check` prints the path in use.

## Run the server in local-dev mode

```bash
poetry run python app/main.py --local-dev
```

At startup the server lists the tunnels it found and uses them, in turn, as the public WebSocket URL for each bot. It resolves that URL in this order:

1. `websocket_url` in the request, if set
2. `BASE_URL` from the environment
3. an ngrok tunnel, in local-dev mode
4. the request's own `Host` header (fallback, fine behind a trusted proxy only)

The server logs the winner as `WebSocket URL:` when it sends the bot. `GET /ready` reports `public_base_url` too, but without `BASE_URL` it echoes the host you called it on, so in local-dev mode it says `localhost` rather than the tunnel.

## When the bot joins but stays silent

- The tunnel URL changed (ngrok free URLs rotate on restart) while the server kept the old one: restart the server after restarting ngrok.
- The server is running without `--local-dev` and without `BASE_URL`: it falls back to the `Host` header, which is `localhost:7014` and unreachable from MeetingBaas. Set `BASE_URL` to the tunnel URL or use `--local-dev`.
- Both tunnels are in use: a third `POST /bots` is refused with `400 No more ngrok URLs available`. Remove a bot, or skip local-dev mode and set `BASE_URL` to one tunnel URL instead — bots are multiplexed by `client_id` on a single hostname, so one tunnel serves any number of them.

For anything beyond a laptop, set `BASE_URL` to a real hostname instead — see [Self-hosting](/docs/speaking-bots/self-hosting).


---

