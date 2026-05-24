'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  function validateClient() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Le nom est requis'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide'
    if (password.length < 8) e.password = 'Le mot de passe doit contenir au moins 8 caractères'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    if (!validateClient()) return

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Server returns { errors: { field: message } } or { error }
        if (data?.errors) setErrors(data.errors)
        else setErrors({ general: data.error || 'Erreur serveur' })
        setLoading(false)
        return
      }

      router.push('/auth/login')
    } catch (err) {
      setErrors({ general: 'Erreur réseau' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">S&apos;inscrire</h1>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm">Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full mt-1 p-2 border rounded" />
          {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
        </div>
        <div>
          <label className="block text-sm">Mot de passe</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full mt-1 p-2 border rounded" />
          {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
        </div>

        {errors.general && <div className="text-red-600">{errors.general}</div>}

        <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Création...' : "S&apos;inscrire"}
        </button>
      </form>
    </div>
  )
}
