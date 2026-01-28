#!/usr/bin/env node
/**
 * Generates detailed documentation for each Growth Engine playbook
 * including sequence diagrams and email template previews.
 *
 * Run: node scripts/generate-growth-playbook-docs.cjs
 * Output: content/docs/growth-engine/playbooks/
 */

const fs = require("fs");
const path = require("path");

// Source: meeting-baas-v2 api-server
const API_SERVER_ROOT = process.env.API_SERVER_PATH || path.join(__dirname, "../../meeting-baas-v2/apps/api-server");
const PLAYBOOKS_FILE = path.join(API_SERVER_ROOT, "src/services/growth/playbooks.ts");
const TEMPLATES_DIR = path.join(API_SERVER_ROOT, "templates/content/growth");

// Output: baas-docs
const DOCS_ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(DOCS_ROOT, "content/docs/growth-engine/playbooks");

// ============================================================================
// Playbook Parser
// ============================================================================

function parsePlaybooks() {
  if (!fs.existsSync(PLAYBOOKS_FILE)) {
    console.error(`Playbooks file not found: ${PLAYBOOKS_FILE}`);
    return [];
  }

  const content = fs.readFileSync(PLAYBOOKS_FILE, "utf-8");
  const playbooks = [];

  const playbookKeys = [
    'onboarding', 'winback_3d', 'winback_7d', 'failure_recovery',
    'webhooks_adoption', 'calendar_expansion', 'artifacts_reminder',
    'activation', 'onboarding_api_no_bot', 'activation_bot_created',
    'webhooks_polling', 'calendar_no_bots', 'calendar_sync_error'
  ];

  playbookKeys.forEach(key => {
    const varPattern = new RegExp(`(\\w+):\\s*\\{\\s*key:\\s*["']${key}["']`, 'm');
    const varMatch = content.match(varPattern);
    if (!varMatch) return;

    const varName = varMatch[1];
    const startIdx = content.indexOf(varMatch[0]);
    if (startIdx === -1) return;

    // Extract block by counting braces
    let braceCount = 0;
    let blockStart = -1;
    let blockEnd = -1;

    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '{') {
        if (blockStart === -1) blockStart = i;
        braceCount++;
      } else if (content[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          blockEnd = i + 1;
          break;
        }
      }
    }

    if (blockStart === -1 || blockEnd === -1) return;
    const block = content.slice(blockStart, blockEnd);

    const nameMatch = block.match(/name:\s*["']([^"']+)["']/);
    const descMatch = block.match(/description:\s*["']([^"']+)["']/);
    const priorityMatch = block.match(/priority:\s*(\d+)/);
    const cooldownMatch = block.match(/cooldownHours:\s*([^,\n]+)/);

    // Extract steps
    const stepsStart = block.indexOf('steps:');
    const steps = [];

    if (stepsStart !== -1) {
      const arrayStart = block.indexOf('[', stepsStart);
      let arrayBraceCount = 0;
      let arrayEnd = -1;

      for (let i = arrayStart; i < block.length; i++) {
        if (block[i] === '[') arrayBraceCount++;
        else if (block[i] === ']') {
          arrayBraceCount--;
          if (arrayBraceCount === 0) {
            arrayEnd = i + 1;
            break;
          }
        }
      }

      if (arrayEnd !== -1) {
        const stepsBlock = block.slice(arrayStart, arrayEnd);
        const stepRegex = /\{\s*key:\s*["']([^"']+)["'][^}]*delayHours:\s*([0-9.]+)[^}]*kind:\s*["']([^"']+)["']/g;
        let stepMatch;
        while ((stepMatch = stepRegex.exec(stepsBlock)) !== null) {
          steps.push({
            key: stepMatch[1],
            delayHours: parseFloat(stepMatch[2]) || 0,
            kind: stepMatch[3]
          });
        }

        if (steps.length === 0) {
          const altRegex = /\{\s*key:\s*["']([^"']+)["'][^}]*delayHours:\s*([0-9.]+)/g;
          while ((stepMatch = altRegex.exec(stepsBlock)) !== null) {
            const kindMatch = stepsBlock.slice(stepMatch.index).match(/kind:\s*["']([^"']+)["']/);
            const dynamicKind = stepsBlock.slice(stepMatch.index).match(/kind:\s*\(ctx\)/);
            steps.push({
              key: stepMatch[1],
              delayHours: parseFloat(stepMatch[2]) || 0,
              kind: kindMatch ? kindMatch[1] : (dynamicKind ? 'dynamic' : 'unknown')
            });
          }
        }
      }
    }

    // Extract stop conditions
    const stopConditions = [];
    const stopMatch = block.match(/stopConditions:\s*\[([\s\S]*?)\]/);
    if (stopMatch) {
      const conditions = stopMatch[1].match(/reason:\s*STOP_REASONS\.(\w+)/g);
      if (conditions) {
        conditions.forEach(c => {
          const reason = c.match(/STOP_REASONS\.(\w+)/)[1];
          stopConditions.push(formatStopReason(reason));
        });
      }
    }

    playbooks.push({
      varName,
      key,
      name: nameMatch ? nameMatch[1] : key,
      description: descMatch ? descMatch[1] : '',
      priority: priorityMatch ? parseInt(priorityMatch[1], 10) : 0,
      cooldownHours: cooldownMatch ? cooldownMatch[1].trim() : '24',
      steps,
      stopConditions
    });
  });

  return playbooks.sort((a, b) => b.priority - a.priority);
}

