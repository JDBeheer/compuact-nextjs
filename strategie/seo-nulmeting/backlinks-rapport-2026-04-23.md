# Backlink-analyse & DR-herstelplan — 23 april 2026

> Bronnen: Ahrefs Site Explorer (mode=subdomains), DataForSEO Backlinks (deels toegankelijk), live URL-tests.

## TL;DR

De **Domain Rating is tussen september en november 2025 gecrasht van 30 → 11** (we staan nu op 10). Dit ligt niet aan de Next.js migratie van april 2026 — de crash was zes maanden eerder. Oorzaak is ~zeker een **herwaardering door Ahrefs van een grote bundel oude link-farm / PBN-achtige backlinks** uit 2019-2020.

Het linkprofiel bevat duidelijke spam-signalen: letterlijk `buybacklinks.agency` als refdomain, sitewide footer-links met exact-match anchor "Office cursus Studerend Nederland" (2.184 links), en `is_spam: true` flags op verschillende branded anchors. Daarnaast zijn er kleine-maar-waardevolle backlinks die naar 404's wijzen (bv. `/locaties/waddinxveen` — 35 refdomains linken met deze anchor maar de pagina bestaat niet).

**Prognose:** DR-herstel 10 → 20 in ~12 maanden is haalbaar met gerichte campagne + disavow + broken-link reparatie. Snelheid laag omdat nieuwe kwaliteit-links opbouwen traag gaat.

---

## 1. Domain Rating historie

```
2024  apr → aug     DR 34  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
2024  sep → okt     DR 34  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
2024  nov → dec     DR 33  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
2025  jan → mrt     DR 33  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
2025  apr           DR 34  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
2025  mei           DR 33  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
2025  jun → aug     DR 32  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
2025  sep           DR 30  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      ← wankel
2025  OKT           DR 15  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                    ← CRASH
2025  NOV           DR 11  ▓▓▓▓▓▓▓▓▓▓▓                       ← CRASH
2025  dec           DR 11  ▓▓▓▓▓▓▓▓▓▓▓
2026  jan → feb     DR 11  ▓▓▓▓▓▓▓▓▓▓▓
2026  mrt → apr     DR 10  ▓▓▓▓▓▓▓▓▓▓
```

**Klap van -24 DR-punten in 2 maanden.** Dit type drop betekent meestal dat een belangrijk deel van het linkprofiel door Ahrefs's algoritme is geherclassificeerd (meestal: link-farms, PBN's, of sitewide footer-links die minder waarde krijgen). De timing (okt/nov 2025) valt samen met een **bekende Ahrefs DR-algoritme-update** die spam-netwerken strenger weegt.

## 2. Refdomains historie vs. DR

```
Mei 2024:   276 refdomains, DR 34
Dec 2025:   465 refdomains, DR 11  ← meer refdomains, lagere DR = kwaliteit daalt
Apr 2026:   386 refdomains, DR 10  ← 79 refdomains verloren in 4 mnd
```

De refdomains zijn blijven groeien terwijl DR daalde — dat is het smoking gun van een **gekocht/vervuild linkprofiel**. Echte organische links verhogen DR; vervuilde links verlagen hem zodra platforms hem corrigeren.

## 3. Linkprofiel — kwaliteit analyse

### 3a. Top refdomains: gemengd beeld

| Refdomain | DR | Links | is_spam | Waarde |
|---|---:|---:|---|---|
| blogspot.com | 95 | 34 | nee | UGC — 34 links is verdacht hoog |
| medium.com | 94 | **111** | nee | UGC — **duidelijk niet organisch** |
| weebly.com | 94 | 35 | nee | UGC website-builder |
| **pages.dev** | 93 | 3 | **JA** | Cloudflare Pages — spam |
| gumroad.com | 92 | **309** | nee | UGC — veel te veel links |
| hatenablog.com | 90 | **161** | nee | Japanse blog-platform UGC |
| **sa.com / za.com** | 90 | 2+8 | **JA** | Spam flagged |
| mystrikingly.com | 89 | **170** | nee | UGC site-builder |
| over-blog.com | 88 | **197** | nee | UGC Frans blog-platform |
| angelfire.com | 86 | **1617** | nee | **Legacy UGC — 1.617 links** |
| **itxoft.com** | 85 | 4 | **JA** | Spam |
| startpagina.nl | 82 | 47 | nee | **Waardevol NL** (first seen 2015) |
| **buybacklinks.agency** | 79 | 2 | **JA** | **Letterlijk "buy backlinks"** |
| **startkabel.nl** | 78 | 25 | **JA** | Spam flagged |

