'use client'
import { Shell } from '@/components/Shell'
import { apiGet, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Download, Heart, Trash2, Play } from 'lucide-react'

type Song = Record<string, unknown>

export default function ProjectsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'>('ALL')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!getStoredUser()) {
      window.location.href = '/login'
      return
    }
    apiGet<{ songs: Song[] }>('/api/songs?limit=50')
      .then((d) => setSongs(d?.songs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? songs : songs.filter((s) => s.status === filter)

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <Shell>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>📁 المشاريع والأغاني</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            إدارة جميع أغانيك المولَّدة والمشاريع الخاصة بك
          </p>
        </div>
        <a href="/studio" className="btn sm">
          + أغنية جديدة
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        {(['ALL', 'COMPLETED', 'PENDING', 'FAILED'] as const).map((f) => (
          <button key={f} className={`tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? '📊 الكل' : f === 'COMPLETED' ? '✅ مكتمل' : f === 'PENDING' ? '⏳ قيد التنفيذ' : '❌ فشل'}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton" style={{ height: 56 }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>{filter === 'ALL' ? 'لا توجد أغاني بعد' : `لا توجد أغاني ${filter === 'COMPLETED' ? 'مكتملة' : filter === 'PENDING' ? 'قيد التنفيذ' : 'فاشلة'}`}</h3>
          <p>ابدأ بإنشاء أغنيتك في AI Studio</p>
          <a href="/studio" className="btn mt-4">
            🎵 AI Studio
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map((song) => {
            const songId = String(song.id)
            const isFav = favorites.has(songId)
            return (
              <div key={songId} className="song-card">
                <div className="song-thumb" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', position: 'relative' }}>
                  <div style={{ fontSize: 20 }}>🎵</div>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,.3)',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity .15s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = '1'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = '0'
                    }}
                  >
                    <Play size={20} fill="white" />
                  </div>
                </div>

                <div className="song-info">
                  <div className="song-title">{String(song.title || 'Untitled')}</div>
                  <div className="song-meta">
                    {String(song.genre || '')} · {String(song.mood || '')} · {String(song.language || '')} ·{' '}
                    {new Date(String(song.createdAt)).toLocaleDateString('ar')}
                  </div>
                  {song.status === 'PROCESSING' && (
                    <div className="progress-bar" style={{ marginTop: 6 }}>
                      <div className="progress-fill" style={{ width: `${song.progress || 0}%` }} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span
                    className={`pill ${song.status === 'COMPLETED' ? 'green' : song.status === 'FAILED' ? 'red' : 'amber'}`}
                  >
                    {song.status === 'COMPLETED' ? '✅' : song.status === 'FAILED' ? '❌' : '⏳'} {String(song.status)}
                  </span>

                  {/* Action Buttons */}
                  <button
                    onClick={() => toggleFavorite(songId)}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      border: 'none',
                      background: isFav ? 'rgba(239,68,68,.15)' : 'rgba(255,255,255,.05)',
                      color: isFav ? '#fca5a5' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all .15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,.2)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = '#fca5a5'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = isFav ? 'rgba(239,68,68,.15)' : 'rgba(255,255,255,.05)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = isFav ? '#fca5a5' : '#64748b'
                    }}
                    title="إضافة إلى المفضلة"
                  >
                    <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                  </button>

                  {song.audioUrl && (
                    <a
                      href={String(song.audioUrl)}
                      download
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        border: 'none',
                        background: 'rgba(16,185,129,.15)',
                        color: '#6ee7b7',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all .15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(16,185,129,.25)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(16,185,129,.15)'
                      }}
                      title="تحميل الأغنية"
                    >
                      <Download size={16} />
                    </a>
                  )}

                  <button
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      border: 'none',
                      background: 'rgba(239,68,68,.1)',
                      color: '#fca5a5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all .15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,.2)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,.1)'
                    }}
                    title="حذف الأغنية"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats Footer */}
      {!loading && songs.length > 0 && (
        <div
          style={{
            marginTop: 32,
            padding: 16,
            background: 'rgba(99,102,241,.05)',
            border: '1px solid rgba(99,102,241,.1)',
            borderRadius: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#a5b4fc' }}>{songs.length}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>إجمالي الأغاني</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#6ee7b7' }}>
              {songs.filter((s) => s.status === 'COMPLETED').length}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>مكتملة</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fcd34d' }}>{favorites.size}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>مفضلة</div>
          </div>
        </div>
      )}
    </Shell>
  )
}
