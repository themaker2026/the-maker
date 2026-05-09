import Hero from '@/components/hero/Hero'
import BellBrandSection from '@/components/hero/BellBrandSection'
import ProductsSection from '@/components/products/ProductsSection'
import WhyUs from '@/components/why/WhyUs'
import StoryTeaser from '@/components/story/StoryTeaser'
import CTABanner from '@/components/cta/CTABanner'

export default function HomePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Maker',
    url: 'https://themaker-tm.com',
    logo: 'https://themaker-tm.com/homepageBell.webp',
    description:
      'Premium brass handicraft manufacturer and exporter based in Moradabad, India.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      postalCode: '244001',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919027432715',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.facebook.com/themaker',
      'https://www.instagram.com/themaker',
      'https://www.linkedin.com/company/themaker',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Hero />
      <BellBrandSection />
      <ProductsSection />
      <WhyUs />
      <StoryTeaser />
      <CTABanner />
    </>
  )
}