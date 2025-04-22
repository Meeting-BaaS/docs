import { writeFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

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

async function updateSDKInfo() {
  try {
    // Fetch package info from npm
    const response = await fetch('https://registry.npmjs.org/@meeting-baas/sdk');
    const data = await response.json() as NpmPackageInfo;

    // Get latest version
    const latestVersion = data['dist-tags'].latest;
    const latestData = data.versions[latestVersion];

    // Create SDK info object
    const sdkInfo = {
      version: latestVersion,
      description: latestData.description,
      homepage: latestData.homepage,
      repository: latestData.repository?.url,
      license: latestData.license,
      dependencies: latestData.dependencies,
      peerDependencies: latestData.peerDependencies,
      lastUpdated: new Date().toISOString()
    };

    // Write to file
    const outputPath = join(process.cwd(), 'content', 'docs', 'typescript-sdk', 'sdk-info.json');
    writeFileSync(outputPath, JSON.stringify(sdkInfo, null, 2));

    console.log(`Updated SDK info to version ${latestVersion}`);
  } catch (error) {
    console.error('Failed to update SDK info:', error);
    process.exit(1);
  }
}

updateSDKInfo(); 