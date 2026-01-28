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
    // API v2 kebab-case to camelCase redirects
    const apiV2BotRedirects = [
      ['batch-create-bots', 'batchCreateBots'],
      ['batch-create-scheduled-bots', 'batchCreateScheduledBots'],
      ['create-bot', 'createBot'],
      ['create-scheduled-bot', 'createScheduledBot'],
      ['delete-bot-data', 'deleteBotData'],
      ['delete-scheduled-bot', 'deleteScheduledBot'],
      ['get-bot-details', 'getBotDetails'],
      ['get-bot-screenshots', 'getBotScreenshots'],
      ['get-bot-status', 'getBotStatus'],
      ['get-scheduled-bot-details', 'getScheduledBotDetails'],
      ['leave-bot', 'leaveBot'],
      ['list-bots', 'listBots'],
      ['list-scheduled-bots', 'listScheduledBots'],
      ['resend-final-webhook', 'resendFinalWebhook'],
      ['retry-callback', 'retryCallback'],
      ['update-bot-config', 'updateBotConfig'],
      ['update-scheduled-bot', 'updateScheduledBot'],
    ].map(([from, to]) => ({
      source: `/api-v2/reference/bots/${from}`,
      destination: `/api-v2/reference/bots/${to}`,
      permanent: true,
    }));

    const apiV2CalendarRedirects = [
      ['create-calendar-bot', 'createCalendarBot'],
      ['create-calendar-connection', 'createCalendarConnection'],
      ['delete-calendar-bot', 'deleteCalendarBot'],
      ['delete-calendar-connection', 'deleteCalendarConnection'],
      ['get-calendar-details', 'getCalendarDetails'],
      ['get-event-details', 'getEventDetails'],
      ['list-calendars', 'listCalendars'],
      ['list-event-series', 'listEventSeries'],
      ['list-events', 'listEvents'],
      ['list-raw-calendars', 'listRawCalendars'],
      ['resubscribe-calendar', 'resubscribeCalendar'],
      ['sync-calendar', 'syncCalendar'],
      ['update-calendar-bot', 'updateCalendarBot'],
      ['update-calendar-connection', 'updateCalendarConnection'],
    ].map(([from, to]) => ({
      source: `/api-v2/reference/calendars/${from}`,
      destination: `/api-v2/reference/calendars/${to}`,
      permanent: true,
    }));

    return [
      // API v2 legacy path redirects
      ...apiV2BotRedirects,
      ...apiV2CalendarRedirects,
      // Redirect /docs paths to root
      {
        source: '/docs/:path*',
        destination: '/:path*',
        permanent: true,
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
