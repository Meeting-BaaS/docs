# Internal Documentation Guide

How to prepare and import documentation into the Meeting BaaS docs site.

## Folder Structure

Place your docs in `content/docs/{service-name}/`:

```
content/docs/{service-name}/
├── meta.json              # Navigation order & folder settings
├── index.mdx              # Landing page (required)
├── getting-started.mdx
├── architecture.mdx
└── reference/
    ├── meta.json
    └── endpoints.mdx
```

## File Template

Each `.mdx` file needs frontmatter at the top:

```mdx
---
title: Page Title
description: Short description for SEO and previews
icon: Server
---

Your markdown content here...

## Section Heading

Regular markdown works: **bold**, _italic_, `code`, [links](https://example.com)

### Code Blocks

\`\`\`typescript
const example = "syntax highlighted";
\`\`\`

### Mermaid Diagrams

<Mermaid chart={\`flowchart TD
    A[Start] --> B[Process]
    B --> C[End]
\`} />

### Callouts

<Callout type="info">
  Informational note
</Callout>

<Callout type="warning">
  Warning message
</Callout>
```

## meta.json Template

Each folder needs a `meta.json` to control navigation:

```json
{
  "title": "Service Name",
  "icon": "Server",
  "pages": [
    "index",
    "getting-started",
    "architecture",
    "---Configuration---",
    "config-basics",
    "config-advanced",
    "reference"
  ]
}
```

- Use `"---Title---"` for section dividers
- Order determines sidebar navigation
- Subfolder names auto-include their contents

## Available Icons

