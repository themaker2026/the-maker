import { Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
})

export const metadata = {
  metadataBase: new URL('https://themaker-tm.com'),
  title: {
    default: 'The Maker — Premium Brass Handicrafts from Moradabad',
    template: '%s — The Maker',
  },
  description:
    'Export-quality handcrafted brass bells, key rings, and decorative items from Moradabad, India. Trusted by wholesale buyers in 30+ countries.',
  keywords: [
    'brass handicrafts export',
    'brass bells manufacturer India',
    'Moradabad brass export',
    'wholesale brass items',
    'handcrafted brass key rings',
    'Indian handicrafts export',
    'brass decorative items wholesale',
    'Moradabad handicraft manufacturer',
  ],
  authors: [{ name: 'Arham', url: 'https://github.com/Arham2004m' }],
  creator: 'Arham',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://themaker-tm.com',
    siteName: 'The Maker',
    title: 'The Maker — Premium Brass Handicrafts from Moradabad',
    description:
      'Export-quality handcrafted brass bells, key rings, and decorative items from Moradabad, India.',
    images: [
      {
        url: '/NewHomeBell.webp',
        width: 1200,
        height: 630,
        alt: 'The Maker — Premium Brass Handicrafts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Maker — Premium Brass Handicrafts from Moradabad',
    description:
      'Export-quality handcrafted brass from Moradabad, India.',
    images: ['/NewHomeBell.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-playfair-display: ${playfairDisplay.style.fontFamily};
          }
        `}} />
      </head>
      <body className={playfairDisplay.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
