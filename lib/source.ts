import { docs } from '@/.source/server';
import type { InferMetaType, InferPageType } from 'fumadocs-core/source';
import { loader } from 'fumadocs-core/source';
import { openapiPlugin, createOpenAPI } from 'fumadocs-openapi/server';
import { createAPIPage } from 'fumadocs-openapi/ui';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), openapiPlugin()],
});

const openapiServer = createOpenAPI({
  proxyUrl: 'https://proxy.meetingbaas.com/api/',
});

export const openapi = {
  server: openapiServer,
  createProxy: openapiServer.createProxy,
  APIPage: createAPIPage(openapiServer, {
    shikiOptions: {
      themes: {
        dark: 'vesper',
        light: 'vitesse-light',
      },
    },
  }),
};

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
