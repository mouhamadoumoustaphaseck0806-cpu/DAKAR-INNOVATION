import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/src/lib/prisma'

function validateEmail(email: unknown) {
  if (typeof email !== 'string') return false
  // simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const name = typeof payload.name === 'string' && payload.name.trim() !== '' ? payload.name.trim() : null
    const email = payload.email
    const password = payload.password

    const errors: Record<string, string> = {}

    if (!validateEmail(email)) {
      errors.email = "Email invalide"
    }

    if (typeof password !== 'string' || password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    }

    if (name === null) {
      errors.name = 'Le nom est requis'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ errors: { email: "Email déjà utilisé" } }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    })

    return NextResponse.json({ id: user.id, email: user.email })
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
