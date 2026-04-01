import { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Veelgestelde vragen',
  description: 'Antwoorden op de meest gestelde vragen over onze trainingen, inschrijvingen en lesmethodes.',
}

const faqs = [
  {
    categorie: 'Inschrijven',
    vragen: [
      {
        vraag: 'Hoe schrijf ik me in voor een cursus?',
        antwoord: 'Ga naar de cursuspagina, kies een datum en locatie, en voeg de cursus toe aan je winkelwagen. Vervolgens doorloop je het inschrijfformulier met je gegevens.',
      },
      {
        vraag: 'Kan ik mijn inschrijving annuleren?',
        antwoord: 'Ja, kosteloos annuleren kan tot 14 dagen voor aanvang van de cursus. Bij annulering binnen 14 dagen wordt 50% van het cursusgeld in rekening gebracht.',
      },
      {
        vraag: 'Krijg ik een bevestiging na inschrijving?',
        antwoord: 'Ja, je ontvangt direct een bevestigingsmail met alle details van je inschrijving. Enkele dagen voor de cursus ontvang je een herinnering met praktische informatie.',
      },
    ],
  },
  {
    categorie: 'Cursussen',
    vragen: [
      {
        vraag: 'Welke niveaus bieden jullie aan?',
        antwoord: 'Wij bieden cursussen aan op drie niveaus: Beginner, Gevorderd en Expert. Op elke cursuspagina staat aangegeven welk niveau de cursus heeft en welke voorkennis wordt verwacht.',
      },
      {
        vraag: 'Ontvang ik een certificaat?',
        antwoord: 'Ja, na afloop van elke cursus ontvang je een officieel certificaat van deelname van Compu Act Opleidingen.',
      },
      {
        vraag: 'Is lesmateriaal inbegrepen?',
        antwoord: 'Ja, alle cursussen zijn inclusief lesmateriaal. Je ontvangt een digitaal cursusboek dat je ook na de training kunt raadplegen.',
      },
    ],
  },
  {
    categorie: 'Lesmethodes',
    vragen: [
      {
        vraag: 'Wat is het verschil tussen klassikaal en live online?',
        antwoord: 'Bij klassikaal kom je naar een van onze trainingslocaties. Bij live online volg je dezelfde training vanuit huis of kantoor via een videverbinding. De inhoud en interactie zijn identiek.',
      },
      {
        vraag: 'Hoe werkt InCompany training?',
        antwoord: 'Bij InCompany komen wij naar uw locatie. De training wordt afgestemd op de wensen van uw organisatie. Neem contact met ons op voor een offerte op maat.',
      },
      {
        vraag: 'Hoeveel deelnemers zitten er in een groep?',
        antwoord: 'Wij werken met kleine groepen van maximaal 8 deelnemers. Zo is er voldoende ruimte voor persoonlijke aandacht en interactie met de docent.',
      },
    ],
  },
  {
    categorie: 'Betaling',
    vragen: [
      {
        vraag: 'Hoe kan ik betalen?',
        antwoord: 'Je ontvangt na inschrijving een factuur die je per bankoverschrijving kunt voldoen. De factuur dient voor aanvang van de cursus te zijn betaald.',
      },
      {
        vraag: 'Zijn de prijzen inclusief BTW?',
        antwoord: 'Nee, alle genoemde prijzen zijn exclusief 21% BTW en €15 administratiekosten.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-white border-b border-zinc-200">
        <div className="container-narrow py-8">
          <nav className="text-sm text-zinc-500 mb-4">
            <a href="/" className="hover:text-primary-600">Home</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">Veelgestelde vragen</span>
          </nav>
          <h1 className="text-3xl font-bold">Veelgestelde vragen</h1>
          <p className="text-zinc-600 mt-2">Vind snel antwoord op de meest gestelde vragen.</p>
        </div>
      </div>

      <div className="container-narrow py-8 space-y-8">
        {faqs.map((categorie) => (
          <div key={categorie.categorie}>
            <h2 className="text-xl font-bold mb-4">{categorie.categorie}</h2>
            <div className="space-y-3">
              {categorie.vragen.map((faq) => (
                <details
                  key={faq.vraag}
                  className="bg-white rounded-xl border border-zinc-200 group"
                >
                  <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between font-medium hover:bg-zinc-50 rounded-xl">
                    {faq.vraag}
                    <ChevronDown size={18} className="text-zinc-400 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                  </summary>
                  <div className="px-6 pb-4 text-zinc-600 leading-relaxed">
                    {faq.antwoord}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-primary-50 border border-primary-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Staat je vraag er niet bij?</h2>
          <p className="text-zinc-600 mb-4">Neem gerust contact met ons op. We helpen je graag verder.</p>
          <a
            href="/contact"
            className="inline-flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Neem contact op
          </a>
        </div>
      </div>
    </div>
  )
}
