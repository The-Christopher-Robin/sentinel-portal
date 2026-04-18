'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, MessageSquare, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ title: string; source: string }>
}

interface ChatResponse {
  conversationId: string
  answer: string
  sources: Array<{ id: number; title: string; source: string; score: number }>
  latencyMs: number
}

const starter: Message = {
  role: 'assistant',
  content:
    "Hi, I'm the SentinelPortal assistant. Ask me anything about removals, billing, or your account.",
}

export function ChatBox() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([starter])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || sending) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: question }])
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, conversationId }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message ?? `chat failed with status ${res.status}`)
      }

      const data = (await res.json()) as ChatResponse
      setConversationId(data.conversationId)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
        },
      ])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown error'
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "I couldn't reach the assistant just now. Please try again or open a support ticket. (" +
            msg +
            ')',
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open chat"
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-ink text-white shadow-lg transition-transform hover:scale-105',
          open && 'pointer-events-none opacity-0'
        )}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {open ? (
        <div className="fixed bottom-6 right-6 z-50 flex h-[540px] w-[360px] flex-col overflow-hidden rounded-xl border border-brand-ink/10 bg-white shadow-2xl animate-fade-in">
          <header className="flex items-center justify-between border-b border-brand-ink/10 bg-brand-ink px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Sentinel assistant
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}
            {sending ? (
              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <Loader2 className="h-3 w-3 animate-spin" /> thinking...
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-brand-ink/10 p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about removals, billing..."
              disabled={sending}
              maxLength={500}
            />
            <Button type="submit" size="icon" variant="accent" disabled={sending || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : null}
    </>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[82%] rounded-lg px-3 py-2 text-sm',
          isUser
            ? 'bg-brand-accent text-white'
            : 'bg-brand-fog text-brand-ink'
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {message.sources && message.sources.length > 0 ? (
          <div className="mt-2 border-t border-black/5 pt-2 text-xs text-brand-muted">
            Sources:{' '}
            {message.sources.slice(0, 3).map((s, i) => (
              <span key={s.source}>
                {i > 0 ? ', ' : ''}
                {s.title}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
