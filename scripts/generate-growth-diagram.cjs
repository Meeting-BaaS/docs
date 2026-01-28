#!/usr/bin/env node
/**
 * Generates a Mermaid diagram of the Growth Engine architecture
 * by analyzing the actual codebase structure.
 *
 * Run: node scripts/generate-growth-diagram.cjs
 * Output: Updates content/docs/growth-engine/index.mdx
 *
 * Note: This script scans the meeting-baas-v2 api-server codebase.
 * Set API_SERVER_PATH env var to override the default path.
 */

const fs = require("fs");
const path = require("path");

// Source: meeting-baas-v2 api-server (can be overridden via env)
const API_SERVER_ROOT = process.env.API_SERVER_PATH || path.join(__dirname, "../../meeting-baas-v2/apps/api-server");
const GROWTH_DIR = path.join(API_SERVER_ROOT, "src/services/growth");
const TEMPLATES_DIR = path.join(API_SERVER_ROOT, "templates/content/growth");
const JOBS_DIR = path.join(API_SERVER_ROOT, "src/jobs/growth");

// Output: baas-docs
const DOCS_ROOT = path.join(__dirname, "..");
const OUTPUT_FILE = path.join(DOCS_ROOT, "content/docs/growth-engine/index.mdx");

// ============================================================================
// File Scanners
// ============================================================================

/**
 * Extract playbook definitions from playbooks.ts
 */
