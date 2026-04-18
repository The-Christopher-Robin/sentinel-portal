import Link from 'next/link'
import { HeroSection } from '@/components/HeroSection'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getLandingPage } from '@/lib/sanity'

const defaultFeatures = [
  {
    title: '180+ broker sites covered',
    body: 'We opt you out of the people-search sites that show up on page one of your name.',
  },
  {
    title: 'Continuous monitoring',
    body: 'Sites re-list. We keep scanning monthly and re-submit automatically when they do.',
  },
  {
    title: 'Member portal for status',
    body: 'See every site with a live status: pending, removed, or re-listed. No email digests required.',
  },
  {
    title: 'Automated support chat',
    body: 'Ask the assistant about removals, billing, or threat response. It cites its sources.',
  },
]

export default async function HomePage() {
  const cms = await getLandingPage('home')

  return (
    <>
      <HeroSection
        eyebrow={cms?.eyebrow ?? 'Digital privacy for real people'}
        title={cms?.title ?? 'Your personal information does not have to be public.'}
        subtitle={
          cms?.subtitle ??
          'SentinelPortal finds your data on broker sites, gets it removed, and keeps watching so it stays off. No spreadsheets, no takedown letters you have to write yourself.'
        }
        ctaLabel={cms?.ctaLabel}
        ctaHref={cms?.ctaHref}
      />

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-2">
          {(cms?.sections?.length
            ? cms.sections.map((s) => ({ title: s.heading, body: s.body ?? '' }))
            : defaultFeatures
          ).map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-4xl px-4 text-center">
        <h2 className="text-2xl font-semibold">Want to see your exposure first?</h2>
        <p className="mt-3 text-brand-muted">
          Run a free scan. You will see which sites are listing you before you decide.
        </p>
        <div className="mt-6">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 rounded-md bg-brand-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-accentDark"
          >
            Start free scan
          </Link>
        </div>
      </section>
    </>
  )
}
