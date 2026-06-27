'use client'
import { Shell } from '@/components/Shell'
import { AudioPlayer } from '@/components/AudioPlayer'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { PromptSuggestions } from '@/components/PromptSuggestions'
import { apiPost, apiGet, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Sparkles, Music, History, ChevronDown } from 'lucide-react'

type GenerateResult = {
  id?: string
  title?: string
  status?: string
  message?: string
  audioUrl?: string
  [key: string]: unknown
}

const GENRES = [
  { value: 'ARABIC',   label: 'عربي',     emoji: '🎵' },
  { value: 'KHALEEJI', label: 'خليجي',    emoji: '🏝' },
  { value: 'YEMENI',   label: 'يمني',     emoji: '🏔' },
  { value: 'POP',      label: 'Pop',      emoji: '⭐' },
  { value: 'RAP',      label: 'Rap',      emoji: '🎤' },
  { value: 'ROCK',     label: 'Rock',     emoji: '🎸' },
  { value: 'EDM',      label: 'EDM',      emoji: '⚡' },
  { value: 'LOFI',     label: 'Lo-fi',    emoji: '🌙' },
  { value: 'CINEMATIC',label: 'سينمائي',  emoji: '🎬' },
  { value: 'ACOUSTIC', label: 'أكوستيك',  emoji: '🪕' },
]

const MOODS = [
  { value: 'HAPPY',        label: 'مرح',      emoji: '😊' },
  { value: 'SAD',          label: 'حزين',     emoji: '💔' },
  { value: 'EPIC',         label: 'ملحمي',    emoji: '⚔️' },
  { value: 'ROMANTIC',     label: 'رومانسي',  emoji: '💕' },
  { value: 'EMOTIONAL',    label: 'عاطفي',    emoji: '🥹' },
  { value: 'MOTIVATIONAL', label: 'محفز',     emoji: '🚀' },
]

const DURATIONS = [
  { value: 30,  label: '30 ث' },
  { value: 60,  label: '1 د' },
  { value: 90,  label: '1.5 د' },
  { value: 120, label: '2 د' },
  { value: 180, label: '3 د' },
  { value: 240, label: '4 د' },
  { value: 300, label: '5 د' },
]

