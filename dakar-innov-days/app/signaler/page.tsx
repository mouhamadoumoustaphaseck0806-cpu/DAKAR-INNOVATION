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
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      setAlert({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-black tracking-tight mb-3">Nouveau signalement</h1>
          <p className="text-slate-500 font-medium mb-12">Partagez votre observation pour améliorer Dakar.</p>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-2xl border border-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200/50 space-y-10 transition-all hover:shadow-green-500/5">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">1. Titre du problème</label>
              <input
                type="text"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full bg-slate-50/50 border-0 border-b-2 border-slate-100 rounded-none p-4 text-xl font-bold focus:ring-0 focus:border-green-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="Que se passe-t-il ?"
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
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-senegal-green/10 focus:border-senegal-green outline-none resize-none transition-all shadow-sm"
                placeholder="Précisez les détails importants ici..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Catégorie *</label>
                <select
                  name="categorie"
                  value={form.categorie}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-senegal-green/10 focus:border-senegal-green outline-none transition-all shadow-sm appearance-none"
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
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-senegal-green/10 focus:border-senegal-green outline-none transition-all shadow-sm appearance-none"
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
                className="mb-3 w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
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
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le signalement'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
