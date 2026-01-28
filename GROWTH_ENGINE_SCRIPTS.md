# Growth Engine Documentation Scripts

Two scripts auto-generate documentation from the `meeting-baas-v2/apps/api-server` codebase.

## Scripts

### 1. `scripts/generate-growth-diagram.cjs`

Generates the **architecture overview** with mermaid diagrams.

```bash
node scripts/generate-growth-diagram.cjs
```

**Output:** `content/docs/growth-engine/index.mdx`

**Features:**
- Scans playbooks, hooks, templates, jobs, SQS types, DB tables
- Generates architecture flowchart
- Component summary table
- Event flow sequence diagram
- Database ER diagram

### 2. `scripts/generate-growth-playbook-docs.cjs`

Generates **detailed playbook pages** with email previews.

```bash
node scripts/generate-growth-playbook-docs.cjs
```

**Output:** `content/docs/growth-engine/playbooks/`
- `index.mdx` - Overview table of all playbooks
- `{playbook-name}.mdx` - Individual page per playbook
- `meta.json` - Navigation config

**Features:**
- Sequence diagram for each playbook
- Email timing table (step, delay, template)
- Stop conditions list
- **Email preview** extracted from HTML templates:
  - Greeting
  - Body paragraphs
  - List items
  - Pro tips
  - CTA buttons
  - Code snippets

## Configuration

Both scripts default to scanning:
```
../../meeting-baas-v2/apps/api-server
```

Override with environment variable:
```bash
API_SERVER_PATH=/path/to/api-server node scripts/generate-growth-diagram.cjs
```

## Generated Structure

```
content/docs/growth-engine/
├── index.mdx                 # Architecture overview
├── meta.json                 # Navigation
└── playbooks/
    ├── index.mdx             # Playbooks table
    ├── meta.json             # Playbooks navigation
    ├── onboarding.mdx        # 3 emails, priority 10
    ├── failure-recovery.mdx  # 1 email, priority 100
    ├── webhooks-adoption.mdx # 2 emails, priority 8
    ├── calendar-expansion.mdx
    ├── artifacts-reminder.mdx
    ├── activation.mdx
    ├── winback-3-day.mdx
    └── ... (13 playbooks total)
```

## MDX Format Notes

The scripts use the baas-docs MDX components:

```mdx
<Mermaid chart={`sequenceDiagram
    A->>B: Message
`} />

<Callout type="info">
  Info message
</Callout>

<Callout type="warning">
  Warning message
</Callout>
```

## Regenerating Docs

Run both scripts after changes to growth engine code:

```bash
cd /path/to/baas-docs
node scripts/generate-growth-diagram.cjs
node scripts/generate-growth-playbook-docs.cjs
```

## What Gets Parsed

| Source File | What's Extracted |
|-------------|------------------|
| `src/services/growth/playbooks.ts` | Playbook definitions, steps, priorities, cooldowns, stop conditions |
| `src/services/growth/hooks.ts` | Integration hook names |
| `src/services/growth/types.ts` | SQS message types |
| `src/database/schema/growth-schema.ts` | Database table names |
| `src/jobs/growth/*.ts` | Background job names |
| `templates/content/growth/*.partial.hbs` | Email HTML content for previews |
