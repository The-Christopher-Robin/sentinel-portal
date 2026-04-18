import 'dotenv/config'
import { pool, query } from '../src/services/db.js'
import { embed } from '../src/services/rag.js'
import { logger } from '../src/services/logger.js'

interface SeedChunk {
  source: string
  title: string
  content: string
}

const corpus: SeedChunk[] = [
  {
    source: 'product/removal-flow',
    title: 'How data removal works',
    content:
      'SentinelPortal continuously scans 180+ people-search and data-broker sites. ' +
      'When a member signs up we build a profile from their name, known aliases, and ' +
      'previous addresses, then submit opt-out requests on their behalf. Most initial ' +
      'removals complete within 14 to 45 days depending on the broker. The portal ' +
      'shows each site with a status of pending, removed, or re-listed.',
  },
  {
    source: 'product/monitoring',
    title: 'What continuous monitoring covers',
    content:
      'After initial removal we keep scanning monthly. If a removed broker re-lists ' +
      'the member, we automatically re-submit and flag it in the portal. Members get ' +
      'a weekly digest email summarising new listings, completed removals, and any ' +
      'action items that need their confirmation.',
  },
  {
    source: 'billing/plans',
    title: 'Plans and billing cadence',
    content:
      'SentinelPortal offers a monthly plan at $14.99 per month and an annual plan ' +
      'at $129 per year. Billing is handled through Stripe. Members can upgrade, ' +
      'downgrade, or cancel at any time from the Account page in the portal. ' +
      'Cancellations stop monitoring at the end of the current billing period.',
  },
  {
    source: 'billing/refunds',
    title: 'Refund policy',
    content:
      'Annual members can request a full refund within 30 days of the initial ' +
      'charge. Monthly plans are non-refundable but cancel immediately effective ' +
      'at the end of the current period. Refund requests can be submitted from the ' +
      'Account page or by contacting support.',
  },
  {
    source: 'security/data-handling',
    title: 'How your data is stored',
    content:
      'Account data is stored in PostgreSQL with encryption at rest and in transit. ' +
      'Opt-out submissions only include the minimum personal data required by each ' +
      'broker. Chat transcripts are stored for 90 days for quality review and then ' +
      'archived to cold storage. Members can request full deletion of their data at ' +
      'any time.',
  },
  {
    source: 'security/breach-response',
    title: 'If you suspect your data was leaked',
    content:
      'If a member suspects their data was exposed in a third-party breach they ' +
      'should first change passwords and enable two-factor authentication on the ' +
      'affected accounts. SentinelPortal does not monitor credential breaches ' +
      'directly but can prioritise removing the exposed personal information from ' +
      'broker sites.',
  },
  {
    source: 'account/signin',
    title: 'Signing in and account recovery',
    content:
      'Members sign in with email and password, or with a magic link sent to their ' +
      'verified email. If a member loses access to their email they can verify ' +
      'ownership by providing the last four digits of their payment method and ' +
      'answering two profile questions.',
  },
  {
    source: 'account/team-plans',
    title: 'Family and team plans',
    content:
      'Family plans cover up to five members under one billing account. Corporate ' +
      'team plans are available for executives and high-net-worth individuals and ' +
      'include a dedicated onboarding call. Team admins can invite and remove seats ' +
      'from the Account page.',
  },
  {
    source: 'support/urgent-threats',
    title: 'Urgent safety concerns',
    content:
      'If a member is being actively stalked, doxxed, or threatened, the assistant ' +
      'should advise contacting local authorities first. SentinelPortal can then ' +
      'prioritise takedown of the most visible listings, typically within 24 to 48 ' +
      'hours for the top five search-result sites.',
  },
  {
    source: 'support/contact',
    title: 'Opening a support ticket',
    content:
      'Members can open a support ticket from any page in the portal by clicking ' +
      'the help icon. Response times are usually under four hours during weekdays ' +
      'and under 24 hours on weekends.',
  },
]

async function seed(): Promise<void> {
  logger.info({ count: corpus.length }, 'seeding knowledge chunks')

  await query('TRUNCATE knowledge_chunks RESTART IDENTITY')

  for (const chunk of corpus) {
    const vector = await embed(chunk.content)
    await query(
      `INSERT INTO knowledge_chunks (source, title, content, embedding, metadata)
       VALUES ($1, $2, $3, $4::vector, $5)`,
      [
        chunk.source,
        chunk.title,
        chunk.content,
        `[${vector.join(',')}]`,
        JSON.stringify({ tokens: chunk.content.split(/\s+/).length }),
      ]
    )
  }

  logger.info('seed complete')
}

seed()
  .catch((err) => {
    logger.error({ err }, 'seed failed')
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
