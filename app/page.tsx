import type { Metadata } from 'next'
import { Navigation } from '@/components/landing/Navigation'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { CTA } from '@/components/landing/CTA'

export const metadata: Metadata = {
  title: 'Melody AI — منصة توليد الأغاني بالذكاء الاصطناعي',
  description: 'منصة SaaS عالمية لتوليد الأغاني والمحتوى الصوتي بالذكاء الاصطناعي. أنشئ أغاني احترافية بالعربية والإنجليزية في ثوانٍ مع نظام Credits متكامل.',
  keywords: ['AI Music', 'توليد الأغاني', 'Music Generation', 'SaaS', 'Artificial Intelligence'],
  authors: [{ name: 'Melody AI Team' }],
  creator: 'Melody AI',
  publisher: 'Melody AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://melody-ai.com',
    siteName: 'Melody AI',
    title: 'Melody AI — منصة توليد الأغاني بالذكاء الاصطناعي',
    description: 'منصة SaaS عالمية لتوليد الأغاني والمحتوى الصوتي بالذكاء الاصطناعي',
    images: [
      {
        url: 'https://melody-ai.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Melody AI Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melody AI — منصة توليد الأغاني بالذكاء الاصطناعي',
    description: 'منصة SaaS عالمية لتوليد الأغاني والمحتوى الصوتي بالذكاء الاصطناعي',
    images: ['https://melody-ai.com/og-image.png'],
  },
}

export default function Home(): JSX.Element {
  return (
    <main className="landing" role="main">
      <Navigation />
      <Hero />
      <Features />
      <CTA />
    </main>
  )
}
