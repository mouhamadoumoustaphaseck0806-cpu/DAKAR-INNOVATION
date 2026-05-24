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
  VOIRIE: 'bg-slate-100 text-slate-700',
  ECLAIRAGE: 'bg-amber-100 text-amber-700',
  DECHETS: 'bg-emerald-100 text-emerald-700',
  EAU: 'bg-sky-100 text-sky-700',
  ESPACES_VERTS: 'bg-green-100 text-green-700',
  SECURITE: 'bg-rose-100 text-red-700',
}

const categorieLabels: Record<string, string> = {
  VOIRIE: 'Voirie',
  ECLAIRAGE: 'Éclairage',
  DECHETS: 'Déchets',
  EAU: 'Eau',
  ESPACES_VERTS: 'Espaces verts',
  SECURITE: 'Sécurité',
}

export function SignalementCard({ id, titre, description, categorie, quartier, statut, _count }: SignalementCardProps) {
  const statusStyles: Record<string, string> = {
    EN_ATTENTE: 'bg-slate-100 text-slate-500',
    EN_COURS: 'bg-blue-50 text-blue-600',
    RESOLU: 'bg-emerald-50 text-emerald-600',
    REJETE: 'bg-rose-50 text-rose-600',
  }

  return (
    <Link href={`/projets/${id}`} className="group block h-full">
      <div className="h-full p-6 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${categorieColors[categorie]}`}>
              {categorieLabels[categorie]}
            </span>
          </div>
          <h3 className="font-black text-xl leading-tight mb-3 text-slate-800 group-hover:text-senegal-green transition-colors">{titre}</h3>
          <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-auto">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Quartier</span>
              <span className="text-xs font-bold text-slate-600">{quartier}</span>
            </div>
            <div className="w-px h-6 bg-slate-100 mx-1" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Statut</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-md self-start ${statusStyles[statut] || 'bg-slate-100'}`}>
                {statut.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-2xl group-hover:bg-senegal-green/10 group-hover:text-senegal-green transition-colors">
              <span>❤️</span>
              <span>{_count?.votes || 0}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-2xl group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
              <span>💬</span>
              <span>{_count?.commentaires || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
