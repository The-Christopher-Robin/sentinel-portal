import { HeroSection } from '@/components/HeroSection'

export const metadata = { title: 'Privacy' }

export default function PrivacyPage() {
  return (
    <>
      <HeroSection eyebrow="Legal" title="Privacy policy" />
      <section className="container-narrow pb-16">
        <article className="space-y-4 text-sm leading-relaxed text-brand-ink">
          <p>
            SentinelPortal is, by definition, in the business of personal data. This
            page explains what we collect, why we collect it, and how long we keep it.
          </p>
          <h2 className="mt-6 text-lg font-semibold">What we collect</h2>
          <p>
            Account details you provide: name, aliases, previous addresses, email,
            phone, and payment method. We collect the minimum required to submit
            opt-outs on your behalf.
          </p>
          <h2 className="mt-6 text-lg font-semibold">How we store it</h2>
          <p>
            Data is stored in PostgreSQL with encryption at rest and in transit.
            Payment data is handled by Stripe and never stored on our servers.
          </p>
          <h2 className="mt-6 text-lg font-semibold">How long we keep it</h2>
          <p>
            For the lifetime of your account, plus 90 days after cancellation so we
            can honor refund and re-activation requests. You can request full
            deletion from the Account page at any time.
          </p>
          <p className="mt-8 text-xs text-brand-muted">Last updated: March 2026.</p>
        </article>
      </section>
    </>
  )
}