**Het patroon:** User-Generated-Content platforms (Angelfire, Medium, Gumroad, Hatenablog, Mystrikingly, Over-blog) met honderden links = klassieke PBN/spam-strategie: iemand heeft ~2019-2020 op tientallen UGC-platforms accounts aangemaakt en daar backlinks naar computertraining.nl geplaatst. Dit is wat Ahrefs nu correct markeert als onnatuurlijk.

### 3b. Anchor-tekst — exact-match spam

| Anchor | Refdomains | Links | Top DR | Spam? |
|---|---:|---:|---:|---|
| computertraining | 213 | 1.032 | 94 | **JA** |
| Office cursus Studerend Nederland | 174 | **2.184** | 35 | nee |
| computertraining.nl | 170 | 1.662 | 93 | nee |
| Klik hier voor meer informatie | 109 | 1.274 | 92 | nee |
| Compu Act Opleidingen | 47 | 315 | 76 | **JA** |
| Excel Cursus | 42 | 374 | 94 | **JA** |
| https://…/excel-cursus/ | 44 | 653 | 92 | **JA** |
| Den Bosch / Zaandam / Amsterdam / … | 35-38 | ~150-270 elk | 7 | nee |

**Waarneembaar:**
- **"Office cursus Studerend Nederland"** met 2.184 links vanaf 174 domeinen is een klassieke **sitewide footer-link** (iemand heeft dat als anchor in een footer gezet op een groot netwerk). Top DR is maar 35 — echt waardevol is dit niet.
- **"Excel Cursus"** als exact-match anchor van 42 refdomains, **met spam-flag** = dit trekt de ranking op "cursus excel" kunstmatig omhoog en kan juist een negatieve ranking-impact hebben.
- Locatie-anchors (Zaandam, Apeldoorn, Waddinxveen, Den Bosch, Gorinchem, Drachten, Groningen, Utrecht, Den Haag, Limburg, Amsterdam) hebben alle exact 35-38 refdomains en top DR=7 → dit is **één netwerk van lage-kwaliteit NL-directories**, waarschijnlijk allemaal `{stad}.{linknetwork}.nl`-patroon zoals we zagen in de broken-backlinks.

### 3c. Broken backlinks — snelle fix-kansen

25 top-DR broken backlinks geïnspecteerd (DR 52-76, uit 2019-2020). Wat live redirect-testen zegt:

| Oude URL | Huidige status | Fix |
|---|---|---|
| `/cursussen/autocad` | 404 | redirect toevoegen → `/cursussen` |
| `/cursussen/seniorencursus` | 404 | redirect → `/cursussen` |
| `/Outlook-cursussen/` | 404 na trailing-slash fix | redirect → `/cursussen/outlook` |
| `/flexibel/cursus-excel-basis` | 301 → `/cursussen/cursus-excel-basis` (200) | werkt al |
| `/flexibel/cursus-windows-7/` | 308 maar eindbestemming onbekend | cursus bestaat niet meer — redirect → `/cursussen` |
| `/overons/office-huisstijl` | 301 → `/over-ons` (200) | werkt al |
| `/overons/klassikaal-adobe` | 301 → `/over-ons` (200) | werkt al |
| `/locaties/almere/` | 200 | goed — geen fix nodig |

**Ontbrekende locatie-pagina's met backlinks:**
- `/locaties/waddinxveen` → **404** (terwijl 35 refdomains "Waddinxveen" als anchor hebben)
- `/locaties/zaandam` → 200 ✓
- `/locaties/den-bosch` → 200 ✓

**Opmerking:** de broken-backlinks komen voor ~95% van hetzelfde netwerk (`uwpagina.nl`, `allepaginas.nl`, `expertpagina.nl`, `linkgoed.nl`, `jouwbegin.nl`, `mijnzooi.nl`, `startbewijs.nl` etc. — allemaal NL-directory-link-farms uit 2019). Die links waren vrijwel zeker **gekocht destijds**. Repareren via redirect herstelt deels wat authority, maar Ahrefs zal deze bron-domeinen waarschijnlijk blijven depreciëren. Zie §5 voor strategische keuze.

