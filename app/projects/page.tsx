'use client'
import { Shell } from '@/components/Shell'
import { apiGet, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Download, Heart, Trash2, Play, Music, Search } from 'lucide-react'

interface Song {
  id: string | number
  title?: string
  genre?: string
  mood?: string
  language?: string
  createdAt?: string
  status?: 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'PENDING'
  progress?: number
  audioUrl?: string
}

type FilterType = 'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'

export default function ProjectsPage(): JSX.Element {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }
    apiGet<{ songs: Song[] }>('/api/songs?limit=50')
      .then((d) => setSongs(d?.songs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = songs
    .filter((s) => filter === 'ALL' || s.status === filter)
    .filter((s) => !search || (s.title || '').toLowerCase().includes(search.toLowerCase()))

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const statusCounts = {
    ALL: songs.length,
    COMPLETED: songs.filter((s) => s.status === 'COMPLETED').length,
    PENDING: songs.filter((s) => s.status === 'PENDING' || s.status === 'PROCESSING').length,
    FAILED: songs.filter((s) => s.status === 'FAILED').length,
  }

  return (
    <Shell>
      <div className="page-header">
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>مشاريعي</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            {songs.length} أغنية · {favorites.size} مفضلة
          </p>
        </div>
        <a href="/studio" className="btn sm">
          <Music size={14} />
          أغنية جديدة
        </a>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في أغانيك..."
            style={{
              width: '100%',
              padding: '10px 38px 10px 14px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(12,16,34,0.95)',
              color: '#e2e8f0',
              borderRadius: 10,
              outline: 'none',
              fontSize: 14,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          />
        </div>

        <div className="tabs" style={{ margin: 0, flex: 'none' }}>
          {(['ALL', 'COMPLETED', 'PENDING', 'FAILED'] as const).map((f) => (
            <button
              key={f}
              className={`tab${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
              style={{ padding: '9px 16px', fontSize: 13 }}
            >
              {f === 'ALL' ? `الكل (${statusCounts.ALL})`
                : f === 'COMPLETED' ? `✅ (${statusCounts.COMPLETED})`
                : f === 'PENDING' ? `⏳ (${statusCounts.PENDING})`
                : `❌ (${statusCounts.FAILED})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: 16, background: 'rgba(12,16,34,0.95)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'grid', gap: 10, alignContent: 'center' }}>
                <div className="skeleton" style={{ height: 14, width: '55%' }} />
                <div className="skeleton" style={{ height: 11, width: '35%' }} />
              </div>
              <div className="skeleton" style={{ width: 70, height: 24, borderRadius: 999 }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '72px 24px' }}>
          <span className="empty-icon">
            {search ? '🔍' : '🎵'}
          </span>
          <h3 style={{ fontSize: 20, color: '#64748b', marginBottom: 10 }}>
            {search ? `لا نتائج لـ "${search}"` : 'لا توجد أغاني بعد'}
          </h3>
          <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            {search
              ? 'جرّب كلمة بحث مختلفة أو أنشئ أغنية جديدة'
              : 'ابدأ بإنشاء أول أغنية لك في AI Studio\nويمكن إعادة تشغيلها وتحميلها وإدارتها هنا'
            }
          </p>
          {!search && (
            <a href="/studio" className="btn">
              <Music size={16} />
              أنشئ أغنيتك الأولى
            </a>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {filtered.map((song) => {
            const songId = String(song.id)
            const isFav = favorites.has(songId)
            const statusColor = song.status === 'COMPLETED' ? 'green' : song.status === 'FAILED' ? 'red' : 'amber'
            const statusIcon = song.status === 'COMPLETED' ? '✅' : song.status === 'FAILED' ? '❌' : '⏳'

            return (
              <div
                key={songId}
                className="song-card"
                style={{ position: 'relative', paddingRight: 16 }}
              >
                {/* Thumbnail */}
                <div
                  className="song-thumb"
                  style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}
                >
                  <span style={{ fontSize: 20, position: 'relative', zIndex: 1 }}>🎵</span>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.15s',
                    borderRadius: 10,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0' }}
                  >
                    <Play size={18} fill="white" color="white" />
                  </div>
                </div>

                <div className="song-info">
                  <div className="song-title">{String(song.title || 'Untitled')}</div>
                  <div className="song-meta">
                    {[song.genre, song.mood, song.language].filter(Boolean).join(' · ')}
                    {song.createdAt && ` · ${new Date(String(song.createdAt)).toLocaleDateString('ar', { month: 'short', day: 'numeric' })}`}
                  </div>
                  {song.status === 'PROCESSING' && (
                    <div className="progress-bar" style={{ marginTop: 7, height: 4 }}>
                      <div className="progress-fill" style={{ width: `${song.progress || 30}%` }} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span className={`pill ${statusColor}`}>
                    {statusIcon} {String(song.status)}
                  </span>
                  <button
                    onClick={() => toggleFavorite(songId)}
                    title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: 'none',
                      background: isFav ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                      color: isFav ? '#fca5a5' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isFav ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)' }}
                  >
                    <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                  {song.audioUrl && (
                    <a
                      href={String(song.audioUrl)}
                      download
                      title="تحميل"
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        border: 'none',
                        background: 'rgba(16,185,129,0.1)',
                        color: '#6ee7b7',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      <Download size={14} />
                    </a>
                  )}
                  <button
                    title="حذف"
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: 'none',
                      background: 'rgba(239,68,68,0.06)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s', opacity: 0.6,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.6'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary Footer */}
      {!loading && songs.length > 0 && (
        <div style={{
          marginTop: 28,
          padding: '16px 20px',
          background: 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(99,102,241,0.1)',
          borderRadius: 14,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          textAlign: 'center',
        }}>
          {[
            { val: songs.length, label: 'إجمالي', color: '#a5b4fc' },
            { val: statusCounts.COMPLETED, label: 'مكتملة', color: '#6ee7b7' },
            { val: statusCounts.PENDING, label: 'قيد التنفيذ', color: '#fcd34d' },
            { val: favorites.size, label: 'مفضلة', color: '#f9a8d4' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  )
}
