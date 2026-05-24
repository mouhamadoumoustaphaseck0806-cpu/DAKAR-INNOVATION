import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/src/lib/prisma'
import { authOptions } from '@/src/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const { searchParams } = new URL(req.url)
    const categorie = searchParams.get('categorie')
    const quartier = searchParams.get('quartier')
    const statut = searchParams.get('statut')

    const where: Record<string, unknown> = {}
    if (categorie && categorie !== 'ALL') where.categorie = categorie
    if (quartier && quartier !== 'ALL') where.quartier = quartier
    if (statut && statut !== 'ALL') where.statut = statut

    const signalements = await prisma.signalement.findMany({
      where,
      include: {
        auteur: { select: { name: true } },
        _count: { select: { votes: true, commentaires: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(signalements)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { titre, description, categorie, quartier, latitude, longitude } = body

    if (!titre || !description || !categorie || !quartier) {
      return NextResponse.json(
        { error: 'Champs manquants' },
        { status: 400 }
      )
    }

    const signalement = await prisma.signalement.create({
      data: {
        titre,
        description,
        categorie,
        quartier,
        latitude,
        longitude,
        auteurId: (session.user as { id: string }).id,
      },
    })

    return NextResponse.json(signalement, { status: 201 })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
