# growth-engine Documentation

Documentation for growth-engine.

## Growth Engine

Product-driven email automation system for adaptive user engagement sequences

### Source: ./content/docs/growth-engine/index.mdx


# Growth Engine - Email Automation System

Product-driven outreach system for adaptive email sequences. Sends contextual emails based on user behavior, with automatic stop conditions and priority-based playbook management.

<Callout type="info">
  Auto-generated: 2026-01-28T17:01:40.476Z. Run `node scripts/generate-growth-diagram.cjs` to update.
</Callout>

<Callout type="info">
  The Growth Engine automatically stops sending emails when a user replies, configures webhooks, or takes the suggested action.
</Callout>

## Architecture Overview

<Mermaid chart={`flowchart TB
    subgraph TRIGGERS["Event Triggers"]
        direction LR
        API["API Controllers"]
        CRON["Cron Jobs<br/>7 jobs"]
        WEBHOOK["Resend Webhooks"]
    end

    subgraph HOOKS["Integration Hooks (8)"]
        direction LR
        H1["onTeamCreated"]
        H2["onBotCreated"]
        H3["onBotFailed"]
        H4["onBotCompleted"]
        H5["onWebhookConfigured"]
        H6["onCalendarConnected"]
        H7["onScheduledBotCreated"]
        H8["onBotArtifactsFetched"]
    end

    subgraph CRON_JOBS["Background Scanners"]
        direction LR
        C1["artifacts-reminder"]
        C2["calendar-scanner"]
        C3["delayed-steps"]
        C4["inactivity"]
        C5["onboarding-scanner"]
        C6["polling-detector"]
    end

    subgraph SQS["AWS SQS Queue"]
        QUEUE[("growth-jobs<br/>7 message types")]
    end

    subgraph ORCHESTRATOR["Playbook Orchestrator"]
        direction TB
        EVAL["evaluateTriggersForEvent"]
        START["startPlaybook"]
        STOP["stopPlaybook"]
        SEND["sendStep"]
        CHECK["checkStopConditions"]
    end

    subgraph PLAYBOOKS["Playbook Engine (13 playbooks)"]
        direction TB

        subgraph PB_HIGH["High Priority (50-100)"]
            PB_failure_recovery["failure_recovery<br/>Priority: 100"]
            PB_calendar_sync_error["calendar_sync_error<br/>Priority: 50"]
        end

        subgraph PB_MED["Medium Priority (7-49)"]
            PB_onboarding_api_no_bot["onboarding_api_no_bot<br/>Priority: 11"]
            PB_onboarding["onboarding<br/>Priority: 10"]
            PB_artifacts_reminder["artifacts_reminder<br/>Priority: 9"]
            PB_webhooks_adoption["webhooks_adoption<br/>Priority: 8"]
            PB_webhooks_polling["webhooks_polling<br/>Priority: 8"]
            PB_calendar_expansion["calendar_expansion<br/>Priority: 7"]
            PB_calendar_no_bots["calendar_no_bots<br/>Priority: 7"]
        end

        subgraph PB_LOW["Low Priority (1-6)"]
            PB_activation["activation<br/>Priority: 6"]
            PB_activation_bot_created["activation_bot_created<br/>Priority: 6"]
            PB_winback_3d["winback_3d<br/>Priority: 5"]
            PB_winback_7d["winback_7d<br/>Priority: 4"]
        end
    end

    subgraph CONTEXT["Context Builder"]
        CTX["buildPlaybookContext"]
        CTX_DATA["Team Data<br/>Tracking Data<br/>Recent Bots<br/>Integrations<br/>Email History"]
    end

    subgraph TEMPLATES["Email Templates (22)"]
        direction LR
        T_ON["Onboarding<br/>4 templates"]
        T_ACT["Activation<br/>2 templates"]
        T_FAIL["Failure<br/>6 templates"]
        T_WB["Winback<br/>2 templates"]
        T_WH["Webhooks<br/>3 templates"]
        T_CAL["Calendar<br/>4 templates"]
        T_ART["Artifacts<br/>1 templates"]
    end

    subgraph EMAIL["Email Delivery"]
        RENDER["renderGrowthTemplate"]
        RESEND["Resend API"]
    end

    subgraph DATABASE["PostgreSQL (8 tables)"]
        direction LR
        DB_growthEvents[("growth_events")]
        DB_growthConversations[("growth_conversations")]
        DB_teamPlaybookState[("team_playbook_state")]
        DB_growthEmailJobs[("growth_email_jobs")]
        DB_growthWebhookDedup[("growth_webhook_dedup")]
        DB_teamGrowthTracking[("team_growth_tracking")]
        DB_growthKnowledgeBase[("growth_knowledge_base")]
        DB_growthDraftHistory[("growth_draft_history")]
    end

    subgraph RESEND_HOOKS["Resend Event Tracking"]
        direction LR
        R_SENT["email.sent"]
        R_DELIVERED["email.delivered"]
        R_OPENED["email.opened"]
        R_CLICKED["email.clicked"]
        R_BOUNCED["email.bounced"]
        R_REPLIED["Inbound Reply"]
    end

    %% Flow: API triggers
    API --> HOOKS
    HOOKS --> QUEUE

    %% Flow: Cron triggers
    CRON --> CRON_JOBS
    CRON_JOBS --> QUEUE

    %% Flow: SQS processing
    QUEUE --> EVAL
    EVAL --> CTX
    CTX --> CTX_DATA
    CTX_DATA --> CHECK
    CHECK --> START & STOP
    START --> SEND

    %% Flow: Playbook selection
    EVAL --> PLAYBOOKS
    PLAYBOOKS --> SEND

    %% Flow: Email sending
    SEND --> DB_growthEmailJobs
    DB_growthEmailJobs --> RENDER
    RENDER --> TEMPLATES
    TEMPLATES --> RESEND

    %% Flow: Resend webhooks
    RESEND --> RESEND_HOOKS
    RESEND_HOOKS --> WEBHOOK
    WEBHOOK --> DB_growthEvents
    R_REPLIED --> STOP

    %% Flow: Database persistence
    EVAL --> DB_growthEvents
    START --> DB_teamPlaybookState
    STOP --> DB_teamPlaybookState

    %% Styling
    classDef trigger fill:#e3f2fd,stroke:#1565c0
    classDef queue fill:#fff3e0,stroke:#ef6c00
    classDef engine fill:#e8f5e9,stroke:#2e7d32
    classDef db fill:#fce4ec,stroke:#c2185b
    classDef email fill:#f3e5f5,stroke:#7b1fa2

    class TRIGGERS,HOOKS,CRON_JOBS trigger
    class SQS queue
    class ORCHESTRATOR,PLAYBOOKS,CONTEXT engine
    class DATABASE db
    class TEMPLATES,EMAIL,RESEND_HOOKS email`} />

