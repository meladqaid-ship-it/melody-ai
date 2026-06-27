'use client'
import { useState } from 'react'
import { Sparkles, ChevronDown } from 'lucide-react'

const SUGGESTIONS = [
  { emoji: '💔', text: 'أغنية خليجية رومانسية حزينة عن الفراق', tag: 'KHALEEJI' },
  { emoji: '🎸', text: 'إيقاع يمني تقليدي بالعود والمراوح', tag: 'YEMENI' },
  { emoji: '🌊', text: 'موسيقى عربية هادئة بالعود لوقت الراحة', tag: 'ACOUSTIC' },
  { emoji: '🔥', text: 'Arabic Trap Beat مع كلمات قوية عن النجاح', tag: 'TRAP' },
  { emoji: '🏜️', text: 'موسيقى سينمائية صحراوية درامية وملهمة', tag: 'CINEMATIC' },
  { emoji: '✨', text: 'أغنية بوب عربية مرحة وعصرية للشباب', tag: 'POP' },
  { emoji: '🌙', text: 'موسيقى لوفي هادئة عربية للدراسة والتركيز', tag: 'LOFI' },
  { emoji: '🎭', text: 'بلاد عربية — موسيقى ملحمية بالأوركسترا', tag: 'CINEMATIC' },
]

const QUICK_GENRES = [
  { label: 'خليجي', value: 'KHALEEJI', emoji: '🏝' },
  { label: 'يمني', value: 'YEMENI', emoji: '🏔' },
  { label: 'سينمائي', value: 'CINEMATIC', emoji: '🎬' },
  { label: 'عربي', value: 'ARABIC', emoji: '🎵' },
  { label: 'ترب', value: 'TRAP', emoji: '🔥' },
  { label: 'لوفي', value: 'LOFI', emoji: '🌙' },
]

interface PromptSuggestionsProps {
  onSelect: (text: string) => void
}

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const handleSelect = (text: string) => {
    setSelected(text)
    onSelect(text)
  }

  const shown = expanded ? SUGGESTIONS : SUGGESTIONS.slice(0, 4)

  return (
    <div className="card" style={{ background: 'rgba(12,16,34,0.95)', padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Sparkles size={16} color="#a5b4fc" />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>أمثلة لإلهامك</span>
      </div>

      {/* Quick Genre Pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {QUICK_GENRES.map((g) => (
          <button
            key={g.value}
            onClick={() => handleSelect(`موسيقى ${g.label} — أغنية ${g.label} احترافية`)}
            className="genre-chip"
            style={{ fontSize: 11, padding: '4px 10px' }}
          >
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />

      {/* Suggestion Cards */}
      <div style={{ display: 'grid', gap: 7 }}>
        {shown.map((s) => (
          <button
            key={s.text}
            onClick={() => handleSelect(s.text)}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: `1px solid ${selected === s.text ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)'}`,
              background: selected === s.text ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
              color: selected === s.text ? '#a5b4fc' : '#94a3b8',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              textAlign: 'right',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement
              if (selected !== s.text) {
                b.style.background = 'rgba(99,102,241,0.08)'
                b.style.borderColor = 'rgba(99,102,241,0.2)'
                b.style.color = '#cbd5e1'
              }
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement
              if (selected !== s.text) {
                b.style.background = 'rgba(255,255,255,0.03)'
                b.style.borderColor = 'rgba(255,255,255,0.07)'
                b.style.color = '#94a3b8'
              }
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{s.emoji}</span>
            <span style={{ flex: 1 }}>{s.text}</span>
            <span className="pill gray" style={{ fontSize: 10, padding: '2px 6px', flexShrink: 0 }}>
              {s.tag}
            </span>
          </button>
        ))}
      </div>

      {SUGGESTIONS.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: 10,
            width: '100%',
            padding: '8px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontWeight: 600,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b' }}
        >
          {expanded ? 'عرض أقل' : `عرض ${SUGGESTIONS.length - 4} أمثلة أكثر`}
          <ChevronDown
            size={14}
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>
      )}
    </div>
  )
}
