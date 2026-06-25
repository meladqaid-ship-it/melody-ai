interface StatCardProps {
  readonly value: string
  readonly label: string
  readonly color: string
}

export function StatCard({ value, label, color }: StatCardProps): JSX.Element {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 32,
          fontWeight: 900,
          color: color,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
    </div>
  )
}
