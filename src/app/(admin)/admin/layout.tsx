'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, BookOpen, Calendar, Tag, MapPin,
  Inbox, Settings, LogOut, Menu, X, TrendingUp, BarChart3
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/prestaties', label: 'Prestaties', icon: TrendingUp },
  { href: '/admin/cursussen', label: 'Cursussen', icon: BookOpen },
  { href: '/admin/sessies', label: 'Sessies', icon: Calendar },
  { href: '/admin/categorieen', label: 'Categorieën', icon: Tag },
  { href: '/admin/locaties', label: 'Locaties', icon: MapPin },
  { href: '/admin/inzendingen', label: 'Inzendingen', icon: Inbox },
  { href: '/admin/tracking', label: 'Tracking', icon: BarChart3 },
  { href: '/admin/instellingen', label: 'Instellingen', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      } else {
        setUser(session?.user || null)
      }
      setLoading(false)
    })
  }, [pathname, router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
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
          'fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white transform transition-transform lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white font-bold text-sm px-2 py-1 rounded">CA</div>
            <span className="font-semibold text-sm">Admin Panel</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === item.href
                  ? 'bg-primary-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 mb-2 px-3 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
