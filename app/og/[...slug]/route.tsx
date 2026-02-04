import { source } from '@/lib/source';
import { generateOGImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';

export async function GET(
  _: unknown,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: 'Meeting BaaS',
    primaryColor: '#13c9bd',
    primaryTextColor: '#13c9bd',
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.slugs,
  }));
}
