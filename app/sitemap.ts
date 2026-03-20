import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.tabmonitor.se';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: '',
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      path: '/privacy',
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      path: '/terms',
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      path: '/blog',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      path: '/blog/onetab-not-working',
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
