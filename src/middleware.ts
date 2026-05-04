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

  // /flexibel/cursus-windows* → /cursussen (cursus bestaat niet meer; moet VOOR generieke /flexibel/SLUG)
  if (path.match(/^\/flexibel\/cursus-windows/i)) return '/cursussen'

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
  // Exception: cursus-vba is the actual slug in the database, do not strip
  const cursusPrefix = path.match(/^\/cursussen\/cursus-(.+)$/)
  if (cursusPrefix && cursusPrefix[1] !== 'vba') return `/cursussen/${cursusPrefix[1]}`

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
    '/cursus-illustrator-basis': '/cursussen',
    '/cursus-inventor-gevorderd': '/cursussen',
    '/cursus-3ds-max-design': '/cursussen',
    '/cursus-indesign-gevorderd': '/cursussen',
    '/cursus-bluebeam-revu': '/cursussen',
    '/cursus-acrobat-formulieren': '/cursussen',
    '/cursus-photoshop': '/cursussen',
    '/cursus-google-adwords': '/cursussen',
    '/cursus-solliciteren-met-linkedin': '/cursussen',
    '/cursus-power-bi': '/cursussen/power-bi',
    '/cursus-power-bi-desktop': '/cursussen/power-bi-desktop',
    '/cursus-excel-power-bi': '/cursussen/excel-power-bi',
    '/cursus-powerpoint-alles-in-een': '/cursussen/powerpoint-alles-in-een',
    '/cursus-word-complexe-documenten': '/cursussen/word-complexe-documenten',
    '/linkedin-cursus': '/cursussen',
    '/excel-leren': '/cursussen/excel',
    '/privacy-policy': '/privacybeleid',
    '/copyright-trademarks': '/algemene-voorwaarden',
    '/handige-links': '/',
    '/open-leercentrum': '/lesmethodes',
    '/room-rental': '/contact',
    '/gekozen-cursussen': '/inschrijven',
    '/wat-vond-je-van-de-cursus': '/',
    '/bedankt-voor-het-downloaden': '/',
    '/offerteaanvraag': '/incompany',
    '/offerte-aanvragen': '/incompany',
  }
  if (legacyCourses[path]) return legacyCourses[path]

  // /inschrijving*.php, /z0f* — bot/spam traffic → ignore
  if (path.endsWith('.php') || path.match(/^\/z0f[a-f0-9]+$/)) return '/'

  // /over, /over/* (old about subpages)
  if (path === '/over' || path.startsWith('/over/')) return '/over-ons'

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

  // /overons/* → /over-ons
  if (path.startsWith('/overons')) return '/over-ons'

  // /login → /admin/login
  if (path === '/login') return '/admin/login'

  // /in-company/* → /incompany (verkeerde schrijfwijze met koppelteken)
  if (path.startsWith('/in-company')) return '/incompany'

  // /lesmethodes/incompany* → /incompany
  if (path.startsWith('/lesmethodes/incompany')) return '/incompany'

  // Niet meer aangeboden cursussen (Adobe, Access, Revit, Dreamweaver, Windows, PRINCE2, etc.)
  if (path.match(/^\/cursussen\/(elements|illustrator|photoshop|indesign|dreamweaver|windows-10|prince2|access|acrobat|sharepoint|developer|incompany|klassikaal)/i)) return '/cursussen'
  if (path.startsWith('/cursus-access')) return '/cursussen'
  if (path.startsWith('/cursus-revit')) return '/cursussen'
  if (path.startsWith('/cursus-photoshop')) return '/cursussen'

  // /cursussen/excel-cursus → /cursussen/excel
  if (path === '/cursussen/excel-cursus') return '/cursussen/excel'
  if (path.match(/^\/cursussen\/[Oo]utlook-cursussen$/)) return '/cursussen/outlook'
  if (path.match(/^\/cursussen\/[Ww]ord-cursussen$/)) return '/cursussen/word'
  if (path.match(/^\/cursussen\/[Pp]hotoshop-cursussen$/)) return '/cursussen'

  // /cursussen/introductiecursus → /cursussen/introductiecursus-5-in-een
  if (path === '/cursussen/introductiecursus') return '/cursussen/introductiecursus-5-in-een'

  // /cursussen/experts-power-bi → /cursussen/power-bi
  if (path === '/cursussen/experts-power-bi') return '/cursussen/power-bi'

  // /cursussen/project-gevorderd → /cursussen/project
  if (path === '/cursussen/project-gevorderd') return '/cursussen/project'

  // /cursussen/page/* → /cursussen
  if (path.match(/^\/cursussen\/page\/\d+$/)) return '/cursussen'
  if (path === '/cursussen/2') return '/cursussen'

  // /cursusaanvragen/SLUG or /cursusaanbod/* → /cursussen
  if (path.startsWith('/cursusaanvragen') || path.startsWith('/cursusaanbod')) return '/cursussen'

  // /excel-cursus-cursus-* (dubbel prefix) → fix
  const dubbelPrefix = path.match(/^\/excel-cursus-cursus-(.+)$/)
  if (dubbelPrefix) return `/cursussen/${dubbelPrefix[1]}`

  // /locaties/denhaag (zonder streepje) → /locaties/den-haag
  if (path === '/locaties/denhaag') return '/locaties/den-haag'
  if (path === '/locaties/denbosch') return '/locaties/den-bosch'

  // /locaties/cursusruimte-verhuur → /contact
  if (path === '/locaties/cursusruimte-verhuur') return '/contact'

  // Ontbrekende locaties met historische backlinks → /locaties (hub)
  // Bronnen: Ahrefs anchor-data 2026-04-23 (35+ refdomains per stad, veelal spam-farms)
  if (
    path === '/locaties/waddinxveen' ||
    path === '/locaties/apeldoorn' ||
    path === '/locaties/gorinchem' ||
    path === '/locaties/drachten' ||
    path === '/locaties/groningen'
  ) return '/locaties'

  // Verouderde cursussen die niet meer worden aangeboden → /cursussen
  if (path === '/cursussen/autocad') return '/cursussen'
  if (path === '/cursussen/seniorencursus') return '/cursussen'

  // /Outlook-cursussen(/*) → /cursussen/outlook (historische WordPress pad met hoofdletter)
  if (path.match(/^\/Outlook-cursussen(\/.*)?$/)) return '/cursussen/outlook'

  // /lesmethodes/klassikaal, /lesmethode/klassikaal → /lesmethodes
  if (path.match(/^\/lesmethode[s]?\/klassikaal$/)) return '/lesmethodes'
  if (path === '/lesmethodes/open-leercentrum') return '/lesmethodes'

  // /locatie-categorie/* → /locaties
  if (path.startsWith('/locatie-categorie')) return '/locaties'

  // /flexibel/page/* → /cursussen
  if (path.startsWith('/flexibel/page')) return '/cursussen'

  // /veelgestelde-vragen-coronavirus/* → /veelgestelde-vragen
  if (path.startsWith('/veelgestelde-vragen-coronavirus')) return '/veelgestelde-vragen'

  // /huisstijl-sjablonen/* → /cursussen
  if (path.startsWith('/huisstijl-sjablonen')) return '/cursussen'

  // /office-365-cursus-page/* → /cursussen/office-365
  if (path.startsWith('/office-365-cursus-page')) return '/cursussen/office-365'

  // /*/feed → strip feed
  if (path.endsWith('/feed')) {
    const basePath = path.slice(0, -5)
    return basePath || '/'
  }

  // /.well-known/* → ignore
  if (path.startsWith('/.well-known')) return '/'

  // /Word-cursussen, /Photoshop-cursussen (case insensitive already handled above)
  if (path.toLowerCase() === '/word-cursussen') return '/cursussen/word'
  if (path.toLowerCase() === '/photoshop-cursussen') return '/cursussen'

  // /adobe/* → /cursussen
  if (path.startsWith('/adobe')) return '/cursussen'

  // /cursussen/powerpoint-cursus → /cursussen/powerpoint
  if (path === '/cursussen/powerpoint-cursus') return '/cursussen/powerpoint'

  // /cursussen/excel-gevorderden → /cursussen/excel-gevorderd (typo)
  if (path === '/cursussen/excel-gevorderden') return '/cursussen/excel-gevorderd'

  // /cursussen/power-bi-service-excel → /cursussen/excel-power-bi
  if (path === '/cursussen/power-bi-service-excel') return '/cursussen/excel-power-bi'

  // /cursussen/{stad} → /locaties/{stad} of /cursussen
  const cursussenCityExtended = path.match(/^\/cursussen\/(lelystad|maastricht|gouda|amersfoort|delft|limburg|assen|dordrecht|bergen-op-zoom|doetinchem|geleen|zwolle|roosendaal)$/)
  if (cursussenCityExtended) return `/locaties/${cursussenCityExtended[1]}`

  // /cursussen/{CATEGORIE}-cursus/cursus-SLUG → /cursussen/SLUG (oude geneste structuur)
  const nestedCursusMatch = path.match(/^\/cursussen\/[^/]+-cursus\/cursus-(.+)$/)
  if (nestedCursusMatch) return `/cursussen/${nestedCursusMatch[1]}`

  // /cursus-{CATEGORIE}/cursus-SLUG → /cursussen/SLUG (oude geneste structuur)
  const oldProductNestedMatch = path.match(/^\/cursus-(?:excel|word|outlook|powerpoint|power-bi|office-365|project|visio)\/cursus-(.+)$/)
  if (oldProductNestedMatch) return `/cursussen/${oldProductNestedMatch[1]}`

  // /{CATEGORIE}-cursus-{onbekende-stad} → /cursussen/{CATEGORIE}
  const unknownCityMatch = path.match(/^\/(excel|word|outlook|powerpoint|power-bi|office-365|project|visio)-cursus-(katwijk|voorburg|alphen-aan-den-rijn|westland|bergen-op-zoom|capelle-aan-den-ijssel|leidschendam|den-bosch)$/)
  if (unknownCityMatch) return `/cursussen/${unknownCityMatch[1]}`

  // /cursus-{CATEGORIE}/{stad} → /{CATEGORIE}-cursus-{stad}
  const cursusProductCityMatch = path.match(/^\/cursus-(excel|word|outlook|powerpoint|power-bi|office-365|project|visio)\/(.+)$/)
  if (cursusProductCityMatch) return `/${cursusProductCityMatch[1]}-cursus-${cursusProductCityMatch[2]}`

  // /marketing/* → /cursussen (oude marketing sectie)
  if (path.startsWith('/marketing/')) return '/cursussen'

  // /flexibel (bare, zonder sub-path) → /cursussen
  if (path === '/flexibel') return '/cursussen'

  // /cursuslocatie/* → /cursussen
  if (path.startsWith('/cursuslocatie/')) return '/cursussen'

  // /inschrijvingen/* → /cursussen (oude WP inschrijf-URLs)
  if (path.startsWith('/inschrijvingen/')) return '/cursussen'

  // /sitemap_*.xml, /sitemap_index.xml → /sitemap.xml
  if (path.match(/^\/sitemap[_-].*\.xml$/)) return '/sitemap.xml'

  // /cursussen-xml-feed → /cursussen (oude WP feed)
  if (path === '/cursussen-xml-feed') return '/cursussen'

  // /producten-diensten → /cursussen
  if (path === '/producten-diensten') return '/cursussen'

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
