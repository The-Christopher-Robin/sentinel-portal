import { HeroSection } from '@/components/HeroSection'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const items = [
  { title: 'Impersonation exposure', body: 'Remove the public data attackers use to craft pretexts, phishing lures, and wire-fraud calls.' },
  { title: 'Family inclusion', body: 'Protect spouses and children on the same plan. Threats often start with the softest target.' },
  { title: 'Business-registry cleanup', body: 'Where permitted, remove or redirect public registration records that leak home addresses.' },
  { title: 'SSO and audit log', body: 'SAML or OIDC, plus a tamper-evident audit trail your security team can export.' },
]

export const metadata = { title: 'For executives' }

export default function ForExecutivesPage() {
  return (
    <>
      <HeroSection
        eyebrow="For executives and HNWIs"
        title="Reduce the public footprint attackers rely on."
        subtitle="The same exposed data used for doxxing and stalking is also what powers executive-targeted phishing and wire fraud. We shrink it."
      />
      <section className="mx-auto mt-8 max-w-5xl px-4">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((i) => (
            <Card key={i.title}>
              <CardHeader>
                <CardTitle>{i.title}</CardTitle>
                <CardDescription>{i.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
