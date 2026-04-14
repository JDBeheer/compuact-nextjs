import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// ── WordPress → Next.js pattern redirects ──
// Maps old WooCommerce/WordPress URL patterns to new structure

function getPatternRedirect(path: string): string | null {
  // /microsoft-office/CATEGORY/COURSE-SLUG/ → /cursussen/COURSE-SLUG
  const productMatch = path.match(/^\/microsoft-office\/[^/]+\/([^/]+)$/)
  if (productMatch) return `/cursussen/${productMatch[1]}`

  // /ai-cursussen/SLUG/ → /cursussen/SLUG
  const aiMatch = path.match(/^\/ai-cursussen\/([^/]+)$/)
  if (aiMatch) return `/cursussen/${aiMatch[1]}`

  // /developer/vba/SLUG/ → /cursussen/SLUG
  const devMatch = path.match(/^\/developer\/[^/]+\/([^/]+)$/)
  if (devMatch) return `/cursussen/${devMatch[1]}`

  // /microsoft-office/SLUG (standalone products like sharepoint, introductiecursus)
  const standaloneMatch = path.match(/^\/microsoft-office\/([^/]+)$/)
  if (standaloneMatch) {
    const slug = standaloneMatch[1]
    // Category pages
    const categoryMap: Record<string, string> = {
      excel: '/cursussen/excel',
      word: '/cursussen/word',
      outlook: '/cursussen/outlook',
      powerpoint: '/cursussen/powerpoint',
      'power-bi': '/cursussen/power-bi',
      'office-365': '/cursussen/office-365',
      project: '/cursussen/project',
      visio: '/cursussen/visio',
    }
    if (categoryMap[slug]) return categoryMap[slug]
    // Otherwise treat as course
    return `/cursussen/${slug}`
  }

  // /microsoft-office/CATEGORY/LEVEL (beginner, gevorderd, expert) → /cursussen/CATEGORY
  const levelMatch = path.match(/^\/microsoft-office\/([^/]+)\/(beginner|gevorderd|expert)(?:-[^/]+)?$/)
  if (levelMatch) return `/cursussen/${levelMatch[1]}`

  // /microsoft-office/ → /cursussen
  if (path === '/microsoft-office') return '/cursussen'

  // /vba/ → /cursussen/vba
  if (path === '/vba') return '/cursussen/vba'

  // /ai-cursussen/ → /cursussen/ai
  if (path === '/ai-cursussen') return '/cursussen/ai'

  // /locatie/SLUG/ → /locaties/SLUG
  const locatieMatch = path.match(/^\/locatie\/([^/]+)$/)
  if (locatieMatch) {
    const slug = locatieMatch[1]
    // Virtual/special locations → general pages
    if (slug === 'virtueel' || slug === 'thuisstudie') return '/lesmethodes'
    if (slug === 'incompany') return '/incompany'
    return `/locaties/${slug}`
  }

  // /over-compu-act/ and subpages → /over-ons
  if (path.startsWith('/over-compu-act')) return '/over-ons'

  // /lesmethodes/incompany-cursus-*/ → /incompany
  if (path.match(/^\/lesmethodes\/incompany-cursus-/)) return '/incompany'

  // /lesmethodes/company-online-live/ → /lesmethodes
  if (path.startsWith('/lesmethodes/company-online-live')) return '/lesmethodes'

  // /vacatures/ → /over-ons (geen vacaturepagina in nieuwe site)
  if (path === '/vacatures') return '/over-ons'

  // /cursussen/categorie/:slug → /cursussen/:slug (already in next.config but also here)
  const catMatch = path.match(/^\/cursussen\/categorie\/([^/]+)$/)
  if (catMatch) return `/cursussen/${catMatch[1]}`

  // /computertraining-CITY/ → homepage (old local SEO pages without course type)
  const computertrainingMatch = path.match(/^\/computertraining-([^/]+)$/)
  if (computertrainingMatch) return '/'

  // /powerpoint-alles-in-een-cursus-CITY/ → /powerpoint-cursus-CITY
  const ppMatch = path.match(/^\/powerpoint-alles-in-een-cursus-([^/]+)$/)
  if (ppMatch) return `/powerpoint-cursus-${ppMatch[1]}`

  // /cursuslocaties/SLUG → /locaties/SLUG
  const cursusLocMatch = path.match(/^\/cursuslocaties\/([^/]+)$/)
  if (cursusLocMatch) return `/locaties/${cursusLocMatch[1]}`
  if (path === '/cursuslocaties') return '/locaties'

  // /cursussen/office-cursussen/CATEGORY/SLUG → /cursussen/SLUG
  const officeCursMatch = path.match(/^\/cursussen\/office-cursussen\/[^/]+\/([^/]+)$/)
  if (officeCursMatch) return `/cursussen/${officeCursMatch[1]}`

  // /cursussen/office-cursussen/SLUG → /cursussen/SLUG
  const officeDirectMatch = path.match(/^\/cursussen\/office-cursussen\/([^/]+)$/)
  if (officeDirectMatch) return `/cursussen/${officeDirectMatch[1]}`

  // /cursussen/microsoft-office/CATEGORY/SLUG → /cursussen/SLUG
  const msOfficeCatMatch = path.match(/^\/cursussen\/microsoft-office\/[^/]+\/([^/]+)$/)
  if (msOfficeCatMatch) return `/cursussen/${msOfficeCatMatch[1]}`

  // /cursussen/microsoft-office/powerpoint/SLUG → /cursussen/SLUG
  const msOfficeDirectMatch = path.match(/^\/cursussen\/microsoft-office\/([^/]+)\/([^/]+)$/)
  if (msOfficeDirectMatch) return `/cursussen/${msOfficeDirectMatch[2]}`

  // /cursussen/microsoft-office/SLUG → /cursussen/SLUG
  const msOfficeSingleMatch = path.match(/^\/cursussen\/microsoft-office\/([^/]+)$/)
  if (msOfficeSingleMatch) return `/cursussen/${msOfficeSingleMatch[1]}`

  // /cursussen/adobe-cursussen/CATEGORY/SLUG → /cursussen/SLUG
  const adobeCatMatch = path.match(/^\/cursussen\/adobe-cursussen\/[^/]+\/([^/]+)$/)
  if (adobeCatMatch) return `/cursussen/${adobeCatMatch[1]}`

  // /cursussen/adobe-cursussen/SLUG → /cursussen/SLUG
  const adobeDirectMatch = path.match(/^\/cursussen\/adobe-cursussen\/([^/]+)$/)
  if (adobeDirectMatch) return `/cursussen/${adobeDirectMatch[1]}`

  // /klassikaal/SLUG or /flexibel/SLUG → /cursussen/SLUG
  const lesmethodeMatch = path.match(/^\/(?:klassikaal|flexibel)\/([^/]+)$/)
  if (lesmethodeMatch) return `/cursussen/${lesmethodeMatch[1]}`

  // Old overview pages
  if (path === '/cursusoverzicht' || path === '/cursusdata') return '/cursussen'
  if (path === '/excel-cursussen') return '/cursussen/excel'
  if (path === '/cursus-word') return '/cursussen/word'
  if (path === '/cursus-office-365') return '/cursussen/office-365'
  if (path === '/shop') return '/cursussen'

  // /cursussen/project-maatwerk → /incompany
  if (path === '/cursussen/project-maatwerk') return '/incompany'

  // /flexibel/seniorencursus → /cursussen
  if (path === '/flexibel/seniorencursus') return '/cursussen'

  // /wp-admin → ignore (bot traffic)
  if (path === '/wp-admin') return '/cursussen'

  // /{software}-cursus-{city} patterns for non-standard software names
  // photoshop, illustrator, indesign → these are course slugs, not categories
  const adobeLocalMatch = path.match(/^\/(photoshop|illustrator|indesign)-cursus-([^/]+)$/)
  if (adobeLocalMatch) return `/cursussen/cursus-${adobeLocalMatch[1]}-basis`

  return null
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip static files and Next.js internals
  if (
    path.startsWith('/_next') ||
    path.startsWith('/images') ||
    path.startsWith('/documents') ||
    path.includes('.')
  ) {
    return NextResponse.next()
  }

  // Skip API routes (they handle their own auth)
  if (path.startsWith('/api')) {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return NextResponse.next()

  // Protect admin routes (except login page)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          }
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  // Normalize: strip trailing slash for lookup
  const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path

  // 1. Check database redirects first (admin-managed)
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data } = await supabase
    .from('redirects')
    .select('to_path, status_code')
    .eq('from_path', normalizedPath)
    .eq('actief', true)
    .single()

  if (data) {
    if (!data.to_path.startsWith('/') || data.to_path.startsWith('//')) {
      return NextResponse.next()
    }
    const url = request.nextUrl.clone()
    url.pathname = data.to_path
    return NextResponse.redirect(url, data.status_code || 301)
  }

  // 2. Check WordPress pattern redirects (migration)
  const patternRedirect = getPatternRedirect(normalizedPath)
  if (patternRedirect) {
    const url = request.nextUrl.clone()
    url.pathname = patternRedirect
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
