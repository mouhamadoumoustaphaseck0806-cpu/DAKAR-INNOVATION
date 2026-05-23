'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { SignalementCard } from '@/components/SignalementCard'

interface Signalement {
  id: string
  titre: string
  description: string
  categorie: string
  quartier: string
  statut: string
  _count: { votes: number; commentaires: number }
}

export default function ProjetsPage() {
  const [signalements, setSignalements] = useState<Signalement[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    categorie: 'ALL',
    quartier: 'ALL',
    statut: 'ALL',
  })

  const QUARTIERS = [
    'Plateau', 'Médina', 'Parcelles Assainies', 'Guédiawaye',
    'Almadies', 'Pikine', 'Ngor', 'Mermoz'
  ]

  const CATEGORIES = [
    'VOIRIE', 'ECLAIRAGE', 'DECHETS', 'EAU', 'ESPACES_VERTS', 'SECURITE'
  ]

  async function fetchSignalements() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.categorie !== 'ALL') params.append('categorie', filters.categorie)
    if (filters.quartier !== 'ALL') params.append('quartier', filters.quartier)
    if (filters.statut !== 'ALL') params.append('statut', filters.statut)

    try {
      const res = await fetch(`/api/signalements?${params}`)
      const data = await res.json()
      setSignalements(data)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => { await fetchSignalements() })()
  }, [filters])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Projets et signalements</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Catégorie</label>
                <select
                  value={filters.categorie}
                  onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded p-2"
                >
                  <option value="ALL">Toutes les catégories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Quartier</label>
                <select
                  value={filters.quartier}
                  onChange={(e) => setFilters({ ...filters, quartier: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded p-2"
                >
                  <option value="ALL">Tous les quartiers</option>
                  {QUARTIERS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Statut</label>
                <select
                  value={filters.statut}
                  onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded p-2"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="RESOLU">Résolu</option>
                  <option value="REJETE">Rejeté</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center text-gray-600">Chargement...</div>
          ) : signalements.length === 0 ? (
            <div className="card text-center">
              <p className="text-gray-600">Aucun signalement trouvé</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {signalements.map((sig) => (
                <SignalementCard key={sig.id} {...sig} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
