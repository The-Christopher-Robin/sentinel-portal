import { HeroSection } from '@/components/HeroSection'

export const metadata = { title: 'Terms' }

export default function TermsPage() {
  return (
    <>
      <HeroSection eyebrow="Legal" title="Terms of service" />
      <section className="container-narrow pb-16">
        <article className="space-y-4 text-sm leading-relaxed text-brand-ink">
          <p>
            By using SentinelPortal you authorize us to submit opt-out requests to
            third-party data brokers on your behalf using the profile information
            you provide.
          </p>
          <p>
            We do not guarantee specific timelines for removal. Most broker sites
            complete within 14 to 45 days, but a small number take longer or
            require member confirmation that we cannot provide for you.
          </p>
          <p>
            Cancellations stop monitoring at the end of the current billing period.
            Annual plans may be refunded in full within 30 days of the initial
            charge.
          </p>
          <p className="mt-8 text-xs text-brand-muted">Last updated: March 2026.</p>
        </article>
      </section>
    </>
  )
}