## Component Summary

| Component | Count |
|-----------|-------|
| Playbooks | 13 |
| Email Templates | 22 |
| Integration Hooks | 8 |
| Background Jobs | 7 |
| SQS Message Types | 7 |
| Database Tables | 8 |

## Playbooks

Playbooks are email sequences triggered by specific user behaviors. Higher priority playbooks can interrupt lower priority ones.

| Playbook | Priority | Description |
|----------|----------|-------------|
| `failure_recovery` | 100 | Bot failed, help user recover |
| `calendar_sync_error` | 50 | Calendar connection has sync issues |
| `onboarding_api_no_bot` | 11 | API calls detected but no bot created |
| `onboarding` | 10 | New account created, no bot created yet |
| `artifacts_reminder` | 9 | Bot completed but recording/transcript not fetched |
| `webhooks_adoption` | 8 | Bot completed but no webhooks/callbacks configured |
| `webhooks_polling` | 8 | Heavy polling detected, suggest webhooks |
| `calendar_expansion` | 7 | Recurring usage or scheduled bots, but no calendar integration |
| `calendar_no_bots` | 7 | Calendar connected but no calendar bots created |
| `activation` | 6 | First bot completed successfully |
| `activation_bot_created` | 6 | First bot created, explain what happens next |
| `winback_3d` | 5 | No API activity for 3 days |
| `winback_7d` | 4 | No API activity for 7 days |

## Integration Hooks

These hooks are called from various API controllers to trigger growth events:

