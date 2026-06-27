'use client'
import { Shell } from '@/components/Shell'
import { apiGet, apiPost, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import type { CreditLedgerEntry, ApiUser } from '@/lib/api'

const CREDIT_PACKS = [
  {
    id: 'pack_500',  credits: 500,  price: '$4.99',  label: 'Starter',
    desc: 'مثالي للتجربة', songs: '~50 أغنية', color: '#6ee7b7',
  },
  {
    id: 'pack_2000', credits: 2000, price: '$14.99', label: 'Pro',
    desc: 'الأكثر شيوعاً', songs: '~200 أغنية', color: '#a5b4fc', popular: true,
  },
  {
    id: 'pack_5000', credits: 5000, price: '$29.99', label: 'Power',
    desc: 'للمحترفين', songs: '~500 أغنية', color: '#fcd34d',
  },
]

export default function CreditsPage() {
  const [user, setUser] = useState<ApiUser | null>(getStoredUser())
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }
    Promise.allSettled([
      apiGet<ApiUser>('/api/me'),
      apiGet<{ entries: CreditLedgerEntry[] }>('/api/credits/ledger'),
    ]).then(([u, l]) => {
      if (u.status === 'fulfilled') setUser(u.value)
      if (l.status === 'fulfilled') setLedger(l.value?.entries || [])
    }).finally(() => setLoading(false))
  }, [])

  async function purchasePack(packId: string) {
    setPurchasing(packId)
    setError('')
    setSuccess('')
    try {
      const data = await apiPost<{ url?: string; message?: string }>('/api/payments/checkout', { packId })
      if (data?.url) window.location.href = data.url
      else setSuccess(data?.message || 'تم شراء Credits بنجاح! 🎉')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'فشل عملية الشراء')
    } finally {
      setPurchasing(null)
    }
  }

  const tierMax: Record<string, number> = { FREE: 100, STARTER: 1000, PRO: 5000, ENTERPRISE: -1 }
  const maxCredits = tierMax[user?.tier || 'FREE'] || 100
  const pct = maxCredits === -1 ? 85 : Math.min(100, ((user?.credits || 0) / maxCredits) * 100)

  return (
    <Shell>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Balance Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.08))',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 20,
        padding: '28px 28px 24px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #22d3ee)' }} />
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 120, opacity: 0.04, pointerEvents: 'none' }}>💎</div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              رصيد Credits الحالي
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#a5b4fc', lineHeight: 1, letterSpacing: '-2px' }}>
              {loading ? (
                <div className="skeleton" style={{ width: 120, height: 52, borderRadius: 8, display: 'inline-block' }} />
              ) : (user?.credits ?? 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>
              ~{Math.floor((user?.credits ?? 0) / 10)} أغنية متبقية
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="pill indigo" style={{ marginBottom: 8, display: 'inline-block' }}>
              {user?.tier || 'FREE'} Plan
            </span>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
              {user?.totalSongsGenerated || 0} أغنية مولَّدة إجمالاً
            </div>
          </div>
        </div>

        {maxCredits !== -1 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: '#64748b' }}>
              <span>استخدام الرصيد</span>
              <span>{Math.round(pct)}% مستخدَم</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#475569' }}>
              <span>{user?.credits} credits</span>
              <span>الحد: {maxCredits.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Credit Packs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Zap size={16} color="#fcd34d" />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>شراء Credits إضافية</h2>
      </div>

      <div className="plans-grid" style={{ marginBottom: 32 }}>
        {CREDIT_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`plan-card${pack.popular ? ' popular' : ''}`}
            style={{ position: 'relative' }}
          >
            {pack.popular && <div className="plan-popular-badge">⭐ الأكثر قيمة</div>}

            <div style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: `${pack.color}15`,
              border: `1px solid ${pack.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, marginBottom: 14,
            }}>💎</div>

            <div className="plan-name">{pack.label}</div>
            <div className="plan-price">
              {pack.price}
              <span>/مرة</span>
            </div>
            <div className="plan-desc">{pack.desc}</div>

            <ul className="plan-features">
              <li>{pack.credits.toLocaleString()} Credit</li>
              <li>{pack.songs}</li>
              <li>جميع الأنواع الموسيقية</li>
              <li>صلاحية غير محدودة</li>
            </ul>

            <button
              className={`btn full${pack.popular ? '' : ' outline'}`}
              onClick={() => purchasePack(pack.id)}
              disabled={purchasing === pack.id}
            >
              {purchasing === pack.id ? (
                <><span className="loading-dots"><span/><span/><span/></span> جاري الشراء</>
              ) : `شراء ${pack.credits.toLocaleString()} Credit`}
            </button>
          </div>
        ))}
      </div>

      {/* Ledger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 16 }}>📊</span>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>سجل المعاملات</h2>
      </div>

      {loading ? (
        <div className="card">
          <div style={{ display: 'grid', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8 }} />
            ))}
          </div>
        </div>
      ) : ledger.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <span className="empty-icon">📊</span>
          <h3 style={{ color: '#64748b', fontSize: 18, marginBottom: 8 }}>لا توجد معاملات بعد</h3>
          <p style={{ color: '#475569', fontSize: 13 }}>ستظهر هنا عمليات الشراء والاستخدام</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>الرصيد بعد</th>
                <th>السبب</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <span className={`pill ${entry.type === 'GRANT' || entry.type === 'PURCHASE' ? 'green' : entry.type === 'USAGE' ? 'red' : 'gray'}`}>
                      {entry.type === 'GRANT' ? '🎁 منحة' : entry.type === 'PURCHASE' ? '💳 شراء' : entry.type === 'USAGE' ? '🎵 استخدام' : entry.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: entry.amount > 0 ? '#6ee7b7' : '#fca5a5' }}>
                    {entry.amount > 0 ? '+' : ''}{entry.amount}
                  </td>
                  <td style={{ color: '#a5b4fc', fontWeight: 600 }}>{entry.balanceAfter}</td>
                  <td className="muted" style={{ fontSize: 13 }}>{entry.reason}</td>
                  <td className="muted" style={{ fontSize: 12 }}>
                    {new Date(entry.createdAt).toLocaleDateString('ar', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  )
}
