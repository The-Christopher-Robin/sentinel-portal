import { HeroSection } from '@/components/HeroSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLandingPage } from '@/lib/sanity'

const fallback = [
  { title: 'Broker coverage', body: 'Automated opt-outs across 180+ people-search and data-broker sites.' },
  { title: 'Exposure scoring', body: 'Every listing is scored by visibility and risk so you know what to fix first.' },
  { title: 'Executive protection', body: 'Extra pass for executives, adding removal of business-registry leaks and DMV records where permitted.' },
  { title: 'Family plans', body: 'Cover up to five people on a single account with per-member dashboards.' },
  { title: 'Audit log', body: 'Every submission, re-submission, and confirmation is time-stamped and exportable.' },
  { title: 'SSO ready', body: 'SAML and OIDC available on team plans. SCIM provisioning on request.' },
]

export const metadata = { title: 'Features' }

export default async function FeaturesPage() {
  const cms = await getLandingPage('features')
  const items = cms?.sections?.length
    ? cms.sections.map((s) => ({ title: s.heading, body: s.body ?? '' }))
    : fallback

  return (
    <>
      <HeroSection
        eyebrow="Features"
        title={cms?.title ?? 'Everything you get, in plain English.'}
        subtitle={cms?.subtitle ?? 'We keep the feature set short on purpose. These are the things that matter.'}
      />
      <section className="mx-auto mt-8 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
