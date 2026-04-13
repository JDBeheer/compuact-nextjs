'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { supabaseBrowser } from '@/lib/supabase-browser'
import {
  LayoutDashboard, BookOpen, Calendar, Tag, MapPin,
  Inbox, Settings, LogOut, Menu, X, TrendingUp, BarChart3,
  AlertTriangle, ArrowRightLeft, UsersRound, User, Rocket, ExternalLink, Search
} from 'lucide-react'

const contentNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/prestaties', label: 'Prestaties', icon: TrendingUp },
  { href: '/admin/cursussen', label: 'Cursussen', icon: BookOpen },
  { href: '/admin/sessies', label: 'Sessies', icon: Calendar },
  { href: '/admin/categorieen', label: 'Categorieën', icon: Tag },
  { href: '/admin/locaties', label: 'Locaties', icon: MapPin },
  { href: '/admin/inzendingen', label: 'Inzendingen', icon: Inbox },
  { href: '/admin/tracking', label: 'Tracking', icon: BarChart3 },
]

const adminNav = [
  { href: '/admin/gebruikers', label: 'Gebruikers', icon: UsersRound },
  { href: '/admin/instellingen', label: 'Instellingen', icon: Settings },
  { href: '/admin/404-log', label: '404 Log', icon: AlertTriangle },
  { href: '/admin/redirects', label: 'Redirects', icon: ArrowRightLeft },
  { href: '/admin/livegang', label: 'Livegang', icon: Rocket },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState<'beheerder' | 'redacteur'>('beheerder')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(async ({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      } else if (session) {
        setUserEmail(session.user.email || '')

        // Fetch role from admin_users
        const { data: adminUser } = await supabaseBrowser
          .from('admin_users')
          .select('rol')
          .eq('auth_user_id', session.user.id)
          .single()

        if (adminUser?.rol) {
          setUserRole(adminUser.rol as 'beheerder' | 'redacteur')
        }
      }
      setLoading(false)
    })
  }, [pathname, router])

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut()
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white transform transition-transform lg:translate-x-0 lg:static flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white font-bold text-sm px-2 py-1 rounded">CA</div>
            <span className="font-semibold text-sm">Admin Panel</span>
          </Link>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300" title="Website bekijken">
              <ExternalLink size={14} />
            </a>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400">
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {contentNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href))
                  ? 'bg-primary-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}

          {userRole === 'beheerder' && (
            <>
              <div className="pt-4 pb-1 px-3">
                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Beheer</p>
              </div>
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    pathname.startsWith(item.href)
                      ? 'bg-primary-600 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-3 border-t border-zinc-800 space-y-1">
          <Link
            href="/admin/account"
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === '/admin/account'
                ? 'bg-primary-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            )}
          >
            <User size={18} />
            <div className="min-w-0">
              <p className="text-sm truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-500 capitalize">{userRole}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          >
            <LogOut size={18} />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-zinc-200 px-4 lg:px-8 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-600">
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <Link href="/" className="text-sm text-zinc-500 hover:text-primary-600" target="_blank">
            Bekijk website &rarr;
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
