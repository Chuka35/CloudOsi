import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CloudOS - Your Computer Lives in the Cloud',
  description: 'A full Windows 11-style operating system that runs entirely in your browser. Free forever, no downloads required.',
  generator: 'CloudOS',
  keywords: ['cloud os', 'browser os', 'windows 11', 'cloud computing', 'web desktop'],
  authors: [{ name: 'CloudOS Team' }],
  icons: {
    icon: [
      {
        url: '/cloudos-icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/cloudos-icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0078D4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
