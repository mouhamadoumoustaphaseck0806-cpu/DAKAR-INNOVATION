'use client'

import { useState, useEffect, FormEvent, use } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/Navbar'
import { Alert } from '@/components/Alert'
import Link from 'next/link'

interface Signalement {
  id: string
  titre: string
  description: string
  categorie: string
  quartier: string
  statut: string
  latitude?: number
  longitude?: number
  createdAt: string
  auteur: { name: string }
  _count: { votes: number; commentaires: number }
}

interface Commentaire {
  id: string
  contenu: string
  createdAt: string
  auteur: { name: string }
}

const CATEGORIE_LABELS: Record<string, string> = {
  VOIRIE: '🛣️ Voirie',
  ECLAIRAGE: '💡 Éclairage',
  DECHETS: '🗑️ Déchets',
  EAU: '💧 Eau',
  ESPACES_VERTS: '🌿 Espaces verts',
  SECURITE: '🔒 Sécurité',
}

export default function ProjetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const [signalement, setSignalement] = useState<Signalement | null>(null)
  const [commentaires, setCommentaires] = useState<Commentaire[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function fetchSignalement() {
    try {
      const [sigRes, commRes] = await Promise.all([
        fetch(`/api/signalements/${id}`),
        fetch(`/api/signalements/${id}/commentaires`),
      ])
      
      const sigData = await sigRes.json()
      const commData = await commRes.json()
      
      setSignalement(sigData)
      setCommentaires(commData)
      
      if (session?.user) {
        const votedRes = await fetch(`/api/signalements/${id}/votes`)
        const voted = await votedRes.json()
        setHasVoted(voted.hasVoted)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    ;(async () => { await fetchSignalement() })()
  }, [id, session])

  const handleVote = async () => {
    if (!session) {
      setAlert({ type: 'error', message: 'Connectez-vous pour voter' })
      return
    }

    try {
      const res = await fetch(`/api/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signalementId: id }),
      })

      if (res.ok) {
        setHasVoted(!hasVoted)
        setAlert({ type: 'success', message: hasVoted ? 'Vote retiré' : 'Vote enregistré!' })
        fetchSignalement()
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erreur lors du vote' })
    }
  }

  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session) {
      setAlert({ type: 'error', message: 'Connectez-vous pour commenter' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/commentaires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenu: comment,
          signalementId: id,
        }),
      })

      if (res.ok) {
        setComment('')
        setAlert({ type: 'success', message: 'Commentaire ajouté!' })
        fetchSignalement()
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erreur lors de l\'ajout du commentaire' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  if (!signalement) return <div className="min-h-screen flex items-center justify-center">Non trouvé</div>

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-transparent py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/projets" className="text-green-600 hover:underline mb-6 inline-block">
            ← Retour aux projets
          </Link>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {/* Main Content */}
          <div className="card mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{signalement.titre}</h1>
                <div className="flex gap-3 flex-wrap">
                  <span className={`badge-category badge-${signalement.categorie.toLowerCase().replace('_', '-')}`}>
                    {CATEGORIE_LABELS[signalement.categorie]}
                  </span>
                  <span className={`px-3 py-1 rounded-full status-${signalement.statut.toLowerCase().replace('_', '-')}`}>
                    {signalement.statut.replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {signalement.quartier}
                  </span>
                </div>
              </div>
              <button
                onClick={handleVote}
                className={`px-6 py-3 rounded-lg font-bold transition ${
                  hasVoted
                    ? 'bg-red-600 text-white'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {hasVoted ? '❤️ Voté' : '🤍 Voter'} ({signalement._count.votes})
              </button>
            </div>

            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{signalement.description}</p>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-6">
              <div>
                <strong>Signalé par:</strong> {signalement.auteur.name}
              </div>
              <div>
                <strong>Date:</strong> {new Date(signalement.createdAt).toLocaleDateString('fr-FR')}
              </div>
              {signalement.latitude && signalement.longitude && (
                <div>
                  <strong>Localisation:</strong> {signalement.latitude.toFixed(4)}, {signalement.longitude.toFixed(4)}
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Commentaires ({signalement._count.commentaires})</h2>

            {session && (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajoutez votre commentaire..."
                  maxLength={300}
                  rows={3}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 mb-3 focus:border-green-600 outline-none resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Envoi...' : 'Commenter'}
                </button>
              </form>
            )}

            <div className="space-y-4">
              {commentaires.length === 0 ? (
                <p className="text-gray-600">Aucun commentaire pour le moment</p>
              ) : (
                commentaires.map((comm) => (
                  <div key={comm.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <strong>{comm.auteur.name}</strong>
                      <span className="text-sm text-gray-600">
                        {new Date(comm.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comm.contenu}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
