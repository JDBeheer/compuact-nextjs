# Rapportage Website Migratie — Compu Act Opleidingen
### WordPress → Next.js | Datum: 20 april 2026
### Opgesteld door: Jacht Digital

---

## Samenvatting

De nieuwe website van Compu Act Opleidingen is op **13 april 2026** live gegaan. De migratie van WordPress/WooCommerce naar Next.js verloopt volgens verwachting. Google is actief bezig met het indexeren van de nieuwe pagina's en de eerste positieve ranking-signalen zijn zichtbaar.

---

## Indexering (Google Search Console)

| Metric | Voor migratie (13 apr) | Na migratie (20 apr) | Verschil |
|--------|----------------------|---------------------|----------|
| **Geïndexeerde pagina's** | 414 | **1.241** | **+200%** |
| **Sitemap URL's ontdekt** | — | **2.268** | Nieuw |
| **Dagelijkse clicks (gem.)** | 8,9 | **13,2** | **+48%** |
| **Dagelijkse impressions (gem.)** | 1.193 | **1.471** | **+23%** |
| **Piek CTR** | 1,29% | **1,54%** | Hoger |

**Toelichting:** Het aantal geïndexeerde pagina's is in één week verdrievoudigd. Google heeft de sitemap verwerkt en indexeert actief de 2.268 nieuwe pagina's. De eerste nieuwe URL's verschijnen al in de zoekresultaten.

---

## Rankings (Ahrefs)

### Stijgers sinds migratie

| Keyword | Zoekvolume | Positie voor | Positie nu | Stijging |
|---------|-----------|-------------|-----------|---------|
| cursus outlook voor secretaresses | 40 | 11 | **1** | **+10** |
| cursus word voor gevorderden | 30 | 9 | **2** | **+7** |
| cursus word gevorderden | 20 | 3 | **1** | **+2** |
| excel cursus basis | 30 | 4 | **2** | **+2** |
| cursus word en excel online | 30 | 9 | **8** | **+1** |
| word voor beginners | 10 | 9 | **8** | **+1** |

### Stabiele #1 posities (behouden)

| Keyword | Zoekvolume | Positie |
|---------|-----------|---------|
| cursus excel basis | 100 | **1** |
| excel basis cursus | 90 | **1** |
| basiscursus excel | 60 | **1** |
| cursus microsoft office 365 | 150 | **1** |
| compu act opleidingen | 50 | **1** |

### Stabiele top 10 posities

| Keyword | Zoekvolume | Positie |
|---------|-----------|---------|
| excel training | 500 | **4** |
| cursus excel gevorderden | 200 | **4** |
| word cursus | 100 | **6** |
| microsoft office cursus | 200 | **6** |
| cursus word voor beginners | 90 | **10** |

### Nieuwe ranking op nieuwe URL

| Keyword | Positie | URL |
|---------|---------|-----|
| cursus office 365 online | 9 | `/cursussen/office-365-voor-eindgebruikers` |

Dit is het eerste bewijs dat Google de nieuwe URL-structuur begint te ranken.

---

## Wat is er verbeterd t.o.v. de oude website?

### Performance
- **PageSpeed score**: van ~50-60 (WordPress) naar **79-98** (Next.js)
- **LCP (Largest Contentful Paint)**: van 4+ seconden naar **1,1 seconden**
- **Laadtijd**: significant sneller door server-side rendering en optimalisatie

### SEO Technisch
- **Dynamische sitemap**: 2.268 pagina's automatisch gegenereerd
- **Schema.org structured data**: Organization, Course, FAQ markup
- **Geoptimaliseerde meta titels**: alle 28 cursussen scoren "uitstekend"
- **OpenGraph images**: dynamisch per cursus en categorie
- **robots.txt**: correct geconfigureerd
- **301 redirects**: 50+ pattern redirects + database-gestuurde redirects

### Interne linkstructuur
- **2.200+ local SEO pagina's** linken nu naar categoriepagina's
- **Cross-links** tussen categorieën en steden
- **Contextual links** in content naar belangrijke pagina's

### Beveiliging
- **Security headers**: CSP, HSTS, X-Frame-Options, COOP
- **Cloudflare Turnstile**: botbescherming op alle formulieren
- **2FA verplicht**: voor alle CMS-gebruikers
- **RLS policies**: database-niveau beveiliging

---

## Tijdelijke effecten (verwacht bij migratie)

| Keyword | Zoekvolume | Was | Nu | Verwachting |
|---------|-----------|-----|-----|------------|
| excel cursus beginners | 150 | 1 | 8 | Terug naar top 3 in 2-4 weken |
| cursus word | 200 | 1 | 6 | Terug naar top 3 in 2-4 weken |
| excel cursus | 1.000 | 13 | 17 | Verbetering verwacht na indexering |
| power bi cursus | 900 | 27 | 36 | Herstel na redirect-verwerking |

**Toelichting:** Deze dalingen zijn standaard bij een domeinmigratie. Google moet de 301 redirects verwerken en de rankingkracht overdragen naar de nieuwe URL's. Dit duurt gemiddeld 2-4 weken.

---

## Waar we op wachten

### 1. Volledige URL-overname door Google (2-4 weken)
Google toont nog 27 oude WordPress URL's in de index. Zodra deze worden vervangen door de nieuwe URL's, verwachten we dat de rankings herstellen en verbeteren.

### 2. Verwerking interne links (2-3 weken)
De 2.200+ interne links naar categoriepagina's zijn net gedeployed. Google moet deze nog crawlen. Dit zal de authority van pagina's zoals `/cursussen/excel` significant versterken.

### 3. Core Web Vitals update (4 weken)
De CWV data in Search Console werkt met een 28-daags rolling gemiddelde. De verbeterde LCP (van 4s naar 1,1s) zal over ~4 weken volledig zichtbaar zijn en een positief ranking-signaal geven.

### 4. "Excel cursus" naar top 10 (4-8 weken)
Dit keyword heeft 1.000 maandelijkse zoekopdrachten en staat nu op positie 17. Met de verbeterde content, FAQ-sectie (klaar op staging), en interne links verwachten we een stijging naar de top 10.

---

## Volgende stappen

| Actie | Status | Verwacht effect |
|-------|--------|----------------|
| FAQ + vergelijkingstabel op categoriepagina's | Klaar op staging | Google PAA rich results + betere rankings |
| Core Web Vitals optimalisatie | Gedeployed | Betere mobile ranking signalen |
| Broken backlinks gefixed | ✅ Afgerond | Behoud linkjuice |
| Query string URL's opgeschoond | ✅ Gedeployed | Schonere index |
| IndexNow ping naar Bing/Yandex | ✅ Beschikbaar | Snellere indexering bij Bing |
| Google Ads Enhanced Conversions | ✅ Actief | Betere conversie-attributie |
| Studiegids follow-up e-mails | ✅ Gebouwd | Meer conversies uit leads |

---

## Conclusie

De migratie verloopt succesvol. De technische basis is significant verbeterd (performance, SEO, beveiliging) en de eerste positieve ranking-signalen zijn zichtbaar. De komende 2-4 weken verwachten we dat de tijdelijke dalingen herstellen en de verbeteringen effect gaan hebben op de organische zoekresultaten.

---

*Rapport opgesteld door Jacht Digital — 20 april 2026*
