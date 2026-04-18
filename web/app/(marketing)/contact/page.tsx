import { HeroSection } from '@/components/HeroSection'

export const metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <>
      <HeroSection
        eyebrow="Contact"
        title="Got a question the assistant could not answer?"
        subtitle="Open a ticket and a human from the team will reply within one business day."
      />
      <section className="container-narrow pb-16">
        <div className="rounded-lg border border-brand-ink/10 bg-white p-6 text-sm">
          <p>Email: <a className="text-brand-accent" href="mailto:hello@sentinel-portal.example">hello@sentinel-portal.example</a></p>
          <p className="mt-2">Support hours: Monday to Friday, 9am to 6pm Pacific.</p>
          <p className="mt-6 text-xs text-brand-muted">
            If you are being actively threatened or doxxed, please contact local
            authorities first. We can then prioritise takedown of visible listings.
          </p>
        </div>
      </section>
    </>
  )
}