Use any [Lucide icon](https://lucide.dev/icons) name:

- `Server`, `Database`, `Code`, `Terminal`
- `Settings`, `Lock`, `Key`, `Shield`
- `Webhook`, `Calendar`, `Bot`, `Brain`
- `FileText`, `FolderOpen`, `Package`

## Callout Types

```mdx
<Callout type="info">Info - blue</Callout>
<Callout type="warning">Warning - yellow</Callout>
<Callout type="error">Error - red</Callout>
```

## Images

1. Place images in `public/images/{service-name}/`
2. Reference as `/images/{service-name}/filename.png`

```mdx
![Alt text](/images/my-service/diagram.png)
```

## What to Prepare

When creating new documentation:

1. **Write in plain Markdown** - `.md` files work, we rename to `.mdx`

2. **Add frontmatter** to each file:
   ```yaml
   ---
   title: Page Title
   description: One line description
   ---
   ```

3. **Mermaid diagrams** - use standard code blocks:
   ~~~markdown
   ```mermaid
   flowchart TD
       A[Step 1] --> B[Step 2]
       B --> C[Step 3]
   ```
   ~~~

4. **Provide page order** - list filenames in desired navigation order

5. **Images** - provide separately, will be placed in public folder

## Mermaid Diagram Examples

### Flowchart

```
flowchart TD
    Start[Start] --> Process[Process Data]
    Process --> Decision{Valid?}
    Decision -->|Yes| Success[Success]
    Decision -->|No| Error[Error]
```

### Sequence Diagram

```
sequenceDiagram
    Client->>API: Request
    API->>Database: Query
    Database-->>API: Result
    API-->>Client: Response
```

### Architecture Diagram

```
flowchart LR
    subgraph Frontend
        UI[React App]
    end
    subgraph Backend
        API[API Server]
        DB[(Database)]
    end
    UI --> API --> DB
```

## Quick Checklist

- [ ] Each file has frontmatter with `title` and `description`
- [ ] Folder has `meta.json` with page order
- [ ] Folder has `index.mdx` as landing page
- [ ] Images are in `public/images/{service-name}/`
- [ ] Mermaid diagrams use standard markdown code blocks

---

## Growth Engine: Email Sequence Documentation

We need documentation for each email playbook showing:
1. **Visual flow diagram** - when emails are sent and under what conditions
2. **Email templates** - the actual content sent to users

### What We Need From You

#### 1. Sequence Diagram for Each Playbook

Create a Mermaid diagram showing the email flow for each playbook. Example format:

```
sequenceDiagram
    participant User
    participant System
    participant Email

    Note over User: Day 0 - Signs up
    System->>Email: Send onboarding-d0
    Email-->>User: "Welcome to Meeting BaaS"

    Note over User: Day 2 - No bot created
    System->>Email: Send onboarding-d2
    Email-->>User: "Ready to create your first bot?"

    alt User creates bot
        User->>System: Creates bot
        Note over System: Stop playbook
    else No action
        Note over User: Day 5
        System->>Email: Send onboarding-d5
        Email-->>User: "Need help getting started?"
    end
```

#### 2. Playbooks to Document

| Playbook | Priority | Emails in Sequence |
|----------|----------|-------------------|
| `onboarding` | 10 | onboarding-d0 → onboarding-d2 → onboarding-d5 |
| `onboarding_api_no_bot` | 11 | onboarding-api-no-bot |
| `failure_recovery` | 100 | failure-* templates based on error type |
| `activation` | 6 | activation-congrats |
| `activation_bot_created` | 6 | activation-bot-created |
| `webhooks_adoption` | 8 | webhooks-adoption → webhooks-adoption-followup |
| `webhooks_polling` | 8 | webhooks-stop-polling |
| `artifacts_reminder` | 9 | artifacts-reminder |
| `calendar_expansion` | 7 | calendar-expansion → calendar-expansion-followup |
| `calendar_no_bots` | 7 | calendar-no-bots |
| `calendar_sync_error` | 50 | calendar-sync-error |
| `winback_3d` | 5 | winback-3d → winback-3d-followup |
| `winback_7d` | 4 | winback-7d |

#### 3. Email Template Content

For each email template, provide a simple markdown file with:

```markdown
# Template: onboarding-d0

**Subject:** Welcome to Meeting BaaS!

**Trigger:** New team created, no bot yet

**Timing:** Immediately after signup

---

## Email Content

Hi {{firstName}},

Welcome to Meeting BaaS! You're now ready to deploy AI bots to your meetings.

Here's how to get started:
1. Create your first bot with our API
2. Join a test meeting
3. See your transcript in minutes

[Create Your First Bot →]({{dashboardUrl}})

Questions? Just reply to this email.

— The Meeting BaaS Team
```

#### 4. How to Submit

**Option A: Quick Drop (Recommended)**

Create a folder with your files:
```
growth-engine-emails/
├── playbooks/
│   ├── onboarding.md         # Diagram + description
│   ├── failure-recovery.md
│   ├── webhooks-adoption.md
│   └── ...
└── templates/
    ├── onboarding-d0.md      # Email content
    ├── onboarding-d2.md
    ├── failure-generic.md
    └── ...
```

**Option B: Single File**

One markdown file with all playbooks and templates:
```markdown
# Growth Engine Email Sequences

## Playbook: Onboarding

<diagram here>

### Template: onboarding-d0
<content>

### Template: onboarding-d2
<content>

---

## Playbook: Failure Recovery

<diagram here>

### Template: failure-generic
<content>
```

#### 5. Template Variables

These variables are available in email templates:

| Variable | Description |
|----------|-------------|
| `{{firstName}}` | User's first name |
| `{{teamName}}` | Team/company name |
| `{{dashboardUrl}}` | Link to dashboard |
| `{{docsUrl}}` | Link to documentation |
| `{{botId}}` | Bot ID (for failure emails) |
| `{{errorMessage}}` | Error description (for failure emails) |
| `{{meetingUrl}}` | Meeting link |

#### 6. Stop Conditions to Document

For each playbook, note when emails stop:
- User replies to email
- User takes the suggested action
- Higher priority playbook starts
- Max emails reached

### Example: Complete Onboarding Playbook Doc

```markdown
# Playbook: Onboarding

**Priority:** 10
**Trigger:** Team created, no bot within 1 hour
**Stop when:** User creates a bot, replies, or unsubscribes

## Sequence Diagram

sequenceDiagram
    participant U as User
    participant S as System

    Note over U: Hour 1 - No bot
    S->>U: onboarding-d0 "Welcome!"

    Note over U: Day 2 - Still no bot
    S->>U: onboarding-d2 "Ready to start?"

    alt Creates bot
        U->>S: Bot created
        Note over S: ✓ Stop playbook
    else Day 5 - No action
        S->>U: onboarding-d5 "Need help?"
    end

## Emails

### onboarding-d0
Subject: Welcome to Meeting BaaS!
<full content...>

### onboarding-d2
Subject: Ready to create your first bot?
<full content...>

### onboarding-d5
Subject: Need help getting started?
<full content...>
```

### Questions?

If you need the exact email content from the codebase, check:
- `api-server/src/growth/templates/` - React Email templates
- `api-server/src/growth/playbooks/` - Playbook definitions with timing
