import { Music, Zap, Globe, Sparkles, BarChart3, Shield } from 'lucide-react'

const FEATURES = [
  {
    icon: Music,
    title: 'موسيقى عربية أصيلة',
    description: 'خليجي، يمني، شامي، مصري — AI يفهم الأنماط الموسيقية العربية ويوليد بإحساس حقيقي.',
    color: '#a5b4fc',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    icon: Zap,
    title: 'توليد فوري في ثوانٍ',
    description: 'من الفكرة إلى الأغنية الكاملة خلال 30-120 ثانية. لا انتظار، لا تعقيد.',
    color: '#fcd34d',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    icon: Sparkles,
    title: 'AI يفهم كلماتك',
    description: 'اكتب بالعربية أو الإنجليزية — نظام تحسين الكلمات يفهم السياق ويضيف إحساساً حقيقياً.',
    color: '#6ee7b7',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: Globe,
    title: 'أصوات متعددة',
    description: 'ذكر وأنثى، بيئات صوتية متنوعة، تحكم كامل في النبرة والطابع الموسيقي.',
    color: '#67e8f9',
    bg: 'rgba(8,145,178,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Studio احترافي',
    description: 'مشغل موسيقي متكامل، تاريخ المشاريع، تحميل مباشر — كل شيء في مكان واحد.',
    color: '#fb7185',
    bg: 'rgba(244,63,94,0.08)',
  },
  {
    icon: Shield,
    title: 'آمن ومحمي',
    description: 'ملكية فكرية كاملة لإبداعاتك، تشفير على مستوى المؤسسات، بيانات لا تُباع.',
    color: '#86efac',
    bg: 'rgba(34,197,94,0.08)',
  },
] as const

export function Features(): JSX.Element {
  return (
    <div className="features-section" style={{ position: 'relative', zIndex: 1 }}>
      <p className="section-eyebrow">لماذا Melody AI</p>
      <h2 className="section-title">كل ما تحتاجه لإنشاء موسيقى احترافية</h2>

      <div className="features-grid">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <div key={f.title} className="card hover" style={{ background: 'rgba(12,16,34,0.95)' }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                background: f.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
                border: `1px solid ${f.color}20`,
              }}>
                <Icon size={22} color={f.color} />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{f.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
