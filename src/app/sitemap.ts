import type { MetadataRoute } from 'next';

const baseUrl = 'https://momocity.kro.kr/';

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
