import { createClient, type SanityClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export const sanity: SanityClient | null =
  projectId && projectId !== 'your-project-id'
    ? createClient({
        projectId,
        dataset,
        apiVersion: '2024-10-01',
        useCdn: true,
        token: process.env.SANITY_API_READ_TOKEN,
      })
    : null

export interface LandingPage {
  slug: string
  title: string
  eyebrow?: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  sections?: Array<{
    heading: string
    body?: string
    bullets?: string[]
  }>
}

export interface BlogPost {
  slug: string
  title: string
  excerpt?: string
  publishedAt?: string
  author?: string
}

const landingQuery = `*[_type == "landingPage" && slug.current == $slug][0]{
  "slug": slug.current, title, eyebrow, subtitle, ctaLabel, ctaHref, sections
}`

const postsQuery = `*[_type == "blogPost"] | order(publishedAt desc)[0..20]{
  "slug": slug.current, title, excerpt, publishedAt, author
}`

export async function getLandingPage(slug: string): Promise<LandingPage | null> {
  if (!sanity) return null
  try {
    return await sanity.fetch<LandingPage>(landingQuery, { slug })
  } catch {
    return null
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!sanity) return []
  try {
    return await sanity.fetch<BlogPost[]>(postsQuery)
  } catch {
    return []
  }
}
