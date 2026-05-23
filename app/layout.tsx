import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Dakar Innovation Days',
  description: 'Plateforme citoyenne pour la ville de Dakar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased text-slate-900 selection:bg-senegal-green selection:text-white">
        {/* Global Animated Background */}
        <div className="fixed inset-0 -z-50 overflow-hidden bg-transparent">
          <div className="absolute top-[-8%] left-[-10%] w-[70%] h-[70%] bg-senegal-green/15 blur-[120px] rounded-full animate-bg-drift" />
          <div className="absolute bottom-[-10%] right-[-8%] w-[55%] h-[55%] bg-senegal-yellow/10 blur-[140px] rounded-full animate-bg-glow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44%] h-[44%] bg-emerald-100/18 blur-[150px] rounded-full animate-bg-drift" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.12),transparent_12%)] opacity-90" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
