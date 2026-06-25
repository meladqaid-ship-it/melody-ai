import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { StatCard } from './StatCard'

export function Hero(): JSX.Element {
  return (
    <section className="hero">
      <div className="badge">✨ Enterprise AI SaaS Platform</div>
      <h1>منصة توليد الأغاني والمحتوى الصوتي بالذكاء الاصطناعي</h1>
      <p>
        أنشئ أغاني احترافية بالعربية والإنجليزية في ثوانٍ. منصة SaaS متكاملة مع نظام Credits، اشتراكات Stripe، ولوحة تحكم عالمية.
      </p>
      <div className="hero-actions">
        <Link href="/register" className="btn" aria-label="Start free trial with 100 credits">
          <Sparkles size={18} aria-hidden="true" />
          🚀 ابدأ مجاناً — 100 Credit
        </Link>
        <Link href="/login" className="btn outline" aria-label="Sign in to your account">
          تسجيل الدخول
        </Link>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: 60,
          maxWidth: 600,
          margin: '60px auto 0',
        }}
        role="region"
        aria-label="Platform statistics"
      >
        <StatCard value="10K+" label="أغنية تم توليدها" color="#a5b4fc" />
        <StatCard value="5K+" label="مستخدم نشط" color="#6ee7b7" />
        <StatCard value="99.9%" label="وقت التشغيل" color="#fcd34d" />
      </div>
    </section>
  )
}
