import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Get all files in the content/llm directory
    const llmContentDir = path.join(process.cwd(), 'content/llm');
    const files = fs.readdirSync(llmContentDir);

    // Convert file names to routes
    const routes = files.map((file) => {
      // Remove .md extension and convert hyphens to slashes
      const baseName = file.replace('.md', '');

      // Handle special cases for weekly updates
      const updatePattern = /updates-year-\d{4}-week-\d{1,2}/;
      if (updatePattern.exec(baseName)) {
        // Convert updates-year-2025-week-11.md to /llms/updates/year/2025/week/11
        return '/llms/' + baseName.replace(/-/g, '/');
      }

      // Handle other cases with simple hyphen to slash conversion
      if (baseName.includes('-')) {
        // For paths with structure like typescript-sdk-common.md
        return '/llms/' + baseName.replace(/-/g, '/');
      }

      // For simple paths like api.md
      return `/llms/${baseName}`;
    });

    return NextResponse.json({
      routes,
      count: routes.length,
      example: 'Try: curl http://localhost:3000/llms/updates/year/2025/week/11',
    });
  } catch (error) {
    console.error('Error listing routes:', error);
    return NextResponse.json(
      { error: 'Failed to list routes' },
      { status: 500 },
    );
  }
}
