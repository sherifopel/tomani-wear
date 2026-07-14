import { client } from '@/sanity/client'
import type { MetadataRoute } from 'next'

const BASE = 'https://www.tomanni.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products: { slug: string; _updatedAt: string }[] = await client.fetch(
    `*[_type == "product"]{ "slug": slug.current, _updatedAt }`
  )

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url:              `${BASE}/products/${p.slug}`,
    lastModified:     new Date(p._updatedAt),
    changeFrequency:  'weekly',
    priority:         0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                        priority: 1.0, changeFrequency: 'daily'   },
    { url: `${BASE}/products`,                          priority: 0.9, changeFrequency: 'daily'   },
    { url: `${BASE}/products?category=new`,             priority: 0.8, changeFrequency: 'daily'   },
    { url: `${BASE}/products?category=men`,             priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${BASE}/products?category=women`,           priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${BASE}/products?category=accessories`,     priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${BASE}/products?category=collections`,     priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${BASE}/about`,                             priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/contact`,                           priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/faq`,                               priority: 0.4, changeFrequency: 'monthly' },
    { url: `${BASE}/size-guide`,                        priority: 0.4, changeFrequency: 'monthly' },
    { url: `${BASE}/returns`,                           priority: 0.4, changeFrequency: 'monthly' },
  ]

  return [...staticPages, ...productUrls]
}
