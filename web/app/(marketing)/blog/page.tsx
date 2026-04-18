import Link from 'next/link'
import { HeroSection } from '@/components/HeroSection'
import { formatDate } from '@/lib/utils'
import { getBlogPosts, type BlogPost } from '@/lib/sanity'

const fallback: BlogPost[] = [
  {
    slug: 'why-people-search-sites-exist',
    title: 'Why people-search sites exist, and why they are so hard to kill',
    excerpt:
      'A quick tour of the data-broker ecosystem, the legal gaps that keep it alive, and what individuals can realistically do about it.',
    publishedAt: '2026-03-14T12:00:00Z',
    author: 'The SentinelPortal team',
  },
  {
    slug: 'what-a-good-opt-out-looks-like',
    title: 'What a good opt-out request looks like',
    excerpt:
      'Most opt-out forms are deliberately annoying. Here is the anatomy of one that actually works, and why we automated the rest.',
    publishedAt: '2026-02-28T12:00:00Z',
    author: 'The SentinelPortal team',
  },
]

export const metadata = { title: 'Blog' }

export default async function BlogIndexPage() {
  const posts = await getBlogPosts()
  const list = posts.length > 0 ? posts : fallback

  return (
    <>
      <HeroSection eyebrow="Blog" title="Notes on privacy, removals, and the internet." />
      <section className="container-narrow pb-16">
        <ul className="divide-y divide-brand-ink/10">
          {list.map((p) => (
            <li key={p.slug} className="py-6">
              <Link href={`/blog/${p.slug}`} className="group block">
                <h2 className="text-xl font-semibold group-hover:text-brand-accent">
                  {p.title}
                </h2>
                <div className="mt-1 text-xs text-brand-muted">
                  {p.publishedAt ? formatDate(p.publishedAt) : ''} {p.author ? `- ${p.author}` : ''}
                </div>
                {p.excerpt ? (
                  <p className="mt-2 text-sm text-brand-muted">{p.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
