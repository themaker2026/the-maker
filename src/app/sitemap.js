import { createClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const baseUrl = 'https://themaker.in'
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)

  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const productPages = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryPages = (categories || []).map((cat) => ({
    url: `${baseUrl}/products?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}