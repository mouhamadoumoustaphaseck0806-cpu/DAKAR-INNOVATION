'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Alert } from '@/components/Alert'

interface FormData {
  titre: string
  description: string
  categorie: string
  quartier: string
  latitude?: number
  longitude?: number
}

const CATEGORIES = [
  { value: 'VOIRIE', label: '🛣️ Voirie' },
  { value: 'ECLAIRAGE', label: '💡 Éclairage' },
  { value: 'DECHETS', label: '🗑️ Déchets' },
  { value: 'EAU', label: '💧 Eau' },
  { value: 'ESPACES_VERTS', label: '🌿 Espaces verts' },
  { value: 'SECURITE', label: '🔒 Sécurité' },
]

const QUARTIERS = [
  'Plateau', 'Médina', 'Parcelles Assainies', 'Guédiawaye',
  'Almadies', 'Pikine', 'Ngor', 'Mermoz', 'Keur Massar', 'Sangalkam'
]

export default function SignalerPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [form, setForm] = useState<FormData>({
    titre: '',
    description: '',
    categorie: 'VOIRIE',
    quartier: 'Plateau',
  })

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
            <p className="mb-6 text-gray-600">Vous devez être connecté pour signaler un problème</p>
            <Link href="/auth/login" className="btn-primary">
              Se connecter
            </Link>
          </div>
        </div>
      </>
    )
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
        setAlert({ type: 'success', message: 'Localisation obtenue avec succès' })
      })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/signalements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) throw new Error('Erreur lors du signalement')

      const data = await response.json()
      setAlert({ type: 'success', message: 'Signalement créé avec succès!' })
      setTimeout(() => router.push(`/projets/${data.id}`), 1500)
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12 bg-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Signaler un problème</h1>
          <p className="text-gray-600 mb-8">Aidez la Mairie de Dakar en signalant les problèmes urbains</p>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Titre *</label>
              <input
                type="text"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-600 outline-none"
                placeholder="Décrivez le problème en peu de mots"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                maxLength={500}
                rows={5}
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-600 outline-none resize-none"
                placeholder="Donnez plus de détails sur le problème..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Catégorie *</label>
                <select
                  name="categorie"
                  value={form.categorie}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-600 outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Quartier *</label>
                <select
                  name="quartier"
                  value={form.quartier}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-600 outline-none"
                >
                  {QUARTIERS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGetLocation}
                className="mb-3 btn-secondary w-full"
              >
                📍 Obtenir ma localisation
              </button>
              {form.latitude && form.longitude && (
                <p className="text-sm text-green-600">
                  ✓ Localisation: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le signalement'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
