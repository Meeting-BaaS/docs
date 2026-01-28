import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  // Add URL rewrites to remove redundant /docs path segment
  async rewrites() {
    return [
      // Redirect root paths to /docs paths
      {
        source: '/:path*',
        destination: '/docs/:path*',
      },
      // Special case for the homepage
      {
        source: '/',
        destination: '/docs',
      },
    ];
  },
  // Add redirects to handle SEO better - redirect any direct access to /docs paths
  async redirects() {
    return [
      {
        source: '/docs/:path*',
        destination: '/:path*',
        permanent: true, // 308 redirect - search engines will update their links
      },
      {
        source: '/docs',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withAnalyzer(withMDX(config));
