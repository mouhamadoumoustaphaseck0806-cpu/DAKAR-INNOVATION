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

const featureCards = [
  {
    icon: '📱',
    title: 'Signalez rapidement',
    desc: 'Partagez un signalement clair avec photo, localisation et catégorie.',
  },
  {
    icon: '👥',
    title: 'Mobilisez la communauté',
    desc: 'Votez et soutenez les projets qui comptent pour Dakar.',
  },
  {
    icon: '🚀',
    title: 'Suivez les avancées',
    desc: 'Consultez l’état des signalements et l’impact de chaque action.',
  },
]

const quartiers = [
  'Plateau',
  'Médina',
  'Parcelles Assainies',
  'Guédiawaye',
  'Almadies',
  'Pikine',
  'Ngor',
  'Mermoz',
]

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
  }, [])

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans selection:bg-senegal-green selection:text-white">
      <Navbar />

      {/* Hero Section - Ultra Clean */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-senegal-green/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-senegal-yellow/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500 mb-8 animate-fade-in">
            Dakar Innovation Days 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            Dakar s'invente <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-senegal-green to-emerald-500">avec vous.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            La plateforme officielle pour signaler, voter et transformer notre capitale en un modèle d'innovation urbaine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/signaler" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-2xl hover:scale-105 active:scale-95">
              Signaler un problème
            </Link>
            <Link href="/projets" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all">
              Explorer les projets
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar - Minimalist */}
      <section className="border-y border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-black">{stats?.totalSignalements ?? 0}</p>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Signalements</p>
            </div>
            <div className="text-center border-l border-slate-200">
              <p className="text-3xl font-black text-sky-500">{stats?.enCours ?? 0}</p>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">En cours</p>
            </div>
            <div className="text-center border-l border-slate-200">
              <p className="text-3xl font-black text-emerald-500">{stats?.resolus ?? 0}</p>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Résolus</p>
            </div>
            <div className="text-center border-l border-slate-200">
              <p className="text-3xl font-black text-senegal-yellow">100%</p>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Transparence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - High Design */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-16">
            {featureCards.map((feature) => (
              <article key={feature.title} className="group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-8 group-hover:bg-senegal-green group-hover:text-white transition-colors duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">© 2026 Dakar Innovation Days</p>
          <div className="flex justify-center gap-8 text-sm font-bold">
            <Link href="/" className="hover:text-senegal-green transition-colors">Accueil</Link>
            <Link href="/signaler" className="hover:text-senegal-green transition-colors">Signaler</Link>
            <Link href="/projets" className="hover:text-senegal-green transition-colors">Projets</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
