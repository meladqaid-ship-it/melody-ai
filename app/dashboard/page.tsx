'use client'
import { Shell } from '@/components/Shell'
import { apiGet, getStoredUser, saveSession } from '@/lib/api'
import { useEffect, useState } from 'react'
import { TrendingUp, Music, Zap, Sparkles, ArrowRight } from 'lucide-react'
import type { ApiUser, Song } from '@/lib/api'

function StatCard({
  label, value, sub, icon, trend, color,
}: {
  label: string; value: string | number; sub?: string; icon: string; trend?: string; color: string;
}) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="stat-label">{label}</div>
        <div style={{
          width: 36, height: 36,
          borderRadius: 9,
          background: `${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          border: `1px solid ${color}25`,
        }}>
          {icon}
        </div>
      </div>
      <div className="stat-value" style={{ color: '#f1f5f9' }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      {trend && (
        <div className="stat-trend" style={{ color: '#6ee7b7' }}>
          <TrendingUp size={11} />
          {trend}
        </div>
      )}
    </div>
  )
}

function SkeletonStat() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ height: 12, width: '55%', marginBottom: 14 }} />
      <div className="skeleton" style={{ height: 32, width: '45%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 10, width: '70%' }} />
    </div>
  )
}

function AISuggestions() {
  const suggestions = [
    { icon: '🎵', title: 'جرّب النوع الخليجي', desc: 'الأغاني الخليجية تحصل على أعلى تقييمات في منصتنا', cta: 'جرّبه الآن', href: '/studio' },
    { icon: '🌙', title: 'موسيقى لوفي للدراسة', desc: 'أنشئ موسيقى هادئة مثالية للتركيز والإنتاجية', cta: 'أنشئ الآن', href: '/studio' },
    { icon: '🎬', title: 'موسيقى للفيديوهات', desc: 'موسيقى خلفية احترافية لمحتوى يوتيوب وتيك توك', cta: 'ابدأ', href: '/studio' },
  ]

  return (
    <div className="card" style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Sparkles size={16} color="#a5b4fc" />
        <span style={{ fontSize: 15, fontWeight: 700 }}>اقتراحات AI</span>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {suggestions.map((s) => (
          <div
            key={s.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.06)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.15)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)'
            }}
          >
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
            <a
              href={s.href}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#a5b4fc',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {s.cta}
              <ArrowRight size={11} />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState<ApiUser | null>(getStoredUser())
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }

    Promise.allSettled([
      apiGet<ApiUser>('/api/me'),
      apiGet<{ songs: Song[] }>('/api/songs?limit=5'),
    ]).then(([userRes, songsRes]) => {
      if (userRes.status === 'fulfilled') {
        setUser(userRes.value)
        saveSession(localStorage.getItem('accessToken') || '', userRes.value)
      } else {
        setError(userRes.reason?.message || 'فشل تحميل البيانات')
      }
      if (songsRes.status === 'fulfilled') {
        setSongs(songsRes.value?.songs || [])
      }
    }).finally(() => setLoading(false))
  }, [])

  const tierLabel: Record<string, string> = {
    FREE: 'مجاني', STARTER: 'مبتدئ', PRO: 'احترافي', BUSINESS: 'أعمال', ENTERPRISE: 'مؤسسي',
  }

  return (
    <Shell>
      {error && <div className="error">{error}</div>}

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 18,
        padding: '22px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #22d3ee)',
        }} />
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 80, opacity: 0.06, pointerEvents: 'none' }}>
          🎵
        </div>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800 }}>
            مرحباً، {user?.name || 'موسيقار'} 👋
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>
            {user?.credits
              ? `لديك ${user.credits} Credit متبقي — وقت الإبداع الموسيقي!`
              : 'ابدأ رحلتك الموسيقية مع Melody AI'
            }
          </p>
        </div>
        <a href="/studio" className="btn" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          <Music size={16} />
          أنشئ أغنية
        </a>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatCard
              icon="💎" label="Credits المتبقية"
              value={user?.credits ?? 0}
              sub="يُجدَّد مع الاشتراك"
              trend="+12% هذا الشهر"
              color="#6366f1"
            />
            <StatCard
              icon="🎵" label="أغاني مولَّدة"
              value={user?.totalSongsGenerated ?? 0}
              sub="إجمالي المشاريع"
              color="#10b981"
            />
            <StatCard
              icon="🏆" label="الخطة الحالية"
              value={tierLabel[user?.tier || 'FREE'] || 'مجاني'}
              sub={user?.tier === 'FREE' ? 'ترقية للمزيد' : '✓ نشط'}
              color="#f59e0b"
            />
            <StatCard
              icon="👤" label="الحساب"
              value={user?.email?.split('@')[0] || '-'}
              sub={user?.email}
              color="#ec4899"
            />
          </>
        )}
      </div>

      <div className="grid-2" style={{ alignItems: 'start', marginBottom: 24 }}>
        {/* Recent Songs */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Music size={16} color="#a5b4fc" />
              أحدث الأغاني
            </h3>
            <a href="/studio" className="btn sm ghost">+ جديدة</a>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 14, background: 'rgba(12,16,34,0.95)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'grid', gap: 8, alignContent: 'center' }}>
                    <div className="skeleton" style={{ height: 14, width: '65%' }} />
                    <div className="skeleton" style={{ height: 11, width: '45%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : songs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(12,16,34,0.95)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🎵</span>
              <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 16px' }}>لا توجد أغاني بعد</p>
              <a href="/studio" className="btn sm">🚀 ابدأ الآن</a>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {songs.map((song) => (
                <div key={song.id} className="song-card">
                  <div className="song-thumb">🎵</div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-meta">{song.genre} · {song.mood}</div>
                  </div>
                  <span className={`pill ${song.status === 'COMPLETED' ? 'green' : song.status === 'FAILED' ? 'red' : 'amber'}`}>
                    {song.status === 'COMPLETED' ? '✅' : song.status === 'FAILED' ? '❌' : '⏳'}
                  </span>
                </div>
              ))}
              <a href="/studio" style={{ fontSize: 13, color: '#64748b', textAlign: 'center', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                عرض الكل <ArrowRight size={13} />
              </a>
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        <AISuggestions />
      </div>

      {/* Quick Actions */}
      <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
        <Zap size={16} color="#fcd34d" />
        إجراءات سريعة
      </h3>
      <div className="grid-3">
        {[
          { href: '/studio',  icon: '🎵', title: 'AI Studio',       desc: 'أنشئ أغنية جديدة الآن',    color: '#a5b4fc', glow: 'rgba(99,102,241,0.2)' },
          { href: '/credits', icon: '💎', title: 'شراء Credits',     desc: 'وسّع رصيدك للمزيد',        color: '#fcd34d', glow: 'rgba(245,158,11,0.15)' },
          { href: '/billing', icon: '💳', title: 'إدارة الاشتراك',   desc: 'ترقية أو إدارة الباقة',    color: '#6ee7b7', glow: 'rgba(16,185,129,0.15)' },
        ].map((action) => (
          <a
            key={action.href}
            href={action.href}
            className="card hover"
            style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}
          >
            <div style={{
              width: 48, height: 48,
              borderRadius: 12,
              background: `${action.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              marginBottom: 12,
              border: `1px solid ${action.color}20`,
            }}>
              {action.icon}
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>{action.title}</h3>
            <p className="muted text-sm" style={{ lineHeight: 1.6, margin: 0 }}>{action.desc}</p>
          </a>
        ))}
      </div>
    </Shell>
  )
}
