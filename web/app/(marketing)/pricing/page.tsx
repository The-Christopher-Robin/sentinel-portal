import Link from 'next/link'
import { HeroSection } from '@/components/HeroSection'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const plans = [
  {
    name: 'Monthly',
    price: '$14.99',
    cadence: 'per month',
    features: [
      'Coverage across 180+ broker sites',
      'Continuous monthly monitoring',
      'Member portal and email digest',
      'Cancel any time',
    ],
  },
  {
    name: 'Annual',
    price: '$129',
    cadence: 'per year',
    highlight: true,
    features: [
      'Everything in Monthly',
      'Equivalent to $10.75 per month',
      '30-day refund window',
      'Priority removals',
    ],
  },
  {
    name: 'Family',
    price: '$24.99',
    cadence: 'per month, up to 5 people',
    features: [
      'Five individual profiles',
      'Per-member dashboards',
      'One billing account',
      'Email support',
    ],
  },
]

export const metadata = { title: 'Pricing' }

export default function PricingPage() {
  return (
    <>
      <HeroSection
        eyebrow="Pricing"
        title="Simple plans. No contracts."
        subtitle="Start with a free scan. Pay only if you want the removals to keep happening."
      />
      <section className="mx-auto mt-8 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={p.highlight ? 'border-brand-accent ring-1 ring-brand-accent' : ''}
            >
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-semibold text-brand-ink">{p.price}</span>{' '}
                  <span className="text-sm">{p.cadence}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-brand-accent">-</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signin"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand-ink py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent"
                >
                  Choose {p.name}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
