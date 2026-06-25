'use client'
import { Shell } from '@/components/Shell'
import { apiGet, getStoredUser, saveSession } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Music, Zap, TrendingUp, Sparkles } from 'lucide-react'
import type { ApiUser, Song } from '@/lib/api'

function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  trend?: 'up' | 'down'
}) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="stat-label">{label}</div>
        <div style={{ fontSize: 20 }}>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      {trend && (
        <div style={{ fontSize: 12, color: trend === 'up' ? '#6ee7b7' : '#fca5a5', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendingUp size={14} />
          {trend === 'up' ? '+12% هذا الشهر' : '-5% الشهر الماضي'}
        </div>
      )}
    </div>
  )
}

function SkeletonStat() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 28, width: '40%' }} />
    </div>
  )
}

function ActivityFeed() {
  const activities = [
    { emoji: '🎵', text: 'تم إنشاء أغنية جديدة', time: 'منذ 2 ساعة' },
    { emoji: '💎', text: 'تم شراء 500 Credit', time: 'منذ يوم' },
    { emoji: '✅', text: 'تمت ترقية الخطة إلى Pro', time: 'منذ 3 أيام' },
  ]

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={18} style={{ color: '#a5b4fc' }} />
        النشاط الأخير
      </h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {activities.map((activity, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px',
              background: 'rgba(255,255,255,.02)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,.05)',
            }}
          >
            <div style={{ fontSize: 20 }}>{activity.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{activity.text}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{activity.time}</div>
            </div>
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
    if (!getStoredUser()) {
      window.location.href = '/login'
      return
    }

    Promise.allSettled([apiGet<ApiUser>('/api/me'), apiGet<{ songs: Song[] }>('/api/songs?limit=5')]).then(([userRes, songsRes]) => {
      if (userRes.status === 'fulfilled') {
        setUser(userRes.value)
        saveSession(localStorage.getItem('accessToken') || '', userRes.value)
      } else {
        setError(userRes.reason?.message || 'فشل تحميل بيانات المستخدم')
      }
      if (songsRes.status === 'fulfilled') {
        setSongs(songsRes.value?.songs || [])
      }
    }).finally(() => setLoading(false))
  }, [])

  const tierLabel: Record<string, string> = {
    FREE: 'مجاني',
    STARTER: 'مبتدئ',
    PRO: 'احترافي',
    BUSINESS: 'أعمال',
    ENTERPRISE: 'مؤسسي',
  }

  return (
    <Shell>
      {error && <div className="error">{error}</div>}

      {/* Welcome Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,.1), rgba(124,58,237,.1))',
          border: '1px solid rgba(99,102,241,.2)',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>مرحباً بك {user?.name || 'مستخدم'} 👋</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>
            لديك {user?.credits ?? 0} Credit متبقي. ابدأ بإنشاء أغنيتك الجديدة الآن!
          </p>
        </div>
        <a href="/studio" className="btn" style={{ whiteSpace: 'nowrap' }}>
          <Music size={18} />
          أنشئ أغنية
        </a>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatCard icon="💎" label="Credits المتبقية" value={user?.credits ?? 0} sub="تُجدَّد مع الاشتراك" trend="up" />
            <StatCard icon="🎵" label="أغاني مولَّدة" value={user?.totalSongsGenerated ?? 0} sub="إجمالي" trend="up" />
            <StatCard
              icon="🏆"
              label="الخطة الحالية"
              value={tierLabel[user?.tier || 'FREE'] || user?.tier || 'FREE'}
              sub={user?.tier === 'FREE' ? 'ترقية للحصول على المزيد' : 'نشط'}
            />
            <StatCard icon="👤" label="الحساب" value={user?.email?.split('@')[0] || '-'} sub={user?.email} />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid-2" style={{ alignItems: 'start', marginBottom: 24 }}>
        {/* Recent Songs */}
        <div>
          <div className="page-header" style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>🎵 أحدث الأغاني</h3>
            <a href="/studio" className="btn sm">
              + جديدة
            </a>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ height: 14, marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 14, width: '70%' }} />
                </div>
              ))}
            </div>
          ) : songs.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 24px' }}>
              <div className="empty-icon">🎵</div>
              <h3>لا توجد أغاني بعد</h3>
              <p>ابدأ بإنشاء أغنيتك الأولى في AI Studio</p>
              <a href="/studio" className="btn mt-4">
                🚀 ابدأ الآن
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {songs.map((song) => (
                <div key={song.id} className="song-card">
                  <div className="song-thumb">🎵</div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-meta">
                      {song.genre} · {song.mood}
                    </div>
                  </div>
                  <span
                    className={`pill ${song.status === 'COMPLETED' ? 'green' : song.status === 'FAILED' ? 'red' : 'amber'}`}
                  >
                    {song.status === 'COMPLETED' ? '✅' : song.status === 'FAILED' ? '❌' : '⏳'} {song.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </div>

      {/* Quick Actions */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>⚡ الإجراءات السريعة</h3>
      </div>
      <div className="grid-3">
        {[
          {
            href: '/studio',
            icon: '🎵',
            title: 'AI Studio',
            desc: 'أنشئ أغنية جديدة الآن',
            color: '#a5b4fc',
          },
          {
            href: '/credits',
            icon: '💎',
            title: 'شراء Credits',
            desc: 'وسّع رصيدك للمزيد',
            color: '#fcd34d',
          },
          {
            href: '/billing',
            icon: '💳',
            title: 'إدارة الاشتراك',
            desc: 'ترقية أو إدارة الباقة',
            color: '#6ee7b7',
          },
        ].map((action) => (
          <a key={action.href} href={action.href} className="card hover" style={{ cursor: 'pointer', display: 'block', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: `radial-gradient(circle, ${action.color}20, transparent)`, borderRadius: '50%' }} />
            <div
              style={{
                fontSize: 32,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                background: `${action.color}15`,
                borderRadius: 12,
                color: action.color,
              }}
            >
              {action.icon}
            </div>
            <h3 style={{ margin: '0 0 4px' }}>{action.title}</h3>
            <p className="muted text-sm" style={{ lineHeight: 1.6 }}>
              {action.desc}
            </p>
          </a>
        ))}
      </div>
    </Shell>
  )
}
