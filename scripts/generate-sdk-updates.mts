import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { format } from 'date-fns';

interface NpmPackageInfo {
  'dist-tags': {
    latest: string;
  };
  versions: {
    [key: string]: {
      description: string;
      homepage: string;
      repository?: {
        url: string;
      };
      license: string;
      dependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
  };
}

export async function generateSDKUpdates() {
  try {
    // Fetch package info from npm
    const response = await fetch('https://registry.npmjs.org/@meeting-baas/sdk');
    const data = await response.json() as NpmPackageInfo;

    // Get latest version
    const latestVersion = data['dist-tags'].latest;
    const latestData = data.versions[latestVersion];

    // Create updates directory if it doesn't exist
    const updatesDir = join(process.cwd(), 'content', 'docs', 'typescript-sdk', 'updates');
    if (!existsSync(updatesDir)) {
      mkdirSync(updatesDir, { recursive: true });
    }

    // Generate update page
    const updateContent = `---
title: SDK Update ${latestVersion}
description: Latest updates to the Meeting BaaS TypeScript SDK
icon: Code
---

<Callout type="info" icon={<Info className="h-5 w-5" />}>
  ${format(new Date(), 'MMMM do, yyyy')}
</Callout>

We're excited to announce the release of version ${latestVersion} of the Meeting BaaS TypeScript SDK.

## Package Information

- **Version**: ${latestVersion}
- **Description**: ${latestData.description}
- **Homepage**: ${latestData.homepage}
- **Repository**: ${latestData.repository?.url || 'N/A'}
- **License**: ${latestData.license}

## Dependencies

### Main Dependencies
${Object.entries(latestData.dependencies || {}).map(([name, version]) => `- \`${name}\`: ${version}`).join('\n')}

### Peer Dependencies
${Object.entries(latestData.peerDependencies || {}).map(([name, version]) => `- \`${name}\`: ${version}`).join('\n')}

## Migration Guide

To update to version ${latestVersion}, run:

<Tabs groupId='package-manager' persist items={['npm', 'pnpm', 'yarn']}>

\`\`\`bash tab="npm"
npm install @meeting-baas/sdk@${latestVersion}
\`\`\`

\`\`\`bash tab="pnpm"
pnpm add @meeting-baas/sdk@${latestVersion}
\`\`\`

\`\`\`bash tab="yarn"
yarn add @meeting-baas/sdk@${latestVersion}
\`\`\`

</Tabs>

## Implementation Timeline

This version is now available on npm.
`;

    // Write update page
    const updatePath = join(updatesDir, `sdk-update-${latestVersion}.mdx`);
    writeFileSync(updatePath, updateContent);

    // Update meta.json to include the updates section
    const metaPath = join(process.cwd(), 'content', 'docs', 'typescript-sdk', 'meta.json');
    const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
    
    if (!meta.pages.includes('updates')) {
      meta.pages.push('updates');
      writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    }

    console.log(`Generated SDK update page for version ${latestVersion}`);
  } catch (error) {
    console.error('Failed to generate SDK updates:', error);
    process.exit(1);
  }
} 