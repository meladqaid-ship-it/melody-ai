'use client'
import Link from 'next/link'
import { useState } from 'react'
import { register, googleLoginUrl, GOOGLE_CLIENT_ID } from '@/lib/api'
import { Music, Check } from 'lucide-react'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 أحرف على الأقل', ok: password.length >= 8 },
    { label: 'حرف كبير', ok: /[A-Z]/.test(password) },
    { label: 'رقم', ok: /[0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.ok).length
  const colors = ['#ef4444', '#f59e0b', '#10b981']
  const color = password ? colors[score - 1] || '#ef4444' : 'transparent'

  if (!password) return null

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 999,
            background: i < score ? color : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {checks.map((c) => (
          <span key={c.label} style={{
            fontSize: 11, fontWeight: 600,
            color: c.ok ? '#6ee7b7' : '#475569',
            display: 'flex', alignItems: 'center', gap: 3,
            transition: 'color 0.2s',
          }}>
            {c.ok ? <Check size={10} /> : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('كلمة المرور: 8 أحرف على الأقل، حرف كبير، ورقم.')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'فشل إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page" style={{
      background: 'radial-gradient(circle at 70% 20%, rgba(124,58,237,0.15), #04060f 55%)',
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)', top: -100, right: -100, filter: 'blur(60px)' }} />
      </div>

      <div className="auth-card card" style={{ position: 'relative', zIndex: 1, padding: 32 }}>
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
          <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 900 }}>إنشاء حساب مجاني</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span className="pill green" style={{ fontSize: 11 }}>💎 100 Credit مجاناً</span>
          </div>
        </div>

        {GOOGLE_CLIENT_ID && (
          <>
            <button type="button" className="btn outline full" style={{ gap: 10 }}
              onClick={() => window.location.href = googleLoginUrl()}>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              التسجيل بـ Google
            </button>
            <div className="divider">أو</div>
          </>
        )}

        {error && <div className="error">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>الاسم</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="اسمك الكامل" required minLength={2} autoComplete="name" />
          </div>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 أحرف + حرف كبير + رقم"
                required minLength={8}
                autoComplete="new-password"
                style={{ paddingLeft: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 13, padding: '2px 4px' }}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <button className="btn full" disabled={loading} style={{ marginTop: 4, fontSize: 15, padding: '13px' }}>
            {loading ? (
              <><span className="loading-dots"><span/><span/><span/></span> جاري الإنشاء...</>
            ) : '🚀 إنشاء حساب مجاني'}
          </button>
        </form>

        <p className="muted text-sm" style={{ textAlign: 'center', marginTop: 18 }}>
          بالتسجيل توافق على{' '}
          <span style={{ color: '#a5b4fc', cursor: 'pointer' }}>شروط الاستخدام</span>
          {' '}و{' '}
          <span style={{ color: '#a5b4fc', cursor: 'pointer' }}>سياسة الخصوصية</span>
        </p>
        <p className="muted text-sm" style={{ textAlign: 'center', marginTop: 10 }}>
          لديك حساب؟{' '}
          <Link href="/login" style={{ color: '#a5b4fc', fontWeight: 700 }}>تسجيل الدخول</Link>
        </p>
      </div>
    </main>
  )
}
