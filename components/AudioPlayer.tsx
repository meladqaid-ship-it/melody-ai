'use client'
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Download, RotateCcw, Heart, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl?: string
  title: string
  duration?: number
  genre?: string
  onDownload?: () => void
  onRegenerate?: () => void
  onFavorite?: () => void
  isFavorite?: boolean
}

function WaveformBar({ height, played, isPlaying, idx }: { height: number; played: boolean; isPlaying: boolean; idx: number }) {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 3,
        background: played
          ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
          : 'rgba(255,255,255,0.1)',
        transformOrigin: 'center',
        height: `${height}%`,
        maxHeight: '100%',
        minHeight: 3,
        animation: isPlaying && played
          ? `waveBar ${0.4 + (idx % 5) * 0.1}s ease-in-out infinite`
          : 'none',
        animationDelay: `${(idx % 8) * 0.07}s`,
        boxShadow: played ? '0 0 6px rgba(99,102,241,0.5)' : 'none',
        transition: 'background 0.2s',
        cursor: 'pointer',
      }}
    />
  )
}

export function AudioPlayer({
  audioUrl,
  title,
  duration = 0,
  genre,
  onDownload,
  onRegenerate,
  onFavorite,
  isFavorite = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showVolume, setShowVolume] = useState(false)
  const [waveformBars] = useState(() =>
    Array.from({ length: 64 }, () => 15 + Math.random() * 80)
  )
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateTime = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) { audioRef.current.pause() } else { audioRef.current.play() }
    setIsPlaying(!isPlaying)
  }

  const seek = (pct: number) => {
    if (!audioRef.current) return
    const dur = audioRef.current.duration || duration
    audioRef.current.currentTime = pct * dur
  }

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    seek(pct)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const dur = audioRef.current?.duration || duration || 0
  const playedPct = dur ? currentTime / dur : 0

  return (
    <div style={{
      background: 'rgba(8,12,26,0.98)',
      border: '1px solid rgba(99,102,241,0.25)',
      borderRadius: 20,
      padding: 24,
      boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #22d3ee)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            أغنية مولَّدة بالذكاء الاصطناعي
          </div>
          <h3 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: '#f1f5f9',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </h3>
          {genre && (
            <span className="pill indigo" style={{ marginTop: 6 }}>{genre}</span>
          )}
        </div>

        {/* Big Play Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
          style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginLeft: 16,
            boxShadow: '0 8px 24px rgba(79,70,229,0.5)',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.transform = 'scale(1.1)'
            b.style.boxShadow = '0 12px 32px rgba(79,70,229,0.7)'
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.transform = 'scale(1)'
            b.style.boxShadow = '0 8px 24px rgba(79,70,229,0.5)'
          }}
        >
          {isPlaying
            ? <Pause size={22} fill="white" />
            : <Play size={22} fill="white" style={{ marginLeft: 2 }} />
          }
        </button>
      </div>

      {/* Waveform */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          height: 56,
          marginBottom: 12,
          cursor: 'pointer',
          userSelect: 'none',
          padding: '8px 4px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.02)',
        }}
        onClick={handleWaveformClick}
        role="slider"
        aria-label="تقديم/تأخير الأغنية"
        aria-valuenow={Math.round(playedPct * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {waveformBars.map((h, i) => (
          <WaveformBar
            key={i}
            height={h}
            played={i / waveformBars.length < playedPct}
            isPlaying={isPlaying}
            idx={i}
          />
        ))}
      </div>

      {/* Time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569', fontWeight: 600, marginBottom: 16 }}>
        <span style={{ color: '#6366f1' }}>{formatTime(currentTime)}</span>
        <span>{formatTime(dur)}</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 40px', gap: 8 }}>
        <button
          onClick={onFavorite}
          style={{
            padding: '10px',
            borderRadius: 10,
            border: `1px solid ${isFavorite ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
            background: isFavorite ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
            color: isFavorite ? '#fca5a5' : '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.18)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isFavorite ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)' }}
        >
          <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
          مفضلة
        </button>

        <button
          onClick={onRegenerate}
          style={{
            padding: '10px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.background = 'rgba(99,102,241,0.15)'
            b.style.borderColor = 'rgba(99,102,241,0.3)'
            b.style.color = '#a5b4fc'
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.background = 'rgba(255,255,255,0.04)'
            b.style.borderColor = 'rgba(255,255,255,0.1)'
            b.style.color = '#94a3b8'
          }}
        >
          <RotateCcw size={15} />
          توليد مجدد
        </button>

        <button
          onClick={onDownload}
          style={{
            padding: '10px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.background = 'rgba(16,185,129,0.15)'
            b.style.borderColor = 'rgba(16,185,129,0.3)'
            b.style.color = '#6ee7b7'
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.background = 'rgba(255,255,255,0.04)'
            b.style.borderColor = 'rgba(255,255,255,0.1)'
            b.style.color = '#94a3b8'
          }}
        >
          <Download size={15} />
          تحميل
        </button>

        {/* Volume */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowVolume(!showVolume)}
            style={{
              width: 40, height: '100%',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              background: showVolume ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <Volume2 size={15} />
          </button>
          {showVolume && (
            <div style={{
              position: 'absolute',
              bottom: '110%',
              right: 0,
              background: 'rgba(12,16,34,0.98)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 10,
              padding: '12px 10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              animation: 'slideUp 0.2s ease-out',
            }}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{
                  writingMode: 'vertical-lr' as const,
                  direction: 'rtl' as const,
                  height: 80,
                  accentColor: '#6366f1',
                }}
              />
            </div>
          )}
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  )
}
