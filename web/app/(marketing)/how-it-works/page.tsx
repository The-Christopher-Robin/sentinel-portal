import { HeroSection } from '@/components/HeroSection'
import { getLandingPage } from '@/lib/sanity'

const steps = [
  {
    n: '01',
    title: 'Sign up and build your profile',
    body: 'Name, aliases, previous addresses, and anything else brokers use to match you. Takes under three minutes.',
  },
  {
    n: '02',
    title: 'We scan and submit opt-outs',
    body: 'We search 180+ broker sites and submit opt-out requests on your behalf. Most sites complete within 14 to 45 days.',
  },
  {
    n: '03',
    title: 'You track progress in the portal',
    body: 'Every site shows up with a live status. When something needs your confirmation we flag it.',
  },
  {
    n: '04',
    title: 'We keep monitoring',
    body: 'Sites re-list. We keep scanning monthly and re-submit automatically. You stay removed.',
  },
]

export const metadata = { title: 'How it works' }

export default async function HowItWorksPage() {
  const cms = await getLandingPage('how-it-works')
  return (
    <>
      <HeroSection
        eyebrow="How it works"
        title={cms?.title ?? 'Four steps. That is the whole process.'}
        subtitle={cms?.subtitle ?? 'No waiting on us to write takedown letters. The system does the boring parts.'}
      />
      <section className="mx-auto mt-8 max-w-3xl space-y-6 px-4">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-5 rounded-lg border border-brand-ink/10 bg-white p-6">
            <div className="text-2xl font-semibold text-brand-accent">{s.n}</div>
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-brand-muted">{s.body}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
