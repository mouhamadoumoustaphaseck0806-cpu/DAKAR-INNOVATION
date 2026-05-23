import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/src/lib/prisma'
import { authOptions } from '@/src/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { contenu, signalementId } = body

    if (!contenu || !signalementId) {
      return NextResponse.json(
        { error: 'Champs manquants' },
        { status: 400 }
      )
    }

    const commentaire = await prisma.commentaire.create({
      data: {
        contenu,
        signalementId,
        auteurId: (session.user as { id: string }).id,
      },
    })

    return NextResponse.json(commentaire, { status: 201 })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
