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
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ hasVoted: false })
    }

    const vote = await prisma.vote.findUnique({
      where: {
        userId_signalementId: {
          userId: (session.user as any).id,
          signalementId: id,
        },
      },
    })

    return NextResponse.json({ hasVoted: !!vote })
  } catch (error) {
    return NextResponse.json({ hasVoted: false })
  }
}