function formatStopReason(reason) {
  const mapping = {
    BOT_CREATED: "User creates a bot",
    BOT_ACTIVATED: "Bot completes successfully",
    EMAIL_REPLIED: "User replies to email",
    API_ACTIVITY: "API activity resumes",
    WEBHOOK_CONFIGURED: "Webhook or callback configured",
    CALENDAR_CONNECTED: "Calendar connected",
    ARTIFACTS_FETCHED: "Artifacts (recording/transcript) fetched"
  };
  return mapping[reason] || reason.toLowerCase().replace(/_/g, ' ');
}

function formatDelay(hours) {
  if (hours === 0) return "Immediately";
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours === 1) return "1 hour";
  if (hours < 24) return `${hours} hours`;
  if (hours === 24) return "1 day";
  if (hours === 48) return "2 days";
  if (hours === 72) return "3 days";
  if (hours === 120) return "5 days";
  return `${Math.round(hours / 24)} days`;
}

function formatCooldown(cooldown) {
  if (cooldown.includes('*')) {
    const match = cooldown.match(/(\d+)\s*\*\s*24/);
    if (match) return `${match[1]} days`;
  }
  const hours = parseInt(cooldown);
  if (hours >= 24) return `${Math.round(hours / 24)} days`;
  return `${hours} hours`;
}

// ============================================================================
// Template Parser - Enhanced for Email Preview
// ============================================================================

function parseTemplate(kind) {
  const filename = kind.replace(/_/g, '-') + '.partial.hbs';
  const filepath = path.join(TEMPLATES_DIR, filename);

  if (!fs.existsSync(filepath)) {
    return null;
  }

  const rawHtml = fs.readFileSync(filepath, "utf-8");

  // Extract structured content from HTML
  const sections = [];

  // Extract greeting
  const greetingMatch = rawHtml.match(/Hi \{\{firstName\}\},?/);
  if (greetingMatch) {
    sections.push({ type: 'greeting', content: 'Hi {{firstName}},' });
  }

  // Extract main paragraphs (first few <p> tags after greeting)
  const paragraphs = [];
  const pRegex = /<p[^>]*>([^<]+(?:<[^p][^>]*>[^<]*<\/[^p]+>)*[^<]*)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(rawHtml)) !== null) {
    let text = pMatch[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text && text.length > 10 && !text.startsWith('Hi {{')) {
      paragraphs.push(text);
    }
  }
  if (paragraphs.length > 0) {
    sections.push({ type: 'body', content: paragraphs.slice(0, 3) });
  }

  // Extract list items (key points)
  const listItems = [];
  const liRegex = /<li[^>]*>([^<]+(?:<[^/][^>]*>[^<]*<\/[^l]+>)*[^<]*)<\/li>/gi;
  let liMatch;
  while ((liMatch = liRegex.exec(rawHtml)) !== null) {
    let text = liMatch[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text && text.length > 5) {
      listItems.push(text);
    }
  }
  if (listItems.length > 0) {
    sections.push({ type: 'list', content: listItems.slice(0, 5) });
  }

  // Extract highlighted boxes (tips, warnings)
  const tipMatch = rawHtml.match(/Power User Tip<\/p>\s*<p[^>]*>([^<]+)/);
  if (tipMatch) {
    sections.push({ type: 'tip', content: tipMatch[1].trim() });
  }

  // Extract CTA button
  const ctaMatch = rawHtml.match(/<a[^>]*style="[^"]*background-color[^"]*"[^>]*>([^<]+)<\/a>/);
  if (ctaMatch) {
    sections.push({ type: 'cta', content: ctaMatch[1].trim() });
  }

  // Extract code snippets
  const codeMatch = rawHtml.match(/<pre[^>]*>([^<]+)<\/pre>/);
  if (codeMatch) {
    sections.push({ type: 'code', content: codeMatch[1].trim() });
  }

  return {
    kind,
    filename,
    sections,
    rawLength: rawHtml.length
  };
}

