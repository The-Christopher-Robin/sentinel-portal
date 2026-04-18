import { ChatBox } from '@/components/ChatBox'
import { MarketingFooter } from '@/components/MarketingFooter'
import { MarketingNav } from '@/components/MarketingNav'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
      <ChatBox />
    </>
  )
}
