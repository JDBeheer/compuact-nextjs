'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Inbox, Users, TrendingUp } from 'lucide-react'

interface Stats {
  cursussen: number
  sessies: number
  inschrijvingen: number
  offertes: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ cursussen: 0, sessies: 0, inschrijvingen: 0, offertes: 0 })
  const [recenteInzendingen, setRecenteInzendingen] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    const supabase = createClient()

    async function loadStats() {
      const [cursussen, sessies, inschrijvingen, offertes, recente] = await Promise.all([
        supabase.from('cursussen').select('id', { count: 'exact', head: true }),
        supabase.from('cursus_sessies').select('id', { count: 'exact', head: true }),
        supabase.from('inschrijvingen').select('id', { count: 'exact', head: true }).eq('type', 'inschrijving'),
        supabase.from('inschrijvingen').select('id', { count: 'exact', head: true }).eq('type', 'offerte'),
        supabase.from('inschrijvingen').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        cursussen: cursussen.count || 0,
        sessies: sessies.count || 0,
        inschrijvingen: inschrijvingen.count || 0,
        offertes: offertes.count || 0,
      })

      setRecenteInzendingen(recente.data || [])
    }

    loadStats()
  }, [])

  const statCards = [
    { label: 'Cursussen', value: stats.cursussen, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Actieve sessies', value: stats.sessies, icon: Users, color: 'bg-green-500' },
    { label: 'Inschrijvingen', value: stats.inschrijvingen, icon: Inbox, color: 'bg-purple-500' },
    { label: 'Offertes', value: stats.offertes, icon: TrendingUp, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-500">{stat.label}</span>
              <div className={`${stat.color} text-white p-2 rounded-lg`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200">
          <h2 className="font-semibold">Recente inzendingen</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {recenteInzendingen.length === 0 ? (
            <div className="px-6 py-8 text-center text-zinc-500">Geen inzendingen gevonden.</div>
          ) : (
            recenteInzendingen.map((inz) => {
              const klant = inz.klantgegevens as Record<string, string>
              return (
                <div key={inz.id as string} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{klant?.voornaam} {klant?.achternaam}</div>
                    <div className="text-sm text-zinc-500">{klant?.email}</div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      inz.type === 'inschrijving' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {inz.type as string}
                    </span>
                    <div className="text-xs text-zinc-400 mt-1">
                      {new Date(inz.created_at as string).toLocaleDateString('nl-NL')}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
