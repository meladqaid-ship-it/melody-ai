import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  readonly icon: LucideIcon
  readonly title: string
  readonly description: string
  readonly color: string
}

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps): JSX.Element {
  return (
    <div className="card hover" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        className="feature-glow"
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${color}20, transparent)`,
          borderRadius: '50%',
        }}
        aria-hidden="true"
      />
      <div
        className="feature-icon-wrapper"
        style={{
          fontSize: 32,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          background: `${color}15`,
          borderRadius: 12,
          color: color,
        }}
        aria-hidden="true"
      >
        <Icon size={24} />
      </div>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p className="muted text-sm" style={{ lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  )
}
