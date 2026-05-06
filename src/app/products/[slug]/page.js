import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductDetail from '@/components/product/ProductDetail'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!product) {
    return { title: 'Product Not Found — The Maker' }
  }

  return {
    title: `${product.name} — The Maker`,
    description:
      product.description ||
      `${product.name} — handcrafted brass product from Moradabad, India. Export enquiries welcome.`,
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id, name, slug, description,
      images, material, finish,
      dimensions, weight, moq,
      category_id, is_active,
      categories ( id, name, slug )
    `)
    .eq('slug', slug)
    .single()

  if (error || !product || !product.is_active) {
    redirect('/products')
  }

  // Fetch related products in parallel
  const { data: related } = await supabase
    .from('products')
    .select(`
      id, name, slug, images,
      categories ( name )
    `)
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const relatedMapped = (related || []).map((p) => ({
    ...p,
    category_name: p.categories?.name || '',
  }))
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} — handcrafted brass product from Moradabad, India.`,
    image: product.images || [],
    brand: {
      '@type': 'Brand',
      name: 'The Maker',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'The Maker',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Moradabad',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
    },
    material: product.material || 'Brass',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'The Maker',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetail product={product} related={relatedMapped} />
    </>
  )
}