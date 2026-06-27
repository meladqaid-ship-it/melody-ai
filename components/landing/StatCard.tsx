interface StatCardProps {
  value: string
  label: string
  color?: string
}

export function StatCard({ value, label, color = '#a5b4fc' }: StatCardProps): JSX.Element {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 32,
        fontWeight: 900,
        color,
        letterSpacing: '-1px',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  )
}
