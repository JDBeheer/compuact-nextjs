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
  updated_at?: string
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
  prijzen?: {
    klassikaal?: number
    online?: number
    thuisstudie?: number
    incompany?: number
  }
  lesmethodes?: string[]
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
  lesdagen: string[]
  training_id?: string
  actief: boolean
  cursus?: Cursus
  locatie?: Locatie
}

export interface Deelnemer {
  voornaam: string
  achternaam: string
  email: string
}

export interface CartItem {
  sessieId: string
  cursusTitel: string
  locatie: string
  datum: string
  prijs: number
  lesmethode: string
  aantalDeelnemers: number
  lesdagen?: string[]
}

export interface CartItemCheckout extends CartItem {
  deelnemers: Deelnemer[]
}

export interface Inschrijving {
  id: string
  type: 'inschrijving' | 'offerte' | 'incompany' | 'studiegids'
  cursussen: CartItemCheckout[]
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
  gewenste_periode?: string
  locatie_voorkeur?: string
}

export interface InCompanyAanvraag {
  cursusIds: string[]
  cursusTitels: string[]
  klantgegevens: KlantGegevens
  aantalDeelnemers: number
  gewenstePeriode: string
  locatieVoorkeur: string
  opmerkingen: string
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
