import Hero from '@/components/hero/Hero'
import ProductsSection from '@/components/products/ProductsSection'
import WhyUs from '@/components/why/WhyUs'
import StoryTeaser from '@/components/story/StoryTeaser'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductsSection />
      <WhyUs />
      <StoryTeaser />
    </>
  )
}