import { metadataImage } from '@/lib/metadata-image';
import { generateOGImage } from 'fumadocs-ui/og';

export const GET = metadataImage.createAPI((page) => {
  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: 'Meeting BaaS',
    // 176 100% 43% - replace the hex codes too
    primaryColor: '#13c9bd',
    primaryTextColor: '#13c9bd',
  });
});

export function generateStaticParams() {
  return metadataImage.generateParams();
}