- `onTeamCreated()`
- `onBotCreated()`
- `onBotFailed()`
- `onBotCompleted()`
- `onWebhookConfigured()`
- `onCalendarConnected()`
- `onScheduledBotCreated()`
- `onBotArtifactsFetched()`

## Email Templates

| Template |
|----------|
| `activation-bot-created` |
| `activation-congrats` |
| `artifacts-reminder` |
| `calendar-expansion-followup` |
| `calendar-expansion` |
| `calendar-no-bots` |
| `calendar-sync-error` |
| `failure-bot-not-accepted` |
| `failure-daily-cap-reached` |
| `failure-generic` |
| `failure-insufficient-tokens` |
| `failure-invalid-meeting-platform` |
| `failure-timeout-waiting-to-start` |
| `onboarding-api-no-bot` |
| `onboarding-d0` |
| `onboarding-d2` |
| `onboarding-d5` |
| `webhooks-adoption-followup` |
| `webhooks-adoption` |
| `webhooks-stop-polling` |
| `winback-3d-followup` |
| `winback-3d` |

## Background Jobs

| Job |
|-----|
| `growth-artifacts-reminder-job` |
| `growth-calendar-scanner-job` |
| `growth-delayed-steps-job` |
| `growth-inactivity-job` |
| `growth-onboarding-scanner-job` |
| `growth-polling-detector-job` |
| `growth-sqs-worker-job` |

## Database Tables

<Mermaid chart={`erDiagram
    teams ||--o{ growth_events : "logs"
    teams ||--o| team_playbook_state : "has"
    teams ||--o| team_growth_tracking : "has"
    teams ||--o{ growth_email_jobs : "schedules"

    growth_events {
        id PK
        team_id FK
    }

    growth_conversations {
        id PK
        team_id FK
    }

    team_playbook_state {
        id PK
        team_id FK
    }

    growth_email_jobs {
        id PK
        team_id FK
    }

    growth_webhook_dedup {
        id PK
        team_id FK
    }

    team_growth_tracking {
        id PK
        team_id FK
    }

    growth_knowledge_base {
        id PK
        team_id FK
    }

    growth_draft_history {
        id PK
        team_id FK
    }
`} />

## Event Flow

<Mermaid chart={`sequenceDiagram
    participant API as API Controller
    participant Hook as Growth Hook
    participant SQS as SQS Queue
    participant Worker as SQS Worker
    participant Orch as Orchestrator
    participant DB as PostgreSQL
    participant Resend as Resend API

    API->>Hook: on*() hook called
    Hook->>DB: logGrowthEvent()
    Hook->>SQS: publishEvaluatePlaybook()
    SQS->>Worker: Receive message
    Worker->>Orch: evaluateTriggersForEvent()
    Orch->>DB: Check/update playbook state
    Orch->>SQS: publishSendEmail()
    SQS->>Worker: Receive send_email
    Worker->>Orch: processEmailJobById()
    Orch->>Resend: Send email
    Resend-->>API: Webhook (delivered/clicked/replied)
    API->>DB: Log email event
`} />

## Priority System

<Callout type="warning">
  The `failure_recovery` playbook (priority 100) will interrupt any other active playbook to ensure users get help immediately when something goes wrong.
</Callout>

Higher priority playbooks can interrupt lower priority ones:

```
100: failure_recovery
 50: calendar_sync_error
 11: onboarding_api_no_bot
 10: onboarding
  9: artifacts_reminder
  8: webhooks_adoption
  8: webhooks_polling
  7: calendar_expansion
  7: calendar_no_bots
  6: activation
  6: activation_bot_created
  5: winback_3d
  4: winback_7d
```

## Stop Conditions

Playbooks automatically stop when:

1. **User replies** to any growth email
2. **User takes action** (e.g., configures webhooks, connects calendar)
3. **Higher priority playbook** starts
4. **Max emails reached** for that playbook
5. **User unsubscribes** from growth emails


---

## Email Playbooks

Detailed documentation for each Growth Engine email sequence

### Source: ./content/docs/growth-engine/playbooks.mdx


# Email Playbooks

<Callout type="info">
  Auto-generated: 2026-01-28T17:01:40.508Z. Run `node scripts/generate-growth-playbook-docs.cjs` to update.
</Callout>

