'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Dakar Innovation</span>
          </Link>

          <div className="hidden md:flex gap-8 font-bold text-sm text-slate-600">
            <Link href="/" className="hover:text-green-600 transition">
              Accueil
            </Link>
            <Link href="/signaler" className="hover:text-green-600 transition">
              Signaler
            </Link>
            <Link href="/projets" className="hover:text-green-600 transition">
              Projets
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link href="/dashboard" className="hover:text-green-600 transition">
                Tableau de bord
              </Link>
            )}
          </div>

          <div className="flex gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
