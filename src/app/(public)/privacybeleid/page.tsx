import { Metadata } from 'next'
import { Shield, Phone, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Privacybeleid van Compu Act Opleidingen. Lees hoe wij omgaan met uw persoonsgegevens.',
}

const secties = [
  {
    titel: 'Wie zijn wij?',
    tekst: 'Compu Act Opleidingen is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid. Onze gegevens:',
    extra: [
      'Compu Act Opleidingen',
      'Vincent van Goghweg 85, 1506 JB Zaandam',
      'Telefoon: 023-551 3409',
      'E-mail: info@computertraining.nl',
      'KvK-nummer: [KvK-nummer]',
    ],
  },
  {
    titel: 'Welke persoonsgegevens verwerken wij?',
    tekst: 'Compu Act Opleidingen verwerkt persoonsgegevens doordat u gebruik maakt van onze diensten en/of omdat u deze gegevens zelf aan ons verstrekt. Hieronder een overzicht van de persoonsgegevens die wij verwerken:',
    punten: [
      'Voor- en achternaam',
      'E-mailadres',
      'Telefoonnummer',
      'Adresgegevens',
      'Bedrijfsnaam en functie',
      'Gegevens over uw cursusdeelname',
      'Bankrekeningnummer (voor facturatie)',
      'IP-adres en browsergegevens (via cookies)',
    ],
  },
  {
    titel: 'Waarom verwerken wij persoonsgegevens?',
    tekst: 'Compu Act Opleidingen verwerkt uw persoonsgegevens voor de volgende doeleinden:',
    punten: [
      'Het afhandelen van uw inschrijving voor een cursus',
      'Het versturen van bevestigingsmails en cursusinformatie',
      'Het opstellen en verzenden van facturen',
      'Het kunnen bellen of e-mailen indien nodig voor onze dienstverlening',
      'Het informeren over wijzigingen in cursussen of diensten',
      'Het versturen van onze nieuwsbrief of studiegids (alleen met uw toestemming)',
      'Het verbeteren van onze website en dienstverlening',
      'Het voldoen aan wettelijke verplichtingen',
    ],
  },
  {
    titel: 'Bewaartermijn',
    tekst: 'Compu Act Opleidingen bewaart uw persoonsgegevens niet langer dan strikt noodzakelijk is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Wij hanteren de volgende bewaartermijnen:',
    punten: [
      'Cursistgegevens: 2 jaar na laatste cursusdeelname',
      'Facturatiegegevens: 7 jaar (wettelijke bewaarplicht)',
      'Sollicitatiegegevens: 4 weken na afloop procedure (tenzij toestemming voor langer)',
      'Websitegegevens (cookies): maximaal 12 maanden',
    ],
  },
  {
    titel: 'Delen met derden',
    tekst: 'Compu Act Opleidingen verstrekt uw gegevens uitsluitend aan derden indien dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting. Met bedrijven die uw gegevens verwerken in onze opdracht sluiten wij een verwerkersovereenkomst om te zorgen voor eenzelfde niveau van beveiliging en vertrouwelijkheid van uw gegevens.',
  },
  {
    titel: 'Cookies',
    tekst: 'Compu Act Opleidingen gebruikt functionele, analytische en tracking cookies. Een cookie is een klein tekstbestand dat bij het eerste bezoek aan deze website wordt opgeslagen in de browser van uw computer, tablet of smartphone.',
    punten: [
      'Functionele cookies: noodzakelijk voor het functioneren van de website (bijv. winkelwagen)',
      'Analytische cookies: om het gebruik van de website te meten en te verbeteren (Google Analytics)',
      'Marketing cookies: om advertenties af te stemmen op uw interesses (Google Ads)',
    ],
    extra: ['U kunt zich afmelden voor cookies door uw internetbrowser zo in te stellen dat deze geen cookies meer opslaat. Daarnaast kunt u ook alle informatie die eerder is opgeslagen via de instellingen van uw browser verwijderen.'],
  },
  {
    titel: 'Gegevens inzien, aanpassen of verwijderen',
    tekst: 'U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens. U kunt een verzoek tot inzage, correctie, verwijdering of overdracht van uw persoonsgegevens sturen naar info@computertraining.nl. Om er zeker van te zijn dat het verzoek door u is gedaan, vragen wij u een kopie van uw identiteitsbewijs bij het verzoek mee te sturen. We reageren zo snel mogelijk, maar uiterlijk binnen vier weken, op uw verzoek.',
  },
  {
    titel: 'Beveiliging',
    tekst: 'Compu Act Opleidingen neemt de bescherming van uw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan. Als u het idee heeft dat uw gegevens toch niet goed beveiligd zijn of er aanwijzingen zijn van misbruik, neem dan contact met ons op via info@computertraining.nl.',
  },
  {
    titel: 'Klachten',
    tekst: 'Mocht u een klacht hebben over de verwerking van uw persoonsgegevens, dan vragen wij u hierover direct contact met ons op te nemen. U heeft altijd het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens, de toezichthoudende autoriteit op het gebied van privacybescherming.',
  },
  {
    titel: 'Wijzigingen',
    tekst: 'Compu Act Opleidingen behoudt zich het recht voor om wijzigingen aan te brengen in dit privacybeleid. Het is aan te raden om dit privacybeleid regelmatig te raadplegen, zodat u van deze wijzigingen op de hoogte bent. Dit privacybeleid is voor het laatst aangepast op 1 april 2026.',
  },
]

