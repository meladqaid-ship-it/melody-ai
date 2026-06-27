import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps): JSX.Element {
  return (
    <div className="card hover">
      <div style={{
        width: 48, height: 48,
        borderRadius: 12,
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        border: `1px solid ${color}20`,
      }}>
        <Icon size={22} color={color} />
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{description}</p>
    </div>
  )
}
