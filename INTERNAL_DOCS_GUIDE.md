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
