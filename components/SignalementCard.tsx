'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface SignalementCardProps {
  id: string
  titre: string
  description: string
  categorie: string
  quartier: string
  statut: string
  _count?: { votes: number; commentaires: number }
}

const categorieColors: Record<string, string> = {
  VOIRIE: 'badge-voirie',
  ECLAIRAGE: 'badge-eclairage',
  DECHETS: 'badge-dechets',
  EAU: 'badge-eau',
  ESPACES_VERTS: 'badge-espaces-verts',
  SECURITE: 'badge-securite',
}

const categorieLabels: Record<string, string> = {
  VOIRIE: '🛣️ Voirie',
  ECLAIRAGE: '💡 Éclairage',
  DECHETS: '🗑️ Déchets',
  EAU: '💧 Eau',
  ESPACES_VERTS: '🌿 Espaces verts',
  SECURITE: '🔒 Sécurité',
}

export function SignalementCard({ id, titre, description, categorie, quartier, statut, _count }: SignalementCardProps) {
  return (
    <Link href={`/projets/${id}`}>
      <div className="card cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg flex-1">{titre}</h3>
          <span className={`badge-category ${categorieColors[categorie]}`}>
            {categorieLabels[categorie]}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{quartier}</span>
            <span className={`px-3 py-1 rounded-full status-${statut.toLowerCase().replace('_', '-')}`}>
              {statut.replace('_', ' ')}
            </span>
          </div>
          <div className="flex gap-3 text-gray-600">
            <span>👍 {_count?.votes || 0}</span>
            <span>💬 {_count?.commentaires || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
