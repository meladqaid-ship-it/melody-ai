'use client'
import { useEffect, useState } from 'react'

const GENERATION_STATES = [
  'تحليل النمط الموسيقي...',
  'إنشاء اللحن العربي...',
  'دمج الآلات الموسيقية...',
  'تحسين جودة الصوت...',
  'إنهاء المعالجة...',
]

interface LoadingAnimationProps {
  progress?: number
}

export function LoadingAnimation({ progress = 60 }: LoadingAnimationProps) {
  const [currentState, setCurrentState] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % GENERATION_STATES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ marginTop: 0, fontSize: 18, fontWeight: 700 }}>⏳ جاري التوليد...</h3>

      {/* Animated Waveform */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 3,
          height: 60,
          margin: '24px 0',
          padding: '16px 0',
          background: 'rgba(99,102,241,.05)',
          borderRadius: 12,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              height: `${Math.random() * 100}%`,
              background: `linear-gradient(180deg, #4f46e5, #7c3aed)`,
              borderRadius: 2,
              animation: `waveform ${0.6 + i * 0.05}s ease-in-out infinite`,
              boxShadow: '0 0 8px rgba(79,70,229,.6)',
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: 8,
          background: 'rgba(255,255,255,.08)',
          borderRadius: 999,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
            transition: 'width .3s',
            boxShadow: '0 0 16px rgba(79,70,229,.8)',
          }}
        />
      </div>

      {/* Progress Text */}
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px' }}>{progress}%</p>

      {/* Current State */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(99,102,241,.1)',
          borderRadius: 10,
          border: '1px solid rgba(99,102,241,.2)',
          marginBottom: 16,
          minHeight: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: '#a5b4fc', fontWeight: 600 }}>
          {GENERATION_STATES[currentState]}
        </p>
      </div>

      {/* Loading Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4f46e5',
              animation: `bounce 0.6s infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: 12, color: '#64748b', marginTop: 16, marginBottom: 0 }}>
        قد يستغرق التوليد من 30 إلى 120 ثانية
      </p>
    </div>
  )
}
