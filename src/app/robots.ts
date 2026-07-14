import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/admin/', '/checkout/', '/order-confirmation/', '/api/'],
    },
    sitemap: 'https://www.tomanni.com/sitemap.xml',
  }
}
