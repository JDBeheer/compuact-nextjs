import { Metadata } from 'next'
import { FileText, Phone, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden',
  description: 'Algemene voorwaarden van Compu Act Opleidingen. Lees onze voorwaarden met betrekking tot aanmelding, annulering, betaling en meer.',
}

const voorwaarden = [
  {
    nummer: 1,
    titel: 'Aanmelding',
    tekst: 'Aanmelding kan geschieden door gebruikmaking van het ondertekende aanmeldingsformulier van CompuAct Opleidingen, door middel van een ondertekende offerte of een aanmelding via www.computertraining.nl. U verklaart dat u bekend bent en akkoord gaat met alle cursusgegevens en voorwaarden van ons instituut. U verbindt zich voor de gehele cursus(sen) en u verplicht zich tot het betalen van het gehele cursusgeld.',
  },
  {
    nummer: 2,
    titel: 'Annulering door CompuAct Opleidingen',
    tekst: 'Compu Act Opleidingen behoudt zich het recht voor om bij onvoldoende deelname (bij klassikale cursussen: minimaal 3, maximaal 8 cursisten), ziekte van de docent of ingeval van andere onvoorziene omstandigheden de cursus te annuleren of te verschuiven naar een andere datum. Bij volledige annulering vanuit Compu Act Opleidingen vervalt de betalingsplicht en ontvangt u binnen 2 weken het cursusgeld retour.',
  },
  {
    nummer: 3,
    titel: 'Annulering door de cursist',
    tekst: 'Annulering van de aanvraag 2 weken voor aanvang van de cursus is kosteloos. Opzegging van een cursus dient altijd schriftelijk te geschieden.',
    punten: [
      'Bij annulering tussen 1 en 2 weken voor aanvang zal 50% van de cursusprijs in rekening worden gebracht.',
      'Bij annulering van de aanvraag binnen een week voor aanvang wordt 75% van de cursusprijs in rekening gebracht.',
      'Bij verhindering van de totale cursus is het toegestaan een vervanger te sturen.',
      'Bij het niet verschijnen op een cursus zijn volledige cursuskosten verschuldigd.',
      'Bij het tussentijds annuleren van een meerdaagse cursus wordt het hele cursusbedrag in rekening gebracht.',
      'Teveel betaalde bedragen worden binnen 2 weken gerestitueerd.',
    ],
  },
  {
    nummer: 4,
    titel: 'Cursusgeld',
    tekst: 'Het cursusgeld moet voor de eerste les in zijn geheel zijn voldaan. Bij bedrijven geldt dat het cursusgeld uiterlijk 14 dagen na dagtekening van de factuur betaald moet zijn, behalve wanneer een andere termijn op de factuur staat aangegeven. Bij betaling à contant vervallen de inschrijf/administratie kosten.',
  },
  {
    nummer: 5,
    titel: 'Cursusduur',
    tekst: 'Na boeking van een cursus dient de cursist binnen drie maanden met de opleiding te starten en deze maximaal zes maanden na boeking af te ronden.',
  },
  {
    nummer: 6,
    titel: 'Cursustijd',
    tekst: 'Het uitgangspunt van de cursusduur voor elke opleiding is de standaardduur. Bij elke flexibele cursus is de cursist gerechtigd de bijbehorende aanvullende cursusblokken te volgen. Mocht een cursist behoefte hebben aan meer cursusblokken voor dezelfde cursus, dan berekent CompuAct Opleidingen € 30,00 per cursusblok extra. Zodoende kan elke cursist in eigen tempo de cursusstof doorlopen. De hoeveelheid uren per week is afhankelijk van de beschikbare uren van Compu Act Opleidingen.',
  },
  {
    nummer: 7,
    titel: 'Wanbetaling',
    tekst: 'Bij wanbetaling worden alle kosten die door CompuAct Opleidingen moeten worden gemaakt om het verschuldigde cursusgeld te innen, verhaald op de nalatige cursist of opdrachtgever.',
  },
  {
    nummer: 8,
    titel: 'Wangedrag',
    tekst: 'De directie is gerechtigd om bij wangedrag de deelnemer te verwijderen, zonder restitutie van het cursusgeld. Onder wangedrag wordt onder meer verstaan het niet nakomen van de cursusafspraken (zonder telefonische afzegging), het volgen van de lessen onder invloed van alcoholische en verdovende middelen en het hinderen van medecursisten in het volgen van hun opleiding.',
  },
  {
    nummer: 9,
    titel: 'Aansprakelijkheid',
    tekst: 'CompuAct Opleidingen stelt zich niet aansprakelijk voor tijdens of na de cursus uren zoekgeraakte eigendommen. CompuAct Opleidingen is niet aansprakelijk voor het openbaar worden van gegevens van Cliënt of misbruik van gegevens van Cliënt, die Cliënt of medewerkers van Cliënt op de computers van Compu Act Opleidingen hebben achtergelaten.',
    extra: 'CompuAct Opleidingen is jegens de opdrachtgever uitsluitend aansprakelijk voor schade die het rechtstreekse gevolg is van een toerekenbare tekortkoming in de uitvoering van de opdracht. De aansprakelijkheid is beperkt tot het bedrag van het voor de uitvoering van de opdracht in rekening gebrachte honorarium. Indien de opdracht een duurovereenkomst is met een looptijd van meer dan een jaar wordt het hiervoor bedoelde bedrag gesteld op drie maal het bedrag van het honorarium dat in de twaalf maanden voorafgaand aan het ontstaan van de schade in rekening is gebracht aan de opdrachtgever. De in dit artikel opgenomen beperkingen van aansprakelijkheid zijn niet van toepassing voor zover er sprake is van opzet of bewuste roekeloosheid van CompuAct Opleidingen.',
  },
  {
    nummer: 10,
    titel: 'Certificaten/Diploma\'s',
    tekst: 'CompuAct Opleidingen leidt cursisten op voor eigen certificaten / examens of anders vermeld bij specifieke cursussen. Dit certificaat wordt éénmalig digitaal aan de cursist verstrekt.',
  },
  {
    nummer: 11,
    titel: 'Uw gegevens',
    tekst: 'Alle gegevens over de klant, alsmede gegevens die tijdens de cursus worden behandeld, zijn vertrouwelijk en worden als zodanig behandeld door CompuAct Opleidingen en haar docenten.',
  },
  {
    nummer: 12,
    titel: 'Copyright',
    tekst: 'Het lesmateriaal wordt aan de cursist meegegeven uitsluitend voor persoonlijk gebruik en mag niet door de cursist of door derden worden verveelvoudigd d.m.v. druk, fotokopie of op enige andere wijze. Bij overtreding wordt bedrijfsschade verhaald op de cursist. Dit geldt ook voor de meegeleverde bestanden.',
  },
  {
    nummer: 13,
    titel: 'Inschrijving',
    tekst: 'U dient zich 2 weken voor aanvang van een cursus in te schrijven.',
  },
  {
    nummer: 14,
    titel: 'Bedenktijd',
    tekst: 'U heeft 14 werkdagen bedenktijd na inschrijving voor een cursus.',
  },
  {
    nummer: 15,
    titel: 'Klachtenprocedure',
    tekst: 'Klachten dienen schriftelijk te worden gestuurd naar ons hoofdkantoor in Zaandam t.a.v. de directie (de heer Mathieu Bruens). Het is daarbij belangrijk dat u uw klacht zo duidelijk mogelijk omschrijft en dat u uw contactgegevens erbij vermeldt.',
    extra: 'U krijgt binnen twee weken schriftelijke bevestiging van ontvangst van u klacht. Wij streven ernaar om uw klacht direct af te handelen, maar uw klacht wordt in principe binnen vier weken afgehandeld. Als dit langer lijkt te gaan duren, wordt u daarvan op de hoogte gesteld en laten wij u weten wanneer wij verwachten dat de klacht zal worden afgehandeld. Uw klacht wordt vertrouwelijk behandeld. Wij nemen uw klacht serieus en zien deze als feedback waarmee we onze werkwijze nog beter op onze klanten kunnen afstemmen. Klachten en de wijze van afhandeling worden geregistreerd en voor de duur van 2 jaar bewaard.',
  },
]

