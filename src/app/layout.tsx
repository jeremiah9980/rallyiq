import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'RallyIQ — Sports Management Platform',
  description: 'The all-in-one sports management platform for coaches, teams, and organizations.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.0/marked.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
