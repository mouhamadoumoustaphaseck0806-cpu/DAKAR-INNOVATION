import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/src/lib/prisma'
import { authOptions } from '@/src/lib/auth'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const commentaires = await prisma.commentaire.findMany({
      where: { signalementId: id },
      include: { auteur: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(commentaires)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
