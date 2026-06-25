'use client'

import { Shell } from '@/components/Shell'
import { apiGet, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Download, Heart, Trash2, Play } from 'lucide-react'

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
  isFavorite?: boolean
}

type FilterType = 'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'

export default function ProjectsPage(): JSX.Element {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!getStoredUser()) {
      window.location.href = '/login'
      return
    }
    apiGet<{ songs: Song[] }>('/api/songs?limit=50')
      .then((d) => setSongs(d?.songs || []))
      .catch(() => {
        // Handle error silently
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? songs : songs.filter((s) => s.status === filter)

  const toggleFavorite = (id: string): void => {
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
          <button
            key={f}
            className={`tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
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
                <div
                  className="song-thumb hover-lift"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    position: 'relative',
                  }}
                  role="img"
                  aria-label={`Album art for ${song.title || 'Untitled'}`}
                >
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
                    className="play-overlay"
                    aria-hidden="true"
                  >
                    <Play size={20} fill="white" />
                  </div>
                </div>

                <div className="song-info">
                  <div className="song-title">{String(song.title || 'Untitled')}</div>
                  <div className="song-meta">
                    {String(song.genre || '')} · {String(song.mood || '')} · {String(song.language || '')} ·{' '}
                    {song.createdAt ? new Date(String(song.createdAt)).toLocaleDateString('ar') : 'N/A'}
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
                    className="action-btn favorite-btn"
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={isFav}
                  >
                    <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                  </button>

                  {song.audioUrl && (
                    <a
                      href={String(song.audioUrl)}
                      download
                      className="action-btn download-btn"
                      aria-label="Download song"
                      title="Download song"
                    >
                      <Download size={16} />
                    </a>
                  )}

                  <button
                    className="action-btn delete-btn"
                    aria-label="Delete song"
                    title="Delete song"
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
          role="region"
          aria-label="Statistics"
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

      <style>{`
        .hover-lift:hover {
          transform: translateY(-4px);
        }

        .play-overlay:hover {
          opacity: 1;
        }

        .action-btn {
          padding: 6px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease-out;
        }

        .favorite-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .favorite-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .download-btn {
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
        }

        .download-btn:hover {
          background: rgba(16, 185, 129, 0.25);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      `}</style>
    </Shell>
  )
}
