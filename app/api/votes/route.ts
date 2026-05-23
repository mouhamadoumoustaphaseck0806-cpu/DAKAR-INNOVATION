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
    const { signalementId } = body

    // Check if vote already exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_signalementId: {
          userId: (session.user as { id: string }).id,
          signalementId,
        },
      },
    })

    if (existingVote) {
      // Remove vote
      await prisma.vote.delete({
        where: { id: existingVote.id },
      })
      return NextResponse.json({ removed: true })
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId: (session.user as { id: string }).id,
          signalementId,
        },
      })
      return NextResponse.json({ added: true })
    }
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
