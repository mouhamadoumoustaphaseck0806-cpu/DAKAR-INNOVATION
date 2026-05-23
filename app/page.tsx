'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { useEffect, useState } from 'react'

interface Stats {
  totalSignalements: number
  resolus: number
  enCours: number
  categories: Record<string, number>
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
  }, [])

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Dakar Innovation Days</h1>
          <p className="text-xl mb-8">Ensemble, rendons Dakar plus verte et innovante</p>
          <div className="flex gap-4 justify-center">
            <Link href="/signaler" className="px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition">
              Signaler un problème
            </Link>
            <Link href="/projets" className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white/10 transition">
              Voir les projets
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Impact en chiffres</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats?.totalSignalements || 0}
              </div>
              <p className="text-gray-600">Signalements</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats?.enCours || 0}
              </div>
              <p className="text-gray-600">En cours</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats?.resolus || 0}
              </div>
              <p className="text-gray-600">Résolus</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {Object.keys(stats?.categories || {}).length}
              </div>
              <p className="text-gray-600">Catégories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📱',
                title: 'Signalez',
                desc: 'Décrivez le problème urbain avec une photo et localisation',
              },
              {
                icon: '👥',
                title: 'Votez',
                desc: 'Soutenez les signalements qui vous concernent',
              },
              {
                icon: '✅',
                title: 'Changez',
                desc: 'Suivez les actions de la mairie en temps réel',
              },
            ].map((feature, i) => (
              <div key={i} className="card text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quartiers Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos quartiers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Plateau', 'Médina', 'Parcelles Assainies', 'Guédiawaye', 'Almadies', 'Pikine', 'Ngor', 'Mermoz'].map((quartier) => (
              <div key={quartier} className="card text-center hover:shadow-lg transition">
                <p className="font-semibold">{quartier}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Dakar Innovation Days</h4>
              <p className="text-gray-400">Plateforme citoyenne pour une Dakar meilleure</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens utiles</h4>
              <div className="space-y-2 text-gray-400">
                <p><Link href="/" className="hover:text-white">Accueil</Link></p>
                <p><Link href="/signaler" className="hover:text-white">Signaler</Link></p>
                <p><Link href="/projets" className="hover:text-white">Projets</Link></p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400">info@dakarinnovation.sn</p>
              <p className="text-gray-400">+221 33 XXX XX XX</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Dakar Innovation Days. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
