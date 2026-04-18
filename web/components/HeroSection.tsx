import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  eyebrow?: string
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
}

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  ctaLabel = 'Start free scan',
  ctaHref = '/signin',
}: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-12 pt-20 text-center">
      {eyebrow ? (
        <div className="inline-flex items-center rounded-full border border-brand-ink/10 bg-white px-3 py-1 text-xs font-medium text-brand-muted">
          {eyebrow}
        </div>
      ) : null}

      <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
        {title}
      </h1>

      {subtitle ? (
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-brand-muted">
          {subtitle}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" variant="accent">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/how-it-works">See how it works</Link>
        </Button>
      </div>
    </section>
  )
}
