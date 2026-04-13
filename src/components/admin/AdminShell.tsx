'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Settings, LogOut, LayoutDashboard, Loader2, AlertTriangle, ArrowRightLeft,
  BookOpen, Calendar, Tag, MapPin, Inbox, TrendingUp, BarChart3,
  UsersRound, User, ExternalLink, Rocket
} from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase-browser'

const CONTENT_NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Prestaties', href: '/admin/prestaties', icon: TrendingUp },
  { label: 'Cursussen', href: '/admin/cursussen', icon: BookOpen },
  { label: 'Sessies', href: '/admin/sessies', icon: Calendar },
  { label: 'Categorieën', href: '/admin/categorieen', icon: Tag },
  { label: 'Locaties', href: '/admin/locaties', icon: MapPin },
  { label: 'Inzendingen', href: '/admin/inzendingen', icon: Inbox },
  { label: 'Tracking', href: '/admin/tracking', icon: BarChart3 },
]

const ADMIN_NAV = [
  { label: 'Gebruikers', href: '/admin/gebruikers', icon: UsersRound },
  { label: 'Instellingen', href: '/admin/instellingen', icon: Settings },
  { label: '404 Log', href: '/admin/404-log', icon: AlertTriangle },
  { label: 'Redirects', href: '/admin/redirects', icon: ArrowRightLeft },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState<'beheerder' | 'redacteur'>('beheerder')

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/admin/login')
      } else {
        setUserEmail(data.session.user.email || '')

        const { data: adminUser, error: adminError } = await supabaseBrowser
          .from('admin_users')
          .select('rol')
          .eq('auth_user_id', data.session.user.id)
          .single()

        if (!adminError && adminUser?.rol) {
          setUserRole(adminUser.rol as 'beheerder' | 'redacteur')
        }

        setLoading(false)
      }
    })
  }, [router])

  async function handleLogout() {
    await supabaseBrowser.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <a href="/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2">
            <div className="bg-primary-600 text-white font-bold text-sm px-2 py-1 rounded">CA</div>
            <span className="font-semibold text-sm">Admin Panel</span>
          </a>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
              Beheerportaal
            </p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Website bekijken"
            >
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {CONTENT_NAV.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}

          {userRole === 'beheerder' && (
            <>
              <div className="pt-4 pb-1 px-3">
                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Beheer</p>
              </div>
              {ADMIN_NAV.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        <div className="p-3 border-t border-zinc-800 space-y-1">
          <Link
            href="/admin/account"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin/account' ? 'bg-primary-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <User size={18} />
            <div className="min-w-0">
              <p className="text-sm truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-500 capitalize">{userRole}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors w-full"
          >
            <LogOut size={18} />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
