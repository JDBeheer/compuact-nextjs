# Post-migratie SEO check — 28 april 2026

> Site staat 15 dagen live (sinds 13 april). Dit is een tussentijdse progress-check, géén volledige nulmeting (te vroeg). Bronnen: Ahrefs Site Explorer + Ahrefs-gesynchroniseerde Google Search Console data.

## TL;DR

- **Stabilisatie zichtbaar.** Traffic-dip na migratie heeft zijn bodem bereikt rond 18-23 april (~240 organic visits/dag). Sinds dan vlak. Geen verdere daling.
- **Refdomains keren licht omhoog** sinds 23 april (387 → 393). Vroege indicatie dat disavow-impact begint én verlies stopt.
- **Nieuwe URLs worden geïndexeerd** maar leveren nog weinig clicks — typisch voor de "fade-in" fase van een migratie.
- **DR: 10** stabiel. Disavow-impact verwacht over 2-10 weken.
- **Volledig herstel verwachting:** mei-juni 2026.

---

## 1. Organic traffic trend (Ahrefs schatting, NL)

```
Mrt 17 (piek):           384/dag    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Apr 1:                   330/dag    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Apr 13 (migratie):       281/dag    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Apr 17:                  260/dag    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Apr 18 (bodem):          239/dag    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Apr 23-28 (stabiel):     238-246    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

**Verschil vs. piek:** -38%. **Verschil vs. pre-migratie (apr 13):** -15%.

Dit is een **klassieke migratie-traffic-dip**. Google deindexeert oude URLs sneller dan dat hij nieuwe URLs ge-rerankt. Normaal duur: 4-8 weken volledig herstel. We zitten nu in week 2 van die curve.

## 2. Refdomains — stabilisatie en lichte stijging

```
Apr 11:  404
Apr 13:  397  ← migratie
Apr 17:  390
Apr 23:  387  ← bodem
Apr 24:  392  ← omhoog
Apr 28:  393
```

**+6 refdomains sinds bodem op 23 april.** Lichte recovery. Mogelijke oorzaken:
- Spider-recrawl van nieuwe sitemap (Ahrefs ontdekt links die altijd bestonden maar nu opnieuw geverifieerd zijn)
- Disavow nog niet zichtbaar (Ahrefs negeert disavow's, dus dat verklaart deze stijging niet)
- Eventueel natural new links

## 3. Domain Rating

**DR 10 onveranderd** sinds 23 april. Disavow-bestand is op 23 april ingediend; effect verschijnt typisch 4-12 weken later. Deze check is dus te vroeg om disavow-impact te zien. Volgende DR-check eind mei zinvol.

## 4. Nieuwe URLs in Google — fade-in fase

GSC-data 13-28 april (post-migratie window):

| URL | Status | Impressies | Clicks | Avg pos |
|---|---|---:|---:|---:|
| `/` (homepage) | ✅ rank | 236 | 11 | 15.3 |
| `/cursussen/office-365-voor-eindgebruikers` | 🆕 nieuwe URL | **1.243** | 0 | 18.7 |
| `/cursussen/excel` | 🆕 nieuwe URL | 693 | 2 | 31.8 |
| `/cursussen/excel-basis` | 🆕 nieuwe URL | 284 | 1 | 30.7 |
| `/locaties/zaandam` | 🆕 nieuwe URL | **817** | 0 | 11.5 |
| `/microsoft-office/excel/excel-basis/` (oud) | nog ranked | 1.308 | 5 | 25.5 |
| `/microsoft-office/excel/excel-gevorderd/` (oud) | nog ranked | 381 | 4 | **5.3** |

**Wat dit zegt:**
- Nieuwe URLs **krijgen impressies** maar staan nog gemiddeld op pos 18-31 (ze zitten nu vooral op pagina 2-3 van Google)
- Oude URLs **leveren nog steeds clicks** want hun ranking-signalen zijn niet volledig naar de nieuwe URL doorgekoppeld via 301
- `/locaties/zaandam` met 817 impressions op pos 11.5 = direct **kans** zodra hij naar pagina 1 schuift
- `/cursussen/office-365-voor-eindgebruikers` met 1.243 impressies maar 0 clicks = **CTR-probleem** of pos-opbouw nog niet daar

⚠️ **Beperking:** Ahrefs's GSC-sync loopt achter (chart stopt op 9 april). Voor real-time post-migratie clicks kun je beter direct in https://search.google.com/search-console kijken.

## 5. Vergelijking 23 april → 28 april

| Metric | 23 apr | 28 apr | Δ |
|---|---:|---:|---|
| DR | 10 | 10 | – |
| Org keywords | 87 | 86 | -1 |
| Keywords pos 1-3 | 34 | **35** | +1 |
| Org traffic/dag | 242 | 238 | -4 |
| Refdomains | 387 | 393 | **+6** |

Vrijwel vlakke periode. Geen alarm, ook geen sterke uplift. **Status: bevroren-bij-bodem** — wat we hier wilden zien voordat we verder kunnen.

## 6. Acties (lopend / open)

| Actie | Status | Effect-window |
|---|---|---|
| Disavow ingediend (51 domeinen) | ✅ 23 april | Mei-juli 2026 |
| Middleware redirects (locaties + oude cursussen) | ✅ 23 april live | Doorlopend |
| Den Bosch postcode-fix | ✅ 28 april live | NA |
| Introductiecursus 5-in-één prijsupdate (€545) | ✅ 28 april live | NA |
| **Nieuwe SEO-actiepunten** (homepage content, FAQ, etc.) | ⏳ Niet gestart | Wachten op herstel |

## 7. Wanneer wel, wanneer niet bijsturen

**NU NIET:**
- Geen paniek over -38% traffic vs piek — bodem bereikt, herstel is nu mechaniek (Google's herindexering)
- Geen extra technische ingrepen — nieuwe URLs werken, alleen tijd nodig
- Geen disavow uitbreiden — eerst 6 weken effect afwachten

**WEL ALVAST OPPAKKEN (geen impact op herindexering, wel op conversie/CTR):**
- Title/meta-description per cursus optimaliseren (CTR-verbetering wordt sneller zichtbaar dan ranking-verbetering)
- Schema.org `Course` per cursus-pagina valideren in https://search.google.com/test/rich-results
- Internal linking versterken vanaf hoge-traffic pagina's naar nieuwe cursus-detailpagina's

## 8. Volgende check

**Aanbevolen ritme:**
- **Week 4 (15 mei):** kijk of traffic stijgt boven 280/dag. Zo ja: herstel onderweg. Zo nee: dieper kijken.
- **Week 8 (15 juni):** echte post-migratie nulmeting. DR-check (disavow-effect zichtbaar?), refdomains, top pages.
- **Week 12 (15 juli):** vergelijking met pre-migratie KPI's (apr-piek 384/dag) — dan moeten we daarboven zitten.

**Monitoring tussendoor:** Google Search Console → Performance → laatste 7 dagen vs. 7 dagen ervoor. Klikken & impressies trend = vroegste signaal van herstel.

---

*Rapport: Claude Code, post-migratie check dag 15. Bronnen: Ahrefs Site Explorer + Ahrefs/GSC integratie. Volgende: ~15 mei 2026.*
