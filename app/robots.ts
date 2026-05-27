import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/candidate-dashboard/',
          '/api/',
          '/login',
          '/signup',
          '/role-selection',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: 'https://www.rgjobs.in/sitemap.xml',
  };
}
