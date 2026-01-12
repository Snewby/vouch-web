/**
 * Robots.txt configuration
 * Tells search engines what to crawl
 */

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://vouch.app/sitemap.xml',
  };
}
