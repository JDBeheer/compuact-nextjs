'use client'

import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Login page gets its own layout (no sidebar)
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // All other admin pages use AdminShell (which includes sidebar + auth check)
  // AdminShell is imported directly in each page that needs it
  return <>{children}</>
}
