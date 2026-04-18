import { HeroSection } from '@/components/HeroSection'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <>
      <HeroSection
        eyebrow="About"
        title="We built this because our own data was everywhere."
        subtitle="SentinelPortal is a small team of engineers and privacy researchers tired of typing opt-out forms by hand."
      />
      <section className="container-narrow pb-12">
        <div className="prose prose-slate mx-auto max-w-none text-brand-ink">
          <p>
            Data brokers trade in the details of your life: home address, phone number,
            relatives, approximate income, sometimes the last four of your SSN. We built
            SentinelPortal so individuals do not have to fight that system alone.
          </p>
          <p>
            The product is unglamorous on purpose. It is a member portal, a queue of
            opt-out requests, and a chat assistant that answers real questions. No data
            brokers were harmed in the making of this sentence. Several were politely
            asked to delete things.
          </p>
        </div>
      </section>
    </>
  )
}
