import { Suspense } from 'react'
import ProductsHero from '@/components/products/ProductsHero'
import ProductsCatalogue from '@/components/products/ProductsCatalogue'

export const metadata = {
  title: 'Products — The Maker',
  description:
    'Browse our full catalogue of handcrafted brass bells, key rings, and handicrafts from Moradabad, India.',
}

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <Suspense fallback={null}>
        <ProductsCatalogue />
      </Suspense>
    </>
  )
}