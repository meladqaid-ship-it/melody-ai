'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clearSession, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Menu, X, LogOut, Zap, Music, Folder, CreditCard, Settings, Shield, Activity } from 'lucide-react'
import type { ApiUser } from '@/lib/api'

const NAV = [
  { href: '/dashboard', icon: Zap,     emoji: '⚡', label: 'Dashboard' },
  { href: '/studio',    icon: Music,   emoji: '🎵', label: 'AI Studio' },
  { href: '/projects',  icon: Folder,  emoji: '📁', label: 'المشاريع' },
  { href: '/credits',   icon: CreditCard, emoji: '💎', label: 'Credits' },
  { href: '/billing',   icon: CreditCard, emoji: '💳', label: 'Billing' },
  { href: '/settings',  icon: Settings, emoji: '⚙️', label: 'الإعدادات' },
]

const ADMIN_NAV = [
  { href: '/admin',  icon: Shield,   emoji: '🛡️', label: 'Admin Panel' },
  { href: '/status', icon: Activity, emoji: '🔍', label: 'System Status' },
]

const BOTTOM_NAV = [
  { href: '/dashboard', emoji: '⚡', label: 'الرئيسية' },
  { href: '/studio',    emoji: '🎵', label: 'Studio' },
  { href: '/projects',  emoji: '📁', label: 'مشاريع' },
  { href: '/credits',   emoji: '💎', label: 'Credits' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setUser(getStoredUser()) }, [])

  const logout = () => { clearSession(); window.location.href = '/login' }
  const initial = (user?.name || user?.email || 'U')[0].toUpperCase()
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  return (
    <div className="app">
      <style>{`
        @media (min-width: 901px) {
          .sidebar { display: flex !important; }
          .mobile-top-btn { display: none !important; }
        }
        @media (max-width: 900px) {
          .app { grid-template-columns: 1fr !important; }
          .sidebar { display: none !important; }
          .mobile-top-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="sidebar" style={{ display: 'none' }}>
        <div className="sidebar-brand">
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
          }}>
            🎵
          </div>
          Melody AI
        </div>

        <div className="sidebar-section-label">الرئيسية</div>
        <nav>
          {NAV.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${pathname === item.href ? ' active' : ''}`}
            >
              <span className="icon">{item.emoji}</span>
              {item.label}
              {item.href === '/studio' && (
                <span className="pill indigo" style={{ marginLeft: 'auto', fontSize: 9, padding: '1px 6px' }}>AI</span>
              )}
            </Link>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: 18 }}>الحساب</div>
          {NAV.slice(3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${pathname === item.href ? ' active' : ''}`}
            >
              <span className="icon">{item.emoji}</span>
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="sidebar-section-label" style={{ marginTop: 18 }}>الإدارة</div>
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item${pathname === item.href ? ' active' : ''}`}
                >
                  <span className="icon">{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          {/* Credits widget */}
          {user && (
            <div style={{
              padding: '12px 14px',
              background: 'rgba(99,102,241,0.08)',
              borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.15)',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                رصيد Credits
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#a5b4fc' }}>{user.credits ?? 0}</span>
                <Link href="/credits" className="btn sm" style={{ padding: '5px 12px', fontSize: 11 }}>
                  شراء
                </Link>
              </div>
              <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, ((user.credits ?? 0) / 500) * 100)}%`,
                  background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
                  borderRadius: 999,
                }} />
              </div>
            </div>
          )}

          <div className="user-chip">
            <div className="avatar">{initial}</div>
            <div className="user-meta">
              <div className="user-name">{user?.name || user?.email}</div>
              <div className="user-tier">{user?.tier || 'FREE'} Plan</div>
            </div>
          </div>
          <button
            className="btn ghost full mt-4"
            onClick={logout}
            style={{ fontSize: 13, gap: 6 }}
          >
            <LogOut size={14} />
            تسجيل خروج
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <span className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {NAV.find((n) => n.href === pathname)?.emoji || ADMIN_NAV.find((n) => n.href === pathname)?.emoji || '🎵'}
            {' '}
            {NAV.find((n) => n.href === pathname)?.label || ADMIN_NAV.find((n) => n.href === pathname)?.label || 'Melody AI'}
          </span>
          <div className="topbar-actions">
            <span className="pill indigo" style={{ gap: 4 }}>
              💎 {user?.credits ?? 0}
            </span>
            <button
              className="mobile-top-btn icon-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none' }}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: 'rgba(8,13,31,0.98)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '12px',
            animation: 'slideDown 0.25s ease-out',
          }}>
            {[...NAV, ...(isAdmin ? ADMIN_NAV : [])].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${pathname === item.href ? ' active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="icon">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 8 }}>
              <div className="avatar">{initial}</div>
              <div className="user-meta">
                <div className="user-name">{user?.name || user?.email}</div>
                <div className="user-tier">{user?.tier || 'FREE'} · {user?.credits ?? 0} credits</div>
              </div>
            </div>
            <button
              className="btn ghost full"
              onClick={logout}
              style={{ fontSize: 13, gap: 6 }}
            >
              <LogOut size={14} />
              تسجيل خروج
            </button>
          </div>
        )}

        <div className="content">{children}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav" role="navigation" aria-label="التنقل السفلي">
        {BOTTOM_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item${pathname === item.href ? ' active' : ''}`}
          >
            <span className="bn-icon">{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
