'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Stats {
  totalSignalements: number
  resolus: number
  enCours: number
  enAttente: number
  rejetes: number
  categories: Record<string, number>
  quartiers: Record<string, number>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const COLORS = ['#00853f', '#fdef42', '#e31b23', '#3b82f6', '#f97316', '#ec4899']

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats/admin')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    ;(async () => { await fetchStats() })()
  }, [session])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  if (!stats) return <div className="min-h-screen flex items-center justify-center">Erreur</div>

  const categoryData = Object.entries(stats.categories).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
  }))

  const quartierData = Object.entries(stats.quartiers)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 8)

  const statutData = [
    { name: 'En attente', value: stats.enAttente },
    { name: 'En cours', value: stats.enCours },
    { name: 'Résolu', value: stats.resolus },
    { name: 'Rejeté', value: stats.rejetes },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-transparent py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Tableau de bord administrateur</h1>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.totalSignalements}
              </div>
              <p className="text-gray-600 text-sm">Total signalements</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.enAttente}</div>
              <p className="text-gray-600 text-sm">En attente</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.enCours}</div>
              <p className="text-gray-600 text-sm">En cours</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">{stats.resolus}</div>
              <p className="text-gray-600 text-sm">Résolus</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejetes}</div>
              <p className="text-gray-600 text-sm">Rejetés</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Statut Distribution */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Distribution par statut</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statutData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Categories Distribution */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Distribution par catégorie</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={140} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00853f" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quartiers Chart */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Top quartiers</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quartierData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#e31b23" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}
