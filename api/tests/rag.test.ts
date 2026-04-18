import { describe, expect, it } from 'vitest'
import { formatContext, type RetrievedChunk } from '../src/services/rag.js'

const sample: RetrievedChunk[] = [
  {
    id: 1,
    source: 'product/removal-flow',
    title: 'How data removal works',
    content: '  We scan 180+ broker sites and submit opt-outs on your behalf.  ',
    score: 0.91,
  },
  {
    id: 2,
    source: 'billing/refunds',
    title: 'Refund policy',
    content: 'Annual members can request a refund within 30 days.',
    score: 0.72,
  },
]

describe('formatContext', () => {
  it('returns a placeholder when nothing retrieved', () => {
    const out = formatContext([])
    expect(out).toBe('(no relevant context found)')
  })

  it('numbers chunks starting at 1', () => {
    const out = formatContext(sample)
    expect(out).toContain('[1] How data removal works')
    expect(out).toContain('[2] Refund policy')
  })

  it('includes the source label so the model can cite it', () => {
    const out = formatContext(sample)
    expect(out).toContain('source: product/removal-flow')
    expect(out).toContain('source: billing/refunds')
  })

  it('trims whitespace around each chunk content', () => {
    const out = formatContext(sample)
    expect(out).toContain('We scan 180+ broker sites')
    expect(out).not.toMatch(/\[1\] [^\n]+\n {2}We scan/)
  })

  it('separates chunks with a blank line', () => {
    const out = formatContext(sample)
    const parts = out.split('\n\n')
    expect(parts.length).toBeGreaterThanOrEqual(2)
  })
})
