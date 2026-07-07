import type { MetadataRoute } from 'next';

const baseUrl = 'https://momocity-six.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
