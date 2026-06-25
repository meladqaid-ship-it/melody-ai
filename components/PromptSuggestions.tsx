'use client'
import { useState } from 'react'

const SUGGESTIONS = [
  { emoji: '💔', text: 'أغنية خليجية رومانسية حزينة' },
  { emoji: '🎸', text: 'إيقاع يمني تقليدي بالعود' },
  { emoji: '🌊', text: 'موسيقى عربية حزينة بالعود' },
  { emoji: '🔥', text: 'Arabic Trap Beat مع كلمات قوية' },
  { emoji: '🏜️', text: 'موسيقى سينمائية صحراوية درامية' },
  { emoji: '✨', text: 'أغنية بوب عربية مرحة وخفيفة' },
  { emoji: '🎭', text: 'موسيقى درامية حزينة للأفلام' },
  { emoji: '🌙', text: 'موسيقى لوفي هادئة للدراسة' },
]

interface PromptSuggestionsProps {
  onSelect: (text: string) => void
}

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (text: string) => {
    setSelected(text)
    onSelect(text)
  }

  return (
    <div className="card" style={{ background: 'rgba(11,16,35,.95)' }}>
      <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>💡 اقتراحات ذكية</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.text}
            onClick={() => handleSelect(suggestion.text)}
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              border: selected === suggestion.text ? '1px solid rgba(99,102,241,.5)' : '1px solid rgba(255,255,255,.1)',
              background: selected === suggestion.text ? 'rgba(99,102,241,.15)' : 'rgba(255,255,255,.04)',
              color: selected === suggestion.text ? '#a5b4fc' : '#cbd5e1',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              textAlign: 'left',
              transition: 'all .15s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,.1)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,.3)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#cbd5e1'
            }}
            onMouseLeave={(e) => {
              if (selected !== suggestion.text) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.04)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.1)'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#cbd5e1'
              }
            }}
          >
            <span style={{ fontSize: 14 }}>{suggestion.emoji}</span>
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
