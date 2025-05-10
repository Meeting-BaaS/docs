import { execSync } from 'child_process';
import minimist from 'minimist';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

interface UpdateOptions {
  service: string;
  days: number;
  key?: string;
  verbose?: boolean;
  model?: string;
  overwrite?: boolean;
}

async function main() {
  // Parse command line arguments using minimist
  const argv = minimist(process.argv.slice(2));
  const options: UpdateOptions = {
    service: argv.service || '',
    days: parseInt(argv.days || '90', 10),
    key: argv.key,
    verbose: argv.verbose || false,
    model: argv.model,
    overwrite: argv.overwrite || false,
  };

  if (!options.service) {
    console.error('Error: Service name is required');
    process.exit(1);
  }

  // Get OpenRouter key
  const key = options.key || process.env.OPENROUTER_API_KEY;

  if (!key) {
    console.error('Error: OpenRouter API key is required');
    process.exit(1);
  }

  try {
    // Step 1: Restart service
    console.log(`\n🔄 Restarting service: ${options.service} (${options.days} days)`);
    const overwriteFlag = options.overwrite ? '--overwrite' : '';
    execSync(`SERVICE=${options.service} DAYS=${options.days} ./git_greppers/restart-service.sh ${overwriteFlag}`, { stdio: 'inherit' });

    // Step 2: Clean git updates for this service only
    console.log('\n🧹 Cleaning git updates...');
    execSync(`pnpm clean:git-updates "${options.service}"`, { stdio: 'inherit' });

    // Step 3: Generate updates
    console.log('\n📝 Generating updates...');
    const testArgs = [
      '--service', options.service,
      ...(options.overwrite ? ['--overwrite'] : []),
    ];
    execSync(`pnpm test:git-updates ${testArgs.join(' ')}`, { stdio: 'inherit' });

    // Step 4: Enhance updates
    console.log('\n✨ Enhancing updates...');
    const enhanceArgs = [
      '--service', options.service,
      '--key', key,
      '--days', options.days.toString(),
      ...(options.verbose ? ['--verbose'] : []),
      ...(options.model ? ['--model', options.model] : []),
    ];
    execSync(`pnpm enhance:updates ${enhanceArgs.join(' ')}`, { stdio: 'inherit' });

    console.log('\n✅ Update and enhancement complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error); 