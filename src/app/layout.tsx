import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Zama FHE Playground - Learn Fully Homomorphic Encryption',
  description: 'Interactive platform to learn, experiment, and build with Fully Homomorphic Encryption (FHE) on Zama Protocol. Explore confidential smart contracts and privacy-preserving applications.',
  keywords: 'FHE, Fully Homomorphic Encryption, Zama, blockchain, privacy, confidential computing, smart contracts, FHEVM',
  authors: [{ name: 'Zama Protocol' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FCDC00',
  openGraph: {
    title: 'Zama FHE Playground',
    description: 'Interactive platform to learn and experiment with Fully Homomorphic Encryption',
    type: 'website',
    locale: 'en_US',
    siteName: 'Zama FHE Playground',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zama FHE Playground',
    description: 'Interactive platform to learn and experiment with Fully Homomorphic Encryption',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <div className="min-h-screen bg-black text-white">
          {children}
        </div>
      </body>
    </html>
  )
}
