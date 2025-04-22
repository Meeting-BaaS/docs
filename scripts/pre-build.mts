import { generateDocs } from './generate-docs.mjs';
import { generateSDKUpdates } from './generate-sdk-updates.mjs';
import { generateSDKReference } from './generate-sdk-reference.mjs';
import { generateAPIUpdates } from './generate-api-updates.mjs';

async function main() {
  await Promise.all([
    generateDocs(),
    generateSDKUpdates(),
    generateSDKReference(),
    generateAPIUpdates()
  ]);
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
});
