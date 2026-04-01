import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Comfortaa } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-comfortaa" });

export const metadata: Metadata = {
  metadataBase: new URL('https://v0-aaronstone.vercel.app'),
  title: {
    default: 'Aaron Stone | Software Engineer & Product Builder',
    template: '%s | Aaron Stone',
  },
  description: 'Portfolio of Aaron Stone — visual programming, automation, scalable architectures',
  generator: 'v0.app',
  keywords: ['software engineer', 'portfolio', 'React', 'TypeScript', 'Node.js', 'fintech'],
  authors: [{ name: 'Aaron Stone' }],
  openGraph: {
    title: 'Aaron Stone | Software Engineer & Product Builder',
    description: 'Portfolio of Aaron Stone — visual programming, automation, scalable architectures',
    type: 'website',
    url: 'https://v0-aaronstone.vercel.app',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${comfortaa.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
