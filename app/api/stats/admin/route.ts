import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/src/lib/prisma'
import { authOptions } from '@/src/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

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

    const signalementsByQuartier = await prisma.signalement.groupBy({
      by: ['quartier'],
      _count: true,
    })

    const categories = Object.fromEntries(
      signalementsByCategory.map((s) => [s.categorie, s._count])
    )

    const quartiers = Object.fromEntries(
      signalementsByQuartier.map((s) => [s.quartier, s._count])
    )

    return NextResponse.json({
      totalSignalements,
      resolus,
      enCours,
      enAttente,
      rejetes,
      categories,
      quartiers,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
