import Link from 'next/link'
import { Music } from 'lucide-react'

export function Navigation(): JSX.Element {
  return (
    <nav className="nav" role="navigation" aria-label="التنقل الرئيسي">
      <div className="brand">
        <div className="brand-icon">
          <Music size={16} color="white" />
        </div>
        Melody AI
      </div>
      <div className="nav-links">
        <a href="#features" className="nav-link">المميزات</a>
        <a href="#pricing" className="nav-link">الأسعار</a>
        <Link href="/login" className="nav-link">تسجيل الدخول</Link>
        <Link href="/register" className="btn sm">ابدأ مجاناً</Link>
      </div>
    </nav>
  )
}
