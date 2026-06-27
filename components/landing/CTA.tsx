import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export function CTA(): JSX.Element {
  return (
    <div className="cta-section">
      <div className="cta-inner">
        <div style={{ fontSize: 48, marginBottom: 16, display: 'block', textAlign: 'center' }}>🎵</div>
        <h2>جاهز لإنشاء موسيقاك الأولى؟</h2>
        <p>
          انضم إلى آلاف صانعي المحتوى العرب. ابدأ بـ 100 Credit مجاني —<br />
          لا بطاقة ائتمانية، لا التزامات.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn lg">
            <Sparkles size={18} />
            ابدأ مجاناً الآن
          </Link>
          <Link href="/login" className="btn outline lg" style={{ gap: 8 }}>
            تسجيل الدخول
            <ArrowRight size={16} />
          </Link>
        </div>
        <p style={{ marginTop: 20, marginBottom: 0, fontSize: 12, color: '#475569' }}>
          ✓ بدون بطاقة ائتمانية &nbsp;·&nbsp; ✓ 100 Credit مجاني &nbsp;·&nbsp; ✓ إلغاء في أي وقت
        </p>
      </div>
    </div>
  )
}
