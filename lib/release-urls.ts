// Public URLs have no /docs prefix (see the rewrites in next.config.ts).
// Kept apart from lib/releases.ts so client components can import them
// without pulling the GitHub client into the browser bundle.
export const RELEASES_URL = '/api-v2/releases';
export const VERSIONING_URL = '/api-v2/versioning';
