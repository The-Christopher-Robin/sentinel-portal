import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'SentinelPortal - Keep your personal data off the web',
    template: '%s | SentinelPortal',
  },
  description:
    'SentinelPortal removes your personal information from data broker sites and keeps monitoring so it stays off.',
  metadataBase: new URL('https://sentinel-portal.example'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
