import { Music, Zap, Lock, Sparkles, BarChart3, Shield } from 'lucide-react'
import { FeatureCard } from './FeatureCard'

const FEATURES = [
  {
    icon: Music,
    title: 'توليد الأغاني بالذكاء الاصطناعي',
    description: 'أنشئ أغاني كاملة بالعربية والإنجليزية بضغطة زر واحدة',
    color: '#a5b4fc',
  },
  {
    icon: Lock,
    title: 'مصادقة آمنة',
    description: 'تسجيل دخول بالبريد الإلكتروني أو Google مع JWT وRefresh Tokens',
    color: '#6ee7b7',
  },
  {
    icon: Sparkles,
    title: 'نظام Credits متكامل',
    description: 'تتبع استهلاكك وشراء Credits جديدة عبر Stripe',
    color: '#fcd34d',
  },
  {
    icon: BarChart3,
    title: 'Dashboard متقدم',
    description: 'لوحة تحكم احترافية بإحصائيات وتحليلات دقيقة',
    color: '#67e8f9',
  },
  {
    icon: Zap,
    title: 'Multi-Tenant',
    description: 'دعم المؤسسات والفرق مع أدوار وصلاحيات متعددة',
    color: '#fb7185',
  },
  {
    icon: Shield,
    title: 'أمان على مستوى المؤسسات',
    description: 'RBAC، Audit Logs، Rate Limiting، وحماية كاملة',
    color: '#86efac',
  },
] as const

export function Features(): JSX.Element {
  return (
    <div className="features-grid" role="region" aria-label="Platform features">
      {FEATURES.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          color={feature.color}
        />
      ))}
    </div>
  )
}
