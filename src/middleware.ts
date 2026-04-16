import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// ── WordPress → Next.js pattern redirects ──
// Maps old WooCommerce/WordPress URL patterns to new structure

function getPatternRedirect(path: string): string | null {
  // /microsoft-office/CATEGORY/LEVEL (beginner*, gevorderd*, expert*) → /cursussen/CATEGORY
  // Must be checked BEFORE productMatch to avoid redirecting to non-existent /cursussen/beginner-outlook
  const levelMatch = path.match(/^\/microsoft-office\/([^/]+)\/(beginner|gevorderd|expert)(?:[-_][^/]+)?$/)
  if (levelMatch) return `/cursussen/${levelMatch[1]}`

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
    return `/cursussen/${slug}`
  }

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

  // /wp-admin → admin login
  if (path === '/wp-admin') return '/admin/login'

  // Non-offered course local SEO pages (indesign, photoshop, illustrator, wordpress) → /cursussen
  const nonOfferedMatch = path.match(/^\/(indesign|photoshop|illustrator|wordpress)-cursus-[^/]+$/)
  if (nonOfferedMatch) return '/cursussen'

  // Elementor popup fragments — strip the #elementor-action fragment and redirect to base path
  if (path.includes('%23elementor-action') || path.includes('#elementor-action')) {
    const basePath = path.split('%23elementor-action')[0].split('#elementor-action')[0]
    return basePath || '/'
  }

  // /COURSE-SLUG/tel:* — phone link crawled as URL
  if (path.includes('/tel:')) {
    const basePath = path.split('/tel:')[0]
    return basePath || '/'
  }

  // /cursussen/cursus-SLUG → /cursussen/SLUG (old "cursus-" prefix pattern)
  const cursusPrefix = path.match(/^\/cursussen\/cursus-(.+)$/)
  if (cursusPrefix) return `/cursussen/${cursusPrefix[1]}`

  // /excel-cursus/CITY or /cursus-word/CITY → local SEO or category
  const oldCursusCity = path.match(/^\/(excel|word|outlook|powerpoint|power-bi|office-365)-cursus\/([^/]+)$/)
  if (oldCursusCity) return `/${oldCursusCity[1]}-cursus-${oldCursusCity[2]}`

  // /cursus-SLUG (old single-segment course paths)
  const oldCursusSingle = path.match(/^\/cursus-(excel|word|outlook|powerpoint|office-365|project|visio)$/)
  if (oldCursusSingle) return `/cursussen/${oldCursusSingle[1]}`

  // Old course category paths
  const oldCategoryPaths: Record<string, string> = {
    '/excel-cursus': '/cursussen/excel',
    '/excel-cursussen': '/cursussen/excel',
    '/word-cursussen': '/cursussen/word',
    '/outlook-cursussen': '/cursussen/outlook',
    '/powerpoint-cursussen': '/cursussen/powerpoint',
    '/office-365-cursussen': '/cursussen/office-365',
    '/power-bi-cursussen': '/cursussen/power-bi',
    '/project-cursussen': '/cursussen/project',
  }
  if (oldCategoryPaths[path]) return oldCategoryPaths[path]

  // /incompany-cursus-microsoft-office* → /incompany
  if (path.startsWith('/incompany-cursus-') || path === '/incompany-offerte-aanvragen') return '/incompany'

  // /cursussen/CITY (old location-based course pages)
  const cursussenCity = path.match(/^\/cursussen\/(enschede|hoofddorp|amsterdam|rotterdam|utrecht|den-haag|eindhoven|haarlem|zaandam|almere|alkmaar)$/)
  if (cursussenCity) return `/locaties/${cursussenCity[1]}`

  // Old /adobe-cursussen/*, /autodesk-cursussen/*, /developer-cursussen/*, /behendigheid-cursussen/*, /marketing-cursussen/* → /cursussen
  if (path.match(/^\/(adobe|autodesk|developer|behendigheid|marketing|project|power-bi|office)-cursussen/)) return '/cursussen'

  // Old /cursussen/adobe/*, /cursussen/developer-cursussen/*, /cursussen/marketing-cursussen/* → /cursussen
  if (path.match(/^\/cursussen\/(adobe|developer-cursussen|marketing-cursussen|autodesk|office-cursussen|office-365-cursus)/)) return '/cursussen'

  // Old course slugs that don't exist anymore
  const legacyCourses: Record<string, string> = {
    '/cursus-indesign-speciale-effecten': '/cursussen',
    '/cursus-project-gevorderd': '/cursussen/project',
    '/cursus-bim-basis': '/cursussen',
    '/lesmethodes/priveles/priveles-virtueel': '/lesmethodes',
    '/opleidingsportaal-plannit': '/',
  }
  if (legacyCourses[path]) return legacyCourses[path]

  // /inschrijving*.php, /z0f* — bot/spam traffic → ignore
  if (path.endsWith('.php') || path.match(/^\/z0f[a-f0-9]+$/)) return '/'

  // /over/* (old about subpages)
  if (path.startsWith('/over/')) return '/over-ons'

  // /cursusdata/page/* → /cursussen
  if (path.startsWith('/cursusdata')) return '/cursussen'

  // /{software}-cursus-{city} patterns for non-standard software names
  // photoshop, illustrator, indesign are not in CATEGORIE_SLUGS so local-seo pages 404
  const adobeLocalMatch = path.match(/^\/(photoshop|illustrator|indesign)-cursus-([^/]+)$/)
  if (adobeLocalMatch) return '/cursussen'

  // /cursus-adobe-* → /cursussen (Adobe niet meer in aanbod)
  if (path.match(/^\/cursus-adobe/)) return '/cursussen'

  // /cursussen/microsoft-office → /cursussen
  if (path === '/cursussen/microsoft-office') return '/cursussen'

  // /cursussen/cursus-SLUG → /cursussen/SLUG (dubbel "cursus" prefix)
  const dubbelCursusMatch = path.match(/^\/cursussen\/cursus-(.+)$/)
  if (dubbelCursusMatch) return `/cursussen/${dubbelCursusMatch[1]}`

  // /overons/* → /over-ons
  if (path.startsWith('/overons')) return '/over-ons'

  // /login → /admin/login
  if (path === '/login') return '/admin/login'

  // /**/tel:* → strip phone link from URL (broken href)
  const telMatch = path.match(/^(\/[^/]+)\/tel:/)
  if (telMatch) return telMatch[1]

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

  // Strip WooCommerce/WordPress query strings — redirect to clean URL
  const searchParams = request.nextUrl.searchParams
  const hasJunkParams = searchParams.has('attribute_pa_locatie') ||
    searchParams.has('attribute_pa_startdatum') ||
    searchParams.has('attribute_pa_startmaand') ||
    searchParams.has('attribute_pa_lesmethode') ||
    searchParams.has('attribute_pa_lestijden') ||
    [...searchParams.keys()].some(k => k.match(/^\d+_paged$/) || k.match(/^\d+_attr_/)) ||
    searchParams.has('68_device')

  if (hasJunkParams) {
    const cleanUrl = request.nextUrl.clone()
    cleanUrl.search = ''
    return NextResponse.redirect(cleanUrl, 301)
  }

  // Normalize: strip trailing slash for lookup
  const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path

  // 1. Check pattern redirects first (no DB call, instant)
  const patternRedirect = getPatternRedirect(normalizedPath)
  if (patternRedirect) {
    const url = request.nextUrl.clone()
    url.pathname = patternRedirect
    return NextResponse.redirect(url, 301)
  }

  // 2. Check database redirects only if no pattern match (slower, requires DB call)
  // Only check for paths that look like they might be old/custom redirects
  if (normalizedPath.includes('/') && normalizedPath.split('/').length >= 2) {
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
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
