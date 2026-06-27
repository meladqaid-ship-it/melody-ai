'use client'
import Link from 'next/link'
import { useState } from 'react'
import { login, googleLoginUrl, GOOGLE_CLIENT_ID } from '@/lib/api'
import { Music } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page" style={{
      background: 'radial-gradient(circle at 30% 20%, rgba(79,70,229,0.15), #04060f 55%)',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.15), transparent)', top: -100, left: -100, filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent)', bottom: 50, right: 50, filter: 'blur(60px)' }} />
      </div>

      <div className="auth-card card" style={{ position: 'relative', zIndex: 1, padding: 32 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(79,70,229,0.4)',
          }}>
            <Music size={24} color="white" />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 900 }}>تسجيل الدخول</h1>
          <p className="muted text-sm">ادخل إلى حسابك في Melody AI</p>
        </div>

        {GOOGLE_CLIENT_ID && (
          <>
            <button
              type="button"
              className="btn outline full"
              style={{ marginBottom: 4, gap: 10 }}
              onClick={() => window.location.href = googleLoginUrl()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              المتابعة بـ Google
            </button>
            <div className="divider">أو</div>
          </>
        )}

        {error && <div className="error">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>كلمة المرور</span>
              <Link href="/forgot-password" style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 600 }}>
                نسيت كلمة المرور؟
              </Link>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{ paddingLeft: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#475569', fontSize: 13, fontWeight: 600, padding: '2px 4px',
                }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            className="btn full"
            disabled={loading}
            style={{ marginTop: 4, fontSize: 15, padding: '13px' }}
          >
            {loading ? (
              <><span className="loading-dots"><span/><span/><span/></span> جاري الدخول...</>
            ) : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="muted text-sm" style={{ textAlign: 'center', marginTop: 20 }}>
          ليس لديك حساب؟{' '}
          <Link href="/register" style={{ color: '#a5b4fc', fontWeight: 700 }}>إنشاء حساب مجاني</Link>
        </p>

        {/* Trust badges */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20,
          paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['🔒 آمن 100%', '🎵 100 Credit مجاناً', '⚡ دخول فوري'].map((t) => (
            <span key={t} style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>
    </main>
  )
}
