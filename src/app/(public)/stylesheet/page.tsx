import Image from 'next/image'

export const metadata = {
  title: 'Stylesheet',
  robots: 'noindex, nofollow',
}

export default function StylesheetPage() {
  const primaryColors = [
    { name: 'primary-50', class: 'bg-primary-50', hex: '#f0f7ff' },
    { name: 'primary-100', class: 'bg-primary-100', hex: '#dfedff' },
    { name: 'primary-200', class: 'bg-primary-200', hex: '#b8dbff' },
    { name: 'primary-300', class: 'bg-primary-300', hex: '#7abfff' },
    { name: 'primary-400', class: 'bg-primary-400', hex: '#3a9ff5' },
    { name: 'primary-500', class: 'bg-primary-500', hex: '#1B6AB3', brand: true },
    { name: 'primary-600', class: 'bg-primary-600', hex: '#155d9e' },
    { name: 'primary-700', class: 'bg-primary-700', hex: '#124d84' },
    { name: 'primary-800', class: 'bg-primary-800', hex: '#11416d' },
    { name: 'primary-900', class: 'bg-primary-900', hex: '#13385b' },
    { name: 'primary-950', class: 'bg-primary-950', hex: '#0c243d' },
  ]

  const accentColors = [
    { name: 'accent-50', class: 'bg-accent-50', hex: '#fff8eb' },
    { name: 'accent-100', class: 'bg-accent-100', hex: '#feecc7' },
    { name: 'accent-200', class: 'bg-accent-200', hex: '#fdd78a' },
    { name: 'accent-300', class: 'bg-accent-300', hex: '#fcbe4d' },
    { name: 'accent-400', class: 'bg-accent-400', hex: '#fbab24' },
    { name: 'accent-500', class: 'bg-accent-500', hex: '#F49800', brand: true },
    { name: 'accent-600', class: 'bg-accent-600', hex: '#d87400' },
    { name: 'accent-700', class: 'bg-accent-700', hex: '#b35204' },
    { name: 'accent-800', class: 'bg-accent-800', hex: '#913f0a' },
    { name: 'accent-900', class: 'bg-accent-900', hex: '#78350b' },
    { name: 'accent-950', class: 'bg-accent-950', hex: '#451a03' },
  ]

  const grayColors = [
    { name: 'zinc-50', class: 'bg-zinc-50', hex: '#fafafa' },
    { name: 'zinc-100', class: 'bg-zinc-100', hex: '#f4f4f5' },
    { name: 'zinc-200', class: 'bg-zinc-200', hex: '#e4e4e7' },
    { name: 'zinc-300', class: 'bg-zinc-300', hex: '#d4d4d8' },
    { name: 'zinc-400', class: 'bg-zinc-400', hex: '#a1a1aa' },
    { name: 'zinc-500', class: 'bg-zinc-500', hex: '#71717a' },
    { name: 'zinc-600', class: 'bg-zinc-600', hex: '#52525b' },
    { name: 'zinc-700', class: 'bg-zinc-700', hex: '#3f3f46' },
    { name: 'zinc-800', class: 'bg-zinc-800', hex: '#27272a' },
    { name: 'zinc-900', class: 'bg-zinc-900', hex: '#18181b' },
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Compu Act Stylesheet</h1>
        <p className="text-zinc-500 mb-12">Overzicht van alle kleuren, typografie, knoppen en componenten.</p>

        {/* Logo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">Logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-200 rounded-xl p-8 flex items-center justify-center bg-white">
              <Image src="/images/logo.svg" alt="Compu Act logo" width={250} height={79} />
            </div>
            <div className="border border-zinc-200 rounded-xl p-8 flex items-center justify-center bg-primary-900">
              <Image src="/images/logo.svg" alt="Compu Act logo op donker" width={250} height={79} className="brightness-0 invert" />
            </div>
          </div>
          <div className="mt-4 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: '#1B6AB3' }} />
              <span className="text-zinc-600">Blauw #1B6AB3</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: '#F49800' }} />
              <span className="text-zinc-600">Oranje #F49800</span>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">Kleuren</h2>

          <h3 className="text-lg font-semibold mb-3">Primary (blauw)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 mb-8">
            {primaryColors.map((color) => (
              <div key={color.name} className="text-center">
                <div className={`${color.class} h-16 rounded-lg border border-zinc-200 ${color.brand ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`} />
                <p className="text-xs font-medium mt-1">{color.name}</p>
                <p className="text-xs text-zinc-400">{color.hex}</p>
                {color.brand && <p className="text-[10px] font-semibold text-primary-500 mt-0.5">BRAND</p>}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3">Accent (oranje)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 mb-8">
            {accentColors.map((color) => (
              <div key={color.name} className="text-center">
                <div className={`${color.class} h-16 rounded-lg border border-zinc-200 ${color.brand ? 'ring-2 ring-offset-2 ring-accent-500' : ''}`} />
                <p className="text-xs font-medium mt-1">{color.name}</p>
                <p className="text-xs text-zinc-400">{color.hex}</p>
                {color.brand && <p className="text-[10px] font-semibold text-accent-500 mt-0.5">BRAND</p>}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3">Grijs (zinc)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 mb-8">
            {grayColors.map((color) => (
              <div key={color.name} className="text-center">
                <div className={`${color.class} h-16 rounded-lg border border-zinc-200`} />
                <p className="text-xs font-medium mt-1">{color.name}</p>
                <p className="text-xs text-zinc-400">{color.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">Typografie</h2>
          <p className="text-sm text-zinc-500 mb-6">Font: Plus Jakarta Sans (Google Fonts)</p>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-zinc-400 mb-1">h1 — text-4xl / 36px / font-bold</p>
              <h1 className="text-4xl font-bold">De specialist in Microsoft Office Trainingen</h1>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">h2 — text-3xl / 30px / font-bold</p>
              <h2 className="text-3xl font-bold">Onze populaire cursussen</h2>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">h3 — text-2xl / 24px / font-semibold</p>
              <h3 className="text-2xl font-semibold">Excel Basis Training</h3>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">h4 — text-xl / 20px / font-semibold</p>
              <h4 className="text-xl font-semibold">Incompany mogelijkheden</h4>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">h5 — text-lg / 18px / font-medium</p>
              <h5 className="text-lg font-medium">Cursusdetails</h5>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">body — text-base / 16px / font-normal</p>
              <p className="text-base">Al meer dan 21 jaar de specialist in Microsoft Office trainingen. Klassikaal, live online of incompany door heel Nederland.</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">small — text-sm / 14px / font-normal</p>
              <p className="text-sm text-zinc-600">Inclusief cursusmateriaal en certificaat van deelname.</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">caption — text-xs / 12px</p>
              <p className="text-xs text-zinc-400">Prijzen zijn exclusief BTW</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">Knoppen</h2>

          <h3 className="text-lg font-semibold mb-4">Primary</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
              Inschrijven
            </button>
            <button className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm">
              Bekijk cursus
            </button>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors text-xs">
              Klein
            </button>
            <button className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed">
              Disabled
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4">Accent / CTA</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors">
              Offerte aanvragen
            </button>
            <button className="bg-accent-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-accent-600 transition-colors text-sm">
              Meer informatie
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4">Outline</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="border-2 border-primary-500 text-primary-500 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Alle cursussen
            </button>
            <button className="border-2 border-zinc-300 text-zinc-700 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-50 transition-colors">
              Annuleren
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4">Ghost / Text</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="text-primary-500 px-4 py-2 font-medium hover:bg-primary-50 rounded-lg transition-colors">
              Meer info →
            </button>
            <button className="text-zinc-600 px-4 py-2 font-medium hover:bg-zinc-100 rounded-lg transition-colors">
              Terug
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full w-fit mb-3">Populair</div>
              <h3 className="text-lg font-semibold mb-2">Excel Basis</h3>
              <p className="text-sm text-zinc-600 mb-4">Leer de basis van Excel in deze praktische training.</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-500">€ 349,-</span>
                <button className="bg-primary-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors">Bekijk</button>
              </div>
            </div>

            <div className="border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="bg-accent-100 text-accent-700 text-xs font-semibold px-2 py-1 rounded-full w-fit mb-3">Nieuw</div>
              <h3 className="text-lg font-semibold mb-2">Power BI</h3>
              <p className="text-sm text-zinc-600 mb-4">Data visualisatie en rapportages met Power BI.</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-500">€ 449,-</span>
                <button className="bg-primary-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors">Bekijk</button>
              </div>
            </div>

            <div className="border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-primary-500 text-white">
              <div className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full w-fit mb-3">Incompany</div>
              <h3 className="text-lg font-semibold mb-2">Op maat training</h3>
              <p className="text-sm text-white/80 mb-4">Training op locatie, afgestemd op uw team.</p>
              <button className="bg-white text-primary-500 text-sm px-4 py-2 rounded-lg font-medium hover:bg-zinc-100 transition-colors">Offerte aanvragen</button>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">Klassikaal</span>
            <span className="bg-accent-100 text-accent-700 text-xs font-semibold px-3 py-1 rounded-full">Live Online</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Incompany</span>
            <span className="bg-zinc-100 text-zinc-700 text-xs font-semibold px-3 py-1 rounded-full">1 dag</span>
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">Vol</span>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Beschikbaar</span>
          </div>
        </section>

        {/* Form elements */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">Formulier elementen</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Naam</label>
              <input
                type="text"
                placeholder="Uw volledige naam"
                className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="naam@bedrijf.nl"
                className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Bericht</label>
              <textarea
                placeholder="Uw bericht..."
                rows={3}
                className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm">
              Versturen
            </button>
          </div>
        </section>

        {/* Layout */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">Layout containers</h2>
          <div className="space-y-4">
            <div className="bg-zinc-100 rounded-lg p-4">
              <p className="text-xs text-zinc-500 mb-1">.container-narrow — max-w-5xl (1024px)</p>
              <div className="max-w-5xl mx-auto bg-white border border-dashed border-zinc-300 rounded p-4 text-center text-sm text-zinc-400">
                content
              </div>
            </div>
            <div className="bg-zinc-100 rounded-lg p-4">
              <p className="text-xs text-zinc-500 mb-1">.container-wide — max-w-7xl (1280px)</p>
              <div className="max-w-7xl mx-auto bg-white border border-dashed border-zinc-300 rounded p-4 text-center text-sm text-zinc-400">
                content
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-zinc-400 pt-8 border-t">
          Stylesheet — Compu Act Opleidingen — Alleen voor intern gebruik
        </footer>
      </div>
    </div>
  )
}
