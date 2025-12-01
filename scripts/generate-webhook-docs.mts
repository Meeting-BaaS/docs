import * as fs from 'fs/promises';
import * as path from 'path';
import { rimraf } from 'rimraf';

interface OpenAPISchema {
  type?: string;
  properties?: Record<string, any>;
  required?: string[];
  description?: string;
  enum?: any[];
  anyOf?: any[];
  allOf?: any[];
  oneOf?: any[];
  items?: any;
  format?: string;
  pattern?: string;
  $ref?: string;
  additionalProperties?: boolean | any;
}

interface OpenAPISpec {
  components: {
    schemas: Record<string, OpenAPISchema>;
  };
}

/**
 * Converts a schema to a markdown description
 */
function schemaToMarkdown(schema: OpenAPISchema, indent = 0): string {
  const indentStr = '  '.repeat(indent);
  let markdown = '';

  if (schema.description) {
    markdown += `${indentStr}${schema.description}\n\n`;
  }

  if (schema.type === 'object' && schema.properties) {
    const required = schema.required || [];
    
    for (const [key, value] of Object.entries(schema.properties)) {
      const isRequired = required.includes(key);
      const requiredBadge = isRequired ? '**Required**' : '*Optional*';
      
      markdown += `${indentStr}- **\`${key}\`** (${getTypeString(value)}) ${requiredBadge}\n`;
      
      if (value.description) {
        markdown += `${indentStr}  ${value.description}\n`;
      }
      
      // Recursively handle nested objects
      if (value.type === 'object' && value.properties && indent < 2) {
        markdown += `\n${indentStr}  Properties:\n`;
        markdown += schemaToMarkdown(value, indent + 2);
      }
      
      markdown += '\n';
    }
  } else if (schema.type === 'array' && schema.items) {
    markdown += `${indentStr}Array of ${getTypeString(schema.items)}\n`;
    if (schema.items.description) {
      markdown += `${indentStr}${schema.items.description}\n`;
    }
  }

  return markdown;
}

/**
 * Gets a human-readable type string from a schema
 */
function getTypeString(schema: OpenAPISchema): string {
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop() || '';
    return `[${refName}](#${refName.toLowerCase()})`;
  }
  
  if (schema.anyOf) {
    return schema.anyOf.map(getTypeString).join(' | ');
  }
  
  if (schema.type === 'array' && schema.items) {
    return `${getTypeString(schema.items)}[]`;
  }
  
  if (schema.enum) {
    return schema.enum.map(e => `"${e}"`).join(' | ');
  }
  
  if (schema.format) {
    return `${schema.type} (${schema.format})`;
  }
  
  return schema.type || 'unknown';
}

/**
 * Generates MDX content for a webhook payload schema
 */
function generateWebhookDoc(
  schemaName: string,
  schema: OpenAPISchema,
  spec: OpenAPISpec
): string {
  const isCallback = schemaName.includes('Callback');
  const isWebhook = schemaName.includes('Webhook');
  
  let title = schemaName;
  if (isCallback) {
    title = title.replace('Callback', '').replace('Input', '');
  } else if (isWebhook) {
    title = title.replace('Webhook', '').replace('Input', '');
  }
  
  // Convert camelCase to Title Case
  title = title.replace(/([A-Z])/g, ' $1').trim();
  
  const frontmatter = `---
title: ${title}
description: ${schema.description || `${title} payload structure`}
icon: Webhook
---

${schema.description ? `> ${schema.description}\n` : ''}

## Payload Structure

`;

  let content = frontmatter;
  
  if (schema.type === 'object' && schema.properties) {
    const required = schema.required || [];
    
    content += '| Field | Type | Required | Description |\n';
    content += '|-------|------|----------|-------------|\n';
    
    for (const [key, value] of Object.entries(schema.properties)) {
      const isRequired = required.includes(key) ? 'Yes' : 'No';
      const typeStr = getTypeString(value).replace(/\[|\]/g, '');
      const desc = value.description || '';
      
      content += `| \`${key}\` | ${typeStr} | ${isRequired} | ${desc} |\n`;
    }
    
    content += '\n## Field Details\n\n';
    content += schemaToMarkdown(schema, 0);
  } else {
    content += schemaToMarkdown(schema, 0);
  }
  
  // Add example if available
  content += '\n## Example\n\n';
  content += '```json\n';
  content += generateExample(schema, spec, 0);
  content += '\n```\n';
  
  return content;
}

/**
 * Generates a JSON example from a schema
 */
