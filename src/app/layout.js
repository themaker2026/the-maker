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
  title: 'The Maker — Premium Brass Handicrafts',
  description:
    'Exporting handcrafted brass bells, key rings, and handicraft items worldwide. Quality craftsmanship, global reach.',
  keywords:
    'brass handicrafts, brass bells, key rings, handmade exports, Indian handicrafts, Moradabad brass',
  openGraph: {
    title: 'The Maker — Premium Brass Handicrafts',
    description:
      'Exporting handcrafted brass bells, key rings, and handicraft items worldwide.',
    type: 'website',
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
