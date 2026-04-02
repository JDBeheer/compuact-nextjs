// Steden waar we GEEN eigen trainingslocatie hebben maar wél local SEO pagina's voor willen
// Coördinaten voor afstandsberekening naar dichtstbijzijnde locaties

export interface Stad {
  slug: string
  naam: string
  lat: number
  lng: number
  regio: string
}

export const extraSteden: Stad[] = [
  // Noord-Holland
  { slug: 'purmerend', naam: 'Purmerend', lat: 52.5053, lng: 4.9597, regio: 'Noord-Holland' },
  { slug: 'hilversum', naam: 'Hilversum', lat: 52.2232, lng: 5.1764, regio: 'Noord-Holland' },
  { slug: 'hoofddorp', naam: 'Hoofddorp', lat: 52.3026, lng: 4.6910, regio: 'Noord-Holland' },
  { slug: 'amstelveen', naam: 'Amstelveen', lat: 52.3008, lng: 4.8642, regio: 'Noord-Holland' },
  { slug: 'den-helder', naam: 'Den Helder', lat: 52.9563, lng: 4.7600, regio: 'Noord-Holland' },
  // Zuid-Holland
  { slug: 'zoetermeer', naam: 'Zoetermeer', lat: 52.0575, lng: 4.4939, regio: 'Zuid-Holland' },
  { slug: 'delft', naam: 'Delft', lat: 52.0116, lng: 4.3571, regio: 'Zuid-Holland' },
  { slug: 'gouda', naam: 'Gouda', lat: 52.0115, lng: 4.7106, regio: 'Zuid-Holland' },
  { slug: 'dordrecht', naam: 'Dordrecht', lat: 51.8133, lng: 4.6731, regio: 'Zuid-Holland' },
  { slug: 'vlaardingen', naam: 'Vlaardingen', lat: 51.9125, lng: 4.3419, regio: 'Zuid-Holland' },
  { slug: 'schiedam', naam: 'Schiedam', lat: 51.9172, lng: 4.3989, regio: 'Zuid-Holland' },
  { slug: 'spijkenisse', naam: 'Spijkenisse', lat: 51.8450, lng: 4.3292, regio: 'Zuid-Holland' },
  // Utrecht
  { slug: 'zeist', naam: 'Zeist', lat: 52.0907, lng: 5.2330, regio: 'Utrecht' },
  { slug: 'nieuwegein', naam: 'Nieuwegein', lat: 52.0286, lng: 5.0861, regio: 'Utrecht' },
  { slug: 'veenendaal', naam: 'Veenendaal', lat: 52.0274, lng: 5.5584, regio: 'Utrecht' },
  // Gelderland
  { slug: 'arnhem', naam: 'Arnhem', lat: 51.9851, lng: 5.8987, regio: 'Gelderland' },
  { slug: 'apeldoorn', naam: 'Apeldoorn', lat: 52.2112, lng: 5.9699, regio: 'Gelderland' },
  { slug: 'ede', naam: 'Ede', lat: 52.0484, lng: 5.6520, regio: 'Gelderland' },
  { slug: 'doetinchem', naam: 'Doetinchem', lat: 51.9654, lng: 6.2886, regio: 'Gelderland' },
  // Noord-Brabant
  { slug: 'tilburg', naam: 'Tilburg', lat: 51.5600, lng: 5.0919, regio: 'Noord-Brabant' },
  { slug: 'breda', naam: 'Breda', lat: 51.5719, lng: 4.7683, regio: 'Noord-Brabant' },
  { slug: 'oss', naam: 'Oss', lat: 51.7650, lng: 5.5183, regio: 'Noord-Brabant' },
  { slug: 'helmond', naam: 'Helmond', lat: 51.4816, lng: 5.6613, regio: 'Noord-Brabant' },
  { slug: 'roosendaal', naam: 'Roosendaal', lat: 51.5303, lng: 4.4570, regio: 'Noord-Brabant' },
  // Overijssel
  { slug: 'enschede', naam: 'Enschede', lat: 52.2215, lng: 6.8937, regio: 'Overijssel' },
  { slug: 'deventer', naam: 'Deventer', lat: 52.2511, lng: 6.1604, regio: 'Overijssel' },
  { slug: 'hengelo', naam: 'Hengelo', lat: 52.2661, lng: 6.7926, regio: 'Overijssel' },
  { slug: 'almelo', naam: 'Almelo', lat: 52.3570, lng: 6.6628, regio: 'Overijssel' },
  // Drenthe
  { slug: 'assen', naam: 'Assen', lat: 52.9929, lng: 6.5642, regio: 'Drenthe' },
  { slug: 'emmen', naam: 'Emmen', lat: 52.7875, lng: 6.8977, regio: 'Drenthe' },
  { slug: 'hoogeveen', naam: 'Hoogeveen', lat: 52.7239, lng: 6.4739, regio: 'Drenthe' },
  // Friesland
  { slug: 'heerenveen', naam: 'Heerenveen', lat: 52.9600, lng: 5.9233, regio: 'Friesland' },
  // Groningen
  { slug: 'groningen', naam: 'Groningen', lat: 53.2194, lng: 6.5665, regio: 'Groningen' },
  // Flevoland
  { slug: 'lelystad', naam: 'Lelystad', lat: 52.5085, lng: 5.4750, regio: 'Flevoland' },
  // Limburg
  { slug: 'venlo', naam: 'Venlo', lat: 51.3704, lng: 6.1724, regio: 'Limburg' },
  { slug: 'roermond', naam: 'Roermond', lat: 51.1946, lng: 5.9880, regio: 'Limburg' },
  { slug: 'maastricht', naam: 'Maastricht', lat: 50.8514, lng: 5.6910, regio: 'Limburg' },
  { slug: 'heerlen', naam: 'Heerlen', lat: 50.8882, lng: 5.9815, regio: 'Limburg' },
  { slug: 'geleen', naam: 'Geleen', lat: 50.9736, lng: 5.8291, regio: 'Limburg' },
  // Zeeland
  { slug: 'middelburg', naam: 'Middelburg', lat: 51.4988, lng: 3.6109, regio: 'Zeeland' },
  { slug: 'terneuzen', naam: 'Terneuzen', lat: 51.3370, lng: 3.8277, regio: 'Zeeland' },
]

export function getStadBySlug(slug: string): Stad | undefined {
  return extraSteden.find(s => s.slug === slug)
}

// Haversine distance in km
export function berekenAfstand(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
