import type { Metadata } from 'next'
import './globals.css'
import './animations.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://melody-ai.com'),
  title: 'Melody AI — منصة توليد الأغاني بالذكاء الاصطناعي',
  description: 'منصة SaaS عالمية لتوليد الأغاني والمحتوى الصوتي بالذكاء الاصطناعي. أنشئ أغاني احترافية بالعربية والإنجليزية في ثوانٍ.',
  keywords: ['AI Music', 'توليد الأغاني', 'Music Generation', 'SaaS'],
  authors: [{ name: 'Melody AI Team' }],
  creator: 'Melody AI',
  robots: 'index, follow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050816',
}
