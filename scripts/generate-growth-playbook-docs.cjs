#!/usr/bin/env node
/**
 * Generates detailed documentation for each Growth Engine playbook
 * including sequence diagrams and email template content.
 *
 * Run: node scripts/generate-growth-playbook-docs.cjs
 * Output: content/docs/growth-engine/playbooks.mdx
 */

const fs = require("fs");
const path = require("path");

// Source: meeting-baas-v2 api-server
const API_SERVER_ROOT = process.env.API_SERVER_PATH || path.join(__dirname, "../../meeting-baas-v2/apps/api-server");
const PLAYBOOKS_FILE = path.join(API_SERVER_ROOT, "src/services/growth/playbooks.ts");
const TEMPLATES_DIR = path.join(API_SERVER_ROOT, "templates/content/growth");

// Output: baas-docs
const DOCS_ROOT = path.join(__dirname, "..");
const OUTPUT_FILE = path.join(DOCS_ROOT, "content/docs/growth-engine/playbooks.mdx");

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

  // Extract each playbook block
  const playbookRegex = /(\w+):\s*\{\s*key:\s*["'](\w+)["'],\s*name:\s*["']([^"']+)["'],\s*description:\s*["']([^"']+)["'],\s*priority:\s*(\d+),\s*cooldownHours:\s*([^,]+),/g;

  let match;
  while ((match = playbookRegex.exec(content)) !== null) {
    const key = match[2];

    // Extract steps for this playbook
    const stepsMatch = content.match(new RegExp(`${match[1]}:\\s*\\{[^}]*steps:\\s*\\[([\\s\\S]*?)\\]`, 'm'));
    const steps = [];

    if (stepsMatch) {
      const stepsContent = stepsMatch[1];
      const stepRegex = /\{\s*key:\s*["']([^"']+)["'],\s*delayHours:\s*([^,]+),\s*kind:\s*["']?([^"',\n}]+)/g;
      let stepMatch;
      while ((stepMatch = stepRegex.exec(stepsContent)) !== null) {
        steps.push({
          key: stepMatch[1],
          delayHours: parseFloat(stepMatch[2]) || 0,
          kind: stepMatch[3].replace(/["']/g, '').trim()
        });
      }
    }

    // Extract stop conditions
    const stopConditions = [];
    const stopMatch = content.match(new RegExp(`${match[1]}:[\\s\\S]*?stopConditions:\\s*\\[([\\s\\S]*?)\\]`, 'm'));
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
      varName: match[1],
      key,
      name: match[3],
      description: match[4],
      priority: parseInt(match[5], 10),
      cooldownHours: match[6].trim(),
      steps,
      stopConditions
    });
  }

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
// Template Parser
// ============================================================================

function parseTemplate(kind) {
  const filename = kind.replace(/_/g, '-') + '.partial.hbs';
  const filepath = path.join(TEMPLATES_DIR, filename);

  if (!fs.existsSync(filepath)) {
    return null;
  }

  const content = fs.readFileSync(filepath, "utf-8");

  // Extract text content from HTML
  let text = content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract key sections
  const greeting = text.match(/Hi \{\{firstName\}\},?\s*([^.!]+[.!])/);
  const mainMessage = greeting ? greeting[1].trim() : text.substring(0, 100);

  // Extract CTA button text
  const ctaMatch = content.match(/<a[^>]*>([^<]+)<\/a>\s*<\/td>\s*<\/tr>\s*<\/tbody>\s*<\/table>\s*$/);
  const cta = ctaMatch ? ctaMatch[1].trim() : null;

  // Extract tips/highlights
  const tipMatch = content.match(/Power User Tip<\/p>\s*<p[^>]*>([^<]+)/);
  const tip = tipMatch ? tipMatch[1].trim() : null;

  return {
    kind,
    filename,
    mainMessage,
    cta,
    tip,
    rawLength: content.length
  };
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

  // Add trigger note
  lines.push(`    Note over S: Trigger: ${playbook.description}`);
  lines.push('');

  // Add steps
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

  // Add stop conditions
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
// MDX Generator
// ============================================================================

/**
 * Escape curly braces for MDX (JSX) - prevents parsing as expressions
 */
function escapeMdx(text) {
  if (!text) return text;
  // Escape single braces that aren't part of template literals
  return text
    .replace(/\{([^{])/g, '\\{$1')
    .replace(/([^}])\}/g, '$1\\}')
    // Handle double braces (template variables) - escape both
    .replace(/\{\{/g, '\\{\\{')
    .replace(/\}\}/g, '\\}\\}');
}

function generateMdx(playbooks, templates) {
  const generatedAt = new Date().toISOString();

  let mdx = `---
title: Email Playbooks
description: Detailed documentation for each Growth Engine email sequence
icon: BookOpen
---

# Email Playbooks

<Callout type="info">
  Auto-generated: ${generatedAt}. Run \`node scripts/generate-growth-playbook-docs.cjs\` to update.
</Callout>

Each playbook is an automated email sequence triggered by specific user behaviors. Higher priority playbooks can interrupt lower priority ones.

## Quick Reference

| Playbook | Priority | Emails | Cooldown |
|----------|----------|--------|----------|
${playbooks.map(p => `| [${p.name}](#${p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}) | ${p.priority} | ${p.steps.length} | ${formatCooldown(p.cooldownHours)} |`).join('\n')}

---

`;

  // Generate section for each playbook
  playbooks.forEach(playbook => {
    mdx += `## ${playbook.name}

**Key:** \`${playbook.key}\`
**Priority:** ${playbook.priority}
**Cooldown:** ${formatCooldown(playbook.cooldownHours)}

> ${playbook.description}

### Sequence

<Mermaid chart={\`${generateSequenceDiagram(playbook)}\`} />

### Email Steps

| Step | Delay | Template |
|------|-------|----------|
${playbook.steps.map(s => `| ${s.key} | ${formatDelay(s.delayHours)} | \`${s.kind.replace(/_/g, '-')}\` |`).join('\n')}

### Stop Conditions

${playbook.stopConditions.length > 0
  ? playbook.stopConditions.map(c => `- ${c}`).join('\n')
  : '- User replies to email'}

### Templates

`;

    // Add template details
    playbook.steps.forEach(step => {
      const template = templates[step.kind];
      const templateName = step.kind.replace(/_/g, '-');

      mdx += `#### ${templateName}

`;

      if (template) {
        mdx += `**Summary:** ${escapeMdx(template.mainMessage)}

`;
        if (template.cta) {
          mdx += `**CTA:** ${escapeMdx(template.cta)}

`;
        }
        if (template.tip) {
          mdx += `<Callout type="info">
  **Power User Tip:** ${escapeMdx(template.tip)}
</Callout>

`;
        }
      } else {
        mdx += `*Template content not found*

`;
      }
    });

    mdx += `---

`;
  });

  // Add variables reference
  mdx += `## Template Variables

These variables are available in all email templates:

| Variable | Description |
|----------|-------------|
| \`\\{\\{firstName\\}\\}\` | User's first name |
| \`\\{\\{teamName\\}\\}\` | Team/company name |
| \`\\{\\{email\\}\\}\` | User's email address |
| \`\\{\\{dashboardUrl\\}\\}\` | Link to dashboard |
| \`\\{\\{docsUrl\\}\\}\` | Link to documentation |
| \`\\{\\{botId\\}\\}\` | Bot ID (for failure emails) |
| \`\\{\\{errorCode\\}\\}\` | Error code (for failure emails) |
| \`\\{\\{errorMessage\\}\\}\` | Error description |
| \`\\{\\{meetingUrl\\}\\}\` | Meeting link |
| \`\\{\\{unsubscribeUrl\\}\\}\` | Unsubscribe link |
`;

  return mdx;
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

  console.log("Generating MDX...");
  const mdx = generateMdx(playbooks, templates);

  // Ensure directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, mdx);
  console.log(`\nGenerated: ${OUTPUT_FILE}`);
}

main();
