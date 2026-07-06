import type { MetadataRoute } from 'next';

const baseUrl = 'https://momocity-six.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/teacher/',
        '/student/',
        '/auth/',
        '/oauth/',
        '/forbidden/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