function generateExample(schema: OpenAPISchema, spec: OpenAPISpec, depth = 0): string {
  if (depth > 3) return '...';
  
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop() || '';
    const refSchema = spec.components.schemas[refName];
    if (refSchema) {
      return generateExample(refSchema, spec, depth + 1);
    }
  }
  
  if (schema.type === 'object' && schema.properties) {
    const indent = '  '.repeat(depth);
    let json = '{\n';
    const entries = Object.entries(schema.properties);
    
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      const isLast = i === entries.length - 1;
      
      json += `${indent}  "${key}": `;
      
      if (value.type === 'string') {
        json += `"example${key}"`;
      } else if (value.type === 'number' || value.type === 'integer') {
        json += '0';
      } else if (value.type === 'boolean') {
        json += 'true';
      } else if (value.type === 'array') {
        json += '[]';
      } else if (value.type === 'object') {
        json += generateExample(value, spec, depth + 1);
      } else if (value.anyOf) {
        const firstNonNull = value.anyOf.find((s: any) => s.type !== 'null');
        if (firstNonNull) {
          json += generateExample(firstNonNull, spec, depth + 1);
        } else {
          json += 'null';
        }
      } else {
        json += 'null';
      }
      
      json += isLast ? '\n' : ',\n';
    }
    
    json += `${indent}}`;
    return json;
  }
  
  if (schema.type === 'array') {
    return '[]';
  }
  
  return 'null';
}

/**
 * Main function to generate webhook documentation
 */
export async function generateWebhookDocs() {
  const openApiPath = './openapi-v2.json';
  const outputDir = './content/docs/api-v2/reference/webhooks';
  
  console.log('Generating webhook documentation...');
  console.log(`Reading OpenAPI spec from: ${openApiPath}`);
  
  // Read OpenAPI spec
  const openApiContent = await fs.readFile(openApiPath, 'utf-8');
  const spec: OpenAPISpec = JSON.parse(openApiContent);
  
  // Filter webhook and callback schemas (exclude Input variants)
  const webhookSchemas = Object.entries(spec.components.schemas).filter(
    ([name]) => 
      (name.includes('Webhook') || name.includes('Callback')) &&
      !name.includes('Input') &&
      !name.includes('RequestBody') &&
      !name.includes('Response')
  );
  
  console.log(`Found ${webhookSchemas.length} webhook/callback schemas:`, webhookSchemas.map(([name]) => name));
  
  // Clean up output directory
  await rimraf(outputDir);
  await fs.mkdir(outputDir, { recursive: true });
  
  // Group by type
  const botWebhooks = webhookSchemas.filter(([name]) => name.startsWith('Bot'));
  const calendarWebhooks = webhookSchemas.filter(([name]) => name.startsWith('Calendar'));
  const callbacks = webhookSchemas.filter(([name]) => name.startsWith('Callback'));
  
  // Generate docs for each schema
  for (const [name, schema] of webhookSchemas) {
    const fileName = name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') + '.mdx';
    const filePath = path.join(outputDir, fileName);
    const content = generateWebhookDoc(name, schema, spec);
    
    await fs.writeFile(filePath, content, 'utf-8');
  }
  
  // Create index file
  const indexContent = `---
title: Webhook & Callback Payloads
description: Reference documentation for all webhook and callback payload structures
icon: Webhook
---

This section contains reference documentation for all webhook and callback payload structures sent by Meeting BaaS v2.

## Bot Webhooks

${botWebhooks.map(([name]) => {
  const fileName = name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') + '.mdx';
  const title = name.replace(/([A-Z])/g, ' $1').trim();
  return `- [${title}](./${fileName.replace('.mdx', '')})`;
}).join('\n')}

## Calendar Webhooks

${calendarWebhooks.map(([name]) => {
  const fileName = name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') + '.mdx';
  const title = name.replace(/([A-Z])/g, ' $1').trim();
  return `- [${title}](./${fileName.replace('.mdx', '')})`;
}).join('\n')}

## Callbacks

${callbacks.map(([name]) => {
  const fileName = name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') + '.mdx';
  const title = name.replace(/([A-Z])/g, ' $1').trim();
  return `- [${title}](./${fileName.replace('.mdx', '')})`;
}).join('\n')}
`;

  await fs.writeFile(path.join(outputDir, 'index.mdx'), indexContent, 'utf-8');
  
  // Create meta.json
  const metaContent = {
    title: 'Webhooks & Callbacks',
    pages: [
      'index',
      ...webhookSchemas.map(([name]) => 
        name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
      )
    ]
  };
  
  await fs.writeFile(
    path.join(outputDir, 'meta.json'),
    JSON.stringify(metaContent, null, 2),
    'utf-8'
  );
  
  console.log(`Generated ${webhookSchemas.length} webhook/callback documentation files`);
}


