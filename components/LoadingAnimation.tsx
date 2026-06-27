'use client'
import { useEffect, useState } from 'react'

const STATES = [
  { icon: '🎵', text: 'تحليل النمط الموسيقي...', color: '#a5b4fc' },
  { icon: '🎼', text: 'إنشاء اللحن العربي...', color: '#6ee7b7' },
  { icon: '🥁', text: 'دمج الآلات الموسيقية...', color: '#fcd34d' },
  { icon: '🎤', text: 'معالجة الصوت والكلمات...', color: '#f9a8d4' },
  { icon: '✨', text: 'تحسين جودة الصوت...', color: '#67e8f9' },
  { icon: '🚀', text: 'اللمسات الأخيرة...', color: '#86efac' },
]

interface LoadingAnimationProps {
  progress?: number
}

export function LoadingAnimation({ progress = 0 }: LoadingAnimationProps) {
  const [stateIdx, setStateIdx] = useState(0)
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIdx((p) => (p + 1) % STATES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  // Animate displayed percentage toward real progress
  useEffect(() => {
    const t = setInterval(() => {
      setDisplayPct((p) => {
        if (p < progress) return Math.min(p + 1, progress)
        return p
      })
    }, 16)
    return () => clearInterval(t)
  }, [progress])

  const current = STATES[stateIdx]

  return (
    <div className="card" style={{
      textAlign: 'center',
      background: 'rgba(12,16,34,0.98)',
      borderColor: 'rgba(99,102,241,0.2)',
      padding: 32,
    }}>
      {/* AI Thinking Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 28,
      }}>
        <div style={{
          width: 10, height: 10,
          borderRadius: '50%',
          background: current.color,
          boxShadow: `0 0 12px ${current.color}`,
          animation: 'pulse 1s infinite',
        }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>
          AI يعمل على أغنيتك...
        </span>
      </div>

      {/* Animated Waveform */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        height: 72,
        marginBottom: 28,
        background: 'rgba(99,102,241,0.05)',
        borderRadius: 16,
        padding: '0 20px',
        border: '1px solid rgba(99,102,241,0.1)',
      }}>
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              borderRadius: 3,
              background: `linear-gradient(180deg, ${current.color}, rgba(99,102,241,0.5))`,
              transformOrigin: 'center',
              animation: `waveBar ${0.4 + (i % 6) * 0.1}s ease-in-out infinite`,
              animationDelay: `${(i % 8) * 0.08}s`,
              maxHeight: '100%',
              minHeight: 4,
              height: `${20 + Math.sin(i) * 30 + Math.random() * 20}%`,
              boxShadow: `0 0 8px ${current.color}50`,
            }}
          />
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>تقدم التوليد</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: current.color }}>
            {displayPct}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${displayPct}%` }} />
        </div>
      </div>

      {/* Current State */}
      <div style={{
        padding: '14px 20px',
        background: 'rgba(99,102,241,0.08)',
        borderRadius: 12,
        border: '1px solid rgba(99,102,241,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        minHeight: 52,
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 20 }}>{current.icon}</span>
        <span style={{
          fontSize: 14,
          color: current.color,
          fontWeight: 600,
          transition: 'color 0.3s',
        }}>
          {current.text}
        </span>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {STATES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === stateIdx ? 20 : 6,
              height: 6,
              borderRadius: 999,
              background: i === stateIdx ? current.color : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: 12, color: '#475569', marginTop: 16, marginBottom: 0 }}>
        متوسط وقت التوليد: 30–120 ثانية
      </p>
    </div>
  )
}
