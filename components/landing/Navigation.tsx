'use client'

import Link from 'next/link'
import { Music } from 'lucide-react'

export function Navigation(): JSX.Element {
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <Link href="/" className="brand" aria-label="Melody AI Home">
        <Music size={28} className="brand-icon" aria-hidden="true" />
        <span>Melody AI</span>
      </Link>
      <div className="nav-links">
        <Link href="/status" className="nav-link">
          Status
        </Link>
        <Link href="/login" className="btn outline sm">
          دخول
        </Link>
        <Link href="/register" className="btn sm">
          ابدأ مجاناً
        </Link>
      </div>
    </nav>
  )
}