## 4. DataForSEO Backlinks

⚠️ **Beperkt toegankelijk** — `backlinks_competitors` endpoint vereist aparte subscription op DataForSEO. `backlinks_summary` werkt wel maar eerder al bekend uit Ahrefs. Voor concurrent-gap-analyse zouden we de Backlinks-subscription moeten activeren in DataForSEO. Aanbeveling: **nu niet doen** — Ahrefs data is voldoende voor actionable advies, DataForSEO Backlinks activatie is pas zinvol voor automatische monitoring.

## 5. Concreet actieplan voor DR-herstel

### 🔴 Fase 1 (week 1-2): Bescherming & quick wins

**1. Disavow-file opstellen en indienen bij Google Search Console**

Maak `disavow.txt` met de duidelijk giftige refdomains:

```
# Spam/bought links disavow — 2026-04-23
domain:buybacklinks.agency
domain:pages.dev
domain:sa.com
domain:za.com
domain:itxoft.com
domain:startkabel.nl
# PBN/link-farm netwerk 2019-2020 (voorbeelden — lijst uitbreiden)
domain:uwpagina.nl
domain:allepaginas.nl
domain:expertpagina.nl
domain:linkgoed.nl
domain:linkspot.nl
domain:startjenu.nl
domain:jouwbegin.nl
domain:mijnzooi.nl
domain:startbewijs.nl
domain:benelinx.nl
domain:linkexplorer.nl
domain:linkkwartier.nl
domain:jouwlinkhier.nl
domain:gigago.nl
domain:favos.nl
domain:links.nl
domain:eigenstart.nl
domain:opzijnbest.nl
domain:belsign.be
domain:nvp-plaza.nl
domain:site-nl.nl
```

Upload via: **Google Search Console → Tools → Disavow links**. Effect: 4-12 weken (Google herziet alle gedisavowde links).

**2. Reparatie broken backlinks in middleware**

Ontbrekende redirects toevoegen in `src/middleware.ts`:

```ts
// Legacy URL redirects voor backlink-herstel
if (path === '/cursussen/autocad' || path === '/cursussen/autocad/') return '/cursussen'
if (path === '/cursussen/seniorencursus' || path === '/cursussen/seniorencursus/') return '/cursussen'
if (path.match(/^\/Outlook-cursussen\/?$/i)) return '/cursussen/outlook'
if (path.match(/^\/flexibel\/cursus-windows/i)) return '/cursussen'
```

Impact: ~15-20 backlinks recovered. Minimaal, maar gratis.

**3. Ontbrekende locatie-pagina's bouwen of redirecten**

`/locaties/waddinxveen` is 404 maar heeft 35 refdomains met "Waddinxveen" als anchor. Twee opties:
- **Optie A (best):** locatie-pagina bouwen (als CompuAct daar trainingen geeft)
- **Optie B:** redirect naar `/locaties` hub-pagina

Check via volledige anchor-lijst (niet alleen top 30) of er meer ontbrekende locaties zijn. Andere anchors die check nodig hebben: Apeldoorn, Gorinchem, Drachten, Groningen, Limburg.

### 🟠 Fase 2 (maand 2-4): Fundament versterken

**4. Stop alle betaalde / PBN-linkbuilding**

Geen `buybacklinks.agency`, geen sitewide footer-deals, geen UGC-spam. Nul nieuwe links van de patroon-netwerken.

**5. Anchor-diversificatie in nieuwe links**

Bij nieuwe linkbuilding **vermijd exact-match anchors** zoals "Excel Cursus" en "Cursus Excel". Gebruik:
- Merknaam: "Compu Act" / "Compu Act Opleidingen"
- URL: "computertraining.nl"
- Generiek: "hier", "meer informatie"
- Long-tail beschrijving: "cursussen bij Compu Act in Haarlem"

Huidige exact-match/branded ratio is gezond aan de branded-kant (~440 branded vs ~100 exact-match), maar de exact-match die er ligt is kwalitatief slecht. Nieuwe links mogen branded/URL-heavy zijn.

### 🟡 Fase 3 (maand 3-12): DR-herstel linkbuilding