Each playbook is an automated email sequence triggered by specific user behaviors. Higher priority playbooks can interrupt lower priority ones.

## Quick Reference

| Playbook | Priority | Emails | Cooldown |
|----------|----------|--------|----------|
| [Onboarding](#onboarding) | 10 | 3 | 30 days |
| [Webhooks Adoption](#webhooks-adoption) | 8 | 0 | 7 days |
| [Webhooks - Stop Polling](#webhooks---stop-polling) | 8 | 1 | 30 days |
| [Calendar Expansion](#calendar-expansion) | 7 | 2 | 30 days |
| [Calendar - No Bots](#calendar---no-bots) | 7 | 0 | 14 days |
| [Activation](#activation) | 6 | 0 | 365 days |
| [Activation - Bot Created](#activation---bot-created) | 6 | 0 | 365 days |
| [Winback 3-Day](#winback-3-day) | 5 | 2 | 14 days |
| [Winback 7-Day](#winback-7-day) | 4 | 1 | 30 days |

---

## Onboarding

**Key:** `onboarding`
**Priority:** 10
**Cooldown:** 30 days

> New account created, no bot created yet

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: New account created, no bot created yet

    Note over U: Immediately
    S->>E: Send onboarding-d0
    E-->>U: Email delivered

    Note over U: +2 days
    S->>E: Send onboarding-d2
    E-->>U: Email delivered

    Note over U: +5 days
    S->>E: Send onboarding-d5
    E-->>U: Email delivered

    alt Stop Condition Met
        U->>S: User creates a bot
    else
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|
| d0 | Immediately | `onboarding-d0` |
| d2 | 2 days | `onboarding-d2` |
| d5 | 5 days | `onboarding-d5` |

### Stop Conditions

- User creates a bot
- User replies to email

### Templates

#### onboarding-d0

**Summary:** Welcome to Meeting BaaS — the infrastructure layer for meeting intelligence.

**CTA:** Read API Documentation

<Callout type="info">
  **Power User Tip:** Pass custom metadata via the
</Callout>

#### onboarding-d2

**Summary:** Deploy your first bot in under 60 seconds.

**CTA:** Launch Test Bot

<Callout type="info">
  **Power User Tip:** Artifact URLs are presigned with 4h TTL. Call
</Callout>

#### onboarding-d5

**Summary:** Teams ship faster with Meeting BaaS.

**CTA:** Explore API Reference

<Callout type="info">
  **Power User Tip:** Use
</Callout>

---

## Webhooks Adoption

**Key:** `webhooks_adoption`
**Priority:** 8
**Cooldown:** 7 days

> Bot completed but no webhooks/callbacks configured

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: Bot completed but no webhooks/callbacks configured


    alt Stop Condition Met
        U->>S: Webhook or callback configured
    else
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|


### Stop Conditions

- Webhook or callback configured
- User replies to email

### Templates

---

## Webhooks - Stop Polling

**Key:** `webhooks_polling`
**Priority:** 8
**Cooldown:** 30 days

> Heavy polling detected, suggest webhooks

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: Heavy polling detected, suggest webhooks

    Note over U: Immediately
    S->>E: Send webhooks-stop-polling
    E-->>U: Email delivered

    alt Stop Condition Met
        U->>S: Webhook or callback configured
    else
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|
| d0 | Immediately | `webhooks-stop-polling` |

### Stop Conditions

- Webhook or callback configured
- User replies to email

### Templates

#### webhooks-stop-polling

**Summary:** We detected heavy polling on GET /v2/bots/\{id\} .

**CTA:** Configure Webhooks

<Callout type="info">
  **Power User Tip:** Migration in 3 steps:
</Callout>

---

## Calendar Expansion

**Key:** `calendar_expansion`
**Priority:** 7
**Cooldown:** 30 days

> Recurring usage or scheduled bots, but no calendar integration

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: Recurring usage or scheduled bots, but no calendar integration

    Note over U: Immediately
    S->>E: Send calendar-expansion
    E-->>U: Email delivered

    Note over U: +3 days
    S->>E: Send calendar-expansion-followup
    E-->>U: Email delivered

    alt Stop Condition Met
        U->>S: Calendar connected
    else
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|
| d0 | Immediately | `calendar-expansion` |
| d3 | 3 days | `calendar-expansion-followup` |

### Stop Conditions

- Calendar connected
- User replies to email

### Templates

#### calendar-expansion

**Summary:** You're scheduling bots manually.

**CTA:** Connect Calendar

<Callout type="info">
  **Power User Tip:** Use
</Callout>

#### calendar-expansion-followup

**Summary:** Following up on calendar integration.

**CTA:** View Calendar API

<Callout type="info">
  **Power User Tip:** Handle
</Callout>

---

## Calendar - No Bots

**Key:** `calendar_no_bots`
**Priority:** 7
**Cooldown:** 14 days

> Calendar connected but no calendar bots created

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: Calendar connected but no calendar bots created


    alt Stop Condition Met
        U->>S: User creates a bot
    else
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|


### Stop Conditions

- User creates a bot
- User replies to email

### Templates

---

## Activation

**Key:** `activation`
**Priority:** 6
**Cooldown:** 365 days

> First bot completed successfully

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: First bot completed successfully


    alt Stop Condition Met
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|


### Stop Conditions

- User replies to email

### Templates

---

## Activation - Bot Created

**Key:** `activation_bot_created`
**Priority:** 6
**Cooldown:** 365 days

> First bot created, explain what happens next

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: First bot created, explain what happens next


    alt Stop Condition Met
        U->>S: Bot completes successfully
    else
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|


### Stop Conditions

- Bot completes successfully
- User replies to email

### Templates

---

## Winback 3-Day

**Key:** `winback_3d`
**Priority:** 5
**Cooldown:** 14 days

> No API activity for 3 days

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: No API activity for 3 days

    Note over U: Immediately
    S->>E: Send winback-3d
    E-->>U: Email delivered

    Note over U: +3 days
    S->>E: Send winback-3d-followup
    E-->>U: Email delivered

    alt Stop Condition Met
        U->>S: API activity resumes
    else
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|
| d0 | Immediately | `winback-3d` |
| d3 | 3 days | `winback-3d-followup` |

### Stop Conditions

- API activity resumes
- User replies to email

### Templates

#### winback-3d

**Summary:** Building something cool? Here's a quick refresher to pick up where you left off.

**CTA:** Launch Test Bot

<Callout type="info">
  **Power User Tip:** Pass custom metadata via the
</Callout>

#### winback-3d-followup

**Summary:** Quick check-in: Is there anything blocking your integration? We're here to help.

**CTA:** Documentation

<Callout type="info">
  **Power User Tip:** Reply with your blocker. I can share code samples for your stack (Node, Python, Go, etc.) or hop on a quick call to debug together.
</Callout>

---

## Winback 7-Day

**Key:** `winback_7d`
**Priority:** 4
**Cooldown:** 30 days

> No API activity for 7 days

### Sequence

<Mermaid chart={`sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email

    Note over S: Trigger: No API activity for 7 days

    Note over U: Immediately
    S->>E: Send winback-3d
    E-->>U: Email delivered

    alt Stop Condition Met
        U->>S: API activity resumes
    else
        U->>S: User replies to email
        Note over S: Playbook stops
    end`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|
| d0 | Immediately | `winback-3d` |

### Stop Conditions

- API activity resumes
- User replies to email

### Templates

#### winback-3d

**Summary:** Building something cool? Here's a quick refresher to pick up where you left off.

**CTA:** Launch Test Bot

<Callout type="info">
  **Power User Tip:** Pass custom metadata via the
</Callout>

---

## Template Variables

These variables are available in all email templates:

| Variable | Description |
|----------|-------------|
| `\{\{firstName\}\}` | User's first name |
| `\{\{teamName\}\}` | Team/company name |
| `\{\{email\}\}` | User's email address |
| `\{\{dashboardUrl\}\}` | Link to dashboard |
| `\{\{docsUrl\}\}` | Link to documentation |
| `\{\{botId\}\}` | Bot ID (for failure emails) |
| `\{\{errorCode\}\}` | Error code (for failure emails) |
| `\{\{errorMessage\}\}` | Error description |
| `\{\{meetingUrl\}\}` | Meeting link |
| `\{\{unsubscribeUrl\}\}` | Unsubscribe link |


---

