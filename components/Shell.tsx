'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clearSession, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import type { ApiUser } from '@/lib/api'

const NAV = [
  { href: '/dashboard', icon: '⚡', label: 'Dashboard' },
  { href: '/studio', icon: '🎵', label: 'AI Studio' },
  { href: '/projects', icon: '📁', label: 'المشاريع' },
  { href: '/credits', icon: '💎', label: 'Credits' },
  { href: '/billing', icon: '💳', label: 'Billing' },
  { href: '/settings', icon: '⚙️', label: 'الإعدادات' },
]

const ADMIN_NAV = [
  { href: '/admin', icon: '🛡️', label: 'Admin Panel' },
  { href: '/status', icon: '🔍', label: 'System Status' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const logout = () => {
    clearSession()
    window.location.href = '/login'
  }
  const initial = (user?.name || user?.email || 'U')[0].toUpperCase()
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  return (
    <div className="app" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <aside className="sidebar" style={{ display: 'none' }}>
        <style>{`
          @media (min-width: 901px) {
            .sidebar { display: flex !important; }
            .mobile-nav { display: none !important; }
          }
          @media (max-width: 900px) {
            .app { grid-template-columns: 1fr !important; }
            .sidebar { display: none !important; }
            .mobile-nav { display: flex !important; }
          }
        `}</style>
        <div className="sidebar-brand">Melody AI</div>
        <nav>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${pathname === item.href ? ' active' : ''}`}
              style={{
                animation: 'slideUp 0.3s ease-out',
              }}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '10px 6px' }} />
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item${pathname === item.href ? ' active' : ''}`}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{initial}</div>
            <div className="user-meta">
              <div className="user-name">{user?.name || user?.email}</div>
              <div className="user-tier">
                {user?.tier || 'FREE'} · {user?.credits ?? 0} credits
              </div>
            </div>
          </div>
          <button className="btn ghost full mt-4" onClick={logout} style={{ fontSize: 13 }}>
            تسجيل خروج
          </button>
        </div>
      </aside>

      <div className="main" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header className="topbar">
          <span className="topbar-title">
            {NAV.find((n) => n.href === pathname)?.label || ADMIN_NAV.find((n) => n.href === pathname)?.label || 'Melody AI'}
          </span>
          <div className="topbar-actions">
            <span className="pill indigo">💎 {user?.credits ?? 0}</span>
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: '#e2e8f0',
                cursor: 'pointer',
                padding: 6,
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <style>{`
              @media (max-width: 900px) {
                .mobile-nav-toggle { display: flex !important; align-items: center; justify-content: center; }
              }
            `}</style>
          </div>
        </header>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav"
            style={{
              display: 'none',
              flexDirection: 'column',
              background: 'rgba(8,13,31,.95)',
              borderBottom: '1px solid rgba(255,255,255,.07)',
              padding: '12px',
              gap: '4px',
              animation: 'slideDown 0.3s ease-out',
            }}
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${pathname === item.href ? ' active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <>
                <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '8px 0' }} />
                {ADMIN_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item${pathname === item.href ? ' active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </>
            )}
            <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '8px 0' }} />
            <div style={{ padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div className="avatar">{initial}</div>
                <div className="user-meta">
                  <div className="user-name">{user?.name || user?.email}</div>
                  <div className="user-tier">
                    {user?.tier || 'FREE'} · {user?.credits ?? 0} credits
                  </div>
                </div>
              </div>
              <button
                className="btn ghost full"
                onClick={logout}
                style={{ fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <LogOut size={14} />
                تسجيل خروج
              </button>
            </div>
          </div>
        )}

        <div className="content">{children}</div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .app {
            grid-template-columns: 1fr !important;
          }
          .sidebar {
            display: none !important;
          }
          .topbar {
            padding: 0 16px !important;
          }
          .content {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
