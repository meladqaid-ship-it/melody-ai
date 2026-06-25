import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function CTA(): JSX.Element {
  return (
    <section
      style={{
        maxWidth: 800,
        margin: '80px auto 0',
        textAlign: 'center',
        padding: '60px 24px',
        background: 'rgba(99,102,241,.05)',
        borderRadius: 20,
        border: '1px solid rgba(99,102,241,.1)',
      }}
      role="region"
      aria-label="Call to action"
    >
      <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        هل أنت مستعد لإنشاء موسيقى احترافية؟
      </h2>
      <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 24 }}>
        ابدأ اليوم وتمتع بـ 100 Credit مجاني لإنشاء أغانيك الأولى
      </p>
      <Link href="/register" className="btn" aria-label="Start free trial now">
        <Sparkles size={18} aria-hidden="true" />
        ابدأ الآن مجاناً
      </Link>
    </section>
  )
}