function renderEmailPreview(template) {
  if (!template || !template.sections || template.sections.length === 0) {
    return '*Template preview not available*';
  }

  let preview = '';

  template.sections.forEach(section => {
    switch (section.type) {
      case 'greeting':
        preview += `**${escapeMdx(section.content)}**\n\n`;
        break;
      case 'body':
        section.content.forEach(p => {
          preview += `${escapeMdx(p)}\n\n`;
        });
        break;
      case 'list':
        section.content.forEach(item => {
          preview += `- ${escapeMdx(item)}\n`;
        });
        preview += '\n';
        break;
      case 'tip':
        preview += `> **Pro Tip:** ${escapeMdx(section.content)}\n\n`;
        break;
      case 'code':
        preview += `\`\`\`\n${section.content}\n\`\`\`\n\n`;
        break;
      case 'cta':
        preview += `**[${escapeMdx(section.content)}]** *(button)*\n\n`;
        break;
    }
  });

  return preview.trim();
}

// ============================================================================
// Sequence Diagram Generator
// ============================================================================

function generateSequenceDiagram(playbook) {
  const lines = [];
  lines.push('sequenceDiagram');
  lines.push('    participant U as User');
  lines.push('    participant S as System');
  lines.push('    participant E as Email');
  lines.push('');
  lines.push(`    Note over S: Trigger: ${playbook.description}`);
  lines.push('');

  playbook.steps.forEach((step, i) => {
    const delay = formatDelay(step.delayHours);
    const templateName = step.kind.replace(/_/g, '-');

    if (i === 0) {
      lines.push(`    Note over U: ${delay}`);
    } else {
      lines.push('');
      lines.push(`    Note over U: +${delay}`);
    }

    lines.push(`    S->>E: Send ${templateName}`);
    lines.push(`    E-->>U: Email delivered`);
  });

  if (playbook.stopConditions.length > 0) {
    lines.push('');
    lines.push('    alt Stop Condition Met');
    playbook.stopConditions.forEach((cond, i) => {
      if (i === 0) {
        lines.push(`        U->>S: ${cond}`);
      } else {
        lines.push(`    else`);
        lines.push(`        U->>S: ${cond}`);
      }
    });
    lines.push('        Note over S: Playbook stops');
    lines.push('    end');
  }

  return lines.join('\n');
}

// ============================================================================
// MDX Helpers
// ============================================================================

function escapeMdx(text) {
  if (!text) return text;
  // Escape ALL curly braces for MDX - simple and consistent
  return text
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}');
}

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ============================================================================
// MDX Generators
// ============================================================================

