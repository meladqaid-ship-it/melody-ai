'use client'
import Link from 'next/link'
import { Play, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const DEMO_SONGS = [
  { title: 'أغنية خليجية رومانسية — 3:42', genre: 'KHALEEJI', active: true },
  { title: 'موسيقى سينمائية صحراوية — 2:18', genre: 'CINEMATIC', active: false },
  { title: 'Arabic Trap Beat — 2:55', genre: 'TRAP', active: false },
]

function AnimatedWaveform({ isPlaying }: { isPlaying: boolean }) {
  const bars = Array.from({ length: 48 }, (_, i) => ({
    delay: (i % 8) * 0.1,
    height: 15 + Math.sin(i * 0.6) * 25 + Math.random() * 30,
  }))

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      height: 64,
    }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            borderRadius: 2,
            background: i < 22
              ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
              : 'rgba(255,255,255,0.12)',
            transformOrigin: 'center',
            animation: isPlaying
              ? `waveBar ${0.5 + bar.delay}s ease-in-out infinite`
              : 'none',
            animationDelay: `${bar.delay}s`,
            minHeight: 4,
            height: isPlaying ? undefined : `${bar.height}%`,
            maxHeight: '100%',
            transition: 'background 0.3s',
            boxShadow: i < 22 ? '0 0 6px rgba(99,102,241,0.5)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

export function Hero(): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(42)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.3))
      }, 50)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying])

  return (
    <section className="hero" style={{ paddingBottom: 0 }}>
      {/* Background decorative elements */}
      <div className="landing-bg">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-orb landing-orb-3" />
        <div className="landing-grid" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="badge">
          <span className="badge-dot" />
          ✨ منصة الذكاء الاصطناعي الموسيقي العربي #1
        </div>

        <h1>
          حوّل أفكارك إلى<br />
          <span className="grad-text">موسيقى عربية</span><br />
          في ثوانٍ
        </h1>

        <p className="hero-sub">
          أنشئ أغاني خليجية، يمنية، وعربية باستخدام أحدث تقنيات الذكاء الاصطناعي.
          صوت احترافي، كلمات مخصصة، وإنتاج فوري بضغطة واحدة.
        </p>

        <div className="hero-actions">
          <Link href="/register" className="btn lg">
            <Sparkles size={18} />
            ابدأ مجاناً — 100 Credit
          </Link>
          <Link href="/login" className="btn outline lg">
            تسجيل الدخول
          </Link>
        </div>

        {/* Demo Player */}
        <div className="hero-demo" style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                معاينة مباشرة
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>
                {DEMO_SONGS[0].title}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="pill indigo">AI Generated</span>
            </div>
          </div>

          <AnimatedWaveform isPlaying={isPlaying} />

          <div style={{ marginTop: 12 }}>
            <div className="hero-demo-bar" style={{ marginBottom: 8 }}>
              <div className="hero-demo-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', fontWeight: 500 }}>
              <span>1:33</span>
              <span>3:42</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <button
              className="hero-demo-play"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
            >
              {isPlaying
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <Play size={16} fill="white" style={{ marginLeft: 2 }} />
              }
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DEMO_SONGS.map((song, i) => (
                  <span key={i} className={`genre-chip${i === 0 ? ' active' : ''}`} style={{ fontSize: 11 }}>
                    {song.genre}
                  </span>
                ))}
              </div>
            </div>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>تم التوليد بـ Melody AI</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row" style={{ paddingTop: 64, paddingBottom: 80 }}>
          {[
            { value: '10K+', label: 'أغنية مولَّدة', color: '#a5b4fc' },
            { value: '5K+',  label: 'صانع محتوى نشط', color: '#6ee7b7' },
            { value: '50ms', label: 'متوسط وقت البدء', color: '#fcd34d' },
            { value: '99.9%', label: 'وقت التشغيل', color: '#f9a8d4' },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-number" style={{ color: s.color, background: 'none', WebkitTextFillColor: s.color }}>
                {s.value}
              </div>
              <div className="stat-desc">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
