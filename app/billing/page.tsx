'use client'
import { Shell } from '@/components/Shell'
import { apiGet, apiPost, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { CreditCard, Zap, Shield } from 'lucide-react'
import type { Subscription } from '@/lib/api'

const PLANS = [
  {
    id: 'FREE',
    name: 'مجاني',
    price: '$0',
    period: '/دائماً',
    desc: 'للمبتدئين والتجربة',
    features: ['100 Credits/شهر', 'أغاني حتى 60 ثانية', 'جميع الأنواع الأساسية', 'تحميل MP3', 'دعم عبر البريد'],
    color: '#94a3b8',
  },
  {
    id: 'PRO',
    name: 'احترافي',
    price: '$19',
    period: '/شهر',
    desc: 'للصانعين الجادين',
    features: ['5,000 Credits/شهر', 'أغاني حتى 5 دقائق', 'جميع الأنواع الموسيقية', 'أولوية في المعالجة', 'دعم فوري 24/7', 'API Access'],
    color: '#a5b4fc',
    popular: true,
  },
  {
    id: 'ENTERPRISE',
    name: 'مؤسسي',
    price: 'مخصص',
    period: '',
    desc: 'للشركات والفرق',
    features: ['Credits غير محدودة', 'API مخصص بالكامل', 'SLA مضمون 99.9%', 'مدير حساب مخصص', 'تكامل مخصص', 'Training على بياناتك'],
    color: '#fcd34d',
  },
]

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const currentTier = getStoredUser()?.tier || 'FREE'

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }
    apiGet<{ subscription: Subscription }>('/api/subscriptions')
      .then((d) => setSub(d?.subscription || null))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function upgrade(planId: string) {
    setUpgrading(planId)
    setError('')
    try {
      const data = await apiPost<{ url?: string; message?: string }>('/api/payments/checkout', { tier: planId })
      if (data?.url) window.location.href = data.url
      else alert(data?.message || 'تم الترقية! 🎉')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'فشل الترقية')
    } finally {
      setUpgrading(null)
    }
  }

  async function openPortal() {
    try {
      const data = await apiPost<{ url?: string }>('/api/payments/billing')
      if (data?.url) window.location.href = data.url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'فشل فتح بوابة الفواتير')
    }
  }

  return (
    <Shell>
      {error && <div className="error">{error}</div>}

      {/* Current Plan Banner */}
      {!loading && sub && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(124,58,237,0.08))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} color="#a5b4fc" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                اشتراكك الحالي
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>خطة {sub.tier}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                تجدد في {new Date(sub.currentPeriodEnd).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className={`pill ${sub.status === 'active' ? 'green' : 'amber'}`}>
              {sub.status === 'active' ? '✅ نشط' : sub.status}
            </span>
            <button className="btn sm outline" onClick={openPortal}>
              إدارة الاشتراك
            </button>
          </div>
        </div>
      )}

      {/* Plans Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Zap size={16} color="#fcd34d" />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>خطط الاشتراك</h2>
      </div>

      {loading ? (
        <div className="plans-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="plan-card">
              <div className="skeleton" style={{ height: 240 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="plans-grid">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentTier
            return (
              <div key={plan.id} className={`plan-card${plan.popular ? ' popular' : ''}`}>
                {plan.popular && <div className="plan-popular-badge">⭐ الأكثر شيوعاً</div>}

                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: 14, right: 14,
                    fontSize: 10, fontWeight: 700,
                    color: '#6ee7b7',
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    padding: '3px 8px',
                    borderRadius: 999,
                    letterSpacing: '0.05em',
                  }}>
                    خطتك الحالية
                  </div>
                )}

                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: `${plan.color}12`,
                  border: `1px solid ${plan.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  {plan.id === 'FREE' ? '🎵' : plan.id === 'PRO' ? '⚡' : '🏢'}
                </div>

                <div className="plan-name">{plan.name}</div>
                <div className="plan-price" style={{ color: plan.color }}>
                  {plan.price}
                  <span>{plan.period}</span>
                </div>
                <div className="plan-desc">{plan.desc}</div>

                <ul className="plan-features">
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>

                {plan.id === 'ENTERPRISE' ? (
                  <a href="mailto:sales@melodyai.com" className="btn outline full">تواصل معنا</a>
                ) : isCurrent ? (
                  <button className="btn full ghost" disabled>✅ خطتك الحالية</button>
                ) : (
                  <button
                    className={`btn full${plan.popular ? '' : ' outline'}`}
                    onClick={() => upgrade(plan.id)}
                    disabled={upgrading === plan.id}
                  >
                    {upgrading === plan.id ? (
                      <><span className="loading-dots"><span/><span/><span/></span> جاري الترقية</>
                    ) : plan.id === 'FREE' ? 'تخفيض الخطة' : `ترقية إلى ${plan.name}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Trust Section */}
      <div style={{
        marginTop: 32,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {[
          { icon: '🔒', title: 'مدفوعات آمنة', desc: 'مشفرة بـ Stripe' },
          { icon: '↩️', title: 'إلغاء مجاني', desc: 'في أي وقت بدون رسوم' },
          { icon: '💯', title: 'ضمان استرداد', desc: '14 يوم بدون أسئلة' },
        ].map((item) => (
          <div key={item.title} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{item.title}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  )
}