export default function AlgemeneVoorwaardenPage() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container-narrow py-10">
          <nav className="text-sm text-zinc-400 mb-4">
            <a href="/" className="hover:text-primary-500">Home</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-700">Algemene voorwaarden</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 p-2.5 rounded-xl">
              <FileText size={24} className="text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Algemene Voorwaarden</h1>
              <p className="text-zinc-500 mt-1">Compu Act Opleidingen</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-narrow py-10">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Inhoudsopgave sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Inhoudsopgave</h2>
              <nav className="space-y-0.5">
                {voorwaarden.map((v) => (
                  <a
                    key={v.nummer}
                    href={`#artikel-${v.nummer}`}
                    className="block text-sm text-zinc-500 hover:text-primary-500 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {v.nummer}. {v.titel}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Intro */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <p className="text-zinc-600 leading-relaxed">
                Op alle diensten van Compu Act Opleidingen zijn de onderstaande algemene voorwaarden van toepassing. Door u in te schrijven voor een cursus gaat u akkoord met deze voorwaarden. Wij raden u aan deze voorwaarden zorgvuldig door te lezen.
              </p>
            </div>

            {/* Artikelen */}
            {voorwaarden.map((v) => (
              <div key={v.nummer} id={`artikel-${v.nummer}`} className="scroll-mt-24">
                <div className="bg-white rounded-xl border border-zinc-200 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {v.nummer}
                    </span>
                    <h2 className="text-lg font-bold text-zinc-900 pt-0.5">{v.titel}</h2>
                  </div>
                  <div className="ml-10 space-y-3">
                    <p className="text-zinc-600 leading-relaxed text-[15px]">{v.tekst}</p>
                    {v.punten && (
                      <ul className="space-y-2">
                        {v.punten.map((punt, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-600 text-[15px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                            {punt}
                          </li>
                        ))}
                      </ul>
                    )}
                    {v.extra && (
                      <p className="text-zinc-600 leading-relaxed text-[15px]">{v.extra}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Contact */}
            <div className="bg-primary-50 rounded-xl border border-primary-100 p-6">
              <h3 className="font-bold text-lg mb-3">Vragen over onze voorwaarden?</h3>
              <p className="text-zinc-600 text-sm mb-4">Neem gerust contact met ons op als u vragen heeft over onze algemene voorwaarden.</p>
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
