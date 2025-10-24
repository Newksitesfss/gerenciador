import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'nekwsitessfs - SaaS de Vendas',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <footer className="w-full bg-gray-100 dark:bg-gray-800 py-4 text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          Desenvolvido por newksitesfs/_vitorkr
        </footer>
      </body>
    </html>
  )
}