export default function PrivacybeleidPage() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container-narrow py-10">
          <nav className="text-sm text-zinc-400 mb-4">
            <a href="/" className="hover:text-primary-500">Home</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-700">Privacybeleid</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 p-2.5 rounded-xl">
              <Shield size={24} className="text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Privacybeleid</h1>
              <p className="text-zinc-500 mt-1">Compu Act Opleidingen</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-narrow py-10">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Inhoudsopgave */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Inhoudsopgave</h2>
              <nav className="space-y-0.5">
                {secties.map((s, i) => (
                  <a
                    key={i}
                    href={`#sectie-${i}`}
                    className="block text-sm text-zinc-500 hover:text-primary-500 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {s.titel}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <p className="text-zinc-600 leading-relaxed">
                Compu Act Opleidingen respecteert de privacy van alle gebruikers van haar website en draagt er zorg voor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld. Dit privacybeleid is van toepassing op alle diensten van Compu Act Opleidingen.
              </p>
            </div>

            {secties.map((s, i) => (
              <div key={i} id={`sectie-${i}`} className="scroll-mt-24">
                <div className="bg-white rounded-xl border border-zinc-200 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <h2 className="text-lg font-bold text-zinc-900 pt-0.5">{s.titel}</h2>
                  </div>
                  <div className="ml-10 space-y-3">
                    <p className="text-zinc-600 leading-relaxed text-[15px]">{s.tekst}</p>
                    {s.punten && (
                      <ul className="space-y-2">
                        {s.punten.map((punt, j) => (
                          <li key={j} className="flex items-start gap-2 text-zinc-600 text-[15px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                            {punt}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.extra && (
                      <div className="space-y-1">
                        {s.extra.map((e, j) => (
                          <p key={j} className="text-zinc-600 text-[15px]">{e}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Contact */}
            <div className="bg-primary-50 rounded-xl border border-primary-100 p-6">
              <h3 className="font-bold text-lg mb-3">Vragen over uw privacy?</h3>
              <p className="text-zinc-600 text-sm mb-4">Neem gerust contact met ons op als u vragen heeft over dit privacybeleid of over de verwerking van uw persoonsgegevens.</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="tel:0235513409" className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
                  <Phone size={15} /> 023-551 3409
                </a>
                <a href="mailto:info@computertraining.nl" className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
                  <Mail size={15} /> info@computertraining.nl
                </a>
                <span className="flex items-center gap-2 text-zinc-500">
                  <MapPin size={15} /> Vincent van Goghweg 85, Zaandam
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