Target: **50-80 nieuwe kwaliteits-refdomains in 12 maanden.** Daarmee is DR 10 → 18-22 realistisch.

**6. Categorieën voor organische linkbuilding (in volgorde van haalbaarheid):**

| Type | Voorbeelden | Opbrengst |
|---|---|---|
| **Lokale press & business** | Kamer van Koophandel locaties, lokale ondernemersverenigingen, MKB-directories per stad | 10-20 links, DR 20-50 |
| **Branche/HR-vakbladen** | PW., HR Praktijk, CHRO, Management Team — gastbijdrage over "Microsoft Office skills in 2026" | 3-5 links, DR 50-70 |
| **Klant-cases + wederkerigheid** | Klanten die case-study posten ("Wij hebben ons team Excel getraind bij…") | 5-10 links, DR 30-60 |
| **Tool/template hub** | Gratis Excel-templates (factuur, budget, planning) — mensen linken naar tools | 10-30 links, DR 10-80 |
| **Lokale Google My Business + directories** | GMB per locatie, Opleiding.nl, Springest (let op: nofollow), Eduseek | 5-15 links, gemengd DR |
| **Partners / leveranciers** | Microsoft Learning Partner badges, Certiport, Prove IT — "trainingspartners" lijsten | 2-5 links, DR 60-90 |

**7. Content-assets die links aantrekken**
- Statistieken-rapport ("Excel-vaardigheden in Nederlandse kantoren 2026") → vakbladen linken naar datasets
- Diepgaande how-to's die **uniek gedetailleerd** zijn (niet concurreren met YouTube tutorials)
- Interactieve tools (bv. Excel-skill-quiz, cursus-advies-calculator)

### 📊 Meten

**Maandelijkse check (1e van de maand):**
- Ahrefs DR
- Refdomains total + `is_spam: false` count
- Nieuwe/verloren refdomains
- Aantal anchors met is_spam=true

**Na Google disavow-indiening (~week 4):**
- Google Search Console: links sectie — bevestig disavow verwerkt
- Check of DR-bodem stabiliseert

### 🎯 Realistische verwachting

| Periode | DR | Refdomains (kwaliteit) |
|---|---:|---:|
| Nu (apr 2026) | 10 | 386 totaal, schatting ~120 gezond |
| +3 maanden | 10-11 | ~130 (disavow-effect genormaliseerd) |
| +6 maanden | 12-14 | ~160 |
| +12 maanden | 16-22 | ~200 |
| +24 maanden | 25-32 | ~280 |

**DR 30+ terugwinnen** (het niveau van vóór okt-2025) = **18-24 maanden realistisch doel**, en alléén met consistent organische linkbuilding. Sneller = alleen via kopen = dezelfde fout herhalen.

---

## 6. Wat je NIET moet doen

- **Geen disavow van álle 2019-2020 link-farm backlinks in één keer.** Sommige directory-links (bv. startpagina.nl DR 82) zijn nog oké. Groot-schalig disavowen kan tijdelijk ranking-impact hebben. Begin klein, voeg maandelijks toe.
- **Geen nieuwe linkbuilding-aanbieder vóór disavow is ingediend.** Eerst schoonmaken, dan bouwen — anders stopt de nieuwe leverancier je vervuilde netwerk op elkaar.
- **Geen paniek over DR 10.** Voor een lokale B2B-trainingsbedrijf is DR 20-30 genoeg om te concurreren (computrain.nl heeft 51 maar is breder). Focus op relevante kwaliteit, niet op DR-nummer als eindstation.

---

## 7. Open vragen voor vervolg

- **Wie heeft de 2019-2020 linkbuilding gedaan?** Als nog bekend: mogelijk een SEO-bureau dat destijds Excel-/Office-cursus-anchors heeft geplaatst. Contact voor opheldering of volledige lijst gekochte domeinen.
- **Waddinxveen-pagina status:** geeft CompuAct daar training? Zo ja → pagina bouwen + 35 refdomains redden.
- **Herhaling-cyclus zetten:** maandelijks broken-backlinks scan in Ahrefs; repareer binnen 1 week. Optioneel automatiseren via Ahrefs API + admin-dashboard.

---

*Rapport gegenereerd door Claude Code — data: Ahrefs + DataForSEO MCP + live URL-tests. Next review: na 4 weken disavow-indiening.*
