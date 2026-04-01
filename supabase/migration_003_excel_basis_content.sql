-- Migration 003: Excel Basis - echte content vanuit WordPress
-- Update de Excel Basis cursus met de volledige productiecontent

UPDATE cursussen
SET
  titel = 'Excel Basis',
  korte_beschrijving = 'Praktijkgerichte training om Excel stap voor stap te leren gebruiken. Leer de fundamenten van spreadsheets, formules, grafieken en meer.',
  beschrijving = 'Ben je nieuw in de wereld van Excel of wil je je basisvaardigheden opfrissen? Dan is onze cursus Excel Basis perfect voor jou! In deze cursus leer je de fundamenten van Excel, zoals het werken met cellen, rijen en kolommen, het invoeren en bewerken van gegevens, en het opmaken van werkbladen. Je ontdekt hoe je eenvoudige formules en functies kunt gebruiken om berekeningen uit te voeren en hoe je basisgrafieken kunt maken om je gegevens op een visuele manier te presenteren. Daarnaast leer je handige tips en trucs om je werkzaamheden in Excel efficiënter en effectiever te maken.

Je zult merken dat je veel zelfverzekerder en efficiënter kunt werken met Excel, waardoor je tijd bespaart en betere resultaten behaalt in je dagelijkse werkzaamheden. Je leert essentiële technieken die je helpen om je werkzaamheden in Excel te stroomlijnen en je productiviteit te verhogen. Het beheersen van Excel op basisniveau is een waardevolle vaardigheid op de arbeidsmarkt, waardoor je aantrekkelijker wordt voor toekomstige werkgevers.',
  prijs_vanaf = 275.00,
  duur = '1 dag',
  niveau = 'beginner',
  inhoud = '{
    "wat_leer_je": [
      "Navigeren en werken met werkbladen",
      "Gegevens invoeren, wijzigen en up-to-date houden",
      "Cellen selecteren, ook niet-aaneengesloten bereiken",
      "Opmaak van tekst, cellen en randen aanpassen",
      "Reeksen maken en data kopiëren met de vulgreep",
      "Tabelopmaak toepassen en aanpassen",
      "Formules en berekeningen maken",
      "Absolute en relatieve celverwijzingen gebruiken",
      "Kop- en voetteksten toevoegen en werkbladen afdrukken",
      "Gegevens sorteren op één of meerdere kolommen",
      "Data koppelen uit andere werkbladen of bestanden",
      "Grafieken maken om gegevens visueel weer te geven",
      "Werkbladen beveiligen tegen onbevoegde toegang"
    ],
    "programma": [
      "Wat is een werkblad: navigeren en werkbladen gebruiken voor verschillende doeleinden",
      "Gegevens invoeren en wijzigen: data in cellen invoeren en bewerken zodat je informatie altijd up-to-date is",
      "Selecteren van cellen: cellen selecteren, ook niet-aaneengesloten bereiken, handig bij kopiëren en verplaatsen",
      "Opmaak en instellingen: opmaak van tekst, cellen en randen aanpassen voor professionele en overzichtelijke werkbladen",
      "Reeksen maken en kopiëren: reeksen maken en data kopiëren met de vulgreep, bespaart tijd bij herhalende gegevens",
      "Tabelopmaak toepassen en aanpassen: gegevens overzichtelijk en gestructureerd weergeven met tabelopmaak",
      "Formules en berekeningen maken: formules gebruiken voor berekeningen, handig voor financiën en data-analyse",
      "Absolute en relatieve celverwijzing: het verschil leren en correct toepassen in formules",
      "Kop- en voetteksten toevoegen en afdrukken: werkbladen voorzien van kop- en voetteksten en afdrukken",
      "Sorteren van gegevens: gegevens in één of meerdere kolommen sorteren om informatie snel te vinden",
      "Koppelen van data: data koppelen uit andere werkbladen of bestanden om informatie te combineren",
      "Grafieken maken: gegevens visueel weergeven in grafieken voor analyse en presentatie",
      "Beveiligen van werkbladen: werkbladen beveiligen zodat onbevoegden geen toegang hebben tot gevoelige gegevens"
    ],
    "doelgroep": "De basiscursus Excel is er voor iedereen. Of je nu nieuw bent met Excel en graag wilt leren hoe je het kunt gebruiken voor werk of gewoon voor jezelf, of je bent een student die een boost wil geven aan je data skills — deze cursus is perfect voor jou. Ook als je al werkt en beter wilt worden in Excel om je dagelijkse taken makkelijker te maken (administratie, financiën, projectmanagement of marketing), dan is deze cursus helemaal jouw ding. Zelfs ondernemers en kleine bedrijfseigenaren die hun bedrijfsdata beter willen bijhouden en analyseren, of mensen die hun CV willen versterken met extra Excel-vaardigheden, hebben veel baat bij deze cursus.",
    "voorkennis": "Geen ervaring met Excel nodig — de basiscursus is juist bedoeld voor beginners. Het helpt als je al een beetje weet hoe een computer en Microsoft Office werken, maar dat is niet verplicht. Tijdens de cursus leer je stap voor stap hoe je met werkbladen werkt, data invoert en aanpast, formules en functies gebruikt, en eenvoudige analyses en grafieken maakt.",
    "lesmateriaal": "All-in cursusprijs, inclusief laptop, lesmateriaal en certificaat van deelname na afronding. Je hoeft niets mee te nemen, alles is geregeld.",
    "certificaat": "Na succesvolle afronding ontvang je een officieel certificaat van deelname.",
    "incompany_tekst": "Wil je de Excel Basis cursus op maat voor jouw team? Wij komen naar je locatie met een programma afgestemd op jouw organisatie. De InCompany training is vanaf €1.295 excl. BTW en is ideaal vanaf 4 deelnemers. Je kiest zelf de datum, locatie en lestijden."
  }'::jsonb
WHERE slug = 'excel-basis';
