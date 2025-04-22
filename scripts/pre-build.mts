import { generateDocs } from './generate-docs.mjs';
import { generateSDKUpdates } from './generate-sdk-updates.mjs';

async function main() {
  await Promise.all([
    generateDocs(),
    generateSDKUpdates()
  ]);
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
});
