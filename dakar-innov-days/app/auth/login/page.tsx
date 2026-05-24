'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Alert } from '@/components/Alert'

interface FormData {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [form, setForm] = useState<FormData>({ email: '', password: '' })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (result?.ok) {
      setAlert({ type: 'success', message: 'Connexion réussie!' })
      setTimeout(() => router.push('/'), 1500)
    } else {
      setAlert({ type: 'error', message: 'Email ou mot de passe incorrect' })
    }

    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-transparent flex items-center justify-center py-12">
        <div className="card max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold mb-2 text-center">Connexion</h1>
          <p className="text-center text-gray-600 mb-8">
            Connectez-vous à Dakar Innovation Days
          </p>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-600 outline-none"
                placeholder="votre@email.sn"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-green-600 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t">
            <p className="text-center text-gray-600 mb-4">
              Pour les tests, utilisez:
            </p>
            <div className="bg-gray-100 p-4 rounded text-sm space-y-2">
              <p><strong>Citoyen:</strong> citoyen@test.sn / test123</p>
              <p><strong>Admin:</strong> admin@dakar.sn / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