function extractPlaybooks() {
  const filePath = path.join(GROWTH_DIR, "playbooks.ts");
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const playbooks = [];

  // Match playbook definitions: key: { key: "...", name: "...", priority: N, ...}
  const playbookRegex =
    /(\w+):\s*\{\s*key:\s*["'](\w+)["'],\s*name:\s*["']([^"']+)["'],\s*description:\s*["']([^"']+)["'],\s*priority:\s*(\d+)/g;

  let match;
  while ((match = playbookRegex.exec(content)) !== null) {
    playbooks.push({
      varName: match[1],
      key: match[2],
      name: match[3],
      description: match[4],
      priority: parseInt(match[5], 10)
    });
  }

  return playbooks.sort((a, b) => b.priority - a.priority);
}

/**
 * Extract hooks from hooks.ts
 */
function extractHooks() {
  const filePath = path.join(GROWTH_DIR, "hooks.ts");
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const hooks = [];

  // Match export async function onXxx(
  const hookRegex = /export\s+async\s+function\s+(on\w+)\s*\(/g;

  let match;
  while ((match = hookRegex.exec(content)) !== null) {
    hooks.push(match[1]);
  }

  return hooks;
}

/**
 * Extract email templates from templates directory
 */
function extractTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];

  return fs
    .readdirSync(TEMPLATES_DIR)
    .filter((f) => f.endsWith(".partial.hbs"))
    .map((f) => f.replace(".partial.hbs", ""));
}

/**
 * Extract growth event types from types.ts
 */
function extractEventTypes() {
  const filePath = path.join(GROWTH_DIR, "types.ts");
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const events = [];

  // Match event type definitions
  const eventRegex = /(\w+):\s*["']([^"']+)["']/g;
  const eventSection = content.match(
    /GROWTH_EVENT_TYPES\s*=\s*\{([^}]+)\}/s
  );

  if (eventSection) {
    let match;
    while ((match = eventRegex.exec(eventSection[1])) !== null) {
      events.push({ name: match[1], value: match[2] });
    }
  }

  return events;
}

/**
 * Extract SQS message types from sqs/types.ts
 */
function extractSqsMessageTypes() {
  const filePath = path.join(GROWTH_DIR, "sqs/types.ts");
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const types = [];

  // Match schema definitions
  const schemaRegex = /export\s+const\s+(\w+MessageSchema)/g;

  let match;
  while ((match = schemaRegex.exec(content)) !== null) {
    if (match[1] !== "BaseMessageSchema" && match[1] !== "GrowthJobMessageSchema") {
      types.push(match[1].replace("Schema", ""));
    }
  }

  return types;
}

/**
 * Extract growth jobs from jobs directory
 */
function extractJobs() {
  if (!fs.existsSync(JOBS_DIR)) return [];

  return fs
    .readdirSync(JOBS_DIR)
    .filter((f) => f.endsWith("-job.ts"))
    .map((f) => f.replace(".ts", ""));
}

/**
 * Extract database tables from growth-schema.ts
 */
function extractDbTables() {
  const filePath = path.join(API_SERVER_ROOT, "src/database/schema/growth-schema.ts");
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const tables = [];

  // Match table definitions: export const tableName = pgTable(
  const tableRegex = /export\s+const\s+(\w+)\s*=\s*pgTable\s*\(\s*["']([^"']+)["']/g;

  let match;
  while ((match = tableRegex.exec(content)) !== null) {
    tables.push({ varName: match[1], tableName: match[2] });
  }

  return tables;
}

// ============================================================================
// Diagram Generator
// ============================================================================

function generateMermaid(data) {
  const { playbooks, hooks, templates, jobs, sqsTypes, dbTables } = data;

  // Group playbooks by priority tier
  const highPriority = playbooks.filter((p) => p.priority >= 50);
  const medPriority = playbooks.filter((p) => p.priority >= 7 && p.priority < 50);
  const lowPriority = playbooks.filter((p) => p.priority < 7);

  // Group templates by category
  const templateCategories = {
    onboarding: templates.filter((t) => t.startsWith("onboarding")),
    activation: templates.filter((t) => t.startsWith("activation")),
    failure: templates.filter((t) => t.startsWith("failure")),
    winback: templates.filter((t) => t.startsWith("winback")),
    webhooks: templates.filter((t) => t.startsWith("webhooks")),
    calendar: templates.filter((t) => t.startsWith("calendar")),
    artifacts: templates.filter((t) => t.startsWith("artifacts"))
  };

  return `flowchart TB
    subgraph TRIGGERS["Event Triggers"]
        direction LR
        API["API Controllers"]
        CRON["Cron Jobs<br/>${jobs.length} jobs"]
        WEBHOOK["Resend Webhooks"]
    end

    subgraph HOOKS["Integration Hooks (${hooks.length})"]
        direction LR
${hooks.map((h, i) => `        H${i + 1}["${h}"]`).join("\n")}
    end

    subgraph CRON_JOBS["Background Scanners"]
        direction LR
${jobs
  .filter((j) => j !== "growth-sqs-worker-job")
  .map((j, i) => `        C${i + 1}["${j.replace("growth-", "").replace("-job", "")}"]`)
  .join("\n")}
    end

    subgraph SQS["AWS SQS Queue"]
        QUEUE[("growth-jobs<br/>${sqsTypes.length} message types")]
    end

    subgraph ORCHESTRATOR["Playbook Orchestrator"]
        direction TB
        EVAL["evaluateTriggersForEvent"]
        START["startPlaybook"]
        STOP["stopPlaybook"]
        SEND["sendStep"]
        CHECK["checkStopConditions"]
    end

    subgraph PLAYBOOKS["Playbook Engine (${playbooks.length} playbooks)"]
        direction TB

        subgraph PB_HIGH["High Priority (50-100)"]
${highPriority.map((p) => `            PB_${p.key}["${p.key}<br/>Priority: ${p.priority}"]`).join("\n") || '            PB_NONE_H["(none)"]'}
        end

        subgraph PB_MED["Medium Priority (7-49)"]
${medPriority.map((p) => `            PB_${p.key}["${p.key}<br/>Priority: ${p.priority}"]`).join("\n") || '            PB_NONE_M["(none)"]'}
        end

        subgraph PB_LOW["Low Priority (1-6)"]
${lowPriority.map((p) => `            PB_${p.key}["${p.key}<br/>Priority: ${p.priority}"]`).join("\n") || '            PB_NONE_L["(none)"]'}
        end
    end

    subgraph CONTEXT["Context Builder"]
        CTX["buildPlaybookContext"]
        CTX_DATA["Team Data<br/>Tracking Data<br/>Recent Bots<br/>Integrations<br/>Email History"]
    end

    subgraph TEMPLATES["Email Templates (${templates.length})"]
        direction LR
        T_ON["Onboarding<br/>${templateCategories.onboarding.length} templates"]
        T_ACT["Activation<br/>${templateCategories.activation.length} templates"]
        T_FAIL["Failure<br/>${templateCategories.failure.length} templates"]
        T_WB["Winback<br/>${templateCategories.winback.length} templates"]
        T_WH["Webhooks<br/>${templateCategories.webhooks.length} templates"]
        T_CAL["Calendar<br/>${templateCategories.calendar.length} templates"]
        T_ART["Artifacts<br/>${templateCategories.artifacts.length} templates"]
    end

    subgraph EMAIL["Email Delivery"]
        RENDER["renderGrowthTemplate"]
        RESEND["Resend API"]
    end

    subgraph DATABASE["PostgreSQL (${dbTables.length} tables)"]
        direction LR
${dbTables.map((t) => `        DB_${t.varName}[("${t.tableName}")]`).join("\n")}
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
    class TEMPLATES,EMAIL,RESEND_HOOKS email`;
}

function generatePlaybookTable(playbooks) {
  const rows = playbooks.map(
    (p) => `| \`${p.key}\` | ${p.priority} | ${p.description} |`
  );

  return `| Playbook | Priority | Description |
|----------|----------|-------------|
${rows.join("\n")}`;
}

function generateTemplateTable(templates) {
  const rows = templates.map((t) => `| \`${t}\` |`);

  return `| Template |
|----------|
${rows.join("\n")}`;
}

function generateHooksList(hooks) {
  return hooks.map((h) => `- \`${h}()\``).join("\n");
}

function generateJobsTable(jobs) {
  const rows = jobs.map((j) => `| \`${j}\` |`);

  return `| Job |
|-----|
${rows.join("\n")}`;
}

function generateDbSchema(dbTables) {
  return `<Mermaid chart={\`erDiagram
    teams ||--o{ growth_events : "logs"
    teams ||--o| team_playbook_state : "has"
    teams ||--o| team_growth_tracking : "has"
    teams ||--o{ growth_email_jobs : "schedules"

${dbTables
  .map(
    (t) => `    ${t.tableName} {
        id PK
        team_id FK
    }`
  )
  .join("\n\n")}
\`} />`;
}

// ============================================================================
// Markdown Generator
// ============================================================================

function generateMarkdown(data) {
  const { playbooks, hooks, templates, jobs, sqsTypes, dbTables } = data;
  const generatedAt = new Date().toISOString();

  const mermaidDiagram = generateMermaid(data);

  return `---
title: Growth Engine
description: Product-driven email automation system for adaptive user engagement sequences
icon: Mail
---

# Growth Engine - Email Automation System

Product-driven outreach system for adaptive email sequences. Sends contextual emails based on user behavior, with automatic stop conditions and priority-based playbook management.

<Callout type="info">
  Auto-generated: ${generatedAt}. Run \`node scripts/generate-growth-diagram.cjs\` to update.
</Callout>

<Callout type="info">
  The Growth Engine automatically stops sending emails when a user replies, configures webhooks, or takes the suggested action.
</Callout>

## Architecture Overview

<Mermaid chart={\`${mermaidDiagram}\`} />

## Component Summary

| Component | Count |
|-----------|-------|
| Playbooks | ${playbooks.length} |
| Email Templates | ${templates.length} |
| Integration Hooks | ${hooks.length} |
| Background Jobs | ${jobs.length} |
| SQS Message Types | ${sqsTypes.length} |
| Database Tables | ${dbTables.length} |

## Playbooks

Playbooks are email sequences triggered by specific user behaviors. Higher priority playbooks can interrupt lower priority ones.

${generatePlaybookTable(playbooks)}

## Integration Hooks

These hooks are called from various API controllers to trigger growth events:

${generateHooksList(hooks)}

## Email Templates

${generateTemplateTable(templates)}

## Background Jobs

${generateJobsTable(jobs)}

## Database Tables

${generateDbSchema(dbTables)}

## Event Flow

<Mermaid chart={\`sequenceDiagram
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
\`} />

## Priority System

<Callout type="warning">
  The \`failure_recovery\` playbook (priority 100) will interrupt any other active playbook to ensure users get help immediately when something goes wrong.
</Callout>

Higher priority playbooks can interrupt lower priority ones:

\`\`\`
${playbooks.map((p) => `${String(p.priority).padStart(3, " ")}: ${p.key}`).join("\n")}
\`\`\`

## Stop Conditions

Playbooks automatically stop when:

1. **User replies** to any growth email
2. **User takes action** (e.g., configures webhooks, connects calendar)
3. **Higher priority playbook** starts
4. **Max emails reached** for that playbook
5. **User unsubscribes** from growth emails
`;
}

// ============================================================================
// Main
// ============================================================================

function main() {
  console.log("Scanning growth engine...");

  const data = {
    playbooks: extractPlaybooks(),
    hooks: extractHooks(),
    templates: extractTemplates(),
    jobs: extractJobs(),
    sqsTypes: extractSqsMessageTypes(),
    dbTables: extractDbTables()
  };

  console.log(`  Playbooks: ${data.playbooks.length}`);
  console.log(`  Hooks: ${data.hooks.length}`);
  console.log(`  Templates: ${data.templates.length}`);
  console.log(`  Jobs: ${data.jobs.length}`);
  console.log(`  SQS Types: ${data.sqsTypes.length}`);
  console.log(`  DB Tables: ${data.dbTables.length}`);

  const markdown = generateMarkdown(data);

  // Ensure directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, markdown);
  console.log(`\nGenerated: ${OUTPUT_FILE}`);
}

main();
