import Hero from '@/components/hero/Hero'
import BellBrandSection from '@/components/hero/BellBrandSection'
import ProductsSection from '@/components/products/ProductsSection'
import WhyUs from '@/components/why/WhyUs'
import StoryTeaser from '@/components/story/StoryTeaser'
import CTABanner from '@/components/cta/CTABanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BellBrandSection />
      <ProductsSection />
      <WhyUs />
      <StoryTeaser />
      <CTABanner />
    </>
  )
}