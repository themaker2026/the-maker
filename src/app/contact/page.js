import { Suspense } from 'react'
import ContactHero from '@/components/contact/ContactHero'
import ContactSection from '@/components/contact/ContactSection'

export const metadata = {
  title: 'Contact — The Maker',
  description:
    'Get in touch with The Maker. Send us an enquiry for brass bells, key rings, and handicrafts. We respond within 24 hours.',
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <Suspense fallback={<div style={{ padding: '96px', textAlign: 'center' }}>Loading contact form...</div>}>
        <ContactSection />
      </Suspense>
    </>
  )
}