'use client'
import { Shell } from '@/components/Shell'
import { AudioPlayer } from '@/components/AudioPlayer'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { PromptSuggestions } from '@/components/PromptSuggestions'
import { apiPost, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Sparkles, Music } from 'lucide-react'

type GenerateResult = {
  id?: string
  title?: string
  status?: string
  message?: string
  [key: string]: unknown
}

const GENRES = ['POP', 'RAP', 'ROCK', 'EDM', 'ARABIC', 'KHALEEJI', 'YEMENI', 'LOFI', 'CINEMATIC', 'ACOUSTIC']
const MOODS = ['HAPPY', 'SAD', 'EPIC', 'ROMANTIC', 'EMOTIONAL', 'MOTIVATIONAL']
const LANGUAGES = [
  { value: 'ARABIC', label: 'عربي' },
  { value: 'ENGLISH', label: 'إنجليزي' },
]
const VOICES = [
  { value: 'MALE', label: 'ذكر' },
  { value: 'FEMALE', label: 'أنثى' },
]

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

  useEffect(() => {
    if (!getStoredUser()) window.location.href = '/login'
  }, [])

  // Simulate progress during generation
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 15, 95))
    }, 500)
    return () => clearInterval(interval)
  }, [loading])

  async function generate() {
    if (!prompt.trim()) return
    setError('')
    setResult(null)
    setLoading(true)
    setProgress(0)
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

  return (
    <Shell>
      <div className="tabs">
        <button className={`tab${tab === 'generate' ? ' active' : ''}`} onClick={() => setTab('generate')}>
          <Music size={16} style={{ marginRight: 6 }} />
          🎵 توليد أغنية
        </button>
        <button className={`tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>
          📜 السجل
        </button>
      </div>

      {tab === 'generate' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Sparkles size={20} style={{ color: '#a5b4fc' }} />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>مولِّد الأغاني بالذكاء الاصطناعي</h3>
              </div>

              <div className="field">
                <label>عنوان الأغنية</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="اتركه فارغاً للتوليد التلقائي"
                />
              </div>

              <div className="field">
                <label>الفكرة / الكلمات *</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="اكتب فكرة الأغنية، المحتوى، أو الكلمات التي تريدها..."
                  style={{ minHeight: 120 }}
                />
              </div>

              <div className="form-row">
                <div className="field">
                  <label>النوع الموسيقي</label>
                  <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                    {GENRES.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>الحالة المزاجية</label>
                  <select value={mood} onChange={(e) => setMood(e.target.value)}>
                    {MOODS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>اللغة</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>الصوت</label>
                  <select value={voiceType} onChange={(e) => setVoiceType(e.target.value)}>
                    {VOICES.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>المدة: {duration} ثانية</label>
                <input
                  type="range"
                  min={30}
                  max={300}
                  step={15}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#4f46e5' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                <span className="pill indigo">💎 تكلفة: 10 Credits</span>
                <button
                  className="btn"
                  onClick={generate}
                  disabled={loading || !prompt.trim()}
                  style={{
                    opacity: loading || !prompt.trim() ? 0.6 : 1,
                    cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? '⏳ جاري التوليد...' : '🚀 توليد الأغنية'}
                </button>
              </div>
            </div>

            <PromptSuggestions onSelect={setPrompt} />
          </div>

          <div>
            {error && <div className="error">{error}</div>}
            {loading && <LoadingAnimation progress={progress} />}
            {result && (
              <div>
                <div className="card" style={{ marginBottom: 16 }}>
                  <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>✅</span> تم إنشاء الطلب بنجاح
                  </h3>
                  {result.id && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <span className="pill indigo">ID: {String(result.id).slice(0, 8)}...</span>
                      <span className={`pill ${result.status === 'COMPLETED' ? 'green' : result.status === 'FAILED' ? 'red' : 'amber'}`}>
                        {String(result.status || 'PENDING')}
                      </span>
                    </div>
                  )}
                  {result.title && (
                    <p style={{ margin: '8px 0', fontSize: 14 }}>
                      <strong>العنوان:</strong> {String(result.title)}
                    </p>
                  )}
                  {result.message && <p style={{ margin: '8px 0', fontSize: 13, color: '#64748b' }}>{String(result.message)}</p>}
                </div>

                <AudioPlayer title={result.title as string || 'الأغنية'} duration={duration} />

                <details style={{ marginTop: 16 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                    تفاصيل تقنية
                  </summary>
                  <pre className="pre" style={{ marginTop: 12 }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
            {!loading && !result && !error && (
              <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 64, marginBottom: 16, animation: 'bounce 2s infinite' }}>🎵</div>
                <p className="muted" style={{ fontSize: 16, fontWeight: 600 }}>
                  ابدأ بكتابة فكرتك الموسيقية
                </p>
                <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
                  سيظهر الناتج هنا بعد التوليد مباشرة
                </p>
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
    import('@/lib/api').then(({ apiGet }) =>
      apiGet<{ songs: unknown[] }>('/api/songs')
        .then((d) => setSongs(d?.songs || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    )
  }, [])

  if (loading)
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton" style={{ height: 60 }} />
          </div>
        ))}
      </div>
    )

  if (!songs.length)
    return (
      <div className="empty-state">
        <div className="empty-icon">🎵</div>
        <h3>لا توجد أغاني بعد</h3>
        <p>ابدأ بإنشاء أول أغنية بالذكاء الاصطناعي الآن</p>
      </div>
    )

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {songs.map((song: unknown) => {
        const s = song as Record<string, unknown>
        return (
          <div key={String(s.id)} className="song-card">
            <div className="song-thumb">🎵</div>
            <div className="song-info">
              <div className="song-title">{String(s.title || 'Untitled')}</div>
              <div className="song-meta">
                {String(s.genre || '')} · {String(s.mood || '')} · {new Date(String(s.createdAt)).toLocaleDateString('ar')}
              </div>
            </div>
            <span className={`pill ${s.status === 'COMPLETED' ? 'green' : s.status === 'FAILED' ? 'red' : 'amber'}`}>
              {String(s.status)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