function generateIndexMdx(playbooks) {
  const generatedAt = new Date().toISOString();

  return `---
title: Email Playbooks
description: Automated email sequences for user engagement
icon: BookOpen
---

# Email Playbooks

<Callout type="info">
  Auto-generated: ${generatedAt}
</Callout>

Each playbook is an automated email sequence triggered by specific user behaviors. Higher priority playbooks can interrupt lower priority ones.

## All Playbooks

| Playbook | Priority | Emails | Cooldown | Description |
|----------|----------|--------|----------|-------------|
${playbooks.map(p => `| [${p.name}](./playbooks/${slugify(p.name)}) | ${p.priority} | ${p.steps.length} | ${formatCooldown(p.cooldownHours)} | ${p.description} |`).join('\n')}

## Priority System

<Callout type="warning">
  Higher priority playbooks interrupt lower priority ones. The \`failure_recovery\` playbook (priority 100) will always take precedence.
</Callout>

\`\`\`
${playbooks.map(p => `${String(p.priority).padStart(3, ' ')}: ${p.key}`).join('\n')}
\`\`\`

## Stop Conditions

All playbooks stop when:
- User **replies** to any growth email
- User **takes the suggested action** (creates bot, configures webhook, etc.)
- A **higher priority playbook** starts
- **Cooldown period** hasn't elapsed since last run
`;
}

function generatePlaybookMdx(playbook, templates) {
  const generatedAt = new Date().toISOString();

  let mdx = `---
title: "${playbook.name}"
description: "${playbook.description}"
icon: Mail
---

# ${playbook.name}

<Callout type="info">
  **Priority:** ${playbook.priority} | **Emails:** ${playbook.steps.length} | **Cooldown:** ${formatCooldown(playbook.cooldownHours)}
</Callout>

> ${playbook.description}

## Sequence Diagram

<Mermaid chart={\`${generateSequenceDiagram(playbook)}\`} />

## Email Steps

| Step | Delay | Template |
|------|-------|----------|
${playbook.steps.map(s => `| ${s.key} | ${formatDelay(s.delayHours)} | \`${s.kind.replace(/_/g, '-')}\` |`).join('\n')}

## Stop Conditions

${playbook.stopConditions.length > 0
  ? playbook.stopConditions.map(c => `- ${c}`).join('\n')
  : '- User replies to email'}

---

## Email Templates

`;

  // Add each template with preview
  playbook.steps.forEach((step, i) => {
    const template = templates[step.kind];
    const templateName = step.kind.replace(/_/g, '-');

    mdx += `### ${i + 1}. ${templateName}

**Sent:** ${formatDelay(step.delayHours)} after ${i === 0 ? 'trigger' : 'previous email'}

`;

    if (template) {
      mdx += `<Callout type="info">
**Email Preview**

${renderEmailPreview(template)}
</Callout>

`;
    } else {
      mdx += `*Template preview not available*

`;
    }
  });

  return mdx;
}

function generateMetaJson(playbooks) {
  const pages = ['index', ...playbooks.map(p => slugify(p.name))];

  return JSON.stringify({
    title: 'Playbooks',
    icon: 'BookOpen',
    pages
  }, null, 2);
}

// ============================================================================
// Main
// ============================================================================

function main() {
  console.log("Parsing playbooks...");
  const playbooks = parsePlaybooks();
  console.log(`  Found ${playbooks.length} playbooks`);

  console.log("Parsing templates...");
  const templates = {};
  let templateCount = 0;

  playbooks.forEach(p => {
    p.steps.forEach(s => {
      if (!templates[s.kind]) {
        const template = parseTemplate(s.kind);
        if (template) {
          templates[s.kind] = template;
          templateCount++;
        }
      }
    });
  });
  console.log(`  Parsed ${templateCount} templates`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate index
  console.log("Generating index...");
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.mdx'),
    generateIndexMdx(playbooks)
  );

  // Generate individual playbook pages
  console.log("Generating playbook pages...");
  playbooks.forEach(playbook => {
    const filename = `${slugify(playbook.name)}.mdx`;
    fs.writeFileSync(
      path.join(OUTPUT_DIR, filename),
      generatePlaybookMdx(playbook, templates)
    );
  });

  // Generate meta.json
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'meta.json'),
    generateMetaJson(playbooks)
  );

  console.log(`\nGenerated ${playbooks.length + 1} files in: ${OUTPUT_DIR}`);
  console.log("Files:");
  console.log("  - index.mdx (overview)");
  playbooks.forEach(p => {
    console.log(`  - ${slugify(p.name)}.mdx`);
  });
  console.log("  - meta.json");
}

main();
