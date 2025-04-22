import env from '@next/env';
import { updateSearchIndexes } from './update-orama-index.mjs';
import { updateOramaAi } from './update-orama-ai.mjs';

env.loadEnvConfig(process.cwd());

async function main() {
  await Promise.all([updateSearchIndexes(), updateOramaAi()]);
}

main().catch(console.error);
