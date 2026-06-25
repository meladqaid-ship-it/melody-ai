'use client'
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Download, RotateCcw, Heart } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl?: string
  title: string
  duration?: number
  onDownload?: () => void
  onRegenerate?: () => void
  onFavorite?: () => void
  isFavorite?: boolean
}

export function AudioPlayer({
  audioUrl,
  title,
  duration = 0,
  onDownload,
  onRegenerate,
  onFavorite,
  isFavorite = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [waveformBars, setWaveformBars] = useState<number[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)

  // Generate waveform visualization
  useEffect(() => {
    const bars = Array.from({ length: 40 }, () => Math.random() * 100)
    setWaveformBars(bars)
  }, [])

  // Update current time
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    audio.addEventListener('timeupdate', updateTime)
    return () => audio.removeEventListener('timeupdate', updateTime)
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * (audioRef.current.duration || 0)
  }

  return (
    <div className="card" style={{ background: 'rgba(11,16,35,.95)', borderColor: 'rgba(99,102,241,.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>🎵 {title}</h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>مشغل الموسيقى الاحترافي</p>
        </div>
        <button
          onClick={togglePlay}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all .2s',
            boxShadow: '0 8px 16px rgba(79,70,229,.3)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 24px rgba(79,70,229,.5)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 16px rgba(79,70,229,.3)'
          }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

      {/* Waveform Visualization */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 2,
          height: 40,
          marginBottom: 16,
          padding: '12px 0',
          background: 'rgba(255,255,255,.02)',
          borderRadius: 8,
        }}
      >
        {waveformBars.map((height, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              height: `${height}%`,
              background: `linear-gradient(180deg, #4f46e5, #7c3aed)`,
              borderRadius: 2,
              opacity: currentTime > (i / waveformBars.length) * (audioRef.current?.duration || 0) ? 1 : 0.4,
              transition: 'opacity .1s',
              boxShadow: currentTime > (i / waveformBars.length) * (audioRef.current?.duration || 0) ? '0 0 8px rgba(79,70,229,.6)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div
        onClick={handleProgressClick}
        style={{
          width: '100%',
          height: 6,
          background: 'rgba(255,255,255,.08)',
          borderRadius: 999,
          cursor: 'pointer',
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${audioRef.current?.duration ? (currentTime / audioRef.current.duration) * 100 : 0}%`,
            background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
            transition: 'width .1s',
            boxShadow: '0 0 12px rgba(79,70,229,.6)',
          }}
        />
      </div>

      {/* Time Display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(audioRef.current?.duration || duration || 0)}</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <button
          onClick={onFavorite}
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,.1)',
            background: isFavorite ? 'rgba(239,68,68,.15)' : 'rgba(255,255,255,.05)',
            color: isFavorite ? '#fca5a5' : '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,.2)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,.3)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = isFavorite ? 'rgba(239,68,68,.15)' : 'rgba(255,255,255,.05)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.1)'
          }}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          المفضلة
        </button>
        <button
          onClick={onRegenerate}
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,.1)',
            background: 'rgba(255,255,255,.05)',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,.15)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,.3)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#a5b4fc'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.05)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.1)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'
          }}
        >
          <RotateCcw size={16} />
          إعادة توليد
        </button>
        <button
          onClick={onDownload}
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,.1)',
            background: 'rgba(255,255,255,.05)',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,.15)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(16,185,129,.3)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#6ee7b7'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.05)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.1)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'
          }}
        >
          <Download size={16} />
          تحميل
        </button>
      </div>

      <audio ref={audioRef} src={audioUrl} />
    </div>
  )
}
