'use client';

import { FrameworkProvider, type Framework } from 'fumadocs-core/framework';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { RELEASES_URL } from '@/lib/release-urls';

/**
 * Individual release pages (`/api-v2/releases/<version>`) are rendered from
 * GitHub at request time, so they are not in the page tree fumadocs builds
 * from `content/`. Fumadocs picks the sidebar root and the active item by
 * exact URL match, which would leave those pages with the wrong sidebar.
 *
 * Reporting the releases index as the pathname while a release page is open
 * keeps the API v2 sidebar in place with "Releases" highlighted. Everything
 * else — router, params, Link, Image — is untouched.
 */
function useReleasesPathname(): string {
  const pathname = usePathname();
  return pathname.startsWith(`${RELEASES_URL}/`) ? RELEASES_URL : pathname;
}

export function ReleasePathnameProvider({ children }: { children: ReactNode }) {
  return (
    <FrameworkProvider
      usePathname={useReleasesPathname}
      useRouter={useRouter}
      useParams={useParams}
      // Same components fumadocs' own NextProvider passes; only the types differ.
      Link={Link as unknown as Framework['Link']}
      Image={Image as unknown as Framework['Image']}
    >
      {children}
    </FrameworkProvider>
  );
}
