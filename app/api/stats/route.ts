import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const [totalSignalements, resolus, enCours, enAttente, rejetes] = await Promise.all([
      prisma.signalement.count(),
      prisma.signalement.count({ where: { statut: 'RESOLU' } }),
      prisma.signalement.count({ where: { statut: 'EN_COURS' } }),
      prisma.signalement.count({ where: { statut: 'EN_ATTENTE' } }),
      prisma.signalement.count({ where: { statut: 'REJETE' } }),
    ])

    const signalementsByCategory = await prisma.signalement.groupBy({
      by: ['categorie'],
      _count: true,
    })

    const categories = Object.fromEntries(
      signalementsByCategory.map((s) => [s.categorie, s._count])
    )

    return NextResponse.json({
      totalSignalements,
      resolus,
      enCours,
      enAttente,
      rejetes,
      categories,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
