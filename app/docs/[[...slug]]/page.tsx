import { File, Files, Folder } from '@/components/fumadocs/files';
import { ServiceIcon } from '@/components/ui/service-icon';
import { ServiceCardSSR, ServicesCompactSSR, ServicesListSSR } from '@/components/ui/services-list-ssr';
import { owner, repo } from '@/lib/github';
import { createMetadata } from '@/lib/metadata';
import { metadataImage } from '@/lib/metadata-image';
import { openapi, source } from '@/lib/source';
import { Mermaid } from '@theguild/remark-mermaid/mermaid';
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui';
import { createGenerator } from 'fumadocs-typescript';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsCategory,
  DocsDescription,
  DocsPage,
  DocsTitle
} from 'fumadocs-ui/page';
import type { MDXComponents } from 'mdx/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  type ComponentProps,
  type FC,
  type ReactElement
} from 'react';

const generator = createGenerator();

export const revalidate = false;

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<ReactElement> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const path = `content/docs/${page.file.path}`;
  const { body: Mdx, toc, lastModified } = await (page.data as any).load();

  // Service property should now be directly accessible from the schema
  const serviceKey = page.data.service;

  // Get the current slug to check if this is the updates page
  const isUpdatesPage = params.slug && params.slug.length === 1 && params.slug[0] === 'updates';
  console.log("Current page slug:", params.slug, "Is updates page:", isUpdatesPage);

  // Create the MDX components object with enhanced logging
  const mdxComponents = {
    ...defaultMdxComponents,
    ...((await import('lucide-react')) as unknown as MDXComponents),
    Popup,
    PopupContent,
    PopupTrigger,
    Tabs,
    Tab,
    Mermaid,
    TypeTable,
    AutoTypeTable: (props: any) => (
      <AutoTypeTable generator={generator} {...props} />
    ),
    Accordion,
    Accordions,
    Step,
    Steps,
    File,
    Folder,
    Files,
    blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
    Note: Callout, // Alias for Note component used in generated API reference
    APIPage: openapi.APIPage,
    DocsCategory: ({ slugs = params.slug }: { slugs?: string[] }) => (
      <DocsCategory page={source.getPage(slugs)!} from={source} />
    ),
    ImageZoom,
    // Custom components for services
    ServicesListSSR,
    ServicesList: ServicesListSSR, // Add this extra mapping just in case
    ServicesCompactSSR,
    ServicesCompact: ServicesCompactSSR,
    ServiceCardSSR,
    ServiceCard: ServiceCardSSR,
    ServiceIcon,
    ...(await import(
      '@/content/docs/api/community-and-support.client'
    )),
  };

  // Log the available components for debugging
  console.log("Available MDX components:", Object.keys(mdxComponents));

  return (
    <DocsPage
      toc={toc}
      lastUpdate={lastModified}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
      editOnGithub={{
        repo,
        owner,
        sha: 'main',
        path,
      }}
      article={{
        className: 'max-sm:pb-16',
      }}
    >
      <DocsTitle>
        {serviceKey && (
          <ServiceIcon
            serviceKey={serviceKey}
            className="inline-block mr-2 h-6 w-6"
          />
        )}
        {page.data.title}
      </DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="text-fd-foreground/80">
        <Mdx components={mdxComponents} />
        {page.data.index ? <DocsCategory page={page} from={source} /> : null}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const description =
    page.data.description ??
    'Deploy AI for video meetings through a single unified API.';

  return createMetadata(
    metadataImage.withImage(page.slugs, {
      title: page.data.title,
      description,
      openGraph: {
        url: `/${page.slugs.join('/')}`,
      },
    }),
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