function ChipSelector({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; emoji?: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="genre-chips">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`genre-chip${value === o.value ? ' active' : ''}`}
        >
          {o.emoji && <span>{o.emoji}</span>}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function StudioPage() {
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('ARABIC')
  const [mood, setMood] = useState('HAPPY')
  const [language, setLanguage] = useState('ARABIC')
  const [voiceType, setVoiceType] = useState('MALE')
  const [duration, setDuration] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [tab, setTab] = useState<'generate' | 'history'>('generate')
  const [progress, setProgress] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (!getStoredUser()) window.location.href = '/login'
  }, [])

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + (Math.random() * 8)
      })
    }, 800)
    return () => clearInterval(interval)
  }, [loading])

  const handlePromptChange = (v: string) => {
    setPrompt(v)
    setCharCount(v.length)
  }

  async function generate() {
    if (!prompt.trim()) return
    setError('')
    setResult(null)
    setLoading(true)
    setProgress(5)
    try {
      const data = await apiPost<GenerateResult>('/api/songs', {
        title: title || prompt.slice(0, 50) || 'Untitled',
        prompt,
        genre,
        mood,
        language,
        voiceType,
        duration,
      })
      setProgress(100)
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'حدث خطأ في التوليد')
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = !loading && prompt.trim().length > 0

  return (
    <Shell>
      <div className="tabs">
        <button
          className={`tab${tab === 'generate' ? ' active' : ''}`}
          onClick={() => setTab('generate')}
        >
          <Music size={15} />
          توليد أغنية
        </button>
        <button
          className={`tab${tab === 'history' ? ' active' : ''}`}
          onClick={() => setTab('history')}
        >
          <History size={15} />
          السجل
        </button>
      </div>

      {tab === 'generate' && (
        <div className="grid-2" style={{ alignItems: 'start', gap: 20 }}>
          {/* Left: Controls */}
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Sparkles size={18} color="#a5b4fc" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>مولِّد الأغاني AI</h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>صف فكرتك وسيتولى AI الباقي</p>
                </div>
              </div>

              {/* Prompt */}
              <div className="field">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>الفكرة / المحتوى *</span>
                  <span style={{ fontSize: 11, color: charCount > 400 ? '#f59e0b' : '#475569', fontWeight: 500 }}>
                    {charCount}/500
                  </span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  placeholder="مثال: أغنية خليجية رومانسية عن الشوق والبعد، أسلوب عاطفي مع صوت العود..."
                  maxLength={500}
                  style={{ minHeight: 130, resize: 'vertical' }}
                />
              </div>

              {/* Genre */}
              <div className="field" style={{ marginBottom: 8 }}>
                <label>النوع الموسيقي</label>
                <ChipSelector options={GENRES} value={genre} onChange={setGenre} />
              </div>

              {/* Mood */}
              <div className="field" style={{ marginBottom: 8 }}>
                <label>الحالة المزاجية</label>
                <ChipSelector options={MOODS} value={mood} onChange={setMood} />
              </div>

              {/* Duration */}
              <div className="field" style={{ marginBottom: 16 }}>
                <label>المدة</label>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`genre-chip${duration === d.value ? ' active' : ''}`}
                      style={{ fontSize: 12 }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: showAdvanced ? 16 : 20,
                  transition: 'color 0.15s',
                  padding: 0,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b' }}
              >
                <ChevronDown
                  size={14}
                  style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                />
                خيارات متقدمة
              </button>

              {showAdvanced && (
                <div style={{ animation: 'slideDown 0.2s ease-out' }}>
                  <div className="field">
                    <label>عنوان الأغنية (اختياري)</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="يتم التوليد تلقائياً إن تُرك فارغاً"
                    />
                  </div>
                  <div className="form-row">
                    <div className="field">
                      <label>اللغة</label>
                      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="ARABIC">🇸🇦 عربي</option>
                        <option value="ENGLISH">🇺🇸 إنجليزي</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>الصوت</label>
                      <select value={voiceType} onChange={(e) => setVoiceType(e.target.value)}>
                        <option value="MALE">👨 ذكر</option>
                        <option value="FEMALE">👩 أنثى</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: 'rgba(99,102,241,0.06)',
                borderRadius: 12,
                border: '1px solid rgba(99,102,241,0.12)',
              }}>
                <div>
                  <span className="pill indigo">💎 10 Credits</span>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#475569' }}>
                    {duration}ث · {genre} · {mood}
                  </p>
                </div>
                <button
                  className="btn"
                  onClick={generate}
                  disabled={!canGenerate}
                  style={{ minWidth: 140 }}
                >
                  {loading ? (
                    <>
                      <span className="loading-dots">
                        <span /><span /><span />
                      </span>
                      جاري التوليد
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      توليد الأغنية
                    </>
                  )}
                </button>
              </div>
            </div>

            <PromptSuggestions onSelect={handlePromptChange} />
          </div>

          {/* Right: Result */}
          <div style={{ display: 'grid', gap: 16 }}>
            {error && (
              <div className="error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                ❌ {error}
              </div>
            )}

            {loading && <LoadingAnimation progress={Math.round(progress)} />}

            {result && !loading && (
              <div style={{ display: 'grid', gap: 14, animation: 'slideUp 0.4s ease-out' }}>
                <div className="success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  ✅ تم إنشاء أغنيتك بنجاح!
                </div>

                <AudioPlayer
                  audioUrl={result.audioUrl as string | undefined}
                  title={String(result.title || 'أغنيتي')}
                  duration={duration}
                  genre={genre}
                  onDownload={() => {
                    if (result.audioUrl) {
                      const a = document.createElement('a')
                      a.href = String(result.audioUrl)
                      a.download = `${result.title || 'melody'}.mp3`
                      a.click()
                    }
                  }}
                  onRegenerate={generate}
                />

                {result.id && (
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 13,
                    color: '#64748b',
                  }}>
                    <span>🆔</span>
                    <span style={{ fontFamily: 'monospace' }}>{String(result.id).slice(0, 16)}...</span>
                    <span className={`pill ${result.status === 'COMPLETED' ? 'green' : result.status === 'FAILED' ? 'red' : 'amber'}`} style={{ marginLeft: 'auto' }}>
                      {String(result.status || 'PENDING')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {!loading && !result && !error && (
              <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
                <span className="empty-icon">🎵</span>
                <h3 style={{ fontSize: 18, color: '#64748b', marginBottom: 8 }}>
                  استوديو الموسيقى جاهز
                </h3>
                <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
                  اكتب فكرتك الموسيقية على اليسار<br />
                  واضغط "توليد الأغنية" للبدء
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
                  <span className="pill indigo">🎵 خليجي</span>
                  <span className="pill green">🏔 يمني</span>
                  <span className="pill amber">🎬 سينمائي</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'history' && <SongHistory />}
    </Shell>
  )
}

function SongHistory() {
  const [songs, setSongs] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<{ songs: unknown[] }>('/api/songs')
      .then((d) => setSongs(d?.songs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'grid', gap: 8 }}>
                <div className="skeleton" style={{ height: 14, width: '60%' }} />
                <div className="skeleton" style={{ height: 12, width: '40%' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!songs.length) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '72px 24px' }}>
        <span className="empty-icon">🎵</span>
        <h3 style={{ fontSize: 20, color: '#64748b', marginBottom: 12 }}>سجلك فارغ حتى الآن</h3>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          أغانيك المولَّدة ستظهر هنا<br />ابدأ بإنشاء أول أغنية لك الآن!
        </p>
        <button className="btn" onClick={() => {}}>
          🚀 إنشاء أغنية الآن
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
          🎵 أغانيك ({songs.length})
        </h3>
      </div>
      {songs.map((song: unknown) => {
        const s = song as Record<string, unknown>
        const statusColor = s.status === 'COMPLETED' ? 'green' : s.status === 'FAILED' ? 'red' : 'amber'
        const statusIcon = s.status === 'COMPLETED' ? '✅' : s.status === 'FAILED' ? '❌' : '⏳'
        return (
          <div key={String(s.id)} className="song-card">
            <div className="song-thumb">🎵</div>
            <div className="song-info">
              <div className="song-title">{String(s.title || 'Untitled')}</div>
              <div className="song-meta">
                {String(s.genre || '')} · {String(s.mood || '')} ·{' '}
                {new Date(String(s.createdAt)).toLocaleDateString('ar', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <span className={`pill ${statusColor}`}>
              {statusIcon} {String(s.status)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
