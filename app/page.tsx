import Link from 'next/link'
import { Music, Zap, Lock, Sparkles, BarChart3, Shield } from 'lucide-react'

const FEATURES = [
  {
    icon: Music,
    title: 'توليد الأغاني بالذكاء الاصطناعي',
    desc: 'أنشئ أغاني كاملة بالعربية والإنجليزية بضغطة زر واحدة',
    color: '#a5b4fc',
  },
  {
    icon: Lock,
    title: 'مصادقة آمنة',
    desc: 'تسجيل دخول بالبريد الإلكتروني أو Google مع JWT وRefresh Tokens',
    color: '#6ee7b7',
  },
  {
    icon: Sparkles,
    title: 'نظام Credits متكامل',
    desc: 'تتبع استهلاكك وشراء Credits جديدة عبر Stripe',
    color: '#fcd34d',
  },
  {
    icon: BarChart3,
    title: 'Dashboard متقدم',
    desc: 'لوحة تحكم احترافية بإحصائيات وتحليلات دقيقة',
    color: '#67e8f9',
  },
  {
    icon: Zap,
    title: 'Multi-Tenant',
    desc: 'دعم المؤسسات والفرق مع أدوار وصلاحيات متعددة',
    color: '#fb7185',
  },
  {
    icon: Shield,
    title: 'أمان على مستوى المؤسسات',
    desc: 'RBAC، Audit Logs، Rate Limiting، وحماية كاملة',
    color: '#86efac',
  },
]

export default function Home() {
  return (
    <main className="landing">
      <nav className="nav">
        <div className="brand" style={{ fontSize: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Music size={28} style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: 6, borderRadius: 8 }} />
          Melody AI
        </div>
        <div className="nav-links">
          <Link href="/status" style={{ transition: 'color .15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#a5b4fc')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
            Status
          </Link>
          <Link href="/login" className="btn outline sm">
            دخول
          </Link>
          <Link href="/register" className="btn sm">
            ابدأ مجاناً
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">✨ Enterprise AI SaaS Platform</div>
        <h1>منصة توليد الأغاني والمحتوى الصوتي بالذكاء الاصطناعي</h1>
        <p>
          أنشئ أغاني احترافية بالعربية والإنجليزية في ثوانٍ. منصة SaaS متكاملة مع نظام Credits، اشتراكات Stripe، ولوحة تحكم عالمية.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} />
            🚀 ابدأ مجاناً — 100 Credit
          </Link>
          <Link href="/login" className="btn outline">
            تسجيل الدخول
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 60, maxWidth: 600, margin: '60px auto 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#a5b4fc', marginBottom: 4 }}>10K+</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>أغنية تم توليدها</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#6ee7b7', marginBottom: 4 }}>5K+</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>مستخدم نشط</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fcd34d', marginBottom: 4 }}>99.9%</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>وقت التشغيل</div>
          </div>
        </div>
      </section>

      <div className="features-grid">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <div key={f.title} className="card hover" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${f.color}20, transparent)`, borderRadius: '50%' }} />
              <div style={{ fontSize: 32, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: `${f.color}15`, borderRadius: 12, color: f.color }}>
                <Icon size={24} />
              </div>
              <h3 style={{ marginTop: 0 }}>{f.title}</h3>
              <p className="muted text-sm" style={{ lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* CTA Section */}
      <section style={{ maxWidth: 800, margin: '80px auto 0', textAlign: 'center', padding: '60px 24px', background: 'rgba(99,102,241,.05)', borderRadius: 20, border: '1px solid rgba(99,102,241,.1)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          هل أنت مستعد لإنشاء موسيقى احترافية؟
        </h2>
        <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 24 }}>
          ابدأ اليوم وتمتع بـ 100 Credit مجاني لإنشاء أغانيك الأولى
        </p>
        <Link href="/register" className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} />
          ابدأ الآن مجاناً
        </Link>
      </section>
    </main>
  )
}
