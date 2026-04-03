import AboutHero from '@/components/about/AboutHero'
import FounderStory from '@/components/about/FounderStory'
import CraftProcess from '@/components/about/CraftProcess'
import PhotoStrip from '@/components/about/PhotoStrip'
import MissionStatement from '@/components/about/MissionStatement'

export const metadata = {
  title: 'About — The Maker',
  description:
    'Based in Moradabad — the Brass City of India — The Maker exports premium handcrafted brass products to buyers worldwide.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <FounderStory />
      <CraftProcess />
      <PhotoStrip />
      <MissionStatement />
    </>
  )
}