export interface Categorie {
  id: string
  naam: string
  slug: string
  volgorde: number
}

export interface Locatie {
  id: string
  naam: string
  stad: string
}

export interface Cursus {
  id: string
  slug: string
  titel: string
  beschrijving: string
  korte_beschrijving: string
  afbeelding: string | null
  categorie_id: string
  prijs_vanaf: number
  inhoud: CursusInhoud
  duur: string
  niveau: 'beginner' | 'gevorderd' | 'expert'
  actief: boolean
  created_at: string
  categorie?: Categorie
  sessies?: CursusSessie[]
}

export interface CursusInhoud {
  wat_leer_je: string[]
  programma: string[]
  doelgroep: string
  voorkennis: string
  lesmateriaal: string
  certificaat: string
  incompany_tekst?: string
}

export interface CursusSessie {
  id: string
  cursus_id: string
  locatie_id: string
  locatie_naam: string
  locatie_stad: string
  datum: string
  tijden: string
  prijs: number
  lesmethode: 'klassikaal' | 'online' | 'thuisstudie' | 'incompany'
  capaciteit: number
  actief: boolean
  cursus?: Cursus
  locatie?: Locatie
}

export interface CartItem {
  sessieId: string
  cursusTitel: string
  locatie: string
  datum: string
  prijs: number
  lesmethode: string
}

export interface Inschrijving {
  id: string
  type: 'inschrijving' | 'offerte'
  cursussen: CartItem[]
  klantgegevens: KlantGegevens
  totaalprijs: number
  email_verzonden: boolean
  status: 'nieuw' | 'verwerkt' | 'geannuleerd'
  created_at: string
}

export interface KlantGegevens {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  bedrijfsnaam?: string
  adres: string
  postcode: string
  stad: string
  opmerkingen?: string
  // Extra velden voor offerte
  aantal_deelnemers?: number
  gewenste_periode?: string
  locatie_voorkeur?: string
}

export interface Testimonial {
  id: string
  naam: string
  bedrijf: string
  tekst: string
  rating: number
  actief: boolean
}

export interface SiteSetting {
  id: string
  value: Record<string, unknown>
}

export interface ContactFormData {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  onderwerp: string
  bericht: string
}
